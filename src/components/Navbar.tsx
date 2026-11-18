import React from 'react';
import { User } from '../types';
import { LogOut, Shield, User as UserIcon, Menu } from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout, onToggleMobileSidebar }) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-45 px-4 lg:px-6 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors cursor-pointer"
          title="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md shadow-blue-500/20 overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
          <img 
            src="/assets/aistudio/WhatsApp_Image_2023-08-15_at_10.16.57-removebg-preview_20235b23.png" 
            alt="Logo MAN 2 Tuban" 
            className="w-8 h-8 object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            E-Perpus MAN 2 Tuban
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
            Sistem Informasi Manajemen Perpustakaan & Peminjaman Buku Kanzul Ilmi MAN 2 Tuban
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
          <UserIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{currentUser.nama_lengkap}</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
            <Shield className="w-3 h-3" />
            {currentUser.role}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 rounded-lg transition-colors cursor-pointer"
          title="Keluar Sistem"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};
