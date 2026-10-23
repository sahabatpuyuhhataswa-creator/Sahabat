import React from 'react';
import { UserRole } from '../types/quail';
import {
  LayoutDashboard,
  Egg,
  Wheat,
  Activity,
  Receipt,
  Scale,
  Bot,
  Lock,
  X,
  Bird,
  UserCheck,
  ShoppingBag,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export type TabKey =
  | 'dashboard'
  | 'telur'
  | 'penjualan-telur'
  | 'bibit'
  | 'pakan'
  | 'populasi'
  | 'absensi'
  | 'operasional'
  | 'labarugi'
  | 'ai-advisor'
  | 'pengaturan';

interface SidebarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  currentRole: UserRole;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentRole,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const isOwner = currentRole === 'owner';

  const handleSelectTab = (tab: TabKey, isRestricted: boolean) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-30 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col fixed md:sticky top-0 md:top-[57px] h-full md:h-[calc(100vh-57px)] z-40 transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center md:hidden">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/IMG-20250913-WA0211_74ca8a90.jpg"
              alt="Logo Hataswa"
              className="w-7 h-7 rounded-full object-cover border border-emerald-500/40"
            />
            <span className="text-xs font-semibold text-slate-200">Sahabat Puyuh Hataswa</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {/* Main Dashboard */}
          <button
            onClick={() => handleSelectTab('dashboard', false)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>Dashboard Utama</span>
          </button>

          {/* Section: Operasional Kandang */}
          <div className="pt-4 pb-1.5 px-3 text-[11px] font-semibold text-slate-400">
            Operasional Kandang
          </div>

          <button
            onClick={() => handleSelectTab('telur', false)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left ${
              activeTab === 'telur'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Egg className={`w-4 h-4 ${activeTab === 'telur' ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>Panen Telur (Harian)</span>
          </button>

          <button
            onClick={() => handleSelectTab('penjualan-telur', false)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left ${
              activeTab === 'penjualan-telur'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className={`w-4 h-4 ${activeTab === 'penjualan-telur' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <div className="flex-1 flex items-center justify-between">
              <span>Penjualan Telur</span>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.2 rounded font-semibold border border-emerald-700/40">
                Khusus
              </span>
            </div>
          </button>

          <button
            onClick={() => handleSelectTab('bibit', false)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left ${
              activeTab === 'bibit'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Bird className={`w-4 h-4 ${activeTab === 'bibit' ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>Penjualan Bibit (DOQ)</span>
          </button>

          <button
            onClick={() => handleSelectTab('pakan', false)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left ${
              activeTab === 'pakan'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Wheat className={`w-4 h-4 ${activeTab === 'pakan' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Stok &amp; Pakan Keluar</span>
          </button>

          <button
            onClick={() => handleSelectTab('populasi', false)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left ${
              activeTab === 'populasi'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Activity className={`w-4 h-4 ${activeTab === 'populasi' ? 'text-rose-400' : 'text-slate-400'}`} />
            <span>Populasi &amp; Mortalitas</span>
          </button>

          <button
            onClick={() => handleSelectTab('absensi', false)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left ${
              activeTab === 'absensi'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <UserCheck className={`w-4 h-4 ${activeTab === 'absensi' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>Absensi Petugas</span>
          </button>

          {/* Section: Keuangan & Analisis */}
          <div className="pt-4 pb-1.5 px-3 flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Keuangan &amp; Analisis</span>
            {!isOwner && (
              <span title="Khusus Akun Pemilik">
                <Lock className="w-3 h-3 text-slate-400" />
              </span>
            )}
          </div>

          <button
            onClick={() => handleSelectTab('operasional', !isOwner)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left ${
              activeTab === 'operasional'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            } ${!isOwner ? 'opacity-70' : ''}`}
          >
            <div className="flex items-center gap-3">
              <Receipt className={`w-4 h-4 ${activeTab === 'operasional' ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>Beban Operasional</span>
            </div>
            {!isOwner && <Lock className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          <button
            onClick={() => handleSelectTab('labarugi', !isOwner)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left ${
              activeTab === 'labarugi'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            } ${!isOwner ? 'opacity-70' : ''}`}
          >
            <div className="flex items-center gap-3">
              <Scale className={`w-4 h-4 ${activeTab === 'labarugi' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>Laporan Laba Rugi</span>
            </div>
            {!isOwner && <Lock className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          <button
            onClick={() => handleSelectTab('ai-advisor', !isOwner)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left ${
              activeTab === 'ai-advisor'
                ? 'bg-purple-950/40 text-purple-200 font-semibold border border-purple-800/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            } ${!isOwner ? 'opacity-70' : ''}`}
          >
            <div className="flex items-center gap-3">
              <Bot className={`w-4 h-4 ${activeTab === 'ai-advisor' ? 'text-purple-400' : 'text-slate-400'}`} />
              <span>AI Financial Advisor</span>
            </div>
            {!isOwner ? (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <span className="text-[10px] bg-purple-900/60 text-purple-300 px-1.5 py-0.5 rounded-md font-semibold border border-purple-700/50">
                AI
              </span>
            )}
          </button>
          <button
            onClick={() => handleSelectTab('pengaturan', false)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition text-left ${
              activeTab === 'pengaturan'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700/60 shadow-xs'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 text-slate-400">⚙️</span>
              <span>Pengaturan</span>
            </div>
          </button>
        </nav>

        {/* PWA / APK Mobile Install Button */}
        <div className="p-3 border-t border-slate-800">
          <PWAInstallButton variant="sidebar" />
        </div>

        {/* User Role Indicator Card at Bottom */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <div className={`w-2 h-2 rounded-full ${isOwner ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <div className="flex-1 truncate">
              <p className="font-semibold text-slate-200 truncate">
                {isOwner ? 'Pemilik Farm' : 'Petugas Kandang'}
              </p>
              <p className="text-[10px] text-slate-400">
                {isOwner ? 'Akses Penuh Keuangan & AI' : 'Mode Pencatatan Lapangan'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
