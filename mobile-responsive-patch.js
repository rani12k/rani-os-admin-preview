const mobileResponsivePatchBuild='2026-07-04-MOBILE-TABLE-012';
(function(){
  const css=`@media(max-width:820px){
    html,body{max-width:100%!important;overflow-x:hidden!important}body{font-size:14px!important}
    header,main,section{max-width:100%!important;overflow-x:hidden!important}
    h1{font-size:20px!important}h2{font-size:19px!important;line-height:1.25!important}h3{font-size:16px!important;line-height:1.3!important}.sub{font-size:13px!important}
    .tabs{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important;overflow:visible!important}.tabs button{white-space:normal!important;min-width:0!important;border-radius:12px!important;font-size:13px!important;padding:10px 7px!important;line-height:1.2!important}
    .kpis{grid-template-columns:repeat(2,minmax(0,1fr))!important}.kpi .num{font-size:20px!important}.kpi .txt{font-size:13px!important;line-height:1.25!important}
    .filters{grid-template-columns:1fr!important}.filters input,.filters select{font-size:15px!important;padding:12px 10px!important}
    .tablewrap{width:100%!important;max-width:100%!important;overflow-x:hidden!important;border:1px solid #223855!important;border-radius:12px!important}
    table{display:table!important;width:100%!important;max-width:100%!important;min-width:0!important;table-layout:fixed!important;border-collapse:collapse!important}
    thead{display:table-header-group!important}tbody{display:table-row-group!important}tr{display:table-row!important;background:transparent!important;border:0!important;margin:0!important;padding:0!important}
    th,td{display:table-cell!important;padding:6px 4px!important;font-size:12px!important;line-height:1.25!important;white-space:normal!important;overflow-wrap:anywhere!important;word-break:break-word!important;border-bottom:1px solid rgba(255,255,255,.08)!important;vertical-align:top!important}
    th{font-size:11px!important;color:#9fb0c7!important;background:#0b1a2d!important;font-weight:600!important}
    td:before{content:none!important}
    th:nth-child(7),td:nth-child(7){display:none!important}
    .badge{font-size:10px!important;padding:3px 5px!important;white-space:normal!important;line-height:1.1!important}.note{font-size:13px!important;line-height:1.35!important}
  }@media(max-width:420px){
    body{font-size:13.5px!important}.tabs{grid-template-columns:1fr 1fr!important}.kpis{grid-template-columns:1fr 1fr!important}
    th,td{font-size:11.5px!important;padding:5px 3px!important}.badge{font-size:9.5px!important;padding:2px 4px!important}
  }`;
  const style=document.createElement('style');
  style.id='mobile-responsive-patch-style';
  style.textContent=css;
  document.head.appendChild(style);
  function mark(){const sub=document.querySelector('.sub');if(sub&&!sub.textContent.includes('MOBILE-TABLE-012'))sub.textContent+=' · Mobile Table Patch MOBILE-TABLE-012'}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mark);else setTimeout(mark,0);
})();
