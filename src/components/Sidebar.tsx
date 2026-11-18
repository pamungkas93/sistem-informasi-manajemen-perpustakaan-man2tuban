import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BookMarked, 
  Tags, 
  ShoppingCart, 
  ClipboardList, 
  FileSpreadsheet, 
  CodeXml,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  cartCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView, cartCount }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Katalog Buku', icon: BookMarked },
    { id: 'categories', label: 'Kategori Buku', icon: Tags },
    { id: 'cart', label: 'Keranjang Pinjam', icon: ShoppingCart, badge: cartCount },
    { id: 'loans', label: 'Data Peminjaman', icon: ClipboardList },
    { id: 'reports', label: 'Laporan Semester & Excel', icon: FileSpreadsheet },
    { id: 'php_source', label: 'Source Code PHP (XAMPP)', icon: CodeXml },
  ];

  return (
    <aside className={`${isMinimized ? 'w-20' : 'w-64'} bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-65px)] border-r border-slate-800 transition-all duration-300 relative`}>
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
        {!isMinimized && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Menu Utama
          </span>
        )}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className={`p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer ${isMinimized ? 'mx-auto' : 'ml-auto'}`}
          title={isMinimized ? 'Perbesar Menu' : 'Minimize Menu'}
        >
          {isMinimized ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              title={isMinimized ? item.label : undefined}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className={`flex items-center gap-3 ${isMinimized ? 'justify-center w-full' : ''}`}>
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isMinimized && <span className="truncate">{item.label}</span>}
              </div>
              {!isMinimized && item.badge !== undefined && item.badge > 0 && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                  isActive ? 'bg-white text-emerald-600' : 'bg-emerald-600 text-white'
                }`}>
                  {item.badge}
                </span>
              )}
              {isMinimized && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
          );
        })}
      </nav>

      {!isMinimized && (
        <div className="p-4 m-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
          <p className="font-semibold text-slate-200 mb-1">Status Sistem</p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Database MySQL (InnoDB) Aktif</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            PHP Native & Bootstrap 5 Ready
          </p>
        </div>
      )}
    </aside>
  );
};
