const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { parseEnvelope, derive, decrypt, assess, run } = require('./tester.cjs');
const openssl = process.env.OPENSSL_EXE || 'C:\\Program Files\\Git\\usr\\bin\\openssl.exe';

for (const md of ['sha256', 'md5']) {
  test(`OpenSSL independent encryption/decryption and KDF: ${md}`, () => {
    for (const text of ['Known puzzle fixture.\n', '0123456789abcdef', 'UTF-8 fixture: \u03bb\n']) {
      const password = 'fixture password \u03bb';
      const salt = Buffer.from('0011223344556677', 'hex');
      const result = spawnSync(openssl, ['enc', '-aes-256-cbc', '-e', '-md', md, '-S', salt.toString('hex'), '-pass', `pass:${password}`], { input: Buffer.from(text) });
      assert.equal(result.status, 0, result.stderr.toString());
      // OpenSSL 3 with explicit -S emits ciphertext without the salted header.
      const envelope = parseEnvelope(Buffer.concat([Buffer.from('Salted__'), salt, result.stdout]));
      assert.equal(decrypt(envelope, Buffer.from(password), md).toString(), text);
      assert.equal(decrypt(envelope, Buffer.from('wrong password'), md), null);
      const printed = spawnSync(openssl, ['enc', '-aes-256-cbc', '-P', '-md', md, '-S', salt.toString('hex'), '-pass', `pass:${password}`], { encoding: 'utf8' });
      assert.equal(printed.status, 0);
      const ours = derive(Buffer.from(password), salt, md);
      assert.equal(ours.key.toString('hex'), printed.stdout.match(/key=([0-9a-f]+)/i)[1].toLowerCase());
      assert.equal(ours.iv.toString('hex'), printed.stdout.match(/iv\s*=([0-9a-f]+)/i)[1].toLowerCase());
    }
  });
}

test('Malformed envelopes rejected; printable plaintext is only flagged for review', () => {
  assert.throws(() => parseEnvelope(Buffer.alloc(32)));
  assert.throws(() => parseEnvelope(Buffer.concat([Buffer.from('Salted__'), Buffer.alloc(25)])));
  assert.equal(assess(Buffer.from('Meaningful fixture text.')).review, true);
  assert.equal(assess(Buffer.from([0xff, 0xfe])).binary, true);
  assert.equal(assess(Buffer.alloc(0)).review, false);
});

test('Batch resumes without repeated decryptions and rejects altered inputs', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'gsmg-tester-'));
  const input = path.join(temp, 'input.txt'), checkpoint = path.join(temp, 'state.json');
  fs.writeFileSync(input, 'validation-only-password-one\nvalidation-only-password-two\nvalidation-only-password-one\n');
  const first = run(input, checkpoint, 1);
  assert.equal(first.next, 1);
  assert.equal(first.decryptions, 6);
  const second = run(input, checkpoint, 1);
  assert.equal(second.complete, true);
  assert.equal(second.decryptions, 12);
  assert.equal(run(input, checkpoint, 1).decryptions, 12);
  fs.appendFileSync(input, 'third\n');
  assert.throws(() => run(input, checkpoint, 1), /Inputs\/tester changed/);
});
