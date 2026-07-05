const build = '2026-07-05-ADMIN-WORKFLOW-GUIDED-002';
const previewUrl = 'https://rani12k.github.io/rani-os-admin-preview/env/dev/?v=cr017-guided-002';
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
    label: 'יש לי משימה מהצ׳אט',
    short: 'ChatGPT → Codex',
    title: 'להריץ משימת ביצוע ב-Codex',
    targetTool: 'Codex Cloud',
    primaryLabel: 'פתח Codex עכשיו',
    primaryUrl: links.codex,
    exactAction: 'העתק את הבלוק למטה והדבק אותו כמשימה חדשה ב-Codex.',
    pasteWhere: 'Codex Cloud — New task / existing task input',
    expectedReturn: 'PR link או Codex Result Packet עם קבצים ששונו, Commit, ומה בוצע.',
    validationRule: 'חזור ל-ChatGPT. אין ממשיכים בלי אימות GitHub master / PR diff.',
    nextState: 'Codex סיים עבודה → עבור ל-Flow: Codex סיים עבודה',
    steps: [
      'לחץ Copy על הבלוק.',
      'פתח Codex Cloud.',
      'הדבק את הבלוק כמשימה חדשה.',
      'ודא ש-Codex עוצר אחרי PR / Commit.',
      'חזור עם Result Packet או PR link.'
    ],
    copyLabel: 'Copy exact Codex task',
    copy: `Repository: rani12k/rani-os-admin-preview

Work Item:
ADMIN-WORKFLOW-HUB-001 — Guided Operator Flow And Automation Backbone

Task:
Patch the DEV-only guided operator flow preview.

Owner-approved direction:
- Reduce ambiguity.
- Show one primary tool/action at a time.
- Use user-language flow names.
- Add Step state.
- Add Expected Return.
- Add Automation Backbone metadata.
- Keep advanced tools/reference collapsed.

Scope:
- DEV preview only.
- Do not modify production index.html.
- Do not remove stable CR-016 files.
- Prefer changes only in app-cr017.js and env/dev/index.html cache/build metadata.

Acceptance criteria:
1. The current screen has one dominant primary action button.
2. Secondary tools are hidden under a collapsed section.
3. Flow names are phrased like user intents, not system architecture.
4. The screen shows Step 1 of N.
5. The screen has a separate Expected Return box.
6. The screen exposes automation metadata in a collapsed section.
7. Main workflow has no dense tables.

Stop after PR update.
Commit message: Refine guided operator flow clarity`
  },
  'codex-to-chat': {
    label: 'Codex סיים עבודה',
    short: 'Codex → ChatGPT',
    title: 'להחזיר תוצאה לצ׳אט לאימות',
    targetTool: 'ChatGPT / RANI_OS chat',
    primaryLabel: 'פתח ChatGPT עכשיו',
    primaryUrl: links.chat,
    exactAction: 'העתק את תבנית Result Packet, מלא אותה לפי תוצאת Codex, והדבק בצ׳אט.',
    pasteWhere: 'שיחת RANI_OS הפעילה ב-ChatGPT',
    expectedReturn: 'ChatGPT מחזיר PASS / FAIL, סיבת החלטה, והפעולה הבטוחה הבאה.',
    validationRule: 'ChatGPT חייב לקרוא GitHub master או PR diff לפני החלטה.',
    nextState: 'אם PASS → GitHub Review / Merge. אם FAIL → תיקון ל-Codex.',
    steps: [
      'פתח את שיחת RANI_OS הפעילה.',
      'הדבק Result Packet מסודר.',
      'צרף PR link אם קיים.',
      'ציין אילו קבצים שונו.',
      'בקש אימות מול GitHub master לפני המשך.'
    ],
    copyLabel: 'Copy Result Packet template',
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
3. Main screen shows one primary tool/action.
4. The flow has Step state and Expected Return.
5. Advanced tools/reference are collapsed by default.

Return:
- PASS / FAIL
- Reason
- Next safe action`
  },
  'github-review': {
    label: 'יש PR לבדוק',
    short: 'GitHub PR Review',
    title: 'לבדוק PR לפני Merge',
    targetTool: 'GitHub Pull Requests',
    primaryLabel: 'פתח GitHub PRs עכשיו',
    primaryUrl: links.prs,
    exactAction: 'פתח את ה-PR ובדוק רק את Checklist הבטיחות.',
    pasteWhere: 'GitHub PR review / comment / merge decision',
    expectedReturn: 'סטטוס PR: PASS / FAIL / Merged / Needs changes.',
    validationRule: 'אסור למזג אם PROD entrypoint או stable build files השתנו ללא Owner Gate.',
    nextState: 'אם Merged → פתח Admin DEV ובצע Screenshot Review.',
    steps: [
      'פתח GitHub PRs.',
      'בדוק Changed files.',
      'ודא ש-PROD index.html לא שונה.',
      'ודא שהשינוי מוגבל ל-DEV preview.',
      'אם תקין: Merge. אם לא: החזר הערה לתיקון.'
    ],
    copyLabel: 'Copy PR review checklist',
    copy: `GitHub PR Review Checklist

Check:
[ ] PROD index.html was not changed
[ ] Stable app-cr016.js was not removed
[ ] DEV environment loads app-cr017.js
[ ] Main screen shows one primary tool/action
[ ] Flow names are user-intent based
[ ] Expected Return is visible
[ ] Advanced tools/reference content is collapsed
[ ] Owner can perform next action without guessing

Decision:
PASS / FAIL

Notes:`
  },
  'screenshot-review': {
    label: 'יש צילום מסך לבדיקה',
    short: 'Screenshot → ChatGPT',
    title: 'להחזיר צילום מסך לביקורת Owner-visible',
    targetTool: 'ChatGPT',
    primaryLabel: 'פתח ChatGPT עכשיו',
    primaryUrl: links.chat,
    exactAction: 'העלה צילום מסך של DEV preview והדבק את טופס הביקורת.',
    pasteWhere: 'שיחת RANI_OS הפעילה ב-ChatGPT',
    expectedReturn: 'Owner-visible PASS / FAIL וה-Smallest correction אם נכשל.',
    validationRule: 'החלטה מבוססת על צילום מסך, לא על הנחת קוד.',
    nextState: 'אם PASS → Candidate for promotion. אם FAIL → Patch נוסף ב-DEV.',
    steps: [
      'פתח את DEV preview.',
      'צלם מסך במובייל או בדסקטופ.',
      'העלה את הצילום ל-ChatGPT.',
      'הדבק את טופס הביקורת.',
      'בקש החלטת PASS / FAIL.'
    ],
    copyLabel: 'Copy screenshot review prompt',
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
    label: 'אני רוצה לבדוק את ה-Admin DEV',
    short: 'Admin DEV Preview',
    title: 'לפתוח את מסך DEV ולבדוק שהוא מנווט עבודה',
    targetTool: 'Admin DEV Preview',
    primaryLabel: 'פתח Admin DEV עכשיו',
    primaryUrl: links.adminDev,
    exactAction: 'פתח את ה-DEV preview ובדוק אם ברור מה הפעולה הבאה בלבד.',
    pasteWhere: 'אם יש בעיה — חזור ל-ChatGPT עם Owner Feedback.',
    expectedReturn: 'Owner Feedback קצר: מה היה לא ברור ומה התיקון הקטן ביותר.',
    validationRule: 'Owner review קובע אם זה מספיק ברור להפעלה יומיומית.',
    nextState: 'אם ברור → Screenshot Review. אם לא → Patch נוסף.',
    steps: [
      'פתח Admin DEV.',
      'בחר Flow לפי מה שאתה עושה עכשיו.',
      'קרא את Current Step.',
      'ודא שיש Copy block אחד ברור.',
      'ודא שאין עומס כלים לפני הפעולה.'
    ],
    copyLabel: 'Copy owner feedback template',
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

function automationMeta(flow){
  return {
    input_required: flow.copyLabel,
    target_tool: flow.targetTool,
    copy_payload: 'selected flow copy block',
    paste_where: flow.pasteWhere,
    expected_return: flow.expectedReturn,
    validation_rule: flow.validationRule,
    next_state: flow.nextState
  };
}

function css(){
  document.head.innerHTML = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>RANI OS Guided Operator Flow</title><style>
:root{--bg:#07111f;--panel:#0d1b2e;--panel2:#11243a;--text:#e8eef7;--muted:#9fb0c7;--border:#223855;--blue:#60a5fa;--green:#36d399;--yellow:#fbbf24;--red:#fb7185;--cyan:#7dd3fc}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,sans-serif;line-height:1.45;direction:rtl}a{color:inherit}.frame{position:fixed;inset:0;border:5px solid var(--cyan);pointer-events:none;z-index:999}.top{position:sticky;top:0;background:#08162a;border-bottom:1px solid var(--border);padding:12px 14px;z-index:10}.top h1{font-size:20px;margin:0 0 4px}.sub{color:var(--muted);font-size:13px}.build{direction:ltr;display:inline-block}.wrap{padding:12px;display:grid;gap:12px;max-width:1040px;margin:0 auto}.hero,.panel,.current,.copybox,.warning,.expected,.metadata{background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:14px}.hero{background:linear-gradient(135deg,rgba(96,165,250,.20),rgba(54,211,153,.08));border-color:rgba(96,165,250,.55)}h2,h3{margin:0 0 8px}.hero h2,.panel h2{font-size:19px}.flowgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px}.flowgrid button,.btn,.copybtn{border:1px solid var(--border);border-radius:13px;background:var(--panel2);color:var(--text);padding:12px;font:inherit;font-weight:800;cursor:pointer;text-align:right}.flowgrid button.active{background:var(--blue);color:#07111f;border-color:var(--blue)}.selected-mini{margin-top:8px;color:#bfdbfe;font-weight:900}.current{display:grid;gap:10px}.stepPill{display:inline-block;direction:ltr;background:rgba(96,165,250,.18);border:1px solid rgba(96,165,250,.55);color:#bfdbfe;border-radius:999px;padding:6px 10px;font-size:13px;font-weight:900}.row{display:grid;grid-template-columns:130px 1fr;gap:10px;align-items:start}.label{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.04em;font-weight:900}.value{font-size:17px;font-weight:800}.bigAction{font-size:21px;font-weight:900;color:#bfdbfe}.primaryAction{display:grid;gap:8px}.btn{display:block;text-align:center;text-decoration:none;background:var(--blue);color:#07111f;min-height:54px;font-size:18px}.btn.secondary{background:var(--panel2);color:var(--text);font-size:15px}.steps{margin:0;padding-inline-start:22px;display:grid;gap:8px}.steps li{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:11px;padding:10px}.expected{border-color:rgba(54,211,153,.55);background:rgba(54,211,153,.10)}.expected strong{color:var(--green)}.copyHeader{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.copyHeader h3{margin:0;font-size:16px}.copybtn{background:rgba(54,211,153,.18);border-color:rgba(54,211,153,.55);color:var(--green)}pre{white-space:pre-wrap;direction:ltr;text-align:left;background:#050b15;border:1px solid var(--border);border-radius:12px;padding:12px;margin:0;font-size:13px;line-height:1.5;overflow:auto}.warning{border-color:rgba(251,191,36,.55);background:rgba(251,191,36,.12)}details{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:12px}summary{cursor:pointer;font-weight:900;color:var(--blue)}.mini{color:var(--muted);font-size:13px;margin-top:8px}.toolgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-top:10px}.metaline{display:grid;grid-template-columns:160px 1fr;gap:8px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.08)}.metakey{color:var(--muted);font-weight:900;direction:ltr}.metaval{font-weight:700}@media(max-width:720px){.wrap{padding:8px}.row,.metaline{grid-template-columns:1fr}.value,.bigAction{font-size:17px}.flowgrid,.toolgrid{grid-template-columns:1fr}.top h1{font-size:18px}.btn{font-size:17px}}
  </style>`;
}

