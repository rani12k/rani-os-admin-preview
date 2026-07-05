import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const defaultPolicy = path.join(root, '00_MASTER', 'RANI_RUNNER_POLICY.json');
const defaultPacket = path.join(root, '99_RUNTIME', 'RUNNER_EXECUTION_PACKET.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readChanged(file) {
  if (!file) return [];
  if (!fs.existsSync(file)) throw new Error(`missing changed-files list: ${file}`);
  return fs.readFileSync(file, 'utf8').split(/\r?\n/).map(x => x.trim()).filter(Boolean);
}

function isUnder(file, rule) {
  if (rule.endsWith('/')) return file.startsWith(rule);
  return file === rule;
}

function fail(errors, message) {
  errors.push(message);
}

function validate(policy, packet, changed) {
  const errors = [];
  const warnings = [];
  const required = policy.required_packet_fields || [];
  for (const field of required) {
    if (!(field in packet)) fail(errors, `missing required field: ${field}`);
  }

  const mode = packet.mode;
  const allowedModes = policy.allowed_modes || [];
  if (!allowedModes.includes(mode)) fail(errors, `invalid mode: ${mode}`);
  if (mode === 'PLAN_ONLY' && packet.execution_allowed === true) {
    fail(errors, 'PLAN_ONLY cannot execute');
  }

  const sources = Array.isArray(packet.source_of_truth_read) ? packet.source_of_truth_read : [];
  const minSources = Number(policy.minimum_source_of_truth_read_count || 1);
  if (sources.length < minSources) fail(errors, 'source_of_truth_read is missing or too short');
  if (policy.forbid_conversation_as_source) {
    for (const source of sources) {
      if (String(source).toLowerCase().includes('conversation')) {
        fail(errors, 'conversation cannot be Source of Truth');
      }
    }
  }

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

  if (changed.length === 0) {
    warnings.push('no changed-files list supplied');
  } else {
    const alwaysAllowed = new Set(policy.always_allowed_packet_paths || []);
    const protectedPaths = policy.protected_paths || [];
    const allowedFiles = new Set(packet.allowed_files || []);
    const forbiddenFiles = packet.forbidden_files || [];
    for (const file of changed) {
      if (alwaysAllowed.has(file)) continue;
      if (!mayExecute && protectedPaths.some(rule => isUnder(file, rule))) {
        fail(errors, `protected change without approval: ${file}`);
      }
      if (mayExecute && !allowedFiles.has(file)) {
        fail(errors, `changed file not allowed: ${file}`);
      }
      if (mayExecute && forbiddenFiles.some(rule => isUnder(file, rule))) {
        fail(errors, `changed file forbidden: ${file}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    packet_id: packet.packet_id || null,
    mode: mode || null,
    active_work_item: packet.active_work_item || null,
    execution_allowed: packet.execution_allowed === true,
    changed_files_count: changed.length
  };
}

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  if (i === -1) return fallback;
  return process.argv[i + 1];
}

const command = process.argv[2];
if (command !== 'validate') {
  console.error('usage: node tools/rani_runner.mjs validate [--policy file] [--packet file] [--changed-files file]');
  process.exit(2);
}

const policyFile = arg('--policy', defaultPolicy);
const packetFile = arg('--packet', defaultPacket);
const changedFile = arg('--changed-files', null);
const result = validate(readJson(policyFile), readJson(packetFile), readChanged(changedFile));
console.log(JSON.stringify(result, null, 2));
process.exit(result.valid ? 0 : 1);
