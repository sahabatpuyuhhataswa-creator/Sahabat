import {
  EggRecord,
  FeedRecord,
  PopulationRecord,
  ExpenseRecord,
  QuailSeedSaleRecord,
  StaffAttendanceRecord,
} from '../types/quail';

export function getInitialEggRecords(): EggRecord[] {
  const records: EggRecord[] = [];
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const basePcs = 4050 + Math.floor(Math.sin(i * 1.5) * 120) + (Math.floor(Math.random() * 60) - 30);
    const brokenPcs = 18 + Math.floor(Math.random() * 12);
    const goodPcs = basePcs - brokenPcs;
    const totalKg = Number(((basePcs * 10.9) / 1000).toFixed(2));
    const pricePerKg = 33000;
    const revenue = Math.round(totalKg * pricePerKg);

    records.push({
      id: `egg-${dateStr}`,
      date: dateStr,
      timeOfDay: 'Total Hari',
      kandang: 'Kandang Petelur (A & B)',
      goodEggsPcs: goodPcs,
      brokenEggsPcs: brokenPcs,
      totalWeightKg: totalKg,
      sellingPricePerKg: pricePerKg,
      revenue: revenue,
      buyerName: i % 2 === 0 ? 'Pengepul Pak Slamet (Pasar Induk)' : 'Agen Telur Berkah Ibu Ani',
      paymentStatus: 'Lunas',
      notes: i === 0 ? 'Kualitas kerabang sangat bagus, warna bintik coklat pekat' : undefined,
    });
  }

  return records;
}

export function getInitialFeedRecords(): FeedRecord[] {
  const records: FeedRecord[] = [];
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // 1. Pakan Petelur (Layer Dewasa) ~ 5,000 birds @ 23g = ~115kg/day
    const layerKg = Number((115 + (Math.sin(i) * 2.5)).toFixed(1));
    const layerPricePerKg = 8400; // Rp 420.000 / karung 50kg
    records.push({
      id: `feed-layer-${dateStr}`,
      date: dateStr,
      feedCategory: 'Pakan Petelur (Layer)',
      feedBrand: 'Malindo KL-2 Quail Layer',
      feedType: 'Layer Dewasa',
      quantityKg: layerKg,
      sackCount: Number((layerKg / 50).toFixed(2)),
      pricePerKg: layerPricePerKg,
      totalCost: Math.round(layerKg * layerPricePerKg),
      kandang: 'Kandang Petelur (A & B)',
      targetFlock: 'Kandang Petelur (Layer)',
      notes: 'Pemberian pakan layer 2x sehari (07.00 & 15.30 WIB)',
    });

    // 2. Pakan Pembesaran (Starter/Grower) ~ 1,500 young birds @ 15g = ~22.5kg/day
    const growerKg = Number((22 + (Math.cos(i) * 1.2)).toFixed(1));
    const growerPricePerKg = 9200; // Pakan starter protein tinggi (PK 24-26%)
    records.push({
      id: `feed-grower-${dateStr}`,
      date: dateStr,
      feedCategory: 'Pakan Pembesaran (Starter/Grower)',
      feedBrand: 'Pokphand P-500 Starter Crumble',
      feedType: 'Starter Brooding (0-3 Mgg)',
      quantityKg: growerKg,
      sackCount: Number((growerKg / 50).toFixed(2)),
      pricePerKg: growerPricePerKg,
      totalCost: Math.round(growerKg * growerPricePerKg),
      kandang: 'Kandang Pembesaran (Blok C & Brooder)',
      targetFlock: 'Kandang Pembesaran (Grower/Starter)',
      notes: 'Ransum protein tinggi 25% + air gula jawa pada 3 hari pertama DOQ',
    });
  }

  return records;
}

