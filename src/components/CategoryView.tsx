import React, { useState } from 'react';
import { Kategori } from '../types';
import { Tags, Plus, Edit3, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface CategoryViewProps {
  kategoriList: Kategori[];
  onAddKategori: (kat: Omit<Kategori, 'id'>) => void;
  onUpdateKategori: (kat: Kategori) => void;
  onDeleteKategori: (id: number) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  kategoriList,
  onAddKategori,
  onUpdateKategori,
  onDeleteKategori
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKat, setEditingKat] = useState<Kategori | null>(null);
  const [namaKategori, setNamaKategori] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  const openAddModal = () => {
    setEditingKat(null);
    setNamaKategori('');
    setDeskripsi('');
    setIsModalOpen(true);
  };

  const openEditModal = (kat: Kategori) => {
    setEditingKat(kat);
    setNamaKategori(kat.nama_kategori);
    setDeskripsi(kat.deskripsi);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKat) {
      onUpdateKategori({
        ...editingKat,
        nama_kategori: namaKategori,
        deskripsi
      });
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Kategori berhasil diperbarui', timer: 1200, showConfirmButton: false });
    } else {
      onAddKategori({
        nama_kategori: namaKategori,
        deskripsi
      });
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Kategori baru berhasil ditambahkan', timer: 1200, showConfirmButton: false });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number, nama: string) => {
    Swal.fire({
      title: 'Hapus Kategori?',
      text: `Apakah Anda yakin ingin menghapus kategori "${nama}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(res => {
      if (res.isConfirmed) {
        onDeleteKategori(id);
        Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Kategori berhasil dihapus', timer: 1000, showConfirmButton: false });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tags className="w-5 h-5 text-blue-600" />
            <span>Manajemen Kategori Buku</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelompokkan koleksi buku perpustakaan berdasarkan bidang dan kurikulum</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kategoriList.map(kat => (
          <div key={kat.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold rounded-lg text-xs">
                  ID: {kat.id}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(kat)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Kategori"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(kat.id, kat.nama_kategori)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{kat.nama_kategori}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{kat.deskripsi}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              Kategori aktif perpustakaan
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingKat ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  value={namaKategori}
                  onChange={e => setNamaKategori(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  placeholder="Contoh: Teknologi & Komputer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Deskripsi</label>
                <textarea
                  value={deskripsi}
                  onChange={e => setDeskripsi(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  placeholder="Keterangan singkat kategori..."
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
                  {editingKat ? 'Simpan Perubahan' : 'Tambah Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
