const build='2026-07-04-CR-014-SAFE';
(function(){
  document.body.style.background='#07111f';
  document.body.style.color='#e8eef7';
  document.body.style.fontFamily='Arial,sans-serif';
  document.body.innerHTML='<div style="margin:16px;padding:14px;border:1px solid #223855;border-radius:14px;background:#0d1b2e">Loading RANI OS Admin safe build...</div>';
  const s=document.createElement('script');
  s.src='app-cr013.js?fallback=CR014_SAFE_'+Date.now();
  document.body.appendChild(s);
})();
