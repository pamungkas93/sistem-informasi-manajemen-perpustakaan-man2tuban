import React, { useState } from 'react';
import { CartItem, Peminjaman, DetailPeminjaman, Buku, User } from '../types';
import { ShoppingCart, Trash2, Plus, Minus, CheckCircle, UserCheck } from 'lucide-react';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';

interface CartViewProps {
  cart: CartItem[];
  onUpdateCartQty: (buku_id: number, delta: number) => void;
  onRemoveCartItem: (buku_id: number) => void;
  onClearCart: () => void;
  onCheckout: (peminjaman: Omit<Peminjaman, 'id'>, updatedBooks: Buku[]) => void;
  bukuList: Buku[];
  currentUser: User;
  onNavigate: (view: string) => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  onUpdateCartQty,
  onRemoveCartItem,
  onClearCart,
  onCheckout,
  bukuList,
  currentUser,
  onNavigate
}) => {
  const [namaPeminjam, setNamaPeminjam] = useState('');
  const [nis, setNis] = useState('');
  const [kelas, setKelas] = useState('XII IPA 1');
  const [nomorHp, setNomorHp] = useState('0812');
  const [tanggalPinjam, setTanggalPinjam] = useState(new Date().toISOString().split('T')[0]);
  
  // Default tanggal kembali 7 days from now
  const defaultReturn = new Date();
  defaultReturn.setDate(defaultReturn.getDate() + 7);
  const [tanggalKembali, setTanggalKembali] = useState(defaultReturn.toISOString().split('T')[0]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      Swal.fire({ icon: 'warning', title: 'Keranjang Kosong', text: 'Silakan pilih buku dari katalog terlebih dahulu.' });
      return;
    }

    // Validate quantities against stok_tersedia
    for (const item of cart) {
      const buku = bukuList.find(b => b.id === item.buku_id);
      if (!buku || item.jumlah > buku.stok_tersedia) {
        Swal.fire({
          icon: 'error',
          title: 'Stok Tidak Cukup',
          text: `Jumlah pinjam untuk buku "${item.judul}" melebihi stok tersedia (${buku?.stok_tersedia || 0}).`
        });
        return;
      }
    }

    const kodeTransaksi = `TRX-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const details: DetailPeminjaman[] = cart.map((item, idx) => ({
      id: Date.now() + idx,
      peminjaman_id: 0,
      buku_id: item.buku_id,
      judul_buku: item.judul,
      kode_buku: item.kode_buku,
      jumlah_pinjam: item.jumlah,
      jumlah_kembali: 0,
      jumlah_hilang: 0,
      status_item: 'Belum Kembali'
    }));

    const newPeminjaman: Omit<Peminjaman, 'id'> = {
      kode_transaksi: kodeTransaksi,
      nama_peminjam: namaPeminjam,
      nis,
      kelas,
      nomor_hp: nomorHp,
      tanggal_pinjam: tanggalPinjam,
      tanggal_kembali: tanggalKembali,
      status: 'Belum Kembali',
      petugas_id: currentUser.id,
      nama_petugas: currentUser.nama_lengkap,
      details
    };

    // Calculate updated books stock
    const updatedBooks = bukuList.map(b => {
      const cartMatch = cart.find(c => c.buku_id === b.id);
      if (cartMatch) {
        return {
          ...b,
          stok_tersedia: Math.max(0, b.stok_tersedia - cartMatch.jumlah)
        };
      }
      return b;
    });

    onCheckout(newPeminjaman, updatedBooks);
    onClearCart();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    Swal.fire({
      icon: 'success',
      title: 'Transaksi Berhasil!',
      text: `Peminjaman dengan kode ${kodeTransaksi} berhasil disimpan. Stok buku otomatis dikurangi.`,
      confirmButtonText: 'Lihat Data Peminjaman'
    }).then(() => {
      onNavigate('loans');
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span>Keranjang Peminjaman Buku</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Periksa daftar buku yang akan dipinjam dan lengkapi identitas peminjam</p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Kosongkan Keranjang
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-xs space-y-4">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Keranjang Peminjaman Masih Kosong</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Silakan kunjungi Katalog Buku dan klik tombol ikon keranjang pada buku yang ingin dipinjam oleh siswa.
            </p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            Buka Katalog Buku
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items Table */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Daftar Buku Dipinjam ({cart.length} Judul)
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {cart.map(item => (
                <div key={item.buku_id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{item.judul}</span>
                    <span className="block text-xs text-slate-500 font-mono">Kode: {item.kode_buku} · Penulis: {item.penulis}</span>
                    <span className="block text-[11px] text-emerald-600 font-medium mt-0.5">Stok Tersedia: {item.stok_tersedia}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        onClick={() => onUpdateCartQty(item.buku_id, -1)}
                        className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs">{item.jumlah}</span>
                      <button
                        onClick={() => onUpdateCartQty(item.buku_id, 1)}
                        className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveCartItem(item.buku_id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus dari Keranjang"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Borrower Form & Checkout */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Form Identitas Peminjam</span>
            </h3>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  value={namaPeminjam}
                  onChange={e => setNamaPeminjam(e.target.value)}
                  required
                  placeholder="Contoh: Andi Pratama"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">NIS (Nomor Induk)</label>
                  <input
                    type="text"
                    value={nis}
                    onChange={e => setNis(e.target.value)}
                    required
                    placeholder="Contoh: 10482"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kelas</label>
                  <select
                    value={kelas}
                    onChange={e => setKelas(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option value="X IPA 1">X IPA 1</option>
                    <option value="X IPS 1">X IPS 1</option>
                    <option value="XI IPA 1">XI IPA 1</option>
                    <option value="XI IPS 1">XI IPS 1</option>
                    <option value="XII IPA 1">XII IPA 1</option>
                    <option value="XII IPS 2">XII IPS 2</option>
                    <option value="XII TKJ 1">XII TKJ 1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="text"
                  value={nomorHp}
                  onChange={e => setNomorHp(e.target.value)}
                  required
                  placeholder="Contoh: 08123456789"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tanggal Pinjam</label>
                  <input
                    type="date"
                    value={tanggalPinjam}
                    onChange={e => setTanggalPinjam(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Batas Kembali</label>
                  <input
                    type="date"
                    value={tanggalKembali}
                    onChange={e => setTanggalKembali(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs mb-3 text-slate-500">
                  <span>Petugas Layanan:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentUser.nama_lengkap}</span>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Simpan Transaksi Peminjaman</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
