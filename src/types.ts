export interface User {
  id: number;
  username: string;
  nama_lengkap: string;
  role: 'admin' | 'petugas';
}

export interface Kategori {
  id: number;
  nama_kategori: string;
  deskripsi: string;
}

export interface Buku {
  id: number;
  kode_buku: string;
  judul: string;
  penulis: string;
  penerbit: string;
  tahun_terbit: number;
  kategori_id: number;
  stok: number;
  stok_tersedia: number;
  lokasi_rak: string;
  cover_url?: string;
}

export interface CartItem {
  buku_id: number;
  judul: string;
  kode_buku: string;
  penulis: string;
  stok_tersedia: number;
  jumlah: number;
}

export interface DetailPeminjaman {
  id: number;
  peminjaman_id: number;
  buku_id: number;
  judul_buku?: string;
  kode_buku?: string;
  jumlah_pinjam: number;
  jumlah_kembali: number;
  jumlah_hilang: number;
  status_item: 'Belum Kembali' | 'Sebagian' | 'Selesai';
}

export interface Peminjaman {
  id: number;
  kode_transaksi: string;
  nama_peminjam: string;
  nis: string;
  kelas: string;
  nomor_hp: string;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  status: 'Belum Kembali' | 'Sebagian' | 'Selesai';
  petugas_id: number;
  nama_petugas?: string;
  details: DetailPeminjaman[];
}
