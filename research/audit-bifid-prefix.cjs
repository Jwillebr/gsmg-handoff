// S5: reproduce a public FAED reading and quantify key-selection flexibility.
// This is an audit of a proposed reading, not a declaration of a solution.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { extract } = require('./audit-live-page.cjs');
const { digest } = require('./tester.cjs');
const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
const keyed = seed => [...new Set((seed.toUpperCase()+alphabet).replace(/J/g,'I'))].join('');
function decipherWholePeriod(ciphertext, key, outputLimit = ciphertext.length) {
  if (key.length!==25 || new Set(key).size!==25) throw new Error('Invalid key square');
  const positions = new Map([...key].map((c,i)=>[c,i]));
  const coords = [];
  for (const c of ciphertext.toUpperCase()) {
    const index = positions.get(c);
    if (index===undefined) throw new Error('Cipher character absent from key');
    coords.push(Math.floor(index/5),index%5);
  }
  let result='';
  for(let i=0;i<Math.min(outputLimit,ciphertext.length);i++) result+=key[coords[i]*5+coords[ciphertext.length+i]];
  return result;
}
// Hand-derived two-letter fixture: B=(0,1), A=(0,0); split 01|00 -> AF.
assert.equal(decipherWholePeriod('BA',alphabet),'AF');
const source = fs.readFileSync(process.argv[2]);
const { dbbi, faed } = extract(source.toString('utf8'));
const seed = [...new Set(dbbi.slice(0,13).toUpperCase())].join('');
if(seed.length!==8) throw new Error('Expected eight unique seed letters');
const key = keyed(seed), decoded = decipherWholePeriod(faed,key);
// Preserve the complete unverified transform locally, outside tracked files.
fs.mkdirSync('.gsmg-private/bifid-S5',{recursive:true});
fs.writeFileSync('.gsmg-private/bifid-S5/decoded.txt',decoded);
let keys=0, startsBtcseed=0, seedWithinFirstEight=0;
const started=Date.now();
function visit(prefix, remaining) {
  if(!remaining.length){
    keys++;
    const head=decipherWholePeriod(faed,keyed(prefix),8);
    if(head.startsWith('BTCSEED'))startsBtcseed++;
    if(head.includes('SEED'))seedWithinFirstEight++;
    return;
  }
  for(let i=0;i<remaining.length;i++) visit(prefix+remaining[i],remaining.slice(0,i)+remaining.slice(i+1));
}
visit('',seed);
const controls = [seed,'ABCDEFGHI','IHGFEDCBA'].map(s=>{
  const k=keyed(s),text=decipherWholePeriod(faed,k),even=[...text].filter((_,i)=>i%2===0);
  const forced = [k[0],k[1],k[5],k[6]].sort().join('');
  return {seed:s, evenIndexAlphabet:[...new Set(even)].sort().join(''), mathematicallyAllowedEvenAlphabet:forced,
    allEvenPositionsWithinForcedAlphabet:even.every(c=>forced.includes(c))};
});
console.log(JSON.stringify({
  id:'S5-2026-11-27',auditedAt:new Date().toISOString(),sourceUtf8Sha256:digest(source),faedSha256:digest(faed),dbbiSha256:digest(dbbi),generatorSha256:digest(fs.readFileSync(__filename)),
  method:'5x5 Bifid, J omitted, whole-message period 570; seed is deduplicated first 13 DBBI symbols; append remaining alphabet',
  algorithmReference:'https://github.com/jameslyons/pycipher/blob/master/pycipher/bifid.py',algorithmReferenceBlobSha:'18ca27f0bcbe4ec0020e2ec635d5e8195be23c43',
  seed,keySquare:key,period:faed.length,reproducedPrefix:decoded.slice(0,7),decodedSha256:digest(decoded),
  exhaustiveFamily:{keys,startsBtcseed,seedWithinFirstEight,btcseedFraction:startsBtcseed/keys,seedFraction:seedWithinFirstEight/keys,elapsedMs:Date.now()-started},
  alternatingAlphabetControls:controls,
  explanation:'All ciphertext letters occupy the first nine key-square positions, hence rows 0 or 1. At even output indices both reconstructed coordinates come from those row entries, forcing a 2x2/four-letter alphabet. That pattern is produced by the transform itself.',
  limitations:'Prefix targets were noticed after prior searches; frequencies are not a globally corrected significance test. This audit cannot prove no intended Bifid reading exists, and neither a short word nor the alternating alphabet validates a decrypted stage.'
},null,2));
