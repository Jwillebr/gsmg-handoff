// S4: does FAED's terminal alphabet restriction exceed a count-preserving null?
// Adjust the control statistic over all 36 pairs of omitted symbols.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { extract } = require('./audit-live-page.cjs');
const { digest } = require('./tester.cjs');
const source = fs.readFileSync(process.argv[2]);
const { faed } = extract(source.toString('utf8'));
function absentLogScore(n, omittedCount, length) {
  let logProbability = 0;
  for (let i=0;i<length;i++) logProbability += Math.log((n-omittedCount-i)/(n-i));
  return -logProbability;
}
assert.ok(Math.abs(Math.exp(-absentLogScore(5,2,2))-0.3)<1e-12);
const counts = Array.from({length:9},(_,i)=>[...faed].filter(c=>c.charCodeAt(0)-97===i).length);
// Precompute finite-population probabilities for each pair/possible suffix.
const pairs=[];
for(let a=0;a<9;a++)for(let b=a+1;b<9;b++){
  const score=[0];
  for(let length=1;length<=faed.length-counts[a]-counts[b];length++)score.push(absentLogScore(faed.length,counts[a]+counts[b],length));
  pairs.push({a,b,score});
}
function bestSuffix(text) {
  const last=Array(9).fill(-1);
  for(let i=0;i<text.length;i++)last[text.charCodeAt(i)-97]=i;
  let best={score:-1};
  for(const pair of pairs){
    const length=text.length-1-Math.max(last[pair.a],last[pair.b]);
    const score=pair.score[length];
    if(score>best.score)best={score,length,omittedLetters:String.fromCharCode(97+pair.a,97+pair.b),startIndexZeroBased:text.length-length};
  }
  return best;
}
const observed=bestSuffix(faed), tail=faed.slice(-observed.length);
let seed=0x53344654;
function random(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;}
const iterations=10000;let atLeastObserved=0;
const started=Date.now();
for(let iteration=0;iteration<iterations;iteration++){
  const chars=[...faed];
  for(let i=chars.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[chars[i],chars[j]]=[chars[j],chars[i]];}
  if(bestSuffix(chars.join('')).score>=observed.score-1e-12)atLeastObserved++;
}
console.log(JSON.stringify({
  id:'S4-2026-11-27',auditedAt:new Date().toISOString(),generatorSha256:digest(fs.readFileSync(__filename)),
  sourceUtf8Sha256:digest(source),faedSha256:digest(faed),length:faed.length,
  counts:Object.fromEntries(counts.map((n,i)=>[String.fromCharCode(97+i),n])),
  statistic:'Maximum -log(P(no occurrence of the pair in a suffix of its observed maximal length)), across all 36 letter pairs; exact finite-population probability',
  observed:{...observed,singlePairAbsenceProbability:Math.exp(-observed.score),suffixSha256:digest(tail),suffixAlphabet:[...new Set(tail)].sort().join('')},
  control:{seedHex:'53344654',iterations,atLeastObserved,smoothedTailFrequency:(atLeastObserved+1)/(iterations+1),elapsedMs:Date.now()-started,
    nullModel:'uniform permutations preserving every FAED symbol count; recompute maximum over all 36 pairs for each control'},
  limitation:'Exploratory suffix test motivated by a prior community observation. Controls account for pair selection, not all earlier tests or interior-window selection. No cipher, plaintext or password is identified.'
},null,2));
