// S3: compare both DBBI prime-marker parses with the original grid's marker order.
const fs = require('node:fs');
const { digest } = require('./tester.cjs');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const grid = read(process.argv[2]), parse = read(process.argv[3]);
const rows = grid.rows;
if (rows.length !== 14 || rows.some(r => r.length !== 14)) throw new Error('Invalid grid');
const spiral = [], visited = new Set(), directions = [[1,0],[0,1],[-1,0],[0,-1]];
let r=0,c=0,d=0;
for (let i=0;i<196;i++) {
  spiral.push({ row:r+1,col:c+1,kind:rows[r][c] }); visited.add(`${r},${c}`);
  let nr=r+directions[d][0],nc=c+directions[d][1];
  if(nr<0||nr>=14||nc<0||nc>=14||visited.has(`${nr},${nc}`)) { d=(d+1)%4;nr=r+directions[d][0];nc=c+directions[d][1]; }
  r=nr;c=nc;
}
const bits = spiral.map(x => ['B','1'].includes(x.kind)?'1':'0').join('');
let text='';for(let i=0;i<192;i+=8)text+=String.fromCharCode(parseInt(bits.slice(i,i+8),2));
if(text!=='gsmg.io/theseedisplanted') throw new Error(`Grid decode mismatch: ${JSON.stringify(text)}`);
const marked=spiral.map((x,i)=>({...x,spiralIndex:i+1})).filter(x=>['B','Y'].includes(x.kind));
const markerWord=marked.map(x=>x.kind).join('');
const primes=[];for(let n=2;primes.length<marked.length;n++){let ok=true;for(let j=2;j*j<=n;j++)if(n%j===0){ok=false;break;}if(ok)primes.push(n);}
const weighted={B:0,Y:0};marked.forEach((x,i)=>weighted[x.kind]+=primes[i]);
function bestAlignment(word) {
  let best={matches:-1};
  for(const solution of parse.solutions) for(const reverse of [false,true]) for(const swap of [false,true]) for(let omit=0;omit<word.length;omit++) {
    const retained=[...word].filter((_,i)=>i!==omit);if(reverse)retained.reverse();
    const predicted=solution.markers.map(m=>m.token==='b'?(swap?'Y':'B'):(swap?'B':'Y'));
    if(predicted.length!==retained.length)throw new Error('Expected exactly one omitted marker');
    const matches=predicted.filter((x,i)=>x===retained[i]).length;
    if(matches>best.matches)best={matches,compared:retained.length,cells:solution.cells,reverse,swap,omittedMarkerIndex:omit+1,exact:matches===retained.length};
  }
  return best;
}
const observed=bestAlignment(markerWord);
const numericModels=parse.solutions.map(solution=>{
  const markerPositions=new Set(solution.markers.map(m=>m.position));
  const values=solution.tokens.map((token,i)=>markerPositions.has(i+1)?(token==='be'?i+1:-(i+1)):token.charCodeAt(0)-96);
  const differences=solution.markers.map((m,i)=>({markerIndex:i+1,prime:m.position,dbbi:m.token==='b'?'B':'Y',grid:markerWord[i]})).filter(x=>x.dbbi!==x.grid);
  return {cells:solution.cells,model:'ordinary a-i = 1..9; prime-slot b = negative slot index; be = positive slot index',values,
    ordinarySum:values.filter((_,i)=>!markerPositions.has(i+1)).reduce((a,b)=>a+b,0),
    primeSum:values.filter((_,i)=>markerPositions.has(i+1)).reduce((a,b)=>a+b,0),
    total:values.reduce((a,b)=>a+b,0),
    differencesAgainstFirst23GridMarkers:differences};
});
let seed=0x53334d41;
function random(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;}
let controlsAtLeastObserved=0;const iterations=5000;
for(let i=0;i<iterations;i++){
  const chars=[...markerWord];for(let j=chars.length-1;j>0;j--){const k=Math.floor(random()*(j+1));[chars[j],chars[k]]=[chars[k],chars[j]];}
  if(bestAlignment(chars.join('')).matches>=observed.matches)controlsAtLeastObserved++;
}
console.log(JSON.stringify({id:'S3-2026-11-27',auditedAt:new Date().toISOString(),generatorSha256:digest(fs.readFileSync(__filename)),gridImageSha256:grid.imageSha256,dbbiSha256:parse.dbbiSha256,
 recoveredUrl:text,residualBits:bits.slice(192),markerWord,markers:marked,markerCount:marked.length,
 gridOneBits:[...bits].filter(x=>x==='1').length,numericModels,
 allMarkersAtByteLSB:marked.every(x=>x.spiralIndex%8===0),primes,primeWeightedColorSums:weighted,
 interpretation:'Grid markers encode byte parity of the URL. Prime weighting is an additional hypothesis, not an independently decoded instruction.',
 alignmentFamily:'Both DBBI parses; either color assignment; forward/reversed marker order; exactly one omitted grid marker. Best score across all choices used for observed and controls.',
 observed,control:{seedHex:'53334d41',iterations,controlsAtLeastObserved,smoothedTailFrequency:(controlsAtLeastObserved+1)/(iterations+1),nullModel:'shuffle 24 grid marker labels, preserving blue/yellow counts'},
 limitations:'Exploratory family, not a proof of intended encoding. No AES password or plaintext follows from parity, sums, or approximate alignment.'},null,2));
