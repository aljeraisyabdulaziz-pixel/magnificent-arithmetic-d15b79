Add-Type -AssemblyName System.Drawing
$out = $PSScriptRoot
if ([string]::IsNullOrEmpty($out)) { $out = (Get-Location).Path }
$D = 512

function HB($hex) { return [System.Drawing.ColorTranslator]::FromHtml($hex) }

function Make($size, $name, $rounded, $crownScale) {
  $bmp = New-Object System.Drawing.Bitmap($size, $size)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.PixelOffsetMode = 'HighQuality'
  $g.ScaleTransform($size / $D, $size / $D)

  # ---- background ----
  $rect = New-Object System.Drawing.Rectangle(0, 0, $D, $D)
  $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, (HB '#2a3656'), (HB '#0a0e18'), 55)
  $blend = New-Object System.Drawing.Drawing2D.ColorBlend(3)
  $blend.Colors = @((HB '#2a3656'), (HB '#141b2e'), (HB '#0a0e18'))
  $blend.Positions = @(0.0, 0.5, 1.0)
  $bg.InterpolationColors = $blend
  if ($rounded) {
    $r = 118; $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d2 = $r * 2
    $path.AddArc(0, 0, $d2, $d2, 180, 90)
    $path.AddArc($D - $d2, 0, $d2, $d2, 270, 90)
    $path.AddArc($D - $d2, $D - $d2, $d2, $d2, 0, 90)
    $path.AddArc(0, $D - $d2, $d2, $d2, 90, 90)
    $path.CloseFigure()
    $g.FillPath($bg, $path)
  } else {
    $g.FillRectangle($bg, $rect)
  }

  # radial glow behind crown
  $gp = New-Object System.Drawing.Drawing2D.GraphicsPath
  $gp.AddEllipse(106, 70, 300, 300)
  $pgb = New-Object System.Drawing.Drawing2D.PathGradientBrush($gp)
  $pgb.CenterColor = [System.Drawing.Color]::FromArgb(110, 247, 162, 59)
  $pgb.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 247, 162, 59))
  $g.FillPath($pgb, $gp)

  # ---- crown (with optional scale for maskable safe-area) ----
  $g.TranslateTransform($D / 2.0, $D / 2.0)
  $g.ScaleTransform($crownScale, $crownScale)
  $g.TranslateTransform(- $D / 2.0, - $D / 2.0)

  $pts = @(
    (New-Object System.Drawing.Point(150, 312)),
    (New-Object System.Drawing.Point(150, 196)),
    (New-Object System.Drawing.Point(205, 244)),
    (New-Object System.Drawing.Point(256, 172)),
    (New-Object System.Drawing.Point(307, 244)),
    (New-Object System.Drawing.Point(362, 196)),
    (New-Object System.Drawing.Point(362, 312))
  )
  $cb = New-Object System.Drawing.Rectangle(140, 166, 232, 200)
  $gold = New-Object System.Drawing.Drawing2D.LinearGradientBrush($cb, (HB '#ffe39a'), (HB '#e8761f'), 90)
  $gblend = New-Object System.Drawing.Drawing2D.ColorBlend(3)
  $gblend.Colors = @((HB '#ffe39a'), (HB '#f7b53b'), (HB '#e8761f'))
  $gblend.Positions = @(0.0, 0.45, 1.0)
  $gold.InterpolationColors = $gblend
  $g.FillPolygon($gold, $pts)

  # base band
  $band = New-Object System.Drawing.Drawing2D.GraphicsPath
  $br = 16; $bd = $br * 2
  $band.AddArc(142, 312, $bd, $bd, 180, 90)
  $band.AddArc(370 - $bd, 312, $bd, $bd, 270, 90)
  $band.AddArc(370 - $bd, 358 - $bd, $bd, $bd, 0, 90)
  $band.AddArc(142, 358 - $bd, $bd, $bd, 90, 90)
  $band.CloseFigure()
  $bandBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush((New-Object System.Drawing.Rectangle(142, 312, 228, 46)), (HB '#f7b53b'), (HB '#b9560f'), 90)
  $g.FillPath($bandBrush, $band)

  # edge stroke
  $pen = New-Object System.Drawing.Pen((HB '#c85a12'), 6)
  $pen.LineJoin = 'Round'
  $g.DrawPolygon($pen, $pts)
  $g.DrawPath($pen, $band)

  # rivets
  $cream = New-Object System.Drawing.SolidBrush((HB '#fff4d0'))
  foreach ($x in 172, 256, 340) { $g.FillEllipse($cream, $x - 6, 329, 12, 12) }

  # gems
  function Gem($cx, $cy, $rr, $hex) {
    $b = New-Object System.Drawing.SolidBrush((HB $hex))
    $g.FillEllipse($b, $cx - $rr, $cy - $rr, $rr * 2, $rr * 2)
    $p = New-Object System.Drawing.Pen((HB '#fff4d0'), 4)
    $g.DrawEllipse($p, $cx - $rr, $cy - $rr, $rr * 2, $rr * 2)
  }
  Gem 150 190 15 '#5aa9ff'
  Gem 256 166 18 '#ff5d6c'
  Gem 362 190 15 '#5aa9ff'

  # top highlight
  $hl = New-Object System.Drawing.Drawing2D.GraphicsPath
  $hpts = @(
    (New-Object System.Drawing.Point(150, 196)),
    (New-Object System.Drawing.Point(205, 244)),
    (New-Object System.Drawing.Point(256, 172)),
    (New-Object System.Drawing.Point(307, 244)),
    (New-Object System.Drawing.Point(362, 196))
  )
  $hpen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 255, 247, 224), 4)
  $hpen.LineJoin = 'Round'
  $g.DrawLines($hpen, $hpts)

  $g.Dispose()
  $bmp.Save((Join-Path $out $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
}

Make 192 'icon-192.png' $true 1.0
Make 512 'icon-512.png' $true 1.0
Make 512 'icon-maskable.png' $false 0.74
Get-ChildItem $out -Filter 'icon-*.png' | Select-Object Name, Length
