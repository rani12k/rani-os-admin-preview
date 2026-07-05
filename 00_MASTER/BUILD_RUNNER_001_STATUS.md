# BUILD_RUNNER_001_STATUS

Status: IMPLEMENTED / OWNER VERIFICATION REQUIRED

## Purpose

BUILD-RUNNER-001 creates a deterministic control plane so the model cannot be the executor of record.

The runner is not based on the model. It is deterministic code. The model may propose plans, but the runner validates whether a packet is allowed.

## Implemented Files

- `00_MASTER/RANI_RUNNER_POLICY.json`
- `tools/rani_runner.mjs`
- `99_RUNTIME/RUNNER_EXECUTION_PACKET.example.json`
- `.github/workflows/rani-runner-gate.yml`

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

## Strict Gate

`.github/workflows/rani-runner-gate.yml` now runs on pull requests to `main` and always calls:

```text
node tools/rani_runner.mjs validate --changed-files changed_files.txt
```

The runner default packet path is:

```text
99_RUNTIME/RUNNER_EXECUTION_PACKET.json
```

If the active packet is missing, the runner fails. Therefore future PRs that need to pass the gate must include a valid active execution packet.

## Important Constraint

`99_RUNTIME/RUNNER_EXECUTION_PACKET.json` is intentionally not present by default in main at this stage because attempts to create it through the connector were blocked. This makes the gate strict for future PRs: a PR must provide the packet explicitly.

## Completion Status

Implementation is complete enough to stop uncontrolled PRs:

- deterministic policy exists
- deterministic runner exists
- execution packet example exists
- pull request gate exists
- gate invokes runner unconditionally

## Remaining Owner Verification

BUILD-RUNNER-001 is not owner-verified until these are tested:

- a PR without runner packet fails
- a PR with invalid packet fails
- a PR with valid packet passes
- owner confirms behavior

## Rule Until Owner Verification

No Admin Web, model, application, or UI work may continue until owner verification is complete.
