# BUILD_RUNNER_001_STATUS

Status: V0.2 BEHAVIOR PASS / OWNER VERIFIED

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

## V0.2 Owner Verification Results

Owner-provided verification after commit:

```text
75dc1dc6b92ef763f77da2115be23247c8e4e32c
```

Results:

```text
Scenario 1: packet missing evidence_packet -> FAIL
Scenario 2: evidence_packet.verified_from_repo=false -> FAIL
Scenario 3: packet missing diff_contract -> FAIL
Scenario 4: diff_contract.allowed_files mismatch -> FAIL
Scenario 5: baseline_lock mismatch -> FAIL
Scenario 6: invalid state_transition -> FAIL
Scenario 7: behavior_tests missing -> FAIL
Scenario 8: changed files exceed max_files_changed -> FAIL
Scenario 9: valid APPROVED_WRITE packet -> PASS
git status at end: clean
```

V0.2 reaches Behavior PASS.

## Remaining Gap

Forbidden marker content scanning remains a known gap. The policy defines forbidden markers, but the runner v0.2 core does not yet scan changed file contents for those markers.

This gap is accepted as a next hardening item, not a blocker for v0.2 Behavior PASS, because the v0.2 behavior tests passed for evidence, diff, baseline, transition, behavior tests, and max_files_changed controls.

## Operating Rule From This Point

No protected work should proceed without a valid runner packet.

The model remains a proposer. The runner is the deterministic gate.
