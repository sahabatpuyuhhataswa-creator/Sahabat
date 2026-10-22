import React, { useState, useEffect } from 'react';
import { EggRecord } from '../types/quail';
import { X, Egg, Save } from 'lucide-react';
import { DecimalInput } from './DecimalInput';

interface EditEggModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: EggRecord | null;
  onSave: (record: EggRecord) => void;
}

export const EditEggModal: React.FC<EditEggModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const [date, setDate] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<'Pagi' | 'Sore' | 'Total Hari'>('Total Hari');
  const [kandang, setKandang] = useState('');
  const [goodEggsPcs, setGoodEggsPcs] = useState(0);
  const [brokenEggsPcs, setBrokenEggsPcs] = useState(0);
  const [totalWeightKg, setTotalWeightKg] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (record) {
      setDate(record.date);
      setTimeOfDay(record.timeOfDay);
      setKandang(record.kandang);
      setGoodEggsPcs(record.goodEggsPcs);
      setBrokenEggsPcs(record.brokenEggsPcs);
      setTotalWeightKg(record.totalWeightKg);
      setNotes(record.notes || '');
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      ...record,
      date,
      timeOfDay,
      kandang,
      goodEggsPcs: Number(goodEggsPcs),
      brokenEggsPcs: Number(brokenEggsPcs),
      totalWeightKg: Number(totalWeightKg),
      notes: notes || undefined,
    });
    onClose();
  };

  const totalPcs = Number(goodEggsPcs) + Number(brokenEggsPcs);
  const avgWeight = totalPcs > 0 ? ((Number(totalWeightKg) * 1000) / totalPcs).toFixed(1) : '0';
  const brokenRate = totalPcs > 0 ? ((Number(brokenEggsPcs) / totalPcs) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <Egg className="w-5 h-5 text-amber-400" />
            <span>Edit Catatan Panen Harian Telur</span>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
            Perubahan data panen telur ini murni untuk kuantitas produksi harian kandang (butir utuh, retak, dan kg). Transaksi penjualan dicatat secara terpisah di menu Penjualan Telur.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tanggal Panen:
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Waktu Pengambilan:
              </label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
              >
                <option value="Total Hari">Total Hari</option>
                <option value="Pagi">Pagi (07.00 - 09.00)</option>
                <option value="Sore">Sore (15.00 - 17.00)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kandang Asal:
            </label>
            <input
              type="text"
              required
              value={kandang}
              onChange={(e) => setKandang(e.target.value)}
              placeholder="misal: Kandang Petelur (A & B)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                Butir Utuh (Grade A):
              </label>
              <DecimalInput
                allowDecimal={false}
                min={0}
                required
                value={goodEggsPcs}
                onChange={(num) => setGoodEggsPcs(num)}
                placeholder="0"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-rose-600 mb-1">
                Retak / Rusak:
              </label>
              <DecimalInput
                allowDecimal={false}
                min={0}
                value={brokenEggsPcs}
                onChange={(num) => setBrokenEggsPcs(num)}
                placeholder="0"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-rose-600"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-amber-700 mb-1">
                Total Berat (Kg):
              </label>
              <DecimalInput
                allowDecimal={true}
                min={0}
                required
                value={totalWeightKg}
                onChange={(num) => setTotalWeightKg(num)}
                placeholder="0.0"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-2.5 bg-slate-100 rounded-lg text-[11px] text-slate-600">
            <div>
              <span>Rata-rata Bobot: </span>
              <span className="font-bold text-slate-800">{avgWeight} g / butir</span>
            </div>
            <div>
              <span>Tingkat Retak: </span>
              <span className={`font-bold ${Number(brokenRate) <= 1.5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {brokenRate}% {Number(brokenRate) <= 1.5 ? '(Normal)' : '(Tinggi)'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Catatan Kondisi Panen:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Kondisi kerabang tebal, warna bintik pekat, cuaca mendung, dsb."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            />
          </div>

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
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Panen</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
