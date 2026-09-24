<?php
/**
 * Admin Controller - CodeIgniter 2.2.4
 *
 * Load React admin dashboard static build.
 * Folder structure: /admin/ (sesuaikan dengan URL Anda)
 */
class Admin extends CI_Controller {

    public function __construct() {
        parent::__construct();
    }

    /**
     * Load React admin dashboard
     * URL: example.com/admin/dashboard
     * Atau root: example.com/admin/
     */
    public function index() {
        // Path ke static build React
        // Sesuaikan path ini dengan lokasi static files Anda
        $static_path = FCPATH . '../www/index.html';

        if (file_exists($static_path)) {
            // Load sebagai view biasa
            $this->load->view($static_path);
        } else {
            // Fallback: load inline HTML
            echo $this->load->view('admin_dashboard', '', TRUE);
        }
    }

    /**
     * Alternative: Serve static files directly
     * Ini lebih efisien karena PHP tidak perlu render view
     */
    public function static_view() {
        $static_path = FCPATH . '../www/index.html';

        if (file_exists($static_path)) {
            // Set content type HTML
            header('Content-Type: text/html; charset=utf-8');

            // Cache header (opsional)
            header('Cache-Control: public, max-age=3600');

            // Read dan output
            readfile($static_path);
        } else {
            show_404();
        }
    }
}

/* End of file admin.php */
