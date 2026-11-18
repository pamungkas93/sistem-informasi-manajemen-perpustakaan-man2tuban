import { Buku, Kategori, Peminjaman, User } from '../types';

export const initialUsers: User[] = [
  { id: 1, username: 'admin', nama_lengkap: 'Drs. Achmad Roy Probosasongko M.Pd.', role: 'admin' },
  { id: 2, username: 'petugas1', nama_lengkap: 'Siti Rahmawati, A.Md.', role: 'petugas' },
  { id: 3, username: 'petugas2', nama_lengkap: 'Budi Santoso, S.I.P.', role: 'petugas' }
];

export const initialKategori: Kategori[] = [
  { id: 1, nama_kategori: 'Pelajaran Umum', deskripsi: 'Buku teks kurikulum nasional untuk mata pelajaran wajib' },
  { id: 2, nama_kategori: 'Matematika & Sains', deskripsi: 'Fisika, Kimia, Biologi, dan Matematika tingkat lanjut' },
  { id: 3, nama_kategori: 'Bahasa & Sastra', deskripsi: 'Novel, puisi, kamus, dan tata bahasa Indonesia/Inggris' },
  { id: 4, nama_kategori: 'Teknologi & Komputer', deskripsi: 'Pemrograman, jaringan, desain grafis, dan perkantoran' },
  { id: 5, nama_kategori: 'Sejarah & Sosial', deskripsi: 'Sejarah dunia, nasional, sosiologi, dan kewarganegaraan' },
  { id: 6, nama_kategori: 'Referensi & Ensiklopedia', deskripsi: 'Kamus besar, atlas, dan ensiklopedia umum' }
];

export const initialBuku: Buku[] = [
  {
    id: 1,
    kode_buku: 'BUP-001',
    judul: 'Matematika Tingkat Lanjut Kelas XII',
    penulis: 'Drs. Sukino, M.Si.',
    penerbit: 'Erlangga',
    tahun_terbit: 2023,
    kategori_id: 2,
    stok: 15,
    stok_tersedia: 12,
    lokasi_rak: 'Rak M-01',
    cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    kode_buku: 'BUP-002',
    judul: 'Fisika Dasar untuk SMA/MA Kelas XI',
    penulis: 'Halliday, Resnick, Walker',
    penerbit: 'Penerbit ITB',
    tahun_terbit: 2022,
    kategori_id: 2,
    stok: 10,
    stok_tersedia: 8,
    lokasi_rak: 'Rak M-02',
    cover_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    kode_buku: 'BUP-003',
    judul: 'Kimia Analitik dan Organik Modern',
    penulis: 'Michael Purba, Ph.D.',
    penerbit: 'Erlangga',
    tahun_terbit: 2023,
    kategori_id: 2,
    stok: 12,
    stok_tersedia: 10,
    lokasi_rak: 'Rak M-03',
    cover_url: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 4,
    kode_buku: 'BUP-004',
    judul: 'Biologi Sel dan Genetika Molekuler',
    penulis: 'Campbell & Reece',
    penerbit: 'Pearson Education',
    tahun_terbit: 2021,
    kategori_id: 2,
    stok: 8,
    stok_tersedia: 6,
    lokasi_rak: 'Rak M-04',
    cover_url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 5,
    kode_buku: 'BUP-005',
    judul: 'Sejarah Indonesia Masa Kemerdekaan',
    penulis: 'Prof. M. Habib Mustopo',
    penerbit: 'Yudhistira',
    tahun_terbit: 2022,
    kategori_id: 5,
    stok: 20,
    stok_tersedia: 18,
    lokasi_rak: 'Rak S-01',
    cover_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 6,
    kode_buku: 'BUP-006',
    judul: 'Pendidikan Kewarganegaraan Berbasis Pancasila',
    penulis: 'Dr. Kaelan, M.S.',
    penerbit: 'Paradigma',
    tahun_terbit: 2023,
    kategori_id: 5,
    stok: 15,
    stok_tersedia: 15,
    lokasi_rak: 'Rak S-02',
    cover_url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 7,
    kode_buku: 'BUP-007',
    judul: 'Bahasa Indonesia: Wahana Pengetahuan',
    penulis: 'Suherli, S.Pd., M.Pd.',
    penerbit: 'Kemendikbud',
    tahun_terbit: 2023,
    kategori_id: 1,
    stok: 30,
    stok_tersedia: 25,
    lokasi_rak: 'Rak U-01',
    cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 8,
    kode_buku: 'BUP-008',
    judul: 'English for Senior High School Grade XII',
    penulis: 'Bachtiar Bima L. & Cicik Kurniawati',
    penerbit: 'Intan Pariwara',
    tahun_terbit: 2022,
    kategori_id: 3,
    stok: 25,
    stok_tersedia: 22,
    lokasi_rak: 'Rak B-01',
    cover_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 9,
    kode_buku: 'BUP-009',
    judul: 'Laskar Pelangi (Novel Inspiratif)',
    penulis: 'Andrea Hirata',
    penerbit: 'Bentang Pustaka',
    tahun_terbit: 2018,
    kategori_id: 3,
    stok: 14,
    stok_tersedia: 11,
    lokasi_rak: 'Rak B-02',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 10,
    kode_buku: 'BUP-010',
    judul: 'Pemrograman Web Full-Stack dengan PHP & MySQL',
    penulis: 'Riyanto, M.Kom.',
    penerbit: 'Informatika Bandung',
    tahun_terbit: 2024,
    kategori_id: 4,
    stok: 10,
    stok_tersedia: 7,
    lokasi_rak: 'Rak T-01',
    cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 11,
    kode_buku: 'BUP-011',
    judul: 'Algoritma dan Struktur Data dalam Python',
    penulis: 'Adi Nugroho',
    penerbit: 'Andi Offset',
    tahun_terbit: 2023,
    kategori_id: 4,
    stok: 10,
    stok_tersedia: 9,
    lokasi_rak: 'Rak T-02',
    cover_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 12,
    kode_buku: 'BUP-012',
    judul: 'Ensiklopedia Geografi Dunia & Atlas Lengkap',
    penulis: 'Tim Redaksi Geografi',
    penerbit: 'Widyatama',
    tahun_terbit: 2021,
    kategori_id: 6,
    stok: 5,
    stok_tersedia: 5,
    lokasi_rak: 'Rak R-01',
    cover_url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 13,
    kode_buku: 'BUP-013',
    judul: 'Kamus Besar Bahasa Indonesia (KBBI V Edisi Terbaru)',
    penulis: 'Tim Badan Bahasa Kemendikbud',
    penerbit: 'Balai Pustaka',
    tahun_terbit: 2022,
    kategori_id: 6,
    stok: 8,
    stok_tersedia: 8,
    lokasi_rak: 'Rak R-02',
    cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 14,
    kode_buku: 'BUP-014',
    judul: 'Ekonomi Makro dan Mikro Pendekatan Kontekstual',
    penulis: 'M. Suprihanto, Ph.D.',
    penerbit: 'BPFE Yogyakarta',
    tahun_terbit: 2022,
    kategori_id: 5,
    stok: 12,
    stok_tersedia: 10,
    lokasi_rak: 'Rak S-03',
    cover_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 15,
    kode_buku: 'BUP-015',
    judul: 'Seni Budaya dan Keterampilan Berkreasi',
    penulis: 'Sujiman, M.Sn.',
    penerbit: 'Erlangga',
    tahun_terbit: 2023,
    kategori_id: 1,
    stok: 15,
    stok_tersedia: 13,
    lokasi_rak: 'Rak U-02',
    cover_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400'
  }
];

