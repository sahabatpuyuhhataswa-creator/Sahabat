import React, { useState } from 'react';
import { FarmMetrics, UserRole } from '../types/quail';
import { formatRupiah } from '../utils/calculations';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Lightbulb,
  CheckCircle2,
  User,
} from 'lucide-react';

interface AiAdvisorViewProps {
  metrics: FarmMetrics;
  currentRole: UserRole;
  onSwitchToOwner: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiAdvisorView: React.FC<AiAdvisorViewProps> = ({
  metrics,
  currentRole,
  onSwitchToOwner,
}) => {
  const isOwner = currentRole === 'owner';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Halo! Saya **PuyuhAI Advisor**, asisten kecerdasan buatan khusus untuk **Sahabat Puyuh Hataswa**. 

Saya telah membaca data performa farm terkini:
- **Populasi:** ${metrics.activePopulation.toLocaleString('id-ID')} ekor
- **Produksi Hari Ini:** ${metrics.todayEggsKg} kg (${metrics.todayEggsPcs.toLocaleString('id-ID')} butir)
- **Hen-Day Production (HDP):** ${metrics.hdp}% (Target standar: 75% - 85%)
- **Rasio Konversi Pakan (FCR):** ${metrics.fcr} (Standar ideal: 2.0 - 2.3)
- **Estimasi Laba Bersih:** ${formatRupiah(metrics.monthlyNetProfit)} (Margin: ${metrics.profitMargin}%)
- **Titik Impas (BEP):** ${formatRupiah(metrics.bepPerKg)} / kg

Ada yang ingin Anda konsultasikan terkait efisiensi ransum, peningkatan produksi telur, atau pengelolaan keuangan farm?`,
      timestamp: 'Baru saja',
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickAudit, setQuickAudit] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  if (!isOwner) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center max-w-xl mx-auto my-12 shadow-xs">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Akses Terbatas: AI Financial Advisor</h2>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Fitur analisis kecerdasan buatan untuk audit finansial dan strategi peternakan hanya dapat diakses oleh akun Pemilik.
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

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuestion.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          farmContext: metrics,
          history: messages.slice(-4),
        }),
      });

      const data = await response.json();
      if (data.success && data.answer) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.answer,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || 'Gagal memproses jawaban.');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ Terjadi kendala: ${err.message || 'Tidak dapat terhubung ke AI service'}. Pastikan koneksi atau parameter farm sudah lengkap.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAudit = async () => {
    setIsAuditing(true);
    try {
      const response = await fetch('/api/ai-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmMetrics: metrics }),
      });
      const data = await response.json();
      if (data.success && data.audit) {
        setQuickAudit(data.audit);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const quickPrompts = [
    'Analisis FCR saat ini dan cara menekan biaya pakan tanpa menurunkan berat telur',
    'Bagaimana cara meningkatkan HDP dari 81% menjadi 85%+?',
    'Evaluasi titik impas (BEP) dan rekomendasi harga kontrak penjualan ke agen',
    'Tips manajemen pencahayaan kandang (lighting) dan pencegahan kanibalisme',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 p-6 rounded-2xl border border-purple-900/50 text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 mb-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>PuyuhAI · Gemini 3.8 Flash Specialist</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">
            AI Farm Advisor &amp; Konsultan Keuangan Puyuh
          </h1>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed max-w-2xl">
            Konsultasikan optimasi pakan, rasio konversi FCR, kurva produksi telur puyuh, penanganan cuaca panas, dan perencanaan ekspansi bisnis Sahabat Puyuh Hataswa secara real-time.
          </p>
        </div>

        <button
          onClick={handleGenerateAudit}
          disabled={isAuditing}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
        >
          {isAuditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          <span>Jalankan Audit Otomatis Farm</span>
        </button>
      </div>

      {/* Quick Audit Card (if available) */}
      {quickAudit && (
        <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Hasil Audit Otomatis Kinerja Farm</span>
            </div>
            <button
              onClick={() => setQuickAudit(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Tutup
            </button>
          </div>
          <div className="mt-3 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
            {quickAudit}
          </div>
        </div>
      )}

      {/* Suggested Prompts Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Pertanyaan Strategis yang Disarankan:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              disabled={isLoading}
              className="text-left text-xs bg-slate-50 hover:bg-purple-50 hover:text-purple-900 hover:border-purple-200 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-purple-600 text-white'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-amber-50 text-slate-900 border border-amber-200/70 rounded-tr-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-slate-400 font-medium">
                  <span className="font-semibold text-slate-600">
                    {m.role === 'user' ? 'Pemilik Farm' : 'PuyuhAI Advisor'}
                  </span>
                  <span>{m.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-lg">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>PuyuhAI sedang menganalisis data peternakan Anda...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Tanyakan hal teknis pakan, mortalitas, atau keuangan farm puyuh..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-purple-600 shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
