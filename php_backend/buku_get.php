<?php
require_once 'koneksi.php';

$query = "SELECT b.*, k.nama_kategori FROM buku b LEFT JOIN kategori k ON b.kategori_id = k.id ORDER BY b.id DESC";
$result = mysqli_query($conn, $query);

if ($result) {
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        if (isset($row['cover']) && !isset($row['cover_url'])) {
            $row['cover_url'] = $row['cover'];
        }
        $data[] = $row;
    }
    echo json_encode([
        "status" => "success",
        "data" => $data
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => mysqli_error($conn)
    ]);
}
?>
