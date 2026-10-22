import React, { useState, useEffect, useRef } from 'react';
import { EggRecord } from '../types/quail';
import { formatNumber, formatDecimal } from '../utils/calculations';
import {
  Mic,
  MicOff,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Egg,
  Scale,
  RotateCcw,
  Volume2,
} from 'lucide-react';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEggHarvest: (record: Omit<EggRecord, 'id' | 'revenue'>) => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  onSaveEggHarvest,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extracted fields
  const [goodEggs, setGoodEggs] = useState<number>(4100);
  const [brokenEggs, setBrokenEggs] = useState<number>(15);
  const [weightKg, setWeightKg] = useState<number>(45.5);
  const [kandang, setKandang] = useState<string>('Kandang Petelur (A & B)');
  const [timeOfDay, setTimeOfDay] = useState<'Pagi' | 'Sore' | 'Total Hari'>('Total Hari');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check SpeechRecognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'id-ID'; // Bahasa Indonesia

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setErrorMessage('Izin mikrofon belum diberikan. Silakan izinkan akses mikrofon di browser.');
        } else {
          setErrorMessage(`Terjadi kendala suara: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        parseVoiceCommands(currentTranscript);
      };

      recognitionRef.current = recognition;
    } else {
      setErrorMessage('Browser ini tidak mendukung Web Speech Recognition. Anda dapat mencoba di Chrome atau Edge.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Parse voice text into structured data
  const parseVoiceCommands = (text: string) => {
    const lower = text.toLowerCase();

    // 1. Deteksi Kandang
    if (lower.includes('kandang a') || lower.includes('blok a')) {
      setKandang('Kandang A (Barat)');
    } else if (lower.includes('kandang b') || lower.includes('blok b')) {
      setKandang('Kandang B (Tengah)');
    } else if (lower.includes('kandang petelur')) {
      setKandang('Kandang Petelur (A & B)');
    }

    // 2. Deteksi Waktu Panen
    if (lower.includes('pagi')) {
      setTimeOfDay('Pagi');
    } else if (lower.includes('sore')) {
      setTimeOfDay('Sore');
    }

    // 3. Deteksi Angka Butir Utuh / Total Butir (e.g., "4100 butir", "4200 telur")
    const pcsMatch = lower.match(/(\d+)\s*(butir|btr|ekor|telur)/i);
    if (pcsMatch && pcsMatch[1]) {
      const parsedPcs = parseInt(pcsMatch[1], 10);
      if (parsedPcs > 100) {
        setGoodEggs(parsedPcs);
      }
    }

    // 4. Deteksi Telur Retak / Rusak (e.g. "retak 15", "rusak 20 butir")
    const brokenMatch = lower.match(/(retak|rusak|pecah)\s*(\d+)/i) || lower.match(/(\d+)\s*(retak|rusak|pecah)/i);
    if (brokenMatch) {
      const val = parseInt(brokenMatch[1] || brokenMatch[2], 10);
      if (!isNaN(val) && val < 500) {
        setBrokenEggs(val);
      }
    }

    // 5. Deteksi Berat Kg (e.g. "45 koma 5 kg", "45.5 kg", "46 kg")
    const kgCommaMatch = lower.match(/(\d+)\s*koma\s*(\d+)\s*kilo?/i);
    if (kgCommaMatch) {
      const kg = parseFloat(`${kgCommaMatch[1]}.${kgCommaMatch[2]}`);
      if (!isNaN(kg)) setWeightKg(kg);
    } else {
      const kgDirectMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kilo(?:gram)?)/i);
      if (kgDirectMatch) {
        const kg = parseFloat(kgDirectMatch[1].replace(',', '.'));
        if (!isNaN(kg)) setWeightKg(kg);
      }
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch {}
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEggHarvest({
      date: new Date().toISOString().split('T')[0],
      timeOfDay,
      kandang,
      goodEggsPcs: goodEggs,
      brokenEggsPcs: brokenEggs,
      totalWeightKg: weightKg,
      notes: `Input Suara (Voice-to-Text): "${transcript || 'Suara Petugas'}"`,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Mic className="w-5 h-5 text-amber-400" />
            <span>Voice-to-Text Input Lapangan</span>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <p className="text-slate-600 text-xs leading-relaxed">
            Praktis saat kedua tangan memegang tray telur di kandang. Tekan tombol mikrofon dan bicaralah dalam Bahasa Indonesia.
          </p>

          {/* Big Voice Button & Audio Waves Animation */}
          <div className="flex flex-col items-center justify-center py-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <button
              type="button"
              onClick={toggleListening}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform transform active:scale-95 cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-400/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              }`}
            >
              {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>

            <span className="mt-3 text-xs font-bold text-slate-800">
              {isListening ? 'Mendengarkan suara Anda...' : 'Ketuk untuk Mulai Bicara'}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              Contoh: "Panen 4100 butir, retak 15 butir, berat 45 koma 5 kg kandang A"
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Live Transcript */}
          {transcript && (
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block text-[10px] mb-1">Teks Suara Terdeteksi:</span>
              <p className="text-slate-800 italic">"{transcript}"</p>
            </div>
          )}

          {/* Parsed Extracted Values Preview */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Hasil Ekstraksi Formulir Otomatis:</span>
            </span>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-white rounded-lg border border-emerald-200">
                <span className="text-[10px] text-slate-500 block">Butir Utuh:</span>
                <span className="font-extrabold text-slate-900">{formatNumber(goodEggs)}</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-emerald-200">
                <span className="text-[10px] text-rose-500 block">Retak:</span>
                <span className="font-extrabold text-rose-600">{brokenEggs}</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-emerald-200">
                <span className="text-[10px] text-amber-700 block">Timbangan:</span>
                <span className="font-extrabold text-slate-900">{formatDecimal(weightKg)} kg</span>
              </div>
            </div>

            <div className="text-[11px] text-emerald-800 flex justify-between pt-1">
              <span>Lokasi: <b>{kandang}</b></span>
              <span>Waktu: <b>{timeOfDay}</b></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Hasil Panen Ini</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
