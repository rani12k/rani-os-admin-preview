const build = 'CR-017-DEV-DATA-MOBILE-002';
const visualIdentity = 'ENV-VISUAL-001';
const stamp = Date.now();
const assetBase = new URL('.', document.currentScript ? document.currentScript.src : location.href);

const envProfiles = {
  DEV: { theme: 'light-blue', risk_level: 'low', config_version: 'ADMIN-CONFIG-ROLE-002', debug_tools_allowed: true, experimental_ui_allowed: true, role_profile: 'dev_sandbox', production_actions_allowed: false, rollback_target: 'none', banner: 'DEV environment — safe experimental review. No production actions.' },
  TEST: { theme: 'teal', risk_level: 'low', config_version: 'ADMIN-CONFIG-ROLE-002', debug_tools_allowed: true, experimental_ui_allowed: false, role_profile: 'test_validation', production_actions_allowed: false, rollback_target: 'DEV', banner: 'TEST environment — validation review with no writes.' },
  'PRE-PROD': { theme: 'violet', risk_level: 'elevated', config_version: 'ADMIN-CONFIG-ROLE-002', debug_tools_allowed: false, experimental_ui_allowed: false, role_profile: 'owner_release_candidate', production_actions_allowed: false, rollback_target: 'TEST', banner: 'PRE-PROD environment — release candidate review behind Owner Gate.' },
  PROD: { theme: 'graphite', risk_level: 'production-safe', risk_mode: 'safe', risk_color: 'none', config_version: 'ADMIN-CONFIG-ROLE-002', debug_tools_allowed: false, experimental_ui_allowed: false, role_profile: 'production_restricted', production_actions_allowed: false, rollback_target: 'CR-013', banner: 'PROD SAFE environment — stable production.' }
};
const defaultEnv = { environment: 'DEV', app: 'ADMIN_WEB', build, capability_mode: 'experimental', data_scope: 'public_sanitized', owner_gate_required: false, writes_allowed: false, feature_flags: { config_center: true, role_access: true, persistent_environment_indicator: true }, risk_mode: 'safe' };
const rawEnv = { ...defaultEnv, ...(window.RANI_ENV || {}) };
const env = { ...defaultEnv, ...(envProfiles[rawEnv.environment] || envProfiles.DEV), ...rawEnv };
if (env.environment === 'DEV') env.build = build;

let state = {}, managed = {}, artifacts = [], capmap = { capabilities: [] }, versions = { applications: [] }, cicd = { environments: [] };
let tab = 'control', appScope = 'ALL';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const plain = value => Object.values(value || {}).join(' ').toLowerCase();
const norm = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const inScope = app => appScope === 'ALL' || app === appScope;

