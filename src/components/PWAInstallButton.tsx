import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'sidebar' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running inside installed standalone PWA, hide install trigger
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          onClick={handleClick}
          type="button"
          title="Pasang Aplikasi di HP"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Pasang di HP</span>
          <span className="sm:hidden">App HP</span>
        </button>
      )}

      {variant === 'sidebar' && (
        <button
          onClick={handleClick}
          type="button"
          className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50 hover:text-white transition group text-xs font-medium cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
              <Download className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Pasang Aplikasi di HP</p>
              <p className="text-[10px] text-emerald-400/80">Akses cepat tanpa browser</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500 text-emerald-950 px-2 py-0.5 rounded-full font-bold">
            PWA
          </span>
        </button>
      )}

      {/* Mobile Installation Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 animate-scale-up">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Pasang Aplikasi di HP</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <img
                  src="/assets/aistudio/IMG-20250913-WA0211_74ca8a90.jpg"
                  alt="Logo Sahabat Puyuh Hataswa"
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Sahabat Puyuh Hataswa</h4>
                  <p className="text-[11px] text-slate-500">Aplikasi Peternakan &amp; Absensi Petugas</p>
                </div>
              </div>

              {isInstallable ? (
                <div>
                  <button
                    onClick={async () => {
                      const res = await install();
                      if (res) setShowModal(false);
                    }}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Klik Untuk Install Sekarang</span>
                  </button>
                </div>
              ) : null}

              <div className="space-y-3 pt-2">
                <p className="font-bold text-slate-900 text-xs">Cara Pasang ke Layar Utama HP:</p>

                {/* Android Steps */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Untuk HP Android (Chrome / Browser):
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] pl-1">
                    <li>Buka tautan ini di browser Google Chrome HP.</li>
                    <li>
                      Ketuk menu <b>titik tiga (⋮)</b> di pojok kanan atas layar.
                    </li>
                    <li>
                      Pilih <b>&quot;Tambahkan ke Layar Utama&quot;</b> atau <b>&quot;Install Aplikasi&quot;</b>.
                    </li>
                    <li>Ikon aplikasi akan otomatis muncul di layar utama HP Anda seperti APK.</li>
                  </ol>
                </div>

                {/* iOS Steps */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Untuk iPhone / iPad (Safari):
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] pl-1">
                    <li>
                      Ketuk tombol <b>Bagikan (Share <Share className="w-3 h-3 inline" />)</b> di bagian bawah Safari.
                    </li>
                    <li>
                      Gulir ke bawah dan pilih <b>&quot;Add to Home Screen&quot; (Tambah ke Layar Utama)</b>.
                    </li>
                  </ol>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-center"
                >
                  Tutup Panduan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
