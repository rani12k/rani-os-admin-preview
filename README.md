# RANI OS Admin Public Preview

Status:
Public Preview Package / Refresh-Safe Repo-Backed Work Register Dashboard

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

- Repo-backed Mobile Summary.
- Ideas / Bugs / Completed / Planned Register.
- Managed Work Coverage.
- Repository-backed Counts.
- 9 Admin Web planning sections.
- Capability Inventory from sanitized Capability Roadmap data.
- Language & UX lane.
- Operating Principles.
- Work Packages.
- Active Execution Slice.
- Lane Status.
- Owner Gates.
- Traceability.
- Repository Boundary.
- Next Actions.
- Review Finding.

Repo-backed correction:

- The preview must not imply that the visible active execution slice is the full RANI_OS backlog.
- The Artifact Register records 126 governed artifacts.
- The Capability Roadmap tracks 21 capabilities.
- The Candidate Register contains managed ideas, bugs, deferred candidates, planned items, completed items, and behavior-PASS records.
- The Candidate Register is not a full backlog, scheduler, discovery engine, or task manager.
- The preview now shows representative register categories and representative source rows instead of collapsing the work into a small task list.
- Exact sanitized candidate / bug / idea counts have not yet been generated in this public preview.

Mobile density patch:

- Adds quick section navigation at the top.
- Keeps repo-backed summary, work-register coverage, and managed-work coverage visible on phone.
- Collapses deep detail sections by default on phone.
- Renders table data as compact cards on phone.
- Preserves full expanded dashboard on desktop.

Security boundary:
This public preview contains only sanitized UI demo data. It does not contain private RANI_OS source-of-truth files, internal logs, private repository metadata, secrets, tokens, trading evidence, or proprietary implementation details.
