import React, { useState } from 'react';
import { StaffAttendanceRecord, UserRole } from '../types/quail';
import {
  Camera,
  PenTool,
  Plus,
  Search,
  Download,
  Trash2,
  Calendar,
  Clock,
  UserCheck,
  Thermometer,
  Eye,
  X,
} from 'lucide-react';

interface AttendanceViewProps {
  records: StaffAttendanceRecord[];
  currentRole: UserRole;
  onOpenModal: () => void;
  onDeleteRecord: (id: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  records,
  currentRole,
  onOpenModal,
  onDeleteRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('Semua');
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string } | null>(null);

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.date.includes(searchTerm) ||
      r.tasksDone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.locationKandang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = selectedMethod === 'Semua' || r.method === selectedMethod;
    return matchesSearch && matchesMethod;
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecords = records.filter((r) => r.date === todayStr);
  const presentTodayCount = new Set(todayRecords.map((r) => r.staffName)).size;
  const photoCount = records.filter((r) => r.method === 'Foto Kamera Kandang').length;
  const photoRate = records.length > 0 ? Math.round((photoCount / records.length) * 100) : 0;

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Tanggal',
      'Jam WIB',
      'Nama Petugas',
      'Shift',
      'Lokasi Kandang',
      'Status Kehadiran',
      'Metode Absensi',
      'Suhu (°C)',
      'Tugas yang Dikerjakan',
      'Catatan Kondisi',
    ];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.date,
      r.time,
      r.staffName,
      r.shift,
      r.locationKandang,
      r.attendanceType,
      r.method,
      r.temperatureC || '-',
      r.tasksDone,
      r.conditionNotes || '-',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_absensi_petugas_hataswa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Manajemen Tenaga Kerja Farm</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
            Presensi &amp; Absensi Petugas Kandang
          </h1>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-2xl">
            Sistem absensi terintegrasi bagi petugas kandang melalui <b>bukti foto langsung di lokasi kandang</b> dengan cap waktu digital, atau pencatatan <b>formulir manual</b> tugas shift.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Absensi Baru (Foto/Manual)</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Rekap</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Petugas Masuk Hari Ini</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {presentTodayCount} <span className="text-xs font-normal text-slate-500">orang hadir</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Shift operasional aktif</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Catatan Log Absensi</span>
          <div className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {records.length} <span className="text-xs font-normal text-slate-500">transaksi</span>
          </div>
          <span className="text-[11px] text-slate-500">Akumulasi shift masuk &amp; pulang</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Absensi dengan Bukti Foto</span>
          <div className="text-xl md:text-2xl font-bold text-amber-600 mt-1 tabular-nums">
            {photoCount} <span className="text-xs font-normal text-slate-500">bukti foto</span>
          </div>
          <span className="text-[11px] text-slate-500">{photoRate}% verifikasi visual kandang</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Status Kedisiplinan Shift</span>
          <div className="text-xl md:text-2xl font-bold text-emerald-600 mt-1">
            Tertib 100%
          </div>
          <span className="text-[11px] text-slate-500">Pemberian ransum tepat waktu</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama petugas, tugas, lokasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500">Metode:</span>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Semua">Semua Metode</option>
              <option value="Foto Kamera Kandang">Foto Kamera Kandang</option>
              <option value="Input Manual Form">Input Manual Form</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-4">Tanggal &amp; Waktu</th>
                <th className="py-3 px-4">Bukti Foto</th>
                <th className="py-3 px-4">Nama Petugas</th>
                <th className="py-3 px-4">Shift Kerja</th>
                <th className="py-3 px-4">Lokasi Kandang</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Suhu (°C)</th>
                <th className="py-3 px-4">Tugas yang Dikerjakan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">{r.date}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{r.time} WIB</span>
                    </td>
                    <td className="py-3 px-4">
                      {r.photoUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewPhoto({ url: r.photoUrl!, title: `${r.staffName} (${r.date} ${r.time})` })}
                          className="relative group w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shadow-2xs block"
                          title="Klik untuk perbesar foto"
                        >
                          <img src={r.photoUrl} alt="Foto Petugas" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                            <Eye className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                          <PenTool className="w-3 h-3 text-slate-500" />
                          <span>Manual</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">{r.staffName}</td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{r.shift}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{r.locationKandang}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        r.attendanceType === 'Hadir Masuk'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : r.attendanceType === 'Hadir Pulang'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {r.attendanceType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center tabular-nums text-slate-600 font-medium">
                      {r.temperatureC ? `${r.temperatureC}°C` : '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs">
                      <p className="line-clamp-2">{r.tasksDone}</p>
                      {r.conditionNotes && (
                        <p className="text-[10px] text-slate-400 mt-0.5 italic truncate">Catatan: {r.conditionNotes}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteRecord(r.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                        title="Hapus Absensi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tidak ada catatan absensi yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="bg-slate-900 rounded-2xl overflow-hidden max-w-lg w-full border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 text-white flex items-center justify-between border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400">{previewPhoto.title}</span>
              <button
                onClick={() => setPreviewPhoto(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 flex justify-center bg-black">
              <img
                src={previewPhoto.url}
                alt="Foto Absensi Petugas Kandang"
                className="max-h-[70vh] w-auto rounded-xl object-contain shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
