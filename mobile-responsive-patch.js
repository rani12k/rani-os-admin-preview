const mobileResponsivePatchBuild='2026-07-04-MOBILE-008';
function applyMobileResponsivePatch(){
  if(document.getElementById('mobile-responsive-patch-style')) return;
  const style=document.createElement('style');
  style.id='mobile-responsive-patch-style';
  style.textContent=`
  @media (max-width: 820px){
    html,body{max-width:100%!important;overflow-x:hidden!important;}
    header,main,section{max-width:100%!important;overflow-x:hidden!important;}
    .tabs{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:6px!important;overflow:visible!important;}
    .tabs button{white-space:normal!important;min-width:0!important;border-radius:12px!important;font-size:12px!important;padding:8px 6px!important;}
    .kpis{grid-template-columns:repeat(2,minmax(0,1fr))!important;}
    .filters{grid-template-columns:1fr!important;}
    .tablewrap{overflow-x:hidden!important;border:0!important;}
    table,thead,tbody,tr,td{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;}
    thead{display:none!important;}
    tr{background:#11243a!important;border:1px solid #223855!important;border-radius:12px!important;margin:10px 0!important;padding:6px!important;}
    td{display:grid!important;grid-template-columns:92px minmax(0,1fr)!important;gap:8px!important;align-items:start!important;border-bottom:1px solid rgba(255,255,255,.07)!important;padding:7px 6px!important;font-size:13px!important;line-height:1.35!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:break-word!important;}
    td:last-child{border-bottom:0!important;}
    td::before{content:attr(data-label)!important;color:#9fb0c7!important;font-size:11px!important;line-height:1.25!important;overflow-wrap:anywhere!important;}
    .badge{font-size:11px!important;padding:3px 6px!important;white-space:normal!important;}
  }
  @media (max-width: 420px){
    .tabs{grid-template-columns:1fr 1fr!important;}
    .kpis{grid-template-columns:1fr 1fr!important;}
    td{grid-template-columns:82px minmax(0,1fr)!important;font-size:12.5px!important;padding:7px 5px!important;}
    td::before{font-size:10px!important;}
    .badge{font-size:10px!important;padding:2px 5px!important;}
  }`;
  document.head.appendChild(style);
}
function addTableLabels(){
  document.querySelectorAll('table').forEach(table=>{
    const headers=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach(tr=>{
      [...tr.children].forEach((td,i)=>{ if(!td.dataset.label) td.dataset.label=headers[i]||''; });
    });
  });
}
function markMobilePatchBuild(){
  const sub=document.querySelector('.sub');
  if(sub && !sub.textContent.includes('MOBILE-008')) sub.textContent += ' · Mobile Responsive Patch MOBILE-008';
}
function runMobilePatch(){applyMobileResponsivePatch();addTableLabels();markMobilePatchBuild();}
const mobilePatchObserver=new MutationObserver(runMobilePatch);
mobilePatchObserver.observe(document.documentElement,{childList:true,subtree:true});
setInterval(runMobilePatch,1000);
runMobilePatch();
