import React, { useState } from 'react';
import { FeedRecord, UserRole } from '../types/quail';
import { formatRupiah, formatNumber, formatDecimal } from '../utils/calculations';
import { Plus, Search, Download, Trash2, Wheat, Calculator } from 'lucide-react';

interface FeedRecordingViewProps {
  records: FeedRecord[];
  currentRole: UserRole;
  onOpenModal: (type: 'feed') => void;
  onDeleteRecord: (id: string) => void;
  activeLayerPopulation: number;
  activeGrowerPopulation: number;
}

export const FeedRecordingView: React.FC<FeedRecordingViewProps> = ({
  records,
  currentRole,
  onOpenModal,
  onDeleteRecord,
  activeLayerPopulation,
  activeGrowerPopulation,
}) => {
  const isOwner = currentRole === 'owner';
  const [searchTerm, setSearchTerm] = useState('');
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<'Semua' | 'Pakan Petelur (Layer)' | 'Pakan Pembesaran (Starter/Grower)'>('Semua');

  // Simulator state
  const [simFeedKg, setSimFeedKg] = useState<number>(115);
  const [simEggKg, setSimEggKg] = useState<number>(45);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.date.includes(searchTerm) ||
      r.feedBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.feedType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = feedCategoryFilter === 'Semua' || r.feedCategory === feedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Layer Feeds vs Grower Feeds
  const layerFeeds = records.filter((r) => r.feedCategory === 'Pakan Petelur (Layer)');
  const growerFeeds = records.filter((r) => r.feedCategory === 'Pakan Pembesaran (Starter/Grower)');

  const totalLayerKg = layerFeeds.reduce((s, r) => s + r.quantityKg, 0);
  const totalLayerCost = layerFeeds.reduce((s, r) => s + r.totalCost, 0);

  const totalGrowerKg = growerFeeds.reduce((s, r) => s + r.quantityKg, 0);
  const totalGrowerCost = growerFeeds.reduce((s, r) => s + r.totalCost, 0);

  const totalCombinedKg = totalLayerKg + totalGrowerKg;
  const totalCombinedCost = totalLayerCost + totalGrowerCost;

  const avgLayerGramPerBird = activeLayerPopulation > 0 && layerFeeds.length > 0
    ? (((totalLayerKg / layerFeeds.length) * 1000) / activeLayerPopulation).toFixed(1)
    : '0';

  const avgGrowerGramPerBird = activeGrowerPopulation > 0 && growerFeeds.length > 0
    ? (((totalGrowerKg / growerFeeds.length) * 1000) / activeGrowerPopulation).toFixed(1)
    : '0';

  const simulatedFcr = simEggKg > 0 ? (simFeedKg / simEggKg).toFixed(2) : '0';

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Tanggal',
      'Kategori Pakan',
      'Merek Ransum',
      'Jenis Ransum',
      'Kuantitas (Kg)',
      'Jumlah Karung',
      'Harga/Kg',
      'Total Biaya',
      'Peruntukan Kandang',
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.date,
      r.feedCategory,
      r.feedBrand,
      r.feedType,
      r.quantityKg,
      r.sackCount,
      r.pricePerKg,
      r.totalCost,
      r.targetFlock,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `logistik_pakan_terpisah_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            <Wheat className="w-4 h-4" />
            <span>Manajemen Ransum Khusus Terpisah</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pakan Petelur vs Pakan Pembesaran (Grower)
          </h1>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-2xl">
            Pemisahan alokasi pakan antara <b>Ransum Layer</b> (fokus produksi telur &amp; FCR) dan <b>Ransum Pembesaran</b> (starter/grower protein tinggi untuk pertumbuhan bibit puyuh).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenModal('feed')}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Pakan Baru</span>
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

      {/* KPI Cards: Separated by Feed Category */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Pakan Layer */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Pakan Petelur (Layer)</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800 text-[10px]">Produksi</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatNumber(totalLayerKg, 1)} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {avgLayerGramPerBird} g/ekor/hari (Standar: 22-25g)
          </span>
        </div>

        {/* 2. Pakan Pembesaran */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Pakan Pembesaran</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 text-[10px]">Starter/DOQ</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-blue-700 mt-1 tabular-nums">
            {formatNumber(totalGrowerKg, 1)} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {avgGrowerGramPerBird} g/ekor/hari (Pertumbuhan)
          </span>
        </div>

        {/* 3. Total Biaya Pakan Layer */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Biaya Pakan Petelur</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {isOwner ? formatRupiah(totalLayerCost) : '*** (Pemilik)'}
          </div>
          <span className="text-[11px] text-slate-500">HPP Produksi Telur</span>
        </div>

        {/* 4. Total Biaya Pakan Pembesaran */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Biaya Pakan Pembesaran</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {isOwner ? formatRupiah(totalGrowerCost) : '*** (Pemilik)'}
          </div>
          <span className="text-[11px] text-slate-500">Investasi Bibit &amp; Pullet</span>
        </div>
      </div>

      {/* Interactive FCR Simulator Widget for Layer Feed */}
      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 rounded-2xl p-5 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-900">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Calculator className="w-4 h-4" />
              <span>Simulasi Interaktif FCR Pakan Layer (Hanya Pakan Kandang Bertelur)</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              FCR akurat hanya menghitung pakan yang dikonsumsi oleh puyuh petelur dewasa dibagi total bobot panen telur (kg).
            </p>
          </div>
          <div className="bg-emerald-900/60 px-4 py-2 rounded-xl border border-emerald-700/50 text-right">
            <span className="text-[10px] text-emerald-300 block uppercase font-bold tracking-wider">Hasil FCR Telur</span>
            <span className="text-2xl font-black text-amber-400 tabular-nums">{simulatedFcr}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Konsumsi Pakan Layer Harian: <b className="text-white tabular-nums">{simFeedKg} kg</b>
            </label>
            <input
              type="range"
              min={90}
              max={150}
              step={1}
              value={simFeedKg}
              onChange={(e) => setSimFeedKg(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Hasil Panen Telur: <b className="text-white tabular-nums">{simEggKg} kg</b>
            </label>
            <input
              type="range"
              min={30}
              max={65}
              step={1}
              value={simEggKg}
              onChange={(e) => setSimEggKg(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Segmented Filter & Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Segmented control for feed category */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setFeedCategoryFilter('Semua')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                feedCategoryFilter === 'Semua' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Jenis Pakan
            </button>
            <button
              onClick={() => setFeedCategoryFilter('Pakan Petelur (Layer)')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                feedCategoryFilter === 'Pakan Petelur (Layer)' ? 'bg-white text-amber-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pakan Petelur (Layer)
            </button>
            <button
              onClick={() => setFeedCategoryFilter('Pakan Pembesaran (Starter/Grower)')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                feedCategoryFilter === 'Pakan Pembesaran (Starter/Grower)' ? 'bg-white text-blue-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pakan Pembesaran (Grower)
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari merek, tanggal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Kategori Ransum</th>
                <th className="py-3 px-4">Merek Pakan</th>
                <th className="py-3 px-4">Jenis Formula</th>
                <th className="py-3 px-4 text-right">Kuantitas</th>
                <th className="py-3 px-4 text-right">Karung</th>
                <th className="py-3 px-4 text-right">Harga/Kg</th>
                <th className="py-3 px-4 text-right">Total Biaya</th>
                <th className="py-3 px-4">Peruntukan</th>
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
                        r.feedCategory === 'Pakan Petelur (Layer)'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {r.feedCategory}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">{r.feedBrand}</td>
                    <td className="py-3 px-4 text-slate-600">{r.feedType}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-900">{formatDecimal(r.quantityKg)} kg</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600">{r.sackCount}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600">
                      {isOwner ? formatRupiah(r.pricePerKg) : '***'}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-800">
                      {isOwner ? formatRupiah(r.totalCost) : '***'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{r.targetFlock}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteRecord(r.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Tidak ada catatan pakan yang sesuai filter.
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
