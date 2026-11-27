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

1. Establish a small, resumable candidate tester separately from the running
   worker. Verify derivation and decryption against independently generated
   known-answer fixtures, including wrong-password cases. Check PKCS#7 padding
   and meaningful plaintext structure together; padding alone is not a solve.
   Support SHA-256 and MD5 derivation as explicitly labeled hypotheses.
2. Verify ciphertexts, clue wording, and claimed derivation against original
   public puzzle material. Source links are in `index.html`. Preserve exact
   source excerpts/inputs and provenance for reproducible transformations.
3. Choose one justified, bounded experiment on unresolved clue relationships
   such as first/second answers or intertwined halves. Treat byte-140 and
   community suggestions as hypotheses until supported by source evidence.
   Compare against the inherited ruled-out list before spending compute.

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
