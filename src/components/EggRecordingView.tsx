import React, { useState } from 'react';
import { EggRecord, UserRole } from '../types/quail';
import { formatNumber, formatDecimal } from '../utils/calculations';
import {
  Plus,
  Search,
  Download,
  Trash2,
  Egg,
  CheckCircle2,
  Pencil,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

interface EggRecordingViewProps {
  records: EggRecord[];
  currentRole: UserRole;
  onOpenModal: (type: 'egg') => void;
  onOpenVoiceModal?: () => void;
  onDeleteRecord: (id: string) => void;
  onEditRecord?: (record: EggRecord) => void;
  onNavigateToSales?: () => void;
}

export const EggRecordingView: React.FC<EggRecordingViewProps> = ({
  records,
  currentRole,
  onOpenModal,
  onOpenVoiceModal,
  onDeleteRecord,
  onEditRecord,
  onNavigateToSales,
}) => {
  const isOwner = currentRole === 'owner';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKandang, setSelectedKandang] = useState('Semua');

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.date.includes(searchTerm) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesKandang = selectedKandang === 'Semua' || r.kandang.includes(selectedKandang);
    return matchesSearch && matchesKandang;
  });

  const totalKg = records.reduce((s, r) => s + r.totalWeightKg, 0);
  const totalGoodPcs = records.reduce((s, r) => s + r.goodEggsPcs, 0);
  const totalBrokenPcs = records.reduce((s, r) => s + r.brokenEggsPcs, 0);
  const totalAllPcs = totalGoodPcs + totalBrokenPcs;
  const brokenPercent = totalAllPcs > 0
    ? ((totalBrokenPcs / totalAllPcs) * 100).toFixed(2)
    : '0';
  const overallAvgWeight = totalAllPcs > 0
    ? ((totalKg * 1000) / totalAllPcs).toFixed(1)
    : '0';

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Tanggal',
      'Waktu_Panen',
      'Kandang',
      'Butir_Utuh',
      'Butir_Retak',
      'Total_Kg',
      'Rata_Rata_Gram_Butir',
      'Catatan',
    ];
    const rows = filteredRecords.map((r) => {
      const totalPcs = r.goodEggsPcs + r.brokenEggsPcs;
      const avgG = totalPcs > 0 ? ((r.totalWeightKg * 1000) / totalPcs).toFixed(1) : '0';
      return [
        r.id,
        r.date,
        r.timeOfDay,
        `"${r.kandang}"`,
        r.goodEggsPcs,
        r.brokenEggsPcs,
        r.totalWeightKg,
        avgG,
        `"${r.notes || ''}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `panen_harian_telur_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Notice Separating Egg Sales from Daily Harvest */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
            <Egg className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-amber-950">
              Pencatatan Khusus Panen Harian Telur (Produksi Kandang)
            </p>
            <p className="text-[11px] text-amber-800">
              Form ini murni untuk kuantitas panen, butir utuh/retak, dan timbangan. Untuk transaksi ke pembeli/agen, gunakan menu khusus Penjualan Telur.
            </p>
          </div>
        </div>
        {onNavigateToSales && (
          <button
            onClick={onNavigateToSales}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-xs transition self-start sm:self-center flex-shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Ke Penjualan Telur</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Top Header Card with Fresh Quail Eggs Photo */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between">
        <div className="p-6 max-w-xl z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
            <Egg className="w-4 h-4" />
            <span>Manajemen Hasil Produksi Harian</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pencatatan Panen Harian Telur Puyuh
          </h1>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Pencatatan harian butir utuh (Grade A), retak/rusak, total timbangan (kg), serta kalkulasi persentase retak dan rata-rata gram per butir.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenModal('egg')}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Input Panen Baru</span>
            </button>
            {onOpenVoiceModal && (
              <button
                onClick={onOpenVoiceModal}
                className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <span>🎤 Catat via Suara (VN)</span>
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Panen</span>
            </button>
          </div>
        </div>

        <div className="w-full md:w-72 h-44 md:h-full relative overflow-hidden flex-shrink-0">
          <img
            src="/images/fresh_quail_eggs_1792556185971.jpg"
            alt="Telur Puyuh Segar Sahabat Puyuh Hataswa"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-white/20 to-transparent" />
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Panen (Kg)</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatNumber(totalKg, 1)} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <span className="text-[11px] text-slate-500">Kumulatif seluruh pencatatan</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Butir Panen</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatNumber(totalAllPcs)}
          </div>
          <span className="text-[11px] text-slate-500">Utuh: {formatNumber(totalGoodPcs)} butir</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Tingkat Kerusakan (Retak)</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {brokenPercent}%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Bagus (Target &lt; 1.5%)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Rata-rata Bobot/Butir</span>
          <div className="text-xl md:text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {overallAvgWeight} <span className="text-xs font-normal text-slate-500">gram</span>
          </div>
          <span className="text-[11px] text-slate-500">Standar: 10,0 – 12,0 g</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tanggal, catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500">Filter Kandang:</span>
            <select
              value={selectedKandang}
              onChange={(e) => setSelectedKandang(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            >
              <option value="Semua">Semua Kandang</option>
              <option value="Kandang Petelur (A & B)">Kandang Petelur (A &amp; B)</option>
              <option value="Kandang A (Barat)">Kandang A (Barat)</option>
              <option value="Kandang B (Tengah)">Kandang B (Tengah)</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Waktu Panen</th>
                <th className="py-3 px-4">Kandang</th>
                <th className="py-3 px-4 text-right">Butir Utuh (Grade A)</th>
                <th className="py-3 px-4 text-right">Retak / Pecah</th>
                <th className="py-3 px-4 text-right">Total Berat (Kg)</th>
                <th className="py-3 px-4 text-right">Bobot/Butir</th>
                <th className="py-3 px-4 text-center">% Retak</th>
                <th className="py-3 px-4">Catatan Kondisi</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => {
                  const totalPcs = r.goodEggsPcs + r.brokenEggsPcs;
                  const avgWeight = totalPcs > 0 ? ((r.totalWeightKg * 1000) / totalPcs).toFixed(1) : '0';
                  const rowBrokenRate = totalPcs > 0 ? ((r.brokenEggsPcs / totalPcs) * 100).toFixed(1) : '0';

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-800">{r.date}</td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {r.timeOfDay}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{r.kandang}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-800 font-bold">
                        {formatNumber(r.goodEggsPcs)}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-rose-600 font-medium">
                        {r.brokenEggsPcs > 0 ? `+${r.brokenEggsPcs}` : '0'}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-extrabold text-slate-900">
                        {formatDecimal(r.totalWeightKg)} kg
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-700 font-medium">
                        {avgWeight} g
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            Number(rowBrokenRate) <= 1.5
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {rowBrokenRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]">
                        {r.notes || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {onEditRecord && (
                            <button
                              onClick={() => onEditRecord(r)}
                              className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition"
                              title="Edit Catatan Panen Ini"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteRecord(r.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                            title="Hapus Data Panen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Tidak ada catatan panen yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Showcase: Standar Mutu Telur Hataswa */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">
              Dokumentasi Panen &amp; Standar Kualitas Telur Sahabat Puyuh Hataswa
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Grade A Berkualitas</span>
          </span>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          {/* Main Harvest Image: Fresh quail eggs on crates in coop */}
          <div className="space-y-2">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-video group">
              <img
                src="/images/quail_egg_harvest_farm_1792593478247.jpg"
                alt="Hasil Panen Telur Puyuh di Rak Tray Kandang Sahabat Puyuh Hataswa"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                <div className="text-white">
                  <p className="font-bold text-sm text-amber-300">Panen Telur Puyuh Segar di Rak Tray</p>
                  <p className="text-[11px] text-slate-200">Hasil panen harian puyuh petelur (Coturnix japonica) bersih dan teratur.</p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              *Foto panen telur puyuh langsung di atas baki rak sortir kandang Sahabat Puyuh Hataswa.
            </p>
          </div>

          {/* Secondary Details & Close-up table photo */}
          <div className="space-y-3.5">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm aspect-[16/9] group">
              <img
                src="/images/fresh_quail_eggs_1792556185971.jpg"
                alt="Telur Puyuh Bercak Khas Siap Konsumsi"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                <div className="text-white">
                  <p className="font-bold text-sm text-amber-300">Telur Puyuh Bercak Khas Grade Konsumsi</p>
                  <p className="text-[11px] text-slate-200">Kulit cangkang tebal, bercak alami sempurna, bobot ideal 10-12 gram.</p>
                </div>
              </div>
            </div>

            {/* Standard quality checklist */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs">
              <p className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Standar Mutu Panen Telur Hataswa:</span>
              </p>
              <ul className="space-y-1 text-[11px] text-amber-900 list-disc list-inside">
                <li><b>Bobot Ideal:</b> 10,0 – 12,0 gram/butir (~83 – 95 butir per 1 Kilogram).</li>
                <li><b>Pemisahan Retak:</b> Telur retak/pecah segera dipisahkan agar tidak mencemari tray lain (target retak &lt; 1,5%).</li>
                <li><b>Penyimpanan Dingin:</b> Disimpan di tempat sejuk terlindung dari sinar matahari langsung untuk menjaga kesegaran hingga 30 hari.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
