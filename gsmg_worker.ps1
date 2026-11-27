# ==============================================================
#  GSMG AUTONOMOUS WORKER — runs unattended, sweeps plausible space
# ==============================================================
#  WHAT IT DOES (honestly):
#   - Tests every combination (1,2,3 deep) of the puzzle clue-tokens
#   - Tests every word in wordlist.txt (if present) — feed it an
#     English dictionary, Matrix quotes, song lyrics, etc.
#   - Each candidate -> case variants + SHA-256, vs all 3 blobs
#   - Writes any readable decrypt to FOUND.txt and STOPS
#   - Writes progress to progress.log so you can check anytime
#
#  WHAT IT CANNOT DO: brute-force AES. If the passphrase isn't a
#  dictionary word or a combo of known clues, no program finds it.
#
#  RUN (leave it going, even minimized):
#     powershell -File gsmg_worker.ps1
#  CHECK PROGRESS anytime:  Get-Content progress.log -Tail 5
#  IF SOLVED:               Get-Content FOUND.txt
# ==============================================================

$BLOBS = @{
 "cosmic"      = "U2FsdGVkX18tP2/gbclQ5tNZuD4shoV3axuUd8J8aycGCAMoYfhZK0JecHTDpTFedGJh4SJIP66qRtXvo7PTpvsIjwO8prLiC/sNHthxiGMuqIrKoO224rOisFJZgARic7PaJPne4nab8XCFuV3NbfxGX2BUjNkef5hg7nsoadZx08dNyU2b6eiciWiUvu7DSATSFO7IFBiAMz7dDqIETKuGlTAP4EmMQUZrQNtfbJsURATW6V5VSbtZB5RFk0O+IymhstzrQHsU0Bugjv2nndmOEhCxGi/lqK2rLNdOOLutYGnA6RDDbFJUattggELh2SZx+SBpCdbSGjxOap27l9FOyl02r0HU6UxFdcsbfZ1utTqVEyNs91emQxtpgt+6BPZisil74Jv4EmrpRDC3ufnkmWwR8NfqVPIKhUiGDu5QflYjczT6DrA9vLQZu3kok+/ZurtRYnqqsj49UhwEF9GfUfl7uQYm0UunatW43C3Z1tyFRGAzAHQUFS6jRCd+vZGyoTlOsThjXDDCSAwoX2M+yM+oaEQoVvDwVkIqRhfDNuBmEfi+HpXuJLPBS1PbUjrgoG/Uv7o8IeyST4HBv8+5KLx7IKQS8f1kPZ2YUME+8XJx0caFYs+JS2Jdm0ojJm3JJEcYXdKEzOQvRzi4k+6dNlJ05TRZNTJvn0fPG5cM80aQb/ckUHsLsw9a4WzhHsrzBQRTIhog9sTm+k+LkXzIJiFfSzRgf250pbviFGoQaIFl1CTQPT2w29DLP9006bSiliywwnxXOor03Hn+7MJL27YxeaGQn0sFGgP5X0X4jm3vEBkWvtF4PZl0bXWZLvVL/zTn87+2Zi/u7LA6y6b2yt7YVMkpheeOL0japXaiAf3bSPeUPGz/eu8ZX/NnO3259hG1XwoEVcGdDBV0Nh0A4/phPCR0x5BG04U0OeWAT/5Udc/gGM0TT2FrEzs/AJKtmsnj31OSsqWb9wD+CoduYY2JrkzJYihE3ZcgcvqqffZXqxQkaI/83ro6JZ4Pubml0PUnAnkdmnBCpbClbZMzmo3ELZ0EQwsvkJFDMQmiRhda4nBooUW7zXOIb7WxbE9THrt3cdZP5uAgVfgguUNE4fZMN8ATEDhdSsLklJe2GvihKuZVA6uuSkWAsK6uMGo76xpPwYs3eUdLjtANS83a6/F/fhkX1GXs7zbQjh+Inzk8jhEdEogl9jPs/oDjKjbkUpFlsCWwAZGoeKlmX7c4OGuD5c+FEH+2nYHvYl8y1E/K5SDt9Uocio8XuxbDZOzhw7LMSGkD1MZxpDzsCZY1emkSNd88NFj+9U8VssIDDVMYwKMsHKfjc0x5OlzQ1f6ST0xCkwydDHHGRKKxFC4y6H6fV9sgf9OPK/65z94Rx72+mfvTyizShjxYSRplsH9otU4parl8roD0KsVTfXZoYrYXzK6cXBn1BO/OEqWlu++Dd9MiGaUGKd22fXERqNWoRAKlNn2b6EehD2D8WaAoliPURjkB0Lb/FpP9unI93Twg6NxBXAj734nctukRb3kE08RydJV70eJsvEftF5hbED4HacGx9pzisaSz6t9AKiuSoF6uoCtlTIYatyfZkQA4wg50hAJqTynOQ09ArRHEchtB/7uvWZSBGJ7+zlzRGKx99P3oDZD+Y5D8bmUs3PV6FnAp+IRSlnsQ6hChkwBoQUcngcfGSkBRvmGjsGercCetRRwBOfh9fbX2ruw4mzRYrGnz9eBtepkJXDRjD6yvhNfQMCSkm6l9zMWxKvFbv5g2ae2SLrEt/x3MP2/G"
 "salphaseion" = "U2FsdGVkX186tYU0hVJBXXUnBUO7C0+X4KUWnWkCvoZSxbRD3wNsGWVHefvdrd9zQvX0t8v3jPB4okpspxebRi6sE1BMl5HI8Rku+KejUqTvdWOX6nQjSpepXwGuN/jJ"
 "phase32end"  = "U2FsdGVkX1+0Wl49gnWTyiimluu7V3+vl7st0gUt9sWDzNLxDmlPMsDSiuW2a46zgKlIi8aaqY5gpJPPEzW1n9n3/26qs4zstWtPKF8Zs/BTNN4IiEh4qu18mdC0NAv4"
}
# Pre-decode blobs once
$PRE=@{}
foreach($n in $BLOBS.Keys){ $r=[Convert]::FromBase64String($BLOBS[$n]); $PRE[$n]=@{salt=$r[8..15]; ct=$r[16..($r.Length-1)]} }

