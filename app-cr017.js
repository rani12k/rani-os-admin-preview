const build = '2026-07-05-ADMIN-WORKFLOW-GUIDED-001';
const previewUrl = 'https://rani12k.github.io/rani-os-admin-preview/env/dev/?v=cr017-guided';
const links = {
  chat: 'https://chatgpt.com/',
  codex: 'https://chatgpt.com/codex',
  prs: 'https://github.com/rani12k/rani-os-admin-preview/pulls',
  repo: 'https://github.com/rani12k/rani-os-admin-preview',
  adminDev: previewUrl,
  adminProd: 'https://rani12k.github.io/rani-os-admin-preview/'
};
let selectedFlow = 'chat-to-codex';

const flows = {
  'chat-to-codex': {
    label: 'ChatGPT → Codex',
    title: 'יש לי החלטה / תיקון / משימה מהצ׳אט — להריץ בקודקס',
    tool: 'Codex Cloud',
    openLabel: 'פתח Codex',
    openUrl: links.codex,
    action: 'העתק את הבלוק למטה והדבק אותו ב-Codex.',
    returnTo: 'אחרי ש-Codex מסיים: חזור ל-ChatGPT עם Result Packet / PR link.',
    steps: [
      'לחץ Copy על הבלוק.',
      'פתח Codex Cloud.',
      'הדבק את הבלוק כמשימה חדשה.',
      'אל תוסיף הסברים מחוץ למשימה.',
      'בסיום, החזר ל-ChatGPT את Result Packet או קישור PR.'
    ],
    copyLabel: 'העתק ל-Codex',
    copy: `Repository: rani12k/rani-os-admin-preview

Work Item:
ADMIN-WORKFLOW-HUB-001 — Guided Operator Flow And Automation Backbone

Task:
Implement a DEV-only guided operator flow preview.

User feedback:
- The copy/paste section must not be generic.
- The screen must tell the owner exactly which tool to use now.
- The screen must say exactly what to copy and where to paste it.
- Tool information must be sequential, not encyclopedic.
- The product may need automation backbone before more dashboard UI.

Required outcome:
Replace the current Development Tools experience with a simple guided operator flow:
1. Current Step
2. Tool to use now
3. Exact action
4. Copy block
5. Where to paste
6. What to return
7. Validation after return

Scope:
- DEV preview only.
- Do not change PROD entrypoint.
- Do not modify production index.html.
- Do not remove stable build files.

Preferred files:
- Add app-cr017.js
- Update only env/dev/index.html to load app-cr017.js

Acceptance criteria:
- Owner can immediately know which tool to open.
- Owner can copy one exact block into Codex / ChatGPT.
- Owner can see where the returned result goes.
- Advanced reference is collapsed by default.
- No dense tables in the main workflow.

Stop after PR.
Commit message: Add guided operator flow DEV preview`
  },
  'codex-to-chat': {
    label: 'Codex → ChatGPT',
    title: 'Codex סיים — להחזיר תוצאה לצ׳אט לאימות',
    tool: 'ChatGPT / RANI_OS chat',
    openLabel: 'פתח ChatGPT',
    openUrl: links.chat,
    action: 'העתק את מבנה ה-Result Packet והדבק אותו בצ׳אט עם התוצאה של Codex.',
    returnTo: 'ChatGPT יאמת מול GitHub master ויחליט PASS / FAIL / תיקון.',
    steps: [
      'פתח את שיחת RANI_OS הפעילה.',
      'הדבק Result Packet מסודר.',
      'צרף PR link אם קיים.',
      'ציין אילו קבצים שונו.',
      'בקש אימות מול GitHub master לפני המשך.'
    ],
    copyLabel: 'העתק Result Packet Template',
    copy: `Codex Result Packet

Repository:
rani12k/rani-os-admin-preview

Work Item:
ADMIN-WORKFLOW-HUB-001 — Guided Operator Flow And Automation Backbone

What Codex changed:
1.
2.
3.

Files changed:
-
-

Commit / PR:

Validation requested:
Read GitHub master / PR diff before answering.
Verify that:
1. PROD entrypoint was not changed.
2. DEV preview loads the guided operator flow.
3. Main screen shows tool → action → copy → paste → return.
4. Advanced reference is collapsed by default.

Return:
- PASS / FAIL
- Reason
- Next safe action`
  },
  'github-review': {
    label: 'GitHub PR Review',
    title: 'יש PR — לבדוק לפני Merge',
    tool: 'GitHub Pull Requests',
    openLabel: 'פתח GitHub PRs',
    openUrl: links.prs,
    action: 'פתח את ה-PR ובדוק רק את הדברים הקריטיים.',
    returnTo: 'אחרי Review/Merge חזור ל-ChatGPT עם PR status.',
    steps: [
      'פתח GitHub PRs.',
      'בדוק Changed files.',
      'ודא ש-PROD index.html לא שונה.',
      'ודא שהשינוי מוגבל ל-DEV preview.',
      'אם תקין: Merge. אם לא: החזר הערה ל-Codex.'
    ],
    copyLabel: 'העתק Review Checklist',
    copy: `GitHub PR Review Checklist

Check:
[ ] PROD index.html was not changed
[ ] Stable app-cr016.js was not removed
[ ] DEV environment loads app-cr017.js
[ ] Main screen is guided, not dashboard-heavy
[ ] Copy/paste block is specific to the selected flow
[ ] Advanced tool/reference content is collapsed
[ ] Owner can perform next action without guessing

Decision:
PASS / FAIL

Notes:`
  },
  'screenshot-review': {
    label: 'Screenshot → ChatGPT',
    title: 'יש צילום מסך — להחזיר לצ׳אט לביקורת Owner-visible',
    tool: 'ChatGPT',
    openLabel: 'פתח ChatGPT',
    openUrl: links.chat,
    action: 'העלה צילום מסך והדבק את טופס הביקורת.',
    returnTo: 'ChatGPT יסווג אם זה Owner-visible PASS או דורש תיקון.',
    steps: [
      'פתח את DEV preview.',
      'צלם מסך במובייל או בדסקטופ.',
      'העלה את הצילום ל-ChatGPT.',
      'הדבק את טופס הביקורת.',
      'בקש החלטת PASS / FAIL.'
    ],
    copyLabel: 'העתק Screenshot Review Prompt',
    copy: `Owner-visible Screenshot Review

Screen:
ADMIN-WORKFLOW-HUB-001 DEV Preview

Question:
Does this screen clearly tell me:
1. which tool to use now,
2. what exact action to perform,
3. what text to copy,
4. where to paste it,
5. what result to return,
6. what validation happens next?

Decision needed:
PASS / FAIL

If FAIL:
State the smallest correction required.`
  },
  'admin-preview': {
    label: 'Open Admin DEV',
    title: 'לפתוח את מסך ה-DEV ולבדוק שהוא מנווט עבודה',
    tool: 'Admin DEV Preview',
    openLabel: 'פתח Admin DEV',
    openUrl: links.adminDev,
    action: 'פתח את ה-DEV preview ובדוק אם המסך עונה על הפעולה הבאה בלבד.',
    returnTo: 'אם המסך לא ברור — חזור ל-ChatGPT עם מה חסר.',
    steps: [
      'פתח Admin DEV.',
      'בחר Flow.',
      'קרא את Current Step.',
      'ודא שיש Copy block אחד ברור.',
      'ודא שאין עומס כלים לפני הפעולה.'
    ],
    copyLabel: 'העתק Owner Feedback Template',
    copy: `Owner Feedback — Guided Operator Flow

What I tried to do:

Where I got stuck:

Was the next tool clear? YES / NO
Was the exact copy/paste clear? YES / NO
Was there too much information? YES / NO

Smallest required fix:`
  }
};

