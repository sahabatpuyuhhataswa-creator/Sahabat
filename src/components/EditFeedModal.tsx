import React, { useState, useEffect } from 'react';
import { FeedRecord } from '../types/quail';
import { X, Wheat, Save } from 'lucide-react';
import { DecimalInput } from './DecimalInput';
import { formatRupiah } from '../utils/calculations';

interface EditFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: FeedRecord | null;
  onSave: (record: FeedRecord) => void;
}

export const EditFeedModal: React.FC<EditFeedModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const [date, setDate] = useState('');
  const [feedCategory, setFeedCategory] = useState<'Pakan Petelur (Layer)' | 'Pakan Pembesaran (Starter/Grower)'>('Pakan Petelur (Layer)');
  const [feedBrand, setFeedBrand] = useState('');
  const [feedType, setFeedType] = useState('');
  const [quantityKg, setQuantityKg] = useState(0);
  const [sackCount, setSackCount] = useState(0);
  const [pricePerKg, setPricePerKg] = useState(0);
  const [targetFlock, setTargetFlock] = useState('');

  useEffect(() => {
    if (record) {
      setDate(record.date);
      setFeedCategory(record.feedCategory);
      setFeedBrand(record.feedBrand);
      setFeedType(record.feedType);
      setQuantityKg(record.quantityKg);
      setSackCount(record.sackCount);
      setPricePerKg(record.pricePerKg);
      setTargetFlock(record.targetFlock);
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantityKg);
    const price = Number(pricePerKg);
    const totalCost = qty * price;

    onSave({
      ...record,
      date,
      feedCategory,
      feedBrand,
      feedType: feedType as any,
      quantityKg: qty,
      sackCount: Number(sackCount),
      pricePerKg: price,
      totalCost,
      targetFlock: targetFlock as any,
    });
    onClose();
  };

  const calculatedTotal = Number(quantityKg) * Number(pricePerKg);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <Wheat className="w-5 h-5 text-emerald-400" />
            <span>Edit Catatan &amp; Stok Pakan</span>
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
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 leading-relaxed">
            Perubahan stok pakan dan harga akan otomatis memperbarui perhitungan FCR, beban pakan, dan persediaan aktif di server.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tanggal Catat:
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
                Kategori Ransum:
              </label>
              <select
                value={feedCategory}
                onChange={(e) => setFeedCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
              >
                <option value="Pakan Petelur (Layer)">Pakan Petelur (Layer)</option>
                <option value="Pakan Pembesaran (Starter/Grower)">Pakan Pembesaran (Grower)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Merek Ransum:
              </label>
              <input
                type="text"
                required
                value={feedBrand}
                onChange={(e) => setFeedBrand(e.target.value)}
                placeholder="misal: Pokphand 144 / Japfa"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Jenis / Bentuk:
              </label>
              <input
                type="text"
                required
                value={feedType}
                onChange={(e) => setFeedType(e.target.value)}
                placeholder="misal: Crumble / Mash"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Berat (Kg):
              </label>
              <DecimalInput
                allowDecimal={true}
                min={0}
                required
                value={quantityKg}
                onChange={(num) => setQuantityKg(num)}
                placeholder="0"
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Jumlah Karung (Sak):
              </label>
              <DecimalInput
                allowDecimal={false}
                min={0}
                required
                value={sackCount}
                onChange={(num) => setSackCount(num)}
                placeholder="0"
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Harga / Kg (Rp):
              </label>
              <DecimalInput
                allowDecimal={false}
                min={0}
                required
                value={pricePerKg}
                onChange={(num) => setPricePerKg(num)}
                placeholder="0"
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Peruntukan Kandang:
            </label>
            <input
              type="text"
              required
              value={targetFlock}
              onChange={(e) => setTargetFlock(e.target.value)}
              placeholder="misal: Blok A & B / Kandang Utama"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
            />
          </div>

          <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Estimasi Total Biaya Ransum:</span>
            <span className="text-emerald-700 text-sm">{formatRupiah(calculatedTotal)}</span>
          </div>

          {/* Footer buttons */}
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
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Pakan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
