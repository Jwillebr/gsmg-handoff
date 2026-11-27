// L2: literal character interleaving, motivated by the archived "intertwined" hint.
// This is a bounded hypothesis, not a confirmed interpretation of that hint.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const { digest } = require('./tester.cjs');
const clues = ['matrixsumlist', 'enter', 'lastwordsbeforearchichoice', 'thispassword'];
function weave(strings) {
  let result = '';
  for (let i = 0; i < Math.max(...strings.map(s => s.length)); i++) {
    for (const s of strings) if (i < s.length) result += s[i];
  }
  return result;
}
assert.equal(weave(['abc', '12']), 'a1b2c');
assert.equal(weave(['ab', '1', 'XY']), 'a1XbY');
function permutations(values, count) {
  if (count === 0) return [[]];
  return values.flatMap((value, i) => permutations(values.filter((_, j) => i !== j), count - 1).map(tail => [value, ...tail]));
}
const candidates = new Set();
let orderings = 0;
for (const n of [2, 3, 4]) for (const ordering of permutations(clues, n)) {
  orderings++;
  for (const strings of [ordering, ordering.map(digest)]) {
    const woven = weave(strings);
    candidates.add(woven);
    candidates.add(digest(woven));
  }
}
const prior = fs.readFileSync(path.join(__dirname, 'candidates-L1.txt'), 'utf8');
for (const candidate of prior.split(/\r?\n/)) candidates.delete(candidate);
const output = [...candidates].sort().join('\n') + '\n';
if (!process.argv[2]) throw new Error('Provide candidate output filename');
fs.writeFileSync(process.argv[2], output);
console.log(JSON.stringify({ id: 'L2-2026-11-27', orderings, candidates: candidates.size, candidateSha256: digest(output), generatorSha256: digest(fs.readFileSync(__filename)), excludedL1Sha256: digest(prior) }, null, 2));
