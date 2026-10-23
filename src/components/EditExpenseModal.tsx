import React, { useState, useEffect } from 'react';
import { ExpenseRecord } from '../types/quail';
import { X, Receipt, Save } from 'lucide-react';
import { DecimalInput } from './DecimalInput';

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ExpenseRecord | null;
  onSave: (record: ExpenseRecord) => void;
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<string>('Listrik & Air');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(0);
  const [receiptNo, setReceiptNo] = useState('');
  const [staffName, setStaffName] = useState('');
  const [expenseType, setExpenseType] = useState<'Biasa' | 'Kasbon' | 'Gaji'>('Biasa');

  useEffect(() => {
    if (record) {
      setDate(record.date);
      setCategory(record.category);
      setDescription(record.description);
      setAmount(record.amount);
      setReceiptNo(record.receiptNo || '');
      setStaffName(record.staffName || '');
      setExpenseType(record.expenseType || 'Biasa');
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...record,
      date,
      category: category as any,
      description,
      amount: Number(amount),
      receiptNo: receiptNo || undefined,
      staffName: category === 'Gaji Karyawan' ? staffName : undefined,
      expenseType: category === 'Gaji Karyawan' ? expenseType : 'Biasa',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <Receipt className="w-5 h-5 text-blue-400" />
            <span>Edit Beban Pengeluaran Operasional</span>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tanggal Pengeluaran:
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
                Kategori Biaya:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
              >
                <option value="Listrik & Air">Listrik &amp; Air</option>
                <option value="Vitamin & Obat / Vaksin">Vitamin &amp; Obat</option>
                <option value="Gaji Karyawan">Gaji Karyawan</option>
                <option value="Kemasan Tray & Mika">Kemasan Tray</option>
                <option value="Sekam & Kebersihan">Sekam &amp; Kebersihan</option>
                <option value="Perawatan Kandang">Perawatan Kandang</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Deskripsi Pengeluaran:
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="misal: Pembayaran Listrik PLN Blok Kandang"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
            />
          </div>
          
          {category === 'Gaji Karyawan' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nama Staf:
                </label>
                <select
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                >
                  <option value="Karyawan 1">Karyawan 1</option>
                  <option value="Karyawan 2">Karyawan 2</option>
                  <option value="Karyawan 3">Karyawan 3</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tipe Pengeluaran:
                </label>
                <select
                  value={expenseType}
                  onChange={(e) => setExpenseType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                >
                  <option value="Biasa">Biasa</option>
                  <option value="Kasbon">Kasbon</option>
                  <option value="Gaji">Gaji</option>
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nominal Biaya (Rp):
              </label>
              <DecimalInput
                allowDecimal={false}
                min={0}
                required
                value={amount}
                onChange={(num) => setAmount(num)}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                No. Kuitansi / Ref (Opsional):
              </label>
              <input
                type="text"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                placeholder="misal: KW-2026-001"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              />
            </div>
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
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs transition"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Biaya</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