function esc(value){
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function css(){
  document.head.innerHTML = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RANI OS Guided Operator Flow</title><style>
:root{--bg:#07111f;--panel:#0d1b2e;--panel2:#11243a;--text:#e8eef7;--muted:#9fb0c7;--border:#223855;--blue:#60a5fa;--green:#36d399;--yellow:#fbbf24;--red:#fb7185}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,sans-serif;line-height:1.45;direction:rtl}a{color:inherit}.frame{position:fixed;inset:0;border:5px solid #7dd3fc;pointer-events:none;z-index:999}.top{position:sticky;top:0;background:#08162a;border-bottom:1px solid var(--border);padding:12px 14px;z-index:10}.top h1{font-size:20px;margin:0 0 4px}.sub{color:var(--muted);font-size:13px}.build{direction:ltr;display:inline-block}.wrap{padding:12px;display:grid;gap:12px;max-width:1100px;margin:0 auto}.hero,.panel,.current,.copybox,.warning{background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:14px}.hero{background:linear-gradient(135deg,rgba(96,165,250,.20),rgba(54,211,153,.08));border-color:rgba(96,165,250,.55)}.hero h2,.panel h2{margin:0 0 8px;font-size:19px}.flowgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px}.flowgrid button,.btn,.copybtn{border:1px solid var(--border);border-radius:13px;background:var(--panel2);color:var(--text);padding:12px;font:inherit;font-weight:800;cursor:pointer;text-align:right}.flowgrid button.active{background:var(--blue);color:#07111f;border-color:var(--blue)}.current{display:grid;gap:10px}.row{display:grid;grid-template-columns:120px 1fr;gap:10px;align-items:start}.label{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.04em;font-weight:900}.value{font-size:17px;font-weight:800}.bigAction{font-size:20px;font-weight:900;color:#bfdbfe}.steps{margin:0;padding-inline-start:22px;display:grid;gap:8px}.steps li{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:11px;padding:10px}.actions{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px}.btn{display:block;text-align:center;text-decoration:none;background:var(--blue);color:#07111f;min-height:48px}.btn.secondary{background:var(--panel2);color:var(--text)}.copyHeader{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.copyHeader h3{margin:0;font-size:16px}.copybtn{background:rgba(54,211,153,.18);border-color:rgba(54,211,153,.55);color:var(--green)}pre{white-space:pre-wrap;direction:ltr;text-align:left;background:#050b15;border:1px solid var(--border);border-radius:12px;padding:12px;margin:0;font-size:13px;line-height:1.5;overflow:auto}.warning{border-color:rgba(251,191,36,.55);background:rgba(251,191,36,.12)}details{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:12px}summary{cursor:pointer;font-weight:900;color:var(--blue)}.mini{color:var(--muted);font-size:13px;margin-top:8px}@media(max-width:720px){.wrap{padding:8px}.row{grid-template-columns:1fr}.value,.bigAction{font-size:17px}.flowgrid,.actions{grid-template-columns:1fr}.top h1{font-size:18px}}
  </style>`;
}

function render(){
  const flow = flows[selectedFlow] || flows['chat-to-codex'];
  document.body.innerHTML = `<div class="frame"></div><header class="top"><h1>RANI OS — Guided Operator Flow</h1><div class="sub">DEV preview · <span class="build">${esc(build)}</span> · המטרה: כלי → פעולה → העתקה → הדבקה → החזרה</div></header><main class="wrap"><section class="hero"><h2>מה אתה עושה עכשיו?</h2><div class="flowgrid">${Object.entries(flows).map(([id,item])=>`<button data-flow="${esc(id)}" class="${id===selectedFlow?'active':''}">${esc(item.label)}</button>`).join('')}</div></section><section class="current"><div class="row"><div class="label">Current Step</div><div class="bigAction">${esc(flow.title)}</div></div><div class="row"><div class="label">Tool עכשיו</div><div class="value">${esc(flow.tool)}</div></div><div class="row"><div class="label">פעולה</div><div class="value">${esc(flow.action)}</div></div><div class="row"><div class="label">אחרי הפעולה</div><div class="value">${esc(flow.returnTo)}</div></div><div class="actions"><a class="btn" href="${esc(flow.openUrl)}" target="_blank" rel="noopener noreferrer">${esc(flow.openLabel)}</a><a class="btn secondary" href="${esc(links.prs)}" target="_blank" rel="noopener noreferrer">פתח GitHub PRs</a><a class="btn secondary" href="${esc(links.adminDev)}" target="_blank" rel="noopener noreferrer">פתח Admin DEV</a></div></section><section class="panel"><h2>רצף פעולה</h2><ol class="steps">${flow.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></section><section class="copybox"><div class="copyHeader"><h3>${esc(flow.copyLabel)}</h3><button class="copybtn" data-copy="main">Copy</button></div><pre id="main-copy">${esc(flow.copy)}</pre><div class="mini">זה הבלוק היחיד שאמור להעתיק כרגע. לא צריך לקרוא את כל הכלים לפני הפעולה.</div></section><section class="warning"><strong>Automation Backbone:</strong> המסך הזה עדיין לא מפעיל כלים אוטומטית. הוא מגדיר את הרצף הידני המדויק עד שהאוטומציה תושלם.</section><details><summary>Advanced / Reference — סגור כברירת מחדל</summary><div class="mini">External apps are launched, not embedded. GitHub remains Source of Truth. PROD is not modified by this DEV preview. Future automation should turn each selected flow into a tracked work item with expected return packet and validation rule.</div></details></main>`;
  wire();
}

function wire(){
  document.querySelectorAll('[data-flow]').forEach(btn => btn.onclick = () => { selectedFlow = btn.dataset.flow; render(); });
  document.querySelectorAll('[data-copy]').forEach(btn => btn.onclick = async () => {
    const text = document.getElementById('main-copy')?.innerText || '';
    try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied'; }
    catch(e){ btn.textContent = 'Select + Copy'; }
    setTimeout(()=>btn.textContent='Copy',1400);
  });
}

css();
render();
