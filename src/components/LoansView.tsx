import React, { useState } from 'react';
import { Peminjaman, Buku } from '../types';
import { ClipboardList, Search, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';

interface LoansViewProps {
  peminjamanList: Peminjaman[];
  bukuList: Buku[];
  onUpdatePeminjaman: (peminjaman: Peminjaman, updatedBooks: Buku[]) => void;
}

export const LoansView: React.FC<LoansViewProps> = ({
  peminjamanList,
  bukuList,
  onUpdatePeminjaman
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Return modal state
  const [activeLoan, setActiveLoan] = useState<Peminjaman | null>(null);
  const [returnInputs, setReturnInputs] = useState<{ [detailId: number]: { kembali: number; hilang: number } }>({});

  const openReturnModal = (loan: Peminjaman) => {
    setActiveLoan(loan);
    const initialInputs: { [id: number]: { kembali: number; hilang: number } } = {};
    loan.details.forEach(d => {
      initialInputs[d.id] = {
        kembali: 0, // input tambahan pengembalian kali ini
        hilang: 0
      };
    });
    setReturnInputs(initialInputs);
  };

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLoan) return;

    let stockRestorationMap: { [bukuId: number]: number } = {};
    let allCompleted = true;
    let anyReturnedOrLost = false;

    const updatedDetails = activeLoan.details.map(d => {
      const input = returnInputs[d.id] || { kembali: 0, hilang: 0 };
      const addKembali = Number(input.kembali) || 0;
      const addHilang = Number(input.hilang) || 0;

      const totalDiserahkan = addKembali + addHilang;
      const sisaBelumKembali = d.jumlah_pinjam - d.jumlah_kembali - d.jumlah_hilang;

      if (totalDiserahkan > sisaBelumKembali) {
        Swal.fire({
          icon: 'error',
          title: 'Jumlah Tidak Valid',
          text: `Jumlah pengembalian + hilang untuk buku "${d.judul_buku}" melebihi sisa pinjaman (${sisaBelumKembali}).`
        });
        throw new Error('Invalid quantity');
      }

      if (addKembali > 0 || addHilang > 0) {
        anyReturnedOrLost = true;
      }

      const newJumlahKembali = d.jumlah_kembali + addKembali;
      const newJumlahHilang = d.jumlah_hilang + addHilang;

      // Accumulate stock restoration (only for returned books, NOT lost)
      if (addKembali > 0) {
        stockRestorationMap[d.buku_id] = (stockRestorationMap[d.buku_id] || 0) + addKembali;
      }

      // Check item status
      let itemStatus: 'Belum Kembali' | 'Sebagian' | 'Selesai' = 'Belum Kembali';
      if (newJumlahKembali + newJumlahHilang === d.jumlah_pinjam) {
        itemStatus = 'Selesai';
      } else if (newJumlahKembali > 0 || newJumlahHilang > 0) {
        itemStatus = 'Sebagian';
        allCompleted = false;
      } else {
        allCompleted = false;
      }

      return {
        ...d,
        jumlah_kembali: newJumlahKembali,
        jumlah_hilang: newJumlahHilang,
        status_item: itemStatus
      };
    });

    if (!anyReturnedOrLost) {
      Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Masukkan jumlah buku yang dikembalikan atau hilang.' });
      return;
    }

    // Determine overall loan status
    let loanStatus: 'Belum Kembali' | 'Sebagian' | 'Selesai' = 'Belum Kembali';
    const anyPartiallyReturned = updatedDetails.some(d => d.jumlah_kembali > 0 || d.jumlah_hilang > 0);
    if (allCompleted) {
      loanStatus = 'Selesai';
    } else if (anyPartiallyReturned) {
      loanStatus = 'Sebagian';
    }

    const updatedLoan: Peminjaman = {
      ...activeLoan,
      status: loanStatus,
      details: updatedDetails
    };

    // Update book stock (only returned books increase available stock)
    const updatedBooks = bukuList.map(b => {
      const restored = stockRestorationMap[b.id] || 0;
      if (restored > 0) {
        return {
          ...b,
          stok_tersedia: Math.min(b.stok, b.stok_tersedia + restored)
        };
      }
      return b;
    });

    onUpdatePeminjaman(updatedLoan, updatedBooks);
    setActiveLoan(null);

    Swal.fire({
      icon: 'success',
      title: 'Pengembalian Berhasil Disimpan',
      text: `Status transaksi ${activeLoan.kode_transaksi} diperbarui menjadi: ${loanStatus}. Stok buku yang dikembalikan telah dipulihkan.`,
      timer: 1800,
      showConfirmButton: false
    });
  };

  const filteredLoans = peminjamanList.filter(l => {
    const matchSearch = l.nama_peminjam.toLowerCase().includes(search.toLowerCase()) ||
                        l.nis.toLowerCase().includes(search.toLowerCase()) ||
                        l.kode_transaksi.toLowerCase().includes(search.toLowerCase()) ||
                        l.kelas.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            <span>Data Peminjaman & Pengembalian Buku</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Kelola riwayat peminjaman, pengembalian bertahap, dan pencatatan buku hilang</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama siswa, NIS, atau kode transaksi..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="Belum Kembali">Belum Kembali</option>
            <option value="Sebagian">Sebagian</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Transaksi / Tanggal</th>
                <th className="py-3 px-4">Identitas Siswa</th>
                <th className="py-3 px-4">Daftar Buku Dipinjam</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Aksi / Pengembalian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Tidak ada data peminjaman ditemukan.
                  </td>
                </tr>
              ) : (
                filteredLoans.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 align-top">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{l.kode_transaksi}</span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">Pinjam: {l.tanggal_pinjam}</span>
                      <span className="block text-[11px] text-rose-600 font-medium">Batas: {l.tanggal_kembali}</span>
                    </td>
                    <td className="py-3 px-4 align-top">
                      <span className="font-bold text-slate-900 dark:text-white">{l.nama_peminjam}</span>
                      <span className="block text-[11px] text-slate-500">NIS: {l.nis} · Kelas: {l.kelas}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">Petugas: {l.nama_petugas}</span>
                    </td>
                    <td className="py-3 px-4 align-top">
                      <div className="space-y-1.5 max-w-xs">
                        {l.details.map(d => {
                          const sisa = d.jumlah_pinjam - d.jumlah_kembali - d.jumlah_hilang;
                          return (
                            <div key={d.id} className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-700/50">
                              <span className="font-semibold text-slate-900 dark:text-white line-clamp-1">{d.judul_buku}</span>
                              <div className="text-[10px] text-slate-500 flex justify-between mt-0.5">
                                <span>Pinjam: {d.jumlah_pinjam}</span>
                                <span className="text-emerald-600">Kembali: {d.jumlah_kembali}</span>
                                {d.jumlah_hilang > 0 && <span className="text-rose-600">Hilang: {d.jumlah_hilang}</span>}
                                <span className="font-bold text-blue-600">Sisa: {sisa}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center align-top">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        l.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        l.status === 'Sebagian' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right align-top">
                      {l.status !== 'Selesai' ? (
                        <button
                          onClick={() => openReturnModal(l)}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Proses Pengembalian</span>
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-xs inline-flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Selesai
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pengembalian */}
      {activeLoan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Form Pengembalian Buku — {activeLoan.kode_transaksi}
                </h3>
                <p className="text-xs text-slate-500">Peminjam: {activeLoan.nama_peminjam} (Kelas {activeLoan.kelas})</p>
              </div>
              <button onClick={() => setActiveLoan(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleReturnSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3.5 rounded-xl text-xs text-amber-800 dark:text-amber-200">
                <strong>Petunjuk:</strong> Input jumlah buku yang dikembalikan dan buku yang hilang pada sesi ini. Stok perpustakaan akan otomatis bertambah sesuai jumlah buku yang dikembalikan (buku hilang tidak menambah stok). Mendukung pengembalian bertahap (sebagian).
              </div>

              <div className="space-y-4">
                {activeLoan.details.map(d => {
                  const sisaBelumKembali = d.jumlah_pinjam - d.jumlah_kembali - d.jumlah_hilang;
                  const currentInput = returnInputs[d.id] || { kembali: 0, hilang: 0 };

                  return (
                    <div key={d.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{d.judul_buku}</span>
                          <span className="block text-[11px] text-slate-500 font-mono">Kode: {d.kode_buku}</span>
                        </div>
                        <div className="text-right text-xs">
                          <span className="block text-slate-500">Dipinjam: <strong>{d.jumlah_pinjam}</strong></span>
                          <span className="block text-emerald-600">Sudah Kembali: <strong>{d.jumlah_kembali}</strong></span>
                          {d.jumlah_hilang > 0 && <span className="block text-rose-600">Hilang: <strong>{d.jumlah_hilang}</strong></span>}
                          <span className="block text-blue-600 font-bold mt-0.5">Belum Kembali: {sisaBelumKembali}</span>
                        </div>
                      </div>

                      {sisaBelumKembali > 0 ? (
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
                          <div>
                            <label className="block text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                              Jumlah Dikembalikan Sekarang
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={sisaBelumKembali}
                              value={currentInput.kembali}
                              onChange={e => {
                                const val = Number(e.target.value);
                                setReturnInputs({
                                  ...returnInputs,
                                  [d.id]: { ...currentInput, kembali: val }
                                });
                              }}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-rose-700 dark:text-rose-400 mb-1">
                              Jumlah Hilang / Rusak Berat
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={sisaBelumKembali - currentInput.kembali}
                              value={currentInput.hilang}
                              onChange={e => {
                                const val = Number(e.target.value);
                                setReturnInputs({
                                  ...returnInputs,
                                  [d.id]: { ...currentInput, hilang: val }
                                });
                              }}
                              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-emerald-600 font-semibold text-xs flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Buku ini sudah selesai dikembalikan / diproses.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveLoan(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Simpan Pengembalian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
