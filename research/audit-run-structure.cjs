// S1: is adjacent-symbol order unusual after conditioning on symbol counts?
// Deterministic permutation controls; not a cipher identification or decryption.
const fs = require('node:fs');
const { extract } = require('./audit-live-page.cjs');
const { digest } = require('./tester.cjs');
const source = fs.readFileSync(process.argv[2]);
const { dbbi, faed } = extract(source.toString('utf8'));
function information(text) {
  const pairs = Array(81).fill(0), rows = Array(9).fill(0), cols = Array(9).fill(0);
  const n = text.length - 1;
  for (let i = 0; i < n; i++) {
    const a = text.charCodeAt(i) - 97, b = text.charCodeAt(i + 1) - 97;
    pairs[a * 9 + b]++; rows[a]++; cols[b]++;
  }
  let mi = 0;
  for (let a = 0; a < 9; a++) for (let b = 0; b < 9; b++) {
    const count = pairs[a * 9 + b];
    if (count) mi += count / n * Math.log2(count * n / (rows[a] * cols[b]));
  }
  return mi;
}
let seed = 0x47534d47;
function random() { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; }
const iterations = 5000;
const result = [];
for (const [name, run] of [['dbbi', dbbi], ['faed', faed]]) {
  const observed = information(run), nullValues = [];
  for (let j = 0; j < iterations; j++) {
    const chars = [...run];
    for (let i = chars.length - 1; i > 0; i--) {
      const k = Math.floor(random() * (i + 1));
      [chars[i], chars[k]] = [chars[k], chars[i]];
    }
    nullValues.push(information(chars.join('')));
  }
  const upper = (1 + nullValues.filter(v => v >= observed).length) / (iterations + 1);
  const lower = (1 + nullValues.filter(v => v <= observed).length) / (iterations + 1);
  const sorted = [...nullValues].sort((a,b) => a-b);
  result.push({ name, length: run.length, sha256: digest(run),
    counts: Object.fromEntries([...'abcdefghi'].map(c => [c, [...run].filter(x => x === c).length])),
    observedAdjacentMutualInformationBits: observed,
    shuffledMeanBits: nullValues.reduce((a,b) => a+b,0) / iterations,
    shuffledInterval95: [sorted[125], sorted[4874]],
    upperTailMonteCarloP: upper, lowerTailMonteCarloP: lower,
    twoSidedMonteCarloP: Math.min(1, 2 * Math.min(upper, lower)) });
}
console.log(JSON.stringify({
  id: 'S1-2026-11-27', auditedAt: new Date().toISOString(),
  generatorSha256: digest(fs.readFileSync(__filename)), sourceUtf8Sha256: digest(source),
  nullModel: 'uniform permutations of each observed run, preserving all symbol counts',
  statistic: 'adjacent-symbol mutual information; two-sided empirical tail test',
  seedHex: '47534d47', iterationsPerRun: iterations, familywiseAlpha: 0.05,
  perRunBonferroniAlpha: 0.025, result,
  limitations: 'Failure to reject is not proof of randomness; this tests only adjacent order, not all encodings, long-range structure, or cryptographic content.'
}, null, 2));
