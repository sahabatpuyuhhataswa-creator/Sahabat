import React, { useState } from 'react';
import { PopulationRecord, UserRole } from '../types/quail';
import { formatRupiah, formatNumber } from '../utils/calculations';
import { Plus, Search, Download, Trash2, Activity, ArrowRightLeft, Bird, ShieldCheck } from 'lucide-react';

interface PopulationRecordingViewProps {
  records: PopulationRecord[];
  currentRole: UserRole;
  onOpenModal: (type: 'population') => void;
  onDeleteRecord: (id: string) => void;
}

export const PopulationRecordingView: React.FC<PopulationRecordingViewProps> = ({
  records,
  currentRole,
  onOpenModal,
  onDeleteRecord,
}) => {
  const isOwner = currentRole === 'owner';
  const [searchTerm, setSearchTerm] = useState('');
  const [flockFilter, setFlockFilter] = useState<'Semua' | 'Layer (Petelur)' | 'Pembesaran (Starter/Grower)'>('Semua');

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.date.includes(searchTerm) ||
      (r.batchName && r.batchName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.mortalityReason && r.mortalityReason.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFlock = flockFilter === 'Semua' || r.flockType === flockFilter;
    return matchesSearch && matchesFlock;
  });

  // Latest active numbers by category
  const layerRecords = records.filter((r) => r.flockType === 'Layer (Petelur)');
  const growerRecords = records.filter((r) => r.flockType === 'Pembesaran (Starter/Grower)');

  const latestLayer = layerRecords[0] || { startingCount: 5000, activeCount: 5000 };
  const latestGrower = growerRecords[0] || { startingCount: 1500, activeCount: 1450 };

  const totalMortality = records.reduce((s, r) => s + r.mortalityCount, 0);
  const totalLayerMortality = layerRecords.reduce((s, r) => s + r.mortalityCount, 0);
  const totalGrowerMortality = growerRecords.reduce((s, r) => s + r.mortalityCount, 0);
  const totalCulled = records.reduce((s, r) => s + r.culledCount, 0);
  const totalCullRevenue = records.reduce((s, r) => s + (r.cullRevenue || 0), 0);

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Tanggal',
      'Kategori Kandang',
      'Batch / Kawanan',
      'Populasi Awal',
      'Kematian (Ekor)',
      'Afkir (Ekor)',
      'Mutasi Masuk/Baru',
      'Mutasi Keluar ke Layer',
      'Populasi Akhir',
      'Umur (Hari)',
      'Penyebab Kematian',
      'Omzet Afkir',
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.date,
      r.flockType,
      r.batchName || '-',
      r.startingCount,
      r.mortalityCount,
      r.culledCount,
      r.additionsCount,
      r.transferredCount || 0,
      r.activeCount,
      r.ageDays || '-',
      r.mortalityReason || '-',
      r.cullRevenue || 0,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sensus_populasi_puyuh_hataswa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-1">
            <Activity className="w-4 h-4" />
            <span>Sensus &amp; Manajemen Populasi Terpisah</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Populasi Petelur vs Pembesaran (Grower)
          </h1>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-2xl">
            Pemisahan sensus populasi awal &amp; aktif antara <b>Kandang Petelur Produktif</b> dan <b>Kandang Pembesaran (Brooding/Grower)</b>, mutasi pullet siap telur, serta rekap kematian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenModal('population')}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Sensus / Mutasi</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Separated by Layer vs Grower */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Populasi Petelur (Layer) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Populasi Petelur (Layer)</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 text-[10px]">Produktif</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatNumber(latestLayer.activeCount)} <span className="text-xs font-normal text-slate-500">ekor</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Populasi awal: {formatNumber(latestLayer.startingCount)} ekor
          </span>
        </div>

        {/* 2. Populasi Pembesaran (Grower/Starter) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Populasi Pembesaran</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 text-[10px]">Grower/DOQ</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-blue-700 mt-1 tabular-nums">
            {formatNumber(latestGrower.activeCount)} <span className="text-xs font-normal text-slate-500">ekor</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Populasi awal: {formatNumber(latestGrower.startingCount)} ekor
          </span>
        </div>

        {/* 3. Total Populasi Farm */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Seluruh Burung Farm</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatNumber(latestLayer.activeCount + latestGrower.activeCount)} <span className="text-xs font-normal text-slate-500">ekor</span>
          </div>
          <span className="text-[11px] text-slate-500">Kapasitas total farm: 6.500 ekor</span>
        </div>

        {/* 4. Total Mortalitas Terpisah */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Kematian Kumulatif</span>
          <div className="text-xl md:text-2xl font-bold text-rose-600 mt-1 tabular-nums">
            {totalMortality} <span className="text-xs font-normal text-slate-500">ekor</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Layer: {totalLayerMortality} ekor · Pembesaran: {totalGrowerMortality} ekor
          </span>
        </div>
      </div>

      {/* Segmented Filter & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Segmented control for flock */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setFlockFilter('Semua')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                flockFilter === 'Semua' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Kandang
            </button>
            <button
              onClick={() => setFlockFilter('Layer (Petelur)')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                flockFilter === 'Layer (Petelur)' ? 'bg-white text-amber-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kandang Petelur (Layer)
            </button>
            <button
              onClick={() => setFlockFilter('Pembesaran (Starter/Grower)')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                flockFilter === 'Pembesaran (Starter/Grower)' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kandang Pembesaran (Grower)
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tanggal, batch, catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Kategori Kawanan</th>
                <th className="py-3 px-4">Batch / Kandang</th>
                <th className="py-3 px-4 text-right">Populasi Awal</th>
                <th className="py-3 px-4 text-right">Mati (Ekor)</th>
                <th className="py-3 px-4 text-right">Afkir/Dijual</th>
                <th className="py-3 px-4 text-right">Mutasi / Masuk</th>
                <th className="py-3 px-4 text-right">Populasi Akhir</th>
                <th className="py-3 px-4 text-center">Umur</th>
                <th className="py-3 px-4">Keterangan / Alasan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">{r.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        r.flockType === 'Layer (Petelur)'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {r.flockType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {r.batchName || r.kandang}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600 font-medium">
                      {formatNumber(r.startingCount)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-rose-600">
                      {r.mortalityCount > 0 ? `-${r.mortalityCount}` : '0'}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-amber-600">
                      {r.culledCount > 0 ? `-${r.culledCount}` : '0'}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold text-emerald-600">
                      {r.additionsCount > 0 ? `+${r.additionsCount}` : r.transferredCount ? `-${r.transferredCount} (Lulus)` : '0'}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-extrabold text-slate-900">
                      {formatNumber(r.activeCount)}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 tabular-nums">
                      {r.ageDays ? `${r.ageDays} hr` : '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate">
                      {r.mortalityReason || r.notes || 'Kondisi sehat & aktif'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteRecord(r.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    Tidak ada catatan sensus yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
