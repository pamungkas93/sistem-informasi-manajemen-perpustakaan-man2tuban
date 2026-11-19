import React, { useState } from 'react';
import { Copy, Check, Server } from 'lucide-react';
import Swal from 'sweetalert2';

export const PhpSourceView: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'db' | 'login' | 'index' | 'buku' | 'kategori' | 'pinjam' | 'data_peminjaman' | 'sql' | 'api_buku' | 'api_peminjaman'>('db');
  const [copied, setCopied] = useState(false);

  const phpFiles = {
    db: {
      name: 'config/db.php',
      description: 'Koneksi database MySQLi dengan charset utf8mb4 dan error reporting.',
      code: "<?php\n/**\n * Koneksi Database MySQLi - SIM Perpustakaan Sekolah\n */\n\$host = 'localhost';\n\$user = 'root';\n\$pass = '';\n\$db   = 'db_perpustakaan';\n\n\$conn = mysqli_connect(\$host, \$user, \$pass, \$db);\n\nif (!\$conn) {\n    die(\"Koneksi database gagal: \" . mysqli_connect_error());\n}\n\nmysqli_set_charset(\$conn, \"utf8mb4\");\n\nif (session_status() === PHP_SESSION_NONE) {\n    session_start();\n}\n?>"
    },
    sql: {
      name: 'database/db_perpustakaan.sql',
      description: 'Skema lengkap database MySQL (InnoDB) beserta data dummy kategori dan buku.',
      code: "CREATE DATABASE IF NOT EXISTS db_perpustakaan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nUSE db_perpustakaan;\n\n-- Tabel Users (Admin / Petugas)\nCREATE TABLE IF NOT EXISTS users (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  username VARCHAR(50) NOT NULL UNIQUE,\n  password VARCHAR(255) NOT NULL,\n  nama_lengkap VARCHAR(100) NOT NULL,\n  role ENUM('admin', 'petugas') DEFAULT 'petugas',\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n) ENGINE=InnoDB;\n\n-- Tabel Kategori Buku\nCREATE TABLE IF NOT EXISTS kategori (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  nama_kategori VARCHAR(100) NOT NULL,\n  deskripsi TEXT\n) ENGINE=InnoDB;\n\n-- Tabel Buku\nCREATE TABLE IF NOT EXISTS buku (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  kode_buku VARCHAR(50) NOT NULL UNIQUE,\n  judul VARCHAR(255) NOT NULL,\n  penulis VARCHAR(150) NOT NULL,\n  penerbit VARCHAR(150) NOT NULL,\n  tahun_terbit INT NOT NULL,\n  kategori_id INT NOT NULL,\n  stok INT NOT NULL DEFAULT 0,\n  stok_tersedia INT NOT NULL DEFAULT 0,\n  lokasi_rak VARCHAR(50) NOT NULL,\n  cover VARCHAR(255) DEFAULT NULL,\n  FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE CASCADE\n) ENGINE=InnoDB;\n\n-- Tabel Peminjaman\nCREATE TABLE IF NOT EXISTS peminjaman (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  kode_transaksi VARCHAR(50) NOT NULL UNIQUE,\n  nama_peminjam VARCHAR(150) NOT NULL,\n  nis VARCHAR(50) NOT NULL,\n  kelas VARCHAR(50) NOT NULL,\n  nomor_hp VARCHAR(30) NOT NULL,\n  tanggal_pinjam DATE NOT NULL,\n  tanggal_kembali DATE NOT NULL,\n  status ENUM('Belum Kembali', 'Sebagian', 'Selesai') DEFAULT 'Belum Kembali',\n  petugas_id INT NOT NULL,\n  FOREIGN KEY (petugas_id) REFERENCES users(id)\n) ENGINE=InnoDB;\n\n-- Tabel Detail Peminjaman\nCREATE TABLE IF NOT EXISTS detail_peminjaman (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  peminjaman_id INT NOT NULL,\n  buku_id INT NOT NULL,\n  jumlah_pinjam INT NOT NULL,\n  jumlah_kembali INT NOT NULL DEFAULT 0,\n  jumlah_hilang INT NOT NULL DEFAULT 0,\n  status_item ENUM('Belum Kembali', 'Sebagian', 'Selesai') DEFAULT 'Belum Kembali',\n  FOREIGN KEY (peminjaman_id) REFERENCES peminjaman(id) ON DELETE CASCADE,\n  FOREIGN KEY (buku_id) REFERENCES buku(id)\n) ENGINE=InnoDB;"
    },
    api_buku: {
      name: 'api/buku.php',
      description: 'REST API endpoint PHP untuk GET, POST, PUT, dan DELETE data buku dengan JSON.',
      code: "<?php\nheader(\"Content-Type: application/json; charset=UTF-8\");\nrequire_once '../config/db.php';\n\n\$method = \$_SERVER['REQUEST_METHOD'];\n\nswitch (\$method) {\n    case 'GET':\n        \$result = mysqli_query(\$conn, \"SELECT b.*, k.nama_kategori FROM buku b JOIN kategori k ON b.kategori_id = k.id ORDER BY b.id DESC\");\n        \$data = [];\n        while (\$row = mysqli_fetch_assoc(\$result)) {\n            \$data[] = \$row;\n        }\n        echo json_encode([\"status\" => \"success\", \"data\" => \$data]);\n        break;\n\n    case 'POST':\n        \$input = json_decode(file_get_contents('php://input'), true);\n        if (!\$input) \$input = \$_POST;\n        \n        \$kode = mysqli_real_escape_string(\$conn, \$input['kode_buku'] ?? '');\n        \$judul = mysqli_real_escape_string(\$conn, \$input['judul'] ?? '');\n        \$penulis = mysqli_real_escape_string(\$conn, \$input['penulis'] ?? '');\n        \$penerbit = mysqli_real_escape_string(\$conn, \$input['penerbit'] ?? '');\n        \$tahun = intval(\$input['tahun_terbit'] ?? date('Y'));\n        \$kategori_id = intval(\$input['kategori_id'] ?? 1);\n        \$stok = intval(\$input['stok'] ?? 0);\n        \$stok_tersedia = \$stok;\n        \$lokasi = mysqli_real_escape_string(\$conn, \$input['lokasi_rak'] ?? '');\n        \$cover = mysqli_real_escape_string(\$conn, \$input['cover'] ?? '');\n\n        \$query = \"INSERT INTO buku (kode_buku, judul, penulis, penerbit, tahun_terbit, kategori_id, stok, stok_tersedia, lokasi_rak, cover) VALUES ('\$kode', '\$judul', '\$penulis', '\$penerbit', \$tahun, \$kategori_id, \$stok, \$stok_tersedia, '\$lokasi', '\$cover')\";\n        \n        if (mysqli_query(\$conn, \$query)) {\n            echo json_encode([\"status\" => \"success\", \"message\" => \"Buku berhasil ditambahkan\", \"id\" => mysqli_insert_id(\$conn)]);\n        } else {\n            http_response_code(500);\n            echo json_encode([\"status\" => \"error\", \"message\" => mysqli_error(\$conn)]);\n        }\n        break;\n\n    case 'PUT':\n        \$input = json_decode(file_get_contents('php://input'), true);\n        \$id = intval(\$input['id'] ?? 0);\n        \$kode = mysqli_real_escape_string(\$conn, \$input['kode_buku'] ?? '');\n        \$judul = mysqli_real_escape_string(\$conn, \$input['judul'] ?? '');\n        \$penulis = mysqli_real_escape_string(\$conn, \$input['penulis'] ?? '');\n        \$penerbit = mysqli_real_escape_string(\$conn, \$input['penerbit'] ?? '');\n        \$tahun = intval(\$input['tahun_terbit'] ?? 2023);\n        \$kategori_id = intval(\$input['kategori_id'] ?? 1);\n        \$stok = intval(\$input['stok'] ?? 0);\n        \$stok_tersedia = intval(\$input['stok_tersedia'] ?? \$stok);\n        \$lokasi = mysqli_real_escape_string(\$conn, \$input['lokasi_rak'] ?? '');\n        \$cover = mysqli_real_escape_string(\$conn, \$input['cover'] ?? '');\n\n        \$query = \"UPDATE buku SET kode_buku='\$kode', judul='\$judul', penulis='\$penulis', penerbit='\$penerbit', tahun_terbit=\$tahun, kategori_id=\$kategori_id, stok=\$stok, stok_tersedia=\$stok_tersedia, lokasi_rak='\$lokasi', cover='\$cover' WHERE id=\$id\";\n        \n        if (mysqli_query(\$conn, \$query)) {\n            echo json_encode([\"status\" => \"success\", \"message\" => \"Buku berhasil diperbarui\"]);\n        } else {\n            http_response_code(500);\n            echo json_encode([\"status\" => \"error\", \"message\" => mysqli_error(\$conn)]);\n        }\n        break;\n\n    case 'DELETE':\n        \$id = intval(\$_GET['id'] ?? 0);\n        if (mysqli_query(\$conn, \"DELETE FROM buku WHERE id=\$id\")) {\n            echo json_encode([\"status\" => \"success\", \"message\" => \"Buku berhasil dihapus\"]);\n        } else {\n            http_response_code(500);\n            echo json_encode([\"status\" => \"error\", \"message\" => mysqli_error(\$conn)]);\n        }\n        break;\n}\n?>"
    },
    api_peminjaman: {
      name: 'api/peminjaman.php',
      description: 'REST API endpoint PHP untuk peminjaman buku, detail transaksi, dan pengembalian.',
      code: "<?php\nheader(\"Content-Type: application/json; charset=UTF-8\");\nrequire_once '../config/db.php';\n\n\$method = \$_SERVER['REQUEST_METHOD'];\n\nswitch (\$method) {\n    case 'GET':\n        \$result = mysqli_query(\$conn, \"SELECT p.*, u.nama_lengkap as nama_petugas FROM peminjaman p JOIN users u ON p.petugas_id = u.id ORDER BY p.id DESC\");\n        \$peminjamanList = [];\n        while (\$row = mysqli_fetch_assoc(\$result)) {\n            \$pid = \$row['id'];\n            \$detailRes = mysqli_query(\$conn, \"SELECT dp.*, b.judul, b.kode_buku, b.cover FROM detail_peminjaman dp JOIN buku b ON dp.buku_id = b.id WHERE dp.peminjaman_id = \$pid\");\n            \$details = [];\n            while (\$d = mysqli_fetch_assoc(\$detailRes)) {\n                \$details[] = \$d;\n            }\n            \$row['details'] = \$details;\n            \$peminjamanList[] = \$row;\n        }\n        echo json_encode([\"status\" => \"success\", \"data\" => \$peminjamanList]);\n        break;\n\n    case 'POST':\n        \$input = json_decode(file_get_contents('php://input'), true);\n        if (!\$input) {\n            http_response_code(400);\n            echo json_encode([\"status\" => \"error\", \"message\" => \"Invalid JSON\"]);\n            exit;\n        }\n\n        mysqli_begin_transaction(\$conn);\n        try {\n            \$kode_transaksi = mysqli_real_escape_string(\$conn, \$input['kode_transaksi'] ?? 'TRX-' . time());\n            \$nama_peminjam = mysqli_real_escape_string(\$conn, \$input['nama_peminjam'] ?? '');\n            \$nis = mysqli_real_escape_string(\$conn, \$input['nis'] ?? '');\n            \$kelas = mysqli_real_escape_string(\$conn, \$input['kelas'] ?? '');\n            \$nomor_hp = mysqli_real_escape_string(\$conn, \$input['nomor_hp'] ?? '');\n            \$tanggal_pinjam = mysqli_real_escape_string(\$conn, \$input['tanggal_pinjam'] ?? date('Y-m-d'));\n            \$tanggal_kembali = mysqli_real_escape_string(\$conn, \$input['tanggal_kembali'] ?? date('Y-m-d', strtotime('+7 days')));\n            \$status = mysqli_real_escape_string(\$conn, \$input['status'] ?? 'Belum Kembali');\n            \$petugas_id = intval(\$input['petugas_id'] ?? 1);\n\n            \$qPeminjaman = \"INSERT INTO peminjaman (kode_transaksi, nama_peminjam, nis, kelas, nomor_hp, tanggal_pinjam, tanggal_kembali, status, petugas_id) VALUES ('\$kode_transaksi', '\$nama_peminjam', '\$nis', '\$kelas', '\$nomor_hp', '\$tanggal_pinjam', '\$tanggal_kembali', '\$status', \$petugas_id)\";\n            \n            if (!mysqli_query(\$conn, \$qPeminjaman)) throw new Exception(mysqli_error(\$conn));\n            \$peminjaman_id = mysqli_insert_id(\$conn);\n\n            foreach (\$input['details'] as \$item) {\n                \$buku_id = intval(\$item['buku_id']);\n                \$jumlah_pinjam = intval(\$item['jumlah_pinjam']);\n                \$jumlah_kembali = intval(\$item['jumlah_kembali'] ?? 0);\n                \$jumlah_hilang = intval(\$item['jumlah_hilang'] ?? 0);\n                \$status_item = mysqli_real_escape_string(\$conn, \$item['status_item'] ?? 'Belum Kembali');\n\n                \$qDetail = \"INSERT INTO detail_peminjaman (peminjaman_id, buku_id, jumlah_pinjam, jumlah_kembali, jumlah_hilang, status_item) VALUES (\$peminjaman_id, \$buku_id, \$jumlah_pinjam, \$jumlah_kembali, \$jumlah_hilang, '\$status_item')\";\n                if (!mysqli_query(\$conn, \$qDetail)) throw new Exception(mysqli_error(\$conn));\n\n                mysqli_query(\$conn, \"UPDATE buku SET stok_tersedia = GREATEST(0, stok_tersedia - \$jumlah_pinjam) WHERE id = \$buku_id\");\n            }\n\n            mysqli_commit(\$conn);\n            echo json_encode([\"status\" => \"success\", \"message\" => \"Peminjaman berhasil disimpan\", \"id\" => \$peminjaman_id]);\n        } catch (Exception \$e) {\n            mysqli_rollback(\$conn);\n            http_response_code(500);\n            echo json_encode([\"status\" => \"error\", \"message\" => \$e->getMessage()]);\n        }\n        break;\n\n    case 'PUT':\n        \$input = json_decode(file_get_contents('php://input'), true);\n        \$id = intval(\$input['id'] ?? 0);\n        \$status = mysqli_real_escape_string(\$conn, \$input['status'] ?? 'Belum Kembali');\n\n        mysqli_begin_transaction(\$conn);\n        try {\n            mysqli_query(\$conn, \"UPDATE peminjaman SET status='\$status' WHERE id=\$id\");\n            if (isset(\$input['details'])) {\n                foreach (\$input['details'] as \$d) {\n                    \$did = intval(\$d['id']);\n                    \$jkembali = intval(\$d['jumlah_kembali']);\n                    \$jhilang = intval(\$d['jumlah_hilang']);\n                    \$sitem = mysqli_real_escape_string(\$conn, \$d['status_item']);\n                    \$bid = intval(\$d['buku_id']);\n\n                    mysqli_query(\$conn, \"UPDATE detail_peminjaman SET jumlah_kembali=\$jkembali, jumlah_hilang=\$jhilang, status_item='\$sitem' WHERE id=\$did\");\n                    if (\$sitem === 'Selesai' && \$jkembali > 0) {\n                        mysqli_query(\$conn, \"UPDATE buku SET stok_tersedia = LEAST(stok, stok_tersedia + \$jkembali) WHERE id = \$bid\");\n                    }\n                }\n            }\n            mysqli_commit(\$conn);\n            echo json_encode([\"status\" => \"success\", \"message\" => \"Status peminjaman diperbarui\"]);\n        } catch (Exception \$e) {\n            mysqli_rollback(\$conn);\n            http_response_code(500);\n            echo json_encode([\"status\" => \"error\", \"message\" => \$e->getMessage()]);\n        }\n        break;\n}\n?>"
    },
    login: {
      name: 'login.php',
      description: 'Autentikasi admin & petugas.',
      code: "<?php require_once 'config/db.php'; ?>"
    },
    index: {
      name: 'index.php',
      description: 'Dashboard utama.',
      code: "<?php require_once 'config/db.php'; ?>"
    },
    buku: {
      name: 'buku.php',
      description: 'Manajemen katalog buku.',
      code: "<?php require_once 'config/db.php'; ?>"
    },
    kategori: {
      name: 'kategori.php',
      description: 'Pengelolaan kategori.',
      code: "<?php require_once 'config/db.php'; ?>"
    },
    pinjam: {
      name: 'pinjam.php',
      description: 'Keranjang peminjaman.',
      code: "<?php require_once 'config/db.php'; ?>"
    },
    data_peminjaman: {
      name: 'data_peminjaman.php',
      description: 'Riwayat peminjaman.',
      code: "<?php require_once 'config/db.php'; ?>"
    }
  };

  const currentFileObj = phpFiles[activeFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFileObj.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Swal.fire({ icon: 'success', title: 'Kode Disalin!', text: currentFileObj.name + ' berhasil disalin ke clipboard.', timer: 1200, showConfirmButton: false });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            XAMPP / PHP API Package
          </span>
          <h2 className="text-xl font-bold tracking-tight mt-2 flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-400" />
            <span>API PHP Native & MySQLi (Buku & Peminjaman)</span>
          </h2>
          <p className="text-slate-300 text-xs mt-1">
            Endpoint API REST PHP (api/buku.php dan api/peminjaman.php) untuk menghubungkan aplikasi React ke database MySQL db_perpustakaan di XAMPP.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            Daftar File Backend & API
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
