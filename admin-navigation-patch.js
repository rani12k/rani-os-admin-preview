const adminNavigationPatchBuild='2026-07-04-NAV-004';
(function(){
  function safe(fn,fallback){try{return fn()}catch(e){return fallback}}
  function go(tab){ if(typeof showTab==='function') showTab(tab); }
  function rows(){return safe(()=>workRows(),[])||[]}
  function rowCount(prefix){return rows().filter(r=>String(r.id||'').startsWith(prefix)).length}
  function workMetric(){let done=0,open=0,stuck=0,other=0;rows().forEach(r=>{const b=safe(()=>classifyWork(r),'other');if(b==='done')done++;else if(b==='open')open++;else if(b==='stuck')stuck++;else other++});return {done,open,stuck,other,total:rows().length}}
  function installCounterRenderer(){
    window.renderCounters=function(){
      const bar=document.getElementById('counterBar'); if(!bar)return;
      const caps=safe(()=>stateData.capabilities,[])||[];
      const items=[
        ['work',rows().length,'Work Records'],
        ['admin',rowCount('ADMIN-WEB'),'Admin Web Records'],
        ['bugs',rowCount('BUG-'),'Bug Work Records'],
        ['opsbugs',rowCount('OPS-BUG'),'Operational Bug Records'],
        ['ideas',safe(()=>ideaRows().length,0),'Idea / Candidate Records'],
        ['findings',safe(()=>findingRows().length,0),'Finding Records'],
        ['artifacts',safe(()=>artifactRows.length,0),'Artifact Records'],
        ['capabilities',caps.length,'Capability Records']
      ];
      bar.innerHTML=items.map(([a,n,l])=>`<button class='counter' data-entity-counter='${a}'><div class='num'>${n}</div><div class='label'>${l}</div></button>`).join('');
      bar.querySelectorAll('[data-entity-counter]').forEach(b=>b.onclick=()=>entityAction(b.dataset.entityCounter));
    };
  }
  function entityAction(a){
    if(a==='work'){safe(()=>{filters.work.view='all';filters.work.q='';},null);return go('work')}
    if(a==='admin'){safe(()=>{filters.work.view='all';filters.work.q='ADMIN-WEB';},null);return go('work')}
    if(a==='bugs'){safe(()=>{filters.work.view='all';filters.work.q='BUG-';},null);return go('work')}
    if(a==='opsbugs'){safe(()=>{filters.work.view='all';filters.work.q='OPS-BUG';},null);return go('work')}
    if(a==='ideas'){safe(()=>{filters.work.view='all';filters.work.q='CAND-';},null);return go('work')}
    if(a==='findings'){go('progress');setTimeout(()=>document.getElementById('findings')?.scrollIntoView({behavior:'smooth'}),80);return}
    if(a==='artifacts')return go('artifacts')
    if(a==='capabilities')return go('capabilities')
  }
  function addWorkStatusCounters(){
    const h=[...document.querySelectorAll('section h2')].find(x=>(x.textContent||'').includes('Work Records'));
    if(!h||h.parentElement.querySelector('.work-status-counters'))return;
    const m=workMetric();
    const box=document.createElement('div');
    box.className='work-status-counters counters';
    box.innerHTML=`<button class='counter' data-work-status='done'><div class='num'>${m.done}</div><div class='label'>Done in Work Records</div></button><button class='counter' data-work-status='open'><div class='num'>${m.open}</div><div class='label'>Pending in Work Records</div></button><button class='counter' data-work-status='stuck'><div class='num'>${m.stuck}</div><div class='label'>Stuck in Work Records</div></button><button class='counter' data-work-status='all'><div class='num'>${m.total}</div><div class='label'>All Work Records</div></button>`;
    h.insertAdjacentElement('afterend',box);
    box.querySelectorAll('[data-work-status]').forEach(b=>b.onclick=()=>{const s=b.dataset.workStatus;safe(()=>{filters.work.view=s==='all'?'all':s;filters.work.q='';},null);go('work');setTimeout(run,0)});
  }
  function addTableCounts(){document.querySelectorAll('.tablewrap').forEach(wrap=>{const count=wrap.querySelectorAll('tbody tr').length;if(wrap.previousElementSibling&&wrap.previousElementSibling.classList&&wrap.previousElementSibling.classList.contains('table-count')){wrap.previousElementSibling.textContent='Records in this table: '+count;return}const p=document.createElement('div');p.className='note table-count';p.textContent='Records in this table: '+count;wrap.insertAdjacentElement('beforebegin',p)})}
  function addHelpNotes(){document.querySelectorAll('section h2').forEach(h=>{const text=h.textContent||'';if(text.includes('Progress Analysis')&&!h.parentElement.querySelector('.nav-help-progress')){const p=document.createElement('div');p.className='note nav-help-progress';p.textContent='Progress = summary report. It explains status distribution. Raw entities are counted in top counters and listed in Work Records.';h.insertAdjacentElement('afterend',p)}if(text.includes('Work Records')&&!h.parentElement.querySelector('.nav-help-work')){const p=document.createElement('div');p.className='note nav-help-work';p.textContent='Work Records = entity table. Status counters below apply only to this table.';h.insertAdjacentElement('afterend',p)}if(text.includes('Control Room')&&!h.parentElement.querySelector('.nav-help-control')){const p=document.createElement('div');p.className='note nav-help-control';p.textContent='Top counters count entity types only. Status breakdown appears inside the relevant table view.';h.insertAdjacentElement('afterend',p)}})}
  function clickKpi(label){if(label.includes('Artifacts'))return go('artifacts');if(label.includes('Capabilities'))return go('capabilities');if(label.includes('Visible Work Rows'))return go('work');if(label.includes('Register Categories'))return go('work');if(label.includes('Execution Done'))return go('progress');if(label.includes('Build'))return go('control')}
  function markBuild(){const sub=document.querySelector('.sub');if(sub&&!sub.textContent.includes('NAV-004'))sub.textContent+=' · Navigation Patch NAV-004'}
  function run(){installCounterRenderer();safe(()=>renderCounters(),null);addWorkStatusCounters();addTableCounts();addHelpNotes();markBuild()}
  document.addEventListener('click',e=>{const kpi=e.target.closest('.kpi');if(kpi){clickKpi((kpi.querySelector('.txt')||kpi).textContent.trim())}setTimeout(run,0);setTimeout(run,250)});
  const style=document.createElement('style');
  style.textContent='.kpi{cursor:pointer}.kpi:hover,.counter:hover{outline:1px solid #60a5fa}.nav-help-progress,.nav-help-work,.nav-help-control,.table-count{margin:6px 0 10px;color:#9fb0c7;font-size:13px;line-height:1.35}.table-count{font-weight:600;color:#e8eef7}.work-status-counters{margin:8px 0 12px}';
  document.head.appendChild(style);
  setTimeout(run,0);setTimeout(run,500);setTimeout(run,1500);
})();
