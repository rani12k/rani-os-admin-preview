# WEB_RUNTIME_REFRESH_AND_MOBILE_COMPACT_STANDARD

Status: ACTIVE
Scope: Admin Web public preview environments
Source of Truth: repository
Owner-visible PASS: confirmed after DEV mobile compact overlay and direct CR016 runtime load

## Problem

The Admin Web can appear unchanged online even after repository fixes are merged. The user may see stale web output, old runtime behavior, or a visually unusable mobile page even when GitHub main contains the expected code.

This happened during DEV recovery when several technically valid fixes did not change the owner-visible page. The issue was resolved only after applying the runtime-loading principle and a DEV mobile compact overlay at the environment entrypoint.

## Working Solution Pattern

Do not solve web refresh problems by changing the public URL.

The permanent environment URL must remain stable, for example:

```text
https://rani12k.github.io/rani-os-admin-preview/env/dev/
```

The refresh/cache-bust belongs inside the environment entrypoint script src, not in the URL given to the owner.

For DEV, the working owner-confirmed pattern is:

```html
<script src="../../app-cr016.js?build=dev-mobile-compact-001"></script>
```

The environment page keeps `window.RANI_ENV` before loading the runtime, then loads the canonical runtime directly.

## Architectural Rule

Environment entrypoints should load the canonical runtime directly unless a loader is explicitly required and owner-approved.

Preferred:

```text
env/dev/index.html -> app-cr016.js?build=<internal-cache-key>
```

Avoid reintroducing unnecessary loader chains:

```text
env/dev/index.html -> app-dev.js -> app-cr016.js
```

The successful fix removed the DEV loader chain and restored direct runtime loading while preserving the permanent DEV URL.

## DEV Mobile Compact Overlay

The owner-visible PASS required a small DEV-only overlay in `env/dev/index.html` after the runtime script. The overlay does not change data or the canonical runtime file.

The overlay must preserve:

- App Scope buttons
- Reports
- Capabilities / Capability Map
- Work Records
- Artifacts
- Version Center
- CI/CD
- Owner Gates
- Drill behavior
- ENV-VISUAL-001 / environment visual identity
- No Workflow Hub
- No Development Tools
- No Guided Operator Flow

The overlay may compact mobile presentation only. In the confirmed fix it:

- reduced mobile environment bar height
- hid lower-priority environment-bar fields on mobile
- kept App Scope and tabs visible
- made KPI/cards two-column on mobile
- collapsed Environment Center by default
- allowed Environment Center tap-to-expand
- preserved all underlying runtime data and views

## Confirmed Implementation

Owner-visible PASS was confirmed after commit:

```text
a8350e90f65e1247d7a3ae7d485e576c2a05dc4a
```

Changed file:

```text
env/dev/index.html
```

Key markers:

```text
app-cr016.js?build=dev-mobile-compact-001
dev-mobile-compact-001
```

## Recovery Procedure

If the web page appears stale or unchanged again:

1. Do not change the public URL as the solution.
2. Verify the environment entrypoint on `main`, not only the PR summary.
3. Check the script src cache key in the environment entrypoint.
4. Confirm the entrypoint loads the canonical runtime directly.
5. Confirm `window.RANI_ENV` is still declared before the runtime script.
6. Confirm no loader chain was reintroduced.
7. Confirm no Workflow Hub / Development Tools / Guided Operator Flow markers were reintroduced.
8. Confirm the DEV mobile compact overlay still exists when needed.

Expected checks:

```bash
grep -n "app-cr016.js?build=dev-mobile-compact-001" env/dev/index.html
grep -n "dev-mobile-compact-001" env/dev/index.html
grep -n "app-dev.js" env/dev/index.html && exit 1 || true
grep -RIn "Workflow Hub\|Development Tools\|Guided Operator Flow\|CR-017-WORKFLOW-GUIDED" env/dev/index.html app-cr016.js || true
```

Expected changed file for this fix class:

```text
env/dev/index.html
```

Do not edit `app-cr016.js` just to solve a web refresh or mobile compact problem unless a separate runtime-level defect is proven.

## Do Not Repeat

Do not treat these as sufficient proof:

- PR body says cache is fixed
- grep/static checks pass only
- hash matches a baseline but owner-visible page is unchanged
- a cache-bust is added to a temporary public URL

A web refresh fix is accepted only after the permanent URL shows the owner-visible expected change.

## Related Historical Points

Pre-polish engineering principles came from early Admin environment work:

- PR #1: single-file CR-016 stable build, replacing patch-chain preview issues
- PR #5: physical non-production entrypoints and `assetBase` for nested env pages
- PR #6: persistent environment metadata and environment separation checks

Later recovery validated that direct runtime loading plus entrypoint-level cache-bust and DEV mobile compact overlay produced the owner-visible PASS.
