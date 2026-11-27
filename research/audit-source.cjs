// Compare the community archive's literal Salphaseion blob to our local copy.
// Usage: node research/audit-source.cjs PATH_TO_ARCHIVE_README COMMIT_SHA
const fs = require('node:fs');
const { digest, parseEnvelope, loadTargets } = require('./tester.cjs');
const [, , file, commit] = process.argv;
if (!file || !/^[0-9a-f]{40}$/.test(commit || '')) throw new Error('Provide archive README and full commit SHA');
const bytes = fs.readFileSync(file), text = bytes.toString('utf8');
const section = text.slice(text.indexOf('### AES Blob', text.indexOf('## Salphaseion')));
const quoted = section.split(/\r?\n/).filter(line => line.startsWith('> ')).map(line => line.slice(2)).join('').replace(/\s/g, '');
if (!/^U2FsdGVk[A-Za-z0-9+/=]+$/.test(quoted)) throw new Error('Unexpected source blob format');
const archive = parseEnvelope(Buffer.from(quoted, 'base64'));
const local = loadTargets().find(t => t.name === 'salphaseion');
if (archive.sha256 !== local.sha256) throw new Error('Source/local Salphaseion ciphertext differs');
const numbers = ['174161018595377387932283725836301293648834223172419022725145445', '36026487402470099740341006948'];
const decoded = numbers.map(decimal => ({ decimal, ascii: Buffer.from(BigInt(decimal).toString(16), 'hex').toString('ascii') }));
console.log(JSON.stringify({
  retrievedAt: new Date().toISOString(),
  source: `https://github.com/puzzlehunt/gsmgio-5btc-puzzle/blob/${commit}/README.md`,
  sourceReadmeSha256: digest(bytes),
  status: 'community-archive-cross-check-not-creator-original',
  salphaseion: { ciphertextBytes: archive.ciphertext.length, envelopeSha256: archive.sha256, matchesLocal: true },
  decimalClueChecks: decoded,
  limitations: ['Cosmic and phase32end blobs not independently authenticated by this check.', 'KDF choice is still a hypothesis for unsolved ciphertexts.', 'No puzzle candidate batch or confirmed solution in this audit.']
}, null, 2));
