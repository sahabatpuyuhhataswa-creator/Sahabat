import React, { useState, useRef, useEffect } from 'react';
import { StaffAttendanceRecord } from '../types/quail';
import {
  X,
  Camera,
  PenTool,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Thermometer,
  Clock,
  User,
} from 'lucide-react';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveAttendance: (record: Omit<StaffAttendanceRecord, 'id'>) => void;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  onSaveAttendance,
}) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');

  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');

  // Form Fields
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState(timeStr);
  const [staffName, setStaffName] = useState('Pak Suryanto (Kepala Kandang)');
  const [customName, setCustomName] = useState('');
  const [shift, setShift] = useState<'Shift Pagi (06.00 - 14.00)' | 'Shift Sore (14.00 - 20.00)' | 'Shift Malam (Kontrol Brooder)'>('Shift Pagi (06.00 - 14.00)');
  const [locationKandang, setLocationKandang] = useState('Kandang Petelur A & B');
  const [attendanceType, setAttendanceType] = useState<'Hadir Masuk' | 'Hadir Pulang' | 'Izin' | 'Sakit'>('Hadir Masuk');
  const [temperatureC, setTemperatureC] = useState<number>(28);
  const [tasksDone, setTasksDone] = useState('Pemberian pakan, kontrol air minum & panen telur');
  const [conditionNotes, setConditionNotes] = useState('');

  // Camera & Photo State
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera when camera tab is active
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } else {
        setCameraError('Kamera tidak didukung oleh browser Anda.');
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Tidak dapat mengakses kamera. Anda dapat mengunggah file foto atau menggunakan absensi manual.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !photoUrl) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, photoUrl]);

  // Capture snapshot from video stream with digital stamp
  const takeSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Draw frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Add watermark overlay at bottom
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.fillRect(0, canvas.height - 70, canvas.width, 70);

      ctx.fillStyle = '#f59e0b'; // amber
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('SAHABAT PUYUH HATASWA · ABSENSI RESMI', 16, canvas.height - 45);

      ctx.fillStyle = '#ffffff';
      ctx.font = '13px sans-serif';
      const actualStaff = staffName === 'Lainnya' ? customName || 'Petugas' : staffName;
      ctx.fillText(`${date} ${time} WIB | ${actualStaff} | ${locationKandang}`, 16, canvas.height - 20);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhotoUrl(dataUrl);
      stopCamera();
    }
  };

  // Upload photo from file / gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalStaffName = staffName === 'Lainnya' ? customName.trim() || 'Petugas Kandang' : staffName;

    onSaveAttendance({
      date,
      time,
      staffName: finalStaffName,
      shift,
      locationKandang,
      attendanceType,
      method: activeTab === 'camera' ? 'Foto Kamera Kandang' : 'Input Manual Form',
      photoUrl: photoUrl || undefined,
      temperatureC: Number(temperatureC),
      tasksDone,
      conditionNotes: conditionNotes || undefined,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Absensi Petugas Kandang</span>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('camera')}
              className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-2 ${
                activeTab === 'camera'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>Foto di Kandang (Kamera)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-2 ${
                activeTab === 'manual'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-4 h-4 text-blue-600" />
              <span>Catat Manual (Formulir)</span>
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* CAMERA TAB */}
          {activeTab === 'camera' && (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video flex items-center justify-center text-white">
                {photoUrl ? (
                  <div className="relative w-full h-full">
                    <img src={photoUrl} alt="Foto Absensi Petugas" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUrl(null);
                        startCamera();
                      }}
                      className="absolute top-3 right-3 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-bold rounded-lg backdrop-blur-xs flex items-center gap-1.5 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Foto Ulang</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${!isCameraActive ? 'hidden' : ''}`}
                    />
                    {!isCameraActive && (
                      <div className="text-center p-4">
                        <Camera className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                        <p className="text-xs text-slate-400">
                          {cameraError || 'Mempersiapkan kamera kandang...'}
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-3 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium inline-flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Pilih Foto dari Galeri</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Shutter / Capture Button */}
              {!photoUrl && isCameraActive && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={takeSnapshot}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Ambil Foto Sekarang (Cap Waktu)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                    title="Unggah Foto dari HP"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* COMMON FIELDS */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Jam WIB</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="Contoh: 06:30"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Nama Petugas Kandang</label>
            <select
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
            >
              <option value="Pak Suryanto (Kepala Kandang)">Pak Suryanto (Kepala Kandang)</option>
              <option value="Mas Budi Santoso (Petugas Pakan & Panen)">Mas Budi Santoso (Petugas Pakan &amp; Panen)</option>
              <option value="Mas Didik Kurniawan (Teknisi Brooder & Sanitasi)">Mas Didik Kurniawan (Teknisi Brooder &amp; Sanitasi)</option>
              <option value="Mbak Siti Nurhaliza (Sortir Telur)">Mbak Siti Nurhaliza (Sortir Telur)</option>
              <option value="Lainnya">Nama Lainnya...</option>
            </select>
            {staffName === 'Lainnya' && (
              <input
                type="text"
                placeholder="Ketik nama petugas..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
                className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-lg p-2"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Shift Kerja</label>
              <select
                value={shift}
                onChange={(e: any) => setShift(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
              >
                <option value="Shift Pagi (06.00 - 14.00)">Shift Pagi (06.00 - 14.00)</option>
                <option value="Shift Sore (14.00 - 20.00)">Shift Sore (14.00 - 20.00)</option>
                <option value="Shift Malam (Kontrol Brooder)">Shift Malam (Kontrol Brooder)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Status Kehadiran</label>
              <select
                value={attendanceType}
                onChange={(e: any) => setAttendanceType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
              >
                <option value="Hadir Masuk">Hadir Masuk</option>
                <option value="Hadir Pulang">Hadir Pulang</option>
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Lokasi / Blok Kandang</label>
              <select
                value={locationKandang}
                onChange={(e) => setLocationKandang(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
              >
                <option value="Kandang Petelur A & B">Kandang Petelur A &amp; B</option>
                <option value="Kandang Pembesaran C & Brooder">Kandang Pembesaran C &amp; Brooder</option>
                <option value="Ruang Mesin Tetas (Hatchery)">Ruang Mesin Tetas (Hatchery)</option>
                <option value="Gudang Pakan & Obat">Gudang Pakan &amp; Obat</option>
                <option value="Semua Area Farm">Semua Area Farm</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                <span>Suhu Ruangan (°C)</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={temperatureC}
                onChange={(e) => setTemperatureC(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Tugas / Aktivitas yang Dilakukan</label>
            <input
              type="text"
              value={tasksDone}
              onChange={(e) => setTasksDone(e.target.value)}
              placeholder="Contoh: Pemberian pakan pagi, pembersihan talang feses, panen telur"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Laporan Kondisi Kandang (Opsional)</label>
            <textarea
              rows={2}
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
              placeholder="Sirkulasi udara blower, ketersediaan air minum, status pemanas..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs"
            >
              Simpan Absensi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
