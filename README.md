# RANI OS Admin Public Preview

Status:
Public Preview Package / Control Room + Searchable Work Register

Purpose:
Provide a safe public preview package for the Admin UI without exposing the private `RANI_OS` repository.

Pages:

- `index.html` — Admin Control Room / חדר בקרה ראשי.
- `work-register.html` — Searchable Work Register / רשימת עבודה כללית עם חיפוש וסינון.

Fixed preview URL:

`https://raw.githack.com/rani12k/rani-os-admin-preview/main/index.html`

Cache-busting review URLs:

- `index.html?v=20260703-cr001`
- `work-register.html?v=20260703-wr001`

Workflow:

- Open the fixed preview URL once.
- If the page does not visibly change after refresh, open the same page with the cache-busting query above.
- `index.html` is now the control room, not the full register.
- `work-register.html` loads `managed-work.json` and provides searchable visible register rows.
- `state.json` and `managed-work.json` are loaded with `cache: no-store`.

Current dashboard coverage:

- Main Control Room with quantitative KPIs at the top.
- Owner Gate and Next Action.
- Work Streams.
- Lane Status.
- System Health.
- Link to full Work Register page.
- Searchable Work Register page.
- Ideas / Bugs / Completed / Planned categories.
- General visible record list with search.
- Category and lifecycle filters.
- Active Execution Slice remains separate from the backlog.

Repo-backed correction:

- The preview must not imply that the visible active execution slice is the full RANI_OS backlog.
- The Artifact Register records 126 governed artifacts.
- The Capability Roadmap tracks 21 capabilities.
- The Candidate Register contains managed ideas, bugs, deferred candidates, planned items, completed items, and behavior-PASS records.
- The Candidate Register is not a full backlog, scheduler, discovery engine, or task manager.
- The preview now shows representative register categories and representative source rows instead of collapsing the work into a small task list.
- Exact sanitized candidate / bug / idea counts have not yet been generated in this public preview.

Security boundary:
This public preview contains only sanitized UI demo data. It does not contain private RANI_OS source-of-truth files, internal logs, private repository metadata, secrets, tokens, trading evidence, or proprietary implementation details.
