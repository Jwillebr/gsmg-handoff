// Hypothesis L1: "sha256ans too" might instruct another hash of a resolved answer.
// A deliberately narrow experiment, not a claimed interpretation of the creator.
const fs = require('node:fs');
const { digest } = require('./tester.cjs');
const clues = ['matrixsumlist', 'enter', 'lastwordsbeforearchichoice', 'thispassword'];
const forms = new Set();
for (const clue of clues) forms.add(clue);
for (const a of clues) for (const b of clues) if (a !== b) {
  forms.add(a + b);
  forms.add(digest(a) + digest(b));
  forms.add(digest(a) + b);
  forms.add(a + digest(b));
}
// Keep the same order the four resolved clue strings occur in the archive.
forms.add(clues.join(''));
forms.add(clues.map(digest).join(''));
const candidates = new Set();
for (const form of forms) {
  const first = digest(form);
  // Omit raw and one-hash forms, already covered broadly in the handoff.
  const second = digest(first);
  candidates.add(second);
  candidates.add(digest(second));
  // An explicit alternative interpretation: second hash consumes binary digest.
  candidates.add(digest(Buffer.from(first, 'hex')));
}
const output = [...candidates].sort().join('\n') + '\n';
if (!process.argv[2]) throw new Error('Provide output candidate filename');
fs.writeFileSync(process.argv[2], output);
console.log(JSON.stringify({ id: 'L1-2026-11-27', candidates: candidates.size, candidateSha256: digest(output), generatorSha256: digest(fs.readFileSync(__filename)) }, null, 2));
