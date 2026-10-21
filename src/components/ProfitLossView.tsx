import React from 'react';
import {
  EggRecord,
  FeedRecord,
  PopulationRecord,
  ExpenseRecord,
  QuailSeedSaleRecord,
  UserRole,
} from '../types/quail';
import { formatRupiah, formatNumber } from '../utils/calculations';
import { Printer, Scale, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ProfitLossViewProps {
  eggRecords: EggRecord[];
  feedRecords: FeedRecord[];
  populationRecords: PopulationRecord[];
  expenseRecords: ExpenseRecord[];
  seedSaleRecords: QuailSeedSaleRecord[];
  currentRole: UserRole;
  onSwitchToOwner: () => void;
}

export const ProfitLossView: React.FC<ProfitLossViewProps> = ({
  eggRecords,
  feedRecords,
  populationRecords,
  expenseRecords,
  seedSaleRecords,
  currentRole,
  onSwitchToOwner,
}) => {
  const isOwner = currentRole === 'owner';

  if (!isOwner) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 shadow-xs">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Akses Terbatas: Laporan Keuangan</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Laporan Laba Rugi komprehensif, margin keuntungan, dan titik impas (BEP) hanya dapat diakses oleh akun Pemilik Farm.
        </p>
        <button
          onClick={onSwitchToOwner}
          className="mt-5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs"
        >
          Beralih ke Akun Pemilik
        </button>
      </div>
    );
  }

  // Revenue Breakdown
  const eggRevenue = eggRecords.reduce((s, r) => s + r.revenue, 0);
  const seedRevenue = seedSaleRecords.reduce((s, r) => s + r.totalRevenue, 0);
  const cullRevenue = populationRecords.reduce((s, r) => s + (r.cullRevenue || 0), 0);
  const totalRevenue = eggRevenue + seedRevenue + cullRevenue;

  // Feed Cost (COGS) - Layer vs Pembesaran
  const layerFeeds = feedRecords.filter((f) => f.feedCategory === 'Pakan Petelur (Layer)');
  const growerFeeds = feedRecords.filter((f) => f.feedCategory === 'Pakan Pembesaran (Starter/Grower)');

  const layerFeedCost = layerFeeds.reduce((s, r) => s + r.totalCost, 0);
  const growerFeedCost = growerFeeds.reduce((s, r) => s + r.totalCost, 0);
  const totalFeedCost = layerFeedCost + growerFeedCost;

  const grossProfit = totalRevenue - totalFeedCost;
  const grossMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0';

  // Operating Expenses by Category
  const expenseByCategory: Record<string, number> = {};
  expenseRecords.forEach((r) => {
    expenseByCategory[r.category] = (expenseByCategory[r.category] || 0) + r.amount;
  });
  const totalOpExpenses = expenseRecords.reduce((s, r) => s + r.amount, 0);

  // Net Profit
  const netProfit = grossProfit - totalOpExpenses;
  const netMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  // BEP Calculation for Eggs
  const totalEggKg = eggRecords.reduce((s, r) => s + r.totalWeightKg, 0);
  const totalLayerCostCombined = layerFeedCost + totalOpExpenses;
  const bepPerKg = totalEggKg > 0 ? Math.round(totalLayerCostCombined / totalEggKg) : 0;
  const avgSellingPrice = totalEggKg > 0 ? Math.round(eggRevenue / totalEggKg) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            <Scale className="w-4 h-4" />
            <span>Laporan Keuangan &amp; Akuntansi Usaha Terintegrasi</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Laporan Laba Rugi Komprehensif Farm
          </h1>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-2xl">
            Ikhtisar performa finansial: omzet penjualan telur, bibit puyuh (DOQ &amp; Pullet), puyuh afkir, biaya pakan terpisah (Layer vs Pembesaran), dan margin laba bersih.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Key Financial Indicators Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Omzet Pendapatan</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatRupiah(totalRevenue)}
          </div>
          <span className="text-[11px] text-slate-500">Telur + Bibit DOQ + Afkir</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Laba Kotor (Gross Margin)</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatRupiah(grossProfit)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">{grossMargin}% dari omzet</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Laba Bersih Operasional</span>
          <div className="text-xl md:text-2xl font-bold text-emerald-600 mt-1 tabular-nums">
            {formatRupiah(netProfit)}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">{netMargin}% Margin Bersih</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Titik Impas (BEP) Telur</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatRupiah(bepPerKg)} <span className="text-xs font-normal text-slate-500">/kg</span>
          </div>
          <span className="text-[11px] text-slate-500">Harga jual: {formatRupiah(avgSellingPrice)}/kg</span>
        </div>
      </div>

      {/* Official Income Statement Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-6 border-b border-slate-200 text-center sm:text-left">
          <img
            src="/assets/aistudio/IMG-20250913-WA0211_74ca8a90.jpg"
            alt="Logo Sahabat Puyuh Hataswa"
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600/40 shadow-sm bg-white flex-shrink-0"
          />
          <div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-wide">
              Sahabat Puyuh Hataswa
            </h2>
            <p className="text-xs font-bold text-slate-600 mt-0.5">LAPORAN LABA RUGI OPERASIONAL PETERNAKAN</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Unit Usaha: Produksi Telur Segar &amp; Pembibitan DOQ/Pullet · Mata Uang: Rupiah (IDR)
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6 text-xs text-slate-800">
          {/* Section 1: Pendapatan Usaha */}
          <div>
            <div className="flex justify-between items-center py-1.5 font-bold text-slate-900 bg-slate-50 px-3 rounded-lg">
              <span>I. PENDAPATAN USAHA (REVENUE)</span>
              <span></span>
            </div>
            <div className="divide-y divide-slate-100 pl-4 pr-3">
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Penjualan Telur Puyuh Segar ({formatNumber(totalEggKg, 1)} kg)</span>
                <span className="font-semibold tabular-nums">{formatRupiah(eggRevenue)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Penjualan Bibit Puyuh (DOQ 1-3 Hari &amp; Pullet Siap Telur)</span>
                <span className="font-semibold tabular-nums text-emerald-700">{formatRupiah(seedRevenue)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Penjualan Puyuh Afkir Non-Produktif</span>
                <span className="font-semibold tabular-nums">{formatRupiah(cullRevenue)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-slate-900 bg-emerald-50/50 px-2 rounded-md">
                <span>TOTAL PENDAPATAN KOTOR (A)</span>
                <span className="tabular-nums text-emerald-800">{formatRupiah(totalRevenue)}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Beban Pokok Penjualan (HPP Pakan Terpisah) */}
          <div>
            <div className="flex justify-between items-center py-1.5 font-bold text-slate-900 bg-slate-50 px-3 rounded-lg">
              <span>II. BEBAN POKOK PRODUKSI / PAKAN (COGS) - DIPISAHKAN</span>
              <span></span>
            </div>
            <div className="divide-y divide-slate-100 pl-4 pr-3">
              <div className="flex justify-between py-2">
                <span className="text-slate-600">• Biaya Pakan Petelur (Layer Dewasa)</span>
                <span className="font-semibold tabular-nums text-slate-900">{formatRupiah(layerFeedCost)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">• Biaya Pakan Pembesaran (Starter/Grower DOQ)</span>
                <span className="font-semibold tabular-nums text-slate-900">{formatRupiah(growerFeedCost)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-slate-800 border-t border-slate-200">
                <span>Total Beban Pakan (B)</span>
                <span className="tabular-nums text-slate-900">{formatRupiah(totalFeedCost)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-slate-900 bg-amber-50/50 px-2 rounded-md">
                <span>LABA KOTOR USAHA (GROSS PROFIT = A - B)</span>
                <span className="tabular-nums text-slate-900">{formatRupiah(grossProfit)}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Beban Operasional */}
          <div>
            <div className="flex justify-between items-center py-1.5 font-bold text-slate-900 bg-slate-50 px-3 rounded-lg">
              <span>III. BEBAN OPERASIONAL KANDANG (OPEX)</span>
              <span></span>
            </div>
            <div className="divide-y divide-slate-100 pl-4 pr-3">
              {Object.entries(expenseByCategory).map(([cat, amount]) => (
                <div key={cat} className="flex justify-between py-2">
                  <span className="text-slate-600">{cat}</span>
                  <span className="font-medium tabular-nums text-slate-700">{formatRupiah(amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold text-slate-800 border-t border-slate-200">
                <span>Total Beban Operasional (C)</span>
                <span className="tabular-nums text-rose-700">{formatRupiah(totalOpExpenses)}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Laba Bersih */}
          <div className="pt-2">
            <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                  IV. LABA BERSIH PETERNAKAN (NET PROFIT)
                </span>
                <span className="text-[11px] text-slate-300">
                  Laba Kotor dikurangi Beban Operasional Keseluruhan
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl md:text-3xl font-black text-emerald-400 tabular-nums">
                  {formatRupiah(netProfit)}
                </div>
                <span className="text-xs text-slate-300 font-medium">Margin Keuntungan: {netMargin}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Health Analysis Card */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Diversifikasi Omzet Peternakan</span>
            </div>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                · <b>Kontribusi Telur:</b> {totalRevenue > 0 ? ((eggRevenue / totalRevenue) * 100).toFixed(1) : 0}% dari total omzet.
              </li>
              <li>
                · <b>Kontribusi Bibit Puyuh (DOQ &amp; Pullet):</b>{' '}
                <span className="font-semibold text-emerald-700 tabular-nums">
                  {totalRevenue > 0 ? ((seedRevenue / totalRevenue) * 100).toFixed(1) : 0}% ({formatRupiah(seedRevenue)})
                </span>. Menjadi sumber pendapatan bernilai tambah tinggi.
              </li>
              <li>
                · <b>Efisiensi Pakan Layer vs Pembesaran:</b> Pakan petelur menyerap{' '}
                {totalFeedCost > 0 ? ((layerFeedCost / totalFeedCost) * 100).toFixed(1) : 0}% dari anggaran ransum.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Rekomendasi Strategis Hataswa</span>
            </div>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                · Tingkatkan kapasitas mesin tetas untuk memenuhi permintaan DOQ mingguan dari kelompok ternak.
              </li>
              <li>
                · Pisahkan pembukuan biaya pakan starter DOQ agar harga pokok bibit pullet siap telur dapat terkontrol akurat.
              </li>
              <li>
                · Pertahankan seleksi pullet siap telur berbobot &gt;125g sebelum dimasukkan ke kandang baterai petelur.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
