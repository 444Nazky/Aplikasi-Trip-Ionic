<?php
/**
 * CodeIgniter 2.2.4 Entry Point
 *
 * Simple entry point yang serve React static build
 * Compatible PHP 5.6+
 */

// Define APPPATH
define('APPPATH', dirname(__FILE__) . '/application/');
define('FCPATH', dirname(__FILE__) . '/');

// Load React static build jika ada
$static_index = FCPATH . '../www/index.html';

if (file_exists($static_index)) {
    // Set headers
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: public, max-age=3600');

    // Output static HTML
    readfile($static_index);
    exit;
}

// Fallback: Simple message jika static build tidak ada
?>
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard - Setup Required</title>
    <style>
        body { font-family: -apple-system, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
        h1 { color: #333; }
        p { color: #666; }
        code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>Admin Dashboard</h1>
    <p>Build React app terlebih dahulu:</p>
    <p><code>npm run build</code></p>
    <p>Output akan di <code>www/</code> folder.</p>
</body>
</html>
<?php
