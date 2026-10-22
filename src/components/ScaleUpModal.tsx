import React from 'react';
import { FarmMetrics } from '../types/quail';
import { formatRupiah, formatNumber } from '../utils/calculations';
import { X, TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Building } from 'lucide-react';

interface ScaleUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: FarmMetrics;
  onNavigateToExpansion: () => void;
}

export const ScaleUpModal: React.FC<ScaleUpModalProps> = ({
  isOpen,
  onClose,
  metrics,
  onNavigateToExpansion,
}) => {
  if (!isOpen) return null;

  // Evaluation criteria for scale-up readiness
  const isHdpOptimal = metrics.hdp >= 75;
  const isFcrEfficient = metrics.fcr <= 2.3 && metrics.fcr > 0;
  const isProfitable = metrics.monthlyNetProfit > 0;
  const hasGoodStock = metrics.feedStockSacks >= 15;

  const score = (isHdpOptimal ? 25 : 0) + (isFcrEfficient ? 25 : 0) + (isProfitable ? 25 : 0) + (hasGoodStock ? 25 : 0);
  const isReadyToScale = score >= 75;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-scale-up my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 font-bold text-sm md:text-base">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Analisis Kelayakan &amp; Waktu Tepat Scale Up Populasi</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            isReadyToScale
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}>
            {isReadyToScale ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-extrabold text-sm block mb-1">
                {isReadyToScale
                  ? 'STATUS: Farm Sangat Siap untuk Ekspansi / Scale Up!'
                  : 'STATUS: Perbaiki Indikator Operasional Sebelum Scale Up'}
              </span>
              <p className="leading-relaxed text-slate-700">
                {isReadyToScale
                  ? `Skor kesehatan dan profitabilitas farm mencapai ${score}%. Konsistensi produksi HDP (${metrics.hdp}%), FCR efisien (${metrics.fcr}), dan laba bersih stabil (${formatRupiah(metrics.monthlyNetProfit)}/bln) menunjukkan peternakan siap menambah kapasitas 2.500 - 5.000 ekor baru.`
                  : `Skor kesiapan saat ini ${score}%. Pastikan HDP minimal 75%, FCR di bawah 2.3, dan arus kas positif sebelum menambah populasi puyuh agar investasi aman.`}
              </p>
            </div>
          </div>

          {/* Checklist Grid */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900">Parameter Kunci Kelayakan Ekspansi:</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 1. HDP */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-700 block">Produksi HDP Harian</span>
                  <span className="text-[11px] text-slate-500">Target minimal 75%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">{metrics.hdp}%</span>
                  {isHdpOptimal ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                </div>
              </div>

              {/* 2. FCR */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-700 block">Rasio Pakan (FCR)</span>
                  <span className="text-[11px] text-slate-500">Target &lt;= 2.3</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">{metrics.fcr}</span>
                  {isFcrEfficient ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                </div>
              </div>

              {/* 3. Profit */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-700 block">Laba Bersih Bulanan</span>
                  <span className="text-[11px] text-slate-500">Harus positif (&gt; Rp 0)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-emerald-700">{formatRupiah(metrics.monthlyNetProfit)}</span>
                  {isProfitable ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                </div>
              </div>

              {/* 4. Feed Stock */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-700 block">Cadangan Stok Pakan</span>
                  <span className="text-[11px] text-slate-500">Minimal 15 karung</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900">{metrics.feedStockSacks} karung</span>
                  {hasGoodStock ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation Action Box */}
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
            <h5 className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Building className="w-4 h-4" />
              <span>Rekomendasi Waktu &amp; Kapasitas Tambahan</span>
            </h5>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Berdasarkan performa kawanan saat ini, waktu paling ideal untuk memasukkan batch bibit DOQ atau Pullet baru adalah awal bulan depan di kandang blok pembesaran, sehingga saat puyuh mencapai umur produktif 45 hari, kas operasional berada pada posisi puncak.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigateToExpansion();
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Buka Kalkulator Simulasi Ekspansi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
