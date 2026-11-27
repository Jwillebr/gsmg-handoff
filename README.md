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
