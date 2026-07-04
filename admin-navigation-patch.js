const adminNavigationPatchBuild='2026-07-04-NAV-001';
(function(){
  function go(tab){ if(typeof showTab==='function') showTab(tab); }
  function normalizeCounters(){
    const map={
      'Execution':'Execution Progress',
      'Pending':'Pending Work Records',
      'Bugs':'Bug Work Records',
      'Ideas':'Idea / Candidate Records',
      'Findings':'Finding Records',
      'Artifacts':'Artifact Records',
      'Capabilities':'Capability Records'
    };
    document.querySelectorAll('.counter .label').forEach(el=>{
      const t=el.textContent.trim(); if(map[t]) el.textContent=map[t];
    });
  }
  function addHelpNotes(){
    document.querySelectorAll('section h2').forEach(h=>{
      const text=h.textContent||'';
      if(text.includes('Progress Analysis')&&!h.parentElement.querySelector('.nav-help-progress')){
        const p=document.createElement('div');
        p.className='note nav-help-progress';
        p.textContent='Progress = summary and grouped drill-down: execution, pending, stuck, bugs, ideas, findings. Work Records = the raw searchable record table.';
        h.insertAdjacentElement('afterend',p);
      }
      if(text.includes('Work Records')&&!h.parentElement.querySelector('.nav-help-work')){
        const p=document.createElement('div');
        p.className='note nav-help-work';
        p.textContent='Work Records = raw records table. Use filters or top counters to view Pending, Bugs, Ideas, or other slices.';
        h.insertAdjacentElement('afterend',p);
      }
      if(text.includes('Control Room')&&!h.parentElement.querySelector('.nav-help-control')){
        const p=document.createElement('div');
        p.className='note nav-help-control';
        p.textContent='All indicators are clickable. Each indicator opens the full list or view behind the number.';
        h.insertAdjacentElement('afterend',p);
      }
    });
  }
  function markBuild(){
    const sub=document.querySelector('.sub');
    if(sub&&!sub.textContent.includes('NAV-001')) sub.textContent+=' · Navigation Patch NAV-001';
  }
  function run(){normalizeCounters();addHelpNotes();markBuild();}
  function clickKpi(label){
    if(label.includes('Artifacts')) return go('artifacts');
    if(label.includes('Capabilities')) return go('capabilities');
    if(label.includes('Visible Work Rows')) return go('work');
    if(label.includes('Register Categories')) return go('work');
    if(label.includes('Execution Done')) return go('progress');
    if(label.includes('Build')) return go('control');
  }
  document.addEventListener('click',e=>{
    const kpi=e.target.closest('.kpi');
    if(kpi){
      const label=(kpi.querySelector('.txt')||kpi).textContent.trim();
      clickKpi(label);
      setTimeout(run,0);
      return;
    }
    setTimeout(run,0);
  });
  const style=document.createElement('style');
  style.textContent='.kpi{cursor:pointer}.kpi:hover,.counter:hover{outline:1px solid #60a5fa}.nav-help-progress,.nav-help-work,.nav-help-control{margin:6px 0 10px;color:#9fb0c7;font-size:13px;line-height:1.35}';
  document.head.appendChild(style);
  setTimeout(run,0);setTimeout(run,500);setTimeout(run,1500);
})();
