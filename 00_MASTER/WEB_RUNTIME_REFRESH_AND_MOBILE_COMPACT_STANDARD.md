# WEB_RUNTIME_REFRESH_AND_MOBILE_COMPACT_STANDARD

Status: ACTIVE
Scope: Admin Web public preview environments
Source of Truth: repository

## Current Safe State

Current safe DEV recovery state:

```text
commit: 9bfc2fe3173e9a29e138193a6c127e5b2ede7b14
file: env/dev/index.html
runtime: ../../app-cr016.js?build=dev-direct-cr016-recovery-002
```

This recovery restored direct canonical runtime loading after failed display overlays. It must be the recovery point if information disappears or the UI becomes unreadable.

## Problem

The Admin Web can appear unchanged online even after repository fixes are merged. The user may see stale web output, old runtime behavior, or a visually unusable mobile page even when GitHub main contains the expected code.

A web refresh fix is accepted only after the permanent URL shows the owner-visible expected change.

## Working Runtime Refresh Pattern

Do not solve web refresh problems by changing the public URL.

The permanent environment URL must remain stable:

```text
https://rani12k.github.io/rani-os-admin-preview/env/dev/
```

The refresh/cache-bust belongs inside the environment entrypoint script src, not in the public URL.

The environment page must keep `window.RANI_ENV` before loading the runtime, then load the canonical runtime directly.

Preferred:

```text
env/dev/index.html -> app-cr016.js?build=<internal-cache-key>
```

Avoid unnecessary loader chains:

```text
env/dev/index.html -> app-dev.js -> app-cr016.js
```

## Confirmed Refresh Solution

Owner-visible refresh/load PASS was confirmed after direct runtime loading and entrypoint-level cache-bust.

Known working markers from the first successful pass:

```text
app-cr016.js?build=dev-mobile-compact-001
dev-mobile-compact-001
```

Known safe recovery markers after failed display attempts:

```text
app-cr016.js?build=dev-direct-cr016-recovery-001
app-cr016.js?build=dev-direct-cr016-recovery-002
```

## Failed Attempts — Do Not Reuse

### dev-mobile-compact-002

`dev-mobile-compact-002` failed.

Failure mode:

- App Scope / tab navigation was visually broken.
- Tasks, capabilities, reports, and other Admin information disappeared or became inaccessible/hidden.
- The attempted horizontal-scroll navigation and aggressive mobile overrides damaged the owner-visible UI.

Do not reintroduce:

```text
dev-mobile-compact-002
```

### dev-table-readability-001

`dev-table-readability-001` failed.

Failure mode:

- The information layer remained fragile.
- Mobile table changes still caused an owner-visible broken page.
- Any entrypoint CSS override that targets runtime table internals can break the Admin Web presentation.

Do not reintroduce:

```text
dev-table-readability-001
```

## Do Not Use Overlay Fixes Until Runtime UI Is Refactored

Do not use aggressive or entrypoint-level CSS overlays that:

- turn App Scope or tabs into clipped horizontal rows
- hide or reshape navigation structures
- hide data sections
- alter reports / capabilities / tasks visibility
- change runtime data assumptions
- override `.tablewrap`, `table`, `th`, or `td` from the entrypoint

Future display work should be done inside a controlled runtime refactor of `app-cr016.js`, not by entrypoint overlays, unless the change is proven in a visual preview first.

## Required Recovery Procedure

If the page appears stale, unchanged, or information disappears:

1. Verify `env/dev/index.html` on `main`, not only PR summary.
2. Confirm `window.RANI_ENV` appears before the runtime script.
3. Confirm the script loads `app-cr016.js` directly.
4. Confirm no `app-dev.js` loader chain exists.
5. Confirm no forbidden Workflow/DevTools/Guided markers exist.
6. If data disappeared after an overlay, immediately return to direct runtime loading without overlay.

Expected safe check:

```bash
grep -n "app-cr016.js?build=dev-direct-cr016-recovery-002" env/dev/index.html
grep -n "app-dev.js" env/dev/index.html && exit 1 || true
grep -RIn "Workflow Hub\|Development Tools\|Guided Operator Flow\|CR-017-WORKFLOW-GUIDED" env/dev/index.html app-cr016.js || true
```

## Do Not Repeat

Do not treat these as sufficient proof:

- PR body says cache is fixed
- grep/static checks pass only
- hash matches a baseline but owner-visible page is unchanged
- a cache-bust is added to a temporary public URL
- a compact overlay looks reasonable in code but hides owner-visible information
- a table-only CSS overlay looks safe but changes runtime internals

## Related Historical Points

Pre-polish engineering principles came from early Admin environment work:

- PR #1: single-file CR-016 stable build, replacing patch-chain preview issues
- PR #5: physical non-production entrypoints and `assetBase` for nested env pages
- PR #6: persistent environment metadata and environment separation checks

Earlier mobile/readability work that must not be regressed:

- PR #2: Version Center and CI/CD stacked mobile cards without horizontal scrolling.
- PR #3: Version Center-specific mobile cards with lower-priority fields in collapsed details.
- PR #4: CR-016 mobile card readability, improved spacing, hierarchy, wrapping, and collapsed details.
