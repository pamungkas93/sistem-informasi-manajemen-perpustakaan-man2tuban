/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { User, Buku, Kategori, Peminjaman, CartItem } from './types';
import { initialUsers, initialBuku, initialKategori, initialPeminjaman } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { CatalogView } from './components/CatalogView';
import { CategoryView } from './components/CategoryView';
import { CartView } from './components/CartView';
import { LoansView } from './components/LoansView';
import { ReportView } from './components/ReportView';
import { PhpSourceView } from './components/PhpSourceView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]); // Default logged in as admin
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [bukuList, setBukuList] = useState<Buku[]>(initialBuku);
  const [kategoriList, setKategoriList] = useState<Kategori[]>(initialKategori);
  const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>(initialPeminjaman);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cart Handlers
  const handleAddToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.buku_id === item.buku_id);
      if (existing) {
        return prev.map(c => 
          c.buku_id === item.buku_id 
            ? { ...c, jumlah: Math.min(c.stok_tersedia, c.jumlah + 1) } 
            : c
        );
      }
      return [...prev, item];
    });
  };

  const handleUpdateCartQty = (buku_id: number, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.buku_id === buku_id) {
        const newQty = Math.max(1, Math.min(c.stok_tersedia, c.jumlah + delta));
        return { ...c, jumlah: newQty };
      }
      return c;
    }));
  };

  const handleRemoveCartItem = (buku_id: number) => {
    setCart(prev => prev.filter(c => c.buku_id !== buku_id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Buku Handlers
  const handleAddBuku = (newBuku: Omit<Buku, 'id'>) => {
    const id = Date.now();
    setBukuList(prev => [...prev, { ...newBuku, id }]);
  };

  const handleUpdateBuku = (updated: Buku) => {
    setBukuList(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const handleDeleteBuku = (id: number) => {
    setBukuList(prev => prev.filter(b => b.id !== id));
  };

  // Kategori Handlers
  const handleAddKategori = (newKat: Omit<Kategori, 'id'>) => {
    const id = Date.now();
    setKategoriList(prev => [...prev, { ...newKat, id }]);
  };

  const handleUpdateKategori = (updated: Kategori) => {
    setKategoriList(prev => prev.map(k => k.id === updated.id ? updated : k));
  };

  const handleDeleteKategori = (id: number) => {
    setKategoriList(prev => prev.filter(k => k.id !== id));
  };

  // Peminjaman / Checkout Handlers
  const handleCheckout = (newPeminjaman: Omit<Peminjaman, 'id'>, updatedBooks: Buku[]) => {
    const id = Date.now();
    const created: Peminjaman = { ...newPeminjaman, id };
    // Assign peminjaman_id to details
    created.details = created.details.map(d => ({ ...d, peminjaman_id: id }));
    setPeminjamanList(prev => [created, ...prev]);
    setBukuList(updatedBooks);
  };

  const handleUpdatePeminjaman = (updatedLoan: Peminjaman, updatedBooks: Buku[]) => {
    setPeminjamanList(prev => prev.map(l => l.id === updatedLoan.id ? updatedLoan : l));
    setBukuList(updatedBooks);
  };

  if (!currentUser) {
    return <LoginView onLogin={user => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100">
      <Navbar 
        currentUser={currentUser} 
        onLogout={() => setCurrentUser(null)} 
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex flex-1 relative">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar Container */}
        <div className={`fixed lg:relative inset-y-0 left-0 z-45 transform ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300`}>
          <Sidebar
            currentView={currentView}
            onSelectView={view => {
              setCurrentView(view);
              setIsMobileSidebarOpen(false);
            }}
            cartCount={cart.reduce((acc, c) => acc + c.jumlah, 0)}
          />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
          {currentView === 'dashboard' && (
            <DashboardView
              bukuList={bukuList}
              peminjamanList={peminjamanList}
              onNavigate={view => setCurrentView(view)}
            />
          )}

          {currentView === 'catalog' && (
            <CatalogView
              bukuList={bukuList}
              kategoriList={kategoriList}
              onAddBuku={handleAddBuku}
              onUpdateBuku={handleUpdateBuku}
              onDeleteBuku={handleDeleteBuku}
              onAddToCart={handleAddToCart}
            />
          )}

          {currentView === 'categories' && (
            <CategoryView
              kategoriList={kategoriList}
              onAddKategori={handleAddKategori}
              onUpdateKategori={handleUpdateKategori}
              onDeleteKategori={handleDeleteKategori}
            />
          )}

          {currentView === 'cart' && (
            <CartView
              cart={cart}
              onUpdateCartQty={handleUpdateCartQty}
              onRemoveCartItem={handleRemoveCartItem}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
              bukuList={bukuList}
              currentUser={currentUser}
              onNavigate={view => setCurrentView(view)}
            />
          )}

          {currentView === 'loans' && (
            <LoansView
              peminjamanList={peminjamanList}
              bukuList={bukuList}
              onUpdatePeminjaman={handleUpdatePeminjaman}
            />
          )}

          {currentView === 'reports' && (
            <ReportView
              peminjamanList={peminjamanList}
            />
          )}

          {currentView === 'php_source' && (
            <PhpSourceView />
          )}
        </main>
      </div>
    </div>
  );
}
