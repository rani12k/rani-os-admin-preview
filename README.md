# RANI OS Admin Public Preview

Status:
Public Preview Package / Refresh-Safe Mobile-Compressed Dashboard

Purpose:
Provide a safe public preview package for the Admin UI without exposing the private `RANI_OS` repository.

Fixed preview URL:

`https://raw.githack.com/rani12k/rani-os-admin-preview/main/index.html`

Workflow:

- Open the fixed preview URL once.
- After every dashboard update, refresh the same page.
- `index.html` loads `app.js` with a timestamp.
- `app.js` loads `state.json` and `managed-work.json` with `cache: no-store`.
- Future fixes should update `state.json`, `managed-work.json`, `app.js`, or `index.html` without changing the review URL.

Current dashboard coverage:

- 9 Admin Web planning sections.
- Capability Inventory from sanitized Capability Roadmap data.
- Language & UX lane.
- Operating Principles.
- Work Packages.
- Task List.
- Lane Status.
- Owner Gates.
- Traceability.
- Repository Boundary.
- Next Actions.
- Managed Work Inventory.
- Mobile Review Summary.

Mobile density patch:

- Adds quick section navigation at the top.
- Keeps action-oriented panels open on phone.
- Collapses deep inventory sections by default on phone.
- Renders table data as compact cards on phone.
- Preserves full expanded dashboard on desktop.

Security boundary:
This public preview contains only sanitized UI demo data. It does not contain private RANI_OS source-of-truth files, internal logs, private repository metadata, secrets, tokens, trading evidence, or proprietary implementation details.
