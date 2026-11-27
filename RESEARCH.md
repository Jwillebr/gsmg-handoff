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

1. Use the verified creator-hosted source snapshot to study the unexplained
   91-letter dbbi and 570-letter faed runs and their relation to decoded clues.
   Source authentication is complete for the two page blobs: direct PowerShell
   HTTP retrieval works even though browser fetch failed. Do not spend another
   run reconfirming ciphertexts or repeating the simple adjacent-order audit.
2. Choose one justified, bounded experiment from actual source structure.
   Simple double/triple hashes (L1) and round-robin interleaving (L2) are already
   tested. Treat byte-140 and community suggestions as hypotheses until
   supported by source evidence. Compare against the inherited ruled-out list.
   S2 now reproduces a strong prime-slot grammar in DBBI, with two complete
   parses (83/84 cells). Neither marker-count pair matches the live poster's
   measured 15 blue / 9 yellow cells. Before using a colour or 7x12-grid model,
   establish its image version and mapping; do not assume community counts.
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

## 2026-11-27 14:04 EST: partial screenshot provenance and interleaving L2

- Visually inspected the archived Salphaseion/Cosmic screenshot at pinned
  commit `fb92dd15487c6e2d275adb8c923698b7166c328e`. Its first Cosmic base64
  line (64 characters) matches our target exactly. The screenshot cuts off
  the textarea, so it cannot establish the full ciphertext. Reproducible
  prefix check and image fingerprint: `research/audit-cosmic-image.cjs` and
  `research/cosmic-image-audit-2026-11-27.json`.
  [Archived image](https://github.com/puzzlehunt/gsmgio-5btc-puzzle/blob/fb92dd15487c6e2d275adb8c923698b7166c328e/SalPhaselonCosmicDuality.png),
  retrieved 2026-11-27; SHA-256
  `a3810ba24250c5a04908e1281c2202e73f7487f9d19f41bfd2c3e55fa9be57ed`.
- L2 tests literal round-robin character interleaving, motivated by the
  historical stage's intertwined-password wording. This is a speculative,
  bounded interpretation, distinct from the concatenation and XOR experiments.
  Four decoded clue strings are permuted in every ordered selection of
  2, 3 or 4 distinct strings (60 orderings). Weave either the original strings
  or their individual SHA-256 hex digests, preserving leftover characters;
  test both woven text and its SHA-256 hex. No L1 candidates are repeated.
  Generator has known-output assertions for unequal-length and three-way
  interleaving: `research/generate-interleave-batch.cjs`.
- Completed 240 distinct passwords / 1,440 decryptions (three target blobs,
  SHA-256 and MD5 EVP) in 138 ms. Six padding-valid outputs, all binary, zero
  text-review flags. Independent OpenSSL reproduced all six byte-for-byte via
  `node research/verify-padding-results.cjs research/checkpoint-L2.json`.
  Plaintext remains only in ignored local storage. No confirmed solution.
- Candidate SHA-256:
  `943906203be83b18b8de2b5db4d8ca75d333c3188a56cce9b0357795089d583f`.
  Full settings, target/tester hashes and completed checkpoint:
  `research/checkpoint-L2.json`; exact passwords: `research/candidates-L2.txt`.
  Do not repeat this interleaving family without new source justification.
- Brief exploratory decode: removing the first bold binary segment from the
  archived Salphaseion first quote and interpreting remaining a-i/o as decimal
  gives 661 digits. Decimal-to-hex of this whole sequence, or separately its
  91/570-digit pieces, does not directly yield ASCII/base64. This was a format
  probe, not proof that the unexplained numeric text is meaningless.
- Worker advanced to 142,000 words / 1,707,234 reported decryptions at
  14:02:04 EST. Worker and existing progress-sync process remain present.

## 2026-11-27 15:01 EST: full live-source verification and structural audit S1

- Successfully retrieved the actual creator-hosted hashed page with PowerShell
  `Invoke-WebRequest -UseBasicParsing` (HTTP 200). Previous web-tool failures
  were not evidence that the site was offline. The full Cosmic envelope and
  reconstructed Salphaseion envelope exactly match our local target hashes.
  The page has two textareas; the small blob is reconstructed by keeping all
  64 characters in each fragment, including the first fragment's terminal z,
  and removing the nested 40-letter binary marker that decodes to `enter`.
  This resolves full current-source provenance, not historical immutability.
- Source retrieved 2026-11-27:
  [creator-hosted page](https://gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32).
  Saved UTF-8 HTML SHA-256:
  `a83d3de7810f26b19b4965339b76d403e44f6b6877e5d7de2555480ca1779d77`.
  Local snapshot: `.gsmg-private/sources/salphaseion-2026-11-27.html` (ignored
  by Git). Public reproducible parser and metadata:
  `research/audit-live-page.cjs`, `research/live-page-audit-2026-11-27.json`.
- Isolated the 91-letter dbbi run and 570-letter faed run around the binary
  `matrixsumlist` marker. Both use only a-i, unlike the later a-i/o decimal
  clue segments. They remain unexplained; earlier decimal probes do not
  justify treating them as nonsense or as decoded text.
- Experiment S1 measures adjacent-symbol mutual information against 5,000
  fixed-seed shuffled controls per run, preserving every symbol count. This
  is an exploratory structural test, not a candidate-password search. The
  two-sided Monte Carlo p-values are 0.10238 (dbbi) and 0.51110 (faed), neither
  below the nominal Bonferroni threshold 0.025 for these two tests. The test
  finds no unusual adjacency at that threshold; it cannot establish randomness
  or rule out long-range, numeric, matrix, or cryptographic structure.
- Full source/run hashes, counts, statistic, controls and seed are recorded in
  `research/run-structure-S1.json`; executable method:
  `node research/audit-run-structure.cjs .gsmg-private/sources/salphaseion-2026-11-27.html`.
  No puzzle decryptions or new potential solutions in S1. Do not repeat S1
  unchanged. A future experiment needs a source-supported transformation or
  a clearly stated independent structural hypothesis.
- Source worker checkpoint: 164,000 words / 1,971,234 reported decryptions at
  14:58:21 EST. Worker and sync process are still present and untouched.

## 2026-11-27 16:06 EST: lossless prime-slot parsing S2 and poster discrepancy

- Independently implemented the community's proposed DBBI grammar: number cells
  from 1; at a prime cell consume `b` or `be`; elsewhere consume one a-i symbol;
  require the entire 91-symbol input to be consumed. Enumerating every branch
  gives exactly two parses: 84 cells with 16 `b` / 7 `be` prime markers, and
  83 cells with 15 `b` / 8 `be` prime markers. Tokenization is ambiguous.
- In 10,000 fixed-seed symbol-count-preserving shuffled controls, zero had any
  complete parse under that grammar. Smoothed frequency is 1/10,001; this is
  descriptive, not a preregistered p-value, because the model was selected from
  prior community exploration. It suggests the grammar deserves investigation
  but does not determine numeric values, grid shape, or the intended password.
- Hypothesis source, retrieved 2026-11-27:
  [researcher's open-lead ledger](https://github.com/AppleLamps/GSMG-CLEAN/blob/main/03_OPEN_LEADS.md).
  Its proposed 7x12 shape and downstream interpretations remain unverified here.
  Independent parser, full tokenizations, hashes and controls:
  `research/audit-prime-parser.cjs`, `research/prime-parser-S2.json`.
- Checked the actual [creator-hosted puzzle image](https://gsmg.io/puzzle).
  The endpoint returns PNG, not HTML. Its 29,931 bytes exactly match pinned
  community `puzzle.png`, SHA-256
  `38125bbdf1ea58b9b30b075bc6bf71e4089d04bba37098317e47097e2f2a1830`.
  A 14x14 grid with 75px cells has **15 blue and 9 yellow cells** under explicit
  RGB thresholds. Sampling five offsets per cell (15,25,37,50,60) gives the same
  counts each time. Thus neither DBBI parse's marker counts match this poster
  under either blue/yellow assignment. Do not use the community's 16/7 count
  as a verified fact about this image; another image version or mapping would
  need evidence. No proof of a colour interpretation or decryption follows.
- Reproducer: `research/extract-poster-colors.ps1`; complete coordinates and
  metadata: `research/poster-colors-2026-11-27.json`. Live image retained locally
  at `.gsmg-private/sources/puzzle-live-2026-11-27.png`. S2 did not run AES
  candidates or establish a new plaintext. No confirmed solution.
- Worker checkpoint: 188,000 words / 2,259,234 reported decryptions at
  16:00:14 EST. Existing worker and sync processes were not modified.
