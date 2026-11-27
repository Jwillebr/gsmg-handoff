// A partial visual transcription check, not a complete ciphertext authentication.
// The prefix below was manually read from the pinned community screenshot.
const fs = require('node:fs');
const { digest, loadTargets } = require('./tester.cjs');
const screenshot = process.argv[2];
if (!screenshot) throw new Error('Provide SalPhaselonCosmicDuality.png path');
const png = fs.readFileSync(screenshot);
if (png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('Expected PNG');
const prefix = 'U2FsdGVkX18tP2/gbclQ5tNZuD4shoV3axuUd8J8aycGCAMoYfhZK0JecHTDpTFe';
const cosmic = loadTargets().find(t => t.name === 'cosmic');
if (!cosmic.raw.toString('base64').startsWith(prefix)) throw new Error('Visual prefix differs');
console.log(JSON.stringify({
  retrievedAt: new Date().toISOString(),
  source: 'https://github.com/puzzlehunt/gsmgio-5btc-puzzle/blob/fb92dd15487c6e2d275adb8c923698b7166c328e/SalPhaselonCosmicDuality.png',
  screenshotSha256: digest(png), screenshotBytes: png.length,
  width: png.readUInt32BE(16), height: png.readUInt32BE(20),
  method: 'manual-first-line-visual-transcription-compared-to-local-base64',
  observedBase64Prefix: prefix, prefixCharacters: prefix.length,
  matchesLocalPrefix: true, localEnvelopeSha256: cosmic.sha256,
  completeEnvelopeAuthenticated: false,
  limitation: 'Screenshot cuts off the textarea: the complete Cosmic ciphertext cannot be verified from this image. The archived image is community evidence, not a creator-authenticated original.'
}, null, 2));
