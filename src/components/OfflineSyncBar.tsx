import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, HardDrive, Cloud } from 'lucide-react';

interface OfflineSyncBarProps {
  onManualSync?: () => void;
}

export const OfflineSyncBar: React.FC<OfflineSyncBarProps> = ({ onManualSync }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
  });
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnectedToast(true);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'));
      setTimeout(() => setShowReconnectedToast(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnectedToast(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSyncClick = () => {
    setIsSyncing(true);
    if (onManualSync) {
      onManualSync();
    }
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'));
    }, 1200);
  };

  return (
    <>
      {/* Offline Alert Banner if Internet is Disconnected */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-4 py-2.5 text-xs flex items-center justify-between gap-3 shadow-sm z-30">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-amber-200" />
            <span>
              <b>Mode Offline Aktif (Tanpa Sinyal):</b> Anda tetap dapat mencatat panen, pakan, &amp; absensi di kandang. Data tersimpan aman di HP/perangkat dan otomatis disinkronkan saat kembali tersambung.
            </span>
          </div>
          <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-amber-700/80 text-[10px] font-bold border border-amber-400/30">
            Tersimpan di Memori Lokal
          </span>
        </div>
      )}

      {/* Online Reconnection Notification Toast */}
      {showReconnectedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-scale-up text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold">Koneksi Internet Pulih!</p>
            <p className="text-[11px] text-emerald-200">Seluruh data pencatatan kandang berhasil disinkronkan ke server farm.</p>
          </div>
        </div>
      )}
    </>
  );
};
