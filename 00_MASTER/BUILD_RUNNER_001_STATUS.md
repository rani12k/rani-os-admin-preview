# BUILD_RUNNER_001_STATUS

Status: V0.2 HARDENED / RE-VERIFICATION REQUIRED

## Purpose

BUILD-RUNNER-001 creates a deterministic control plane so the model cannot be the executor of record.

The runner is not based on the model. It is deterministic code. The model may propose plans, but the runner validates whether a packet is allowed.

## Implemented Files

- `00_MASTER/RANI_RUNNER_POLICY.json`
- `tools/rani_runner.mjs`
- `99_RUNTIME/RUNNER_EXECUTION_PACKET.example.json`
- `.github/workflows/rani-runner-gate.yml`

## V0.1 Owner Verification Results

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

V0.1 reached Behavior PASS.

## V0.2 Hardening Added

After V0.1 PASS, the policy and runner were hardened to reduce hallucination-to-action risk further.

Policy v0.2 adds machine-enforced requirements for:

- evidence_packet
- diff_contract
- baseline_lock
- state_transition
- behavior_tests
- max_files_changed

Runner v0.2 core hardening validates:

- packet required fields
- mode validity
- PLAN_ONLY cannot execute
- source_of_truth_read exists
- conversation cannot be Source of Truth
- evidence_packet is repo-verified and claim_level is verified
- diff_contract allowed_files / forbidden_files match packet lists
- baseline_lock matches baseline_commit and rollback_point
- state transition is allowed
- behavior_tests exists
- owner approval requirements when execution is allowed
- rollback point and baseline commit requirements when execution is allowed
- if execution_allowed is false, any non-packet file change fails
- changed files against allowed_files / forbidden_files when execution is allowed
- max_files_changed is enforced

## Remaining Gap

Forbidden marker content scanning was attempted but blocked by the connector write path when adding the full file-content scan implementation.

The current policy still defines forbidden markers, but the runner v0.2 core does not yet scan changed file contents for those markers.

This means v0.2 is hardened but not complete against marker reintroduction.

## Required Re-Verification

Because v0.2 changed required packet fields, V0.1 PASS is not enough for closure.

Required tests:

```text
1. packet missing evidence_packet -> FAIL
2. packet evidence_packet.verified_from_repo=false -> FAIL
3. packet missing diff_contract -> FAIL
4. diff_contract.allowed_files does not match packet.allowed_files -> FAIL
5. baseline_lock does not match packet baseline/rollback -> FAIL
6. invalid state transition -> FAIL
7. behavior_tests missing -> FAIL
8. changed files exceed max_files_changed -> FAIL
9. valid APPROVED_WRITE packet with all v0.2 fields -> PASS
```

## Operating Rule From This Point

No Admin Web, model, application, or UI work may continue until v0.2 re-verification is complete.

The model remains a proposer. The runner is the deterministic gate.
