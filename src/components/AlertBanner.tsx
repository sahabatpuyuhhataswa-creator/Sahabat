import React, { useState, useMemo } from 'react';
import { EggRecord, FeedRecord, PopulationRecord, EggSaleRecord, FarmMetrics, FarmAlert } from '../types/quail';
import { formatRupiah, formatNumber } from '../utils/calculations';
import {
  AlertTriangle,
  AlertCircle,
  Bell,
  X,
  Wheat,
  Activity,
  Egg,
  Clock,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface AlertBannerProps {
  metrics: FarmMetrics;
  eggRecords: EggRecord[];
  feedRecords: FeedRecord[];
  populationRecords: PopulationRecord[];
  eggSaleRecords: EggSaleRecord[];
  onNavigateTab: (tab: any) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  metrics,
  eggRecords,
  feedRecords,
  populationRecords,
  eggSaleRecords,
  onNavigateTab,
}) => {
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate live alerts
  const alerts: FarmAlert[] = useMemo(() => {
    const list: FarmAlert[] = [];

    // 1. Pakan Mau Habis (< 3 Hari Stok Tersisa)
    // Layer feed daily ~115kg. Total sacks * 50kg / 115kg
    const remainingDays = metrics.feedStockSacks > 0
      ? Math.round((metrics.feedStockSacks * 50) / 115)
      : 0;

    if (remainingDays < 3) {
      list.push({
        id: 'alert-feed-low',
        type: 'critical',
        category: 'pakan',
        title: 'Peringatan: Stok Ransum Pakan Menipis!',
        message: `Sisa stok pakan diperkirakan hanya cukup untuk ${remainingDays} hari (${metrics.feedStockSacks} karung). Segera lakukan pemesanan pakan Malindo KL-2 untuk mencegah penurunan produksi telur.`,
        actionLabel: 'Lihat Stok Pakan',
        actionTab: 'pakan',
        date: todayStr,
      });
    }

    // 2. Mortalitas Melonjak (> 0.5% populasi dalam 1 hari)
    const sortedPop = [...populationRecords].sort((a, b) => b.date.localeCompare(a.date));
    const latestPop = sortedPop[0];
    if (latestPop && metrics.activePopulation > 0) {
      const dailyMortalityPercent = (latestPop.mortalityCount / metrics.activePopulation) * 100;
      if (dailyMortalityPercent > 0.5 || latestPop.mortalityCount >= 25) {
        list.push({
          id: 'alert-mortality-high',
          type: 'critical',
          category: 'mortalitas',
          title: 'Waspada: Lonjakan Kematian Puyuh (>0.5%)',
          message: `Kematian tercatat ${latestPop.mortalityCount} ekor (${dailyMortalityPercent.toFixed(2)}%) pada tanggal ${latestPop.date}. Alasan: "${latestPop.mortalityReason || 'Tidak diketahui'}". Segera periksa ventilasi udara, suhu brooder, dan berikan vitamin anti-stres.`,
          actionLabel: 'Cek Data Populasi',
          actionTab: 'populasi',
          date: latestPop.date,
        });
      }
    }

    // 3. Hasil Telur Drop Mendadak (> 5% penurunan produksi dibanding hari sebelumnya)
    const sortedEggs = [...eggRecords].sort((a, b) => b.date.localeCompare(a.date));
    if (sortedEggs.length >= 2) {
      const todayTotal = (sortedEggs[0].goodEggsPcs || 0) + (sortedEggs[0].brokenEggsPcs || 0);
      const yesterdayTotal = (sortedEggs[1].goodEggsPcs || 0) + (sortedEggs[1].brokenEggsPcs || 0);

      if (yesterdayTotal > 0) {
        const dropPercent = ((yesterdayTotal - todayTotal) / yesterdayTotal) * 100;
        if (dropPercent > 5) {
          list.push({
            id: 'alert-egg-drop',
            type: 'warning',
            category: 'produksi',
            title: 'Penurunan Produksi Telur Mendadak (>5%)',
            message: `Produksi telur turun ${dropPercent.toFixed(1)}% dari ${formatNumber(yesterdayTotal)} butir (${sortedEggs[1].date}) menjadi ${formatNumber(todayTotal)} butir (${sortedEggs[0].date}). Periksa kecukupan air minum, kebisingan, atau perubahan formula pakan.`,
            actionLabel: 'Pantau Panen Telur',
            actionTab: 'telur',
            date: sortedEggs[0].date,
          });
        }
      }
    }

    // 4. Piutang Pelanggan Jatuh Tempo
    const overdueReceivables = eggSaleRecords.filter((s) => {
      if (s.paymentStatus === 'Piutang' && s.dueDate) {
        return s.dueDate <= todayStr;
      }
      return false;
    });

    if (overdueReceivables.length > 0) {
      const totalOverdue = overdueReceivables.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0);
      list.push({
        id: 'alert-receivable-due',
        type: 'warning',
        category: 'piutang',
        title: `${overdueReceivables.length} Piutang Penjualan Telur Melewati Jatuh Tempo`,
        message: `Terdapat tagihan piutang senilai ${formatRupiah(totalOverdue)} dari ${overdueReceivables.map((s) => s.buyerName).join(', ')} yang telah jatuh tempo. Lakukan penagihan via WhatsApp.`,
        actionLabel: 'Buka Penjualan & Tagih',
        actionTab: 'penjualan-telur',
        date: todayStr,
      });
    }

    return list;
  }, [metrics, eggRecords, feedRecords, populationRecords, eggSaleRecords, todayStr]);

  const activeAlerts = alerts.filter((a) => !dismissedAlerts.includes(a.id));

  if (activeAlerts.length === 0) return null;

  const topAlert = activeAlerts[0];

  return (
    <>
      {/* Banner Ringkas di Atas Halaman */}
      <div
        className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-scale-up ${
          topAlert.type === 'critical'
            ? 'bg-rose-50 border-rose-300 text-rose-950'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl shrink-0 mt-0.5 ${
              topAlert.type === 'critical' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-950 font-bold'
            }`}
          >
            <AlertTriangle className="w-4 h-4 animate-bounce" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs tracking-tight">{topAlert.title}</span>
              {activeAlerts.length > 1 && (
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-white border border-current shadow-2xs">
                  +{activeAlerts.length - 1} Peringatan Lain
                </span>
              )}
            </div>
            <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
              {topAlert.message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {topAlert.actionTab && (
            <button
              onClick={() => onNavigateTab(topAlert.actionTab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs ${
                topAlert.type === 'critical'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              <span>{topAlert.actionLabel || 'Tinjau Sekarang'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {activeAlerts.length > 1 && (
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/80 hover:bg-white text-slate-700 border border-slate-300 transition"
            >
              Lihat Semua ({activeAlerts.length})
            </button>
          )}

          <button
            onClick={() => setDismissedAlerts((prev) => [...prev, topAlert.id])}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            title="Tutup Peringatan Ini"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full Modal List Peringatan */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Pusat Notifikasi &amp; Alert Lapangan ({activeAlerts.length})</span>
              </div>
              <button
                onClick={() => setIsAlertModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {activeAlerts.map((a) => (
                <div
                  key={a.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    a.type === 'critical'
                      ? 'bg-rose-50 border-rose-200 text-rose-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className={`w-3.5 h-3.5 ${a.type === 'critical' ? 'text-rose-600' : 'text-amber-600'}`} />
                      <span>{a.title}</span>
                    </span>
                    <span className="text-[10px] opacity-75">{a.date}</span>
                  </div>

                  <p className="text-[11px] opacity-90 leading-relaxed">{a.message}</p>

                  <div className="flex justify-end pt-1">
                    {a.actionTab && (
                      <button
                        onClick={() => {
                          setIsAlertModalOpen(false);
                          onNavigateTab(a.actionTab);
                        }}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 transition"
                      >
                        {a.actionLabel || 'Tinjau'} &rarr;
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