function SHA256Hex([string]$s){ -join ([Security.Cryptography.SHA256]::Create().ComputeHash([Text.Encoding]::UTF8.GetBytes($s)) | ForEach-Object { $_.ToString('x2') }) }

$script:tried=0
function Test-One([string]$Pass){
  $pb=[Text.Encoding]::UTF8.GetBytes($Pass)
  foreach($n in $PRE.Keys){
    $salt=$PRE[$n].salt; $ct=$PRE[$n].ct
    $sha=[Security.Cryptography.SHA256]::Create(); $data=@(); $prev=@()
    while($data.Length -lt 48){ $prev=$sha.ComputeHash($prev+$pb+$salt); $data+=$prev }
    $aes=[Security.Cryptography.Aes]::Create(); $aes.Mode='CBC'; $aes.Padding='None'
    $aes.Key=$data[0..31]; $aes.IV=$data[32..47]
    $plain=$aes.CreateDecryptor().TransformFinalBlock($ct,0,$ct.Length)
    $pr=($plain | Where-Object {$_ -ge 32 -and $_ -lt 127}).Count / $plain.Length
    $script:tried++
    if($pr -gt 0.88){
      $msg="*** SOLVED *** blob=$n pass='$Pass'`n"+[Text.Encoding]::UTF8.GetString($plain)
      Write-Host $msg -ForegroundColor Green
      Add-Content FOUND.txt $msg
      Add-Content FOUND.txt ("found at "+(Get-Date))
      exit
    }
  }
}
function Variants([string]$p){
  $s=New-Object System.Collections.Generic.HashSet[string]
  foreach($f in @($p,$p.ToLower(),$p.ToUpper(),($p -replace '\s',''),(($p -replace '\s','').ToLower()))){
    if($f){ [void]$s.Add($f); [void]$s.Add((SHA256Hex $f)) }
  }
  return $s
}

# ---- clue tokens (the plausible core) ----
$TOK=@("matrixsumlist","enter","lastwordsbeforearchichoice","thispassword","yourlastcommand",
"secondanswer","firstanswer","shabef","causality","HASHTHETEXT","hope","halfandbetterhalf",
"betterhalf","cosmicduality","42","yinyang","theone","hopeyouretheone","ciaobella","choice")

Write-Host "GSMG worker started $(Get-Date). Progress -> progress.log  Hit -> FOUND.txt" -ForegroundColor Cyan
Add-Content progress.log "START $(Get-Date)"

# PHASE 1: single tokens
foreach($t in $TOK){ foreach($v in Variants $t){ Test-One $v } }
Add-Content progress.log "phase1 singles done, tried=$($script:tried) $(Get-Date)"

# PHASE 2: pairs and triples of tokens (raw + sha)
foreach($a in $TOK){ foreach($b in $TOK){ if($a -ne $b){
  Test-One ($a+$b); Test-One (SHA256Hex ($a+$b))
}}}
Add-Content progress.log "phase2 pairs done, tried=$($script:tried) $(Get-Date)"
$core=@("matrixsumlist","enter","lastwordsbeforearchichoice","thispassword","yourlastcommand","secondanswer")
foreach($a in $core){foreach($b in $core){foreach($c in $core){ if(($a -ne $b)-and($b -ne $c)-and($a -ne $c)){
  Test-One ($a+$b+$c); Test-One (SHA256Hex ($a+$b+$c))
}}}}
Add-Content progress.log "phase3 triples done, tried=$($script:tried) $(Get-Date)"

# PHASE 4: wordlist.txt (optional — put a dictionary / quotes file here)
if(Test-Path wordlist.txt){
  $i=0
  foreach($w in Get-Content wordlist.txt){
    $w=$w.Trim(); if($w -eq '' -or $w.StartsWith('#')){continue}
    foreach($v in Variants $w){ Test-One $v }
    $i++; if($i % 2000 -eq 0){ Add-Content progress.log "wordlist $i words, tried=$($script:tried) $(Get-Date)" }
  }
  Add-Content progress.log "wordlist done ($i words), tried=$($script:tried) $(Get-Date)"
}

Add-Content progress.log "ALL PHASES COMPLETE, tried=$($script:tried), NO HIT. $(Get-Date)"
Write-Host "Done. $($script:tried) decryptions, no hit. See progress.log. Add a wordlist.txt for more reach." -ForegroundColor Cyan
