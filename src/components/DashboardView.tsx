import React from 'react';
import { Buku, Peminjaman } from '../types';
import { 
  BookOpen, 
  Layers, 
  BookmarkCheck, 
  AlertTriangle, 
  ArrowLeftRight, 
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardViewProps {
  bukuList: Buku[];
  peminjamanList: Peminjaman[];
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ bukuList, peminjamanList, onNavigate }) => {
  // Calculations
  const totalJudul = bukuList.length;
  const totalStokTersedia = bukuList.reduce((acc, b) => acc + b.stok_tersedia, 0);
  const totalStokSeluruh = bukuList.reduce((acc, b) => acc + b.stok, 0);
  const totalDipinjam = totalStokSeluruh - totalStokTersedia;
  
  // Calculate total buku hilang from details
  let totalHilang = 0;
  peminjamanList.forEach(p => {
    p.details.forEach(d => {
      totalHilang += d.jumlah_hilang || 0;
    });
  });

  const totalTransaksi = peminjamanList.length;

  // Unique students count based on NIS
  const uniqueStudents = new Set(peminjamanList.map(p => p.nis)).size;

  // Monthly loan chart data
  const chartData = {
    labels: ['Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November'],
    datasets: [
      {
        label: 'Jumlah Peminjaman Buku',
        data: [12, 19, 25, 34, 42, totalTransaksi + 15],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 8,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 5 }
      }
    }
  };

  const recentLoans = peminjamanList.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-semibold uppercase tracking-wider">
            Dashboard Admin Perpustakaan
          </span>
          <h2 className="text-2xl font-bold tracking-tight mt-2">
            Selamat Datang di Sistem Informasi Manajemen Perpustakaan
          </h2>
          <p className="text-emerald-100 text-sm mt-1">
            Kelola inventaris buku, peminjaman siswa, pengembalian, dan laporan semester secara real-time.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('cart')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            + Transaksi Baru
          </button>
          <button
            onClick={() => onNavigate('catalog')}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs rounded-xl shadow-md transition-colors cursor-pointer border border-emerald-400/30"
          >
            Kelola Katalog Buku
          </button>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Judul Buku</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{totalJudul}</h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Koleksi terdaftar</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Stok Tersedia</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{totalStokTersedia}</h3>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">Siap dipinjam</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sedang Dipinjam</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <BookmarkCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{totalDipinjam}</h3>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">Buku di tangan siswa</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Buku Hilang</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{totalHilang}</h3>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1">Dilaporkan hilang</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Transaksi</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{totalTransaksi}</h3>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1">Riwayat peminjaman</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Siswa Peminjam</span>
            <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{uniqueStudents}</h3>
            <p className="text-[11px] text-violet-600 dark:text-violet-400 font-medium mt-1">Siswa aktif unik</p>
          </div>
        </div>
      </div>

      {/* Chart & Recent Activity section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Grafik Peminjaman Bulanan</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Statistik transaksi peminjaman buku semester ini</p>
            </div>
          </div>
          <div className="h-72 flex items-center justify-center">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Aktivitas Terbaru</span>
            </h3>
            <button
              onClick={() => onNavigate('loans')}
              className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto">
            {recentLoans.map(p => (
              <div key={p.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{p.nama_peminjam}</span>
                    <span className="block text-[11px] text-slate-500">Kelas {p.kelas} · NIS {p.nis}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                    p.status === 'Sebagian' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div className="mt-2 text-[11px] text-slate-500 flex justify-between items-center">
                  <span>Pinjam: {p.tanggal_pinjam}</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{p.kode_transaksi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
