# server.ps1 — Servidor web local sin dependencias para La Tostada Norteña
param (
    [int]$Port = 3000
)

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Error "No se pudo iniciar HttpListener en $prefix. Verifique permisos o puerto en uso: $_"
    exit 1
}

Write-Host "Servidor web de La Tostada Norteña iniciado con éxito."
Write-Host "URL: $prefix"
Write-Host "Directorio raíz: $PSScriptRoot"

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff2"= "font/woff2"
    ".woff" = "font/woff"
    ".md"   = "text/markdown; charset=utf-8"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or [string]::IsNullOrEmpty($urlPath)) {
            $urlPath = "/index.html"
        }

        # Seguridad de ruta local para evitar path traversal
        $relative = $urlPath.TrimStart('/').Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $localPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($PSScriptRoot, $relative))

        if (-not $localPath.StartsWith($PSScriptRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
            $response.StatusCode = 403
            $msg = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
            $response.OutputStream.Write($msg, 0, $msg.Length)
            $response.Close()
            continue
        }

        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime
            $response.StatusCode = 200
            $response.Headers.Add("Cache-Control", "no-cache, must-revalidate")
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $response.ContentType = "text/html; charset=utf-8"
            $html404 = @"
<!DOCTYPE html>
<html lang="es-MX">
<head><meta charset="utf-8"><title>404 - Página no encontrada</title></head>
<body style="font-family:sans-serif;background:#FFF9ED;color:#242B24;padding:40px;text-align:center;">
  <h1>404 — No encontrado</h1>
  <p>El recurso solicitado ($urlPath) no existe.</p>
  <p><a href="/" style="color:#245333;font-weight:bold;">Volver al inicio</a></p>
</body>
</html>
"@
            $msg = [System.Text.Encoding]::UTF8.GetBytes($html404)
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} catch {
    Write-Host "Servidor detenido."
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
