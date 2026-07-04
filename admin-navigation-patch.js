const adminNavigationPatchBuild='2026-07-04-NAV-003';
(function(){
  function safe(fn,fallback){try{return fn()}catch(e){return fallback}}
  function go(tab){ if(typeof showTab==='function') showTab(tab); }
  function workMetric(){
    const rows=safe(()=>workRows(),[]);
    let done=0,open=0,stuck=0,other=0;
    rows.forEach(r=>{const b=safe(()=>classifyWork(r),'other');if(b==='done')done++;else if(b==='open')open++;else if(b==='stuck')stuck++;else other++;});
    return {done,open,stuck,other,total:rows.length};
  }
  function count(fn){return safe(()=>fn().length,0)}
  function installCounterRenderer(){
    if(typeof window==='undefined')return;
    window.renderCounters=function(){
      const bar=document.getElementById('counterBar');
      if(!bar)return;
      const w=workMetric();
      const caps=safe(()=>stateData.capabilities,[])||[];
      const capDone=safe(()=>caps.filter(c=>capBucket(c)==='done').length,0);
      const items=[
        ['done',`${w.done}/${w.total}`,'Done Work Records'],
        ['pending',w.open,'Pending Work Records'],
        ['stuck',w.stuck,'Stuck Work Records'],
        ['other',w.other,'Other Work Records'],
        ['bugs',count(bugRows),'Bug Work Records'],
        ['ideas',count(ideaRows),'Idea / Candidate Records'],
        ['findings',count(findingRows),'Finding Records'],
        ['artifacts',safe(()=>artifactRows.length,0),'Artifact Records'],
        ['capabilities',`${capDone}/${caps.length}`,'Capability Records']
      ];
      bar.innerHTML=items.map(([a,n,l])=>`<button class='counter' data-nav-counter='${a}'><div class='num'>${n}</div><div class='label'>${l}</div></button>`).join('');
      bar.querySelectorAll('[data-nav-counter]').forEach(b=>b.onclick=()=>counterActionNav(b.dataset.navCounter));
    };
  }
  function counterActionNav(a){
    if(a==='done'){safe(()=>{filters.work.view='done';filters.work.q='';},null);return go('work')}
    if(a==='pending'){safe(()=>{filters.work.view='open';filters.work.q='';},null);return go('work')}
    if(a==='stuck'){safe(()=>{filters.work.view='stuck';filters.work.q='';},null);return go('work')}
    if(a==='other'){safe(()=>{filters.work.view='all';filters.work.q='';},null);return go('work')}
    if(a==='bugs'){safe(()=>{filters.work.view='all';filters.work.q='BUG-';},null);return go('work')}
    if(a==='ideas'){safe(()=>{filters.work.view='all';filters.work.q='CAND-';},null);return go('work')}
    if(a==='findings'){go('progress');setTimeout(()=>document.getElementById('findings')?.scrollIntoView({behavior:'smooth'}),80);return}
    if(a==='artifacts')return go('artifacts')
    if(a==='capabilities')return go('capabilities')
  }
  function addTableCounts(){
    document.querySelectorAll('.tablewrap').forEach(wrap=>{
      const count=wrap.querySelectorAll('tbody tr').length;
      if(wrap.previousElementSibling&&wrap.previousElementSibling.classList&&wrap.previousElementSibling.classList.contains('table-count')){
        wrap.previousElementSibling.textContent='Records in this table: '+count;return;
      }
      const p=document.createElement('div');p.className='note table-count';p.textContent='Records in this table: '+count;wrap.insertAdjacentElement('beforebegin',p);
    });
  }
  function addHelpNotes(){
    document.querySelectorAll('section h2').forEach(h=>{
      const text=h.textContent||'';
      if(text.includes('Progress Analysis')&&!h.parentElement.querySelector('.nav-help-progress')){const p=document.createElement('div');p.className='note nav-help-progress';p.textContent='Progress = summary by work-state buckets. Top counters split execution into Done, Pending, Stuck, and Other Work Records.';h.insertAdjacentElement('afterend',p)}
      if(text.includes('Work Records')&&!h.parentElement.querySelector('.nav-help-work')){const p=document.createElement('div');p.className='note nav-help-work';p.textContent='Work Records = the raw searchable table. Counters above apply filters to this table.';h.insertAdjacentElement('afterend',p)}
      if(text.includes('Control Room')&&!h.parentElement.querySelector('.nav-help-control')){const p=document.createElement('div');p.className='note nav-help-control';p.textContent='All indicators are clickable. Each indicator opens the full list or view behind the number.';h.insertAdjacentElement('afterend',p)}
    });
  }
  function clickKpi(label){
    if(label.includes('Artifacts'))return go('artifacts');
    if(label.includes('Capabilities'))return go('capabilities');
    if(label.includes('Visible Work Rows'))return go('work');
    if(label.includes('Register Categories'))return go('work');
    if(label.includes('Execution Done'))return go('progress');
    if(label.includes('Build'))return go('control');
  }
  function markBuild(){const sub=document.querySelector('.sub');if(sub&&!sub.textContent.includes('NAV-003'))sub.textContent+=' · Navigation Patch NAV-003'}
  function run(){installCounterRenderer();safe(()=>renderCounters(),null);addTableCounts();addHelpNotes();markBuild()}
  document.addEventListener('click',e=>{const kpi=e.target.closest('.kpi');if(kpi){clickKpi((kpi.querySelector('.txt')||kpi).textContent.trim())}setTimeout(run,0);setTimeout(run,250)});
  const style=document.createElement('style');
  style.textContent='.kpi{cursor:pointer}.kpi:hover,.counter:hover{outline:1px solid #60a5fa}.nav-help-progress,.nav-help-work,.nav-help-control,.table-count{margin:6px 0 10px;color:#9fb0c7;font-size:13px;line-height:1.35}.table-count{font-weight:600;color:#e8eef7}';
  document.head.appendChild(style);
  setTimeout(run,0);setTimeout(run,500);setTimeout(run,1500);
})();
