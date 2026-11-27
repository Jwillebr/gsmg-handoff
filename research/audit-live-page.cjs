// Audit a fetched creator-hosted page without publishing its full HTML.
const fs = require('node:fs');
const { digest, parseEnvelope, loadTargets } = require('./tester.cjs');
const URL = 'https://gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32';
const binary = text => [...Buffer.from(text)].map(b => b.toString(2).padStart(8, '0').replace(/0/g, 'a').replace(/1/g, 'b')).join('');
function extract(html) {
  const areas = [...html.matchAll(/<textarea\b[^>]*>([\s\S]*?)<\/textarea>/gi)].map(m => m[1].replace(/\s/g, ''));
  if (areas.length !== 2) throw new Error('Expected two textareas');
  const cosmic = parseEnvelope(Buffer.from(areas[1], 'base64'));
  const smallParts = areas[0].match(/(U2FsdGVk[A-Za-z0-9+/=]{56})([ab]+)([A-Za-z0-9+/=]{64})shabefanstoo$/);
  if (!smallParts || smallParts[2] !== binary('enter')) throw new Error('Unexpected small blob/binary boundary');
  const small = parseEnvelope(Buffer.from(smallParts[1] + smallParts[3], 'base64'));
  const marker = binary('matrixsumlist'), markerIndex = areas[0].indexOf(marker);
  if (markerIndex < 0 || markerIndex !== areas[0].lastIndexOf(marker)) throw new Error('Ambiguous matrixsumlist marker');
  const dbbi = areas[0].slice(0, markerIndex);
  const faed = areas[0].slice(markerIndex + marker.length, areas[0].indexOf('z'));
  if (!/^[a-i]+$/.test(dbbi) || !/^[a-i]+$/.test(faed)) throw new Error('Unexpected numeric-run alphabet');
  return { areas, cosmic, small, dbbi, faed };
}
module.exports = { extract };
if (require.main === module) {
  const page = fs.readFileSync(process.argv[2]);
  const found = extract(page.toString('utf8')), targets = loadTargets();
  const checks = [['cosmic', found.cosmic], ['salphaseion', found.small]].map(([name, blob]) => {
    if (blob.sha256 !== targets.find(t => t.name === name).sha256) throw new Error(`Mismatch: ${name}`);
    return { name, envelopeSha256: blob.sha256, ciphertextBytes: blob.ciphertext.length, exactLocalMatch: true };
  });
  console.log(JSON.stringify({
    auditedAt: new Date().toISOString(), source: URL, fetch: 'PowerShell Invoke-WebRequest, HTTP 200',
    savedUtf8PageSha256: digest(page), sourceStatus: 'current-creator-hosted-response-not-proof-of-historical-immutability',
    checks, markerChecks: { matrixsumlist: true, enter: true },
    smallAssembly: 'Keep all 64 characters of each base64 fragment, including the z at the end of the first; remove only the 40-letter binary enter marker.',
    unexplainedRuns: [{ name: 'dbbi', length: found.dbbi.length, sha256: digest(found.dbbi) }, { name: 'faed', length: found.faed.length, sha256: digest(found.faed) }]
  }, null, 2));
}
