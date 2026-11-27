// Reproduce the solved phase from archived ciphertext and cross-check its end blob.
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const { digest, parseEnvelope, decrypt, loadTargets } = require('./tester.cjs');
const [, , archiveFile] = process.argv;
const archive = fs.readFileSync(archiveFile, 'utf8');
const encodedMatch = archive.match(/U2FsdGVkX1\/u\/Exb78Flah[A-Za-z0-9+/=\r\n]+/);
const encoded = encodedMatch && encodedMatch[0].replace(/\s/g, '');
if (!encoded || !/^[A-Za-z0-9+/=]+$/.test(encoded)) throw new Error('Archived phase 3.2 ciphertext missing');
const envelope = parseEnvelope(Buffer.from(encoded, 'base64'));
const password = digest('jacquefrescogiveitjustonesecondheisenbergsuncertaintyprinciple');
const result = { retrievedAt: new Date().toISOString(), source: 'https://github.com/puzzlehunt/gsmgio-5btc-puzzle/blob/fb92dd15487c6e2d275adb8c923698b7166c328e/README.md', envelopeSha256: envelope.sha256, passwordHex: password, variants: {} };
for (const md of ['sha256', 'md5']) {
  const plain = decrypt(envelope, Buffer.from(password), md);
  result.variants[md] = { validPadding: plain !== null };
  if (!plain) continue;
  const expectedPrefix = plain.toString('utf8').startsWith("I've been waiting for you.");
  result.variants[md] = { validPadding: true, expectedPrefix, plaintextBytes: plain.length, plaintextSha256: digest(plain) };
  if (!expectedPrefix) continue;
  const openssl = process.env.OPENSSL_EXE || 'C:\\Program Files\\Git\\usr\\bin\\openssl.exe';
  const independent = spawnSync(openssl, ['enc', '-aes-256-cbc', '-d', '-md', md, '-pass', `pass:${password}`], { input: envelope.raw });
  if (independent.status !== 0 || !independent.stdout.equals(plain)) throw new Error('OpenSSL disagrees');
  result.variants[md].opensslByteMatch = true;
  const found = plain.toString('utf8').match(/U2FsdGVkX1\+0Wl49[\s\S]*$/);
  if (!found) throw new Error('Expected phase32end blob absent from real decrypted stage');
  const end = parseEnvelope(Buffer.from(found[0].replace(/\s/g, ''), 'base64'));
  const local = loadTargets().find(t => t.name === 'phase32end');
  if (end.sha256 !== local.sha256) throw new Error('Recovered phase32end differs from local target');
  result.recoveredPhase32end = { envelopeSha256: end.sha256, ciphertextBytes: end.ciphertext.length, matchesLocal: true };
}
if (!result.recoveredPhase32end) throw new Error('No successful historical reproduction');
console.log(JSON.stringify(result, null, 2));
