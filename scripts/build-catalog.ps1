param(
  [Parameter(Mandatory = $true)]
  [string]$MetCsvPath,
  [switch]$SkipNetwork
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$imageDir = Join-Path $projectRoot "public\assets\images\catalog"
$outputPath = Join-Path $projectRoot "src\catalog.json"
New-Item -ItemType Directory -Path $imageDir -Force | Out-Null

function Get-Reign([string]$period) {
  $map = [ordered]@{
    Kangxi = "康熙"; Yongzheng = "雍正"; Qianlong = "乾隆";
    Jiaqing = "嘉庆"; Daoguang = "道光"; Xianfeng = "咸丰";
    Tongzhi = "同治"; Guangxu = "光绪"; Xuantong = "宣统"
  }
  foreach ($key in $map.Keys) {
    if ($period -match $key) { return $map[$key] }
  }
  return "待核"
}

function Get-TitleZh([string]$title, [string]$csvTitle) {
  if ($csvTitle -match "[\u4e00-\u9fff]") {
    return ($csvTitle -split "\|")[0].Trim()
  }
  $name = $title
  $replacements = [ordered]@{
    "Pair of vases" = "一对瓶"; "Quadruple vase" = "四联瓶";
    "Bottle vase" = "瓶"; "Brush washer" = "笔洗"; "Water coupe" = "水盂";
    "Water Jar" = "水丞"; "Stem cup" = "高足杯";
    "Wine cup" = "酒杯"; "Incense burner" = "香炉"; "Covered box" = "盖盒";
    "Vase" = "瓶"; "Bowl" = "碗"; "Dish" = "盘"; "Plate" = "盘";
    "Cup" = "杯"; "Jar" = "罐"; "Ewer" = "壶"; "Box" = "盒";
    "Saucer" = "托盘"; "Charger" = "大盘"; "Bottle" = "瓶"
  }
  foreach ($key in $replacements.Keys) {
    if ($name -match [regex]::Escape($key)) {
      $suffix = ($name -replace [regex]::Escape($key), "").Trim(" ", "-", ":")
      if ($suffix) { return "$($replacements[$key])（$suffix）" }
      return $replacements[$key]
    }
  }
  return $name
}

function Get-Category([string]$title) {
  if ($title -match "Bowl") { return "碗" }
  if ($title -match "Dish|Plate|Saucer|Charger") { return "盘" }
  if ($title -match "Cup|Goblet") { return "杯" }
  if ($title -match "Vase|Bottle") { return "瓶" }
  if ($title -match "Jar") { return "罐" }
  if ($title -match "Washer|coupe|Water Jar") { return "文房" }
  if ($title -match "Ewer|Pot|Kettle") { return "壶" }
  if ($title -match "Box") { return "盒" }
  if ($title -match "Incense|Censer") { return "炉" }
  return "其他"
}

function Get-Decoration([string]$medium) {
  if ($medium -match "peach.?bloom") { return "豇豆红" }
  if ($medium -match "sang de boeuf") { return "铜红釉" }
  if ($medium -match "copper.?red") { return "铜红釉" }
  if ($medium -match "underglaze (cobalt )?blue|underglaze cobalt") { return "青花" }
  if ($medium -match "famille rose") { return "粉彩" }
  if ($medium -match "overglaze polychrome enamels") { return "釉上彩" }
  if ($medium -match "celadon|clair de lune|moonlight|Ru-type") { return "青釉" }
  if ($medium -match "yellow glaze") { return "黄釉" }
  if ($medium -match "blue glaze|bluish purple glaze") { return "蓝釉" }
  if ($medium -match "aubergine") { return "茄皮紫釉" }
  if ($medium -match "white glaze|transparent glaze") { return "白釉" }
  if ($medium -match "colored glazes") { return "颜色釉" }
  return "瓷器"
}

Write-Host "Filtering authoritative Qing mark-and-period records..."
$rows = Import-Csv -LiteralPath $MetCsvPath | Where-Object {
  $_.'Is Public Domain' -eq 'True' -and
  $_.Department -eq 'Asian Art' -and
  $_.Culture -eq 'China' -and
  $_.Period -like 'Qing dynasty*' -and
  $_.Medium -match 'Porcelain' -and
  $_.Period -match 'mark and period'
}

Write-Host "Fetching $($rows.Count) museum records and images..."
$raw = $rows | ForEach-Object -Parallel {
  $row = $_
  $objectId = [int]$row.'Object ID'
  $record = $null
  for ($attempt = 1; $attempt -le 3 -and -not $record -and -not $using:SkipNetwork; $attempt++) {
    try {
      $record = Invoke-RestMethod -Uri ("https://collectionapi.metmuseum.org/public/collection/v1/objects/{0}" -f $objectId)
    } catch {
      if ($attempt -lt 3) { Start-Sleep -Milliseconds (400 * $attempt) }
    }
  }
  $imageName = $null
  $candidateName = "met-$objectId.jpg"
  $imagePath = Join-Path $using:imageDir $candidateName
  if (Test-Path -LiteralPath $imagePath) {
    $imageName = $candidateName
  } elseif ($record -and $record.primaryImageSmall) {
    $imageName = $candidateName
    if (-not (Test-Path -LiteralPath $imagePath)) {
      try { Invoke-WebRequest -Uri $record.primaryImageSmall -OutFile $imagePath } catch { $imageName = $null }
    }
  }

  [pscustomobject]@{
    objectId = $objectId
    objectNumber = $row.'Object Number'
    csvTitle = $row.Title
    title = $(if ($record -and $record.title) { $record.title } elseif ($row.'Object Name') { $row.'Object Name' } else { $row.Title })
    period = $(if ($record -and $record.period) { $record.period } else { $row.Period })
    date = $(if ($record -and $record.objectDate) { $record.objectDate } else { $row.'Object Date' })
    medium = $(if ($record -and $record.medium) { $record.medium } else { $row.Medium })
    dimensions = $(if ($record -and $record.dimensions) { $record.dimensions } else { $row.Dimensions })
    url = $(if ($record -and $record.objectURL) { $record.objectURL } else { $row.'Link Resource' -replace '^http:', 'https:' })
    image = $imageName
  }
} -ThrottleLimit 6

$order = @{ "康熙" = 1; "雍正" = 2; "乾隆" = 3; "嘉庆" = 4; "道光" = 5; "咸丰" = 6; "同治" = 7; "光绪" = 8; "宣统" = 9; "待核" = 10 }
$catalog = $raw | ForEach-Object {
  $reign = Get-Reign $_.period
  [pscustomobject][ordered]@{
    id = [string]$_.objectId
    objectNumber = $_.objectNumber
    titleZh = Get-TitleZh $_.title $_.csvTitle
    title = $_.title
    reign = $reign
    period = $_.period
    date = $_.date
    category = Get-Category $_.title
    decoration = Get-Decoration $_.medium
    medium = $_.medium
    dimensions = $_.dimensions
    image = $(if ($_.image) { "catalog/$($_.image)" } else { $null })
    source = "The Metropolitan Museum of Art"
    rights = "Public Domain"
    url = $_.url
  }
} | Sort-Object @{ Expression = { $order[$_.reign] } }, @{ Expression = { [int]$_.id } }

$catalog | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $outputPath -Encoding utf8
$withImage = @($catalog | Where-Object image).Count
Write-Host "Wrote $($catalog.Count) records ($withImage with images) to $outputPath"
