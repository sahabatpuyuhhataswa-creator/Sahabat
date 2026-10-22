export type UserRole = 'owner' | 'staff';

export interface UserAccount {
  role: UserRole;
  username: string;
  name: string;
  password: string; // stored password
  lastLogin?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
}

export interface EggRecord {
  id: string;
  date: string; // YYYY-MM-DD
  timeOfDay: 'Pagi' | 'Sore' | 'Total Hari';
  kandang: string; // 'Kandang A', 'Kandang B', 'Kandang Petelur (A & B)'
  goodEggsPcs: number; // Butir Utuh (Grade A)
  brokenEggsPcs: number; // Butir Retak / Rusak
  totalWeightKg: number; // Total Berat Timbangan (Kg)
  notes?: string;
  // Optional legacy fields for backward-compatibility
  sellingPricePerKg?: number;
  revenue?: number;
  buyerName?: string;
  paymentStatus?: 'Lunas' | 'Piutang' | 'Stok Belum Terjual';
}

export interface EggSaleRecord {
  id: string;
  date: string; // YYYY-MM-DD
  buyerName: string; // e.g. "Pengepul Pak Slamet", "Agen Berkah Ibu Ani", "Warung Bu Siti"
  customerType?: 'Pengepul Besar' | 'Agen Telur' | 'Warung/Retail' | 'Konsumen Langsung';
  eggGrade: 'Telur Utuh / Grade A (Konsumsi)' | 'Telur Retak / Pecah Kulit (Diskon)' | 'Telur Asin / Olahan' | 'Campur / Partai Besar';
  quantityKg: number; // Volume penjualan (Kg)
  quantityPcs?: number; // Estimasi / jumlah butir
  trayCount?: number; // Jumlah rak / tray
  pricePerKg: number; // Harga jual per kg (Rp)
  totalRevenue: number; // Rp (quantityKg * pricePerKg)
  paymentStatus: 'Lunas' | 'Piutang' | 'DP / Uang Muka';
  paymentMethod: 'Tunai' | 'Transfer Bank' | 'QRIS';
  dueDate?: string; // Jatuh tempo jika piutang
  notes?: string;
}

export interface FeedRecord {
  id: string;
  date: string;
  feedCategory: 'Pakan Petelur (Layer)' | 'Pakan Pembesaran (Starter/Grower)';
  feedBrand: string; // e.g. "Malindo KL-2", "Pokphand P-500", "New Hope Puyuh Layer", "BR-1 Starter"
  feedType: 'Layer Dewasa' | 'Starter Brooding (0-3 Mgg)' | 'Grower Remaja (3-5 Mgg)' | 'Konsentrat';
  quantityKg: number;
  sackCount: number; // karung 50kg
  pricePerKg: number;
  totalCost: number;
  kandang: string;
  targetFlock: 'Kandang Petelur (Layer)' | 'Kandang Pembesaran (Grower/Starter)';
  notes?: string;
}

export interface PopulationRecord {
  id: string;
  date: string;
  flockType: 'Layer (Petelur)' | 'Pembesaran (Starter/Grower)';
  kandang: string;
  batchName?: string; // e.g. "Batch Pembesaran Okt-2026", "Batch Layer Indukan A"
  startingCount: number; // Populasi awal periode
  mortalityCount: number;
  culledCount: number; // afkir
  additionsCount: number; // bibit baru masuk atau mutasi dari pembesaran
  transferredCount?: number; // mutasi lulus ke kandang petelur
  activeCount: number;
  ageDays?: number; // Umur kawanan dalam hari (e.g. 14 hari masa pembesaran, 120 hari layer)
  mortalityReason?: string;
  cullSellingPricePerBird?: number;
  cullRevenue?: number;
  notes?: string;
}

export interface QuailSeedSaleRecord {
  id: string;
  date: string;
  seedType: 'DOQ (Day-Old Quail 1-3 Hari)' | 'Grower Remaja (Umur 2-3 Minggu)' | 'Pullet Siap Telur (Umur 30-35 Hari)';
  quantityBirds: number; // Total ekor
  boxCount: number; // Jumlah boks (isi 100 ekor)
  pricePerBird: number; // Rp / ekor (misal DOQ Rp 3.000, Pullet Rp 12.500)
  totalRevenue: number; // Rp
  buyerName: string;
  destinationCity?: string;
  paymentStatus: 'Lunas' | 'Piutang' | 'DP / Uang Muka';
  notes?: string;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  category: 'Listrik & Air' | 'Vitamin & Obat / Vaksin' | 'Gaji Karyawan' | 'Kemasan Tray & Mika' | 'Sekam & Kebersihan' | 'Perawatan Kandang' | 'Pemanas Brooding (Gas/Listrik)' | 'Lain-lain';
  description: string;
  amount: number;
  paymentMethod: 'Transfer Bank' | 'Tunai';
  receiptNo?: string;
}

export interface StaffAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  staffName: string; // e.g. "Pak Suryanto", "Mas Budi Santoso"
  shift: 'Shift Pagi (06.00 - 14.00)' | 'Shift Sore (14.00 - 20.00)' | 'Shift Malam (Kontrol Brooder)';
  locationKandang: string; // 'Kandang Petelur A', 'Kandang Pembesaran C', etc.
  attendanceType: 'Hadir Masuk' | 'Hadir Pulang' | 'Izin' | 'Sakit';
  method: 'Foto Kamera Kandang' | 'Input Manual Form';
  photoUrl?: string; // Base64 or local image URL
  temperatureC?: number;
  tasksDone: string;
  conditionNotes?: string;
}

export interface FarmMetrics {
  activeLayerPopulation: number; // Populasi Petelur Produktif
  activeGrowerPopulation: number; // Populasi Pembesaran (Starter/Grower)
  activePopulation: number; // Total Populasi (Layer + Pembesaran)
  todayEggsKg: number;
  todayEggsPcs: number;
  todayBrokenPcs: number;
  hdp: number; // Hen-Day Production % (berdasarkan populasi layer)
  fcr: number; // Feed Conversion Ratio telur (Pakan layer / Telur kg)
  avgEggWeightGram: number; // gram
  feedPerBirdGram: number; // gram / ekor / hari pakan layer
  mortality30DaysLayer: number;
  mortality30DaysGrower: number;
  mortality30Days: number;
  mortalityRate: number; // %
  monthlyEggRevenue: number;
  monthlySeedRevenue: number; // Omzet Penjualan Bibit Puyuh (DOQ / Pullet)
  monthlyCullRevenue: number;
  monthlyRevenue: number;
  monthlyLayerFeedCost: number;
  monthlyGrowerFeedCost: number;
  monthlyCost: number;
  monthlyNetProfit: number;
  profitMargin: number; // %
  bepPerKg: number; // Break Even Point Rp/kg
  feedStockSacksLayer: number;
  feedStockSacksGrower: number;
  feedStockSacks: number;
  totalEggHarvestKg: number; // Total Kg Panen Kumulatif
  totalEggSalesKg: number; // Total Kg Terjual
  eggStockKg: number; // Sisa Stok Telur di Gudang (Kg)
}
