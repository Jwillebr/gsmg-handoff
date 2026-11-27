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

1. Finish Cosmic Duality provenance verification using creator material or
   an independently archived page/image. Salphaseion matches the community
   archive; phase32end was recovered from a reproduced historical stage.
   SHA-256 EVP derivation is now verified for historical phase 3.2, but remains
   an inference for unsolved blobs. Creator-hosted endpoints were inaccessible
   to the browser fetch tool at the last check; use another archival source
   rather than repeatedly retrying the same inaccessible endpoint.
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

## 2026-11-27 13:05 EST: historical regression and layered-hash batch L1

- `research/verify-phase32.cjs` reproduces historical phase 3.2 from the pinned
  community archive, using its published solved password. SHA-256 EVP yields
  2,422 plaintext bytes with the expected opening; independent OpenSSL
  decryption is byte-identical. MD5 fails padding. The embedded phase32end
  envelope exactly matches our target. This advances provenance beyond simply
  copying the handoff; it does not authenticate the creator-hosted original.
  Hashes and settings: `research/phase32-verification-2026-11-27.json`.
- Original hashed gsmg.io page and creator itch.io page were inaccessible to
  the web fetch tool on this run. Cosmic provenance is still unresolved.
- Experiment L1 interprets the archived `shabefanstoo` clue as a possible
  additional SHA-256 instruction. This is a speculative reading; the source
  does not establish that it literally means the token `secondanswer`.
  Raw and single-hash forms are omitted because the inherited handoff reports
  them extensively tested. Generator: `research/generate-layered-batch.cjs`.
  It uses the four archived decoded clues, their ordered distinct pairs,
  individual hash/cleartext pair mixtures, and full page order, then applies
  two or three hashes of UTF-8 hex, or a second hash of the binary digest.
- Completed all 162 distinct candidate passwords on three targets with both
  SHA-256 and MD5 EVP: 972 decryptions in 87 ms, 3 padding-valid results,
  0 text-review flags. All three were binary output, retained locally and
  independently reproduced with OpenSSL. None is evidence of a solution.
  Padding alone is expected to produce occasional false positives.
- Candidate file SHA-256:
  `fd2e4c794cbc2a5765e3e80e342fbe8aa96ad17e4fccbf4c1edd9ac500daf81c`.
  Exact candidates: `research/candidates-L1.txt`; settings/target/tester hashes
  and complete checkpoint: `research/checkpoint-L1.json`. Do not repeat L1.
- Sources retrieved 2026-11-27:
  [pinned community README](https://github.com/puzzlehunt/gsmgio-5btc-puzzle/blob/fb92dd15487c6e2d275adb8c923698b7166c328e/README.md),
  [issue 104 and subsequent corrections](https://github.com/puzzlehunt/gsmgio-5btc-puzzle/issues/104).
  Issue discussions contain disputed solver-generated chains and are not
  creator evidence; their claimed plaintext hashes are not validation targets.
- Source worker checkpoint at start: 118,000 words / 1,419,234 decryptions at
  13:00:45 EST. No worker inputs or running processes were changed.
