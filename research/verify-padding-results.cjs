// Independently reproduce all padding-valid outputs without printing passwords/plaintext.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { loadTargets } = require('./tester.cjs');
const file = process.argv[2];
if (!file) throw new Error('Provide completed checkpoint JSON');
const state = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const directory = path.join(__dirname, '..', '.gsmg-private', state.manifestHash);
const targets = loadTargets();
for (const target of targets) {
  if (state.manifest.targets.find(t => t.name === target.name)?.sha256 !== target.sha256) throw new Error('Target manifest mismatch');
}
let checked = 0, binary = 0, review = 0;
for (const filename of fs.existsSync(directory) ? fs.readdirSync(directory) : []) {
  const r = JSON.parse(fs.readFileSync(path.join(directory, filename), 'utf8'));
  const result = spawnSync(process.env.OPENSSL_EXE || 'C:\\Program Files\\Git\\usr\\bin\\openssl.exe',
    ['enc', '-aes-256-cbc', '-d', '-md', r.md, '-pass', 'env:GSMG_VERIFY_PASSWORD'],
    { input: targets.find(t => t.name === r.target).raw, env: { ...process.env, GSMG_VERIFY_PASSWORD: r.password } });
  if (result.status !== 0 || !result.stdout.equals(Buffer.from(r.plaintextBase64, 'base64'))) throw new Error('Independent OpenSSL mismatch');
  checked++;
  if (r.assessment.binary) binary++;
  if (r.assessment.review) review++;
}
if (checked !== state.validPadding) throw new Error('Missing padding-valid records');
console.log(JSON.stringify({ checkpoint: path.basename(file), checked, binary, review, opensslByteMatch: true }, null, 2));
