# RANI OS Admin Public Preview

Status:
GitHub Pages Prepared / Stable Delivery Target

Purpose:
Public sanitized Admin preview for RANI OS.

## Official Stable Preview URL

`https://rani12k.github.io/rani-os-admin-preview/`

## Legacy Preview URL

`https://raw.githack.com/rani12k/rani-os-admin-preview/main/index.html`

RawGitHack is now legacy because it served stale preview files during development.

## Current Files

- `index.html` — stable entrypoint
- `app-cr013.js` — current dashboard build
- `capability-map.json` — explicit capability operating map
- `state.json` — public state projection
- `managed-work.json` — public work projection
- `artifact-register-public.md` — public artifact projection
- `.github/workflows/pages.yml` — GitHub Pages deployment workflow
- `pages-status.json` — delivery status


## Environment Code Isolation Status

- `ENV-CODE-ISOLATION-001`: PASS
- PR #30 merged environment runtime isolation.
- PR #29 was closed as superseded/conflicted after becoming stale and was not merged.
- PROD no longer shares a runtime file with DEV, TEST, or PRE-PROD.
- Current runtime mapping:
  - PROD root `index.html` loads `app-prod.js`.
  - DEV `env/dev/index.html` loads `app-dev.js`.
  - TEST `env/test/index.html` loads `app-test.js`.
  - PRE-PROD `env/preprod/index.html` loads `app-preprod.js`.
- Future development must start in `app-dev.js` only.

## Dashboard Sections

- Control Room
- Mapping Coverage
- Priority Board
- Capability Map
- Unmapped Capabilities
- Owner Gates
- Work Records
- Artifacts
- Reports

## GitHub Pages Activation

If the stable URL does not publish automatically, enable Pages manually:

1. Repository Settings
2. Pages
3. Source: GitHub Actions
4. Save
5. Run the Pages workflow

## Boundary

This public preview is sanitized and is not the private RANI_OS source of truth.
