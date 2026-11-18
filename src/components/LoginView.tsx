import React, { useState } from 'react';
import { User } from '../types';
import { initialUsers } from '../data/initialData';
import { BookOpen, Key, User as UserIcon, ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminpassword');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = initialUsers.find(u => u.username === username);
    if (found && (password === 'adminpassword' || password === 'petugas123' || password.length > 3)) {
      Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        text: `Selamat datang kembali, ${found.nama_lengkap}`,
        timer: 1500,
        showConfirmButton: false
      });
      onLogin(found);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Username atau password salah! (Coba: admin / adminpassword)',
      });
    }
  };

  const handleQuickLogin = (user: User) => {
    setUsername(user.username);
    setPassword('adminpassword');
    onLogin(user);
    Swal.fire({
      icon: 'success',
      title: 'Login Otomatis Berhasil',
      text: `Masuk sebagai ${user.nama_lengkap}`,
      timer: 1200,
      showConfirmButton: false
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="p-8 text-center bg-gradient-to-b from-slate-800/80 to-slate-900 border-b border-slate-800">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-600/30 mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            SIM Perpustakaan Sekolah
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sistem Informasi Manajemen & Peminjaman Buku Berbasis Web
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Username Admin / Petugas
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <UserIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Masukkan username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Key className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Masukkan password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Masuk ke Sistem</span>
          </button>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-[11px] text-slate-400 text-center mb-3">
              Atau login cepat sebagai akun uji coba:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {initialUsers.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors text-left truncate cursor-pointer"
                >
                  <div className="font-bold truncate">{u.username}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{u.role}</div>
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="px-8 py-4 bg-slate-950/50 border-t border-slate-800/80 text-center text-[11px] text-slate-500">
          PHP Native MySQLi • Bootstrap 5 • Chart.js • PhpSpreadsheet
        </div>
      </div>
    </div>
  );
};
