/**
 * API Service Layer untuk menghubungkan React ke Backend PHP MySQLi di XAMPP
 * Endpoint yang didukung: buku_get.php, buku_add.php, buku_update.php, buku_delete.php
 */

const API_BASE = 'http://localhost/db_perpustakaan'; // Sesuaikan jika direktori XAMPP berbeda (atau gunakan '/api' jika menggunakan Vite proxy)

export const apiService = {
  // Ambil data buku
  async getBuku() {
    try {
      const res = await fetch(`${API_BASE}/buku_get.php`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const json = await res.json();
      return json.status === 'success' ? json.data : null;
    } catch (e) {
      console.warn('API PHP XAMPP belum aktif atau koneksi gagal, menggunakan local state.', e);
      return null;
    }
  },

  // Tambah buku baru
  async addBuku(buku: any) {
    try {
      const res = await fetch(`${API_BASE}/buku_add.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(buku)
      });
      const json = await res.json();
      if (json.status !== 'success') {
        throw new Error(json.message || 'Gagal menambah buku');
      }
      return json;
    } catch (e) {
      console.error('Gagal menyimpan buku ke API PHP XAMPP', e);
      throw e;
    }
  },

  // Update data buku
  async updateBuku(buku: any) {
    try {
      const res = await fetch(`${API_BASE}/buku_update.php`, {
        method: 'POST', // atau PUT tergantung server, POST lebih kompatibel dengan PHP standar
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(buku)
      });
      const json = await res.json();
      if (json.status !== 'success') {
        throw new Error(json.message || 'Gagal memperbarui buku');
      }
      return json;
    } catch (e) {
      console.error('Gagal memperbarui buku di API PHP XAMPP', e);
      throw e;
    }
  },

  // Hapus buku
  async deleteBuku(id: number) {
    try {
      const res = await fetch(`${API_BASE}/buku_delete.php?id=${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      const json = await res.json();
      if (json.status !== 'success') {
        throw new Error(json.message || 'Gagal menghapus buku');
      }
      return json;
    } catch (e) {
      console.error('Gagal menghapus buku dari API PHP XAMPP', e);
      throw e;
    }
  },

  // PEMINJAMAN API
  async getPeminjaman() {
    try {
      const res = await fetch(`${API_BASE}/peminjaman_get.php`);
      const json = await res.json();
      return json.status === 'success' ? json.data : null;
    } catch (e) {
      return null;
    }
  },

  async checkout(peminjaman: any) {
    try {
      const res = await fetch(`${API_BASE}/peminjaman_add.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(peminjaman)
      });
      return await res.json();
    } catch (e) {
      throw e;
    }
  },

  async updatePeminjaman(peminjaman: any) {
    try {
      const res = await fetch(`${API_BASE}/peminjaman_update.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(peminjaman)
      });
      return await res.json();
    } catch (e) {
      throw e;
    }
  }
};
