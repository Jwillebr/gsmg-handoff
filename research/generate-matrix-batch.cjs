// L3: direct sums of the signed 84-cell DBBI model, in a 6x14 matrix.
// Width 14 is motivated by the source's original grid; the reshape is a hypothesis.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { digest } = require('./tester.cjs');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const source = fs.readFileSync(path.join(__dirname, 'marker-alignment-S3.json'));
const model = read(path.join(__dirname, 'marker-alignment-S3.json')).numericModels.find(m => m.cells === 84);
if (!model || model.values.length !== 84 || model.total !== 101) throw new Error('Unexpected DBBI source model');
function sums(values, width) {
  if (values.length % width) throw new Error('Matrix does not fit');
  const height = values.length / width;
  const rows = Array.from({ length: height }, (_, r) => values.slice(r * width, (r + 1) * width).reduce((a,b) => a+b,0));
  const columns = Array.from({ length: width }, (_, c) => Array.from({length:height}, (_,r) => values[r*width+c]).reduce((a,b) => a+b,0));
  return { rows, columns };
}
assert.deepEqual(sums([1,2,3,4,5,6],3), { rows:[6,15], columns:[5,7,9] });
const lists = sums(model.values, 14);
if (lists.rows.reduce((a,b) => a+b,0) !== 101 || lists.columns.reduce((a,b) => a+b,0) !== 101) throw new Error('Sum mismatch');
const candidates = new Set(), materials = [];
for (const [name, values] of [['rows',lists.rows], ['columns',lists.columns], ['rows-columns',[...lists.rows,...lists.columns]], ['columns-rows',[...lists.columns,...lists.rows]]]) {
  const representations = new Set(['',',',' ',':','-'].map(separator => values.join(separator)));
  const mod = n => ((n % 26) + 26) % 26;
  const a0 = values.map(n => String.fromCharCode(97 + mod(n))).join('');
  const a1 = values.map(n => String.fromCharCode(97 + mod(n - 1))).join('');
  representations.add(a0); representations.add(a1);
  materials.push({ name, values, mod26A0:a0, mod26A1:a1 });
  for (const value of representations) { candidates.add(value); candidates.add(digest(value)); }
}
for (const prior of ['candidates-L1.txt','candidates-L2.txt']) {
  for (const value of fs.readFileSync(path.join(__dirname, prior), 'utf8').split(/\r?\n/)) candidates.delete(value);
}
if (!process.argv[2]) throw new Error('Provide candidate filename');
const output = [...candidates].sort().join('\n') + '\n';
fs.writeFileSync(process.argv[2], output);
console.log(JSON.stringify({ id:'L3-2026-11-27', generatedAt:new Date().toISOString(), model:'signed 84-cell DBBI, row-major 6x14; b=-prime slot,be=+prime slot,ordinary a-i=1..9',
  generatorSha256:digest(fs.readFileSync(__filename)), sourceArtifactSha256:digest(source), materials,
  representations:'Signed decimal, separators empty/comma/space/colon/hyphen; modulo-26 letters A=0 or A=1; each raw and SHA256 UTF8-hex; remove L1/L2 repeats',
  candidates:candidates.size,candidateSha256:digest(output),
  limitations:'No source explicitly specifies a 6x14 DBBI reshape or a modulo-26 conversion. No inferred word fragment alone is a solve.' },null,2));
