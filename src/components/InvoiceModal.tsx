import React, { useState } from 'react';
import { CustomerRecord, EggSaleRecord } from '../types/quail';
import { formatRupiah, formatNumber, formatDecimal } from '../utils/calculations';
import {
  X,
  Printer,
  Share2,
  CheckCircle2,
  ShoppingBag,
  Send,
  Copy,
  Receipt,
  FileText,
  Calendar,
  User,
  CreditCard,
  Building,
} from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleRecord?: EggSaleRecord | null;
  customer?: CustomerRecord | null;
  onSaleCreated?: (sale: EggSaleRecord) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  saleRecord,
  customer,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const invoiceNo = `SPH-INV-${saleRecord?.id ? saleRecord.id.replace('sale-', '').slice(0, 8) : Date.now().toString().slice(-6)}`;

  // State
  const [buyerName, setBuyerName] = useState(saleRecord?.buyerName || customer?.name || 'Pelanggan Sahabat Puyuh');
  const [buyerPhone, setBuyerPhone] = useState(customer?.phone || '081234567890');
  const [buyerAddress, setBuyerAddress] = useState(customer?.address || 'Pasar Tradisional / Warung');
  const [eggGrade, setEggGrade] = useState(saleRecord?.eggGrade || 'Telur Utuh / Grade A (Konsumsi)');
  const [quantityKg, setQuantityKg] = useState(saleRecord?.quantityKg || 25);
  const [quantityPcs, setQuantityPcs] = useState(saleRecord?.quantityPcs || Math.round((saleRecord?.quantityKg || 25) * 90));
  const [pricePerKg, setPricePerKg] = useState(saleRecord?.pricePerKg || customer?.defaultPricePerKg || 33000);
  const [paymentStatus, setPaymentStatus] = useState<'Lunas' | 'Piutang' | 'DP / Uang Muka'>(saleRecord?.paymentStatus || 'Lunas');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'Transfer Bank' | 'QRIS'>(saleRecord?.paymentMethod || 'Transfer Bank');
  const [dueDate, setDueDate] = useState(saleRecord?.dueDate || '');
  const [notes, setNotes] = useState(saleRecord?.notes || 'Terima kasih atas kerja samanya.');
  const [copied, setCopied] = useState(false);
  const [receiptFormat, setReceiptFormat] = useState<'digital' | 'thermal' | 'a4'>('digital');

  if (!isOpen) return null;

  const totalOmzet = Math.round(quantityKg * pricePerKg);

  // Generate WhatsApp formatted text
  const generateWhatsAppMessage = () => {
    const text = `*SAHABAT PUYUH HATASWA*
_Peternakan & Suplai Telur Puyuh Segar Berkualitas_
----------------------------------------
*NOTA PEMBELIAN TELUR DIGITAL*
No. Invoice : #${invoiceNo}
Tanggal     : ${todayStr}
Pembeli     : ${buyerName}
Alamat      : ${buyerAddress}
----------------------------------------
*RINCIAN PESANAN:*
• Produk    : ${eggGrade}
• Jumlah    : ${formatDecimal(quantityKg)} Kg (~${formatNumber(quantityPcs)} butir)
• Harga/Kg  : ${formatRupiah(pricePerKg)}
----------------------------------------
*TOTAL OMZET* : *${formatRupiah(totalOmzet)}*
Metode Bayar: ${paymentMethod}
Status      : *[ ${paymentStatus.toUpperCase()} ]*
${paymentStatus === 'Piutang' && dueDate ? `Jatuh Tempo : ${dueDate}\n` : ''}----------------------------------------
*INFORMASI PEMBAYARAN:*
Rekening Bank BCA:
*0123-456-789* a.n. Sahabat Puyuh Hataswa
Bank Mandiri:
*137-00-1234567-8* a.n. Hataswa Farm

${notes ? `Catatan: ${notes}\n` : ''}
_Terima kasih telah mempercayakan suplai telur puyuh segar dari peternakan Sahabat Puyuh Hataswa!_`;
    return text;
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = buyerPhone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const message = encodeURIComponent(generateWhatsAppMessage());
    const waUrl = `https://wa.me/${formattedPhone}?text=${message}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-scale-up my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <span>Nota Penjualan Digital &amp; Cetak Struk</span>
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

        {/* Format Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
          <button
            type="button"
            onClick={() => setReceiptFormat('digital')}
            className={`flex-1 py-3 px-4 font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              receiptFormat === 'digital'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Format WhatsApp (Kirim WA)</span>
          </button>
          <button
            type="button"
            onClick={() => setReceiptFormat('thermal')}
            className={`flex-1 py-3 px-4 font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              receiptFormat === 'thermal'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Struk Kasir (Thermal 58/80mm)</span>
          </button>
          <button
            type="button"
            onClick={() => setReceiptFormat('a4')}
            className={`flex-1 py-3 px-4 font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              receiptFormat === 'a4'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Faktur Resmi A4 / PDF</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Format 1: WhatsApp Text Preview */}
          {receiptFormat === 'digital' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-900">
                <Send className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-[11px] leading-relaxed">
                  Nota ini diformat rapi dengan teks WhatsApp tebal/miring, rincian pesanan, dan nomor rekening pembayaran. Klik tombol hijau di bawah untuk langsung membuka chat WhatsApp ke nomor pembeli!
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Pembeli:</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nomor WhatsApp Pelanggan:</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Box Preview Pesan WA */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">Preview Teks Nota WhatsApp:</label>
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                  </button>
                </div>
                <div className="bg-emerald-950 text-emerald-100 font-mono text-[11px] p-4 rounded-xl whitespace-pre-wrap leading-relaxed border border-emerald-800 max-h-60 overflow-y-auto select-all">
                  {generateWhatsAppMessage()}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-600">
                  Total Tagihan: <b className="text-emerald-700 text-sm">{formatRupiah(totalOmzet)}</b>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Pesan</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Buka Chat WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Format 2: Struk Thermal Mini (Print Preview) */}
          {receiptFormat === 'thermal' && (
            <div className="space-y-4">
              <div className="max-w-[320px] mx-auto bg-white p-5 rounded-lg border-2 border-dashed border-slate-300 font-mono text-xs text-slate-900 shadow-sm leading-tight">
                <div className="text-center pb-3 border-b border-dashed border-slate-400">
                  <h4 className="font-extrabold text-sm uppercase">SAHABAT PUYUH HATASWA</h4>
                  <p className="text-[10px] text-slate-600">Sleman, D.I. Yogyakarta</p>
                  <p className="text-[10px] text-slate-600">WA: 0812-3456-7890</p>
                </div>

                <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span>No: #{invoiceNo}</span>
                    <span>{todayStr}</span>
                  </div>
                  <div>Cust: <b>{buyerName}</b></div>
                  <div className="text-[10px] text-slate-600">{buyerAddress}</div>
                </div>

                <div className="py-3 border-b border-dashed border-slate-400 space-y-2">
                  <div className="font-bold text-[11px]">{eggGrade}</div>
                  <div className="flex justify-between text-[11px]">
                    <span>{formatDecimal(quantityKg)} kg x {formatRupiah(pricePerKg)}</span>
                    <span className="font-bold">{formatRupiah(totalOmzet)}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">(~{formatNumber(quantityPcs)} butir telur)</div>
                </div>

                <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
                  <div className="flex justify-between font-extrabold text-sm">
                    <span>TOTAL:</span>
                    <span>{formatRupiah(totalOmzet)}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>Metode:</span>
                    <span>{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Status:</span>
                    <span className={paymentStatus === 'Lunas' ? 'text-emerald-700' : 'text-rose-700'}>
                      {paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  {paymentStatus === 'Piutang' && dueDate && (
                    <div className="flex justify-between text-[10px] text-amber-800">
                      <span>Jatuh Tempo:</span>
                      <span>{dueDate}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 text-center text-[10px] text-slate-500 space-y-1">
                  <p>Transfer: BCA 0123-456-789</p>
                  <p>a.n. Sahabat Puyuh Hataswa</p>
                  <p className="font-bold mt-2">-- TERIMA KASIH --</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Struk Thermal</span>
                </button>
              </div>
            </div>
          )}

          {/* Format 3: Faktur Resmi A4 / PDF */}
          {receiptFormat === 'a4' && (
            <div className="space-y-4 text-xs">
              <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-xs space-y-5">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/aistudio/IMG-20250913-WA0211_74ca8a90.jpg"
                      alt="Logo Sahabat Puyuh Hataswa"
                      className="w-12 h-12 rounded-full object-cover border border-emerald-500"
                    />
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">SAHABAT PUYUH HATASWA</h3>
                      <p className="text-[11px] text-slate-500">Peternakan &amp; Suplai Telur Puyuh Berkualitas</p>
                      <p className="text-[11px] text-slate-500">Sleman, D.I. Yogyakarta · Telp/WA: 0812-3456-7890</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-slate-900">FAKTUR PENJUALAN</div>
                    <div className="font-mono text-slate-500 text-[11px]">#{invoiceNo}</div>
                    <div className="text-slate-600 text-[11px] mt-1">Tanggal: {todayStr}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg text-[11px]">
                  <div>
                    <span className="font-bold text-slate-700 block">DITAGIHKAN KEPADA:</span>
                    <span className="font-extrabold text-slate-900 text-xs">{buyerName}</span>
                    <p className="text-slate-600">{buyerAddress}</p>
                    <p className="text-slate-600">WhatsApp: {buyerPhone}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-700 block">STATUS PEMBAYARAN:</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded font-bold text-xs mt-0.5 ${
                      paymentStatus === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {paymentStatus.toUpperCase()}
                    </span>
                    <p className="text-slate-600 mt-1">Metode: {paymentMethod}</p>
                    {paymentStatus === 'Piutang' && dueDate && (
                      <p className="text-amber-800 font-semibold">Jatuh Tempo: {dueDate}</p>
                    )}
                  </div>
                </div>

                <table className="w-full text-left border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Item / Kategori Produk</th>
                      <th className="py-2 px-3 text-right">Volume (Kg)</th>
                      <th className="py-2 px-3 text-right">Estimasi Butir</th>
                      <th className="py-2 px-3 text-right">Harga per Kg</th>
                      <th className="py-2 px-3 text-right">Jumlah (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-900">{eggGrade}</td>
                      <td className="py-3 px-3 text-right tabular-nums">{formatDecimal(quantityKg)} kg</td>
                      <td className="py-3 px-3 text-right tabular-nums text-slate-600">~{formatNumber(quantityPcs)} btr</td>
                      <td className="py-3 px-3 text-right tabular-nums">{formatRupiah(pricePerKg)}</td>
                      <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">{formatRupiah(totalOmzet)}</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan={4} className="py-2.5 px-3 text-right text-slate-700">TOTAL TAGIHAN:</td>
                      <td className="py-2.5 px-3 text-right text-base text-emerald-700 tabular-nums">{formatRupiah(totalOmzet)}</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="flex justify-between items-end pt-3 text-[11px] text-slate-600">
                  <div>
                    <span className="font-bold text-slate-700 block">Rekening Pembayaran:</span>
                    <span>Bank BCA: <b>0123-456-789</b> a.n Sahabat Puyuh Hataswa</span>
                  </div>
                  <div className="text-center w-36">
                    <p className="mb-10">Hormat Kami,</p>
                    <p className="font-bold border-t border-slate-400 pt-1 text-slate-900">Sahabat Puyuh Hataswa</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Faktur (Print / PDF)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
