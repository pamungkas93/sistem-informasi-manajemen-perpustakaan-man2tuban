<?php
require_once 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
    $input = $_POST;
}

$kode_buku = mysqli_real_escape_string($conn, $input['kode_buku'] ?? '');
$judul = mysqli_real_escape_string($conn, $input['judul'] ?? '');
$penulis = mysqli_real_escape_string($conn, $input['penulis'] ?? '');
$penerbit = mysqli_real_escape_string($conn, $input['penerbit'] ?? '');
$tahun_terbit = intval($input['tahun_terbit'] ?? date('Y'));
$kategori_id = intval($input['kategori_id'] ?? 1);
$stok = intval($input['stok'] ?? 0);
$stok_tersedia = intval($input['stok_tersedia'] ?? $stok);
$lokasi_rak = mysqli_real_escape_string($conn, $input['lokasi_rak'] ?? '');
$cover_url = mysqli_real_escape_string($conn, $input['cover_url'] ?? ($input['cover'] ?? ''));

if (empty($kode_buku) || empty($judul)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Kode buku dan judul wajib diisi"]);
    exit();
}

$query = "INSERT INTO buku (kode_buku, judul, penulis, penerbit, tahun_terbit, kategori_id, stok, stok_tersedia, lokasi_rak, cover_url) 
          VALUES ('$kode_buku', '$judul', '$penulis', '$penerbit', $tahun_terbit, $kategori_id, $stok, $stok_tersedia, '$lokasi_rak', '$cover_url')";

if (mysqli_query($conn, $query)) {
    echo json_encode([
        "status" => "success",
        "message" => "Buku berhasil ditambahkan",
        "id" => mysqli_insert_id($conn)
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => mysqli_error($conn)
    ]);
}
?>
