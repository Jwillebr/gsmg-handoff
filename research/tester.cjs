// Bounded, resumable testing. No dependencies beyond Node's standard library.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { TextDecoder } = require('node:util');
const ROOT = path.resolve(__dirname, '..');
const digest = value => crypto.createHash('sha256').update(value).digest('hex');

function parseEnvelope(raw) {
  if (raw.length < 32 || raw.subarray(0, 8).toString() !== 'Salted__' || (raw.length - 16) % 16) {
    throw new Error('Invalid OpenSSL salted AES envelope');
  }
  return { raw, salt: raw.subarray(8, 16), ciphertext: raw.subarray(16), sha256: digest(raw) };
}

function derive(password, salt, md) {
  if (!['sha256', 'md5'].includes(md)) throw new Error('Unsupported digest');
  let previous = Buffer.alloc(0), data = Buffer.alloc(0);
  while (data.length < 48) {
    previous = crypto.createHash(md).update(Buffer.concat([previous, password, salt])).digest();
    data = Buffer.concat([data, previous]);
  }
  return { key: data.subarray(0, 32), iv: data.subarray(32, 48) };
}

function decrypt(envelope, password, md) {
  const { key, iv } = derive(password, envelope.salt, md);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  // Node/OpenSSL's default auto-padding requires valid PKCS#7.
  try { return Buffer.concat([decipher.update(envelope.ciphertext), decipher.final()]); }
  catch { return null; }
}

function assess(plain) {
  if (!plain || plain.length === 0) return { review: false, reason: 'empty-or-invalid-padding' };
  let text;
  try { text = new TextDecoder('utf-8', { fatal: true }).decode(plain); }
  catch { return { review: false, reason: 'binary-valid-padding', binary: true }; }
  const allowed = [...plain].filter(b => b === 9 || b === 10 || b === 13 || (b >= 32 && b <= 126)).length;
  // A review flag is only a triage heuristic, never a declaration of a solve.
  const review = allowed / plain.length >= 0.95 && /[A-Za-z0-9]{4}/.test(text);
  return { review, reason: review ? 'text-requires-independent-verification' : 'unstructured-valid-padding' };
}

function loadTargets() {
  const text = fs.readFileSync(path.join(ROOT, 'gsmg_worker.ps1'), 'utf8');
  const targets = [...text.matchAll(/"(cosmic|salphaseion|phase32end)"\s*=\s*"([A-Za-z0-9+/=]+)"/g)]
    .map(m => ({ name: m[1], ...parseEnvelope(Buffer.from(m[2], 'base64')) }));
  if (targets.length !== 3 || new Set(targets.map(t => t.name)).size !== 3) throw new Error('Expected three unique targets');
  return targets;
}

function saveJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file + '.tmp', JSON.stringify(value, null, 2) + '\n');
  fs.renameSync(file + '.tmp', file);
}

function run(candidateFile, checkpointFile, maxCandidates = 1000) {
  if (!Number.isSafeInteger(maxCandidates) || maxCandidates < 1) throw new Error('Invalid batch size');
  const input = fs.readFileSync(candidateFile);
  // Exact UTF-8 lines are passwords: do not trim spaces. Empty lines are omitted.
  const candidates = [...new Set(input.toString('utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean))];
  const targets = loadTargets(), digests = ['sha256', 'md5'];
  const manifest = {
    testerSha256: digest(fs.readFileSync(__filename)), inputSha256: digest(input),
    targets: targets.map(t => ({ name: t.name, sha256: t.sha256 })),
    digests, encoding: 'utf8-exact-lines', uniqueCandidates: candidates.length
  };
  const manifestHash = digest(JSON.stringify(manifest));
  let state = { manifest, manifestHash, next: 0, decryptions: 0, validPadding: 0, reviewCandidates: 0, complete: false };
  if (fs.existsSync(checkpointFile)) {
    state = JSON.parse(fs.readFileSync(checkpointFile));
    if (state.manifestHash !== manifestHash) throw new Error('Inputs/tester changed; use a new checkpoint');
  }
  const begin = state.next, end = Math.min(candidates.length, begin + maxCandidates);
  const started = Date.now();
  for (let i = begin; i < end; i++) {
    for (const target of targets) for (const md of digests) {
      const plain = decrypt(target, Buffer.from(candidates[i], 'utf8'), md);
      state.decryptions++;
      if (plain === null) continue;
      state.validPadding++;
      const assessment = assess(plain);
      if (assessment.review) state.reviewCandidates++;
      // Preserve ALL padding-valid results, including binary, outside Git.
      const privateFile = path.join(ROOT, '.gsmg-private', manifestHash, `${i}-${target.name}-${md}.json`);
      saveJson(privateFile, { index: i, target: target.name, md, password: candidates[i], plaintextBase64: plain.toString('base64'), assessment });
    }
    state.next = i + 1;
    if (state.next % 100 === 0) saveJson(checkpointFile, state);
  }
  state.complete = state.next === candidates.length;
  state.updatedAt = new Date().toISOString();
  state.lastBatch = { begin, end, elapsedMs: Date.now() - started };
  saveJson(checkpointFile, state);
  return state;
}

module.exports = { digest, parseEnvelope, derive, decrypt, assess, loadTargets, run };
if (require.main === module) {
  const [, , candidateFile, checkpointFile, limit = '1000'] = process.argv;
  if (!candidateFile || !checkpointFile) {
    console.error('Usage: node research/tester.cjs CANDIDATES.txt CHECKPOINT.json [MAX_CANDIDATES]');
    process.exitCode = 1;
  } else console.log(JSON.stringify(run(candidateFile, checkpointFile, Number(limit)), null, 2));
}
