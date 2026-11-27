# gsmg-handoff

The worker currently runs in `C:\Users\Jake.Willebrandt\Downloads\Worker data`.
Its `progress.log` is copied into this repository and committed/pushed to GitHub
by `sync_progress.ps1`. The worker can continue running during synchronization.
Only `progress.log` is published by the sync script.

To sync once, run from this repository:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\sync_progress.ps1
```

To keep syncing every five minutes (leave the command running):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\sync_progress.ps1 -Watch
```

For another worker folder, add `-SourceDirectory "C:\path\to\worker"`.
Use only one sync process at a time. The process runs while Windows and the
process remain running; after a restart, start it again. A rejected push is
reported and retried without forcing or overwriting remote history. If GitHub
has new commits, stop the sync process, pull the changes, then start it again.

## Resumable research tester

See `RESEARCH.md` for verified findings and the next experiment. The research
tester uses Node.js with no packages and does not change the running worker.
Validate it with:

```powershell
node --test research/tester.test.cjs
```

The tests require Git for Windows' bundled OpenSSL; use the `OPENSSL_EXE`
environment variable to select a different OpenSSL 3 executable if needed.
Put exact candidate passwords in a UTF-8 file, one per line, then run a bounded
batch (at most 1,000 new unique passwords here):

```powershell
node research/tester.cjs research/candidates-example.txt research/checkpoint-example.json 1000
```

The example filenames are placeholders for a specific documented experiment.
Repeat the same command to resume. Do not run two processes on the same
checkpoint. Changed candidate files, targets, or tester code require a new
checkpoint. Each password is tested on all three targets with SHA-256 and MD5
derivation. Keep possible solutions in `.gsmg-private/`, which Git ignores.
Valid padding or a text-review flag alone does not establish a solution.
