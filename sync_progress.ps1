param(
    [string]$SourceDirectory = (Join-Path $env:USERPROFILE 'Downloads\Worker data'),
    [switch]$Watch,
    [ValidateRange(30, 86400)][int]$IntervalSeconds = 300
)

# Publish only the progress log. The running worker does not need to restart.
$ErrorActionPreference = 'Stop'
$repoDirectory = $PSScriptRoot
$sourceLog = Join-Path $SourceDirectory 'progress.log'
$destinationLog = Join-Path $repoDirectory 'progress.log'

function Invoke-RepoGit {
    param([string[]]$GitArguments)
    $output = & git -C $repoDirectory @GitArguments 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "git $($GitArguments -join ' ') failed: $($output -join [Environment]::NewLine)"
    }
    return $output
}

function Publish-Progress {
    if (-not (Test-Path -LiteralPath $sourceLog -PathType Leaf)) {
        throw "Worker log not found: $sourceLog"
    }
    if ([IO.Path]::GetFullPath($sourceLog) -ne [IO.Path]::GetFullPath($destinationLog)) {
        # Read a snapshot while allowing the worker to append to its log.
        $stream = [IO.File]::Open($sourceLog, 'Open', 'Read', 'ReadWrite')
        try {
            $buffer = New-Object IO.MemoryStream
            try {
                $stream.CopyTo($buffer)
                $snapshot = $buffer.ToArray()
            } finally { $buffer.Dispose() }
        } finally { $stream.Dispose() }
        [IO.File]::WriteAllBytes($destinationLog, $snapshot)
    }

    $null = Invoke-RepoGit -GitArguments @('ls-files', '--error-unmatch', '--', 'progress.log')
    & git -C $repoDirectory diff --quiet HEAD -- progress.log
    $diffExitCode = $LASTEXITCODE
    if ($diffExitCode -eq 1) {
        $null = Invoke-RepoGit -GitArguments @('commit', '--only', '-m', 'Update worker progress', '--', 'progress.log')
        Write-Output "$(Get-Date -Format s) Committed worker progress."
    } elseif ($diffExitCode -ne 0) {
        throw "Unable to compare progress.log (git exit $diffExitCode)."
    }

    # Retry unpushed commits even when the source log has not changed.
    # A normal push rejects conflicting remote changes; never force-push.
    $null = Invoke-RepoGit -GitArguments @('push', 'origin', 'HEAD:main')
    Write-Output "$(Get-Date -Format s) GitHub progress synchronized."
}

$branch = Invoke-RepoGit -GitArguments @('branch', '--show-current')
if ($branch -ne 'main') { throw 'Run progress synchronization on the main branch.' }

do {
    try { Publish-Progress }
    catch {
        if (-not $Watch) { throw }
        Write-Warning "$(Get-Date -Format s) $($_.Exception.Message) Will retry in $IntervalSeconds seconds."
    }
    if ($Watch) { Start-Sleep -Seconds $IntervalSeconds }
} while ($Watch)
