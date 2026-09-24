<?php
/**
 * Trip Angkutan Admin Dashboard
 * React SPA served by CodeIgniter-style entry point
 *
 * API Backend: http://localhost:3000/api
 */

// Entry point - serve React build
$static_path = __DIR__ . '/index.html';

if (file_exists($static_path)) {
    // CORS headers untuk dev
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-cache');
    readfile($static_path);
    exit;
}

http_response_code(404);
echo "Build not found. Run: npm run build";
