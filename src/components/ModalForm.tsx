import React, { useState } from 'react';
import {
  EggRecord,
  EggSaleRecord,
  FeedRecord,
  PopulationRecord,
  ExpenseRecord,
  QuailSeedSaleRecord,
} from '../types/quail';
import { X, Egg, Wheat, Activity, Receipt, Bird, ShoppingBag } from 'lucide-react';
import { DecimalInput } from './DecimalInput';

interface ModalFormProps {
  type: 'egg' | 'eggSale' | 'feed' | 'population' | 'expense' | 'seedSale' | null;
  onClose: () => void;
  onSaveEgg: (record: Omit<EggRecord, 'id' | 'revenue'>) => void;
  onSaveEggSale?: (record: Omit<EggSaleRecord, 'id' | 'totalRevenue'>) => void;
  onSaveFeed: (record: Omit<FeedRecord, 'id' | 'totalCost'>) => void;
  onSavePopulation: (record: Omit<PopulationRecord, 'id'>) => void;
  onSaveExpense: (record: Omit<ExpenseRecord, 'id'>) => void;
  onSaveSeedSale: (record: Omit<QuailSeedSaleRecord, 'id' | 'totalRevenue'>) => void;
  latestLayerPopulation: number;
  latestGrowerPopulation: number;
}

