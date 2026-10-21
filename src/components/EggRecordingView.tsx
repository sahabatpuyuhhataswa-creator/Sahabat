import React, { useState } from 'react';
import { EggRecord, UserRole } from '../types/quail';
import { formatRupiah, formatNumber } from '../utils/calculations';
import { Plus, Search, Download, Trash2, Egg, CheckCircle2 } from 'lucide-react';

interface EggRecordingViewProps {
  records: EggRecord[];
  currentRole: UserRole;
  onOpenModal: (type: 'egg') => void;
  onDeleteRecord: (id: string) => void;
}

export const EggRecordingView: React.FC<EggRecordingViewProps> = ({
  records,
  currentRole,
  onOpenModal,
  onDeleteRecord,
}) => {
  const isOwner = currentRole === 'owner';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKandang, setSelectedKandang] = useState('Semua');

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.date.includes(searchTerm) ||
      (r.buyerName && r.buyerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesKandang = selectedKandang === 'Semua' || r.kandang.includes(selectedKandang);
    return matchesSearch && matchesKandang;
  });

  const totalKg = records.reduce((s, r) => s + r.totalWeightKg, 0);
  const totalGoodPcs = records.reduce((s, r) => s + r.goodEggsPcs, 0);
  const totalBrokenPcs = records.reduce((s, r) => s + r.brokenEggsPcs, 0);
  const totalRevenue = records.reduce((s, r) => s + r.revenue, 0);
  const brokenPercent = totalGoodPcs + totalBrokenPcs > 0
    ? ((totalBrokenPcs / (totalGoodPcs + totalBrokenPcs)) * 100).toFixed(2)
    : '0';

  const handleExportCSV = () => {
    const headers = ['ID', 'Tanggal', 'Waktu', 'Kandang', 'Butir Utuh', 'Butir Retak', 'Total Kg', 'Harga/Kg', 'Pendapatan', 'Pembeli', 'Status'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.date,
      r.timeOfDay,
      r.kandang,
      r.goodEggsPcs,
      r.brokenEggsPcs,
      r.totalWeightKg,
      r.sellingPricePerKg,
      r.revenue,
      r.buyerName || '-',
      r.paymentStatus,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `panen_telur_sahabat_puyuh_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card with Fresh Quail Eggs Photo */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between">
        <div className="p-6 max-w-xl z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
            <Egg className="w-4 h-4" />
            <span>Manajemen Hasil Produksi</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pencatatan Panen &amp; Penjualan Telur Puyuh
          </h1>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Pencatatan harian butir utuh, retak, total timbangan (kg), serta kalkulasi rata-rata bobot dan harga jual pasar.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenModal('egg')}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Input Panen Baru</span>
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

        <div className="w-full md:w-72 h-44 md:h-full relative overflow-hidden flex-shrink-0">
          <img
            src="/src/assets/images/fresh_quail_eggs_1792556185971.jpg"
            alt="Telur Puyuh Segar Sahabat Puyuh Hataswa"
            referrerPolicy="no-referrer"
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
          <span className="text-xs font-semibold text-slate-500">Total Butir Telur</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatNumber(totalGoodPcs + totalBrokenPcs)}
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
          <span className="text-xs font-semibold text-slate-500">Total Nilai Penjualan</span>
          <div className="text-xl md:text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            {isOwner ? formatRupiah(totalRevenue) : '*** (Pemilik)'}
          </div>
          <span className="text-[11px] text-slate-500">Rata-rata Rp 33.000 / kg</span>
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
              placeholder="Cari tanggal, pembeli, catatan..."
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
              <option value="Kandang A">Kandang A</option>
              <option value="Kandang B">Kandang B</option>
              <option value="Kandang C">Kandang C</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Kandang</th>
                <th className="py-3 px-4 text-right">Butir Utuh</th>
                <th className="py-3 px-4 text-right">Retak</th>
                <th className="py-3 px-4 text-right">Total (Kg)</th>
                <th className="py-3 px-4 text-right">Bobot/Butir</th>
                <th className="py-3 px-4 text-right">Harga/Kg</th>
                <th className="py-3 px-4 text-right">Omzet</th>
                <th className="py-3 px-4">Pembeli / Agen</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => {
                  const totalPcs = r.goodEggsPcs + r.brokenEggsPcs;
                  const avgWeight = totalPcs > 0 ? ((r.totalWeightKg * 1000) / totalPcs).toFixed(1) : 0;

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-800">{r.date}</td>
                      <td className="py-3 px-4 text-slate-500">{r.timeOfDay}</td>
                      <td className="py-3 px-4 text-slate-600">{r.kandang}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-800 font-medium">
                        {formatNumber(r.goodEggsPcs)}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-rose-600">
                        {r.brokenEggsPcs}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-900">
                        {r.totalWeightKg} kg
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-600">
                        {avgWeight} g
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-600">
                        {isOwner ? formatRupiah(r.sellingPricePerKg) : '***'}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-emerald-600">
                        {isOwner ? formatRupiah(r.revenue) : '***'}
                      </td>
                      <td className="py-3 px-4 text-slate-700 truncate max-w-[150px]">
                        {r.buyerName || '-'}
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    Tidak ada catatan panen yang sesuai filter.
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
