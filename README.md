# Sahabat Puyuh Hataswa 🥚

Aplikasi Manajemen Peternakan Puyuh Petelur (*Coturnix japonica*) berbasis Web dan Progressive Web App (PWA). Didesain untuk memudahkan pencatatan produksi telur harian, pemantauan populasi kandang, manajemen pakan, hingga pembukuan keuangan peternakan secara rapi dan otomatis.

---

## 🌟 Fitur Utama

1. **Dashboard & Analitik Ternak**
   - Ringkasan produksi harian, mingguan, dan bulanan.
   - Perhitungan persentase produksi (*Hen-Day Production* / HDP) otomatis.
   - Grafik performa bertelur dan status stok telur siap jual.
   - Galeri foto panen dan panduan standar kualitas telur.

2. **Pencatatan Panen Telur (Egg Harvest)**
   - Input panen berdasarkan waktu (Pagi / Sore).
   - Pemisahan telur utuh (bagus) dan telur retak/rusak.
   - Fitur **Edit / Koreksi Data** langsung di tabel catatan.
   - Rekap total butir dan perkiraan berat (kg).

3. **Manajemen Populasi Kandang**
   - Pemantauan jumlah puyuh hidup per blok/baterai kandang.
   - Pencatatan mortalitas (kematian) dan afkir.
   - Fitur kustomisasi dan edit mandiri kapasitas populasi.

4. **Pencatatan Pakan & FCR**
   - Monitoring konsumsi pakan harian (gram/ekor/hari).
   - Perhitungan rasio konversi pakan (*Feed Conversion Ratio* / FCR).
   - Pengingat stok pakan menipis.

5. **Pencatatan Keuangan (Arus Kas)**
   - Penjualan telur (butir, kiloan, maupun per krat).
   - Pengeluaran operasional (pakan, vitamin, vaksin, sekam, listrik).
   - Laporan laba/rugi bersih otomatis.

6. **Dukungan Mobile & PWA (Bisa Jadi APK)**
   - Dapat diinstal langsung di HP Android maupun iOS tanpa perlu instalasi rumit.
   - Fitur **Auto-Update**: Begitu ada pembaruan di server/Vercel, aplikasi di HP otomatis diperbarui saat terhubung ke internet.
   - Dukungan offline cache untuk lingkungan kandang dengan sinyal terbatas.

---

## 🚀 Panduan Menjalankan Proyek

### Persyaratan Sistem
- Node.js versi 18 ke atas
- npm atau pnpm atau bun

### Instalasi Dependensi
```bash
npm install
```

### Menjalankan Mode Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### Menjalankan Build Produksi
```bash
npm run build
```
Hasil build siap disajikan di folder `dist`.

---

## ☁️ Deployment ke Vercel

1. Push seluruh kode ini ke repositori **GitHub** Anda.
2. Buka [Vercel](https://vercel.com/) dan impor repositori GitHub tersebut.
3. Vercel akan otomatis mendeteksi konfigurasi `vite` dan `vercel.json`.
4. Tekan tombol **Deploy**.

---

## 📱 Panduan Update Aplikasi di HP / APK

Aplikasi ini menggunakan teknologi **PWA (Progressive Web App)** dengan mode `autoUpdate`:

1. **Setelah Anda melakukan push update ke GitHub/Vercel:**
   - Vercel akan otomatis melakukan build versi baru.
2. **Di HP Pengguna / Peternak:**
   - Pastikan HP terhubung ke internet.
   - Buka aplikasi **Sahabat Puyuh Hataswa**. Sistem Service Worker akan otomatis mengunduh berkas pembaruan di latar belakang.
   - Tutup aplikasi sepenuhnya (swipe tutup dari *Recent Apps*), lalu buka kembali.
   - Versi terbaru langsung aktif tanpa perlu mengunduh atau menginstal ulang file APK!

---

## 🔒 Keamanan & Penyimpanan Data

- Data catatan panen, pakan, dan penjualan disimpan secara ganda di penyimpanan lokal perangkat (*localStorage*) serta disinkronkan ke server data (`/api/farm-data`).
- Tombol reset data dilindungi oleh dialog konfirmasi ganda untuk mencegah data ternak terhapus secara tidak sengaja.

---

© 2026 **Sahabat Puyuh Hataswa** - Solusi Digital Peternak Puyuh Indonesia.