function bucket(value) {
  const text = String(value || '').toLowerCase();
  if (/stuck|blocked|fail|rejected|not approved|not implemented|missing|rollback|no go|stop/.test(text)) return 'stuck';
  if (/pending|review|planned|deferred|in progress|candidate|not active|partial|warning/.test(text)) return 'open';
  if (/pass|solved|closed|complete|verified|validated|confirmed|active|canonical|baseline|ready/.test(text)) return 'done';
  return 'other';
}
function chip(type, label) {
  const icon = { done: '✅', open: '⚠️', stuck: '⛔', other: 'ℹ️' }[type] || 'ℹ️';
  const text = label || { done: 'PASS / Done', open: 'Warning / Review', stuck: 'Blocked / Stop', other: 'Info / N/A' }[type] || 'Info / N/A';
  return `<span class="chip ${type}">${icon} ${esc(text)}</span>`;
}
function capBucket(cap) {
  const readiness = parseInt(String(cap.readiness || '0').replace('%', ''), 10) || 0;
  return readiness >= 75 ? 'done' : readiness >= 40 ? 'open' : 'stuck';
}
function appOfName(name, layer = '') {
  const text = `${name} ${layer}`.toLowerCase();
  if (/pool|chemical|measurement|alert|maintenance/.test(text)) return 'RANI_POOL';
  if (/trading|trade|broker|market|visual context|decision|execution engine|data ingestion|system logs|research|model evolution/.test(text)) return 'RANI_TRADING';
  return 'RANI_OS';
}
function appOfCap(cap) { return cap.application || appOfName(cap.name || cap.capability, cap.layer); }
function appOfWork(row) {
  const text = plain(row);
  if (/pool|chemical|measurement|maintenance/.test(text)) return 'RANI_POOL';
  if (/trading|trade|broker|market|ibkr|verdict|execution|evidence/.test(text)) return 'RANI_TRADING';
  return 'RANI_OS';
}
function appOfArtifact(row) {
  const text = plain(row);
  if (/pool|chemical|maintenance/.test(text)) return 'RANI_POOL';
  if (/trading|trade|broker|market|visual|pine|gpt_decision|gpt_brain|execution/.test(text)) return 'RANI_TRADING';
  return 'RANI_OS';
}
function workRows() { return managed.register_rows || []; }
function parseArtifacts(markdown) {
  return String(markdown || '').split('\n')
    .filter(line => line.startsWith('| ') && !line.includes('---') && !line.includes('Artifact ID'))
    .map(line => {
      const cells = line.split('|').slice(1, -1).map(cell => cell.trim().replaceAll('`', ''));
      return { id: cells[0], name: cells[1], location: cells[2], status: cells[3], domain: cells[4], initiative: cells[5] };
    })
    .filter(item => item.id);
}
function capabilityUniverse() {
  const roadmap = (state.capabilities || []).map(cap => ({ name: cap.capability, source: 'Capability Roadmap', readiness: cap.readiness, status: cap.status, layer: cap.layer, priority: cap.priority, next: cap.next }));
  const mapped = (capmap.capabilities || []).map(cap => ({ ...cap, source: 'Explicit Capability Map', application: appOfCap(cap) }));
  const pool = [{ name: 'POOL_CONTROLLER Framework', source: 'Application Boundary', readiness: '0%', status: 'Framework / Not Implemented', layer: 'Application / Pool', priority: 'P3', next_safe_action: 'Do not implement until owner approves', capability_id: 'CAP-POOL-FRAMEWORK', application: 'RANI_POOL' }];
  const merged = new Map();
  [...roadmap, ...mapped, ...pool].forEach(cap => {
    const key = norm(cap.name);
    merged.set(key, { ...(merged.get(key) || {}), ...cap, application: cap.application || appOfName(cap.name, cap.layer) });
  });
  return [...merged.values()];
}
function model() {
  const records = workRows();
  const byId = id => records.find(row => String(row.id || '') === id);
  const matchArtifacts = terms => artifacts.filter(item => (terms || []).some(term => plain(item).includes(String(term).toLowerCase())));
  return (capmap.capabilities || []).map(cap => {
    const app = appOfCap(cap);
    return {
      c: { ...cap, application: app },
      known: (cap.known_work_ids || []).map(byId).filter(Boolean),
      blockers: (cap.blocking_bug_ids || []).map(byId).filter(Boolean),
      candidate: (cap.candidate_ids || []).map(byId).filter(Boolean),
      arts: matchArtifacts(cap.artifact_queries || []),
      missing: cap.missing_work || [],
      gates: cap.owner_gates || []
    };
  }).filter(item => inScope(item.c.application));
}
function stats() {
  const universe = capabilityUniverse().filter(cap => inScope(cap.application));
  const mapped = model();
  return {
    universe,
    mapped,
    mappedLabel: `${mapped.length}/${universe.length}`,
    unmapped: universe.length - mapped.length,
    work: workRows().filter(row => inScope(appOfWork(row))).length,
    ownerGates: mapped.reduce((sum, item) => sum + item.gates.length, 0),
    artifacts: artifacts.filter(row => inScope(appOfArtifact(row))).length
  };
}

