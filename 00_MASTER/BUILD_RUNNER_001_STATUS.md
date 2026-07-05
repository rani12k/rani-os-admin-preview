# BUILD_RUNNER_001_STATUS

Status: PARTIAL IMPLEMENTATION / GATE NOT YET STRICT

## Purpose

BUILD-RUNNER-001 creates a deterministic control plane so the model cannot be the executor of record.

The runner is not based on the model. It is deterministic code. The model may propose plans, but the runner validates whether a packet is allowed.

## Implemented

- `00_MASTER/RANI_RUNNER_POLICY.json`
- `tools/rani_runner.mjs`
- `99_RUNTIME/RUNNER_EXECUTION_PACKET.example.json`
- `.github/workflows/rani-runner-gate.yml` skeleton / soft validator

## Implemented Behavior

`tools/rani_runner.mjs` validates:

- packet required fields
- mode validity
- PLAN_ONLY cannot execute
- source_of_truth_read exists
- conversation cannot be Source of Truth
- owner approval requirements when execution is allowed
- rollback point and baseline commit requirements when execution is allowed
- changed files against allowed_files / forbidden_files when a changed-files list is supplied
- protected files cannot change without approval when the validator is invoked

## Not Complete

The GitHub Actions workflow is not yet a strict gate.

The connector blocked attempts to write the stricter workflow steps that fail PRs without an active runner packet. Therefore the workflow currently runs validation only when the packet is present.

This is not a 100% enforcement state.

## Required To Reach 100%

A strict gate must be added through Codex/CLI or GitHub Web editing:

```yaml
- name: Require runner packet
  run: test -f 99_RUNTIME/RUNNER_EXECUTION_PACKET.json

- name: Validate runner packet
  run: node tools/rani_runner.mjs validate --packet 99_RUNTIME/RUNNER_EXECUTION_PACKET.json --changed-files changed_files.txt
```

or an equivalent deterministic failure step.

## Rule Until Complete

No Admin Web, model, application, or UI work may continue until the workflow is strict and owner-verified.

## Current Blocking Gap

`BUILD-RUNNER-001` is not 100% complete until:

- strict CI gate exists
- a PR without runner packet fails
- a PR with invalid packet fails
- a PR with valid packet passes
- owner confirms behavior