function render(){
  const flow = flows[selectedFlow] || flows['chat-to-codex'];
  const meta = automationMeta(flow);
  document.body.innerHTML = `<div class="frame"></div><header class="top"><h1>RANI OS — Guided Operator Flow</h1><div class="sub">DEV preview · <span class="build">${esc(build)}</span> · כלי אחד → פעולה אחת → החזרה אחת</div></header><main class="wrap"><section class="hero"><h2>מה אתה עושה עכשיו?</h2><div class="flowgrid">${Object.entries(flows).map(([id,item])=>`<button data-flow="${esc(id)}" class="${id===selectedFlow?'active':''}">${esc(item.label)}</button>`).join('')}</div><div class="selected-mini">נבחר: ${esc(flow.short)}</div></section><section class="current"><div><span class="stepPill">Step 1 of ${flow.steps.length}</span></div><div class="row"><div class="label">Current Step</div><div class="bigAction">${esc(flow.title)}</div></div><div class="row"><div class="label">Tool עכשיו</div><div class="value">${esc(flow.targetTool)}</div></div><div class="row"><div class="label">פעולה מדויקת</div><div class="value">${esc(flow.exactAction)}</div></div><div class="row"><div class="label">להדביק ב</div><div class="value">${esc(flow.pasteWhere)}</div></div><div class="primaryAction"><a class="btn" href="${esc(flow.primaryUrl)}" target="_blank" rel="noopener noreferrer">${esc(flow.primaryLabel)}</a></div></section><section class="expected"><h2>מה אמור לחזור?</h2><div><strong>Expected Return:</strong> ${esc(flow.expectedReturn)}</div><div class="mini"><strong>Validation:</strong> ${esc(flow.validationRule)}</div><div class="mini"><strong>Next:</strong> ${esc(flow.nextState)}</div></section><section class="panel"><h2>רצף פעולה</h2><ol class="steps">${flow.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></section><section class="copybox"><div class="copyHeader"><h3>${esc(flow.copyLabel)}</h3><button class="copybtn" data-copy="main">Copy</button></div><pre id="main-copy">${esc(flow.copy)}</pre><div class="mini">זה הבלוק היחיד שאמור להעתיק כרגע.</div></section><section class="warning"><strong>Automation Backbone:</strong> עדיין אין הפעלה אוטומטית מלאה. אבל כל Flow כבר מוגדר כ-input → tool → payload → expected return → validation → next state.</section><details><summary>כלים נוספים — סגור כדי לא לבלבל את הפעולה הראשית</summary><div class="toolgrid"><a class="btn secondary" href="${esc(links.chat)}" target="_blank" rel="noopener noreferrer">ChatGPT</a><a class="btn secondary" href="${esc(links.codex)}" target="_blank" rel="noopener noreferrer">Codex</a><a class="btn secondary" href="${esc(links.prs)}" target="_blank" rel="noopener noreferrer">GitHub PRs</a><a class="btn secondary" href="${esc(links.adminDev)}" target="_blank" rel="noopener noreferrer">Admin DEV</a></div></details><details><summary>Automation metadata — סגור כברירת מחדל</summary><div class="metadata">${Object.entries(meta).map(([k,v])=>`<div class="metaline"><div class="metakey">${esc(k)}</div><div class="metaval">${esc(v)}</div></div>`).join('')}</div></details><details><summary>Advanced / Reference — סגור כברירת מחדל</summary><div class="mini">External apps are launched, not embedded. GitHub remains Source of Truth. PROD is not modified by this DEV preview. Future automation should consume the metadata above and track actual work item state.</div></details></main>`;
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
