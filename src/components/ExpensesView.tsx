import React, { useState } from 'react';
import { ExpenseRecord, UserRole } from '../types/quail';
import { formatRupiah } from '../utils/calculations';
import { Plus, Search, Trash2, Receipt, ShieldAlert, Edit2 } from 'lucide-react';

interface ExpensesViewProps {
  records: ExpenseRecord[];
  currentRole: UserRole;
  onOpenModal: (type: 'expense') => void;
  onDeleteRecord: (id: string) => void;
  onEditRecord: (record: ExpenseRecord) => void;
  onSwitchToOwner: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  records,
  currentRole,
  onOpenModal,
  onDeleteRecord,
  onEditRecord,
  onSwitchToOwner,
}) => {
  const isOwner = currentRole === 'owner';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  if (!isOwner) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 shadow-xs">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Akses Terbatas: Khusus Pemilik Farm</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Pencatatan dan analisis beban operasional (gaji, listrik, vitamin, dan kemasan) hanya dapat diakses oleh akun Pemilik Kandang.
        </p>
        <button
          onClick={onSwitchToOwner}
          className="mt-5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-xs"
        >
          Beralih ke Akun Pemilik
        </button>
      </div>
    );
  }

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.date.includes(searchTerm) ||
      (r.receiptNo && r.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'Semua' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalExpense = records.reduce((s, r) => s + r.amount, 0);

  // Group by category
  const categoryTotals: Record<string, number> = {};
  records.forEach((r) => {
    categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.amount;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <Receipt className="w-4 h-4" />
            <span>Manajemen Pengeluaran Farm</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Beban Operasional &amp; Pemeliharaan Kandang
          </h1>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-2xl">
            Catatan biaya utilitas listrik &amp; air (blower/lampu), gaji petugas kandang, vitamin, obat/vaksin, dan kemasan tray telur puyuh.
          </p>
        </div>

        <button
          onClick={() => onOpenModal('expense')}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>+ Catat Biaya Operasional</span>
        </button>
      </div>

      {/* Expense Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Beban Operasional</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatRupiah(totalExpense)}
          </div>
          <span className="text-[11px] text-slate-500">Di luar biaya pakan puyuh</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Gaji Petugas Kandang</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatRupiah(categoryTotals['Gaji Karyawan'] || 0)}
          </div>
          <span className="text-[11px] text-slate-500">2 orang tenaga kerja tetap</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Vitamin, Obat &amp; Vaksin</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatRupiah(categoryTotals['Vitamin & Obat / Vaksin'] || 0)}
          </div>
          <span className="text-[11px] text-slate-500">Egg stimulant &amp; antistres</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Listrik, Air &amp; Kemasan</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {formatRupiah((categoryTotals['Listrik & Air'] || 0) + (categoryTotals['Kemasan Tray & Mika'] || 0))}
          </div>
          <span className="text-[11px] text-slate-500">Pencahayaan &amp; Egg tray kertas</span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari deskripsi, no kuitansi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500">Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Listrik & Air">Listrik &amp; Air</option>
              <option value="Vitamin & Obat / Vaksin">Vitamin &amp; Obat</option>
              <option value="Gaji Karyawan">Gaji Karyawan</option>
              <option value="Kemasan Tray & Mika">Kemasan Tray</option>
              <option value="Sekam & Kebersihan">Sekam &amp; Kebersihan</option>
              <option value="Perawatan Kandang">Perawatan Kandang</option>
              <option value="Lain-lain">Lain-lain</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Kategori Biaya</th>
                <th className="py-3 px-4">Deskripsi Pembayaran</th>
                <th className="py-3 px-4">Metode</th>
                <th className="py-3 px-4">No. Bukti/Kuitansi</th>
                <th className="py-3 px-4 text-right">Nominal (Rp)</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">{r.date}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-800 border border-blue-200">
                        {r.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{r.description}</td>
                    <td className="py-3 px-4 text-slate-500">{r.paymentMethod}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{r.receiptNo || '-'}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-900">
                      {formatRupiah(r.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditRecord(r)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition"
                          title="Edit Biaya"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(r.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                          title="Hapus Biaya"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada transaksi biaya yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
