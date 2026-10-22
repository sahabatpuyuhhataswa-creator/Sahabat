# Rencana Implementasi: Perbaikan APK, Gambar, Populasi Pembesar & Instalasi HP

Dokumen ini merinci solusi untuk memenuhi permintaan Anda:
1. **Pembaruan Data di APK/PWA**: Memastikan data selalu sinkron dan tidak terkunci oleh data cache lama.
2. **Perbaikan Tampilan Gambar**: Memperbaiki pemuatan gambar agar tampil sempurna di aplikasi HP/APK dan produksi.
3. **Edit Langsung Populasi Pembesar**: Mempermudah peternak mengubah jumlah kawanan pembesaran (Starter/Grower) langsung dari Dashboard dan modul Sensus Populasi.
4. **Download & Pasang Aplikasi di HP**: Menyediakan tombol dan panduan instalasi langsung (PWA/WebAPK) agar aplikasi terpasang seperti aplikasi resmi di layar utama Android.

---

## 1. Analisis Akar Masalah (Root Causes)

| Masalah | Akar Masalah | Solusi |
|---|---|---|
| **Data Lama di APK** | `localStorage` pada browser/APK hanya memuat data server sekali jika storage kosong (`!localSaved`). Perubahan data server tidak otomatis meng-override data lokal, dan cache Service Worker menahan versi lama. | 1. Tambahkan tombol **"Sinkronisasi Cloud / Muat Data Baru"** di header/navbar.<br>2. Tambahkan pengecekan versi dan fitur *force reload* cache PWA.<br>3. Tambahkan fitur Ekspor/Impor JSON data cadangan. |
| **Gambar Belum Kelihatan** | File gambar berada di `/src/assets/images/` dan dipanggil dengan path unbundled `src="/src/assets/images/..."`. Saat aplikasi di-compile ke APK/PWA, folder `/src` tidak dilayani secara statis sehingga gambar 404/blank. | Salin semua aset gambar ke `/public/images/`, daftarkan di cache PWA `vite.config.ts`, dan perbarui semua tag `<img src="/images/..." onError={fallback} />`. |
| **Populasi Pembesar Belum Bisa Diubah Bebas di Dashboard** | Kartu Dashboard hanya menampilkan metrik gabungan "Total Populasi", dan belum ada tombol khusus untuk langsung fokus ke edit "Populasi Pembesaran". | 1. Tambahkan kartu metrik khusus **Populasi Pembesaran (Grower)** di Dashboard dengan tombol **"✏️ Edit Pembesar"**.<br>2. Perbarui `EditPopulationModal` agar dapat dibuka langsung dengan tab/fokus Pembesaran. |
| **Download Aplikasi di HP** | Pengguna HP membutuhkan cara instan memasang aplikasi tanpa harus mencari di menu browser yang rumit. | 1. Tangkap event `beforeinstallprompt` browser Android.<br>2. Buat tombol dan modal **"📲 Download & Pasang di HP"** dengan panduan interaktif instalasi 1-klik PWA/WebAPK. |

---

## 2. Rincian Perubahan Kode

### A. Aset Gambar Statis & PWA Cache
- Salin aset dari `/src/assets/images/` ke `/public/images/`:
  - `logo_hataswa.jpg`
  - `quail_farm_banner_1792556184331.jpg`
  - `quail_egg_harvest_farm_1792593478247.jpg`
  - `fresh_quail_eggs_1792556185971.jpg`
  - `farm_worker_attendance_1792558034797.jpg`
- Perbarui `vite.config.ts` untuk menyertakan folder `images/` dalam Workbox caching offline.
- Perbarui path gambar di:
  - `DashboardView.tsx` (Banner kandang & gambar rak baki panen telur)
  - `LoginScreen.tsx` (Background banner)
  - `EggRecordingView.tsx` (Foto rak telur & telur puyuh segar)
  - `mockData.ts` (Foto default absensi petugas)

### B. Fitur Edit Populasi Pembesaran (Grower)
- Modifikasi `EditPopulationModal.tsx`:
  - Tambahkan opsi `initialFocus?: 'all' | 'grower' | 'layer'`.
  - Jika dibuka via "Edit Pembesar", modal langsung menyoroti kolom Populasi Pembesaran (Starter/Grower) dengan kalkulasi otomatis kapasitas brooding dan rekomendasi pakan starter.
- Modifikasi `DashboardView.tsx`:
  - Tampilkan kartu ringkasan terpisah untuk **Populasi Petelur (Layer)** dan **Populasi Pembesaran (Grower)**.
  - Sediakan tombol cepat **"✏️ Edit Pembesar"** dan **"✏️ Edit Layer"**.
- Modifikasi `PopulationRecordingView.tsx`:
  - Tambahkan tombol pintas langsung di kartu Pembesaran untuk penyesuaian populasi cepat.

### C. Sinkronisasi Data & Anti-Cache di APK
- Tambahkan tombol **"Sinkronisasi Cloud"** dengan indikator status di bagian atas aplikasi.
- Saat ditekan:
  - Mengambil data terbaru dari `/api/farm-data`.
  - Memperbarui `localStorage` dan state React.
  - Memanggil `skipWaiting` dan membersihkan cache Service Worker agar APK langsung memuat data terbaru.
  - Menampilkan notifikasi Toast: *"Data berhasil diperbarui dari Cloud Server."*

### D. Fitur Download / Pasang Aplikasi di HP (PWA/WebAPK)
- Buat komponen `InstallAppModal.tsx`:
  - Mendeteksi apakah aplikasi dibuka di Android (Chrome), iOS (Safari), atau desktop.
  - Jika browser mendukung WebAPK / PWA prompt, sediakan tombol **"Pasang Aplikasi Sekarang (1-Klik)"**.
  - Sediakan panduan bergambar langkah demi langkah:
    - **Android (Chrome)**: Buka browser > Tekan titik tiga (⋮) > Pilih **"Tambahkan ke Layar Utama" / "Instal Aplikasi"**.
    - **iOS (iPhone)**: Tekan ikon Bagikan (Share) > Pilih **"Tambahkan ke Layar Utama"**.
- Tambahkan tombol di Navbar / Header: **"📲 Pasang di HP"**.

---

## 3. Rencana Verifikasi
1. **Pengujian Build**: Jalankan `compile_applet` untuk memastikan tidak ada kesalahan TypeScript atau Vite bundling.
2. **Verifikasi Gambar**: Pastikan semua URL `/images/...` ter-load dengan benar (status 200) tanpa broken image icon.
3. **Verifikasi Edit Pembesar**: Buka tombol edit pembesar dari Dashboard dan modul Sensus, ubah angka (misal: dari 1.450 menjadi 2.000 ekor), lalu pastikan angka langsung ter-update di Dashboard, Sensus, dan perhitungan pakan.
4. **Verifikasi Sinkronisasi & PWA**: Uji fungsionalitas tombol sinkronisasi data cloud dan dialog instalasi aplikasi HP.
