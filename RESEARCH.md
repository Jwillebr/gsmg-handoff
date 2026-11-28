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
   S4 independently confirms that FAED's last 32 symbols omit e and g, and
   quantifies the restriction against all 36 omitted-pair alternatives. Keep
   the full prefix and tail; seek an encoding/generation explanation for that
   boundary rather than assuming the entire run is uniform noise or plaintext.
   Do not repeat the same suffix permutation test without a changed hypothesis.
2. Choose one justified, bounded experiment from actual source structure.
   Simple double/triple hashes (L1) and round-robin interleaving (L2) are already
   tested. Treat byte-140 and community suggestions as hypotheses until
   supported by source evidence. Compare against the inherited ruled-out list.
   S2 now reproduces a strong prime-slot grammar in DBBI, with two complete
   parses (83/84 cells). Neither marker-count pair matches the live poster's
   measured 15 blue / 9 yellow cells. Before using a colour or 7x12-grid model,
   establish its image version and mapping; do not assume community counts.
   S3 has now established a partial ordered connection: the 84-cell parse
   matches 22/23 of the grid's first 23 markers, differing at prime 73; the
   grid has a 24th marker absent from both parses. The signed 84-cell model
   sums to 101, equal to the grid's one-bit count. Direct signed 6x14 row/column
   sums have now been tested as passwords in L3 without a hit. Before trying
   more matrix dimensions or operations, require an additional source-supported
   constraint or independently testable prediction. Arbitrary word fragments
   from a 7x12/Hill interpretation are not validation. Do not repeat S3 or L3.
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

## 2026-11-27 17:05 EST: original grid and DBBI-marker alignment S3

