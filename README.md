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
