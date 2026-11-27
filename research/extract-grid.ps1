param([Parameter(Mandatory=$true)][string]$ImagePath)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$bitmap = [Drawing.Bitmap]::new((Resolve-Path -LiteralPath $ImagePath).Path)
try {
    if ($bitmap.Width -ne 350 -or $bitmap.Height -ne 350) { throw 'Expected original 350x350 grid' }
    $rows = @(); $minimumMajority = 1.0
    for ($r=0; $r -lt 14; $r++) {
        $line = ''
        for ($c=0; $c -lt 14; $c++) {
            $counts = @{}
            for ($y=0; $y -lt 25; $y++) { for ($x=0; $x -lt 25; $x++) {
                $p = $bitmap.GetPixel(($c*25+$x), ($r*25+$y))
                $kind = if ($p.B -gt 150 -and $p.R -lt 100 -and $p.G -lt 130) { 'B' }
                elseif ($p.R -gt 200 -and $p.G -gt 200 -and $p.B -lt 100) { 'Y' }
                elseif ($p.R -lt 100 -and $p.G -lt 100 -and $p.B -lt 100) { '1' }
                elseif ($p.R -gt 240 -and $p.G -gt 240 -and $p.B -gt 240) { '0' }
                else { throw "Unexpected pixel at $r,$c" }
                $counts[$kind]++
            } }
            $mode = $counts.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 1
            $minimumMajority = [Math]::Min($minimumMajority, $mode.Value / 625.0)
            $line += $mode.Key
        }
        $rows += $line
    }
    [ordered]@{
        source = 'https://gsmg.io/img/follow_the_white_rabbit.png'
        fetchedDate = '2026-11-27'
        imageSha256 = (Get-FileHash -LiteralPath $ImagePath -Algorithm SHA256).Hash.ToLower()
        method = 'Majority pixel class over every 25x25 cell; B=blue,Y=yellow,1=black,0=white or near-white. No cell edited.'
        minimumMajorityFraction = $minimumMajority
        rows = $rows
    } | ConvertTo-Json -Depth 4
} finally { $bitmap.Dispose() }
