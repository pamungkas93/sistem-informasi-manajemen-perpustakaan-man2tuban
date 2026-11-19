/**
 * API Service Layer untuk menghubungkan React ke Backend PHP MySQLi (XAMPP)
 * Endpoint default: http://localhost/db_perpustakaan/api/
 */

const API_BASE = '/api'; // Dapat diubah ke 'http://localhost/db_perpustakaan/api' jika XAMPP berjalan di port/domain berbeda

export const apiService = {
  // BUKU API
  async getBuku() {
    try {
      const res = await fetch(`${API_BASE}/buku.php`);
      const json = await res.json();
      return json.status === 'success' ? json.data : null;
    } catch (e) {
      console.warn('API PHP belum terhubung atau XAMPP belum aktif, menggunakan local state.', e);
      return null;
    }
  },

  async addBuku(buku: any) {
    try {
      const res = await fetch(`${API_BASE}/buku.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buku)
      });
      return await res.json();
    } catch (e) {
      console.error('Gagal menyimpan buku ke API PHP', e);
      throw e;
    }
  },

  async updateBuku(buku: any) {
    try {
      const res = await fetch(`${API_BASE}/buku.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buku)
      });
      return await res.json();
    } catch (e) {
      console.error('Gagal memperbarui buku di API PHP', e);
      throw e;
    }
  },

  async deleteBuku(id: number) {
    try {
      const res = await fetch(`${API_BASE}/buku.php?id=${id}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (e) {
      console.error('Gagal menghapus buku dari API PHP', e);
      throw e;
    }
  },

  // PEMINJAMAN API
  async getPeminjaman() {
    try {
      const res = await fetch(`${API_BASE}/peminjaman.php`);
      const json = await res.json();
      return json.status === 'success' ? json.data : null;
    } catch (e) {
      console.warn('Gagal memuat peminjaman dari API PHP', e);
      return null;
    }
  },

  async checkout(peminjaman: any) {
    try {
      const res = await fetch(`${API_BASE}/peminjaman.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(peminjaman)
      });
      return await res.json();
    } catch (e) {
      console.error('Gagal checkout peminjaman ke API PHP', e);
      throw e;
    }
  },

  async updatePeminjaman(peminjaman: any) {
    try {
      const res = await fetch(`${API_BASE}/peminjaman.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(peminjaman)
      });
      return await res.json();
    } catch (e) {
      console.error('Gagal memperbarui peminjaman di API PHP', e);
      throw e;
    }
  }
};
