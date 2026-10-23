import React, { useState } from 'react';
import { CustomerRecord, EggSaleRecord, QuailSeedSaleRecord } from '../types/quail';
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
  Plus,
  Trash2,
  Edit3,
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number; // Kg or Birds
  secondaryQuantity: number; // Pcs or Boxes
  pricePerUnit: number; // Rp/Kg or Rp/Bird
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleRecord?: EggSaleRecord | QuailSeedSaleRecord | null;
  customer?: CustomerRecord | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  saleRecord,
  customer,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Load saved config
  const savedConfig = JSON.parse(localStorage.getItem('sph_farm_config') || '{}');

  // Editable Farm Header details
  const [farmName, setFarmName] = useState(savedConfig.farmName || 'SAHABAT PUYUH HATASWA');
  const [farmAddress, setFarmAddress] = useState(savedConfig.address || 'Jl. Agribisnis Puyuh No. 12, Pakembinangun, Pakem, Sleman, D.I. Yogyakarta');
  const [farmPhone, setFarmPhone] = useState(savedConfig.phone || '0812-3456-7890');
  const [farmEmail, setFarmEmail] = useState(savedConfig.email || 'info@sahabatpuyuhhataswa.com');

  // Invoice Meta
  const [invoiceNo, setInvoiceNo] = useState(
    `SPH-INV-${saleRecord?.id ? saleRecord.id.replace('sale-', '').slice(0, 8) : Date.now().toString().slice(-6)}`
  );
  const [invoiceDate, setInvoiceDate] = useState(saleRecord?.date || todayStr);
  const [dueDate, setDueDate] = useState(saleRecord?.dueDate || '');

  // Buyer Details
  const [buyerName, setBuyerName] = useState(saleRecord?.buyerName || customer?.name || 'Pelanggan Sahabat Puyuh');
  const [buyerPhone, setBuyerPhone] = useState(customer?.phone || '081234567890');
  const [buyerAddress, setBuyerAddress] = useState(customer?.address || 'Pasar Tradisional / Warung Kuliner Sleman');

  const isSeedSale = saleRecord && 'seedType' in saleRecord;
  const initialQty = isSeedSale ? (saleRecord as QuailSeedSaleRecord).quantityBirds : (saleRecord as EggSaleRecord).quantityKg || 25;
  const initialPrice = isSeedSale ? (saleRecord as QuailSeedSaleRecord).pricePerBird : (saleRecord as EggSaleRecord).pricePerKg || customer?.defaultPricePerKg || 33000;
  const initialDesc = isSeedSale ? (saleRecord as QuailSeedSaleRecord).seedType : (saleRecord as EggSaleRecord).eggGrade || 'Telur Puyuh Utuh / Grade A (Konsumsi Segar)';
  const initialSecondary = isSeedSale ? (saleRecord as QuailSeedSaleRecord).boxCount : (saleRecord as EggSaleRecord).quantityPcs || Math.round(initialQty * 90);

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'item-1',
      description: initialDesc,
      quantity: initialQty,
      secondaryQuantity: initialSecondary,
      pricePerUnit: initialPrice,
    },
  ]);

  // Payment Status & Method
  const [paymentStatus, setPaymentStatus] = useState<'Lunas' | 'Piutang' | 'DP / Uang Muka'>(saleRecord?.paymentStatus || 'Lunas');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'Transfer Bank' | 'QRIS'>(saleRecord?.paymentMethod || 'Transfer Bank');
  const [bankDetails, setBankDetails] = useState(
    savedConfig.bankName 
      ? `${savedConfig.bankName}: ${savedConfig.accountNumber} a.n. ${savedConfig.accountHolderName}`
      : 'BCA: 0123-456-789 a.n. Sahabat Puyuh Hataswa\nMandiri: 137-00-1234567-8 a.n. Hataswa Farm'
  );
  const [notes, setNotes] = useState(saleRecord?.notes || 'Terima kasih atas kerja sama dan kepercayaan Anda.');
  const [signerName, setSignerName] = useState('Budi Santoso (Manajer Pemasaran Farm)');
  const [signerCity, setSignerCity] = useState(savedConfig.address ? savedConfig.address.split(',').slice(-2, -1)[0]?.trim() || 'Sleman' : 'Sleman');
  const [signerDate, setSignerDate] = useState(saleRecord?.date || todayStr);

  const [activeTab, setActiveTab] = useState<'edit' | 'whatsapp' | 'thermal' | 'a4'>('edit');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Calculations
  const totalOmzet = items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: 'Telur Puyuh Grade A Tambahan (Tray Mika)',
        quantityKg: 10,
        quantityPcs: 900,
        pricePerKg: 33000,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantityKg') {
            const kg = parseFloat(value) || 0;
            updated.quantityPcs = Math.round(kg * 90);
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Generate WhatsApp text
  const generateWhatsAppMessage = () => {
    let itemsText = '';
    items.forEach((item, idx) => {
      itemsText += `\n${idx + 1}. *${item.description}*\n   Jumlah: ${formatDecimal(item.quantity)} ${isSeedSale ? 'ekor' : 'Kg'} (${isSeedSale ? item.secondaryQuantity + ' boks' : '~' + formatNumber(item.secondaryQuantity) + ' butir'})\n   Harga: ${formatRupiah(item.pricePerUnit)}/${isSeedSale ? 'ekor' : 'kg'} | Subtotal: *${formatRupiah(item.quantity * item.pricePerUnit)}*`;
    });

    const text = `*${farmName}*
_${farmAddress}_
Telp/WA: ${farmPhone}
----------------------------------------
*FAKTUR / NOTA RESMI PEMBELIAN*
No. Faktur : #${invoiceNo}
Tanggal    : ${invoiceDate}
Pembeli    : ${buyerName}
Alamat     : ${buyerAddress}
----------------------------------------
*RINCIAN PRODUK:*${itemsText}
----------------------------------------
*TOTAL TAGIHAN : ${formatRupiah(totalOmzet)}*
Metode Bayar : ${paymentMethod}
Status Bayar : *[ ${paymentStatus.toUpperCase()} ]*
${paymentStatus === 'Piutang' && dueDate ? `Jatuh Tempo  : ${dueDate}\n` : ''}----------------------------------------
*INFORMASI PEMBAYARAN REKENING:*
${bankDetails}

${notes ? `Catatan: ${notes}\n` : ''}
_Terima kasih telah mempercayakan kebutuhan telur puyuh segar Anda kepada ${farmName}!_`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 animate-scale-up my-6 flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 font-bold text-sm md:text-base">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <span>Faktur Resmi &amp; Struk Nota Penjualan (Editable)</span>
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

        {/* Navigation Mode Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-3 px-3 font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'edit'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4 text-emerald-600" />
            <span>1. Edit Isi &amp; Atribut Faktur</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-3 px-3 font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4 text-emerald-600" />
            <span>2. Format WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('thermal')}
            className={`flex-1 py-3 px-3 font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'thermal'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>3. Struk Thermal (Kasir)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('a4')}
            className={`flex-1 py-3 px-3 font-bold text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              activeTab === 'a4'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>4. Faktur Resmi A4 / PDF</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* TAB 1: EDIT FORM */}
          {activeTab === 'edit' && (
            <div className="space-y-6 text-xs">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold block">Faktur &amp; Struk Dapat Diedit Penuh</span>
                  Semua informasi identitas farm, alamat resmi, data pembeli, rincian barang, harga, dan metode pembayaran dapat Anda sesuaikan sebelum dibagikan atau dicetak.
                </div>
              </div>

              {/* Grid: Farm Info & Invoice Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span>Identitas &amp; Alamat Resmi Farm</span>
                  </h4>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Nama Farm:</label>
                    <input
                      type="text"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Alamat Resmi Farm:</label>
                    <textarea
                      rows={2}
                      value={farmAddress}
                      onChange={(e) => setFarmAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">No. Telp / WA:</label>
                      <input
                        type="text"
                        value={farmPhone}
                        onChange={(e) => setFarmPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Email Farm:</label>
                      <input
                        type="text"
                        value={farmEmail}
                        onChange={(e) => setFarmEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Nomor &amp; Tanggal Faktur</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">No. Faktur:</label>
                      <input
                        type="text"
                        value={invoiceNo}
                        onChange={(e) => setInvoiceNo(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Tanggal Transaksi:</label>
                      <input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Status Pembayaran:</label>
                      <select
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                      >
                        <option value="Lunas">Lunas</option>
                        <option value="Piutang">Piutang (Tempo)</option>
                        <option value="DP / Uang Muka">DP / Uang Muka</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Metode Bayar:</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                      >
                        <option value="Transfer Bank">Transfer Bank</option>
                        <option value="Tunai">Tunai</option>
                        <option value="QRIS">QRIS</option>
                      </select>
                    </div>
                  </div>

                  {paymentStatus === 'Piutang' && (
                    <div>
                      <label className="block font-semibold text-amber-800 mb-1">Jatuh Tempo Piutang:</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Buyer Information */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Informasi Pembeli / Pelanggan / Pengepul</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Nama Pembeli:</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">No. WhatsApp Pelanggan:</label>
                    <input
                      type="text"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Alamat Tujuan Pengiriman:</label>
                    <input
                      type="text"
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Items List Editor */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>Rincian Item / Produk Telur Puyuh</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-white rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                      <div className="md:col-span-5">
                        <label className="block font-semibold text-slate-600 mb-0.5 text-[10px]">Deskripsi / Kategori:</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-semibold text-slate-600 mb-0.5 text-[10px]">Jumlah ({isSeedSale ? 'Ekor' : 'Kg'}):</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold tabular-nums"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-semibold text-slate-600 mb-0.5 text-[10px]">Harga / {isSeedSale ? 'Ekor' : 'Kg'} (Rp):</label>
                        <input
                          type="number"
                          step="500"
                          value={item.pricePerUnit}
                          onChange={(e) => handleItemChange(item.id, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold tabular-nums"
                        />
                      </div>
                      <div className="md:col-span-2 text-right">
                        <span className="block font-semibold text-slate-500 text-[10px]">Subtotal:</span>
                        <span className="font-extrabold text-emerald-700 text-xs">
                          {formatRupiah(item.quantity * item.pricePerUnit)}
                        </span>
                      </div>
                      <div className="md:col-span-1 text-center">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Hapus Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes & Bank Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="block font-bold text-slate-900 text-xs">Informasi Rekening Pembayaran:</label>
                  <textarea
                    rows={3}
                    value={bankDetails}
                    onChange={(e) => setBankDetails(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <label className="block font-bold text-slate-900 text-xs">Catatan &amp; Tanda Tangan:</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Catatan untuk pembeli..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs mb-2"
                  />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-0.5 text-[10px]">Kota Tanda Tangan:</label>
                      <input
                        type="text"
                        value={signerCity}
                        onChange={(e) => setSignerCity(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-0.5 text-[10px]">Tanggal Tanda Tangan:</label>
                      <input
                        type="date"
                        value={signerDate}
                        onChange={(e) => setSignerDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Nama Penandatangan / Manajer..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('whatsapp')}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <span>Lihat Preview Faktur &amp; Struk</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: WHATSAPP FORMAT */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Format WhatsApp siap dikirim langsung ke nomor pelanggan Anda.</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
                </button>
              </div>

              <div className="bg-emerald-950 text-emerald-100 font-mono text-[11px] p-5 rounded-xl whitespace-pre-wrap leading-relaxed border border-emerald-800 max-h-80 overflow-y-auto select-all shadow-inner">
                {generateWhatsAppMessage()}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <div className="text-slate-700 font-bold text-sm">
                  Total Tagihan: <span className="text-emerald-700">{formatRupiah(totalOmzet)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
                  >
                    Salin Pesan
                  </button>
                  <button
                    type="button"
                    onClick={handleSendWhatsApp}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Buka Chat WhatsApp ({buyerPhone})</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: THERMAL RECEIPT 58/80MM */}
          {activeTab === 'thermal' && (
            <div className="space-y-4">
              <div className="max-w-[340px] mx-auto bg-white p-6 rounded-lg border-2 border-dashed border-slate-300 font-mono text-xs text-slate-900 shadow-sm leading-tight space-y-3">
                <div className="text-center pb-3 border-b border-dashed border-slate-400">
                  <h4 className="font-extrabold text-sm uppercase">{farmName}</h4>
                  <p className="text-[10px] text-slate-600">{farmAddress}</p>
                  <p className="text-[10px] text-slate-600">Telp/WA: {farmPhone}</p>
                </div>

                <div className="py-2 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
                  <div className="flex justify-between font-semibold">
                    <span>No: #{invoiceNo}</span>
                    <span>{invoiceDate}</span>
                  </div>
                  <div>Cust: <b>{buyerName}</b></div>
                  <div className="text-[10px] text-slate-600">{buyerAddress}</div>
                </div>

                <div className="py-2.5 border-b border-dashed border-slate-400 space-y-2">
                  {items.map((item, idx) => (
                    <div key={item.id} className="space-y-0.5 pb-2 border-b border-slate-100 last:border-b-0">
                      <div className="font-bold text-[11px]">{item.description}</div>
                      <div className="flex justify-between text-[11px]">
                        <span>{formatDecimal(item.quantity)} {isSeedSale ? 'ekor' : 'kg'} x {formatRupiah(item.pricePerUnit)}</span>
                        <span className="font-bold">{formatRupiah(item.quantity * item.pricePerUnit)}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">({isSeedSale ? item.secondaryQuantity + ' boks' : '~' + formatNumber(item.secondaryQuantity) + ' butir'})</div>
                    </div>
                  ))}
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

                <div className="pt-2 text-center text-[10px] text-slate-500 space-y-1">
                  <div className="whitespace-pre-line">{bankDetails}</div>
                  <p className="font-bold mt-2">-- TERIMA KASIH --</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Struk Thermal (Print / PDF)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: OFFICIAL A4 INVOICE */}
          {activeTab === 'a4' && (
            <div className="space-y-4 text-xs">
              <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-300 shadow-xs space-y-6">
                
                {/* Official Letterhead */}
                <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-slate-900 pb-5 gap-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src="/assets/aistudio/IMG-20250913-WA0211_74ca8a90.jpg"
                      alt="Logo Resmi Sahabat Puyuh Hataswa"
                      className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600 shadow-sm"
                    />
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">{farmName}</h3>
                      <p className="text-[11px] text-slate-600 font-medium">{farmAddress}</p>
                      <p className="text-[11px] text-slate-600">Telp/WA: {farmPhone} · Email: {farmEmail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900 uppercase tracking-wider">FAKTUR PENJUALAN</div>
                    <div className="font-mono text-emerald-700 font-bold text-sm mt-0.5">#{invoiceNo}</div>
                    <div className="text-slate-600 text-[11px] mt-1">Tanggal: {invoiceDate}</div>
                  </div>
                </div>

                {/* Buyer & Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[10px]">DITAGIHKAN KEPADA (BUYER):</span>
                    <span className="font-extrabold text-slate-900 text-sm block">{buyerName}</span>
                    <p className="text-slate-600 mt-0.5">{buyerAddress}</p>
                    <p className="text-slate-600">WhatsApp: {buyerPhone}</p>
                  </div>
                  <div className="md:text-right">
                    <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[10px]">STATUS PEMBAYARAN:</span>
                    <span className={`inline-block px-3 py-1 rounded-lg font-extrabold text-xs shadow-xs ${
                      paymentStatus === 'Lunas' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      {paymentStatus.toUpperCase()}
                    </span>
                    <p className="text-slate-700 font-medium mt-1.5">Metode: <b>{paymentMethod}</b></p>
                    {paymentStatus === 'Piutang' && dueDate && (
                      <p className="text-amber-800 font-bold mt-0.5">Jatuh Tempo: {dueDate}</p>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden">
                  <thead className="bg-slate-900 text-white font-bold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">Kategori &amp; Spesifikasi Produk</th>
                      <th className="py-2.5 px-3 text-right">Volume (Kg)</th>
                      <th className="py-2.5 px-3 text-right">Estimasi Butir</th>
                      <th className="py-2.5 px-3 text-right">Harga / Kg</th>
                      <th className="py-2.5 px-3 text-right">Jumlah (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">{item.description}</td>
                        <td className="py-3 px-3 text-right tabular-nums">{formatDecimal(item.quantity)} {isSeedSale ? 'ekor' : 'kg'}</td>
                        <td className="py-3 px-3 text-right tabular-nums text-slate-600">{isSeedSale ? item.secondaryQuantity + ' boks' : '~' + formatNumber(item.secondaryQuantity) + ' btr'}</td>
                        <td className="py-3 px-3 text-right tabular-nums">{formatRupiah(item.pricePerUnit)}</td>
                        <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">
                          {formatRupiah(item.quantity * item.pricePerUnit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={5} className="py-3 px-3 text-right text-slate-800 text-xs">TOTAL TAGIHAN KESELURUHAN:</td>
                      <td className="py-3 px-3 text-right text-base text-emerald-700 tabular-nums">{formatRupiah(totalOmzet)}</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Footer Notes & Signature */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-800 block mb-1">Informasi Transfer / Pembayaran:</span>
                    <div className="text-slate-600 whitespace-pre-line font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {bankDetails}
                    </div>
                    {notes && <p className="text-slate-600 mt-2">Catatan: {notes}</p>}
                  </div>
                  <div className="text-center md:text-right flex flex-col items-center md:items-end justify-between">
                    <div>
                      <p className="text-slate-600 mb-12">{signerCity}, {signerDate}</p>
                      <p className="font-extrabold text-slate-900 border-b border-slate-400 pb-1 px-4 inline-block">{signerName}</p>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">Stempel Resmi &amp; Tanda Tangan Sahabat Puyuh Hataswa</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Faktur Resmi A4 (Print / PDF)</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
