# CR-016 Mobile 002 Specification

Status: READY FOR CODEX IMPLEMENTATION

Purpose:
Improve CR-016 Version Center mobile readability before any production promotion.

## Current state

CR-016-MOBILE-001 loads and renders Version Center as stacked cards, but the cards are still too dense for mobile.

## Required output

Modify only:

`app-cr016.js`

Do not modify:

- index.html
- cr016-preview.html
- app-cr013.js
- app-cr014.js
- app-cr015.js
- visual-status-patch.js
- app-scope-patch.js
- JSON data files

## Required build label

Update build label to:

`2026-07-04-CR-016-MOBILE-002`

## Version Center mobile card requirements

Each card should show by default only:

1. App
2. Status chip
3. Current Stable
4. Latest Build
5. Short plain-language summary

Move these into a closed details section:

- Last Failed Version
- Rollback Reason
- Owner Gate
- Next Candidate

## Layout requirements

- Larger mobile font size.
- Better line-height.
- More vertical spacing between sections.
- Clear visual hierarchy.
- App title must be visually prominent.
- Status must appear near the top.
- Do not show every label with equal weight.
- No horizontal overflow.

## CI/CD mobile card requirements

Each card should show by default:

1. Environment
2. Status
3. Purpose

Move these into a closed details section:

- Promotion rule
- Rollback rule
- Current gap
- Next safe action

## Smoke tests

- app-cr016.js is the only changed file.
- index.html unchanged.
- cr016-preview.html unchanged.
- Build label says CR-016-MOBILE-002.
- Version Center uses readable mobile cards.
- CI/CD uses readable mobile cards.
- App Scope still works.
- No reference to patch chain files.
- node --check app-cr016.js passes, if available.

## Commit message

Improve CR016 mobile card readability

## Promotion rule

Do not promote to production.
Do not update index.html.
Owner-visible preview review is required first.
