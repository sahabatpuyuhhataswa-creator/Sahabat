import React, { useState, useEffect } from 'react';
import { EggSaleRecord } from '../types/quail';
import { formatRupiah } from '../utils/calculations';
import { X, ShoppingBag, Save } from 'lucide-react';
import { DecimalInput } from './DecimalInput';

interface EditEggSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: EggSaleRecord | null;
  onSave: (record: EggSaleRecord) => void;
}

export const EditEggSaleModal: React.FC<EditEggSaleModalProps> = ({
  isOpen,
  onClose,
  record,
  onSave,
}) => {
  const [date, setDate] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [customerType, setCustomerType] = useState<
    'Pengepul Besar' | 'Agen Telur' | 'Warung/Retail' | 'Konsumen Langsung'
  >('Pengepul Besar');
  const [eggGrade, setEggGrade] = useState<
    'Telur Utuh / Grade A (Konsumsi)' | 'Telur Retak / Pecah Kulit (Diskon)' | 'Telur Asin / Olahan' | 'Campur / Partai Besar'
  >('Telur Utuh / Grade A (Konsumsi)');
  const [quantityKg, setQuantityKg] = useState(0);
  const [quantityPcs, setQuantityPcs] = useState(0);
  const [trayCount, setTrayCount] = useState(0);
  const [pricePerKg, setPricePerKg] = useState(33000);
  const [paymentStatus, setPaymentStatus] = useState<'Lunas' | 'Piutang' | 'DP / Uang Muka'>('Lunas');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'Transfer Bank' | 'QRIS'>('Transfer Bank');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (record) {
      setDate(record.date);
      setBuyerName(record.buyerName);
      setCustomerType(record.customerType || 'Pengepul Besar');
      setEggGrade(record.eggGrade);
      setQuantityKg(record.quantityKg);
      setQuantityPcs(record.quantityPcs || Math.round(record.quantityKg * 90));
      setTrayCount(record.trayCount || Math.round(record.quantityKg));
      setPricePerKg(record.pricePerKg);
      setPaymentStatus(record.paymentStatus);
      setPaymentMethod(record.paymentMethod);
      setDueDate(record.dueDate || '');
      setNotes(record.notes || '');
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const calculatedRevenue = Math.round(Number(quantityKg) * Number(pricePerKg));

  const handleKgChange = (val: number) => {
    setQuantityKg(val);
    setQuantityPcs(Math.round(val * 90));
    setTrayCount(Math.round(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      ...record,
      date,
      buyerName,
      customerType,
      eggGrade,
      quantityKg: Number(quantityKg),
      quantityPcs: Number(quantityPcs),
      trayCount: Number(trayCount),
      pricePerKg: Number(pricePerKg),
      totalRevenue: calculatedRevenue,
      paymentStatus,
      paymentMethod,
      dueDate: paymentStatus === 'Piutang' && dueDate ? dueDate : undefined,
      notes: notes || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-up my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span>Edit Nota Penjualan Telur Puyuh</span>
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
                Tanggal Transaksi:
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
                Tipe Pelanggan:
              </label>
              <select
                value={customerType}
                onChange={(e) => setCustomerType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
              >
                <option value="Pengepul Besar">Pengepul Besar</option>
                <option value="Agen Telur">Agen Telur</option>
                <option value="Warung/Retail">Warung / Rumah Makan (Soto/Pecel)</option>
                <option value="Konsumen Langsung">Konsumen Langsung</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Nama Pembeli / Agen:
            </label>
            <input
              type="text"
              required
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              placeholder="Contoh: Pengepul Pak Slamet (Pasar Induk)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Kategori / Grade Telur:
            </label>
            <select
              value={eggGrade}
              onChange={(e) => setEggGrade(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
            >
              <option value="Telur Utuh / Grade A (Konsumsi)">Telur Utuh / Grade A (Konsumsi)</option>
              <option value="Telur Retak / Pecah Kulit (Diskon)">Telur Retak / Pecah Kulit (Diskon Kuliner)</option>
              <option value="Telur Asin / Olahan">Telur Asin / Olahan</option>
              <option value="Campur / Partai Besar">Campur / Partai Besar</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[10px] font-semibold text-slate-700 mb-1">
                Volume (Kg):
              </label>
              <DecimalInput
                allowDecimal={true}
                min={0}
                required
                value={quantityKg}
                onChange={(num) => handleKgChange(num)}
                placeholder="0.0"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-extrabold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                Estimasi Butir:
              </label>
              <DecimalInput
                allowDecimal={false}
                min={0}
                value={quantityPcs}
                onChange={(num) => setQuantityPcs(num)}
                placeholder="0"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                Jumlah Tray/Baki:
              </label>
              <DecimalInput
                allowDecimal={false}
                min={0}
                value={trayCount}
                onChange={(num) => setTrayCount(num)}
                placeholder="0"
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Harga Jual per Kg (Rp):
              </label>
              <DecimalInput
                allowDecimal={false}
                min={0}
                required
                value={pricePerKg}
                onChange={(num) => setPricePerKg(num)}
                placeholder="33000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Total Transaksi (Omzet):
              </label>
              <div className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-extrabold text-emerald-700 tabular-nums">
                {formatRupiah(calculatedRevenue)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Metode Pembayaran:
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
              >
                <option value="Tunai">Tunai / Cash</option>
                <option value="Transfer Bank">Transfer Bank (BCA/Mandiri/BRI)</option>
                <option value="QRIS">QRIS Hataswa</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Status Pembayaran:
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
              >
                <option value="Lunas">Lunas</option>
                <option value="Piutang">Piutang (Tempo)</option>
                <option value="DP / Uang Muka">DP / Uang Muka</option>
              </select>
            </div>
          </div>

          {paymentStatus === 'Piutang' && (
            <div>
              <label className="block text-[11px] font-semibold text-amber-700 mb-1">
                Tanggal Jatuh Tempo Piutang:
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg text-xs font-semibold text-amber-900"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Catatan Penjualan / Pengiriman:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nomor resi, alamat warung, atau keterangan pembayaran..."
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Penjualan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