export function getInitialPopulationRecords(): PopulationRecord[] {
  const records: PopulationRecord[] = [];
  const today = new Date();

  let layerCount = 5025;
  let growerCount = 1500; // 1,500 DOQ/grower bibit pembesaran

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // LAYER POPULATION LOG
    const layerMortality = Math.random() < 0.6 ? Math.floor(Math.random() * 2) + 1 : 0;
    const layerCulled = i === 7 ? 25 : 0;
    const layerAdditions = i === 3 ? 50 : 0; // 50 pullet lulus dari pembesaran ke layer
    const layerStart = layerCount;
    layerCount = layerStart - layerMortality - layerCulled + layerAdditions;

    records.push({
      id: `pop-layer-${dateStr}`,
      date: dateStr,
      flockType: 'Layer (Petelur)',
      kandang: 'Kandang Petelur (A & B)',
      batchName: 'Batch Layer Produktif 2026',
      startingCount: layerStart,
      mortalityCount: layerMortality,
      culledCount: layerCulled,
      additionsCount: layerAdditions,
      activeCount: layerCount,
      ageDays: 140 - i, // ~4.5 bulan
      mortalityReason: layerMortality > 0 ? (i % 2 === 0 ? 'Faktor usia/alami' : 'Stres cuaca panas') : undefined,
      cullSellingPricePerBird: layerCulled > 0 ? 5500 : undefined,
      cullRevenue: layerCulled > 0 ? layerCulled * 5500 : undefined,
      notes: layerAdditions > 0 ? 'Penerimaan 50 ekor pullet siap telur dari kandang pembesaran' : undefined,
    });

    // GROWER / PEMBESARAN LOG
    const growerMortality = Math.random() < 0.4 ? 1 : 0;
    const growerTransferred = i === 3 ? 50 : 0; // mutasi naik ke layer
    const growerCulled = 0;
    const growerAdditions = i === 12 ? 300 : 0; // 300 DOQ baru masuk
    const growerStart = growerCount;
    growerCount = growerStart - growerMortality - growerCulled - growerTransferred + growerAdditions;

    records.push({
      id: `pop-grower-${dateStr}`,
      date: dateStr,
      flockType: 'Pembesaran (Starter/Grower)',
      kandang: 'Kandang Pembesaran (Blok C & Brooder)',
      batchName: 'Batch Pembesaran Okt-2026',
      startingCount: growerStart,
      mortalityCount: growerMortality,
      culledCount: growerCulled,
      additionsCount: growerAdditions,
      transferredCount: growerTransferred,
      activeCount: growerCount,
      ageDays: 20 - i, // umur 7-20 hari
      mortalityReason: growerMortality > 0 ? 'Kelemahan alami masa brooding' : undefined,
      notes: growerTransferred > 0 ? '50 ekor pullet diseleksi masuk ke kandang petelur' : undefined,
    });
  }

  return records;
}

export function getInitialSeedSaleRecords(): QuailSeedSaleRecord[] {
  const currentMonth = new Date().toISOString().slice(0, 7);

  return [
    {
      id: 'seed-sale-1',
      date: `${currentMonth}-04`,
      seedType: 'DOQ (Day-Old Quail 1-3 Hari)',
      quantityBirds: 500,
      boxCount: 5,
      pricePerBird: 3000,
      totalRevenue: 1500000,
      buyerName: 'Kelompok Ternak Puyuh Makmur (Pak Joko)',
      destinationCity: 'Kab. Magelang',
      paymentStatus: 'Lunas',
      notes: 'DOQ jantan-betina unsexed kualitas super, vaksin tetes mata ND-IB terpasang',
    },
    {
      id: 'seed-sale-2',
      date: `${currentMonth}-09`,
      seedType: 'Pullet Siap Telur (Umur 30-35 Hari)',
      quantityBirds: 200,
      boxCount: 2,
      pricePerBird: 12500,
      totalRevenue: 2500000,
      buyerName: 'Bapak Hartono Farm',
      destinationCity: 'Kota Solo',
      paymentStatus: 'Lunas',
      notes: 'Pullet betina siap bertelur umur 32 hari, bobot rata-rata 130g',
    },
    {
      id: 'seed-sale-3',
      date: `${currentMonth}-16`,
      seedType: 'DOQ (Day-Old Quail 1-3 Hari)',
      quantityBirds: 1000,
      boxCount: 10,
      pricePerBird: 2800,
      totalRevenue: 2800000,
      buyerName: 'Kemitraan Peternak Muda Berkah',
      destinationCity: 'Kab. Boyolali',
      paymentStatus: 'Lunas',
      notes: 'Pesanan langganan rutin per 2 minggu',
    },
    {
      id: 'seed-sale-4',
      date: `${currentMonth}-19`,
      seedType: 'Grower Remaja (Umur 2-3 Minggu)',
      quantityBirds: 150,
      boxCount: 2,
      pricePerBird: 7500,
      totalRevenue: 1125000,
      buyerName: 'Ibu Rahmawati',
      destinationCity: 'Yogyakarta',
      paymentStatus: 'Lunas',
      notes: 'Bibit remaja bulu sempurna dan nafsu makan tinggi',
    },
  ];
}

