import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types/quail';
import { authenticateUser } from '../utils/auth';
import { Egg, Eye, EyeOff, ShieldCheck, User, Lock, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('owner');
  const [username, setUsername] = useState('pemilik');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleTabSelect = (role: UserRole) => {
    setSelectedRole(role);
    setUsername(role === 'owner' ? 'pemilik' : 'petugas');
    setPassword('');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = authenticateUser(username, password);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrorMsg(result.error || 'Autentikasi gagal. Periksa kembali username dan password.');
      }
      setIsLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background visual ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img
          src="/images/quail_farm_banner_1792556184331.jpg"
          alt="Kandang Sahabat Puyuh Hataswa"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
          className="w-full h-full object-cover filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full p-1 bg-white/10 border-2 border-emerald-400/50 shadow-xl shadow-emerald-950/40 mb-3 flex items-center justify-center backdrop-blur-xs">
            <img
              src="/assets/aistudio/IMG-20250913-WA0211_74ca8a90.jpg"
              alt="Logo Sahabat Puyuh Hataswa"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Sahabat Puyuh Hataswa
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sistem Manajemen &amp; Analisis Keuangan Peternakan Puyuh Modern
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
          <div className="text-center pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Masuk ke Sistem Farm</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih peran akun Anda untuk mengamankan data kandang &amp; finansial
            </p>
          </div>

          {/* Role Segmented Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl my-5">
            <button
              type="button"
              onClick={() => handleRoleTabSelect('owner')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                selectedRole === 'owner'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Pemilik Farm</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabSelect('staff')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                selectedRole === 'staff'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4 text-emerald-600" />
              <span>Petugas Kandang</span>
            </button>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Username / Akun
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username..."
                  required
                  autoComplete="username"
                  className="w-full pl-3.5 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-900 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-semibold">
                  Password
                </label>
                <span className="text-[11px] text-slate-400 font-normal">
                  Karakter tersembunyi
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda..."
                  required
                  autoComplete="current-password"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-900 tracking-wider font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition p-1"
                  title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md ${
                selectedRole === 'owner'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              } disabled:opacity-50 cursor-pointer`}
            >
              <Lock className="w-4 h-4" />
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Sistem'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security & Access Protection Notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/80 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 rounded-b-3xl text-[11px] text-slate-500">
            <div className="flex items-center gap-2 text-slate-700 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Keamanan Sistem Farm Terjaga:</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Password tersimpan aman dan <b>tidak ditampilkan</b> di layar login untuk melindungi data operasional &amp; finansial farm.
            </p>
            <p className="text-[10px] text-slate-400 mt-2 italic">
              *Password masing-masing akun dapat diubah sewaktu-waktu di menu profil atas setelah berhasil login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
