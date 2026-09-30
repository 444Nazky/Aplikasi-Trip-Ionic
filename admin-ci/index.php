<?php
// Trip Angkutan Admin Dashboard entry point
// Serve static assets (JS, CSS, images) directly, HTML with data-admin injection

$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$script_path = __DIR__;

// Static asset extensions to serve directly
$static_extensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.webp', '.map', '.json', '.txt'];
$is_static = false;
foreach ($static_extensions as $ext) {
    if (str_ends_with(strtolower($request_uri), $ext)) {
        $is_static = true;
        break;
    }
}

// Serve static assets directly with long cache
if ($is_static) {
    $file_path = $script_path . $request_uri;
    if (file_exists($file_path) && is_file($file_path)) {
        $ext = strtolower(pathinfo($file_path, PATHINFO_EXTENSION));
        $mime_types = [
            'js' => 'application/javascript',
            'css' => 'text/css',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf' => 'font/ttf',
            'otf' => 'font/otf',
            'webp' => 'image/webp',
            'map' => 'application/json',
            'json' => 'application/json',
            'txt' => 'text/plain',
        ];
        header('Content-Type: ' . ($mime_types[$ext] ?? 'application/octet-stream'));
        header('Cache-Control: public, max-age=31536000, immutable');
        readfile($file_path);
        exit;
    }
    http_response_code(404);
    exit;
}

// Only handle root "/" for HTML
if ($request_uri === '/') {
    $html_path = $script_path . '/index.html';
    if (file_exists($html_path)) {
        header('Access-Control-Allow-Origin: *');
        header('Content-Type: text/html; charset=utf-8');
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');
        $html = file_get_contents($html_path);
        $html = str_replace('<html', '<html data-admin', $html);

        // Replace favicon dengan empty
        $html = preg_replace(
            '/<link\s+rel="(?:icon|apple-touch-icon|apple-touch-icon-precomposed|mask-icon)"[^>]*>\s*/i',
            '<link rel="icon" href="data:,">',
            $html
        );

        // Guard scroll
        $html = str_replace(
            '<head>',
            '<head><style>html[data-admin],html[data-admin] body{position:static!important;overflow:visible!important;height:auto!important;max-height:none!important;}</style>',
            $html
        );

        echo $html;
        exit;
    }
}

// Fallback
http_response_code(404);
echo "Not found";
