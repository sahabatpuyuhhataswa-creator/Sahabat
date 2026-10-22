import React, { useState } from 'react';
import { EggRecord, FeedRecord, PopulationRecord, ExpenseRecord, FarmMetrics, UserRole } from '../types/quail';
import { formatRupiah, formatNumber } from '../utils/calculations';
import {
  Egg,
  Wheat,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lock,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  metrics: FarmMetrics;
  eggRecords: EggRecord[];
  feedRecords: FeedRecord[];
  populationRecords: PopulationRecord[];
  expenseRecords: ExpenseRecord[];
  currentRole: UserRole;
  onOpenModal: (type: 'egg' | 'eggSale' | 'feed' | 'population' | 'expense' | 'seedSale') => void;
  onOpenAttendanceModal?: () => void;
  onNavigateTab: (tab: any) => void;
  onOpenEditActivePopulation?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  eggRecords,
  feedRecords,
  currentRole,
  onOpenModal,
  onOpenAttendanceModal,
  onNavigateTab,
  onOpenEditActivePopulation,
}) => {
  const isOwner = currentRole === 'owner';
  const [chartMetric, setChartMetric] = useState<'kg' | 'hdp'>('kg');

  // Last 14 days sorted chronologically
  const recentEggs = [...eggRecords].slice(-14);
  const maxKg = Math.max(...recentEggs.map((e) => e.totalWeightKg), 50);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-md">
        {/* Farm Background Image with subtle measured scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/quail_farm_banner_1792556184331.jpg"
            alt="Kandang Modern Sahabat Puyuh Hataswa"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative z-10 p-5 md:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl flex items-start gap-4">
            <img
              src="/assets/aistudio/IMG-20250913-WA0211_74ca8a90.jpg"
              alt="Logo Sahabat Puyuh Hataswa"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-emerald-400/50 shadow-xl bg-white flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <span>Farm Performance Monitoring</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">Coturnix coturnix japonica</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Sahabat Puyuh Hataswa
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Monitoring harian produksi panen telur puyuh, penjualan telur terpisah, bibit DOQ, efisiensi ransum pakan (FCR), mortalitas kawanan, dan analisis laba rugi farm modern.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenModal('egg')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Panen Telur</span>
            </button>
            <button
              onClick={() => onOpenModal('eggSale')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Jual Telur</span>
            </button>
            <button
              onClick={() => onOpenModal('seedSale')}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Jual Bibit (DOQ)</span>
            </button>
            <button
              onClick={() => onOpenModal('feed')}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Pakan</span>
            </button>
            {onOpenAttendanceModal && (
              <button
                onClick={onOpenAttendanceModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Absen Petugas (Foto/Manual)</span>
              </button>
            )}
            {isOwner && (
              <button
                onClick={() => onNavigateTab('ai-advisor')}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-xs transition border border-purple-400/30"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                <span>Konsultasi AI</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* 1. Populasi Aktif (Layer vs Pembesaran) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between relative group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Populasi</span>
            {onOpenEditActivePopulation ? (
              <button
                onClick={onOpenEditActivePopulation}
                title="Edit Populasi Puyuh"
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md transition flex items-center gap-1"
              >
                <span>✏️ Edit</span>
              </button>
            ) : (
              <Activity className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-bold text-slate-900 tabular-nums">
              {formatNumber(metrics.activePopulation)}
            </div>
            <span className="text-[11px] text-slate-500">
              Layer: {formatNumber(metrics.activeLayerPopulation)} · Grower: {formatNumber(metrics.activeGrowerPopulation)}
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Mortalitas 30hr:</span>
            <span className="font-semibold text-rose-600 tabular-nums">{metrics.mortality30Days} ekor</span>
          </div>
        </div>

        {/* 2. Produksi Telur Hari Ini */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Produksi Hari Ini</span>
            <Egg className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-bold text-slate-900 tabular-nums">
              {formatNumber(metrics.todayEggsKg, 1)} <span className="text-sm font-semibold text-slate-500">kg</span>
            </div>
            <span className="text-[11px] text-slate-500 tabular-nums">{formatNumber(metrics.todayEggsPcs)} butir panen</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Rata-rata/butir:</span>
            <span className="font-semibold text-slate-700 tabular-nums">{metrics.avgEggWeightGram} g</span>
          </div>
        </div>

        {/* 3. Hen-Day Production (HDP %) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">HDP Harian</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-bold text-emerald-600 tabular-nums">
              {metrics.hdp}%
            </div>
            <span className="text-[11px] text-slate-500">Standar: 75% - 85%</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] flex items-center justify-between">
            <span className="text-slate-600">Status HDP:</span>
            <span className={`font-semibold ${metrics.hdp >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {metrics.hdp >= 80 ? 'Sangat Baik' : metrics.hdp >= 75 ? 'Optimal' : 'Perlu Evaluasi'}
            </span>
          </div>
        </div>

        {/* 4. Feed Conversion Ratio (FCR) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">FCR Ransum</span>
            <Wheat className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-bold text-slate-900 tabular-nums">
              {metrics.fcr}
            </div>
            <span className="text-[11px] text-slate-500">Target ideal: 2.0 - 2.3</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Pakan/ekor:</span>
            <span className="font-semibold text-slate-700 tabular-nums">{metrics.feedPerBirdGram} g/hari</span>
          </div>
        </div>

        {/* 5. Estimasi Laba Bersih (Owner Only) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Laba Bersih Bulan Ini</span>
            {!isOwner && <Lock className="w-3.5 h-3.5 text-slate-400" />}
          </div>
          <div className="mt-2">
            {isOwner ? (
              <>
                <div className="text-xl md:text-2xl font-bold text-emerald-600 tabular-nums truncate">
                  {formatRupiah(metrics.monthlyNetProfit)}
                </div>
                <span className="text-[11px] text-slate-500">Margin Laba: {metrics.profitMargin}%</span>
              </>
            ) : (
              <>
                <div className="text-sm font-semibold text-slate-400 py-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Khusus Pemilik</span>
                </div>
                <span className="text-[11px] text-slate-400">Ganti role untuk akses</span>
              </>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>BEP per Kg:</span>
            <span className="font-semibold text-slate-700 tabular-nums">
              {isOwner ? formatRupiah(metrics.bepPerKg) : '***'}
            </span>
          </div>
        </div>

        {/* 6. Stok Pakan Tersisa */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Stok Pakan Sisa</span>
            <Wheat className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-bold text-slate-900 tabular-nums">
              {metrics.feedStockSacks} <span className="text-sm font-semibold text-slate-500">Karung</span>
            </div>
            <span className="text-[11px] text-slate-500 tabular-nums">~{metrics.feedStockSacks * 50} kg layer</span>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>Daya Tahan Stok:</span>
            <span className="font-semibold text-emerald-600">~8 Hari</span>
          </div>
        </div>
      </div>

      {/* Production Chart & Health Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Column */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Grafik Tren Produksi Telur (14 Hari Terakhir)</h2>
              <p className="text-xs text-slate-500">Pantau konsistensi kuantitas dan rasio bertelur kawanan puyuh.</p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
              <button
                onClick={() => setChartMetric('kg')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                  chartMetric === 'kg' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bobot (Kg)
              </button>
              <button
                onClick={() => setChartMetric('hdp')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                  chartMetric === 'hdp' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                HDP (%)
              </button>
            </div>
          </div>

          {/* SVG Line / Bar Visualization */}
          <div className="mt-6">
            <div className="h-56 w-full flex items-end gap-2 pt-6 pb-2 px-1">
              {recentEggs.map((record) => {
                const dayLabel = record.date.slice(8); // DD
                const pcs = record.goodEggsPcs + record.brokenEggsPcs;
                const hdpValue = Number(((pcs / metrics.activePopulation) * 100).toFixed(1));
                const heightPercent = chartMetric === 'kg'
                  ? Math.min(Math.round((record.totalWeightKg / maxKg) * 100), 100)
                  : Math.min(Math.round((hdpValue / 100) * 100), 100);

                return (
                  <div key={record.id} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg pointer-events-none shadow-lg whitespace-nowrap">
                      <span className="font-semibold">{record.date}</span>
                      <span>
                        {chartMetric === 'kg' ? `${record.totalWeightKg} kg (${formatNumber(pcs)} butir)` : `HDP: ${hdpValue}%`}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-t-md h-44 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full transition-all duration-300 rounded-t-md ${
                          chartMetric === 'kg'
                            ? 'bg-amber-500 group-hover:bg-amber-400'
                            : 'bg-emerald-500 group-hover:bg-emerald-400'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium tabular-nums">{dayLabel}</span>
                  </div>
                );
              })}
            </div>

            {/* Benchmark Legend */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-xs ${chartMetric === 'kg' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <span>{chartMetric === 'kg' ? 'Bobot Telur Panen (Kg)' : 'Hen-Day Production (%)'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="inline-block w-4 border-t-2 border-dashed border-emerald-500" />
                  <span>Target Standar Puyuh (80% HDP)</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400">Rata-rata 14 Hari: 44.8 kg / hari</span>
            </div>
          </div>
        </div>

        {/* Diagnostic & Technical Standards Column */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
              <span>Evaluasi Teknis Ransum &amp; Kandang</span>
              <span className="text-[11px] font-normal text-slate-400">SNI Puyuh</span>
            </h3>

            <div className="space-y-3.5">
              {/* Item 1: FCR Check */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Rasio Konversi Pakan (FCR)</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    metrics.fcr <= 2.3 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {metrics.fcr <= 2.3 ? 'Sangat Efisien' : 'Waspada Pemborosan'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Aktual <b className="text-slate-800 tabular-nums">{metrics.fcr}</b> vs Standar ideal 2.0 - 2.3. Pastikan talang pakan tidak tumpah.
                </p>
              </div>

              {/* Item 2: Bobot Telur */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Rata-rata Bobot Telur</span>
                  <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 text-emerald-800">
                    Standar Tercapai
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Aktual <b className="text-slate-800 tabular-nums">{metrics.avgEggWeightGram} g/butir</b> (Standar: 10 - 12 gram). Nutrisi protein pakan mencukupi.
                </p>
              </div>

              {/* Item 3: Rasio Telur Rusak */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Integritas Kerabang (Retak)</span>
                  <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 text-emerald-800">
                    Sangat Bagus
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Keretakan hanya <b className="text-slate-800 tabular-nums">0.5%</b> (Maksimal toleransi: 1.5%). Suplementasi kalsium &amp; grit optimal.
                </p>
              </div>
            </div>
          </div>

          {/* Quick AI Advisor Card (if owner) */}
          {isOwner ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900 to-slate-900 text-white shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="text-xs font-bold text-purple-200">PuyuhAI Financial Advisor</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ingin simulasi efisiensi pakan jika puyuh afkir dijual atau cari strategi peningkatan omzet telur?
              </p>
              <button
                onClick={() => onNavigateTab('ai-advisor')}
                className="mt-3 flex items-center justify-between w-full px-3 py-2 bg-purple-700/80 hover:bg-purple-600 rounded-xl text-xs font-semibold transition"
              >
                <span>Buka Konsultasi Farm AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Panduan Petugas Lapangan</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Catat panen telur pagi &amp; sore secara rutin. Cek air minum nipple drinker setiap pagi jam 08.00 WIB.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Harvest Entries */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Catatan Panen Telur Terkini</h2>
            <p className="text-xs text-slate-500">5 panen terakhir yang telah diinput ke dalam sistem.</p>
          </div>
          <button
            onClick={() => onNavigateTab('telur')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition"
          >
            <span>Lihat Semua Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Kandang</th>
                <th className="py-3 px-4 text-right">Butir Utuh (Grade A)</th>
                <th className="py-3 px-4 text-right">Retak</th>
                <th className="py-3 px-4 text-right">Total Bobot (Kg)</th>
                <th className="py-3 px-4 text-right">Bobot/Butir</th>
                <th className="py-3 px-4 text-center">% Retak</th>
                <th className="py-3 px-4 text-center">Status Mutu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentEggs.slice(-5).reverse().map((record) => {
                const totalPcs = record.goodEggsPcs + record.brokenEggsPcs;
                const avgG = totalPcs > 0 ? ((record.totalWeightKg * 1000) / totalPcs).toFixed(1) : '0';
                const brokenPct = totalPcs > 0 ? ((record.brokenEggsPcs / totalPcs) * 100).toFixed(1) : '0';

                return (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">{record.date}</td>
                    <td className="py-3 px-4 text-slate-600">{record.kandang}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-800">{formatNumber(record.goodEggsPcs)}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-rose-600">{record.brokenEggsPcs}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-900">{record.totalWeightKg} kg</td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-700 font-medium">
                      {avgG} g
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        Number(brokenPct) <= 1.5
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {brokenPct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Grade A Konsumsi
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Gambar Dibawah Panen Telur */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-56 h-36 rounded-xl overflow-hidden shadow-xs border border-slate-200 shrink-0">
            <img
              src="/src/assets/images/quail_egg_harvest_farm_1792593478247.jpg"
              alt="Baki Rak Panen Telur Puyuh Hataswa"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>
          <div className="flex-1 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">Panen Harian Telur Puyuh Hataswa</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Puyuh Petelur Produktif
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Telur disortir langsung ke atas tray baki telur 90 butir setelah panen pagi dan sore. Seluruh bobot dan butir utuh tersimpan otomatis dan aman di sistem.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-medium text-slate-700">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Bobot Standar: 10 - 12 g
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Target Pecah: &lt; 1.5%
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Kapasitas Baki Tray: 90 butir / tray
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
