const mobileResponsivePatchBuild='2026-07-04-MOBILE-SAME-URL-CR012';
(function(){
  function bootSameUrlCR012(){
    const current=(document.querySelector('.sub')||{}).textContent||'';
    if(current.includes('CR-012')) return;
    document.documentElement.style.margin='0';
    document.body.style.margin='0';
    document.body.style.background='#07111f';
    document.body.innerHTML='<iframe title="RANI OS Admin CR012" src="cr012.html?same_url_boot=20260704" style="position:fixed;inset:0;width:100vw;height:100vh;border:0;background:#07111f;"></iframe>';
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(bootSameUrlCR012,800));
  else setTimeout(bootSameUrlCR012,800);
})();