function table(rows, columns) {
  return `<div class="note table-count">Records in this table: ${(rows || []).length}</div><div class="tablewrap"><table><thead><tr>${columns.map(([label]) => `<th>${esc(label)}</th>`).join('')}</tr></thead><tbody>${(rows || []).map(row => `<tr>${columns.map(([, key]) => `<td>${row[key] ?? ''}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${columns.length}" class="bad">No matching rows</td></tr>`}</tbody></table></div>`;
}
function cards(rows, fields, label) {
  return `<div class="mobile-cardwrap" aria-label="${esc(label)}">${(rows || []).map(row => `<article class="mobile-card">${fields.map(([name, key]) => `<div class="mobile-field"><div class="mobile-label">${esc(name)}</div><div class="mobile-value">${row[key] ?? ''}</div></div>`).join('')}</article>`).join('') || `<div class="mobile-card bad">No matching rows</div>`}</div>`;
}
function responsive(rows, columns, fields, label) { return `<div class="responsive-records">${table(rows, columns)}${cards(rows, fields, label)}</div>`; }
function scopeNote(total, shown, label) {
  return `<div class="note table-count">${esc(label)} shown: ${shown} of ${total}. ${appScope === 'ALL' ? 'Scope ALL is active, so no app filter is hiding records.' : `Scope ${esc(appScope)} is active; switch to ALL to see every available record.`}</div>`;
}
function missingSourceCard(file) {
  return `<div class="mobile-card bad"><div class="mobile-field"><div class="mobile-label">Status</div><div class="mobile-value">DATA SOURCE MISSING</div></div><div class="mobile-field"><div class="mobile-label">Expected source</div><div class="mobile-value">${esc(file)}</div></div><div class="mobile-field"><div class="mobile-label">Next action</div><div class="mobile-value">Export reports from RANI_OS private source of truth.</div></div></div>`;
}

function capTable(items) {
  const rows = (items || []).map(item => ({ App: esc(item.c.application), Status: chip(capBucket(item.c), item.c.readiness || item.c.status), Priority: esc(item.c.priority), Capability: esc(item.c.name), Confidence: esc(item.c.mapping_confidence || ''), Blockers: String(item.blockers.length), Gates: String(item.gates.length), Missing: String(item.missing.length), Next: esc(item.c.next_safe_action || item.c.next || '') }));
  return responsive(rows, [['App','App'], ['Status','Status'], ['Priority','Priority'], ['Capability','Capability'], ['Confidence','Confidence'], ['Blockers','Blockers'], ['Owner Gates','Gates'], ['Missing','Missing'], ['Next','Next']], [['Capability','Capability'], ['App','App'], ['Status','Status'], ['Priority','Priority'], ['Confidence','Confidence'], ['Blockers','Blockers'], ['Owner Gates','Gates'], ['Missing','Missing'], ['Next','Next']], 'Capability records');
}
function workTable(rows) {
  const total = (rows || []).length;
  const visible = (rows || []).filter(row => inScope(appOfWork(row))).map(row => ({ App: esc(appOfWork(row)), State: chip(bucket(`${row.lifecycle} ${row.state}`), bucket(`${row.lifecycle} ${row.state}`)), ID: esc(row.id), Title: esc(row.title), Category: esc(row.category), Lifecycle: esc(row.lifecycle || ''), Status: esc(row.state || row.status || ''), Source: esc(row.source || row.repo_basis || 'managed-work.json') }));
  return scopeNote(total, visible.length, 'Work records') + responsive(visible, [['App','App'], ['State','State'], ['ID','ID'], ['Title','Title'], ['Category','Category'], ['Lifecycle','Lifecycle'], ['Status','Status'], ['Source','Source']], [['ID','ID'], ['Title','Title'], ['App','App'], ['Category','Category'], ['Lifecycle / State','Lifecycle'], ['Status','Status'], ['Source','Source']], 'Work Records');
}
function artifactTable(rows) {
  const total = (rows || []).length;
  const visible = (rows || []).filter(row => inScope(appOfArtifact(row))).map(row => ({ App: esc(appOfArtifact(row)), State: chip(bucket(row.status), bucket(row.status)), ID: esc(row.id), Name: esc(row.name), Location: esc(row.location), Status: esc(row.status), Domain: esc(row.domain), Initiative: esc(row.initiative) }));
  return scopeNote(total, visible.length, 'Artifacts') + responsive(visible, [['App','App'], ['State','State'], ['ID','ID'], ['Name','Name'], ['Location','Location'], ['Status','Status'], ['Domain','Domain'], ['Initiative','Initiative']], [['ID','ID'], ['Name','Name'], ['App','App'], ['Status','Status'], ['Domain','Domain'], ['Location','Location']], 'Artifacts');
}

function theme() { return String(env.theme || envProfiles[env.environment]?.theme || 'light-blue').toLowerCase().replace(/[^a-z-]/g, ''); }
function riskMode() { return String(env.risk_mode || 'safe'); }
function envRows() { return [['Environment', env.environment], ['App', env.app], ['Build', env.build], ['Capability Mode', env.capability_mode], ['Risk Mode', riskMode()], ['Writes Allowed', env.writes_allowed ? 'Yes' : 'No'], ['Owner Gate Required', env.owner_gate_required ? 'Yes' : 'No']]; }
function envFrame() { const t = theme(); return `<div class="env-frame-edge env-frame-top ${t}"></div><div class="env-frame-edge env-frame-right ${t}"></div><div class="env-frame-edge env-frame-bottom ${t}"></div><div class="env-frame-edge env-frame-left ${t}"></div><div class="env-frame-label ${t}">ENV: ${esc(env.environment)}</div>`; }
function envBar() {
  const compact = [['ENV', env.environment], ['APP', env.app], ['BUILD', env.build], ['MODE', env.capability_mode]];
  const details = envRows();
  return `<div class="env-bar ${theme()}" role="banner"><div class="env-bar-title">${esc(env.environment)} Environment Indicator</div><div class="env-bar-grid env-bar-compact">${compact.map(([k,v]) => `<div class="env-bar-item"><div class="mobile-label">${esc(k)}</div><div class="env-bar-value">${esc(v)}</div></div>`).join('')}</div><details class="env-details"><summary>Environment details</summary><div class="env-bar-grid">${details.map(([k,v]) => `<div class="env-bar-item"><div class="mobile-label">${esc(k)}</div><div class="env-bar-value">${esc(v)}</div></div>`).join('')}</div></details></div>`;
}
function envCenter() { return `<section class="env-center ${theme()}"><h2>Environment Center</h2><div class="env-grid">${envRows().map(([k,v]) => `<div class="env-item"><div class="mobile-label">${esc(k)}</div><div class="env-value">${esc(v)}</div></div>`).join('')}</div><div class="env-banner">${esc(env.banner)}</div></section>`; }
function appSwitch() {
  const universe = capabilityUniverse();
  const counts = { RANI_OS: universe.filter(cap => cap.application === 'RANI_OS').length, RANI_TRADING: universe.filter(cap => cap.application === 'RANI_TRADING').length, RANI_POOL: universe.filter(cap => cap.application === 'RANI_POOL').length };
  return `<div class="apps"><button class="appbtn ${appScope === 'ALL' ? 'active' : ''}" data-app="ALL">🌐 ALL</button><button class="appbtn ${appScope === 'RANI_OS' ? 'active' : ''}" data-app="RANI_OS">🧠 RANI_OS (${counts.RANI_OS})</button><button class="appbtn ${appScope === 'RANI_TRADING' ? 'active' : ''}" data-app="RANI_TRADING">📈 RANI_TRADING (${counts.RANI_TRADING})</button><button class="appbtn ${appScope === 'RANI_POOL' ? 'active' : ''}" data-app="RANI_POOL">🏊 RANI_POOL (${counts.RANI_POOL})</button></div>`;
}
function counters() {
  const s = stats();
  const items = [['control', s.mappedLabel, 'Mapped / Total'], ['unmapped', s.unmapped, 'Unmapped'], ['work', s.work, 'Work Records'], ['owner', s.ownerGates, 'Owner Gates'], ['artifacts', s.artifacts, 'Artifacts']];
  return `<div class="counters counters-compact">${items.map(([nav, num, label]) => `<button class="counter" data-nav="${nav}"><div class="num">${esc(num)}</div><div class="label">${esc(label)}</div></button>`).join('')}</div>`;
}
function layout(content) {
  document.body.innerHTML = `${envFrame()}${envBar()}<header><h1>RANI OS Admin</h1><div class="sub">Build ${esc(build)} · DEV data coverage + mobile recovery build · Visual identity: ${esc(visualIdentity)}</div>${appSwitch()}<div class="tabs">${[['control','Control Room'],['mapping','Mapping Coverage'],['priority','Priority Board'],['capmap','Capability Map'],['unmapped','Unmapped'],['owner','Owner Gates'],['work','Work Records'],['artifacts','Artifacts'],['versions','Version Center'],['config','Config Center'],['roles','Role / Access'],['cicd','CI/CD'],['reports','Reports']].map(([key,label]) => `<button data-tab="${key}" class="${tab === key ? 'active' : ''}">${label}</button>`).join('')}</div><div class="legend">${chip('done','PASS / Done')} ${chip('open','Warning / Review')} ${chip('stuck','Blocked / Stop')} ${chip('other','Info / N/A')}</div></header><main>${envCenter()}${content}</main>`;
  wire();
}

function control() {
  const s = stats();
  return `<section><h2>Control Room</h2><div class="note">DEV recovery build. Data coverage and mobile readability are under review in DEV only.</div><div class="kpis kpis-clean"><div class="kpi"><div class="num">${esc(s.mappedLabel)}</div><div>Mapped / Total</div></div><div class="kpi"><div class="num">${esc(s.unmapped)}</div><div>Unmapped</div></div><div class="kpi"><div class="num">${esc(s.work)}</div><div>Work Records</div></div><div class="kpi"><div class="num">${esc(s.ownerGates)}</div><div>Owner Gates</div></div><div class="kpi"><div class="num">${esc(s.artifacts)}</div><div>Artifacts</div></div></div><div class="mini context-list"><div><strong>Source of Truth:</strong> ${esc(state.system_status?.source_of_truth || '')}</div><div><strong>Projection Status:</strong> ${esc(state.system_status?.projection_status || '')}</div><div><strong>Active Work:</strong> ${esc(state.current_work_item?.active_work_item || '')}</div><div><strong>Build:</strong> ${esc(build)}</div><div><strong>Scope:</strong> ${esc(appScope)}</div></div></section>`;
}
function mapping() { const universe = capabilityUniverse().filter(cap => inScope(cap.application)); const mappedNames = new Set(model().map(item => norm(item.c.name))); return `<section><h2>Mapping Coverage</h2>${table(universe.map(cap => ({ App: esc(cap.application), Coverage: mappedNames.has(norm(cap.name)) ? chip('done','Mapped') : chip('open','Unmapped'), Capability: esc(cap.name), Readiness: esc(cap.readiness || ''), Status: esc(cap.status || ''), Next: esc(cap.next_safe_action || cap.next || '') })), [['App','App'], ['Coverage','Coverage'], ['Capability','Capability'], ['Readiness','Readiness'], ['Status','Status'], ['Next','Next']])}</section>`; }
function priority() { return `<section><h2>Priority Board</h2>${capTable(model())}</section>`; }
function capmapView() { return `<section><h2>Capability Map</h2>${capTable(model())}</section>`; }
function unmapped() { const keys = new Set((capmap.capabilities || []).map(cap => norm(cap.name))); const rows = capabilityUniverse().filter(cap => !keys.has(norm(cap.name)) && inScope(cap.application)).map(cap => ({ c: { ...cap, mapping_confidence: 'Unmapped', next_safe_action: 'Create capability-map entry' }, blockers: [], gates: [], missing: [] })); return `<section><h2>Unmapped Capabilities</h2>${capTable(rows)}</section>`; }
function owner() { let rows = []; model().forEach(item => item.gates.forEach(gate => rows.push({ App: esc(item.c.application), Cap: esc(item.c.name), Gate: esc(gate), Status: chip('open','Owner Gate'), Next: esc(item.c.next_safe_action || '') }))); return `<section><h2>Owner Gates</h2>${table(rows, [['App','App'], ['Capability','Cap'], ['Gate','Gate'], ['Status','Status'], ['Next','Next']])}</section>`; }
function workView() { return `<section><h2>Work Records</h2><div class="note">Source: managed-work.json. Counts show total available records and records shown for the active app scope.</div>${workTable(workRows())}</section>`; }
function artView() { return `<section><h2>Artifacts</h2><div class="note">Source: artifact-register-public.md. Counts show total available artifacts and artifacts shown for the active app scope.</div>${artifactTable(artifacts)}</section>`; }
function versionCenter() { const rows = (versions.applications || []).filter(item => inScope(item.app) || item.app === 'ADMIN_WEB').map(item => ({ App: esc(item.app), Current: esc(item.current_stable), Latest: esc(item.latest_build), Status: esc(item.status), Health: chip(bucket(item.health), item.health), Meaning: esc(item.plain_language), Gate: esc(item.owner_gate), Next: esc(item.next_candidate) })); return `<section><h2>Version Center</h2>${responsive(rows, [['App','App'], ['Current Stable','Current'], ['Latest Build','Latest'], ['Status','Status'], ['Health','Health'], ['Meaning','Meaning'], ['Owner Gate','Gate'], ['Next','Next']], [['App','App'], ['Current Stable','Current'], ['Latest Build','Latest'], ['Status','Status'], ['Health','Health'], ['Meaning','Meaning'], ['Owner Gate','Gate'], ['Next','Next']], 'Version Center')}</section>`; }
function cicdView() { const rows = (cicd.environments || []).map(item => ({ Environment: esc(item.name), Status: esc(item.status), Health: chip(bucket(item.health), item.health), Purpose: esc(item.purpose), Promotion: esc(item.promotion_rule), Rollback: esc(item.rollback_rule), Gap: esc(cicd.current_gap), Next: esc(cicd.next_safe_action) })); return `<section><h2>CI/CD</h2>${responsive(rows, [['Environment','Environment'], ['Status','Status'], ['Health','Health'], ['Purpose','Purpose'], ['Promotion','Promotion'], ['Rollback','Rollback'], ['Current Gap','Gap'], ['Next','Next']], [['Environment','Environment'], ['Status','Status'], ['Health','Health'], ['Purpose','Purpose'], ['Promotion','Promotion'], ['Rollback','Rollback'], ['Current Gap','Gap'], ['Next','Next']], 'CI/CD')}</section>`; }
function configCenter() { const rows = Object.entries(env).filter(([, value]) => typeof value !== 'object').map(([K, V]) => ({ K: esc(K), V: esc(V) })); return `<section><h2>Config Center</h2><div class="config-rule">Config selects and constrains existing capabilities. New UI or logic requires a new build.</div>${table(rows, [['Config Field','K'], ['Active Value','V']])}</section>`; }
function roleAccess() { const rows = [{ Role: 'System Admin', View: 'Environment status, config metadata, CI/CD, capability maps, work records, artifacts, version state, owner gate status.', Manage: 'Non-production admin workflows only when active config allows.', NoBypass: 'Does not bypass Owner Gate or production restrictions.' }, { Role: 'User / Operator', View: 'Published dashboard status and scoped records.', Manage: 'Routine review/navigation only.', NoBypass: 'May not bypass Owner Gate, isolation, or capability constraints.' }, { Role: 'Owner Gate', View: 'Candidate, production, rollback, and gated action context.', Manage: 'Explicit approval or rejection of gated actions.', NoBypass: 'Must still follow build pinning, isolation, and rollback constraints.' }]; return `<section><h2>Role / Access</h2>${table(rows, [['Role','Role'], ['May View','View'], ['May Manage','Manage'], ['May Not Bypass','NoBypass']])}</section>`; }
function reports() { return `<section><h2>Reports</h2><div class="note">DEV report projection audit: no dedicated report JSON or MD data source exists in the public Admin data bundle yet. Capability, work, artifact, version, and CI/CD data are available in their own tabs.</div>${missingSourceCard('reports-public.json or reports-public.md')}</section>`; }
function view() { return tab === 'mapping' ? mapping() : tab === 'priority' ? priority() : tab === 'capmap' ? capmapView() : tab === 'unmapped' ? unmapped() : tab === 'owner' ? owner() : tab === 'work' ? workView() : tab === 'artifacts' ? artView() : tab === 'versions' ? versionCenter() : tab === 'config' ? configCenter() : tab === 'roles' ? roleAccess() : tab === 'cicd' ? cicdView() : tab === 'reports' ? reports() : control(); }
function render() { layout(view()); }
function wire() { document.querySelectorAll('[data-app]').forEach(button => button.onclick = () => { appScope = button.dataset.app; render(); }); document.querySelectorAll('[data-tab]').forEach(button => button.onclick = () => { tab = button.dataset.tab; render(); }); document.querySelectorAll('[data-nav]').forEach(button => button.onclick = () => { tab = button.dataset.nav === 'work' ? 'work' : button.dataset.nav === 'artifacts' ? 'artifacts' : button.dataset.nav === 'owner' ? 'owner' : button.dataset.nav === 'unmapped' ? 'unmapped' : 'control'; render(); }); }

function css() {
  document.head.innerHTML = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RANI OS Admin DEV</title><style>:root{--bg:#07111f;--card:#0d1b2e;--card2:#11243a;--text:#e8eef7;--muted:#9fb0c7;--border:#223855;--blue:#60a5fa;--green:#36d399;--yellow:#fbbf24;--red:#fb7185;--gray:#94a3b8}*{box-sizing:border-box}html,body{margin:0;width:100%;max-width:100%;overflow-x:hidden;background:var(--bg);color:var(--text);font-family:Arial,sans-serif;line-height:1.45}header,main{padding:12px;display:grid;gap:12px}h1,h2{margin:0 0 8px}.sub,.note,.label{color:var(--muted);font-size:13px}.tabs,.apps,.counters,.kpis,.env-bar-grid,.env-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px}.tabs button,.appbtn,.counter,.kpi,.env-bar-item,.env-item,section,.mobile-card,.mini{border:1px solid var(--border);border-radius:14px;background:var(--card);color:var(--text);padding:12px;min-width:0}.tabs button,.appbtn,.counter{cursor:pointer;text-align:left;background:var(--card2)}button.active,.appbtn.active{background:var(--blue);color:#07111f;font-weight:800}.num{font-size:22px;font-weight:800;color:var(--blue);direction:ltr}.chip{display:inline-block;padding:4px 7px;border-radius:999px;font-size:12px}.chip.done{background:rgba(54,211,153,.18);color:var(--green);border:1px solid rgba(54,211,153,.5)}.chip.open{background:rgba(251,191,36,.18);color:var(--yellow);border:1px solid rgba(251,191,36,.5)}.chip.stuck{background:rgba(251,113,133,.18);color:var(--red);border:1px solid rgba(251,113,133,.5)}.chip.other{background:rgba(148,163,184,.18);color:var(--gray);border:1px solid rgba(148,163,184,.5)}.tablewrap{overflow-x:auto;border:1px solid var(--border);border-radius:12px;margin-top:8px}table{width:100%;border-collapse:collapse;direction:ltr;text-align:left}th,td{padding:8px;border-bottom:1px solid rgba(255,255,255,.08);vertical-align:top;overflow-wrap:anywhere}.mobile-cardwrap{display:none}.mobile-card{display:grid;gap:10px;background:var(--card2);margin-top:8px}.mobile-label{text-transform:uppercase;letter-spacing:.05em;color:var(--muted);font-size:11px;font-weight:800}.mobile-value{overflow-wrap:anywhere}.bad{color:var(--red)}.env-frame-edge{position:fixed;z-index:9999;pointer-events:none;background:#38bdf8}.env-frame-top,.env-frame-bottom{left:0;right:0;height:4px}.env-frame-left,.env-frame-right{top:0;bottom:0;width:4px}.env-frame-top{top:0}.env-frame-right{right:0}.env-frame-bottom{bottom:0}.env-frame-left{left:0}.env-frame-label{position:fixed;right:8px;bottom:8px;z-index:9999;background:#e0f2fe;color:#082f49;border:1px solid #38bdf8;border-radius:8px;padding:5px 8px;font-size:11px;font-weight:900}.env-bar{position:sticky;top:0;z-index:50;padding:10px 12px;background:linear-gradient(90deg,#e0f2fe,#7dd3fc);color:#082f49;border-bottom:2px solid #38bdf8}.env-bar .mobile-label{color:#082f49;opacity:.75}.env-bar-value{font-weight:900;overflow-wrap:anywhere}.env-details{margin-top:6px}.env-details summary{font-weight:900;cursor:pointer}.env-center{background:linear-gradient(135deg,rgba(186,230,253,.18),rgba(14,165,233,.08));border-color:#38bdf8}.config-rule{background:rgba(96,165,250,.14);border:1px solid rgba(96,165,250,.5);border-radius:12px;padding:10px;font-weight:800}.legend{display:flex;flex-wrap:wrap;gap:6px}.context-list{display:grid;gap:8px;margin-top:12px}.kpis-clean{grid-template-columns:repeat(auto-fit,minmax(135px,1fr))}@media(max-width:820px){header,main{padding:10px}.tabs,.apps{grid-template-columns:1fr 1fr}.kpis,.env-grid{grid-template-columns:1fr}.env-bar-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.tablewrap{display:none}.responsive-records .mobile-cardwrap{display:grid;grid-template-columns:1fr;gap:10px}.mobile-cardwrap{width:100%;max-width:100%}.mobile-card{font-size:15px}.env-bar{padding:7px 10px}.env-bar-title{font-size:14px;font-weight:900}.env-bar-item{padding:7px}.env-bar-value{font-size:13px}.sub,.note{font-size:14px}}@media(max-width:420px){.tabs,.apps,.env-bar-grid{grid-template-columns:1fr 1fr}}</style>`;
}
async function boot() {
  css();
  const suffix = `cr017-dev-data-mobile-002-${stamp}`;
  const [stateJson, managedJson, artifactMarkdown, capabilityJson, versionJson, cicdJson] = await Promise.all([
    fetch(new URL(`state.json?b=${suffix}`, assetBase), { cache: 'no-store' }).then(response => response.json()),
    fetch(new URL(`managed-work.json?b=${suffix}`, assetBase), { cache: 'no-store' }).then(response => response.json()),
    fetch(new URL(`artifact-register-public.md?b=${suffix}`, assetBase), { cache: 'no-store' }).then(response => response.text()),
    fetch(new URL(`capability-map.json?b=${suffix}`, assetBase), { cache: 'no-store' }).then(response => response.json()),
    fetch(new URL(`version-center.json?b=${suffix}`, assetBase), { cache: 'no-store' }).then(response => response.json()),
    fetch(new URL(`cicd-environments.json?b=${suffix}`, assetBase), { cache: 'no-store' }).then(response => response.json())
  ]);
  state = stateJson;
  managed = managedJson;
  artifacts = parseArtifacts(artifactMarkdown);
  capmap = capabilityJson;
  versions = versionJson;
  cicd = cicdJson;
  render();
}
boot().catch(error => { document.body.innerHTML = `<main><section><h2 class="bad">Could not load safe dashboard data</h2><div>${esc(error.message || error)}</div></section></main>`; });
