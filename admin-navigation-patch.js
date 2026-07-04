const adminNavigationPatchBuild='2026-07-04-NAV-002';
(function(){
  function go(tab){ if(typeof showTab==='function') showTab(tab); }
  function getProgressMetric(){
    try{
      if(typeof progressRows!=='function') return null;
      const r=progressRows()[0]||{};
      return {done:String(r.Done||'').split('/')[0].trim(),total:String(r.Done||'').split('/')[1]?.trim()||'',open:r.Open||'0',stuck:r.Stuck||'0',other:r.Other||'0'};
    }catch(e){return null;}
  }
  function normalizeCounters(){
    const bar=document.getElementById('counterBar');
    if(!bar) return;
    const m=getProgressMetric();
    if(m && !bar.dataset.nav002){
      const existing=[...bar.querySelectorAll('.counter')];
      const keep=existing.filter(b=>!['Execution','Pending'].includes((b.querySelector('.label')||{}).textContent?.trim()));
      const split=`<button class='counter' data-nav-counter='done'><div class='num'>${m.done}/${m.total}</div><div class='label'>Done Work Records</div></button><button class='counter' data-nav-counter='pending'><div class='num'>${m.open}</div><div class='label'>Pending Work Records</div></button><button class='counter' data-nav-counter='stuck'><div class='num'>${m.stuck}</div><div class='label'>Stuck Work Records</div></button><button class='counter' data-nav-counter='other'><div class='num'>${m.other}</div><div class='label'>Other Work Records</div></button>`;
      bar.innerHTML=split+keep.map(b=>b.outerHTML).join('');
      bar.dataset.nav002='true';
    }
    const map={'Bugs':'Bug Work Records','Ideas':'Idea / Candidate Records','Findings':'Finding Records','Artifacts':'Artifact Records','Capabilities':'Capability Records'};
    document.querySelectorAll('.counter .label').forEach(el=>{const t=el.textContent.trim();if(map[t])el.textContent=map[t];});
    document.querySelectorAll('[data-nav-counter]').forEach(b=>{b.onclick=()=>counterAction(b.dataset.navCounter);});
  }
  function counterAction(a){
    if(a==='done'){try{filters.work.view='done';filters.work.q='';}catch(e){} return go('work');}
    if(a==='pending'){try{filters.work.view='open';filters.work.q='';}catch(e){} return go('work');}
    if(a==='stuck'){try{filters.work.view='stuck';filters.work.q='';}catch(e){} return go('work');}
    if(a==='other'){try{filters.work.view='all';filters.work.q='';}catch(e){} return go('work');}
  }
  function addTableCounts(){
    document.querySelectorAll('.tablewrap').forEach((wrap,i)=>{
      if(wrap.previousElementSibling&&wrap.previousElementSibling.classList&&wrap.previousElementSibling.classList.contains('table-count')){
        wrap.previousElementSibling.textContent='Records in this table: '+wrap.querySelectorAll('tbody tr').length;
        return;
      }
      const count=wrap.querySelectorAll('tbody tr').length;
      const p=document.createElement('div');
      p.className='note table-count';
      p.textContent='Records in this table: '+count;
      wrap.insertAdjacentElement('beforebegin',p);
    });
  }
  function addHelpNotes(){
    document.querySelectorAll('section h2').forEach(h=>{
      const text=h.textContent||'';
      if(text.includes('Progress Analysis')&&!h.parentElement.querySelector('.nav-help-progress')){
        const p=document.createElement('div');p.className='note nav-help-progress';
        p.textContent='Progress = summary by work-state buckets. Use the top counters for Done, Pending, Stuck, and Other Work Records.';
        h.insertAdjacentElement('afterend',p);
      }
      if(text.includes('Work Records')&&!h.parentElement.querySelector('.nav-help-work')){
        const p=document.createElement('div');p.className='note nav-help-work';
        p.textContent='Work Records = the raw searchable table. Counters above apply filters to this table.';
        h.insertAdjacentElement('afterend',p);
      }
      if(text.includes('Control Room')&&!h.parentElement.querySelector('.nav-help-control')){
        const p=document.createElement('div');p.className='note nav-help-control';
        p.textContent='All indicators are clickable. Each indicator opens the full list or view behind the number.';
        h.insertAdjacentElement('afterend',p);
      }
    });
  }
  function markBuild(){const sub=document.querySelector('.sub');if(sub&&!sub.textContent.includes('NAV-002'))sub.textContent+=' · Navigation Patch NAV-002';}
  function run(){normalizeCounters();addTableCounts();addHelpNotes();markBuild();}
  function clickKpi(label){
    if(label.includes('Artifacts'))return go('artifacts');
    if(label.includes('Capabilities'))return go('capabilities');
    if(label.includes('Visible Work Rows'))return go('work');
    if(label.includes('Register Categories'))return go('work');
    if(label.includes('Execution Done'))return go('progress');
    if(label.includes('Build'))return go('control');
  }
  document.addEventListener('click',e=>{
    const kpi=e.target.closest('.kpi');
    if(kpi){const label=(kpi.querySelector('.txt')||kpi).textContent.trim();clickKpi(label);setTimeout(run,0);setTimeout(run,250);return;}
    setTimeout(run,0);setTimeout(run,250);
  });
  const style=document.createElement('style');
  style.textContent='.kpi{cursor:pointer}.kpi:hover,.counter:hover{outline:1px solid #60a5fa}.nav-help-progress,.nav-help-work,.nav-help-control,.table-count{margin:6px 0 10px;color:#9fb0c7;font-size:13px;line-height:1.35}.table-count{font-weight:600;color:#e8eef7}';
  document.head.appendChild(style);
  setTimeout(run,0);setTimeout(run,500);setTimeout(run,1500);
})();
