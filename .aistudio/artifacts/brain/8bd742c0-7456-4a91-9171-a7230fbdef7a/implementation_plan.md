# Rencana Implementasi: Fitur Faktur, Pengaturan Farm, & Optimasi Dashboard

Dokumen ini merinci solusi untuk memenuhi permintaan pengguna mengenai faktur, pengaturan usaha, dan fitur dashboard.

## 1. Data Structure & State Management
- **FarmConfig Interface**: Tambahkan ke `src/types/quail.ts`:
  ```typescript
  export interface FarmConfig {
    name: string;
    address: string;
    phone: string;
    website: string;
    email: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }
  ```
- **Persistance**: Simpan dan ambil `farmConfig` di `localStorage` bersama data aplikasi lainnya.

## 2. Fitur Faktur & Pengaturan (Settings)
- **SettingsPage.tsx**: Buat halaman baru untuk mengedit `FarmConfig`.
- **InvoiceModal.tsx**: Modifikasi untuk memuat `FarmConfig` dan mengizinkan *override* per faktur.
- **Print & PDF**: Tambahkan CSS khusus (`@media print`) untuk faktur agar terlihat profesional saat dicetak atau disimpan sebagai PDF.
- **Seed Sales Invoice**: Pastikan `SeedSalesView` menggunakan `InvoiceModal` yang diperbarui.

## 3. Optimasi Dashboard & Fitur Pakan
- **Daily Feed Consumption**: Tambahkan input log harian untuk konsumsi pakan (kg) di `FeedRecordingView` atau langsung di Dashboard.
- **FCR Simulation**: Perbarui logika simulasi di `ExpansionSimulatorView` untuk menangani skenario konsumsi pakan dan produksi telur > 5000 kg.
- **Scale-Up Notification**: Tambahkan logika di Dashboard untuk memantau populasi dan memberikan peringatan "waktunya scale up" berdasarkan parameter tertentu.

## 4. Rencana Kerja
1.  **Update Types**: Perbarui `src/types/quail.ts`.
2.  **Settings UI**: Buat/perbarui komponen untuk menyimpan detail farm/bank.
3.  **Invoice Refactoring**: Update `InvoiceModal.tsx` dan pastikan data per faktur dapat diedit.
4.  **Dashboard Updates**: Tambahkan pelacakan pakan harian, update simulasi FCR, dan tambahkan fitur notifikasi scale-up.
5.  **Verification**: Uji fitur print/PDF dan alur penyimpanan data.