export const initialPeminjaman: Peminjaman[] = [
  {
    id: 1,
    kode_transaksi: 'TRX-202611-001',
    nama_peminjam: 'Muhammad Rizki Pratama',
    nis: '10293',
    kelas: 'XII IPA 1',
    nomor_hp: '081234567890',
    tanggal_pinjam: '2026-10-10',
    tanggal_kembali: '2026-10-17',
    status: 'Belum Kembali',
    petugas_id: 2,
    nama_petugas: 'Siti Rahmawati, A.Md.',
    details: [
      { id: 1, peminjaman_id: 1, buku_id: 1, judul_buku: 'Matematika Tingkat Lanjut Kelas XII', kode_buku: 'BUP-001', jumlah_pinjam: 2, jumlah_kembali: 0, jumlah_hilang: 0, status_item: 'Belum Kembali' },
      { id: 2, peminjaman_id: 1, buku_id: 2, judul_buku: 'Fisika Dasar untuk SMA/MA Kelas XI', kode_buku: 'BUP-002', jumlah_pinjam: 1, jumlah_kembali: 0, jumlah_hilang: 0, status_item: 'Belum Kembali' }
    ]
  },
  {
    id: 2,
    kode_transaksi: 'TRX-202611-002',
    nama_peminjam: 'Aisyah Nurul Jannah',
    nis: '10384',
    kelas: 'XI IPS 2',
    nomor_hp: '085678901234',
    tanggal_pinjam: '2026-10-15',
    tanggal_kembali: '2026-10-22',
    status: 'Sebagian',
    petugas_id: 2,
    nama_petugas: 'Siti Rahmawati, A.Md.',
    details: [
      { id: 3, peminjaman_id: 2, buku_id: 5, judul_buku: 'Sejarah Indonesia Masa Kemerdekaan', kode_buku: 'BUP-005', jumlah_pinjam: 2, jumlah_kembali: 2, jumlah_hilang: 0, status_item: 'Selesai' },
      { id: 4, peminjaman_id: 2, buku_id: 9, judul_buku: 'Laskar Pelangi (Novel Inspiratif)', kode_buku: 'BUP-009', jumlah_pinjam: 1, jumlah_kembali: 0, jumlah_hilang: 0, status_item: 'Belum Kembali' }
    ]
  },
  {
    id: 3,
    kode_transaksi: 'TRX-202611-003',
    nama_peminjam: 'Dimas Anggara Putra',
    nis: '10492',
    kelas: 'XII TKJ 1',
    nomor_hp: '087890123456',
    tanggal_pinjam: '2026-09-01',
    tanggal_kembali: '2026-09-08',
    status: 'Selesai',
    petugas_id: 3,
    nama_petugas: 'Budi Santoso, S.I.P.',
    details: [
      { id: 5, peminjaman_id: 3, buku_id: 10, judul_buku: 'Pemrograman Web Full-Stack dengan PHP & MySQL', kode_buku: 'BUP-010', jumlah_pinjam: 3, jumlah_kembali: 3, jumlah_hilang: 0, status_item: 'Selesai' }
    ]
  }
];
