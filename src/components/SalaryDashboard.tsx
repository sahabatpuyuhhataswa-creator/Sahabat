import React, { useState } from 'react';
import { ExpenseRecord } from '../types/quail';
import { formatRupiah } from '../utils/calculations';
import { X, User, Plus } from 'lucide-react';

interface SalaryDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  records: ExpenseRecord[];
}

export const SalaryDashboard: React.FC<SalaryDashboardProps> = ({
  isOpen,
  onClose,
  records,
}) => {
  if (!isOpen) return null;

  const employees = ['Karyawan 1', 'Karyawan 2', 'Karyawan 3'];
  
  // Filter for Gaji/Kasbon
  const salaryRecords = records.filter(r => r.category === 'Gaji Karyawan');
  
  const getEmployeeTotal = (name: string, type: 'Gaji' | 'Kasbon') => 
    salaryRecords
      .filter(r => r.staffName === name && r.expenseType === type)
      .reduce((s, r) => s + r.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-scale-up my-6">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <User className="w-5 h-5 text-blue-400" />
            <span>Dashboard Gaji & Kasbon Karyawan</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {employees.map(emp => (
                <div key={emp} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-2">{emp}</h3>
                    <div className="text-xs space-y-1">
                        <p className="text-slate-500">Total Gaji: <span className="font-bold text-blue-600">{formatRupiah(getEmployeeTotal(emp, 'Gaji'))}</span></p>
                        <p className="text-slate-500">Total Kasbon: <span className="font-bold text-rose-600">{formatRupiah(getEmployeeTotal(emp, 'Kasbon'))}</span></p>
                    </div>
                </div>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="font-bold text-slate-900 mb-3">Riwayat Pembayaran</h4>
             <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Tanggal</th>
                  <th className="py-2 px-3">Nama</th>
                  <th className="py-2 px-3">Tipe</th>
                  <th className="py-2 px-3 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salaryRecords.map(r => (
                  <tr key={r.id}>
                    <td className="py-2 px-3">{r.date}</td>
                    <td className="py-2 px-3">{r.staffName || '-'}</td>
                    <td className="py-2 px-3">{r.expenseType || 'Biasa'}</td>
                    <td className="py-2 px-3 text-right">{formatRupiah(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};
