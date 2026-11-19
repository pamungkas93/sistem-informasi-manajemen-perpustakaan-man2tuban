<?php
require_once 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    $input = json_decode(file_get_contents("php://input"), true);
    $id = intval($input['id'] ?? ($_POST['id'] ?? 0));
}

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID buku tidak valid"]);
    exit();
}

$query = "DELETE FROM buku WHERE id = $id";

if (mysqli_query($conn, $query)) {
    echo json_encode([
        "status" => "success",
        "message" => "Buku berhasil dihapus"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => mysqli_error($conn)
    ]);
}
?>
