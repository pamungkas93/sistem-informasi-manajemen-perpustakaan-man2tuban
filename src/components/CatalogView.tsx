import React, { useState } from 'react';
import { Buku, Kategori, CartItem } from '../types';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ShoppingCart, 
  PlusCircle, 
  MinusCircle,
  BookMarked
} from 'lucide-react';
import Swal from 'sweetalert2';

interface CatalogViewProps {
  bukuList: Buku[];
  kategoriList: Kategori[];
  onAddBuku: (buku: Omit<Buku, 'id'>) => void;
  onUpdateBuku: (buku: Buku) => void;
  onDeleteBuku: (id: number) => void;
  onAddToCart: (item: CartItem) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  bukuList,
  kategoriList,
  onAddBuku,
  onUpdateBuku,
  onDeleteBuku,
  onAddToCart
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBuku, setEditingBuku] = useState<Buku | null>(null);

  // Form state
  const [kodeBuku, setKodeBuku] = useState('');
  const [judul, setJudul] = useState('');
  const [penulis, setPenulis] = useState('');
  const [penerbit, setPenerbit] = useState('');
  const [tahunTerbit, setTahunTerbit] = useState(2023);
  const [kategoriId, setKategoriId] = useState(kategoriList[0]?.id || 1);
  const [stok, setStok] = useState(10);
  const [lokasiRak, setLokasiRak] = useState('Rak A-01');
  const [coverUrl, setCoverUrl] = useState('');

  const openAddModal = () => {
    setEditingBuku(null);
    setKodeBuku(`BUP-0${bukuList.length + 1}`);
    setJudul('');
    setPenulis('');
    setPenerbit('');
    setTahunTerbit(2024);
    setKategoriId(kategoriList[0]?.id || 1);
    setStok(10);
    setLokasiRak('Rak A-01');
    setCoverUrl('https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400');
    setIsModalOpen(true);
  };

  const openEditModal = (b: Buku) => {
    setEditingBuku(b);
    setKodeBuku(b.kode_buku);
    setJudul(b.judul);
    setPenulis(b.penulis);
    setPenerbit(b.penerbit);
    setTahunTerbit(b.tahun_terbit);
    setKategoriId(b.kategori_id);
    setStok(b.stok);
    setLokasiRak(b.lokasi_rak);
    setCoverUrl(b.cover_url || '');
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBuku) {
      // Calculate diff in stok to update stok_tersedia safely
      const stokDiff = stok - editingBuku.stok;
      const newTersedia = Math.max(0, editingBuku.stok_tersedia + stokDiff);
      
      onUpdateBuku({
        ...editingBuku,
        kode_buku: kodeBuku,
        judul,
        penulis,
        penerbit,
        tahun_terbit: Number(tahunTerbit),
        kategori_id: Number(kategoriId),
        stok: Number(stok),
        stok_tersedia: newTersedia,
        lokasi_rak: lokasiRak,
        cover_url: coverUrl
      });
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data buku berhasil diperbarui', timer: 1200, showConfirmButton: false });
    } else {
      onAddBuku({
        kode_buku: kodeBuku,
        judul,
        penulis,
        penerbit,
        tahun_terbit: Number(tahunTerbit),
        kategori_id: Number(kategoriId),
        stok: Number(stok),
        stok_tersedia: Number(stok),
        lokasi_rak: lokasiRak,
        cover_url: coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400'
      });
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Buku baru berhasil ditambahkan', timer: 1200, showConfirmButton: false });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number, judulBuku: string) => {
    Swal.fire({
      title: 'Hapus Buku?',
      text: `Apakah Anda yakin ingin menghapus buku "${judulBuku}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        onDeleteBuku(id);
        Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Buku berhasil dihapus.', timer: 1000, showConfirmButton: false });
      }
    });
  };

  const handleQuickStock = (buku: Buku, delta: number) => {
    const newStok = buku.stok + delta;
    const newTersedia = buku.stok_tersedia + delta;
    if (newStok < 0 || newTersedia < 0) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Stok tidak boleh kurang dari 0!' });
      return;
    }
    onUpdateBuku({
      ...buku,
      stok: newStok,
      stok_tersedia: newTersedia
    });
    Swal.fire({ icon: 'success', title: 'Stok Diperbarui', text: `Stok ${buku.judul} menjadi ${newStok}`, timer: 900, showConfirmButton: false });
  };

  // Filter books
  const filteredBuku = bukuList.filter(b => {
    const matchSearch = b.judul.toLowerCase().includes(search.toLowerCase()) ||
                        b.penulis.toLowerCase().includes(search.toLowerCase()) ||
                        b.kode_buku.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'all' || b.kategori_id === Number(selectedCategory);
    return matchSearch && matchCat;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBuku.length / itemsPerPage) || 1;
  const paginatedBuku = filteredBuku.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-blue-600" />
            <span>Katalog & Inventaris Buku</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelola data buku, penambahan stok, dan kategori perpustakaan sekolah</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Buku Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul, penulis, atau kode buku..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Kategori:</span>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Semua Kategori</option>
            {kategoriList.map(kat => (
              <option key={kat.id} value={kat.id}>{kat.nama_kategori}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Table / Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Buku & Penulis</th>
                <th className="py-3 px-4">Kode / Rak</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-center">Stok / Tersedia</th>
                <th className="py-3 px-4 text-center">Aksi Cepat Stok</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {paginatedBuku.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Tidak ada buku ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedBuku.map(b => {
                  const kategori = kategoriList.find(k => k.id === b.kategori_id)?.nama_kategori || 'Umum';
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.cover_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400'}
                            alt={b.judul}
                            className="w-10 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{b.judul}</span>
                            <span className="block text-[11px] text-slate-500">{b.penulis} ({b.tahun_terbit})</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{b.kode_buku}</span>
                        <span className="block text-[10px] text-slate-500">{b.lokasi_rak}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                          {kategori}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">
                        <span className="font-bold text-slate-900 dark:text-white">{b.stok_tersedia}</span>
                        <span className="text-slate-400"> / {b.stok}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                          <button
                            onClick={() => handleQuickStock(b, -1)}
                            className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded text-slate-500 transition-colors cursor-pointer"
                            title="Kurangi Stok"
                          >
                            <MinusCircle className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-1.5 font-mono font-semibold text-xs">{b.stok}</span>
                          <button
                            onClick={() => handleQuickStock(b, 1)}
                            className="p-1 hover:bg-emerald-100 hover:text-emerald-600 rounded text-slate-500 transition-colors cursor-pointer"
                            title="Tambah Stok"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => onAddToCart({
                              buku_id: b.id,
                              judul: b.judul,
                              kode_buku: b.kode_buku,
                              penulis: b.penulis,
                              stok_tersedia: b.stok_tersedia,
                              jumlah: 1
                            })}
                            disabled={b.stok_tersedia <= 0}
                            className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                              b.stok_tersedia > 0 
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' 
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                            title="Masukkan ke Keranjang Peminjaman"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(b)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Edit Buku"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id, b.judul)}
                            className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Buku"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Menampilkan halaman <strong className="text-slate-900 dark:text-white">{currentPage}</strong> dari <strong className="text-slate-900 dark:text-white">{totalPages}</strong> ({filteredBuku.length} total buku)
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold disabled:opacity-50 cursor-pointer"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Modal Tambah / Edit Buku */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingBuku ? 'Edit Data Buku' : 'Tambah Buku Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kode Buku</label>
                  <input
                    type="text"
                    value={kodeBuku}
                    onChange={e => setKodeBuku(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                  <select
                    value={kategoriId}
                    onChange={e => setKategoriId(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  >
                    {kategoriList.map(kat => (
                      <option key={kat.id} value={kat.id}>{kat.nama_kategori}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Judul Buku</label>
                <input
                  type="text"
                  value={judul}
                  onChange={e => setJudul(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  placeholder="Contoh: Matematika Peminatan Kelas XII"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Penulis</label>
                  <input
                    type="text"
                    value={penulis}
                    onChange={e => setPenulis(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Penerbit</label>
                  <input
                    type="text"
                    value={penerbit}
                    onChange={e => setPenerbit(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tahun Terbit</label>
                  <input
                    type="number"
                    value={tahunTerbit}
                    onChange={e => setTahunTerbit(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Stok</label>
                  <input
                    type="number"
                    value={stok}
                    onChange={e => setStok(Number(e.target.value))}
                    required
                    min={1}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Lokasi Rak</label>
                  <input
                    type="text"
                    value={lokasiRak}
                    onChange={e => setLokasiRak(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Buku (Upload Gambar dari Komputer / URL)
                </label>
                <div className="flex items-center gap-3">
                  {coverUrl && (
                    <img
                      src={coverUrl}
                      alt="Preview"
                      className="w-12 h-16 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={e => setCoverUrl(e.target.value)}
                  className="w-full mt-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  placeholder="Atau masukkan URL gambar (https://...)"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  {editingBuku ? 'Simpan Perubahan' : 'Tambah Buku'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
