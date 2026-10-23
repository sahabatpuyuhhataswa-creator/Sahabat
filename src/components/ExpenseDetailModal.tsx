import React from 'react';
import { X, Receipt } from 'lucide-react';
import { ExpenseRecord } from '../types/quail';
import { formatRupiah } from '../utils/calculations';

interface ExpenseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  records: ExpenseRecord[];
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  records,
}) => {
  if (!isOpen) return null;

  const total = records.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-scale-up my-6">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <Receipt className="w-5 h-5 text-blue-400" />
            <span>Detail: {title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
           <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">Tanggal</th>
                <th className="py-2 px-3">Deskripsi</th>
                <th className="py-2 px-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map(r => (
                <tr key={r.id}>
                  <td className="py-2 px-3">{r.date}</td>
                  <td className="py-2 px-3">{r.description}</td>
                  <td className="py-2 px-3 text-right">{formatRupiah(r.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="font-bold border-t border-slate-200">
              <tr>
                <td className="py-2 px-3" colSpan={2}>Total</td>
                <td className="py-2 px-3 text-right">{formatRupiah(total)}</td>
              </tr>
            </tfoot>
           </table>
        </div>
      </div>
    </div>
  );
};