export function getInitialExpenseRecords(): ExpenseRecord[] {
  const currentMonth = new Date().toISOString().slice(0, 7);

  return [
    {
      id: 'exp-1',
      date: `${currentMonth}-02`,
      category: 'Listrik & Air',
      description: 'Tagihan PLN Listrik Kandang (Lampu 16 jam & Blower Pompa Air)',
      amount: 450000,
      paymentMethod: 'Transfer Bank',
      receiptNo: 'PLN-8849102',
    },
    {
      id: 'exp-2',
      date: `${currentMonth}-03`,
      category: 'Pemanas Brooding (Gas/Listrik)',
      description: 'Tabung Gas LPG 3kg (4 tabung) untuk penghangat kandang brooding DOQ pembesaran',
      amount: 88000,
      paymentMethod: 'Tunai',
      receiptNo: 'GAS-019',
    },
    {
      id: 'exp-3',
      date: `${currentMonth}-05`,
      category: 'Vitamin & Obat / Vaksin',
      description: 'Egg Stimulant + Vita Stress Medion & Vaksin ND-IB Tetes Mata',
      amount: 320000,
      paymentMethod: 'Tunai',
      receiptNo: 'PS-MED-104',
    },
    {
      id: 'exp-4',
      date: `${currentMonth}-10`,
      category: 'Kemasan Tray & Mika',
      description: 'Egg Tray Kertas isi 90 butir (150 pcs) & Boks Karton DOQ isi 100 (20 pcs)',
      amount: 450000,
      paymentMethod: 'Tunai',
    },
    {
      id: 'exp-5',
      date: `${currentMonth}-15`,
      category: 'Gaji Karyawan',
      description: 'Gaji 2 Petugas Kandang (Pakan layer, perawatan brooder pembesaran, panen telur)',
      amount: 3200000,
      paymentMethod: 'Transfer Bank',
      receiptNo: 'TRF-PAY-01',
    },
    {
      id: 'exp-6',
      date: `${currentMonth}-18`,
      category: 'Sekam & Kebersihan',
      description: 'Sekam alas kotoran kandang & disinfektan kandang (Antisep)',
      amount: 180000,
      paymentMethod: 'Tunai',
    },
  ];
}

export function getInitialAttendanceRecords(): StaffAttendanceRecord[] {
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  return [
    {
      id: 'att-1',
      date: todayStr,
      time: '06:15',
      staffName: 'Pak Suryanto (Kepala Kandang)',
      shift: 'Shift Pagi (06.00 - 14.00)',
      locationKandang: 'Kandang Petelur A & B',
      attendanceType: 'Hadir Masuk',
      method: 'Foto Kamera Kandang',
      photoUrl: '/src/assets/images/farm_worker_attendance_1792558034797.jpg',
      temperatureC: 27.5,
      tasksDone: 'Pemberian pakan pagi 115kg, kontrol nipple minum, penimbangan panen telur pagi',
      conditionNotes: 'Kandang bersih, sirkulasi udara baik, kawanan aktif',
    },
    {
      id: 'att-2',
      date: todayStr,
      time: '06:30',
      staffName: 'Mas Budi Santoso',
      shift: 'Shift Pagi (06.00 - 14.00)',
      locationKandang: 'Kandang Pembesaran C & Brooder',
      attendanceType: 'Hadir Masuk',
      method: 'Input Manual Form',
      temperatureC: 33.2,
      tasksDone: 'Pemberian ransum starter DOQ, pengecekan pemanas gas brooder, kontrol alas sekam',
      conditionNotes: 'Suhu brooder stabil 33°C, DOQ menyebar merata di lingkaran brooder',
    },
    {
      id: 'att-3',
      date: yesterdayStr,
      time: '14:10',
      staffName: 'Mas Didik Kurniawan',
      shift: 'Shift Sore (14.00 - 20.00)',
      locationKandang: 'Kandang Petelur A & B',
      attendanceType: 'Hadir Masuk',
      method: 'Input Manual Form',
      temperatureC: 29.0,
      tasksDone: 'Pemberian pakan sore, pembersihan feses sekam, packing telur ke egg tray',
      conditionNotes: 'Pencahayaan lampu malam dinyalakan jam 17.30 WIB',
    },
    {
      id: 'att-4',
      date: yesterdayStr,
      time: '19:50',
      staffName: 'Mas Didik Kurniawan',
      shift: 'Shift Sore (14.00 - 20.00)',
      locationKandang: 'Kandang Petelur A & B',
      attendanceType: 'Hadir Pulang',
      method: 'Input Manual Form',
      temperatureC: 26.8,
      tasksDone: 'Selesai shift sore, pintu kandang terkunci aman, lampu 16 jam menyala',
      conditionNotes: 'Semua aman, persediaan air tangki tandon penuh',
    },
  ];
}
