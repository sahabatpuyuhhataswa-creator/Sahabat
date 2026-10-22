import React, { useState } from 'react';
import { ExpansionPlan, UserRole } from '../types/quail';
import { formatRupiah, formatNumber, formatDecimal } from '../utils/calculations';
import { DecimalInput } from './DecimalInput';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Calendar,
  Save,
  Trash2,
  Printer,
  Sparkles,
  HelpCircle,
  Building,
  Egg,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

interface ExpansionSimulatorViewProps {
  savedPlans: ExpansionPlan[];
  onSavePlan: (plan: ExpansionPlan) => void;
  onDeletePlan: (id: string) => void;
  currentRole: UserRole;
}

export const ExpansionSimulatorView: React.FC<ExpansionSimulatorViewProps> = ({
  savedPlans,
  onSavePlan,
  onDeletePlan,
  currentRole,
}) => {
  const isOwner = currentRole === 'owner';

  // State parameter simulasi ekspansi
  const [planName, setPlanName] = useState('Rencana Ekspansi Kandang Baru 2.500 Ekor');
  const [quailCount, setQuailCount] = useState<number>(2500);
  const [procurementType, setProcurementType] = useState<'DOQ (1-3 Hari)' | 'Pullet Siap Telur (30-35 Hari)'>('DOQ (1-3 Hari)');

  // Biaya Investasi Modal Awal (CapEx)
  const [cageCost, setCageCost] = useState<number>(7500000); // Kandang baterai
  const [birdCostPerHead, setBirdCostPerHead] = useState<number>(3000); // DOQ ~3000, Pullet ~12500
  const [equipmentCost, setEquipmentCost] = useState<number>(2000000); // Brooder, instalasi air, talang
  const [broodingFeedCost, setBroodingFeedCost] = useState<number>(4500000); // Pakan fase starter jika DOQ

  // Parameter Operasional & Produksi Telur
  const [feedPricePerKg, setFeedPricePerKg] = useState<number>(8400);
  const [eggPricePerKg, setEggPricePerKg] = useState<number>(33000);
  const [expectedHdp, setExpectedHdp] = useState<number>(82); // 82% Hen-day production
  const [monthlyOpCost, setMonthlyOpCost] = useState<number>(850000); // Listrik, sekam, vitamin, pekerja

  // Kalkulasi Modal Awal (Total CapEx)
  const totalBirdCost = quailCount * birdCostPerHead;
  const totalCapex = cageCost + totalBirdCost + equipmentCost + (procurementType.includes('DOQ') ? broodingFeedCost : 0);

  // Kalkulasi Produksi Harian & Bulanan
  // Puyuh bertelur = quailCount * (expectedHdp / 100) butir/hari
  const dailyEggPcs = Math.round(quailCount * (expectedHdp / 100));
  // Rata-rata bobot telur puyuh 10.9 - 11 gram (~90-91 butir per kg)
  const dailyEggKg = Number(((dailyEggPcs * 11) / 1000).toFixed(2));
  const monthlyEggPcs = dailyEggPcs * 30;
  const monthlyEggKg = Number((dailyEggKg * 30).toFixed(1));

  // Konsumsi Pakan Harian & Bulanan (Puyuh petelur rata-rata 23 gram / ekor / hari)
  const dailyFeedKg = Number(((quailCount * 23) / 1000).toFixed(1));
  const monthlyFeedKg = dailyFeedKg * 30;
  const monthlyFeedCost = Math.round(monthlyFeedKg * feedPricePerKg);

  // Omzet & Laba Bersih Bulanan
  const monthlyEggRevenue = Math.round(monthlyEggKg * eggPricePerKg);
  // Omzet tambahan afkir berkala (~3% populasi per bulan x Rp 5.500)
  const monthlyCullRevenue = Math.round(quailCount * 0.03 * 5500);
  const totalMonthlyRevenue = monthlyEggRevenue + monthlyCullRevenue;

  // Total Biaya Operasional Bulanan (OpEx)
  const totalMonthlyOpex = monthlyFeedCost + monthlyOpCost;
  const monthlyNetProfit = totalMonthlyRevenue - totalMonthlyOpex;

  // Titik Impas (BEP) Harga Telur per Kg
  const bepPerKg = monthlyEggKg > 0 ? Math.round(totalMonthlyOpex / monthlyEggKg) : 0;

  // Payback Period (Balik Modal dalam Bulan)
  const paybackMonths = monthlyNetProfit > 0 ? Number((totalCapex / monthlyNetProfit).toFixed(1)) : 999;
  const annualRoiPercent = totalCapex > 0 ? Number(((monthlyNetProfit * 12 / totalCapex) * 100).toFixed(1)) : 0;

  // Data Proyeksi Kumulatif 12 Bulan untuk Recharts
  const projectionChartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    // Masa persiapan bertelur: jika DOQ butuh 1.5 bulan brooding, jika Pullet mulai bulan 1
    const isProductive = procurementType.includes('Pullet') || month >= 2;
    const profit = isProductive ? monthlyNetProfit : -monthlyOpCost;
    const cumulativeCashflow = (profit * (procurementType.includes('Pullet') ? month : Math.max(0, month - 1))) - totalCapex;

    return {
      month: `Bulan ${month}`,
      shortMonth: `B${month}`,
      omzet: isProductive ? totalMonthlyRevenue : 0,
      biayaOpex: isProductive ? totalMonthlyOpex : monthlyOpCost,
      labaBulanan: profit,
      arusKasKumulatif: cumulativeCashflow,
      titikImpasModal: 0,
    };
  });

  // Ganti tipe pengadaan bibit dan sesuaikan default
  const handleProcurementTypeChange = (type: 'DOQ (1-3 Hari)' | 'Pullet Siap Telur (30-35 Hari)') => {
    setProcurementType(type);
    if (type === 'DOQ (1-3 Hari)') {
      setBirdCostPerHead(3000);
      setBroodingFeedCost(Math.round(quailCount * 1800)); // ~Rp 1.800 pakan per ekor sampai bertelur
    } else {
      setBirdCostPerHead(12500);
      setBroodingFeedCost(0); // Pullet langsung siap bertelur
    }
  };

  const handleQuailCountPreset = (count: number) => {
    setQuailCount(count);
    // Estimasi proporsional biaya kandang baterai & pakan starter
    setCageCost(Math.round(count * 3000)); // Rp 3.000 / kapasitas ekor
    if (procurementType.includes('DOQ')) {
      setBroodingFeedCost(Math.round(count * 1800));
    }
    setEquipmentCost(count >= 5000 ? 3500000 : count >= 2500 ? 2000000 : 1000000);
    setMonthlyOpCost(count >= 5000 ? 1500000 : count >= 2500 ? 850000 : 450000);
  };

  const handleSaveCurrentPlan = () => {
    const newPlan: ExpansionPlan = {
      id: `plan-${Date.now()}`,
      name: planName || `Ekspansi ${quailCount} Ekor (${procurementType})`,
      quailCount,
      procurementType,
      cageCost,
      birdCost: totalBirdCost,
      broodingFeedCost,
      equipmentCost,
      eggPricePerKg,
      feedPricePerKg,
      expectedHdp,
      monthlyOpCost,
      notes: `Target HDP ${expectedHdp}%, BEP Rp ${bepPerKg.toLocaleString('id-ID')}/kg, Balik modal ~${paybackMonths} bulan`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    onSavePlan(newPlan);
  };

  const handlePrintPlan = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
            <Calculator className="w-4 h-4" />
            <span>Kalkulator Capital Expenditure &amp; ROI</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Simulasi Ekspansi Kandang &amp; Populasi Baru
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
            Hitung rincian kebutuhan modal awal (kandang baterai, bibit DOQ/pullet, pakan brooding), proyeksi omzet harian/bulanan, titik impas (BEP), dan estimasi pengembalian modal investasi (ROI).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrintPlan}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Rencana (Print/PDF)</span>
          </button>
          <button
            onClick={handleSaveCurrentPlan}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Skenario Ini</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Chooser */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold">Pilih Skala Penambahan Cepat:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[500, 1000, 2500, 5000, 10000].map((cnt) => (
            <button
              key={cnt}
              type="button"
              onClick={() => handleQuailCountPreset(cnt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                quailCount === cnt
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              +{formatNumber(cnt)} Ekor
            </button>
          ))}
        </div>
      </div>

      {/* Main Form & Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Form (CapEx & OpEx Parameters) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-500" />
              <span>1. Pengadaan &amp; Modal Awal (CapEx)</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nama / Judul Rencana Ekspansi:
              </label>
              <input
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Jumlah Puyuh (Ekor):
                </label>
                <DecimalInput
                  allowDecimal={false}
                  min={100}
                  value={quailCount}
                  onChange={(val) => setQuailCount(val || 1000)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-extrabold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tipe Pengadaan:
                </label>
                <select
                  value={procurementType}
                  onChange={(e: any) => handleProcurementTypeChange(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                >
                  <option value="DOQ (1-3 Hari)">DOQ (Anak Puyuh 1-3 Hari)</option>
                  <option value="Pullet Siap Telur (30-35 Hari)">Pullet Siap Bertelur</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  Harga Bibit per Ekor (Rp):
                </label>
                <span className="text-[10px] text-slate-400">
                  Subtotal: {formatRupiah(totalBirdCost)}
                </span>
              </div>
              <DecimalInput
                allowDecimal={false}
                min={500}
                value={birdCostPerHead}
                onChange={(val) => setBirdCostPerHead(val)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Biaya Kandang Baterai &amp; Rangka (Rp):
              </label>
              <DecimalInput
                allowDecimal={false}
                min={0}
                value={cageCost}
                onChange={(val) => setCageCost(val)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Peralatan, Talang &amp; Pipa Nipple Minum (Rp):
              </label>
              <DecimalInput
                allowDecimal={false}
                min={0}
                value={equipmentCost}
                onChange={(val) => setEquipmentCost(val)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
              />
            </div>

            {procurementType.includes('DOQ') && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Biaya Pakan Pembesaran/Brooding (Rp):
                </label>
                <DecimalInput
                  allowDecimal={false}
                  min={0}
                  value={broodingFeedCost}
                  onChange={(val) => setBroodingFeedCost(val)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-amber-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Pakan starter crumble umur 0-35 hari sampai puyuh mulai bertelur.
                </span>
              </div>
            )}

            {/* Total CapEx Summary Box */}
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center justify-between text-xs text-amber-950">
                <span className="font-semibold">Total Investasi Modal Awal:</span>
                <span className="text-base font-extrabold text-amber-800">
                  {formatRupiah(totalCapex)}
                </span>
              </div>
              <div className="text-[10px] text-amber-800 mt-1">
                Setara ~{formatRupiah(Math.round(totalCapex / quailCount))}/ekor kapasitas kandang terpasang.
              </div>
            </div>
          </div>

          {/* Operational & Market Parameters */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Egg className="w-4 h-4 text-emerald-500" />
              <span>2. Parameter Produksi &amp; Pasar</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Target HDP (% Bertelur):
                </label>
                <div className="flex items-center gap-1.5">
                  <DecimalInput
                    allowDecimal={true}
                    min={50}
                    max={100}
                    value={expectedHdp}
                    onChange={(val) => setExpectedHdp(val)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-extrabold text-emerald-700"
                  />
                  <span className="text-xs font-bold text-slate-600">%</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Harga Telur per Kg (Rp):
                </label>
                <DecimalInput
                  allowDecimal={false}
                  min={10000}
                  value={eggPricePerKg}
                  onChange={(val) => setEggPricePerKg(val)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Harga Pakan Layer / Kg:
                </label>
                <DecimalInput
                  allowDecimal={false}
                  min={5000}
                  value={feedPricePerKg}
                  onChange={(val) => setFeedPricePerKg(val)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Beban Rutin Lain / Bulan:
                </label>
                <DecimalInput
                  allowDecimal={false}
                  min={0}
                  value={monthlyOpCost}
                  onChange={(val) => setMonthlyOpCost(val)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations, ROI Dashboard & Interactive Recharts Projection */}
        <div className="lg:col-span-2 space-y-5">
          {/* Top Key Performance Projection Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500">Estimasi Telur Harian</span>
              <div className="text-lg md:text-xl font-extrabold text-slate-900 mt-1 tabular-nums">
                {formatNumber(dailyEggPcs)} <span className="text-xs font-normal text-slate-500">btr</span>
              </div>
              <span className="text-[11px] text-amber-700 font-bold">~{dailyEggKg} kg / hari</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500">Omzet Bulanan</span>
              <div className="text-lg md:text-xl font-extrabold text-emerald-700 mt-1 tabular-nums">
                {formatRupiah(totalMonthlyRevenue)}
              </div>
              <span className="text-[10px] text-slate-500">~{formatDecimal(monthlyEggKg)} kg telur / bln</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500">Laba Bersih Bulanan</span>
              <div className="text-lg md:text-xl font-extrabold text-blue-700 mt-1 tabular-nums">
                {formatRupiah(monthlyNetProfit)}
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">
                Margin ~{totalMonthlyRevenue > 0 ? ((monthlyNetProfit / totalMonthlyRevenue) * 100).toFixed(1) : 0}%
              </span>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-sm">
              <span className="text-[11px] font-semibold text-emerald-100">Waktu Balik Modal (ROI)</span>
              <div className="text-xl md:text-2xl font-black mt-1 tabular-nums">
                ~{paybackMonths} <span className="text-xs font-normal text-emerald-100">Bulan</span>
              </div>
              <span className="text-[10px] text-emerald-200 font-bold">ROI: {annualRoiPercent}% / tahun</span>
            </div>
          </div>

          {/* Detailed Financial Breakdown Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Rincian Analisis Finansial &amp; Titik Impas (BEP)</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                BEP: {formatRupiah(bepPerKg)} / kg
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800 block text-xs border-b border-slate-200 pb-1">
                  Arus Biaya Rutin Bulanan (OpEx):
                </span>
                <div className="flex justify-between text-slate-600">
                  <span>Konsumsi Pakan Layer ({formatNumber(monthlyFeedKg)} kg):</span>
                  <span className="font-bold text-slate-900">{formatRupiah(monthlyFeedCost)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Operasional (Listrik/Pekerja/Vitamin):</span>
                  <span className="font-bold text-slate-900">{formatRupiah(monthlyOpCost)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                  <span>Total Biaya Operasional / Bulan:</span>
                  <span className="text-rose-600">{formatRupiah(totalMonthlyOpex)}</span>
                </div>
              </div>

              <div className="space-y-2 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                <span className="font-bold text-emerald-950 block text-xs border-b border-emerald-200 pb-1">
                  Proyeksi Arus Kas &amp; Titik Impas:
                </span>
                <div className="flex justify-between text-slate-700">
                  <span>Harga Jual Pasar Telur:</span>
                  <span className="font-bold text-slate-900">{formatRupiah(eggPricePerKg)} / kg</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Titik Impas (Biaya Pokok Prod/BEP):</span>
                  <span className="font-bold text-emerald-800">{formatRupiah(bepPerKg)} / kg</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-emerald-200 font-bold text-slate-900">
                  <span>Margin Keuntungan Bersih per Kg:</span>
                  <span className="text-emerald-700">{formatRupiah(Math.max(0, eggPricePerKg - bepPerKg))} / kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recharts Cashflow & Break-Even Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Proyeksi Pengembalian Modal 12 Bulan (Recharts)</h3>
                <p className="text-xs text-slate-500">Melihat titik balik modal saat grafik arus kas kumulatif menembus angka nol (Break-Even).</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Balik Modal: Bulan ke-{Math.ceil(paybackMonths)}
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={projectionChartData} margin={{ top: 10, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="shortMonth" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    tickFormatter={(val) => `${(val / 1000000).toFixed(0)}jt`}
                  />
                  <Tooltip
                    formatter={(val: any) => formatRupiah(Number(val))}
                    labelFormatter={(lbl) => `Proyeksi ${lbl}`}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" label={{ value: 'Titik Impas Modal (Rp 0)', fill: '#64748b', fontSize: 10, position: 'insideTopLeft' }} />
                  <Line
                    type="monotone"
                    dataKey="arusKasKumulatif"
                    name="Arus Kas Kumulatif (Setelah Balik Modal)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#10b981' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="labaBulanan"
                    name="Laba Bersih Bulanan"
                    fill="#3b82f6"
                    fillOpacity={0.15}
                    stroke="#3b82f6"
                    strokeWidth={1.5}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Saved Plans List */}
          {savedPlans && savedPlans.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Daftar Skenario Rencana Ekspansi Tersimpan ({savedPlans.length})</span>
              </h3>

              <div className="mt-3 space-y-2.5">
                {savedPlans.map((sp) => (
                  <div
                    key={sp.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{sp.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {formatNumber(sp.quailCount)} ekor · {sp.procurementType} · Dibuat: {sp.createdAt}
                      </div>
                      {sp.notes && <div className="text-[10px] text-emerald-700 font-semibold mt-1">{sp.notes}</div>}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setPlanName(sp.name);
                          setQuailCount(sp.quailCount);
                          setProcurementType(sp.procurementType);
                          setCageCost(sp.cageCost);
                          setBirdCostPerHead(Math.round(sp.birdCost / sp.quailCount));
                          setBroodingFeedCost(sp.broodingFeedCost);
                          setEquipmentCost(sp.equipmentCost);
                          setEggPricePerKg(sp.eggPricePerKg);
                          setFeedPricePerKg(sp.feedPricePerKg);
                          setExpectedHdp(sp.expectedHdp);
                          setMonthlyOpCost(sp.monthlyOpCost);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-300 rounded-lg transition"
                      >
                        Muat Skenario
                      </button>
                      <button
                        onClick={() => onDeletePlan(sp.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                        title="Hapus Skenario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
