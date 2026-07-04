const appScopePatchBuild='2026-07-04-APP-SCOPE-001';
(function(){
  let current='ALL';
  function addScopeBar(){
    const header=document.querySelector('header');
    if(!header||header.querySelector('.app-scope-bar'))return;
    const bar=document.createElement('div');
    bar.className='app-scope-bar';
    bar.innerHTML='<button data-scope="ALL">🌐 ALL</button><button data-scope="RANI_OS">🧠 RANI_OS</button><button data-scope="RANI_TRADING">📈 RANI_TRADING</button><button data-scope="RANI_POOL">🏊 RANI_POOL</button>';
    header.insertBefore(bar,header.querySelector('.tabs'));
    bar.querySelectorAll('button').forEach(b=>b.onclick=()=>{current=b.dataset.scope;mark();filterTables();});
    mark();
  }
  function inferApp(text){text=String(text||'').toLowerCase();if(/pool|chemical|measurement|maintenance/.test(text))return 'RANI_POOL';if(/trading|trade|broker|market|ibkr|visual|pine|execution|decision|research|evidence/.test(text))return 'RANI_TRADING';return 'RANI_OS';}
  function filterTables(){document.querySelectorAll('tbody tr').forEach(tr=>{const app=inferApp(tr.textContent);tr.dataset.appScope=app;tr.style.display=(current==='ALL'||current===app)?'':'none';});}
  function mark(){document.querySelectorAll('.app-scope-bar button').forEach(b=>b.classList.toggle('active',b.dataset.scope===current));const sub=document.querySelector('.sub');if(sub&&!sub.textContent.includes('APP-SCOPE-001'))sub.textContent+=' · App Scope APP-SCOPE-001';}
  function style(){if(document.getElementById('app-scope-style'))return;const s=document.createElement('style');s.id='app-scope-style';s.textContent='.app-scope-bar{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:10px 0}.app-scope-bar button{padding:10px;border:1px solid #223855;border-radius:12px;background:#11243a;color:#e8eef7;text-align:left}.app-scope-bar button.active{background:#60a5fa;color:#07111f;font-weight:700}';document.head.appendChild(s);}
  function run(){style();addScopeBar();filterTables();}
  setTimeout(run,700);setTimeout(run,1600);document.addEventListener('click',()=>setTimeout(run,300));
})();
