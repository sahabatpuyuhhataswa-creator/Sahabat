import React from 'react';
import { UserAccount, UserRole } from '../types/quail';
import {
  Egg,
  ShieldCheck,
  User,
  Menu,
  Download,
  RotateCcw,
  KeyRound,
  LogOut,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentRole: UserRole;
  currentUser: UserAccount | null;
  onRoleChange: (role: UserRole) => void;
  onOpenModal: (type: 'egg' | 'eggSale' | 'feed' | 'population' | 'expense' | 'seedSale') => void;
  onOpenVoiceModal: () => void;
  onOpenInvoiceModal: () => void;
  onResetData: () => void;
  onExportData: () => void;
  onOpenChangePassword: () => void;
  onLogout: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  onRoleChange,
  onOpenModal,
  onOpenVoiceModal,
  onOpenInvoiceModal,
  onResetData,
  onExportData,
  onOpenChangePassword,
  onLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const isOwner = currentRole === 'owner';

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:px-6 gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/IMG-20250913-WA0211_74ca8a90.jpg"
              alt="Logo Sahabat Puyuh Hataswa"
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/40 shadow-sm bg-white flex-shrink-0"
            />
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                Sahabat Puyuh Hataswa
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Sistem Manajemen &amp; Keuangan Farm</p>
            </div>
          </div>
        </div>

        {/* Zone 2: Middle Status & Actions */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={onOpenVoiceModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition shadow-xs"
            title="Input Suara Lapangan (Voice Note)"
          >
            <span>🎤 Catat Suara</span>
          </button>

          <button
            onClick={onOpenInvoiceModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition shadow-xs"
            title="Buat Faktur & Struk Nota Digital"
          >
            <span>📄 Buat Faktur</span>
          </button>

          <button
            onClick={onExportData}
            title="Download Cadangan Data JSON Lengkap"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>JSON</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mengembalikan seluruh data ke data demo/sampel bawaan? Seluruh data yang Anda ubah akan ditimpa dengan data demo.')) {
                onResetData();
              }
            }}
            title="Kembalikan data sampel bawaan"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Zone 3: Role Switcher & User Profile */}
        <div className="flex items-center gap-2.5">
          <PWAInstallButton variant="navbar" />

          {/* Quick Add Button */}
          <button
            onClick={() => onOpenModal('egg')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-xs transition"
          >
            <span>+ Catat Telur</span>
          </button>

          {/* Current Role Badge */}
          <div className="flex items-center gap-2 bg-slate-800/90 py-1 px-2.5 rounded-xl border border-slate-700/70 text-xs">
            <div className="flex items-center gap-1.5">
              {isOwner ? (
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              ) : (
                <User className="w-4 h-4 text-emerald-400" />
              )}
              <span className="font-semibold text-slate-200 hidden sm:inline">
                {isOwner ? 'Pemilik' : 'Petugas'}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            {/* Change Password button */}
            <button
              onClick={onOpenChangePassword}
              className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 rounded-lg transition"
              title="Ganti Password"
              aria-label="Ganti Password"
            >
              <KeyRound className="w-3.5 h-3.5" />
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition"
              title="Keluar / Logout"
              aria-label="Keluar / Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
