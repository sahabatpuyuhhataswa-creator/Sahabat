import React, { useState } from 'react';
import { X, Wheat, Save } from 'lucide-react';

interface EditFeedStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLayerSacks: number;
  currentGrowerSacks: number;
  onSave: (layerSacks: number, growerSacks: number) => void;
}

export const EditFeedStockModal: React.FC<EditFeedStockModalProps> = ({
  isOpen,
  onClose,
  currentLayerSacks,
  currentGrowerSacks,
  onSave,
}) => {
  const [layerSacks, setLayerSacks] = useState<number>(currentLayerSacks);
  const [growerSacks, setGrowerSacks] = useState<number>(currentGrowerSacks);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(Math.max(0, layerSacks), Math.max(0, growerSacks));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-scale-up">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Wheat className="w-4 h-4 text-emerald-400" />
            <span>Edit Stok Pakan Gudang Farm</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
            Perbarui jumlah karung pakan (karung @50kg) yang tersedia di gudang penyimpanan utama Sahabat Puyuh Hataswa.
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Stok Pakan Petelur / Layer (Karung @50kg):
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={layerSacks}
              onChange={(e) => setLayerSacks(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              ~{(layerSacks * 50).toLocaleString('id-ID')} kg pakan layer aktif.
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Stok Pakan Pembesaran / Grower (Karung @50kg):
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={growerSacks}
              onChange={(e) => setGrowerSacks(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              ~{(growerSacks * 50).toLocaleString('id-ID')} kg pakan starter/grower.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Stok Pakan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
