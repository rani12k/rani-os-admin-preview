const stamp = Date.now();
const qs = new URLSearchParams(window.location.search);
const stateUrl = qs.get('state') || `state.json?v=${stamp}`;
const managedUrl = qs.get('managed') || `managed-work.json?v=${stamp}`;
const mobileQuery = window.matchMedia('(max-width:820px)');

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function val(v){if(v===null||v===undefined||v==='')return'unknown';if(Array.isArray(v))return v.length?v.map(x=>`<span class='chip'>${esc(x)}</span>`).join(' '):'None';if(typeof v==='object')return `<pre>${esc(JSON.stringify(v,null,2))}</pre>`;return esc(v)}
function rows(o){return Object.entries(o||{}).map(([k,v])=>`<div class='row'><div class='label'>${esc(k)}</div><div class='value'>${val(v)}</div></div>`).join('')||'unknown'}
function firstPresent(row, cols){return cols.map(c=>row[c]).find(v=>v!==undefined&&v!==null&&v!=='') || 'item'}
function cardTable(list,cols){return `<div class='cardlist'>${(list||[]).map(r=>`<article class='datacard'><div class='cardtitle'>${val(firstPresent(r,cols))}</div>${cols.map(c=>`<div class='minirow'><div class='minilabel'>${esc(c)}</div><div>${val(r[c]??'')}</div></div>`).join('')}</article>`).join('')}</div>`}
function table(list,cols){if(mobileQuery.matches)return cardTable(list,cols);return `<table><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${(list||[]).map(r=>`<tr>${cols.map(c=>`<td>${val(r[c]??'')}</td>`).join('')}</tr>`).join('')}</tbody></table>`}
function set(id, html){const el=document.getElementById(id); if(el) el.innerHTML = html;}
function ensurePanel(id,title,beforeId){
  if(document.getElementById(id))return;
  const before=document.getElementById(beforeId);
  const details=document.createElement('details');
  details.className='panel full'; details.id=id; details.open=true; details.dataset.mobileOpen='true';
  details.innerHTML=`<summary><h2>${esc(title)}</h2></summary><div class='content'><div id='${id.replace('_panel','')}'></div></div>`;
  before?.parentNode?.insertBefore(details,before);
}
function renderExecutive(state){const x=state.executive_mobile||{};const cards=[['Source',x.source_of_truth||'CURRENT_STATE.md wins'],['Active',x.active_work||'unknown'],['Gate',x.owner_gate||'unknown'],['Coverage',x.coverage_warning||'Active slice is not full backlog']];set('executive_summary',`<div class='actionstrip'>${cards.map(([k,v])=>`<div class='actioncard'><div class='title'>${esc(k)}</div><div class='body'>${esc(v)}</div></div>`).join('')}</div><div class='compact-note'>This mobile top panel is repo-backed orientation only. It does not replace Artifact Register, Candidate Register, Capability Roadmap, or Managed Work Coverage Check.</div>`)}
function renderMobileReview(state){const m=state.mobile_review||{};const cards=[['mode',m.mode||'mobile_density_patch'],['owner finding',m.owner_finding||'mobile view issue'],['patched now',m.patched_now||'repo-backed coverage correction'],['owner check',m.owner_check||'refresh fixed URL on phone']];set('mobile_review',`<div class='mobilegrid'>${cards.map(([k,v])=>`<div class='mobilecard'><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}</div>`)}
function renderManaged(m){
  ensurePanel('work_register_panel','Ideas / Bugs / Completed / Planned Register','managed_work_panel');
  set('work_register', `<h3>Register Categories</h3>${table(m.work_register_groups||[],['category','source','status','examples','dashboard_rule'])}<h3>Representative Register Rows</h3>${table(m.representative_register_rows||[],['id','title','state','source'])}`);
  const summary=rows(m.inventory_summary||{});
  const sources=table(m.required_source_coverage||[],['source','repo_path','dashboard_role','status']);
  const groups=table(m.groups,['group','count','source','status','dashboard_role']);
  const warning=table(m.not_full_backlog_warning||[],['warning','repo_basis','dashboard_effect']);
  const reasons=table(m.why_task_count_looked_small,['reason','meaning']);
  const next=table(m.next_dashboard_improvements,['id','label','status']);
  set('managed_work',`<h3>Inventory Summary</h3>${summary}<h3>Required Source Coverage</h3>${sources}<h3>Managed Work Groups</h3>${groups}<h3>Not a Full Backlog Warning</h3>${warning}<h3>Why the active slice looked small</h3>${reasons}<h3>Next improvements</h3>${next}`)
}
function applyMobileDisclosure(){document.querySelectorAll('details.panel').forEach(d=>{d.open=mobileQuery.matches?d.dataset.mobileOpen==='true':true})}
function render(state){set('status',`<div class='pass'>Preview loaded · ${esc(state.version||'current')} · repo-backed work-register correction</div>`);renderExecutive(state);renderMobileReview(state);set('kpis',Object.entries(state.summary||{}).map(([k,v])=>`<div class='kpi'><div class='num'>${esc(v)}</div><div class='txt'>${esc(k)}</div></div>`).join(''));set('operating_principles',table(state.operating_principles,['principle','status','meaning']));set('work_packages',table(state.work_packages,['package','status','lane','next']));['system_status','current_work_item','execution_queue_detail','approval_center','handoff_center','evidence_measurement','incidents_blockers','repository_sync','next_action_controls','repository'].forEach(k=>set(k,rows(state[k])));set('capabilities',table(state.capabilities,['capability','layer','status','readiness','priority','next']));set('language_and_ux',table(state.language_and_ux,['area','status','next']));set('tasks',table(state.tasks,['id','name','status','lane','next']));set('lanes',table(state.lanes,['name','status','count']));set('gates',table(state.gates,['gate','status','decision']));set('trace',table(state.trace,['id','event','result']));set('next_actions',table(state.next_actions,['id','label','lane','recommended','status']));applyMobileDisclosure()}
fetch(stateUrl,{cache:'no-store'}).then(r=>r.json()).then(render).catch(()=>set('status',`<div class='bad'>Could not load state.json</div>`));
fetch(managedUrl,{cache:'no-store'}).then(r=>r.json()).then(renderManaged).catch(()=>set('managed_work',`<div class='bad'>Could not load managed-work.json</div>`));
mobileQuery.addEventListener?.('change',()=>location.reload());
