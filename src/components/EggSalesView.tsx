import React, { useState } from 'react';
import { EggSaleRecord, UserRole } from '../types/quail';
import { formatRupiah, formatNumber, formatDecimal } from '../utils/calculations';
import {
  Plus,
  Search,
  Download,
  Trash2,
  Pencil,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  Clock,
  Egg,
  TrendingUp,
  AlertCircle,
  PackageCheck,
  Building2,
  ArrowRight,
} from 'lucide-react';

interface EggSalesViewProps {
  records: EggSaleRecord[];
  currentRole: UserRole;
  eggStockKg?: number;
  totalHarvestKg?: number;
  onOpenModal: (type: 'eggSale') => void;
  onDeleteRecord: (id: string) => void;
  onEditRecord?: (record: EggSaleRecord) => void;
  onNavigateToHarvest?: () => void;
}

export const EggSalesView: React.FC<EggSalesViewProps> = ({
  records,
  currentRole,
  eggStockKg = 0,
  totalHarvestKg = 0,
  onOpenModal,
  onDeleteRecord,
  onEditRecord,
  onNavigateToHarvest,
}) => {
  const isOwner = currentRole === 'owner';
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('Semua');
  const [paymentFilter, setPaymentFilter] = useState('Semua');

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.date.includes(searchTerm) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGrade = gradeFilter === 'Semua' || r.eggGrade.includes(gradeFilter);
    const matchesPayment = paymentFilter === 'Semua' || r.paymentStatus === paymentFilter;

    return matchesSearch && matchesGrade && matchesPayment;
  });

  const totalSoldKg = records.reduce((s, r) => s + r.quantityKg, 0);
  const totalSoldPcs = records.reduce((s, r) => s + (r.quantityPcs || r.quantityKg * 90), 0);
  const totalRevenue = records.reduce((s, r) => s + r.totalRevenue, 0);

  const totalPiutang = records
    .filter((r) => r.paymentStatus === 'Piutang')
    .reduce((s, r) => s + r.totalRevenue, 0);

  const totalLunas = records
    .filter((r) => r.paymentStatus === 'Lunas')
    .reduce((s, r) => s + r.totalRevenue, 0);

  const avgPricePerKg = totalSoldKg > 0 ? Math.round(totalRevenue / totalSoldKg) : 0;

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Tanggal',
      'Pembeli',
      'Tipe_Pelanggan',
      'Grade_Telur',
      'Jumlah_Kg',
      'Jumlah_Butir',
      'Jumlah_Tray',
      'Harga_Per_Kg',
      'Total_Nilai_Rp',
      'Metode_Bayar',
      'Status_Bayar',
      'Jatuh_Tempo',
      'Catatan',
    ];

    const rows = filteredRecords.map((r) => [
      r.id,
      r.date,
      `"${r.buyerName}"`,
      r.customerType || '-',
      `"${r.eggGrade}"`,
      r.quantityKg,
      r.quantityPcs || 0,
      r.trayCount || 0,
      r.pricePerKg,
      r.totalRevenue,
      r.paymentMethod,
      r.paymentStatus,
      r.dueDate || '-',
      `"${r.notes || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `penjualan_telur_sahabat_puyuh_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-3.5 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-emerald-950">
              Modul Khusus: Pencatatan Penjualan &amp; Distribusi Telur Puyuh
            </p>
            <p className="text-[11px] text-emerald-800">
              Pencatatan invoice penjualan ke pengepul, agen, retail warung soto/pecel, dan piutang pelanggan dipisahkan khusus dari panen harian kandang.
            </p>
          </div>
        </div>
        {onNavigateToHarvest && (
          <button
            onClick={onNavigateToHarvest}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition self-start sm:self-center flex-shrink-0"
          >
            <Egg className="w-3.5 h-3.5 text-amber-400" />
            <span>Ke Panen Telur</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between">
        <div className="p-6 max-w-xl z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Manajemen Penjualan &amp; Distribusi Telur</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Pencatatan Penjualan Telur Puyuh
          </h1>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Pencatatan nota penjualan telur, pembeli/pengepul, penetapan harga pasar per kg, status pembayaran tempo/lunas, dan pengurangan stok telur siap jual.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenModal('eggSale')}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Input Penjualan Baru</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV Penjualan</span>
            </button>
          </div>
        </div>

        <div className="w-full md:w-72 h-44 md:h-full relative overflow-hidden flex-shrink-0">
          <img
            src="/images/fresh_quail_eggs_1792556185971.jpg"
            alt="Kemasan Telur Puyuh Hataswa"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-white via-white/20 to-transparent" />
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Total Volume Terjual */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Volume Terjual</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatNumber(totalSoldKg, 1)} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <span className="text-[11px] text-slate-500">
            ~{formatNumber(Math.round(totalSoldPcs))} butir terjual
          </span>
        </div>

        {/* 2. Total Omzet Penjualan */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Omzet Penjualan</span>
          <div className="text-xl md:text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            {isOwner ? formatRupiah(totalRevenue) : '*** (Pemilik)'}
          </div>
          <span className="text-[11px] text-slate-500">
            Rata-rata {formatRupiah(avgPricePerKg)} / kg
          </span>
        </div>

        {/* 3. Piutang Pelanggan Berjalan */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Piutang (Belum Lunas)</span>
            {totalPiutang > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <div className="text-xl md:text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {isOwner ? formatRupiah(totalPiutang) : '***'}
          </div>
          <span className="text-[11px] text-slate-500">
            {records.filter((r) => r.paymentStatus === 'Piutang').length} nota tempo berjalan
          </span>
        </div>

        {/* 4. Sisa Stok Gudang Siap Jual */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Stok Telur Gudang</span>
            <PackageCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatNumber(eggStockKg, 1)} <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            Siap didistribusikan ke mitra
          </span>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari pembeli, tanggal, catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Grade:</span>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Grade A">Grade A (Konsumsi)</option>
                <option value="Retak">Retak / Pecah Kulit</option>
                <option value="Asin">Telur Asin / Olahan</option>
                <option value="Partai">Campur / Partai Besar</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Status Bayar:</span>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Semua">Semua Status</option>
                <option value="Lunas">Lunas</option>
                <option value="Piutang">Piutang (Tempo)</option>
                <option value="DP / Uang Muka">DP / Uang Muka</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Pembeli / Mitra</th>
                <th className="py-3 px-4">Kategori / Grade</th>
                <th className="py-3 px-4 text-right">Volume (Kg)</th>
                <th className="py-3 px-4 text-right">Kuantitas</th>
                <th className="py-3 px-4 text-right">Harga/Kg</th>
                <th className="py-3 px-4 text-right">Total Transaksi</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4 text-center">Status Pembayaran</th>
                <th className="py-3 px-4">Catatan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => {
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                        {r.date}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{r.buyerName}</div>
                        {r.customerType && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {r.customerType}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                          {r.eggGrade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-extrabold text-slate-900">
                        {formatDecimal(r.quantityKg)} kg
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-600">
                        {r.trayCount ? `${r.trayCount} tray` : ''}{' '}
                        {r.quantityPcs ? `(~${formatNumber(r.quantityPcs)} btr)` : ''}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-600">
                        {isOwner ? formatRupiah(r.pricePerKg) : '***'}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-emerald-600">
                        {isOwner ? formatRupiah(r.totalRevenue) : '***'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium border border-slate-200 bg-white">
                          {r.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {r.paymentStatus === 'Lunas' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Lunas</span>
                          </span>
                        ) : r.paymentStatus === 'Piutang' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Piutang {r.dueDate ? `(Jatuh: ${r.dueDate})` : ''}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <span>{r.paymentStatus}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 truncate max-w-[160px]">
                        {r.notes || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {onEditRecord && (
                            <button
                              onClick={() => onEditRecord(r)}
                              className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition"
                              title="Edit Nota Penjualan"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteRecord(r.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                            title="Hapus Nota Penjualan"
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
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    Tidak ada catatan penjualan telur yang sesuai filter.
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
