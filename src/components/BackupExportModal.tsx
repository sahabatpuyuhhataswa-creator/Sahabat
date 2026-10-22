import React, { useRef, useState } from 'react';
import {
  EggRecord,
  EggSaleRecord,
  FeedRecord,
  PopulationRecord,
  ExpenseRecord,
  QuailSeedSaleRecord,
  CustomerRecord,
  FarmMetrics,
} from '../types/quail';
import { formatRupiah, formatNumber, formatDecimal } from '../utils/calculations';
import {
  Download,
  Upload,
  FileSpreadsheet,
  FileJson,
  Printer,
  CheckCircle2,
  AlertTriangle,
  X,
  HardDrive,
  Database,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface BackupExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  eggRecords: EggRecord[];
  eggSaleRecords: EggSaleRecord[];
  feedRecords: FeedRecord[];
  populationRecords: PopulationRecord[];
  expenseRecords: ExpenseRecord[];
  seedSaleRecords: QuailSeedSaleRecord[];
  customerRecords: CustomerRecord[];
  metrics: FarmMetrics;
  onRestoreData: (backupData: any) => void;
  onToast: (msg: string) => void;
}

export const BackupExportModal: React.FC<BackupExportModalProps> = ({
  isOpen,
  onClose,
  eggRecords,
  eggSaleRecords,
  feedRecords,
  populationRecords,
  expenseRecords,
  seedSaleRecords,
  customerRecords,
  metrics,
  onRestoreData,
  onToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Download JSON Backup
  const handleDownloadJsonBackup = () => {
    const fullBackup = {
      app: 'Sahabat Puyuh Hataswa',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      dateStr: todayStr,
      metricsSnapshot: metrics,
      data: {
        eggRecords,
        eggSaleRecords,
        feedRecords,
        populationRecords,
        expenseRecords,
        seedSaleRecords,
        customerRecords,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup_sahabat_puyuh_hataswa_${todayStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onToast('File cadangan JSON berhasil diunduh!');
  };

  // 2. Restore JSON Backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRestoreError(null);
    setIsRestoring(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json || (!json.data && !json.eggRecords)) {
          throw new Error('Format file cadangan tidak valid.');
        }

        const dataToRestore = json.data || json;
        if (
          window.confirm(
            'PERINGATAN: Apakah Anda yakin ingin memulihkan data dari file cadangan ini? Data saat ini di perangkat akan digantikan dengan data cadangan.'
          )
        ) {
          onRestoreData(dataToRestore);
          onToast('Data farm berhasil dipulihkan dari cadangan JSON!');
          onClose();
        }
      } catch (err: any) {
        setRestoreError(err.message || 'Gagal membaca file JSON cadangan.');
      } finally {
        setIsRestoring(false);
      }
    };
    reader.readAsText(file);
  };

  // 3. Export Excel / CSV Downloads
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => (typeof c === 'string' && c.includes(',') ? `"${c}"` : c)).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    onToast(`Laporan ${filename} berhasil diunduh!`);
  };

  const exportEggHarvestCSV = () => {
    const headers = ['Tanggal', 'Waktu_Panen', 'Kandang', 'Butir_Utuh', 'Retak', 'Total_Kg', 'Rata_Gram_Butir', 'Catatan'];
    const rows = eggRecords.map((r) => {
      const totalPcs = r.goodEggsPcs + r.brokenEggsPcs;
      const avgG = totalPcs > 0 ? ((r.totalWeightKg * 1000) / totalPcs).toFixed(1) : 0;
      return [r.date, r.timeOfDay, r.kandang, r.goodEggsPcs, r.brokenEggsPcs, r.totalWeightKg, avgG, r.notes || ''];
    });
    downloadCSV(`laporan_panen_telur_${todayStr}.csv`, headers, rows);
  };

  const exportEggSalesCSV = () => {
    const headers = ['Tanggal', 'Pembeli', 'Tipe_Pelanggan', 'Grade_Telur', 'Volume_Kg', 'Estimasi_Butir', 'Harga_Per_Kg', 'Total_Omzet', 'Metode_Bayar', 'Status_Bayar', 'Jatuh_Tempo'];
    const rows = eggSaleRecords.map((s) => [
      s.date,
      s.buyerName,
      s.customerType || '-',
      s.eggGrade,
      s.quantityKg,
      s.quantityPcs || 0,
      s.pricePerKg,
      s.totalRevenue,
      s.paymentMethod,
      s.paymentStatus,
      s.dueDate || '-',
    ]);
    downloadCSV(`laporan_penjualan_telur_${todayStr}.csv`, headers, rows);
  };

  const exportFeedCSV = () => {
    const headers = ['Tanggal', 'Kategori_Pakan', 'Merek_Ransum', 'Jenis_Formula', 'Jumlah_Kg', 'Jumlah_Karung', 'Harga_Per_Kg', 'Total_Biaya', 'Target_Kandang'];
    const rows = feedRecords.map((f) => [
      f.date,
      f.feedCategory,
      f.feedBrand,
      f.feedType,
      f.quantityKg,
      f.sackCount,
      f.pricePerKg,
      f.totalCost,
      f.targetFlock,
    ]);
    downloadCSV(`laporan_logistik_pakan_${todayStr}.csv`, headers, rows);
  };

  const exportFinancialSummaryCSV = () => {
    const headers = ['Tanggal', 'Kategori', 'Deskripsi_Transaksi', 'Pemasukan_Rp', 'Pengeluaran_Rp', 'Metode_Bayar'];
    const rows: (string | number)[][] = [];

    // Sales revenues
    eggSaleRecords.forEach((s) => {
      rows.push([s.date, 'Penjualan Telur', `Penjualan ${s.quantityKg}kg ke ${s.buyerName}`, s.totalRevenue, 0, s.paymentMethod]);
    });
    seedSaleRecords.forEach((s) => {
      rows.push([s.date, 'Penjualan Bibit DOQ/Pullet', `Penjualan ${s.quantityBirds} ekor ke ${s.buyerName}`, s.totalRevenue, 0, 'Tunai']);
    });
    // Costs
    feedRecords.forEach((f) => {
      rows.push([f.date, 'Pakan Ransum', `${f.feedCategory} - ${f.feedBrand} (${f.quantityKg}kg)`, 0, f.totalCost, 'Kas/Transfer']);
    });
    expenseRecords.forEach((x) => {
      rows.push([x.date, x.category, x.description, 0, x.amount, x.paymentMethod]);
    });

    downloadCSV(`rekap_keuangan_laba_rugi_${todayStr}.csv`, headers, rows);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-scale-up my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>Cadangan (Backup), Pulihkan &amp; Ekspor Data Excel</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          {/* Section 1: Backup & Restore JSON */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <span>1. Cadangkan &amp; Pulihkan Database Penuh (Format JSON)</span>
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Unduh cadangan data lengkap mencakup data panen telur, penjualan, stok pakan, sensus populasi, beban operasional, dan database pelanggan. Anda dapat memulihkannya kapan saja di perangkat lain.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleDownloadJsonBackup}
                className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-950 font-bold transition flex items-center gap-3 text-left shadow-xs cursor-pointer"
              >
                <div className="p-2 bg-emerald-600 text-white rounded-lg">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900">Unduh Backup JSON</div>
                  <div className="text-[10px] text-emerald-700 font-normal">Cadangkan semua data farm</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-slate-900 font-bold transition flex items-center gap-3 text-left shadow-xs cursor-pointer"
              >
                <div className="p-2 bg-slate-800 text-white rounded-lg">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Pulihkan dari JSON</div>
                  <div className="text-[10px] text-slate-500 font-normal">Restore file cadangan</div>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {restoreError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{restoreError}</span>
              </div>
            )}
          </div>

          {/* Section 2: Export Excel / CSV Modul */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>2. Ekspor Laporan Format Excel / CSV</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Unduh lembar kerja spreadsheet yang kompatibel dengan Microsoft Excel, Google Sheets, atau aplikasi akuntansi.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={exportEggHarvestCSV}
                className="p-2.5 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-xl text-slate-800 font-semibold transition flex items-center justify-between text-xs"
              >
                <span>Panen Telur Harian ({eggRecords.length} data)</span>
                <Download className="w-3.5 h-3.5 text-amber-600" />
              </button>

              <button
                type="button"
                onClick={exportEggSalesCSV}
                className="p-2.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-slate-800 font-semibold transition flex items-center justify-between text-xs"
              >
                <span>Penjualan Telur ({eggSaleRecords.length} nota)</span>
                <Download className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={exportFeedCSV}
                className="p-2.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-slate-800 font-semibold transition flex items-center justify-between text-xs"
              >
                <span>Logistik &amp; Pakan ({feedRecords.length} data)</span>
                <Download className="w-3.5 h-3.5 text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={exportFinancialSummaryCSV}
                className="p-2.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl text-slate-800 font-semibold transition flex items-center justify-between text-xs"
              >
                <span>Rekap Keuangan &amp; Laba Rugi</span>
                <Download className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Section 3: Cetak Laporan PDF / Print */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div>
              <span className="font-bold text-slate-900 block">Cetak Ringkasan Kinerja Farm (PDF)</span>
              <span className="text-[10px] text-slate-500">Cetak laporan resmi bulanan dengan kop surat Sahabat Puyuh Hataswa</span>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
