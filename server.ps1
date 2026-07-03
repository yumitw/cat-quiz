# Simple static file server for local preview (no Python/Node needed).
# Usage: powershell -ExecutionPolicy Bypass -File server.ps1
# Then open http://localhost:8080

$port = 8080
$root = [System.IO.Path]::GetFullPath($PSScriptRoot)

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".ico"  = "image/x-icon"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$port/ (Ctrl+C to stop)"

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $res = $context.Response
  try {
    $rawPath = $context.Request.Url.AbsolutePath
    $relPath = [System.Uri]::UnescapeDataString($rawPath).TrimStart('/')
    if ([string]::IsNullOrEmpty($relPath)) { $relPath = "index.html" }
    $resolved = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $relPath))

    if (-not $resolved.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
      $res.StatusCode = 403
    }
    elseif (Test-Path -LiteralPath $resolved -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($resolved).ToLower()
      $type = $mime[$ext]
      if ($null -eq $type) { $type = "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($resolved)
      $res.ContentType = $type
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
    }
    else {
      $res.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: " + $relPath)
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
  }
  catch {
    try { $res.StatusCode = 500 } catch {}
  }
  finally {
    try { $res.Close() } catch {}
  }
}