export const ModalForm: React.FC<ModalFormProps> = ({
  type,
  onClose,
  onSaveEgg,
  onSaveEggSale,
  onSaveFeed,
  onSavePopulation,
  onSaveExpense,
  onSaveSeedSale,
  latestLayerPopulation,
  latestGrowerPopulation,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // EGG HARVEST FORM STATE (Murni Panen Harian)
  const [eggDate, setEggDate] = useState(todayStr);
  const [eggTime, setEggTime] = useState<'Pagi' | 'Sore' | 'Total Hari'>('Total Hari');
  const [eggKandang, setEggKandang] = useState('Kandang Petelur (A & B)');
  const [goodEggs, setGoodEggs] = useState(4100);
  const [brokenEggs, setBrokenEggs] = useState(20);
  const [weightKg, setWeightKg] = useState(45.5);
  const [eggNotes, setEggNotes] = useState('');

  // EGG SALE FORM STATE (Khusus Transaksi Penjualan)
  const [saleDate, setSaleDate] = useState(todayStr);
  const [saleBuyerName, setSaleBuyerName] = useState('Pengepul Pak Slamet (Pasar Induk)');
  const [saleCustomerType, setSaleCustomerType] = useState<
    'Pengepul Besar' | 'Agen Telur' | 'Warung/Retail' | 'Konsumen Langsung'
  >('Pengepul Besar');
  const [saleEggGrade, setSaleEggGrade] = useState<
    'Telur Utuh / Grade A (Konsumsi)' | 'Telur Retak / Pecah Kulit (Diskon)' | 'Telur Asin / Olahan' | 'Campur / Partai Besar'
  >('Telur Utuh / Grade A (Konsumsi)');
  const [saleQuantityKg, setSaleQuantityKg] = useState(45.0);
  const [saleQuantityPcs, setSaleQuantityPcs] = useState(4100);
  const [saleTrayCount, setSaleTrayCount] = useState(45);
  const [salePricePerKg, setSalePricePerKg] = useState(33000);
  const [salePaymentStatus, setSalePaymentStatus] = useState<'Lunas' | 'Piutang' | 'DP / Uang Muka'>('Lunas');
  const [salePaymentMethod, setSalePaymentMethod] = useState<'Tunai' | 'Transfer Bank' | 'QRIS'>('Transfer Bank');
  const [saleDueDate, setSaleDueDate] = useState('');
  const [saleNotes, setSaleNotes] = useState('');

  const handleSaleKgChange = (val: number) => {
    setSaleQuantityKg(val);
    setSaleQuantityPcs(Math.round(val * 90));
    setSaleTrayCount(Math.round(val));
  };

  // FEED FORM STATE
  const [feedDate, setFeedDate] = useState(todayStr);
  const [feedCategory, setFeedCategory] = useState<'Pakan Petelur (Layer)' | 'Pakan Pembesaran (Starter/Grower)'>('Pakan Petelur (Layer)');
  const [feedBrand, setFeedBrand] = useState('Malindo KL-2 Quail Layer');
  const [feedType, setFeedType] = useState<'Layer Dewasa' | 'Starter Brooding (0-3 Mgg)' | 'Grower Remaja (3-5 Mgg)' | 'Konsentrat'>('Layer Dewasa');
  const [feedQtyKg, setFeedQtyKg] = useState(115);
  const [feedPricePerKg, setFeedPricePerKg] = useState(8400);
  const [feedKandang, setFeedKandang] = useState('Kandang Petelur (A & B)');
  const [feedNotes, setFeedNotes] = useState('');

  // POPULATION FORM STATE
  const [popDate, setPopDate] = useState(todayStr);
  const [flockType, setFlockType] = useState<'Layer (Petelur)' | 'Pembesaran (Starter/Grower)'>('Layer (Petelur)');
  const [batchName, setBatchName] = useState('Batch Petelur 2026');
  const [startingCount, setStartingCount] = useState(latestLayerPopulation || 5000);
  const [popKandang, setPopKandang] = useState('Kandang Petelur (A & B)');
  const [mortality, setMortality] = useState(2);
  const [culled, setCulled] = useState(0);
  const [additions, setAdditions] = useState(0);
  const [transferred, setTransferred] = useState(0);
  const [ageDays, setAgeDays] = useState(120);
  const [cullPrice, setCullPrice] = useState(5500);
  const [mortalityReason, setMortalityReason] = useState('Faktor usia/alami');
  const [popNotes, setPopNotes] = useState('');

  // SEED SALE FORM STATE
  const [seedDate, setSeedDate] = useState(todayStr);
  const [seedType, setSeedType] = useState<'DOQ (Day-Old Quail 1-3 Hari)' | 'Grower Remaja (Umur 2-3 Minggu)' | 'Pullet Siap Telur (Umur 30-35 Hari)'>('DOQ (Day-Old Quail 1-3 Hari)');
  const [quantityBirds, setQuantityBirds] = useState(500);
  const [boxCount, setBoxCount] = useState(5);
  const [pricePerBird, setPricePerBird] = useState(3000);
  const [seedBuyerName, setSeedBuyerName] = useState('Peternak Mitra');
  const [destinationCity, setDestinationCity] = useState('');
  const [seedPaymentStatus, setSeedPaymentStatus] = useState<'Lunas' | 'Piutang' | 'DP / Uang Muka'>('Lunas');
  const [seedNotes, setSeedNotes] = useState('');

  // EXPENSE FORM STATE
  const [expDate, setExpDate] = useState(todayStr);
  const [expCategory, setExpCategory] = useState<
    'Listrik & Air' | 'Vitamin & Obat / Vaksin' | 'Gaji Karyawan' | 'Kemasan Tray & Mika' | 'Sekam & Kebersihan' | 'Perawatan Kandang' | 'Pemanas Brooding (Gas/Listrik)' | 'Transportasi' | 'Lain-lain'
  >('Vitamin & Obat / Vaksin');
  const [expDesc, setExpDesc] = useState('Vitamin Egg Stimulant + Brooding Gas');
  const [expAmount, setExpAmount] = useState(150000);
  const [expMethod, setExpMethod] = useState<'Transfer Bank' | 'Tunai'>('Tunai');
  const [expReceipt, setExpReceipt] = useState('');
  const [expStaffName, setExpStaffName] = useState('Karyawan 1');
  const [expType, setExpType] = useState<'Biasa' | 'Kasbon' | 'Gaji'>('Biasa');

  const handleFlockTypeChange = (newType: 'Layer (Petelur)' | 'Pembesaran (Starter/Grower)') => {
    setFlockType(newType);
    if (newType === 'Layer (Petelur)') {
      setBatchName('Batch Petelur 2026');
      setStartingCount(latestLayerPopulation || 5000);
      setPopKandang('Kandang Petelur (A & B)');
      setAgeDays(120);
    } else {
      setBatchName('Batch Pembesaran Okt-2026');
      setStartingCount(latestGrowerPopulation || 1450);
      setPopKandang('Kandang Pembesaran (Blok C & Brooder)');
      setAgeDays(15);
    }
  };

  const handleSeedTypeChange = (st: any) => {
    setSeedType(st);
    if (st.includes('DOQ')) {
      setPricePerBird(3000);
    } else if (st.includes('Pullet')) {
      setPricePerBird(12500);
    } else {
      setPricePerBird(7500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'egg') {
      onSaveEgg({
        date: eggDate,
        timeOfDay: eggTime,
        kandang: eggKandang,
        goodEggsPcs: Number(goodEggs),
        brokenEggsPcs: Number(brokenEggs),
        totalWeightKg: Number(weightKg),
        notes: eggNotes || undefined,
      });
    } else if (type === 'eggSale') {
      if (onSaveEggSale) {
        onSaveEggSale({
          date: saleDate,
          buyerName: saleBuyerName,
          customerType: saleCustomerType,
          eggGrade: saleEggGrade,
          quantityKg: Number(saleQuantityKg),
          quantityPcs: Number(saleQuantityPcs),
          trayCount: Number(saleTrayCount),
          pricePerKg: Number(salePricePerKg),
          paymentStatus: salePaymentStatus,
          paymentMethod: salePaymentMethod,
          dueDate: salePaymentStatus === 'Piutang' && saleDueDate ? saleDueDate : undefined,
          notes: saleNotes || undefined,
        });
      }
    } else if (type === 'feed') {
      onSaveFeed({
        date: feedDate,
        feedCategory,
        feedBrand,
        feedType,
        quantityKg: Number(feedQtyKg),
        sackCount: Number((Number(feedQtyKg) / 50).toFixed(2)),
        pricePerKg: Number(feedPricePerKg),
        kandang: feedKandang,
        targetFlock:
          feedCategory === 'Pakan Petelur (Layer)'
            ? 'Kandang Petelur (Layer)'
            : 'Kandang Pembesaran (Grower/Starter)',
        notes: feedNotes || undefined,
      });
    } else if (type === 'population') {
      const activeCount =
        Number(startingCount) -
        Number(mortality) -
        Number(culled) -
        Number(transferred) +
        Number(additions);

      onSavePopulation({
        date: popDate,
        flockType,
        kandang: popKandang,
        batchName,
        startingCount: Number(startingCount),
        mortalityCount: Number(mortality),
        culledCount: Number(culled),
        additionsCount: Number(additions),
        transferredCount: Number(transferred),
        activeCount,
        ageDays: Number(ageDays),
        mortalityReason: Number(mortality) > 0 ? mortalityReason : undefined,
        cullSellingPricePerBird: Number(culled) > 0 ? Number(cullPrice) : undefined,
        cullRevenue: Number(culled) > 0 ? Number(culled) * Number(cullPrice) : undefined,
        notes: popNotes || undefined,
      });
    } else if (type === 'seedSale') {
      onSaveSeedSale({
        date: seedDate,
        seedType,
        quantityBirds: Number(quantityBirds),
        boxCount: Number(boxCount),
        pricePerBird: Number(pricePerBird),
        buyerName: seedBuyerName,
        destinationCity: destinationCity || undefined,
        paymentStatus: seedPaymentStatus,
        notes: seedNotes || undefined,
      });
    } else if (type === 'expense') {
      onSaveExpense({
        date: expDate,
        category: expCategory,
        description: expDesc,
        amount: Number(expAmount),
        paymentMethod: expMethod,
        receiptNo: expReceipt || undefined,
        staffName: expCategory === 'Gaji Karyawan' ? expStaffName : undefined,
        expenseType: expCategory === 'Gaji Karyawan' ? expType : 'Biasa',
      });
    }
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case 'egg':
        return { label: 'Catat Hasil Panen Harian Telur', icon: <Egg className="w-5 h-5 text-amber-500" /> };
      case 'eggSale':
        return { label: 'Catat Penjualan Telur Puyuh', icon: <ShoppingBag className="w-5 h-5 text-emerald-500" /> };
      case 'feed':
        return { label: 'Catat Pakan Masuk / Terpakai (Layer vs Pembesaran)', icon: <Wheat className="w-5 h-5 text-emerald-500" /> };
      case 'population':
        return { label: 'Catat Sensus & Populasi (Awal, Kematian, Mutasi)', icon: <Activity className="w-5 h-5 text-rose-500" /> };
      case 'seedSale':
        return { label: 'Catat Penjualan Bibit Puyuh (DOQ & Pullet)', icon: <Bird className="w-5 h-5 text-amber-500" /> };
      case 'expense':
        return { label: 'Catat Beban Operasional Farm', icon: <Receipt className="w-5 h-5 text-blue-500" /> };
    }
  };

  if (!type) return null;

  const info = getTitle();
  if (!info) return null;

  const eggHarvestTotalPcs = Number(goodEggs) + Number(brokenEggs);
  const eggHarvestAvgWeight = eggHarvestTotalPcs > 0 ? ((Number(weightKg) * 1000) / eggHarvestTotalPcs).toFixed(1) : '0';
  const eggHarvestBrokenPct = eggHarvestTotalPcs > 0 ? ((Number(brokenEggs) / eggHarvestTotalPcs) * 100).toFixed(1) : '0';

  const saleTotalOmzet = Math.round(Number(saleQuantityKg) * Number(salePricePerKg));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            {info.icon}
            <span>{info.label}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* EGG HARVEST FORM (Murni Panen Harian) */}
          {type === 'egg' && (
            <>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                Formulir ini murni untuk mencatat produksi panen telur harian dari kandang. Transaksi penjualan ke pembeli/agen dicatat secara terpisah di menu Penjualan Telur.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tanggal Panen</label>
                  <input
                    type="date"
                    value={eggDate}
                    onChange={(e) => setEggDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Waktu Panen</label>
                  <select
                    value={eggTime}
                    onChange={(e: any) => setEggTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                  >
                    <option value="Total Hari">Total Hari</option>
                    <option value="Pagi">Pagi Hari (06.30 - 08.00)</option>
                    <option value="Sore">Sore Hari (16.00 - 17.30)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Kandang / Blok</label>
                <select
                  value={eggKandang}
                  onChange={(e) => setEggKandang(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                >
                  <option value="Kandang Petelur (A & B)">Kandang Petelur (A &amp; B)</option>
                  <option value="Kandang A (Barat)">Kandang A (Barat)</option>
                  <option value="Kandang B (Tengah)">Kandang B (Tengah)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Butir Utuh (Grade A)</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    required
                    value={goodEggs}
                    onChange={(num) => setGoodEggs(num)}
                    placeholder="0"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-rose-600 font-semibold mb-1 text-[11px]">Retak / Rusak</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={brokenEggs}
                    onChange={(num) => setBrokenEggs(num)}
                    placeholder="0"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-rose-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-amber-700 font-semibold mb-1 text-[11px]">Total Bobot (Kg)</label>
                  <DecimalInput
                    allowDecimal={true}
                    min={0}
                    required
                    value={weightKg}
                    onChange={(num) => setWeightKg(num)}
                    placeholder="0.0"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-extrabold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-2.5 bg-slate-100 rounded-xl text-[11px] text-slate-600">
                <div>
                  <span>Rata-rata Bobot: </span>
                  <span className="font-bold text-slate-800">{eggHarvestAvgWeight} g/butir</span>
                </div>
                <div>
                  <span>Tingkat Kerusakan: </span>
                  <span className={`font-bold ${Number(eggHarvestBrokenPct) <= 1.5 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {eggHarvestBrokenPct}% {Number(eggHarvestBrokenPct) <= 1.5 ? '(Optimal)' : '(Tinggi)'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Catatan Tambahan Panen</label>
                <input
                  type="text"
                  value={eggNotes}
                  onChange={(e) => setEggNotes(e.target.value)}
                  placeholder="Kondisi kerabang tebal, warna bintik pekat, cuaca normal..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>
            </>
          )}

          {/* EGG SALE FORM (Khusus Transaksi Penjualan Telur) */}
          {type === 'eggSale' && (
            <>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 leading-relaxed">
                Pencatatan nota penjualan telur puyuh ke pelanggan. Transaksi ini akan otomatis menambah omzet farm dan mengurangi persediaan telur di gudang.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tanggal Penjualan</label>
                  <input
                    type="date"
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tipe Pelanggan</label>
                  <select
                    value={saleCustomerType}
                    onChange={(e: any) => setSaleCustomerType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                  >
                    <option value="Pengepul Besar">Pengepul Besar</option>
                    <option value="Agen Telur">Agen Telur</option>
                    <option value="Warung/Retail">Warung Makan / Retail (Soto &amp; Pecel)</option>
                    <option value="Konsumen Langsung">Konsumen Langsung</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Nama Pembeli / Agen</label>
                <input
                  type="text"
                  value={saleBuyerName}
                  onChange={(e) => setSaleBuyerName(e.target.value)}
                  required
                  placeholder="Contoh: Pengepul Pak Slamet (Pasar Induk)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Kategori / Grade Telur</label>
                <select
                  value={saleEggGrade}
                  onChange={(e: any) => setSaleEggGrade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                >
                  <option value="Telur Utuh / Grade A (Konsumsi)">Telur Utuh / Grade A (Konsumsi)</option>
                  <option value="Telur Retak / Pecah Kulit (Diskon)">Telur Retak / Pecah Kulit (Diskon Kuliner)</option>
                  <option value="Telur Asin / Olahan">Telur Asin / Olahan</option>
                  <option value="Campur / Partai Besar">Campur / Partai Besar</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Volume (Kg)</label>
                  <DecimalInput
                    allowDecimal={true}
                    min={0}
                    value={saleQuantityKg}
                    onChange={(num) => handleSaleKgChange(num)}
                    required
                    placeholder="0.0"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-extrabold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Estimasi Butir</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={saleQuantityPcs}
                    onChange={(num) => setSaleQuantityPcs(num)}
                    placeholder="0"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Jumlah Tray</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={saleTrayCount}
                    onChange={(num) => setSaleTrayCount(num)}
                    placeholder="0"
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 font-semibold text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Harga Jual per Kg (Rp)</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={salePricePerKg}
                    onChange={(num) => setSalePricePerKg(num)}
                    required
                    placeholder="33000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Total Nilai Penjualan</label>
                  <div className="w-full bg-emerald-50 border border-emerald-200 rounded-lg p-2 font-extrabold text-emerald-700 tabular-nums">
                    Rp {saleTotalOmzet.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Metode Pembayaran</label>
                  <select
                    value={salePaymentMethod}
                    onChange={(e: any) => setSalePaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  >
                    <option value="Transfer Bank">Transfer Bank (BCA / BRI / Mandiri)</option>
                    <option value="Tunai">Tunai / Cash</option>
                    <option value="QRIS">QRIS Hataswa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Status Pembayaran</label>
                  <select
                    value={salePaymentStatus}
                    onChange={(e: any) => setSalePaymentStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                  >
                    <option value="Lunas">Lunas (Selesai)</option>
                    <option value="Piutang">Piutang (Tempo Pembayaran)</option>
                    <option value="DP / Uang Muka">DP / Uang Muka</option>
                  </select>
                </div>
              </div>

              {salePaymentStatus === 'Piutang' && (
                <div>
                  <label className="block text-amber-800 font-semibold mb-1">
                    Tanggal Jatuh Tempo Piutang
                  </label>
                  <input
                    type="date"
                    value={saleDueDate}
                    onChange={(e) => setSaleDueDate(e.target.value)}
                    required
                    className="w-full bg-amber-50 border border-amber-300 rounded-lg p-2 font-semibold text-amber-950"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-medium mb-1">Catatan Penjualan / Pengiriman</label>
                <input
                  type="text"
                  value={saleNotes}
                  onChange={(e) => setSaleNotes(e.target.value)}
                  placeholder="Keterangan pengiriman, nomor kendaraan, atau rincian kemasan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>
            </>
          )}

          {/* FEED FORM */}
          {type === 'feed' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={feedDate}
                    onChange={(e) => setFeedDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kategori Peruntukan Pakan</label>
                  <select
                    value={feedCategory}
                    onChange={(e: any) => {
                      const val = e.target.value;
                      setFeedCategory(val);
                      if (val === 'Pakan Petelur (Layer)') {
                        setFeedType('Layer Dewasa');
                        setFeedBrand('Malindo KL-2 Quail Layer');
                        setFeedKandang('Kandang Petelur (A & B)');
                        setFeedPricePerKg(8400);
                      } else {
                        setFeedType('Starter Brooding (0-3 Mgg)');
                        setFeedBrand('Pokphand P-500 Starter Crumble');
                        setFeedKandang('Kandang Pembesaran (Blok C & Brooder)');
                        setFeedPricePerKg(9200);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold"
                  >
                    <option value="Pakan Petelur (Layer)">Pakan Petelur (Layer)</option>
                    <option value="Pakan Pembesaran (Starter/Grower)">Pakan Pembesaran (Starter/Grower)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Merek Pakan</label>
                  <input
                    type="text"
                    value={feedBrand}
                    onChange={(e) => setFeedBrand(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Formula Ransum</label>
                  <select
                    value={feedType}
                    onChange={(e: any) => setFeedType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  >
                    {feedCategory === 'Pakan Petelur (Layer)' ? (
                      <>
                        <option value="Layer Dewasa">Layer Dewasa (Bertelur)</option>
                        <option value="Konsentrat">Konsentrat Puyuh Layer</option>
                      </>
                    ) : (
                      <>
                        <option value="Starter Brooding (0-3 Mgg)">Starter Brooding DOQ (0-3 Mgg)</option>
                        <option value="Grower Remaja (3-5 Mgg)">Grower Remaja (3-5 Mgg)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jumlah Pakan (Kg)</label>
                  <DecimalInput
                    allowDecimal={true}
                    min={0}
                    value={feedQtyKg}
                    onChange={(num) => setFeedQtyKg(num)}
                    required
                    placeholder="0.0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Setara {(feedQtyKg / 50).toFixed(2)} Karung (50kg)
                  </span>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Harga per Kg (Rp)</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={feedPricePerKg}
                    onChange={(num) => setFeedPricePerKg(num)}
                    required
                    placeholder="8400"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Total: Rp {(feedQtyKg * feedPricePerKg).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Peruntukan Kandang</label>
                <input
                  type="text"
                  value={feedKandang}
                  onChange={(e) => setFeedKandang(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Catatan</label>
                <input
                  type="text"
                  value={feedNotes}
                  onChange={(e) => setFeedNotes(e.target.value)}
                  placeholder="Kondisi ransum, jadwal pemberian..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>
            </>
          )}

          {/* POPULATION FORM */}
          {type === 'population' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tanggal Sensus</label>
                  <input
                    type="date"
                    value={popDate}
                    onChange={(e) => setPopDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Pemisahan Kategori Kandang</label>
                  <select
                    value={flockType}
                    onChange={(e: any) => handleFlockTypeChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold"
                  >
                    <option value="Layer (Petelur)">Kandang Petelur (Layer)</option>
                    <option value="Pembesaran (Starter/Grower)">Kandang Pembesaran (Grower/Starter)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nama Batch / Kawanan</label>
                  <input
                    type="text"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Umur Kawanan (Hari)</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={ageDays}
                    onChange={(num) => setAgeDays(num)}
                    placeholder="120"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              {/* POPULASI AWAL */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-slate-800 font-bold mb-1">
                  Populasi Awal Periode (Ekor)
                </label>
                <DecimalInput
                  allowDecimal={false}
                  min={0}
                  value={startingCount}
                  onChange={(num) => setStartingCount(num)}
                  required
                  placeholder="5000"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold text-slate-900"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Jumlah burung pada awal siklus sensus ini.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kematian (Ekor)</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={mortality}
                    onChange={(num) => setMortality(num)}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-rose-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Burung Masuk Baru / DOQ (Ekor)</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={additions}
                    onChange={(num) => setAdditions(num)}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-emerald-600 font-bold"
                  />
                </div>
              </div>

              {flockType === 'Layer (Petelur)' ? (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Afkir Dijual (Ekor)</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={culled}
                    onChange={(num) => setCulled(num)}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-amber-600 font-bold"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Mutasi Lulus ke Kandang Petelur (Ekor)
                  </label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={transferred}
                    onChange={(num) => setTransferred(num)}
                    placeholder="0"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-blue-600 font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Burung pembesaran yang telah siap bertelur dipindahkan ke kandang layer.
                  </span>
                </div>
              )}

              {culled > 0 && flockType === 'Layer (Petelur)' && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Harga Jual per Ekor Afkir (Rp)</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={cullPrice}
                    onChange={(num) => setCullPrice(num)}
                    placeholder="5500"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-emerald-700"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Total Omzet Afkir: Rp {(culled * cullPrice).toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {mortality > 0 && (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Penyebab Kematian</label>
                  <select
                    value={mortalityReason}
                    onChange={(e) => setMortalityReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  >
                    <option value="Faktor usia/alami">Faktor usia / alami</option>
                    <option value="Kelemahan alami masa brooding DOQ">Kelemahan alami masa brooding DOQ</option>
                    <option value="Stres suhu panas siang hari">Stres suhu panas siang hari (Heat stress)</option>
                    <option value="Kanibalisme / patuk-mematuk">Kanibalisme / patuk-mematuk</option>
                    <option value="Gangguan pernapasan (CRD/Coryza)">Gangguan pernapasan (CRD / Coryza)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-medium mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={popNotes}
                  onChange={(e) => setPopNotes(e.target.value)}
                  placeholder="Kondisi kesehatan umum kawanan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>
            </>
          )}

          {/* SEED SALE FORM */}
          {type === 'seedSale' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tanggal Penjualan</label>
                  <input
                    type="date"
                    value={seedDate}
                    onChange={(e) => setSeedDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kategori Bibit Puyuh</label>
                  <select
                    value={seedType}
                    onChange={(e: any) => handleSeedTypeChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold"
                  >
                    <option value="DOQ (Day-Old Quail 1-3 Hari)">DOQ (Day-Old Quail 1-3 Hari)</option>
                    <option value="Grower Remaja (Umur 2-3 Minggu)">Grower Remaja (Umur 2-3 Minggu)</option>
                    <option value="Pullet Siap Telur (Umur 30-35 Hari)">Pullet Siap Telur (Umur 30-35 Hari)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kuantitas (Ekor)</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={quantityBirds}
                    onChange={(num) => {
                      setQuantityBirds(num);
                      setBoxCount(Math.ceil(num / 100));
                    }}
                    required
                    placeholder="500"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Jumlah Boks (isi 100 ekor)</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={boxCount}
                    onChange={(num) => setBoxCount(num)}
                    placeholder="5"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Harga per Ekor (Rp)</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={pricePerBird}
                    onChange={(num) => setPricePerBird(num)}
                    required
                    placeholder="3000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-emerald-700"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Total: Rp {(quantityBirds * pricePerBird).toLocaleString('id-ID')}
                  </span>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Status Pembayaran</label>
                  <select
                    value={seedPaymentStatus}
                    onChange={(e: any) => setSeedPaymentStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  >
                    <option value="Lunas">Lunas</option>
                    <option value="DP / Uang Muka">DP / Uang Muka</option>
                    <option value="Piutang">Piutang (Tempo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nama Pembeli / Peternak Mitra</label>
                  <input
                    type="text"
                    value={seedBuyerName}
                    onChange={(e) => setSeedBuyerName(e.target.value)}
                    placeholder="Contoh: Pak Joko / Farm Berkah"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kota / Daerah Tujuan</label>
                  <input
                    type="text"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    placeholder="Contoh: Magelang / Solo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={seedNotes}
                  onChange={(e) => setSeedNotes(e.target.value)}
                  placeholder="Keterangan vaksin tetes mata, kualitas bibit..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>
            </>
          )}

          {/* EXPENSE FORM */}
          {type === 'expense' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Tanggal Transaksi</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Kategori Biaya</label>
                  <select
                    value={expCategory}
                    onChange={(e: any) => setExpCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                  >
                    <option value="Listrik & Air">Listrik &amp; Air</option>
                    <option value="Pemanas Brooding (Gas/Listrik)">Pemanas Brooding Pembesaran (Gas/Listrik)</option>
                    <option value="Vitamin & Obat / Vaksin">Vitamin &amp; Obat / Vaksin</option>
                    <option value="Gaji Karyawan">Gaji Karyawan</option>
                    <option value="Kemasan Tray & Mika">Kemasan Tray, Mika &amp; Boks DOQ</option>
                    <option value="Sekam & Kebersihan">Sekam &amp; Kebersihan</option>
                    <option value="Perawatan Kandang">Perawatan Kandang</option>
                    <option value="Transportasi">Transportasi</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>

              {expCategory === 'Gaji Karyawan' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Nama Staf</label>
                    <select
                      value={expStaffName}
                      onChange={(e) => setExpStaffName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium"
                    >
                      <option value="Karyawan 1">Karyawan 1</option>
                      <option value="Karyawan 2">Karyawan 2</option>
                      <option value="Karyawan 3">Karyawan 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Tipe Pembayaran</label>
                    <select
                      value={expType}
                      onChange={(e: any) => setExpType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold"
                    >
                      <option value="Gaji">Gaji Pokok / Bonus</option>
                      <option value="Kasbon">Kasbon (Pinjaman)</option>
                      <option value="Biasa">Biasa / Lainnya</option>
                    </select>
                  </div>
                </div>
              )}
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Deskripsi Pengeluaran</label>
                <input
                  type="text"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Contoh: Vitamin Egg Stimulant & Gas Brooder"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Nominal (Rp)</label>
                  <DecimalInput
                    allowDecimal={false}
                    min={0}
                    value={expAmount}
                    onChange={(num) => setExpAmount(num)}
                    required
                    placeholder="150000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Metode Pembayaran</label>
                  <select
                    value={expMethod}
                    onChange={(e: any) => setExpMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  >
                    <option value="Tunai">Tunai (Kas Farm)</option>
                    <option value="Transfer Bank">Transfer Bank / BCA / Mandiri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">No. Bukti / Nota / Kuitansi</label>
                <input
                  type="text"
                  value={expReceipt}
                  onChange={(e) => setExpReceipt(e.target.value)}
                  placeholder="Contoh: NOTA-0284 / TRF-88192"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow-xs"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
