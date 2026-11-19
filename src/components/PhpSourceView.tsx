import React, { useState } from 'react';
import { Copy, Check, Server } from 'lucide-react';
import Swal from 'sweetalert2';

export const PhpSourceView: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>('koneksi');
  const [copied, setCopied] = useState(false);

  const phpFiles = {
    koneksi: {
      name: 'koneksi.php',
      description: 'Koneksi database MySQLi dengan header CORS untuk XAMPP.',
      code: `<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if (\$_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");

\$host = "localhost";
\$user = "root";
\$pass = "";
\$db   = "db_perpustakaan";

\$conn = mysqli_connect(\$host, \$user, \$pass, \$db);

if (!\$conn) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Koneksi database gagal: " . mysqli_connect_error()
    ]);
    exit();
}

mysqli_set_charset(\$conn, "utf8mb4");
?>`
    },
    buku_get: {
      name: 'buku_get.php',
      description: 'API untuk mengambil seluruh data buku dari MySQL.',
      code: `<?php
require_once 'koneksi.php';

\$query = "SELECT b.*, k.nama_kategori FROM buku b LEFT JOIN kategori k ON b.kategori_id = k.id ORDER BY b.id DESC";
\$result = mysqli_query(\$conn, \$query);

if (\$result) {
    \$data = [];
    while (\$row = mysqli_fetch_assoc(\$result)) {
        if (isset(\$row['cover']) && !isset(\$row['cover_url'])) {
            \$row['cover_url'] = \$row['cover'];
        }
        \$data[] = \$row;
    }
    echo json_encode([
        "status" => "success",
        "data" => \$data
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => mysqli_error(\$conn)
    ]);
}
?>`
    },
    buku_add: {
      name: 'buku_add.php',
      description: 'API untuk menambah data buku baru ke MySQL.',
      code: `<?php
require_once 'koneksi.php';

if (\$_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit();
}

\$input = json_decode(file_get_contents("php://input"), true);
if (!\$input) \$input = \$_POST;

\$kode_buku = mysqli_real_escape_string(\$conn, \$input['kode_buku'] ?? '');
\$judul = mysqli_real_escape_string(\$conn, \$input['judul'] ?? '');
\$penulis = mysqli_real_escape_string(\$conn, \$input['penulis'] ?? '');
\$penerbit = mysqli_real_escape_string(\$conn, \$input['penerbit'] ?? '');
\$tahun_terbit = intval(\$input['tahun_terbit'] ?? date('Y'));
\$kategori_id = intval(\$input['kategori_id'] ?? 1);
\$stok = intval(\$input['stok'] ?? 0);
\$stok_tersedia = intval(\$input['stok_tersedia'] ?? \$stok);
\$lokasi_rak = mysqli_real_escape_string(\$conn, \$input['lokasi_rak'] ?? '');
\$cover_url = mysqli_real_escape_string(\$conn, \$input['cover_url'] ?? (\$input['cover'] ?? ''));

if (empty(\$kode_buku) || empty(\$judul)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Kode buku dan judul wajib diisi"]);
    exit();
}

\$query = "INSERT INTO buku (kode_buku, judul, penulis, penerbit, tahun_terbit, kategori_id, stok, stok_tersedia, lokasi_rak, cover_url) 
          VALUES ('\$kode_buku', '\$judul', '\$penulis', '\$penerbit', \$tahun_terbit, \$kategori_id, \$stok, \$stok_tersedia, '\$lokasi_rak', '\$cover_url')";

if (mysqli_query(\$conn, \$query)) {
    echo json_encode([
        "status" => "success",
        "message" => "Buku berhasil ditambahkan",
        "id" => mysqli_insert_id(\$conn)
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => mysqli_error(\$conn)
    ]);
}
?>`
    },
    buku_update: {
      name: 'buku_update.php',
      description: 'API untuk memperbarui data buku dan stok di MySQL.',
      code: `<?php
require_once 'koneksi.php';

\$input = json_decode(file_get_contents("php://input"), true);
if (!\$input) \$input = \$_POST;

\$id = intval(\$input['id'] ?? 0);
\$kode_buku = mysqli_real_escape_string(\$conn, \$input['kode_buku'] ?? '');
\$judul = mysqli_real_escape_string(\$conn, \$input['judul'] ?? '');
\$penulis = mysqli_real_escape_string(\$conn, \$input['penulis'] ?? '');
\$penerbit = mysqli_real_escape_string(\$conn, \$input['penerbit'] ?? '');
\$tahun_terbit = intval(\$input['tahun_terbit'] ?? date('Y'));
\$kategori_id = intval(\$input['kategori_id'] ?? 1);
\$stok = intval(\$input['stok'] ?? 0);
\$stok_tersedia = intval(\$input['stok_tersedia'] ?? \$stok);
\$lokasi_rak = mysqli_real_escape_string(\$conn, \$input['lokasi_rak'] ?? '');
\$cover_url = mysqli_real_escape_string(\$conn, \$input['cover_url'] ?? (\$input['cover'] ?? ''));

if (\$id <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID buku tidak valid"]);
    exit();
}

\$query = "UPDATE buku SET 
            kode_buku = '\$kode_buku', 
            judul = '\$judul', 
            penulis = '\$penulis', 
            penerbit = '\$penerbit', 
            tahun_terbit = \$tahun_terbit, 
            kategori_id = \$kategori_id, 
            stok = \$stok, 
            stok_tersedia = \$stok_tersedia, 
            lokasi_rak = '\$lokasi_rak', 
            cover_url = '\$cover_url' 
          WHERE id = \$id";

if (mysqli_query(\$conn, \$query)) {
    echo json_encode([
        "status" => "success",
        "message" => "Data buku berhasil diperbarui"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => mysqli_error(\$conn)
    ]);
}
?>`
    },
    buku_delete: {
      name: 'buku_delete.php',
      description: 'API untuk menghapus buku berdasarkan ID dari MySQL.',
      code: `<?php
require_once 'koneksi.php';

\$id = intval(\$_GET['id'] ?? 0);
if (\$id <= 0) {
    \$input = json_decode(file_get_contents("php://input"), true);
    \$id = intval(\$input['id'] ?? (\$_POST['id'] ?? 0));
}

if (\$id <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID buku tidak valid"]);
    exit();
}

\$query = "DELETE FROM buku WHERE id = \$id";

if (mysqli_query(\$conn, \$query)) {
    echo json_encode([
        "status" => "success",
        "message" => "Buku berhasil dihapus"
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => mysqli_error(\$conn)
    ]);
}
?>`
    },
    sql: {
      name: 'database.sql',
      description: 'Skema lengkap tabel MySQL db_perpustakaan.',
      code: `CREATE DATABASE IF NOT EXISTS db_perpustakaan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_perpustakaan;

CREATE TABLE IF NOT EXISTS kategori (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_kategori VARCHAR(100) NOT NULL,
  deskripsi TEXT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS buku (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_buku VARCHAR(50) NOT NULL UNIQUE,
  judul VARCHAR(255) NOT NULL,
  penulis VARCHAR(150) NOT NULL,
  penerbit VARCHAR(150) NOT NULL,
  tahun_terbit INT NOT NULL,
  kategori_id INT NOT NULL,
  stok INT NOT NULL DEFAULT 0,
  stok_tersedia INT NOT NULL DEFAULT 0,
  lokasi_rak VARCHAR(50) NOT NULL,
  cover_url TEXT DEFAULT NULL,
  FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE CASCADE
) ENGINE=InnoDB;`
    }
  };

  const currentFileObj = phpFiles[activeFile as keyof typeof phpFiles];

  const handleCopy = () => {
    if (!currentFileObj) return;
    navigator.clipboard.writeText(currentFileObj.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Swal.fire({ icon: 'success', title: 'Kode Disalin!', text: `${currentFileObj.name} berhasil disalin ke clipboard.`, timer: 1200, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            XAMPP / PHP API Backend
          </span>
          <h2 className="text-xl font-bold tracking-tight mt-2 flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-400" />
            <span>Skrip PHP CRUD Buku & Koneksi MySQL</span>
          </h2>
          <p className="text-slate-300 text-xs mt-1">
            Letakkan file-file berikut di folder XAMPP: <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded font-mono">C:/xampp/htdocs/db_perpustakaan/</code>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            Daftar File PHP API
          </div>
          {Object.entries(phpFiles).map(([key, file]) => (
            <button
              key={key}
              onClick={() => setActiveFile(key)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                activeFile === key
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="font-mono">{file.name}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">{currentFileObj?.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{currentFileObj?.description}</p>
            </div>
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
          </div>

          <div className="p-6 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto flex-1 max-h-[550px]">
            <pre className="whitespace-pre">{currentFileObj?.code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
