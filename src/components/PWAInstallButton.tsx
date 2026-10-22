import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2, Share, QrCode, Copy, Check, ExternalLink } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'sidebar' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'qr' | 'ios' | 'apk'>('android');

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-vabg6vseb2e2omcmqib4fl-728760759557.asia-northeast1.run.app';

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

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          onClick={handleClick}
          type="button"
          title="Pasang / Download Aplikasi di HP (APK/PWA)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">📱 Pasang di HP (APK)</span>
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
              <p className="font-semibold text-white">Pasang di HP (APK)</p>
              <p className="text-[10px] text-emerald-400/80">Instal aplikasi ke Android/iOS</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500 text-emerald-950 px-2 py-0.5 rounded-full font-bold">
            APK
          </span>
        </button>
      )}

      {/* Mobile Installation Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-scale-up my-6">
            {/* Header */}
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Download / Pasang Aplikasi ke HP</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              {/* App Identity Banner */}
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <img
                  src="/assets/aistudio/IMG-20250913-WA0211_74ca8a90.jpg"
                  alt="Logo Sahabat Puyuh Hataswa"
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-200"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Sahabat Puyuh Hataswa</h4>
                  <p className="text-[11px] text-slate-500">Sistem Peternakan Puyuh &amp; Presensi HP</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-emerald-600 text-white rounded-md">
                  WebAPK / PWA
                </span>
              </div>

              {/* Instant Install Button if browser supports beforeinstallprompt */}
              {isInstallable && (
                <div>
                  <button
                    onClick={async () => {
                      const res = await install();
                      if (res) setShowModal(false);
                    }}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Klik Untuk Install Langsung ke HP</span>
                  </button>
                </div>
              )}

              {/* Sub-tabs for Guide */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('android')}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition ${
                    activeTab === 'android'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Android (APK)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('qr')}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition ${
                    activeTab === 'qr'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Scan QR Code
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ios')}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition ${
                    activeTab === 'ios'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  iPhone / iOS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('apk')}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition ${
                    activeTab === 'apk'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Info File APK
                </button>
              </div>

              {/* Tab 1: Android Guide */}
              {activeTab === 'android' && (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Cara Pasang di HP Android (Google Chrome):
                    </p>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] pl-1 leading-relaxed">
                      <li>
                        Buka link peternakan ini di <b>Google Chrome HP</b>.
                      </li>
                      <li>
                        Ketuk ikon <b>titik tiga (⋮)</b> di sudut kanan atas layar Chrome HP.
                      </li>
                      <li>
                        Pilih menu <b>&quot;Instal Aplikasi&quot;</b> atau <b>&quot;Tambahkan ke Layar Utama&quot;</b>.
                      </li>
                      <li>
                        Ketuk <b>&quot;Instal&quot;</b>. Google Chrome di Android akan otomatis mengunduh paket <b>WebAPK resmi</b> dan memasangnya di laci aplikasi HP Anda.
                      </li>
                      <li>
                        Aplikasi siap dibuka dari layar HP kapan saja, berfungsi cepat, dan bisa dibuka walau sedang offline!
                      </li>
                    </ol>
                  </div>

                  {/* Share Link */}
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
                    <p className="font-semibold text-emerald-950 text-[11px]">
                      Buka di HP melalui link ini:
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={currentUrl}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-[10px] text-slate-600 select-all truncate"
                      />
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center gap-1 text-[11px] shrink-0"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Scan QR Code */}
              {activeTab === 'qr' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                  <p className="font-bold text-slate-800 text-xs">
                    Scan QR Code Menggunakan Kamera HP:
                  </p>
                  <div className="flex justify-center">
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200 inline-block">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                          currentUrl
                        )}`}
                        alt="QR Code Aplikasi Sahabat Puyuh Hataswa"
                        className="w-40 h-40"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Arahkan kamera HP Android atau iPhone ke barcode di atas, lalu ketuk pop-up tautan untuk langsung membukanya di HP Anda.
                  </p>
                </div>
              )}

              {/* Tab 3: iPhone / iOS Guide */}
              {activeTab === 'ios' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    Untuk iPhone / iPad (Safari):
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px] pl-1 leading-relaxed">
                    <li>
                      Buka tautan ini di browser <b>Safari</b>.
                    </li>
                    <li>
                      Ketuk tombol <b>Bagikan (Share <Share className="w-3 h-3 inline" />)</b> di menu bawah Safari.
                    </li>
                    <li>
                      Gulir ke bawah dan ketuk <b>&quot;Add to Home Screen&quot; (Tambah ke Layar Utama)</b>.
                    </li>
                    <li>
                      Ketuk <b>&quot;Tambah&quot;</b> di pojok kanan atas. Ikon aplikasi Sahabat Puyuh Hataswa akan langsung muncul di home screen iPhone Anda.
                    </li>
                  </ol>
                </div>
              )}

              {/* Tab 4: Raw APK file information */}
              {activeTab === 'apk' && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <p className="font-bold text-slate-800 text-xs">
                    Tentang File .APK untuk HP Android:
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Aplikasi ini menggunakan teknologi <b>PWA (Progressive Web App)</b> standar resmi Google. Saat Anda memilih menu <b>&quot;Instal Aplikasi&quot;</b> di Chrome Android, sistem operasi Android secara otomatis merakit dan memasang <b>WebAPK</b> asli tanpa perlu mengunduh file mentah berbahaya dari luar.
                  </p>
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[10px] text-amber-900 leading-relaxed">
                    <b>Ingin paket .apk mentah untuk dibagikan via WhatsApp?</b> Anda bisa memasukkan URL website Vercel Anda ke tool resmi <b>PWABuilder.com</b> (oleh Microsoft) untuk mengunduh file <code>.apk</code> atau <code>.aab</code> siap upload ke Play Store gratis.
                  </div>
                </div>
              )}

              {/* Footer action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-center cursor-pointer"
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
