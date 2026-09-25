<?php
// Trip Angkutan Admin Dashboard entry point
$static_path = __DIR__ . '/index.html';
if (file_exists($static_path)) {
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: text/html; charset=utf-8');
    $html = file_get_contents($static_path);
    $html = str_replace('<html', '<html data-admin', $html);
    // Admin dashboard adalah app CodeIgniter, bukan aplikasi Ionic —
    // sembunyikan favicon & icon bawaan build Ionic agar tidak ikut tampil.
    $html = preg_replace('/<link\s+rel="icon"[^>]*>\s*/i', '', $html);
    // Build Ionic memaksa body position:fixed + overflow:hidden (untuk app
    // mobile) — dashboard admin harus bisa di-scroll. Ditanam langsung di sini
    // agar berlaku sejak HTML dikirim, tanpa menunggu CSS bundle termuat.
    $scrollFix = '<style>'
        . 'html[data-admin],html[data-admin] body{'
        . 'position:static!important;width:auto!important;height:auto!important;'
        . 'max-height:none!important;overflow:visible!important;transform:none!important;'
        . 'touch-action:auto!important;overscroll-behavior-y:auto!important}'
        . 'html[data-admin]{overflow-y:auto!important}'
        . '</style>';
    $html = preg_replace('/<head>/', '<head>' . $scrollFix, $html, 1);
    echo $html;
    exit;
}
http_response_code(404);
echo "Build not found. Run: npm run build";
