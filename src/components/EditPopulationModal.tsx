import React, { useState, useEffect } from 'react';
import { PopulationRecord } from '../types/quail';
import { formatNumber } from '../utils/calculations';
import { X, Activity, Check, Sparkles, AlertCircle, Bird, HelpCircle } from 'lucide-react';

interface EditPopulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  latestLayerCount: number;
  latestGrowerCount: number;
  editingRecord: PopulationRecord | null;
  focusFlockType?: 'all' | 'grower' | 'layer';
  onSaveActivePopulation: (data: {
    layerCount: number;
    growerCount: number;
    notes: string;
    date: string;
  }) => void;
  onUpdateRecord: (record: PopulationRecord) => void;
}

export const EditPopulationModal: React.FC<EditPopulationModalProps> = ({
  isOpen,
  onClose,
  latestLayerCount,
  latestGrowerCount,
  editingRecord,
  focusFlockType = 'all',
  onSaveActivePopulation,
  onUpdateRecord,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Mode: if editingRecord is set, edit that specific record. Otherwise, adjust overall active population.
  const isEditingSingleRecord = !!editingRecord;

  // Selected flock filter tab for editing
  const [selectedTab, setSelectedTab] = useState<'all' | 'grower' | 'layer'>(focusFlockType);

  // Active Population Form State (Mode 1)
  const [layerCount, setLayerCount] = useState<number>(latestLayerCount || 5000);
  const [growerCount, setGrowerCount] = useState<number>(latestGrowerCount || 1450);
  const [adjustDate, setAdjustDate] = useState<string>(todayStr);
  const [adjustNotes, setAdjustNotes] = useState<string>('Penyesuaian sensus mandiri peternak');

  // Single Record Form State (Mode 2)
  const [singleDate, setSingleDate] = useState<string>(todayStr);
  const [singleFlockType, setSingleFlockType] = useState<'Layer (Petelur)' | 'Pembesaran (Starter/Grower)'>('Layer (Petelur)');
  const [singleBatchName, setSingleBatchName] = useState<string>('');
  const [singleStartingCount, setSingleStartingCount] = useState<number>(0);
  const [singleMortality, setSingleMortality] = useState<number>(0);
  const [singleCulled, setSingleCulled] = useState<number>(0);
  const [singleAdditions, setSingleAdditions] = useState<number>(0);
  const [singleTransferred, setSingleTransferred] = useState<number>(0);
  const [singleActiveCount, setSingleActiveCount] = useState<number>(0);
  const [singleAgeDays, setSingleAgeDays] = useState<number>(0);
  const [singleMortalityReason, setSingleMortalityReason] = useState<string>('');
  const [singleNotes, setSingleNotes] = useState<string>('');

  useEffect(() => {
    setSelectedTab(focusFlockType || 'all');
  }, [focusFlockType, isOpen]);

  useEffect(() => {
    if (editingRecord) {
      setSingleDate(editingRecord.date);
      setSingleFlockType(editingRecord.flockType);
      setSingleBatchName(editingRecord.batchName || '');
      setSingleStartingCount(editingRecord.startingCount);
      setSingleMortality(editingRecord.mortalityCount);
      setSingleCulled(editingRecord.culledCount);
      setSingleAdditions(editingRecord.additionsCount);
      setSingleTransferred(editingRecord.transferredCount || 0);
      setSingleActiveCount(editingRecord.activeCount);
      setSingleAgeDays(editingRecord.ageDays || 0);
      setSingleMortalityReason(editingRecord.mortalityReason || '');
      setSingleNotes(editingRecord.notes || '');
    } else {
      setLayerCount(latestLayerCount || 5000);
      setGrowerCount(latestGrowerCount || 1450);
      setAdjustDate(todayStr);
      setAdjustNotes(
        focusFlockType === 'grower'
          ? 'Penyesuaian populasi pembesaran (grower) mandiri'
          : focusFlockType === 'layer'
          ? 'Penyesuaian populasi puyuh petelur mandiri'
          : 'Penyesuaian populasi mandiri peternak'
      );
    }
  }, [editingRecord, latestLayerCount, latestGrowerCount, isOpen, focusFlockType]);

  // Auto-calculate single active count when sub-values change
  const handleRecalculateSingle = (
    start: number,
    mort: number,
    cull: number,
    add: number,
    trans: number
  ) => {
    const calc = Math.max(0, start - mort - cull - trans + add);
    setSingleActiveCount(calc);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditingSingleRecord && editingRecord) {
      onUpdateRecord({
        ...editingRecord,
        date: singleDate,
        flockType: singleFlockType,
        batchName: singleBatchName || undefined,
        startingCount: Number(singleStartingCount),
        mortalityCount: Number(singleMortality),
        culledCount: Number(singleCulled),
        additionsCount: Number(singleAdditions),
        transferredCount: Number(singleTransferred),
        activeCount: Number(singleActiveCount),
        ageDays: Number(singleAgeDays) || undefined,
        mortalityReason: singleMortalityReason || undefined,
        notes: singleNotes || undefined,
      });
    } else {
      onSaveActivePopulation({
        layerCount: Number(layerCount),
        growerCount: Number(growerCount),
        notes: adjustNotes,
        date: adjustDate,
      });
    }
    onClose();
  };

  const totalBirds = Number(layerCount) + Number(growerCount);
  const estimatedLayerFeedKg = ((Number(layerCount) * 23) / 1000).toFixed(1);
  const estimatedGrowerFeedKg = ((Number(growerCount) * 15) / 1000).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <Activity className="w-5 h-5 text-rose-400" />
            <span>
              {isEditingSingleRecord
                ? 'Edit Data Catatan Sensus'
                : 'Edit / Atur Jumlah Populasi Puyuh'}
            </span>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-slate-700">
          {!isEditingSingleRecord ? (
            <>
              {/* Category selector tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSelectedTab('all')}
                  className={`flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-lg transition ${
                    selectedTab === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({formatNumber(totalBirds)})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTab('grower')}
                  className={`flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1 ${
                    selectedTab === 'grower'
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-blue-700 hover:text-blue-900'
                  }`}
                >
                  <span>🐣 Pembesar ({formatNumber(growerCount)})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTab('layer')}
                  className={`flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1 ${
                    selectedTab === 'layer'
                      ? 'bg-amber-600 text-white shadow-xs font-bold'
                      : 'text-amber-800 hover:text-amber-950'
                  }`}
                >
                  <span>🥚 Layer ({formatNumber(layerCount)})</span>
                </button>
              </div>

              {/* Info banner */}
              <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                selectedTab === 'grower' 
                  ? 'bg-blue-50 border-blue-200 text-blue-900' 
                  : selectedTab === 'layer'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <Bird className={`w-4 h-4 mt-0.5 shrink-0 ${
                  selectedTab === 'grower' ? 'text-blue-600' : 'text-amber-600'
                }`} />
                <p className="text-[11px] leading-relaxed">
                  {selectedTab === 'grower' ? (
                    <>
                      <b>Populasi Pembesaran (Grower/Starter DOQ):</b> Burung puyuh fase pembesaran di kandang brooding umur 1–35 hari. Perubahan angka ini akan menyesuaikan estimasi pakan starter (~15g/ekor/hari) dan proyeksi regenerasi kawanan.
                    </>
                  ) : selectedTab === 'layer' ? (
                    <>
                      <b>Populasi Petelur (Layer):</b> Puyuh betina produktif yang aktif bertelur (umur &gt;40 hari). Mengubah angka ini akan memperbarui persentase Hen Day Production (HDP %), rasio konversi pakan (FCR), dan proyeksi hasil panen.
                    </>
                  ) : (
                    <>
                      Ubah jumlah populasi burung puyuh di kandang Anda secara langsung. Angka ini langsung memperbarui Hen Day (HDP %), estimasi pakan harian, dan analisis laba rugi.
                    </>
                  )}
                </p>
              </div>

              {/* 1. Populasi Petelur (Layer) - Shown if selectedTab is 'all' or 'layer' */}
              {(selectedTab === 'all' || selectedTab === 'layer') && (
                <div className={`space-y-1.5 p-3.5 rounded-xl border transition ${
                  selectedTab === 'layer'
                    ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/20'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      Populasi Puyuh Petelur (Layer) Aktif:
                    </label>
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      Produktif Bertelur
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={layerCount}
                      onChange={(e) => setLayerCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 px-3 py-2 text-base font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <span className="font-semibold text-slate-600">ekor</span>
                  </div>
                  {/* Quick adjustments */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400">Atur cepat:</span>
                    <button
                      type="button"
                      onClick={() => setLayerCount((prev) => Math.max(0, prev - 100))}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      -100
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayerCount((prev) => prev + 100)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      +100
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayerCount((prev) => prev + 500)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      +500
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayerCount(3000)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      3.000
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayerCount(5000)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      5.000
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Populasi Pembesaran (Grower/Starter) - Shown if selectedTab is 'all' or 'grower' */}
              {(selectedTab === 'all' || selectedTab === 'grower') && (
                <div className={`space-y-1.5 p-3.5 rounded-xl border transition ${
                  selectedTab === 'grower'
                    ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20'
                    : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      Populasi Pembesaran (Grower / DOQ) Aktif:
                    </label>
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                      Kandang Brooding
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={growerCount}
                      onChange={(e) => setGrowerCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 px-3 py-2 text-base font-bold text-slate-900 bg-white border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <span className="font-semibold text-slate-600">ekor</span>
                  </div>
                  {/* Quick adjustments for Grower */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400">Atur cepat:</span>
                    <button
                      type="button"
                      onClick={() => setGrowerCount((prev) => Math.max(0, prev - 100))}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      -100
                    </button>
                    <button
                      type="button"
                      onClick={() => setGrowerCount((prev) => Math.max(0, prev - 50))}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      -50
                    </button>
                    <button
                      type="button"
                      onClick={() => setGrowerCount((prev) => prev + 50)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      +50
                    </button>
                    <button
                      type="button"
                      onClick={() => setGrowerCount((prev) => prev + 100)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      +100
                    </button>
                    <button
                      type="button"
                      onClick={() => setGrowerCount((prev) => prev + 250)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      +250
                    </button>
                    <button
                      type="button"
                      onClick={() => setGrowerCount(1000)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      1.000
                    </button>
                    <button
                      type="button"
                      onClick={() => setGrowerCount(1450)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      1.450
                    </button>
                    <button
                      type="button"
                      onClick={() => setGrowerCount(1500)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      1.500
                    </button>
                    <button
                      type="button"
                      onClick={() => setGrowerCount(2000)}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      2.000
                    </button>
                  </div>
                </div>
              )}

              {/* Summary Card */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>Total Populasi Peternakan:</span>
                  <span className="text-sm font-extrabold text-emerald-700">
                    {formatNumber(totalBirds)} ekor
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 flex justify-between">
                  <span>Estimasi Kebutuhan Pakan Total/Hari:</span>
                  <span className="font-semibold">
                    ~{(Number(estimatedLayerFeedKg) + Number(estimatedGrowerFeedKg)).toFixed(1)} kg/hari
                  </span>
                </div>
              </div>

              {/* Tanggal & Alasan Penyesuaian */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tanggal Efektif:
                  </label>
                  <input
                    type="date"
                    required
                    value={adjustDate}
                    onChange={(e) => setAdjustDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Catatan / Alasan:
                  </label>
                  <input
                    type="text"
                    value={adjustNotes}
                    onChange={(e) => setAdjustNotes(e.target.value)}
                    placeholder="misal: Sensus ulang mandiri / Beli puyuh baru"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Single record edit mode */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900">
                Mengedit catatan sensus tanggal <b>{singleDate}</b> untuk <b>{singleFlockType}</b>.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tanggal:
                  </label>
                  <input
                    type="date"
                    required
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Kategori Kawanan:
                  </label>
                  <select
                    value={singleFlockType}
                    onChange={(e) => setSingleFlockType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="Layer (Petelur)">Layer (Petelur)</option>
                    <option value="Pembesaran (Starter/Grower)">Pembesaran (Starter/Grower)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nama Batch / Kandang:
                </label>
                <input
                  type="text"
                  value={singleBatchName}
                  onChange={(e) => setSingleBatchName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                    Populasi Awal:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={singleStartingCount}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setSingleStartingCount(v);
                      handleRecalculateSingle(v, singleMortality, singleCulled, singleAdditions, singleTransferred);
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-rose-600 mb-1">
                    Mati (Ekor):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={singleMortality}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setSingleMortality(v);
                      handleRecalculateSingle(singleStartingCount, v, singleCulled, singleAdditions, singleTransferred);
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-amber-600 mb-1">
                    Afkir (Ekor):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={singleCulled}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setSingleCulled(v);
                      handleRecalculateSingle(singleStartingCount, singleMortality, v, singleAdditions, singleTransferred);
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-emerald-600 mb-1">
                    Mutasi Masuk / Tambah:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={singleAdditions}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0;
                      setSingleAdditions(v);
                      handleRecalculateSingle(singleStartingCount, singleMortality, singleCulled, v, singleTransferred);
                    }}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-900 mb-1">
                    Populasi Akhir (Aktif):
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={singleActiveCount}
                    onChange={(e) => setSingleActiveCount(parseInt(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-extrabold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Penyebab Kematian / Alasan:
                </label>
                <input
                  type="text"
                  value={singleMortalityReason}
                  onChange={(e) => setSingleMortalityReason(e.target.value)}
                  placeholder="Faktor usia, cuaca panas, kanibalisme, dsb."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Catatan Tambahan:
                </label>
                <input
                  type="text"
                  value={singleNotes}
                  onChange={(e) => setSingleNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan Populasi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
