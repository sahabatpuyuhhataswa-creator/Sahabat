import React, { useState, useMemo } from 'react';
import { EggRecord } from '../types/quail';
import { formatNumber, formatDecimal } from '../utils/calculations';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Egg,
  Scale,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

interface EggTrendChartProps {
  records: EggRecord[];
  activeLayerPopulation?: number;
}

export const EggTrendChart: React.FC<EggTrendChartProps> = ({
  records,
  activeLayerPopulation = 5000,
}) => {
  // Time range selection: 7 hari terakhir (default as requested), 14 hari, atau 30 hari
  const [timeRange, setTimeRange] = useState<'7' | '14' | '30'>('7');

  // Metric display mode: 'pcs' (Jumlah Butir), 'kg' (Total Bobot Kg), 'both' (Kombinasi Butir & Bobot)
  const [displayMode, setDisplayMode] = useState<'both' | 'pcs' | 'kg'>('both');

  // Chart type: 'composed' (Area + Bar + Line) or 'bar' (Stacked Bar)
  const [chartType, setChartType] = useState<'composed' | 'bar'>('composed');

  // Prepare and sort records chronologically
  const chartData = useMemo(() => {
    const daysCount = parseInt(timeRange, 10);
    // Sort ascending by date
    const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date));
    const sliced = sorted.slice(-daysCount);

    const indonesianDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const indonesianMonths = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    return sliced.map((r) => {
      const dateObj = new Date(r.date + 'T00:00:00');
      const dayName = !isNaN(dateObj.getTime()) ? indonesianDays[dateObj.getDay()] : '';
      const dayNum = r.date.slice(8);
      const monthNum = parseInt(r.date.slice(5, 7), 10) - 1;
      const monthName = indonesianMonths[monthNum] || '';

      const totalPcs = (r.goodEggsPcs || 0) + (r.brokenEggsPcs || 0);
      const goodPcs = r.goodEggsPcs || 0;
      const brokenPcs = r.brokenEggsPcs || 0;
      const weightKg = r.totalWeightKg || 0;
      const hdp = activeLayerPopulation > 0
        ? Number(((totalPcs / activeLayerPopulation) * 100).toFixed(1))
        : 0;
      const brokenRate = totalPcs > 0
        ? Number(((brokenPcs / totalPcs) * 100).toFixed(2))
        : 0;
      const avgEggWeightG = totalPcs > 0
        ? Number(((weightKg * 1000) / totalPcs).toFixed(1))
        : 0;

      return {
        id: r.id,
        rawDate: r.date,
        formattedDate: `${dayName}, ${dayNum} ${monthName}`,
        shortDate: `${dayNum} ${monthName}`,
        dayLabel: `${dayName} (${dayNum})`,
        totalPcs,
        goodPcs,
        brokenPcs,
        weightKg,
        hdp,
        brokenRate,
        avgEggWeightG,
        targetPcs: Math.round(activeLayerPopulation * 0.8), // 80% benchmark target
      };
    });
  }, [records, timeRange, activeLayerPopulation]);

  // Summary statistics for the chosen time range (7 days)
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return {
        totalEggs: 0,
        totalWeightKg: 0,
        avgDailyEggs: 0,
        avgDailyKg: 0,
        avgHdp: 0,
        avgBrokenRate: 0,
        bestDay: null as null | { date: string; pcs: number },
      };
    }

    const totalEggs = chartData.reduce((acc, curr) => acc + curr.totalPcs, 0);
    const totalGood = chartData.reduce((acc, curr) => acc + curr.goodPcs, 0);
    const totalBroken = chartData.reduce((acc, curr) => acc + curr.brokenPcs, 0);
    const totalWeightKg = chartData.reduce((acc, curr) => acc + curr.weightKg, 0);
    const avgDailyEggs = Math.round(totalEggs / chartData.length);
    const avgDailyKg = Number((totalWeightKg / chartData.length).toFixed(1));
    const avgHdp = Number(((chartData.reduce((acc, curr) => acc + curr.hdp, 0)) / chartData.length).toFixed(1));
    const avgBrokenRate = totalEggs > 0 ? Number(((totalBroken / totalEggs) * 100).toFixed(2)) : 0;

    const sortedByPcs = [...chartData].sort((a, b) => b.totalPcs - a.totalPcs);
    const bestDay = sortedByPcs[0] ? { date: sortedByPcs[0].formattedDate, pcs: sortedByPcs[0].totalPcs } : null;

    return {
      totalEggs,
      totalGood,
      totalBroken,
      totalWeightKg: Number(totalWeightKg.toFixed(1)),
      avgDailyEggs,
      avgDailyKg,
      avgHdp,
      avgBrokenRate,
      bestDay,
    };
  }, [chartData]);

  // Benchmark target pcs for Layer population at 80% HDP
  const targetPcs = Math.round(activeLayerPopulation * 0.8);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-slate-700/80 text-xs min-w-[210px] animate-scale-up">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="font-bold text-amber-400">{data.formattedDate}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              data.hdp >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
            }`}>
              HDP: {data.hdp}%
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Total Panen Telur:
              </span>
              <span className="font-extrabold text-white tabular-nums">
                {formatNumber(data.totalPcs)} butir
              </span>
            </div>

            <div className="flex items-center justify-between pl-3 text-[10px]">
              <span className="text-slate-400">· Utuh (Grade A):</span>
              <span className="font-bold text-emerald-400 tabular-nums">
                {formatNumber(data.goodPcs)} btr
              </span>
            </div>

            <div className="flex items-center justify-between pl-3 text-[10px]">
              <span className="text-slate-400">· Retak / Rusak:</span>
              <span className="font-bold text-rose-400 tabular-nums">
                {data.brokenPcs} btr ({data.brokenRate}%)
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Scale className="w-3 h-3 text-cyan-400" />
                Total Timbangan:
              </span>
              <span className="font-bold text-cyan-300 tabular-nums">
                {formatDecimal(data.weightKg)} kg
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Rata-rata Bobot:</span>
              <span className="font-semibold text-slate-200 tabular-nums">
                {data.avgEggWeightG} g / butir
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header section with title and quick range controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Visualisasi Recharts Interaktif</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Tren Jumlah Telur Harian ({timeRange === '7' ? '7 Hari Terakhir' : `${timeRange} Hari`})</span>
            {timeRange === '7' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                Fokus Produktivitas
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Grafik pemantauan kuantitas butir telur (Grade A &amp; retak), total bobot (kg), dan target produktivitas kawanan puyuh.
          </p>
        </div>

        {/* Controls: Range & View mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setTimeRange('7')}
              className={`px-3 py-1.5 font-bold rounded-lg transition ${
                timeRange === '7'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('14')}
              className={`px-2.5 py-1.5 font-medium rounded-lg transition ${
                timeRange === '14'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              14 Hari
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('30')}
              className={`px-2.5 py-1.5 font-medium rounded-lg transition ${
                timeRange === '30'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Hari
            </button>
          </div>

          {/* Metric Selector */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setDisplayMode('both')}
              className={`px-2.5 py-1.5 font-semibold rounded-lg transition ${
                displayMode === 'both'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tampilkan Butir dan Bobot (Kg)"
            >
              Semua (Butir &amp; Kg)
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('pcs')}
              className={`px-2.5 py-1.5 font-semibold rounded-lg transition ${
                displayMode === 'pcs'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Fokus Jumlah Butir Telur"
            >
              Butir (Pcs)
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('kg')}
              className={`px-2.5 py-1.5 font-semibold rounded-lg transition ${
                displayMode === 'kg'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Fokus Bobot Timbangan (Kg)"
            >
              Bobot (Kg)
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlights Bar for the selected 7-day period */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50/70 border-b border-slate-100 text-xs">
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
            <span>Total Panen ({timeRange} Hari)</span>
            <Egg className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-base sm:text-lg font-extrabold text-slate-900 mt-1 tabular-nums">
            {formatNumber(stats.totalEggs)} <span className="text-xs font-normal text-slate-500">butir</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Total Berat: <b className="text-slate-700">{formatDecimal(stats.totalWeightKg)} kg</b>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
            <span>Rata-rata Butir / Hari</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-base sm:text-lg font-extrabold text-emerald-700 mt-1 tabular-nums">
            {formatNumber(stats.avgDailyEggs)} <span className="text-xs font-normal text-slate-500">butir/hari</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Bobot rata-rata: <b className="text-slate-700">~{stats.avgDailyKg} kg/hari</b>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
            <span>Rata-rata Hen-Day (HDP)</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-base sm:text-lg font-extrabold text-blue-700 mt-1 tabular-nums">
            {stats.avgHdp}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Target Standar: <b className="text-emerald-600">&gt;80%</b> ({formatNumber(targetPcs)} btr)
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
            <span>Rasio Telur Retak</span>
            <AlertCircle className={`w-3.5 h-3.5 ${stats.avgBrokenRate <= 1.5 ? 'text-emerald-500' : 'text-rose-500'}`} />
          </div>
          <div className={`text-base sm:text-lg font-extrabold mt-1 tabular-nums ${
            stats.avgBrokenRate <= 1.5 ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {stats.avgBrokenRate}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {stats.avgBrokenRate <= 1.5 ? 'Kualitas kerabang sangat kuat' : 'Perlu cek kalsium pakan'}
          </div>
        </div>
      </div>

      {/* Main Recharts Area */}
      <div className="p-4 sm:p-5">
        <div className="h-72 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 15, right: displayMode === 'both' ? 20 : 10, left: 0, bottom: 5 }}
            >
              <defs>
                {/* Gradient for Good Eggs Area */}
                <linearGradient id="eggGoodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                </linearGradient>

                {/* Gradient for Weight Kg */}
                <linearGradient id="eggWeightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

              {/* X Axis */}
              <XAxis
                dataKey="shortDate"
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                dy={6}
              />

              {/* Primary Y Axis (Jumlah Butir Telur) */}
              {(displayMode === 'both' || displayMode === 'pcs') && (
                <YAxis
                  yAxisId="pcs"
                  orientation="left"
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  domain={['dataMin - 200', 'dataMax + 150']}
                  tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`}
                />
              )}

              {/* Secondary Y Axis (Total Bobot Kg) */}
              {(displayMode === 'both' || displayMode === 'kg') && (
                <YAxis
                  yAxisId="kg"
                  orientation={displayMode === 'kg' ? 'left' : 'right'}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tick={{ fill: '#0891b2', fontSize: 10, fontWeight: 600 }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(val) => `${val}kg`}
                />
              )}

              {/* Interactive Tooltip */}
              <Tooltip content={<CustomTooltip />} />

              {/* Target Line at 80% Hen-Day Production */}
              {(displayMode === 'both' || displayMode === 'pcs') && (
                <ReferenceLine
                  yAxisId="pcs"
                  y={targetPcs}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Target 80% (${formatNumber(targetPcs)} btr)`,
                    fill: '#059669',
                    fontSize: 10,
                    fontWeight: 600,
                    position: 'insideTopLeft',
                  }}
                />
              )}

              {/* Visual layers based on displayMode */}
              {(displayMode === 'both' || displayMode === 'pcs') && (
                <>
                  {/* Area gradient for Butir Utuh */}
                  <Area
                    yAxisId="pcs"
                    type="monotone"
                    dataKey="goodPcs"
                    name="Butir Utuh (Grade A)"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#eggGoodGradient)"
                    activeDot={{ r: 6, fill: '#d97706', stroke: '#fff', strokeWidth: 2 }}
                  />

                  {/* Stacked or layered Bar for Retak / Rusak */}
                  <Bar
                    yAxisId="pcs"
                    dataKey="brokenPcs"
                    name="Telur Retak / Rusak"
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={16}
                  />
                </>
              )}

              {/* Line for Weight (Kg) */}
              {(displayMode === 'both' || displayMode === 'kg') && (
                <Line
                  yAxisId="kg"
                  type="monotone"
                  dataKey="weightKg"
                  name="Bobot Panen (Kg)"
                  stroke="#0891b2"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#0891b2', stroke: '#fff', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, fill: '#0891b2', stroke: '#fff', strokeWidth: 2 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Annotation footer */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-500 inline-block shadow-xs" />
              <span className="font-semibold text-slate-700">Butir Utuh (Grade A)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-rose-500 inline-block" />
              <span className="font-semibold text-slate-700">Retak / Rusak</span>
            </div>
            {(displayMode === 'both' || displayMode === 'kg') && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-full bg-cyan-600 inline-block" />
                <span className="font-semibold text-slate-700">Bobot Timbangan (Kg)</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span className="inline-block w-4 border-t-2 border-dashed border-emerald-500" />
              <span className="font-medium">Target HDP 80% ({formatNumber(targetPcs)} butir)</span>
            </div>
          </div>

          {stats.bestDay && (
            <div className="text-[11px] font-medium text-slate-600 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Puncak Produksi: <b>{stats.bestDay.date}</b> ({formatNumber(stats.bestDay.pcs)} btr)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
