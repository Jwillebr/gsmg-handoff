// S2: independently reproduce a community prime-slot parsing hypothesis.
// The model was selected from prior research, so controls are exploratory.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { extract } = require('./audit-live-page.cjs');
const { digest } = require('./tester.cjs');
const source = fs.readFileSync(process.argv[2]);
const poster = JSON.parse(fs.readFileSync(process.argv[3], 'utf8').replace(/^\uFEFF/, ''));
const { dbbi } = extract(source.toString('utf8'));
const prime = n => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};
function parse(text) {
  const solutions = [];
  function visit(index, tokens) {
    if (index === text.length) { solutions.push(tokens); return; }
    if (prime(tokens.length + 1)) {
      if (text[index] !== 'b') return;
      visit(index + 1, [...tokens, 'b']);
      if (text.slice(index, index + 2) === 'be') visit(index + 2, [...tokens, 'be']);
    } else visit(index + 1, [...tokens, text[index]]);
  }
  visit(0, []);
  return solutions;
}
assert.deepEqual(parse('abbab'), [['a', 'b', 'b', 'a', 'b']]);
const solutions = parse(dbbi).map(tokens => {
  const markers = tokens.map((token, index) => ({ token, position: index + 1 })).filter(x => prime(x.position));
  const bMarkers = markers.filter(x => x.token === 'b').length;
  const beMarkers = markers.filter(x => x.token === 'be').length;
  return { cells: tokens.length, tokens, markers, bMarkers, beMarkers,
    posterCountMatchEitherAssignment: (bMarkers === poster.blueCount && beMarkers === poster.yellowCount) || (bMarkers === poster.yellowCount && beMarkers === poster.blueCount) };
});
let seed = 0x53325052;
function random() { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; }
const controls = 10000;
let controlsWithAnyCompleteParse = 0;
for (let iteration = 0; iteration < controls; iteration++) {
  const chars = [...dbbi];
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  if (parse(chars.join('')).length) controlsWithAnyCompleteParse++;
}
console.log(JSON.stringify({
  id: 'S2-2026-11-27', auditedAt: new Date().toISOString(), sourceUtf8Sha256: digest(source),
  dbbiSha256: digest(dbbi), generatorSha256: digest(fs.readFileSync(__filename)),
  model: '1-based prime cell positions consume b or be; non-prime positions consume one a-i symbol; consume entire stream losslessly; enumerate all parses',
  hypothesisSource: 'https://github.com/AppleLamps/GSMG-CLEAN/blob/main/03_OPEN_LEADS.md',
  selectionCaveat: 'Model borrowed after prior exploration; control frequency is descriptive, not a preregistered significance test or proof of intended encoding.',
  solutions, poster: { imageSha256: poster.imageSha256, blueCount: poster.blueCount, yellowCount: poster.yellowCount },
  control: { seedHex: '53325052', iterations: controls, nullModel: 'uniform shuffles preserving DBBI symbol counts', controlsWithAnyCompleteParse,
    smoothedCompleteParseFrequency: (controlsWithAnyCompleteParse + 1) / (controls + 1) },
  limitations: 'Matching prime-slot grammar does not determine token values, grid shape, colour assignment, plaintext, or an AES password. Neither parse matches the measured poster colour counts.'
}, null, 2));
