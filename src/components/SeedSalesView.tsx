import React, { useState } from 'react';
import { QuailSeedSaleRecord, UserRole } from '../types/quail';
import { formatRupiah, formatNumber } from '../utils/calculations';
import { Plus, Search, Download, Trash2, Bird, DollarSign, PackageCheck } from 'lucide-react';

interface SeedSalesViewProps {
  records: QuailSeedSaleRecord[];
  currentRole: UserRole;
  onOpenModal: () => void;
  onDeleteRecord: (id: string) => void;
  onOpenInvoiceModal?: (sale?: QuailSeedSaleRecord) => void;
}

export const SeedSalesView: React.FC<SeedSalesViewProps> = ({
  records,
  currentRole,
  onOpenModal,
  onDeleteRecord,
  onOpenInvoiceModal,
}) => {
  const isOwner = currentRole === 'owner';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Semua');

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.date.includes(searchTerm) ||
      (r.destinationCity && r.destinationCity.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'Semua' || r.seedType === selectedType;
    return matchesSearch && matchesType;
  });

  const totalBirdsSold = records.reduce((s, r) => s + r.quantityBirds, 0);
  const totalRevenue = records.reduce((s, r) => s + r.totalRevenue, 0);

  // Breakdown by type
  const doqRecords = records.filter((r) => r.seedType.includes('DOQ'));
  const doqBirds = doqRecords.reduce((s, r) => s + r.quantityBirds, 0);
  const doqRevenue = doqRecords.reduce((s, r) => s + r.totalRevenue, 0);

  const pulletRecords = records.filter((r) => r.seedType.includes('Pullet'));
  const pulletBirds = pulletRecords.reduce((s, r) => s + r.quantityBirds, 0);
  const pulletRevenue = pulletRecords.reduce((s, r) => s + r.totalRevenue, 0);

  const handleExportCSV = () => {
    const headers = ['ID', 'Tanggal', 'Jenis Bibit', 'Jumlah (Ekor)', 'Boks', 'Harga/Ekor', 'Total Omzet', 'Pembeli', 'Kota Tujuan', 'Status'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.date,
      r.seedType,
      r.quantityBirds,
      r.boxCount,
      r.pricePerBird,
      r.totalRevenue,
      r.buyerName,
      r.destinationCity || '-',
      r.paymentStatus,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `penjualan_bibit_puyuh_hataswa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
            <Bird className="w-4 h-4" />
            <span>Unit Penetasan &amp; Pembibitan Puyuh</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Penjualan Bibit Puyuh (DOQ &amp; Pullet Siap Telur)
          </h1>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-2xl">
            Pencatatan distribusi bibit puyuh umur sehari (DOQ 1-3 hari), bibit remaja (grower), dan pullet betina siap bertelur (umur 30-35 hari) untuk peternak mitra.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Penjualan Bibit</span>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Bibit Terdistribusi</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatNumber(totalBirdsSold)} <span className="text-xs font-normal text-slate-500">ekor</span>
          </div>
          <span className="text-[11px] text-slate-500">DOQ + Grower + Pullet</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Penjualan DOQ (1-3 Hari)</span>
          <div className="text-xl md:text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {formatNumber(doqBirds)} <span className="text-xs font-normal text-slate-500">ekor</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {isOwner ? formatRupiah(doqRevenue) : 'Omzet Terproteksi'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Penjualan Pullet Siap Telur</span>
          <div className="text-xl md:text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            {formatNumber(pulletBirds)} <span className="text-xs font-normal text-slate-500">ekor</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {isOwner ? formatRupiah(pulletRevenue) : 'Omzet Terproteksi'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Omzet Penjualan Bibit</span>
          <div className="text-xl md:text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            {isOwner ? formatRupiah(totalRevenue) : '*** (Khusus Pemilik)'}
          </div>
          <span className="text-[11px] text-slate-500">Kontribusi laba pembibitan</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pembeli, kota, catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500">Kategori Bibit:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="DOQ (Day-Old Quail 1-3 Hari)">DOQ (1-3 Hari)</option>
              <option value="Grower Remaja (Umur 2-3 Minggu)">Grower Remaja</option>
              <option value="Pullet Siap Telur (Umur 30-35 Hari)">Pullet Siap Telur</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Jenis Bibit</th>
                <th className="py-3 px-4 text-right">Kuantitas</th>
                <th className="py-3 px-4 text-right">Kemasan Boks</th>
                <th className="py-3 px-4 text-right">Harga/Ekor</th>
                <th className="py-3 px-4 text-right">Total Nilai</th>
                <th className="py-3 px-4">Nama Pembeli</th>
                <th className="py-3 px-4">Kota Tujuan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
                <th className="py-3 px-4 text-center">Faktur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">{r.date}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        r.seedType.includes('DOQ')
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : r.seedType.includes('Pullet')
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {r.seedType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-900">
                      {formatNumber(r.quantityBirds)} ekor
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600">
                      {r.boxCount} boks
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-600">
                      {isOwner ? formatRupiah(r.pricePerBird) : '***'}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-emerald-600">
                      {isOwner ? formatRupiah(r.totalRevenue) : '***'}
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{r.buyerName}</td>
                    <td className="py-3 px-4 text-slate-500">{r.destinationCity || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {r.paymentStatus}
                      </span>
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
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onOpenInvoiceModal?.(r)}
                        className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition font-bold text-[11px]"
                        title="Buat Faktur"
                      >
                        📄 Faktur
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Tidak ada catatan penjualan bibit yang sesuai.
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
