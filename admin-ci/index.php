<?php
/**
 * Admin Dashboard PHP router
 *
 * Serving production Angular SPA dari Vite build dengan HMR support (bukan PHP built-in watch, tapi
 * mekanisme yang menangkap dan mengalihkan asset nyata (gambar, font, stylesheet, JS chunk).
 * DevTools → Network → Disable cache atau Ctrl+Shift+R tetap perlu untuk memaksa browser
 * mengambil ulang bundle lama yang di-cache.
 *
 * Jika asset nyata (file di-disk), langsung serve tanpa fallback SPA router. Jika bukan file (SPA route),
 * tangani sebagai Angular routing.
 */
$request = $_SERVER['REQUEST_URI'] ?? '/';
// Hapus query string
$path = parse_url($request, PHP_URL_PATH);
// File fisik relatif terhadap folder ini.
$staticFile = __DIR__ . '/' . ltrim($path, '/');

if ($path === '/index.html' || $path === '/') {
    serveIndex();
} elseif (is_file($staticFile)) {
    serveStatic($staticFile);
} elseif (is_dir($staticFile)) {
    // Folder (mis. /assets) — tidak serve directory listing
    serveIndex();
} else {
    // SPA route, atau file statik yang tidak ada — fallback ke index.html
    serveIndex();
}

function serveIndex(): void {
    $static_path = __DIR__ . '/index.html';
    if (!is_file($static_path)) {
        http_response_code(404);
        echo "Build tidak ada. Jalankan: npm run build && cp -r www/* admin-ci/";
        return;
    }
    $html = file_get_contents($static_path);
    // Inject SPA routing attribute + no-cache headers
    $html = str_replace('<html', '<html data-admin', $html, $count = 1);
    header('Cache-Control: no-store, no-cache, must-revalidate');
    header('Pragma: no-cache');
    header('Expires: 0');
    echo $html;
}

function serveStatic(string $file): void {
    $mime = mime_content_type($file) ?: 'application/octet-stream';
    // Prevents script injection — PHP tidak pernah dijalankan dari folder statik.
    if ($mime === 'application/x-httpd-php') { serveIndex(); return; }
    $mtime = filemtime($file);
    $etag = '"' . dechex($mtime) . '"';
    header('Content-Type: ' . $mime);
    header('Cache-Control: max-age=31536000, immutable');
    header('ETag: ' . $etag);
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $mtime) . ' GMT');
    // If-None-Match/If-Modified-Since — 304 Not Modified
    if (isset($_SERVER['HTTP_IF_NONE_MATCH']) {
        if ($_SERVER['HTTP_IF_NONE_MATCH'] === $etag) {
            http_response_code(304);
            return;
        }
    }
    readfile($file);
}
