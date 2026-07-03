const stamp = Date.now();
const qs = new URLSearchParams(window.location.search);
const stateUrl = qs.get('state') || `state.json?v=${stamp}`;

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function val(v){if(v===null||v===undefined||v==='')return'unknown';if(Array.isArray(v))return v.length?v.map(x=>`<span class='chip'>${esc(x)}</span>`).join(' '):'None';if(typeof v==='object')return `<pre>${esc(JSON.stringify(v,null,2))}</pre>`;return esc(v)}
function rows(o){return Object.entries(o||{}).map(([k,v])=>`<div class='row'><div class='label'>${esc(k)}</div><div class='value'>${val(v)}</div></div>`).join('')||'unknown'}
function table(list,cols){return `<table><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${(list||[]).map(r=>`<tr>${cols.map(c=>`<td>${val(r[c]??'')}</td>`).join('')}</tr>`).join('')}</tbody></table>`}
function set(id, html){const el=document.getElementById(id); if(el) el.innerHTML = html;}
function render(state){
  set('status', `<div class='pass'>Preview loaded · ${esc(state.version || 'current')} · refresh-safe state</div>`);
  set('kpis', Object.entries(state.summary||{}).map(([k,v])=>`<div class='kpi'><div class='num'>${esc(v)}</div><div class='txt'>${esc(k)}</div></div>`).join(''));
  ['system_status','current_work_item','execution_queue_detail','approval_center','handoff_center','evidence_measurement','incidents_blockers','repository_sync','next_action_controls','repository'].forEach(k=>set(k, rows(state[k])));
  set('capabilities', table(state.capabilities,['capability','layer','status','readiness','priority','next']));
  set('language_and_ux', table(state.language_and_ux,['area','status','next']));
  set('tasks', table(state.tasks,['id','name','status','lane','next']));
  set('lanes', table(state.lanes,['name','status','count']));
  set('gates', table(state.gates,['gate','status','decision']));
  set('trace', table(state.trace,['id','event','result']));
  set('next_actions', table(state.next_actions,['id','label','lane','recommended','status']));
}
fetch(stateUrl, {cache:'no-store'})
  .then(r => r.json())
  .then(render)
  .catch(() => set('status', `<div class='bad'>Could not load state.json</div>`));
