import React, { useState } from 'react';
import { CustomerRecord, EggSaleRecord, UserRole } from '../types/quail';
import { formatRupiah, formatNumber, formatDecimal } from '../utils/calculations';
import {
  Users,
  Search,
  Plus,
  Phone,
  MapPin,
  FileText,
  Trash2,
  Pencil,
  Send,
  Printer,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Building,
} from 'lucide-react';
import { InvoiceModal } from './InvoiceModal';

interface CustomerDatabaseViewProps {
  customers: CustomerRecord[];
  saleRecords: EggSaleRecord[];
  onAddCustomer: (customer: CustomerRecord) => void;
  onUpdateCustomer: (customer: CustomerRecord) => void;
  onDeleteCustomer: (id: string) => void;
  currentRole: UserRole;
}

export const CustomerDatabaseView: React.FC<CustomerDatabaseViewProps> = ({
  customers,
  saleRecords,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  currentRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Semua');

  // Modal create/edit customer
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);

  // Invoice / Nota WA Modal
  const [selectedCustomerForInvoice, setSelectedCustomerForInvoice] = useState<CustomerRecord | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formType, setFormType] = useState<
    'Pengepul Besar' | 'Agen Telur' | 'Warung/Retail' | 'Konsumen Langsung'
  >('Pengepul Besar');
  const [formDefaultPrice, setFormDefaultPrice] = useState<number>(33000);
  const [formTerms, setFormTerms] = useState<
    'Tunai' | 'Tempo 3 Hari' | 'Tempo 7 Hari' | 'Tempo 14 Hari'
  >('Tempo 7 Hari');
  const [formNotes, setFormNotes] = useState('');

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormPhone('');
    setFormAddress('');
    setFormType('Pengepul Besar');
    setFormDefaultPrice(33000);
    setFormTerms('Tempo 7 Hari');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: CustomerRecord) => {
    setEditingCustomer(c);
    setFormName(c.name);
    setFormPhone(c.phone);
    setFormAddress(c.address);
    setFormType(c.customerType);
    setFormDefaultPrice(c.defaultPricePerKg || 33000);
    setFormTerms(c.paymentTerms);
    setFormNotes(c.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      onUpdateCustomer({
        ...editingCustomer,
        name: formName,
        phone: formPhone,
        address: formAddress,
        customerType: formType,
        defaultPricePerKg: Number(formDefaultPrice),
        paymentTerms: formTerms,
        notes: formNotes || undefined,
      });
    } else {
      const newCust: CustomerRecord = {
        id: `cust-${Date.now()}`,
        name: formName,
        phone: formPhone,
        address: formAddress,
        customerType: formType,
        defaultPricePerKg: Number(formDefaultPrice),
        paymentTerms: formTerms,
        notes: formNotes || undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAddCustomer(newCust);
    }
    setIsModalOpen(false);
  };

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'Semua' || c.customerType === selectedType;
    return matchesSearch && matchesType;
  });

  // Calculate customer statistics
  const getCustomerMetrics = (customerName: string) => {
    const matchingSales = saleRecords.filter(
      (s) => s.buyerName.toLowerCase().trim() === customerName.toLowerCase().trim()
    );
    const totalKg = matchingSales.reduce((sum, s) => sum + (s.quantityKg || 0), 0);
    const totalRevenue = matchingSales.reduce((sum, s) => sum + (s.totalRevenue || 0), 0);
    const totalPiutang = matchingSales
      .filter((s) => s.paymentStatus === 'Piutang')
      .reduce((sum, s) => sum + (s.totalRevenue || 0), 0);

    return {
      transactionCount: matchingSales.length,
      totalKg: Number(totalKg.toFixed(1)),
      totalRevenue,
      totalPiutang,
    };
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nama', 'Nomor_WA', 'Alamat', 'Tipe_Pelanggan', 'Harga_Default', 'Syarat_Bayar', 'Catatan'];
    const rows = filteredCustomers.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.phone}"`,
      `"${c.address}"`,
      c.customerType,
      c.defaultPricePerKg || 33000,
      c.paymentTerms,
      `"${c.notes || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `database_pelanggan_hataswa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-1">
            <Users className="w-4 h-4" />
            <span>Manajemen Pelanggan &amp; Distribusi Telur</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Database Pelanggan &amp; Cetak Struk / Nota WA
          </h1>
          <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
            Data pengepul besar, agen grosir, dan warung retail mitra. Buat nota digital otomatis dan kirim rincian tagihan langsung ke WhatsApp pelanggan dalam 1 klik.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Pelanggan</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl border border-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV Pelanggan</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, pasar, no WhatsApp..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 shrink-0">Tipe Mitra:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Pengepul Besar">Pengepul Besar</option>
            <option value="Agen Telur">Agen Telur</option>
            <option value="Warung/Retail">Warung / Retail (Soto &amp; Pecel)</option>
            <option value="Konsumen Langsung">Konsumen Langsung</option>
          </select>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((cust) => {
            const metrics = getCustomerMetrics(cust.name);

            return (
              <div
                key={cust.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 hover:border-slate-300 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{cust.name}</h3>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {cust.customerType}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(cust)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition"
                        title="Edit Data Pelanggan"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus data pelanggan ${cust.name}?`)) {
                            onDeleteCustomer(cust.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                        title="Hapus Pelanggan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-mono">{cust.phone || '-'}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="truncate">{cust.address || '-'}</span>
                    </div>
                  </div>

                  {/* Summary Metric Chips */}
                  <div className="mt-4 grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total Pembelian:</span>
                      <span className="font-bold text-slate-800">{formatDecimal(metrics.totalKg)} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total Nilai:</span>
                      <span className="font-bold text-emerald-700">{formatRupiah(metrics.totalRevenue)}</span>
                    </div>
                  </div>

                  {metrics.totalPiutang > 0 && (
                    <div className="mt-2 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-center justify-between font-semibold">
                      <span>Saldo Piutang Belum Lunas:</span>
                      <span className="font-extrabold text-amber-800">{formatRupiah(metrics.totalPiutang)}</span>
                    </div>
                  )}

                  {cust.notes && (
                    <p className="mt-2 text-[11px] text-slate-400 italic line-clamp-2">
                      "{cust.notes}"
                    </p>
                  )}
                </div>

                {/* Bottom Actions: WhatsApp & Cetak Nota */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCustomerForInvoice(cust);
                      setIsInvoiceModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Buat Nota WA</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCustomerForInvoice(cust);
                      setIsInvoiceModalOpen(true);
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition"
                    title="Cetak Struk Thermal / Faktur"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">Belum ada pelanggan yang cocok dengan pencarian.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-scale-up">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-bold text-sm">
                {editingCustomer ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nama Pelanggan / Usaha:
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Contoh: Pengepul Pak Slamet / Warung Bu Ani"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    No. WhatsApp / HP:
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kategori Pelanggan:
                  </label>
                  <select
                    value={formType}
                    onChange={(e: any) => setFormType(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="Pengepul Besar">Pengepul Besar</option>
                    <option value="Agen Telur">Agen Telur</option>
                    <option value="Warung/Retail">Warung / Retail (Soto &amp; Pecel)</option>
                    <option value="Konsumen Langsung">Konsumen Langsung</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Alamat / Kios / Lokasi Pasar:
                </label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Contoh: Kios 14 Blok A, Pasar Induk Kramat"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Harga Default per Kg (Rp):
                  </label>
                  <input
                    type="number"
                    value={formDefaultPrice}
                    onChange={(e) => setFormDefaultPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Syarat Pembayaran:
                  </label>
                  <select
                    value={formTerms}
                    onChange={(e: any) => setFormTerms(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="Tunai">Tunai / Cash</option>
                    <option value="Tempo 3 Hari">Tempo 3 Hari</option>
                    <option value="Tempo 7 Hari">Tempo 7 Hari</option>
                    <option value="Tempo 14 Hari">Tempo 14 Hari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Catatan Tambahan:
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Catatan pengiriman, kebiasaan transaksi..."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Simpan Pelanggan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal for Customer */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        customer={selectedCustomerForInvoice}
      />
    </div>
  );
};
