const mobileResponsivePatchBuild='2026-07-04-MOBILE-SAFE-011';
(function(){
  const css=`@media(max-width:820px){
    html,body{max-width:100%!important;overflow-x:hidden!important}body{font-size:15px!important}
    header,main,section{max-width:100%!important;overflow-x:hidden!important}
    h1{font-size:20px!important}h2{font-size:20px!important;line-height:1.25!important}h3{font-size:17px!important;line-height:1.3!important}.sub{font-size:13px!important}
    .tabs{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important;overflow:visible!important}.tabs button{white-space:normal!important;min-width:0!important;border-radius:12px!important;font-size:13px!important;padding:10px 7px!important;line-height:1.2!important}
    .kpis{grid-template-columns:repeat(2,minmax(0,1fr))!important}.kpi .num{font-size:21px!important}.kpi .txt{font-size:13px!important;line-height:1.25!important}
    .filters{grid-template-columns:1fr!important}.filters input,.filters select{font-size:15px!important;padding:12px 10px!important}
    .tablewrap{overflow-x:hidden!important;border:0!important}
    table,thead,tbody,tr,td{display:block!important;width:100%!important;max-width:100%!important;min-width:0!important}thead{display:none!important}
    tr{background:#11243a!important;border:1px solid #223855!important;border-radius:13px!important;margin:12px 0!important;padding:8px!important}
    td{display:grid!important;grid-template-columns:104px minmax(0,1fr)!important;gap:10px!important;align-items:start!important;border-bottom:1px solid rgba(255,255,255,.08)!important;padding:9px 7px!important;font-size:15px!important;line-height:1.42!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:break-word!important}
    td:last-child{border-bottom:0!important}td:before{content:attr(data-label)!important;color:#9fb0c7!important;font-size:12px!important;line-height:1.25!important;overflow-wrap:anywhere!important;font-weight:600!important}
    .badge{font-size:12px!important;padding:4px 7px!important;white-space:normal!important;line-height:1.2!important}.note{font-size:14px!important;line-height:1.35!important}
  }@media(max-width:420px){body{font-size:14.5px!important}.tabs{grid-template-columns:1fr 1fr!important}.kpis{grid-template-columns:1fr 1fr!important}td{grid-template-columns:96px minmax(0,1fr)!important;font-size:14.5px!important;padding:9px 6px!important}td:before{font-size:11.5px!important}.badge{font-size:11.5px!important;padding:3px 6px!important}}`;
  const style=document.createElement('style');
  style.id='mobile-responsive-patch-style';
  style.textContent=css;
  document.head.appendChild(style);
  function labelTables(){
    document.querySelectorAll('table').forEach(table=>{
      const headers=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());
      table.querySelectorAll('tbody tr').forEach(tr=>{
        [...tr.children].forEach((td,i)=>td.setAttribute('data-label',headers[i]||''));
      });
    });
    const sub=document.querySelector('.sub');
    if(sub&&!sub.textContent.includes('MOBILE-SAFE-011')) sub.textContent+=' · Mobile Responsive Patch MOBILE-SAFE-011';
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(labelTables,0)); else setTimeout(labelTables,0);
  setTimeout(labelTables,600);
})();
