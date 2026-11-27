param([Parameter(Mandatory=$true)][string]$ImagePath)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$bitmap = [Drawing.Bitmap]::new((Resolve-Path -LiteralPath $ImagePath).Path)
try {
    $blue = @(); $yellow = @()
    for ($row = 0; $row -lt 14; $row++) {
        for ($column = 0; $column -lt 14; $column++) {
            $pixel = $bitmap.GetPixel([int](($column + 0.5) * 75), [int](($row + 0.5) * 75))
            if ($pixel.B -gt 150 -and $pixel.R -lt 100 -and $pixel.G -lt 130) { $blue += ,@(($row+1), ($column+1)) }
            if ($pixel.R -gt 200 -and $pixel.G -gt 200 -and $pixel.B -lt 100) { $yellow += ,@(($row+1), ($column+1)) }
        }
    }
    [ordered]@{
        source = 'https://gsmg.io/puzzle'
        archivedCopy = 'https://github.com/puzzlehunt/gsmgio-5btc-puzzle/blob/fb92dd15487c6e2d275adb8c923698b7166c328e/puzzle.png'
        fetchedDate = '2026-11-27'
        imageSha256 = (Get-FileHash -LiteralPath $ImagePath -Algorithm SHA256).Hash.ToLower()
        method = 'Center sample of each 75px cell in top-left 14x14 grid. Blue: B>150,R<100,G<130; yellow: R>200,G>200,B<100. Coordinates 1-based row,column.'
        width = $bitmap.Width; height = $bitmap.Height
        blueCount = $blue.Count; yellowCount = $yellow.Count
        blueCells = $blue; yellowCells = $yellow
    } | ConvertTo-Json -Depth 5
} finally { $bitmap.Dispose() }
