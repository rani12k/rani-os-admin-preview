const build = '2026-07-03-CR-004';
const stamp = Date.now();
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const row = (k,v) => `<div class='row'><div class='label'>${esc(k)}</div><div class='value'>${esc(v)}</div></div>`;
const table = (list,cols) => `<table><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${(list||[]).map(r=>`<tr>${cols.map(c=>`<td>${r[c] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

function bucket(text){
  const t=String(text||'').toLowerCase();
  if(t.includes('blocked')||t.includes('stuck')||t.includes('fail')||t.includes('failed')||t.includes('rejected')||t.includes('not approved')||t.includes('not implemented')||t.includes('not available')||t.includes('unavailable')||t.includes('missing'))return 'stuck';
  if(t.includes('not active')||t.includes('deferred')||t.includes('pending')||t.includes('in progress')||t.includes('draft')||t.includes('candidate')||t.includes('not generated')||t.includes('review'))return 'open';
  if(t.includes('behavior pass')||t.includes('artifact pass')||t.includes('closed')||t.includes('complete')||t.includes('verified')||t.includes('validated')||t==='active'||t.includes('canonical')||t.includes('baseline'))return 'done';
  return 'other';
}
function badge(b){const label={done:'בוצע',open:'פתוח',stuck:'תקוע',other:'אחר'}[b]||b;return `<span class='badge ${b}'>${label}</span>`}
function pct(done,total){return total?`${Math.round(done*100/total)}%`:'0%'}
function parseArtifacts(md){return md.split('\n').filter(l=>l.startsWith('| ')&&!l.includes('---')&&!l.includes('Artifact ID')).map(l=>{const p=l.split('|').slice(1,-1).map(x=>x.trim().replaceAll('`',''));return {id:p[0],name:p[1],location:p[2],status:p[3],domain:p[4],initiative:p[5]}}).filter(r=>r.id)}
function progressRow(name,total,done,open,stuck,basis,link){return {Name:esc(name),Done:`${done} / ${total}`,Percent:pct(done,total),Open:String(open),Stuck:String(stuck),Basis:esc(basis),Drilldown:`<a class='drill' href='${link}'>פתח רשימה</a>`}}

function injectStyle(){
  const css = `:root{--bg:#07111f;--card:#0d1b2e;--card2:#11243a;--text:#e8eef7;--muted:#9fb0c7;--border:#223855;--blue:#60a5fa;--green:#36d399;--yellow:#fbbf24;--red:#fb7185;--gray:#94a3b8}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,sans-serif;line-height:1.4}header{padding:16px;background:#08162a;border-bottom:1px solid var(--border)}h1{margin:0 0 4px;font-size:24px}.sub{color:var(--muted);font-size:14px}.nav{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.nav a{padding:8px 11px;border:1px solid var(--border);border-radius:999px;background:var(--card2);color:var(--text);text-decoration:none;font-size:13px}main{padding:14px;display:grid;gap:12px;grid-template-columns:repeat(12,1fr)}section{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px}.span12{grid-column:span 12}.span8{grid-column:span 8}.span6{grid-column:span 6}.span4{grid-column:span 4}.kpis{display:grid;grid-template-columns:repeat(8,1fr);gap:8px}.kpi,.tile{background:var(--card2);border:1px solid var(--border);border-radius:12px;padding:10px}.kpi .num{font-weight:bold;font-size:20px;color:var(--blue);direction:ltr;text-align:left}.kpi .txt{font-size:12px;color:var(--muted)}h2{margin:0 0 10px;font-size:17px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.tile b{display:block;color:var(--blue);margin-bottom:5px}.small{font-size:13px;color:var(--muted)}.row{display:grid;grid-template-columns:150px 1fr;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.06)}.label{color:var(--muted)}.value{direction:ltr;text-align:left;overflow-wrap:anywhere}.bad{color:var(--red)}table{width:100%;border-collapse:collapse;direction:ltr;text-align:left;min-width:820px}th,td{padding:8px;border-bottom:1px solid rgba(255,255,255,.08);vertical-align:top}th{color:var(--muted);font-weight:normal;background:#0b1a2d}.tablewrap{overflow:auto;border:1px solid var(--border);border-radius:12px}.badge{display:inline-block;padding:4px 8px;border-radius:999px;font-size:12px}.badge.done{background:rgba(54,211,153,.18);color:var(--green);border:1px solid rgba(54,211,153,.5)}.badge.open{background:rgba(251,191,36,.18);color:var(--yellow);border:1px solid rgba(251,191,36,.5)}.badge.stuck{background:rgba(251,113,133,.18);color:var(--red);border:1px solid rgba(251,113,133,.5)}.badge.other{background:rgba(148,163,184,.18);color:var(--gray);border:1px solid rgba(148,163,184,.5)}.drill{color:var(--blue);text-decoration:none;font-weight:bold}.cta{display:inline-block;margin-top:8px;padding:9px 12px;border-radius:10px;background:var(--blue);color:#07111f;text-decoration:none;font-weight:bold}@media(max-width:820px){header{padding:12px}h1{font-size:19px}.sub{font-size:12px}.nav{overflow-x:auto;flex-wrap:nowrap}.nav a{white-space:nowrap}main{padding:8px;grid-template-columns:1fr}.span12,.span8,.span6,.span4{grid-column:1}.kpis{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}.row{grid-template-columns:1fr}.value{text-align:right;direction:rtl}table{font-size:12px;min-width:760px}}`;
  document.head.innerHTML = `<meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>RANI OS Admin Control Room</title><style>${css}</style>`;
}

function shell(){
  document.body.innerHTML = `<header><h1>RANI OS Admin Control Room</h1><div class='sub'>Build ${build} · חדר בקרה ראשי · Progress Analysis</div><nav class='nav'><a href='index.html?v=${stamp}'>Control Room</a><a href='work-register.html?v=${stamp}'>Work Register</a><a href='#progress'>Progress</a><a href='#gate'>Owner Gate</a><a href='#lanes'>Lanes</a></nav></header><main><section class='span12'><h2>מספרים כמותיים</h2><div class='kpis' id='top_kpis'><div class='bad'>Loading KPIs...</div></div></section><section class='span12' id='progress'><h2>Progress Analysis — התקדמות לפי סוג רשומה</h2><div class='tablewrap'><div id='progress_table'></div></div></section><section class='span8'><h2>מצב מערכת עכשיו</h2><div id='control_state'></div></section><section class='span4' id='gate'><h2>Owner Gate</h2><div id='owner_gate'></div></section><section class='span12'><h2>Work Streams</h2><div class='grid' id='work_streams'></div></section><section class='span6' id='lanes'><h2>Lane Status</h2><div id='lane_status'></div></section><section class='span6' id='health'><h2>System Health</h2><div id='system_health'></div></section><section class='span12'><h2>Next Action</h2><div id='next_action'></div><a class='cta' href='work-register.html?v=${stamp}'>פתח Work Register מלא + חיפוש</a></section></main>`;
}

async function boot(){
  injectStyle();
  shell();
  try{
    const [state, managed, artifactText] = await Promise.all([
      fetch(`state.json?v=${stamp}`, {cache:'no-store'}).then(r=>r.json()),
      fetch(`managed-work.json?v=${stamp}`, {cache:'no-store'}).then(r=>r.json()),
      fetch(`artifact-register-public.md?v=${stamp}`, {cache:'no-store'}).then(r=>r.text())
    ]);
    const workRows = managed.register_rows || [];
    const artifacts = parseArtifacts(artifactText);
    const capabilities = state.capabilities || [];
    const capDone = capabilities.filter(c=>parseInt(String(c.readiness||'0').replace('%',''),10)>=75).length;
    const workDone = workRows.filter(r=>bucket(`${r.lifecycle} ${r.state}`)==='done').length;
    const workOpen = workRows.filter(r=>bucket(`${r.lifecycle} ${r.state}`)==='open').length;
    const workStuck = workRows.filter(r=>bucket(`${r.lifecycle} ${r.state}`)==='stuck').length;
    const bugs = workRows.filter(r=>String(r.id||'').startsWith('BUG-'));
    const bugDone = bugs.filter(r=>bucket(`${r.lifecycle} ${r.state}`)==='done').length;
    const bugOpen = bugs.filter(r=>bucket(`${r.lifecycle} ${r.state}`)==='open').length;
    const bugStuck = bugs.filter(r=>bucket(`${r.lifecycle} ${r.state}`)==='stuck').length;
    const govArtifacts = artifacts.filter(a=>String(a.domain||'').includes('Governance'));
    const govDone = govArtifacts.filter(a=>bucket(a.status)==='done').length;
    const govOpen = govArtifacts.filter(a=>bucket(a.status)==='open').length;
    const govStuck = govArtifacts.filter(a=>bucket(a.status)==='stuck').length;
    const artDone = artifacts.filter(a=>bucket(a.status)==='done').length;
    const artOpen = artifacts.filter(a=>bucket(a.status)==='open').length;
    const artStuck = artifacts.filter(a=>bucket(a.status)==='stuck').length;
    const progress = [
      progressRow('Capabilities',capabilities.length,capDone,capabilities.length-capDone,0,'Done = readiness >= 75%','work-register.html#work'),
      progressRow('Work Records',workRows.length,workDone,workOpen,workStuck,'Visible work register rows','work-register.html#work'),
      progressRow('Bugs',bugs.length,bugDone,bugOpen,bugStuck,'Visible BUG-* rows','work-register.html#work'),
      progressRow('Governance Artifacts',govArtifacts.length,govDone,govOpen,govStuck,'Artifact domain contains Governance','work-register.html#artifacts'),
      progressRow('Artifacts Loaded',artifacts.length,artDone,artOpen,artStuck,'Public Artifact Register view','work-register.html#artifacts')
    ];
    document.getElementById('top_kpis').innerHTML = (managed.top_kpis||[]).map(k=>`<div class='kpi'><div class='num'>${esc(k.value)}</div><div class='txt'>${esc(k.label)}</div></div>`).join('') + `<div class='kpi'><div class='num'>${capDone}/${capabilities.length}</div><div class='txt'>Capabilities done</div></div>`;
    document.getElementById('progress_table').innerHTML = table(progress,['Name','Done','Percent','Open','Stuck','Basis','Drilldown']);
    document.getElementById('control_state').innerHTML = row('Source of Truth', state.system_status?.source_of_truth) + row('Active Work', state.current_work_item?.active_work_item) + row('Current Phase', state.current_work_item?.work_item_state) + row('Parked', state.execution_queue_detail?.deferred);
    document.getElementById('owner_gate').innerHTML = row('Gate', state.approval_center?.current_approval_card) + row('Required Action', state.approval_center?.required_owner_action) + row('Not Approved', state.approval_center?.not_approved);
    document.getElementById('work_streams').innerHTML = (managed.work_register_groups||[]).map(g=>`<div class='tile'><b>${esc(g.category)}</b><div>${esc(g.status)}</div><div class='small'>${esc(g.examples)}</div></div>`).join('');
    document.getElementById('lane_status').innerHTML = table(state.lanes||[], ['name','status','count']);
    document.getElementById('system_health').innerHTML = row('Artifacts', managed.inventory_summary?.governed_artifacts_registered) + row('Artifact rows loaded', artifacts.length) + row('Capabilities', `${capDone}/${capabilities.length} (${pct(capDone,capabilities.length)})`) + row('Visible rows', managed.inventory_summary?.visible_register_rows) + row('Exact candidate count', managed.inventory_summary?.exact_candidate_count) + row('Full backlog manager', managed.inventory_summary?.full_backlog_manager);
    document.getElementById('next_action').innerHTML = table(state.next_actions||[], ['id','label','lane','recommended','status']);
  }catch(e){
    document.getElementById('control_state').innerHTML = `<div class='bad'>Could not load dashboard data</div>`;
  }
}
boot();
