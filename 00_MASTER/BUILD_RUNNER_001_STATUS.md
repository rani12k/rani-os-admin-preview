# BUILD_RUNNER_001_STATUS

Status: BEHAVIOR PASS / OWNER VERIFIED

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
- if execution_allowed is false, any non-packet file change fails
- changed files against allowed_files / forbidden_files when execution is allowed

## Strict Gate

`.github/workflows/rani-runner-gate.yml` runs on pull requests to `main` and always calls:

```text
node tools/rani_runner.mjs validate --changed-files changed_files.txt
```

The runner default packet path is:

```text
99_RUNTIME/RUNNER_EXECUTION_PACKET.json
```

If the active packet is missing, the runner fails. Therefore future PRs that need to pass the gate must include a valid active execution packet.

## Owner Verification Results

Owner-provided verification after commit:

```text
c7d26f671c93fb7b617ea7403a6488813798b998
```

Results:

```text
Scenario 1: README.md changed, no packet -> FAIL / exit 1
Scenario 2: README.md changed, PLAN_ONLY and execution_allowed=false packet -> FAIL / exit 1
Scenario 3: README.md changed, APPROVED_WRITE and OWNER_APPROVED packet -> PASS / exit 0
git status at end: clean
```

## Behavior PASS

BUILD-RUNNER-001 reaches Behavior PASS.

The critical failure mode from the previous verification was fixed:

```text
PLAN_ONLY + changed file now fails.
```

## Operating Rule From This Point

No protected work should proceed without a valid runner packet.

The model remains a proposer. The runner is the deterministic gate.
