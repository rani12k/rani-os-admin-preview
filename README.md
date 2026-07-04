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

Operational cache rule:

- HTML pages should stay stable shell/loader pages.
- UI behavior must live in external JavaScript files when possible.
- External JavaScript and JSON data must be loaded with timestamp cache-busting.
- Do not rely on inline JavaScript inside cached HTML for future UI changes.
- This rule exists because RawGitHack may serve stale HTML after repository updates.

Workflow:

- Use the fixed preview URL for the main Control Room.
- If visible UI does not change after refresh, verify the external JavaScript build label first.
- `index.html` uses `app.js` as the control-room renderer.
- `work-register.html` is the second page for searchable visible register rows.
- `state.json`, `managed-work.json`, and artifact public views are loaded with cache-busting.

Current dashboard coverage:

- Main Control Room with quantitative KPIs at the top.
- Progress Analysis table: Done / Total / Percent / Open / Stuck.
- Owner Gate and Next Action.
- Work Streams.
- Lane Status.
- System Health.
- Link to full Work Register page.
- Searchable Work Register page.
- Ideas / Bugs / Completed / Planned categories.
- Artifact Register list.
- General visible record list with search.
- Category and lifecycle filters.
- Active Execution Slice remains separate from the backlog.

Repo-backed correction:

- The preview must not imply that the visible active execution slice is the full RANI_OS backlog.
- The Artifact Register records 126 governed artifacts.
- The Capability Roadmap tracks 21 capabilities.
- The Candidate Register contains managed ideas, bugs, deferred candidates, planned items, completed items, and behavior-PASS records.
- The Candidate Register is not a full backlog, scheduler, discovery engine, or task manager.
- Exact sanitized candidate / bug / idea counts have not yet been generated in this public preview.

Security boundary:
This public preview contains only sanitized UI demo data. It does not contain private RANI_OS source-of-truth files, internal logs, private repository metadata, secrets, tokens, trading evidence, or proprietary implementation details.
