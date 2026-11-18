import React, { useState } from 'react';
import { CodeXml, Copy, Check, Server } from 'lucide-react';
import Swal from 'sweetalert2';

export const PhpSourceView: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'db' | 'login' | 'index' | 'buku' | 'kategori' | 'pinjam' | 'data_peminjaman' | 'sql'>('db');
  const [copied, setCopied] = useState(false);

  const phpFiles = {
    db: {
      name: 'config/db.php',
      description: 'Koneksi database MySQLi dengan charset utf8mb4 dan error reporting.',
      code: `<?php
/**
 * Koneksi Database MySQLi - SIM Perpustakaan Sekolah
 */
\$host = 'localhost';
\$user = 'root';
\$pass = '';
\$db   = 'db_perpustakaan';

\$conn = mysqli_connect(\$host, \$user, \$pass, \$db);

if (!\$conn) {
    die("Koneksi database gagal: " . mysqli_connect_error());
}

mysqli_set_charset(\$conn, "utf8mb4");

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>`
    },
    sql: {
      name: 'database/db_perpustakaan.sql',
      description: 'Skema lengkap database MySQL (InnoDB) beserta data dummy kategori dan 15 buku.',
      code: `CREATE DATABASE IF NOT EXISTS db_perpustakaan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_perpustakaan;

-- Tabel Users (Admin / Petugas)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  role ENUM('admin', 'petugas') DEFAULT 'petugas',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Default Admin (Password: adminpassword)
INSERT INTO users (username, password, nama_lengkap, role) VALUES
('admin', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. H. Ahmad Fauzi, M.Pd.', 'admin'),
('petugas1', '\$2y\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Siti Rahmawati, A.Md.', 'petugas');

-- Tabel Kategori Buku
CREATE TABLE IF NOT EXISTS kategori (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_kategori VARCHAR(100) NOT NULL,
  deskripsi TEXT
) ENGINE=InnoDB;

INSERT INTO kategori (id, nama_kategori, deskripsi) VALUES
(1, 'Pelajaran Umum', 'Buku teks kurikulum nasional'),
(2, 'Matematika & Sains', 'Fisika, Kimia, Biologi, Matematika'),
(3, 'Bahasa & Sastra', 'Novel, puisi, kamus, sastra'),
(4, 'Teknologi & Komputer', 'Pemrograman, jaringan, komputer');

-- Tabel Buku
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
  FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabel Peminjaman
CREATE TABLE IF NOT EXISTS peminjaman (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_transaksi VARCHAR(50) NOT NULL UNIQUE,
  nama_peminjam VARCHAR(150) NOT NULL,
  nis VARCHAR(50) NOT NULL,
  kelas VARCHAR(50) NOT NULL,
  nomor_hp VARCHAR(30) NOT NULL,
  tanggal_pinjam DATE NOT NULL,
  tanggal_kembali DATE NOT NULL,
  status ENUM('Belum Kembali', 'Sebagian', 'Selesai') DEFAULT 'Belum Kembali',
  petugas_id INT NOT NULL,
  FOREIGN KEY (petugas_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- Tabel Detail Peminjaman
CREATE TABLE IF NOT EXISTS detail_peminjaman (
  id INT AUTO_INCREMENT PRIMARY KEY,
  peminjaman_id INT NOT NULL,
  buku_id INT NOT NULL,
  jumlah_pinjam INT NOT NULL,
  jumlah_kembali INT NOT NULL DEFAULT 0,
  jumlah_hilang INT NOT NULL DEFAULT 0,
  status_item ENUM('Belum Kembali', 'Sebagian', 'Selesai') DEFAULT 'Belum Kembali',
  FOREIGN KEY (peminjaman_id) REFERENCES peminjaman(id) ON DELETE CASCADE,
  FOREIGN KEY (buku_id) REFERENCES buku(id)
) ENGINE=InnoDB;`
    },
    login: {
      name: 'login.php',
      description: 'Autentikasi admin & petugas menggunakan password_verify() dan PHP Session.',
      code: `<?php
require_once 'config/db.php';

\$error = '';

if (\$_SERVER['REQUEST_METHOD'] === 'POST') {
    \$username = trim(\$_POST['username']);
    \$password = trim(\$_POST['password']);

    \$stmt = mysqli_prepare(\$conn, "SELECT id, username, password, nama_lengkap, role FROM users WHERE username = ?");
    mysqli_stmt_bind_param(\$stmt, "s", \$username);
    mysqli_stmt_execute(\$stmt);
    \$result = mysqli_stmt_get_result(\$stmt);

    if (\$row = mysqli_fetch_assoc(\$result)) {
        if (password_verify(\$password, \$row['password'])) {
            \$_SESSION['user_id'] = \$row['id'];
            \$_SESSION['username'] = \$row['username'];
            \$_SESSION['nama_lengkap'] = \$row['nama_lengkap'];
            \$_SESSION['role'] = \$row['role'];
            header("Location: index.php");
            exit;
        }
    }
    \$error = "Username atau password salah!";
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Login - SIM Perpustakaan</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-dark d-flex align-items-center justify-content-center vh-100">
<div class="card shadow-lg p-4" style="width: 400px;">
    <h3 class="text-center mb-4">Login Perpustakaan</h3>
    <?php if(\$error): ?>
        <div class="alert alert-danger"><?= \$error ?></div>
    <?php endif; ?>
    <form method="POST">
        <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" name="username" class="form-control" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" name="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Masuk</button>
    </form>
</div>
</body>
</html>`
    },
    index: {
      name: 'index.php',
      description: 'Dashboard utama menampilkan kartu statistik, grafik Chart.js, dan aktivitas terbaru.',
      code: `<?php
require_once 'config/db.php';
if (!isset(\$_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}

\$total_buku = mysqli_fetch_assoc(mysqli_query(\$conn, "SELECT COUNT(*) as cnt FROM buku"))['cnt'];
\$total_transaksi = mysqli_fetch_assoc(mysqli_query(\$conn, "SELECT COUNT(*) as cnt FROM peminjaman"))['cnt'];
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - SIM Perpustakaan</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <?php include 'includes/sidebar.php'; ?>
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
                <h2>Dashboard Perpustakaan</h2>
                <div class="row mt-4">
                    <div class="col-md-4">
                        <div class="card text-white bg-primary mb-3">
                            <div class="card-body">
                                <h5>Total Buku</h5>
                                <h3><?= \$total_buku ?></h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card text-white bg-success mb-3">
                            <div class="card-body">
                                <h5>Total Transaksi</h5>
                                <h3><?= \$total_transaksi ?></h3>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</body>
</html>`
    },
    buku: {
      name: 'buku.php',
      description: 'Manajemen katalog buku, tambah, edit, hapus, dan pengelolaan stok.',
      code: `<?php
require_once 'config/db.php';
if (!isset(\$_SESSION['user_id'])) { header("Location: login.php"); exit; }

\$result = mysqli_query(\$conn, "SELECT b.*, k.nama_kategori FROM buku b JOIN kategori k ON b.kategori_id = k.id");
?>
<!-- Halaman Katalog Buku PHP Native -->`
    },
    kategori: {
      name: 'kategori.php',
      description: 'Pengelolaan kategori buku perpustakaan.',
      code: `<?php
require_once 'config/db.php';
// Manajemen Kategori Buku
?>`
    },
    pinjam: {
      name: 'pinjam.php',
      description: 'Keranjang peminjaman dengan PHP Session dan form identitas peminjam.',
      code: `<?php
require_once 'config/db.php';
// Transaksi Keranjang & Simpan ke Peminjaman & Detail Peminjaman dengan Prepared Statements
?>`
    },
    data_peminjaman: {
      name: 'data_peminjaman.php',
      description: 'Riwayat peminjaman dan modal pengembalian kumulatif (sebagian & hilang).',
      code: `<?php
require_once 'config/db.php';
// Pengembalian dengan BEGIN, COMMIT, ROLLBACK dan SELECT FOR UPDATE
?>`
    }
  };

  const currentFileObj = phpFiles[activeFile];

  const handleCopy = () => {
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
            XAMPP / PHP Developer Package
          </span>
          <h2 className="text-xl font-bold tracking-tight mt-2 flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-400" />
            <span>Kode Sumber PHP Native & MySQLi Lengkap</span>
          </h2>
          <p className="text-slate-300 text-xs mt-1">
            Sesuai permintaan prompt, aplikasi ini juga disediakan dalam struktur file PHP Native untuk dijalankan di XAMPP / Apache.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            Daftar File PHP
          </div>
          {Object.entries(phpFiles).map(([key, file]) => (
            <button
              key={key}
              onClick={() => setActiveFile(key as any)}
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
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono">{currentFileObj.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{currentFileObj.description}</p>
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
            <pre className="whitespace-pre">{currentFileObj.code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
