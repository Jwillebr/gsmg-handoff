# GSMG research checkpoint

## Objective and current state

Continue investigating the public GSMG puzzle's remaining Cosmic Duality lock.
The handoff is in `index.html`; its statements about earlier attempts are
inherited reports, not independently reproduced results in this checkout.

The existing worker runs from `C:\Users\Jake.Willebrandt\Downloads\Worker data`.
Do not restart it or change its inputs during a run. `sync_progress.ps1` copies
only its progress log into this repo and pushes it every five minutes.
The dictionary worker and recurring research are separate processes.

## 2026-11-27: initial local audit

- Worker process was present. Latest source-log checkpoint observed during setup:
  70,000 words / 843,234 decryptions. These counts are worker reports, not counts
  of distinct passwords or proof that a particular hypothesis was exhausted.
- The worker uses EVP-style SHA-256 key derivation and AES-256-CBC with padding
  disabled. Its hit condition is greater than 88% printable ASCII. It does not
  check PKCS#7 padding. This differs from the stricter method described elsewhere
  in the handoff. No confirmed solution has been observed.
- All three embedded ciphertexts are block-aligned. SHA-256 fingerprints below
  cover the complete decoded OpenSSL envelope (header, salt, ciphertext):

| Worker target | Ciphertext bytes | Envelope SHA-256 |
| --- | ---: | --- |
| cosmic | 1328 | b18950551a4dd0cb8a9378f0906ba18c03a15f0ee83eb98c6bc90165c5f79805 |
| salphaseion | 80 | 9e2831e1b34b5f34796df47ccaf6530d48d371c61a6bff84d60db1064fa7a258 |
| phase32end | 80 | 291dfd6f3e759ec2e272b35a00c24907da70c3e7a9291b4c13605c7b0b4f3de9 |

## Next research run

1. Finish provenance verification against creator material for Cosmic Duality
   and phase32end, and verify the KDF assumptions. Salphaseion has only been
   cross-checked against a community archive, not creator-hosted originals.
   Source links are in `index.html`. Preserve provenance for transformations.
2. Choose one justified, bounded experiment on unresolved clue relationships
   such as first/second answers or intertwined halves. Treat byte-140 and
   community suggestions as hypotheses until supported by source evidence.
   Compare against the inherited ruled-out list before spending compute.
3. Use `research/tester.cjs` to run exact candidate lines with a persistent
   checkpoint. SHA-256 and MD5 are separate KDF hypotheses. Do not repeat the
   completed fixture validation unless the tester or dependencies change.

## Recording rules

For each batch, record the hypothesis, source URLs and retrieval date, exact
input/generator, transformation and KDF settings, ciphertext fingerprints,
candidate/decryption counts, checkpoint or candidate hashes, elapsed time,
result, and next step. Preserve executable generators when a batch is too large
to list. Distinguish inherited claims, fresh verified evidence, and speculation.
Resume incomplete batches instead of restarting or duplicating searches.
Store any potential solution locally for verification before publishing its
plaintext or any resulting key material. Public progress can note that a
candidate requires verification without disclosing it.

## 2026-11-27 12:05 EST: tester validation and source cross-check

- Added a Node standard-library tester, separate from the active PowerShell
  worker. It supports EVP-style SHA-256/MD5 derivation, AES-256-CBC with strict
  PKCS#7, exact UTF-8 password lines, candidate deduplication, bounded batches,
  checkpoints tied to input/tester/target hashes, and local-only preservation of
  every padding-valid result (including binary). Printable text is a review
  flag, not a solve. No private result files are committed.
- Validation command: `node --test research/tester.test.cjs`. Four tests passed
  in approximately 1.4 seconds. Independently generated fixtures came from
  Git for Windows' OpenSSL 3.5.5 executable, rather than this tester's own
  encryption implementation. Six fixtures cover SHA-256/MD5 and multiline,
  block-aligned, and UTF-8 plaintext. Derived key/IV and decrypted bytes match
  OpenSSL; six wrong-password checks fail as expected. Malformed envelopes and
  binary-result triage were checked as well.
- Resume test used two deliberately artificial passwords against all three
  targets and both KDFs: 12 decryptions total, then zero additional decryptions
  on a completed checkpoint. Altered candidate input was rejected. These are
  engineering checks, not a meaningful puzzle search or new ruled-out lead.
- Archived source:
  [puzzlehunt README at fb92dd15487c6e2d275adb8c923698b7166c328e](https://github.com/puzzlehunt/gsmgio-5btc-puzzle/blob/fb92dd15487c6e2d275adb8c923698b7166c328e/README.md),
  retrieved 2026-11-27. `research/audit-source.cjs` independently reconstructs its
  Salphaseion blob and confirms an exact match to our 80-byte target. Its two
  decimal-to-hex-to-ASCII clues reproduce `lastwordsbeforearchichoice` and
  `thispassword`. This confirms transcription consistency with that community
  archive; it does not establish author authenticity or the unsolved KDF.
  Full fingerprints/provenance are in `research/source-audit-2026-11-27.json`.
- No confirmed solution and no new substantive candidate batch in this run.
  Existing dictionary-worker checkpoint was 94,000 words / 1,131,234
  decryptions at 11:58:09 EST; worker and sync process remain present.
