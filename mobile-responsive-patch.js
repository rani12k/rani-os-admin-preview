const mobileResponsivePatchBuild='2026-07-04-MOBILE-MODULE-CR013';
(function(){
  function bootCR013(){
    const current=(document.querySelector('.sub')||{}).textContent||'';
    if(current.includes('CR-013')) return;
    if(document.querySelector('[data-cr013-module]')) return;
    document.body.style.background='#07111f';
    const loading=document.createElement('div');
    loading.textContent='Loading CR-013 Capability Mapping Coverage...';
    loading.style.cssText='margin:12px;padding:12px;border:1px solid #223855;border-radius:12px;background:#0d1b2e;color:#e8eef7;font-family:Arial,sans-serif';
    document.body.prepend(loading);
    const s=document.createElement('script');
    s.type='module';
    s.dataset.cr013Module='true';
    s.src='app-cr013.js?module_boot=CR013_CAPABILITY_MAPPING_COVERAGE_'+Date.now();
    s.onload=function(){loading.remove();};
    document.body.appendChild(s);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(bootCR013,500));
  else setTimeout(bootCR013,500);
})();