- Retrieved [the original grid PNG](https://gsmg.io/img/follow_the_white_rabbit.png),
  350x350, 1,958 bytes, SHA-256
  `5e8d84b88f8f829428df5d2a8bf36c7268346f169b799ac7570b6223990d204f`.
  The root path without `/img/` returned 404; use the actual image path.
  Local source: `.gsmg-private/sources/grid-live-2026-11-27.png`.
- Extracted each 25x25 cell by majority pixel class (without editing cells),
  then followed the down-first counter-clockwise spiral. The first 192 bits
  reproduce `gsmg.io/theseedisplanted`; four residual majority-class bits are
  `0000`. All 24 coloured cells fall exactly at byte-LSB positions, so their
  blue/yellow sequence is the parity of the URL's ASCII characters. This
  independently explains the measured 15/9 colour counts, rather than making
  them unexplained password ingredients. The grid contains 101 one-bits.
- Additional prime weighting of the 24 ordered markers gives blue 484 and
  yellow 479. These sums are an extra hypothesis, not automatically a decoded
  instruction. This does not establish the full image contains no other data:
  majority-cell extraction intentionally ignores fine pixel/rabbit structure.
- S3 compares both DBBI prime-marker parses against 23 of the 24 grid markers,
  enumerating every one-marker omission, both reading directions and both
  colour assignments. Best score: 22/23, using the 84-cell parse, forward order,
  `b=blue`, `be=yellow`, omitting the final grid marker. The sole disagreement
  is marker 21 / prime 73: DBBI says blue, grid says yellow. The 83-cell parse
  also disagrees at prime 83 under the same direct alignment. There is no exact
  match, and the omitted 24th marker must not be silently discarded as solved.
- Applying that entire alignment family to 5,000 fixed-seed shuffled marker
  sequences (preserving colour totals) yielded 2 with scores at least 22.
  Smoothed tail frequency 3/5,001 = 0.00059988. This is exploratory and does not
  account for all earlier community model selection, so it is not a proof of
  intended encoding. It supports investigating the partial ordered relation.
- Under the explicit signed-value hypothesis (ordinary a-i=1..9; prime-slot
  `b=-slot`, `be=+slot`), 84 cells total 341-240=101, matching the independent
  grid one-bit count. The 83-cell alternative totals 262. This additional
  consistency does not specify a grid shape, plaintext or AES password.
- Reproducers: `research/extract-grid.ps1`, `research/audit-marker-alignment.cjs`.
  Complete source/grid hashes, cells, marker coordinates, numeric values and
  controls: `research/original-grid-2026-11-27.json`,
  `research/marker-alignment-S3.json`. No AES batch or confirmed solution here.
- Relevant prior research consulted 2026-11-27:
  [grid artifact measurements](https://github.com/AppleLamps/GSMG-CLEAN/blob/main/prior_research_ledgers/rabbit_gemini_audit/FINDINGS_48_addenda.md).
  Measurements above were independently reproduced; later claims about
  successful decryptions or hash-path pages in that ledger remain untrusted.
- Worker checkpoint: 210,000 words / 2,523,234 reported decryptions at
  16:57:10 EST. Worker and sync processes remain active and were not changed.

## 2026-11-27 18:00 EST: signed matrix-sum password batch L3

- Tested the planned literal `matrixsumlist` reading using the 84-cell signed
  DBBI model, placed row-major in six rows of 14 cells. Width 14 is motivated by
  the original image, but this reshape and the signed numeric interpretation
  remain hypotheses; neither is an explicitly decoded instruction.
- Row sums: `[30,54,-22,2,128,-91]`; column sums:
  `[-70,20,-179,41,95,37,32,38,77,28,45,29,-124,32]`. Both total 101 as expected
  from S3; this is a conserved total, not new independent evidence for a shape.
  Column sums modulo 26 with A=0 yield `iudprlgmzctdgg`; rows yield `ececyn`.
  Neither has been asserted to be a decoded message.
- Candidate family is fully bounded: rows, columns, rows-then-columns and
  columns-then-rows; signed decimal with empty/comma/space/colon/hyphen
  separators, or modulo-26 alphabetic encodings with A=0/A=1; every material
  both raw and SHA-256 UTF-8 hex. Removed any L1/L2 overlaps. This tests DBBI
  sums, distinct from the inherited handoff's original binary-grid sum sweeps.
- Completed 56 unique passwords / 336 decryptions over three targets and
  SHA-256/MD5 EVP in 22 ms. One padding-valid binary output, zero text-review
  flags. Independent OpenSSL exactly reproduced that result. No confirmed
  solution. The binary output remains in ignored local storage.
- Generator with known matrix-sum fixture:
  `research/generate-matrix-batch.cjs`. Exact derivation/settings:
  `research/matrix-batch-L3.json`; candidates: `research/candidates-L3.txt`;
  completed checkpoint and source/target/tester hashes:
  `research/checkpoint-L3.json`. Candidate SHA-256:
  `590ccec744e253a91df90fa8d92573b30b3e95d66425679efa0fdc78cc6a9e7d`.
- Inputs remain the previously authenticated
  [Salphaseion source](https://gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32)
  and [original grid](https://gsmg.io/img/follow_the_white_rabbit.png), fetched
  2026-11-27; local source fingerprints are in S3. No additional web claims
  or supposed community plaintext hashes were used in L3.
- Worker checkpoint: 232,000 words / 2,787,234 reported decryptions at
  17:54:06 EST. Worker and inputs were not modified.

## 2026-11-27 19:02 EST: FAED terminal-alphabet experiment S4

- Examined a prior community observation about the end of FAED using the
  authenticated creator-source snapshot. Its last 32 symbols, zero-based
  positions 538..569, contain neither `e` nor `g`; both appear repeatedly
  earlier (69 e, 107 g in the full 570-symbol run). The maximal e/g-free suffix
  is exactly 32 symbols. Its alphabet is `abcdfhi`, and suffix SHA-256 is
  `47c840bd13ccf320b70f29b776ddb7e59df055ccd5f474c057c429d057f690b8`.
- Tested a specific nonstationarity question, distinct from S1's adjacent-order
  test: for each of all 36 omitted-letter pairs, find the maximal terminal run
  lacking that pair and score it by its exact count-conditioned absence
  probability. Use the most extreme score across all pairs for both observed
  data and controls, so the e/g pair is not privileged in the null comparison.
- The observed best pair is e/g. Given the observed counts, absence from a
  specified 32-symbol suffix has probability 0.00000490963 under uniform
  count-preserving order. In 10,000 fixed-seed shuffled controls, zero had an
  equally extreme maximum over all 36 pairs. Smoothed descriptive tail
  frequency: 1/10,001. Zero observed controls is not zero probability. This
  exploratory analysis accounts for pair selection but not every past research
  choice or arbitrary interior-window searches; it identifies a structural
  lead, not a cipher or a plaintext. S1's weaker global result does not rule
  out this localized terminal structure.
- Reproducer with an exact finite-population probability sanity check:
  `research/audit-faed-tail.cjs`. Full source/FAED/generator/suffix hashes,
  statistic, seed, counts and controls: `research/faed-tail-S4.json`. Runtime
  for controls: 138 ms. No AES batch or new potential solution in this run.
- Primary input:
  [creator-hosted source](https://gsmg.io/89727c598b9cd1cf8873f27cb7057f050645ddb6a7a157a110239ac0152f6a32),
  saved 2026-11-27 (page SHA-256 `a83d3de7...1779d77`, full hash in artifact).
  Prior observation motivating this check:
  [community evidence reconciliation](https://github.com/AppleLamps/combined-puzzle/blob/main/GSMG-CLEAN/16_CANONICAL_LEDGER_AND_WORKING_RULES_2026-11-10.md).
  No further community decryption claims are adopted.
- Worker checkpoint: 256,000 words / 3,075,234 reported decryptions at
  18:56:03 EST. Existing worker and sync processes remain present; no inputs
  or running processes were changed.
