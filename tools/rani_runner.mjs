import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const defaultPolicy = path.join(root, '00_MASTER', 'RANI_RUNNER_POLICY.json');
const defaultPacket = path.join(root, '99_RUNTIME', 'RUNNER_EXECUTION_PACKET.json');

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function readChanged(file) { if (!file) return []; if (!fs.existsSync(file)) throw new Error(`missing changed-files list: ${file}`); return fs.readFileSync(file, 'utf8').split(/\r?\n/).map(x => x.trim()).filter(Boolean); }
function isUnder(file, rule) { return rule.endsWith('/') ? file.startsWith(rule) : file === rule; }
function fail(errors, message) { errors.push(message); }
function requireObj(name, obj, fields, errors) { if (!obj || typeof obj !== 'object' || Array.isArray(obj)) { fail(errors, `${name} missing`); return null; } for (const f of fields || []) if (!(f in obj)) fail(errors, `${name}.${f} missing`); return obj; }

function validate(policy, packet, changed) {
  const errors = [];
  const warnings = [];
  for (const field of policy.required_packet_fields || []) if (!(field in packet)) fail(errors, `missing required field: ${field}`);
  const mode = packet.mode;
  if (!(policy.allowed_modes || []).includes(mode)) fail(errors, `invalid mode: ${mode}`);
  if (mode === 'PLAN_ONLY' && packet.execution_allowed === true) fail(errors, 'PLAN_ONLY cannot execute');
  const sources = Array.isArray(packet.source_of_truth_read) ? packet.source_of_truth_read : [];
  if (sources.length < Number(policy.minimum_source_of_truth_read_count || 1)) fail(errors, 'source_of_truth_read is missing or too short');
  if (policy.forbid_conversation_as_source && sources.some(x => String(x).toLowerCase().includes('conversation'))) fail(errors, 'conversation cannot be Source of Truth');

  if (policy.require_evidence_packet) {
    const e = requireObj('evidence_packet', packet.evidence_packet, policy.required_evidence_fields, errors);
    if (e) { if (e.verified_from_repo !== true) fail(errors, 'evidence_packet.verified_from_repo must be true'); if (e.claim_level !== 'verified') fail(errors, 'evidence_packet.claim_level must be verified'); if (!Array.isArray(e.source_files) || e.source_files.length === 0) fail(errors, 'evidence_packet.source_files required'); }
  }
  if (policy.require_baseline_lock) {
    const b = requireObj('baseline_lock', packet.baseline_lock, policy.required_baseline_lock_fields, errors);
    if (b) { if (b.baseline_commit !== packet.baseline_commit) fail(errors, 'baseline_lock mismatch'); if (b.rollback_point !== packet.rollback_point) fail(errors, 'rollback lock mismatch'); }
  }
  if (policy.require_diff_contract) {
    const d = requireObj('diff_contract', packet.diff_contract, policy.required_diff_contract_fields, errors);
    if (d) { if (JSON.stringify(d.allowed_files || []) !== JSON.stringify(packet.allowed_files || [])) fail(errors, 'diff_contract.allowed_files mismatch'); if (JSON.stringify(d.forbidden_files || []) !== JSON.stringify(packet.forbidden_files || [])) fail(errors, 'diff_contract.forbidden_files mismatch'); }
  }
  if (policy.require_behavior_tests && (!Array.isArray(packet.behavior_tests) || packet.behavior_tests.length === 0)) fail(errors, 'behavior_tests required');
  const st = packet.state_transition;
  if (!st || !st.from || !st.to) fail(errors, 'state_transition required'); else { const key = `${st.from}->${st.to}`; const allowed = policy.allowed_state_transitions || []; if (!allowed.includes(key) && !allowed.includes(`ANY->${st.to}`)) fail(errors, `state transition not allowed: ${key}`); }

  const mayExecute = packet.execution_allowed === true;
  if (mayExecute) {
    const requiredMode = policy.valid_execution_conditions?.mode_must_be || 'APPROVED_WRITE';
    if (mode !== requiredMode) fail(errors, `execution requires mode ${requiredMode}`);
    const approval = packet.owner_approval || {};
    const phrase = policy.owner_approval?.required_phrase || 'OWNER_APPROVED';
    if (approval.approved !== true) fail(errors, 'owner approval missing');
    if (approval.approval_phrase !== phrase) fail(errors, 'owner approval phrase invalid');
    if (!packet.rollback_point) fail(errors, 'rollback_point missing');
    if (!packet.baseline_commit) fail(errors, 'baseline_commit missing');
  }
  if (changed.length === 0) warnings.push('no changed-files list supplied');
  const alwaysAllowed = new Set(policy.always_allowed_packet_paths || []);
  const realChanges = changed.filter(file => !alwaysAllowed.has(file));
  if (!mayExecute && realChanges.length > 0) fail(errors, `changes require execution approval: ${realChanges.join(', ')}`);
  const maxFiles = Number(packet.diff_contract?.max_files_changed ?? policy.max_files_changed_default ?? 999);
  if (realChanges.length > maxFiles) fail(errors, `changed files exceed max_files_changed: ${realChanges.length}`);
  const allowedFiles = new Set(packet.allowed_files || []);
  const forbiddenFiles = packet.forbidden_files || [];
  for (const file of realChanges) { if (mayExecute && !allowedFiles.has(file)) fail(errors, `changed file not allowed: ${file}`); if (mayExecute && forbiddenFiles.some(rule => isUnder(file, rule))) fail(errors, `changed file forbidden: ${file}`); }
  return { valid: errors.length === 0, errors, warnings, packet_id: packet.packet_id || null, mode: mode || null, active_work_item: packet.active_work_item || null, execution_allowed: mayExecute, changed_files_count: changed.length };
}

function arg(name, fallback) { const i = process.argv.indexOf(name); return i === -1 ? fallback : process.argv[i + 1]; }
const command = process.argv[2];
if (command !== 'validate') { console.error('usage: node tools/rani_runner.mjs validate [--policy file] [--packet file] [--changed-files file]'); process.exit(2); }
const result = validate(readJson(arg('--policy', defaultPolicy)), readJson(arg('--packet', defaultPacket)), readChanged(arg('--changed-files', null)));
console.log(JSON.stringify(result, null, 2));
process.exit(result.valid ? 0 : 1);
