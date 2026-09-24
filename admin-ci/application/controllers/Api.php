<?php
/**
 * API Controller - CodeIgniter 2.2.4
 *
 * Secure REST API dengan:
 * - CORS headers
 * - JSON responses
 * - Basic authentication
 *
 * Compatible dengan PHP 5.6+
 */
class Api extends CI_Controller {

    private $api_token = 'your-secure-api-token-here';

    public function __construct() {
        parent::__construct();
        $this->load->database();

        // CORS Headers - PENTING untuk React/Vite dev server
        $this->_set_cors_headers();
    }

    /**
     * Set CORS headers
     * Izinkan request dari origin yang berbeda (React dev server, Vite, dll)
     */
    private function _set_cors_headers() {
        // Allow dari semua origin (untuk development)
        // Untuk production, ganti * dengan domain spesifik
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';

        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Max-Age: 86400");

        // Handle preflight OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }

    /**
     * Output JSON response
     *
     * @param mixed $data Data untuk di-encode
     * @param int $status HTTP status code
     */
    protected function _json_response($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Verifikasi API token dari header Authorization
     *
     * @return bool
     */
    protected function _verify_token() {
        $auth = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';

        // Support format: "Bearer <token>" atau langsung token
        if (strpos($auth, 'Bearer ') === 0) {
            $token = substr($auth, 7);
        } else {
            $token = $auth;
        }

        return $token === $this->api_token;
    }

    /**
     * Contoh: Health check endpoint
     * URL: /api/health
     */
    public function health() {
        $this->_json_response(array(
            'status' => 'ok',
            'timestamp' => date('c'),
            'db_connected' => $this->db->conn_id !== false
        ));
    }

    /**
     * Contoh: Get trips
     * URL: /api/trips
     * Method: GET
     */
    public function trips() {
        // Verifikasi token
        if (!$this->_verify_token()) {
            $this->_json_response(array('error' => 'Unauthorized'), 401);
        }

        // Query database
        $query = $this->db->get('trips');

        $this->_json_response($query->result_array());
    }

    /**
     * Contoh: Create trip
     * URL: /api/trips
     * Method: POST
     */
    public function create_trip() {
        if (!$this->_verify_token()) {
            $this->_json_response(array('error' => 'Unauthorized'), 401);
        }

        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);

        if (empty($input)) {
            $this->_json_response(array('error' => 'Invalid input'), 400);
        }

        // Insert ke database
        $this->db->insert('trips', $input);

        if ($this->db->affected_rows() > 0) {
            $insert_id = $this->db->insert_id();
            $this->_json_response(array(
                'success' => true,
                'id' => $insert_id
            ), 201);
        } else {
            $this->_json_response(array('error' => 'Failed to insert'), 500);
        }
    }

    /**
     * Contoh: Update trip
     * URL: /api/trips/{id}
     * Method: PUT
     */
    public function update_trip($id = null) {
        if (!$this->_verify_token()) {
            $this->_json_response(array('error' => 'Unauthorized'), 401);
        }

        if (empty($id)) {
            $this->_json_response(array('error' => 'ID required'), 400);
        }

        $input = json_decode(file_get_contents('php://input'), true);

        $this->db->where('id', $id);
        $this->db->update('trips', $input);

        if ($this->db->affected_rows() >= 0) {
            $this->_json_response(array('success' => true));
        } else {
            $this->_json_response(array('error' => 'Failed to update'), 500);
        }
    }

    /**
     * Contoh: Delete trip
     * URL: /api/trips/{id}
     * Method: DELETE
     */
    public function delete_trip($id = null) {
        if (!$this->_verify_token()) {
            $this->_json_response(array('error' => 'Unauthorized'), 401);
        }

        if (empty($id)) {
            $this->_json_response(array('error' => 'ID required'), 400);
        }

        $this->db->where('id', $id);
        $this->db->delete('trips');

        if ($this->db->affected_rows() > 0) {
            $this->_json_response(array('success' => true));
        } else {
            $this->_json_response(array('error' => 'Not found'), 404);
        }
    }
}

/* End of file api.php */
