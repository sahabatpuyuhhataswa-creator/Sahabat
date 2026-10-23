import React, { useState, useEffect } from 'react';
import { FarmConfig } from '../types/quail';
import { Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [config, setConfig] = useState<FarmConfig>(() => {
    const saved = localStorage.getItem('sph_farm_config');
    return saved ? JSON.parse(saved) : {
      farmName: 'Sahabat Puyuh Hataswa',
      address: '',
      phone: '',
      website: '',
      email: '',
      bankName: '',
      accountNumber: '',
      accountHolderName: ''
    };
  });

  useEffect(() => {
    localStorage.setItem('sph_farm_config', JSON.stringify(config));
  }, [config]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Pengaturan Faktur & Profil Farm</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farm Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800">Informasi Farm</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Farm</label>
            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={config.farmName} onChange={(e) => setConfig({...config, farmName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Alamat Resmi</label>
            <textarea className="w-full p-2 border border-slate-200 rounded-lg text-sm" rows={3} value={config.address} onChange={(e) => setConfig({...config, address: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Telepon/WA</label>
            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={config.phone} onChange={(e) => setConfig({...config, phone: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Website/Email</label>
            <div className="flex gap-2">
                <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={config.website} onChange={(e) => setConfig({...config, website: e.target.value})} />
                <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={config.email} onChange={(e) => setConfig({...config, email: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Bank Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800">Informasi Rekening Bank</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Bank</label>
            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={config.bankName} onChange={(e) => setConfig({...config, bankName: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nomor Rekening</label>
            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={config.accountNumber} onChange={(e) => setConfig({...config, accountNumber: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Atas Nama</label>
            <input type="text" className="w-full p-2 border border-slate-200 rounded-lg text-sm" value={config.accountHolderName} onChange={(e) => setConfig({...config, accountHolderName: e.target.value})} />
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-xs hover:bg-emerald-500 transition">
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
        </button>
      </div>
    </div>
  );
};
