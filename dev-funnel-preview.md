# RANI OS Admin Dev Funnel Preview

Status: DEV DEFINITION / NOT PRODUCTION

Purpose:
Define an isolated development preview for rebuilding the Capability Funnel without changing the stable production dashboard.

Production URL remains:
https://rani12k.github.io/rani-os-admin-preview/

Current production baseline:
CR-013 with Visual/App/Version patch.

Dev candidate:
CR-016 Safe Capability Funnel.

## Funnel Requirements

- Must not change production entrypoint.
- Must not replace app-cr013.js.
- Must load only in dev/test preview.
- Must show Total -> Mapped -> Managed -> Executable -> Validated -> Approved.
- Must show Bottlenecks: Blocked, Owner Gates, Missing Work, Low Confidence.
- Must preserve App Scope: ALL, RANI_OS, RANI_TRADING, RANI_POOL.
- Must pass loading test before owner review.

## Smoke Tests

1. Page loads without staying on Loading.
2. Build label visible.
3. App scope selector visible.
4. Funnel stage cards visible.
5. Clicking a funnel stage shows a table.
6. Version Center still works in production.
7. CI/CD still works in production.
8. Production remains stable if dev fails.

## Promotion Rule

CR-016 may move from dev to production only after owner-visible PASS.

## Rollback Rule

If CR-016 fails, production remains CR-013 stable and the failed dev build is not promoted.
