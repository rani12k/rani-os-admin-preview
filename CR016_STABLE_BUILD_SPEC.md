# CR-016 Stable Build Specification

Status: READY FOR LOCAL/CODEX IMPLEMENTATION

Purpose:
Build a clean single-file stable Admin Web application without patch chains.

## Why CR-016 is required

The current public production works on CR-013 with patch layers.

Patch layers caused:

- cache confusion
- click handlers not updating
- failed CR-015 loading loop
- rollback complexity

CR-016 must replace the patch chain with a clean app file.

## Required output

Create:

`app-cr016.js`

Do not modify production `index.html` until CR-016 passes smoke tests.

## CR-016 must include

1. App Scope

- ALL
- RANI_OS
- RANI_TRADING
- RANI_POOL

2. Visual Status

- green PASS / Done
- yellow Warning / Review
- red Blocked / Stop
- gray Info / N/A

3. Version Center

Read from:

`version-center.json`

Show natural language version state per app:

- App
- Current Stable
- Latest Build
- Status
- Plain Language Meaning
- Last Failed Version
- Rollback Reason
- Owner Gate
- Next Candidate

4. CI/CD View

Read from:

`cicd-environments.json`

Show:

- Development
- Testing
- Pre-Prod
- Production
- Promotion rules
- Rollback rules
- Current gap
- Next safe action

5. Existing Dashboard Views

Keep or improve:

- Control Room
- Mapping Coverage
- Priority Board
- Capability Map
- Unmapped
- Owner Gates
- Work Records
- Artifacts
- Reports

6. No patch chain

CR-016 must not depend on:

- visual-status-patch.js
- app-scope-patch.js
- bootstrap redirect
- app-cr014.js
- app-cr015.js

## Data sources

CR-016 may read:

- state.json
- managed-work.json
- artifact-register-public.md
- capability-map.json
- version-center.json
- cicd-environments.json

## Required smoke tests

1. Page loads without staying on Loading.
2. Build label visible: CR-016.
3. App scope selector visible and clickable.
4. Version Center opens and shows records.
5. CI/CD opens and shows environments.
6. Capability Map opens.
7. Work Records opens.
8. Artifacts opens.
9. Mobile width does not overflow horizontally.
10. Production `index.html` is not changed until tests pass.

## Promotion rule

Only after owner-visible PASS:

- Update `index.html` to load `app-cr016.js`.
- Remove dependency on patch files from production.
- Keep CR-013 available as rollback.

## Rollback rule

If CR-016 fails:

- Do not promote to production.
- Keep production on CR-013 + current safe patches.
- Record failure in Version Center.

## Codex task

Implement `app-cr016.js` according to this specification.
Keep the implementation compact and readable.
Prefer simple functions over patch-based behavior.
Do not alter production entrypoint.
