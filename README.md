# Panduan Penggunaan & Alur Kerja Sistem Informasi Laundry (LaundriQ)

Sistem Informasi Laundry ini dirancang secara spesifik sebagai solusi manajemen operasional laundry modern dengan antarmuka premium, responsif, dan performa tinggi.

---

## Tech Stack & Spesifikasi Teknologi 🛠️

Sistem ini dikembangkan menggunakan kombinasi teknologi web terbaru (Modern Full-Stack) untuk menjamin performa, keamanan, dan *user experience* yang mewah:

1. **Laravel 12 (PHP 8.2+)**: Framework Backend utama yang mengelola logika bisnis, keamanan melalui *Middleware*, dan akses data melalui Eloquent ORM.
2. **React 19**: Library Frontend untuk membangun antarmuka yang reaktif dan interaktif, memberikan pengalaman Single Page Application (SPA) yang mulus.
3. **Inertia.js**: Jembatan antara Laravel dan React yang memungkinkan pertukaran data secara langsung tanpa perlu membangun REST API terpisah.
4. **Tailwind CSS v4**: Generasi terbaru CSS framework untuk desain *utility-first* yang sangat cepat dan fleksibel. Menggunakan skema warna Slate, Sky, dan Emerald yang elegan.
5. **Lucide React**: Library ikon profesional yang menggantikan emoji dan SVG manual, memberikan kesan visual yang bersih dan konsisten di seluruh aplikasi.
6. **Laravel Breeze**: Sistem otentikasi siap pakai yang telah dimodifikasi dengan desain premium untuk gerbang akses pengguna.

---

## Panduan Instalasi (Setup Project) ⚙️

Ikuti langkah-langkah di bawah ini untuk menjalankan project di lingkungan lokal Anda:

1. **Clone Repositori**
   ```bash
   git clone https://github.com/RissN/laundry-app.git
   cd laundry-app
   ```

2. **Install Dependensi**
   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Environment (.env)**
   * Duplikasi file `.env.example` menjadi `.env`.
   * Sesuaikan koneksi database Anda:
     ```env
     DB_DATABASE=db_laundry
     DB_USERNAME=root
     DB_PASSWORD=
     ```

4. **Persiapan Database & Dummy Data**
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   ```
   **Opsional: Generate 174 Transaksi Dummy**
   Jika Anda membutuhkan data transaksi yang banyak untuk keperluan demo atau testing:
   ```bash
   php artisan db:seed --class=DummyDataSeeder
   ```
   *(Perintah ini akan membersihkan data lama dan memasukkan 174 transaksi baru yang tersebar dalam 30 hari terakhir).*

5. **Jalankan Aplikasi**
   Buka dua terminal terpisah:
   * **Terminal 1**: `php artisan serve`
   * **Terminal 2**: `npm run dev`

6. **Akses & Login**
   Buka `http://127.0.0.1:8000` dan gunakan akun default:
   * **Admin**: `admin@laundry.com` / `password`

---

## 1. Fitur Utama & Dashboard Berbasis Role

Sistem ini memiliki Dashboard dinamis yang menyesuaikan dengan level otoritas pengguna:

### 📊 Dashboard Admin
- **Metrik Sistem**: Total pelanggan terdaftar, jumlah order hari ini, dan total pendapatan harian.
- **Manajemen Master**: Kendali penuh atas data layanan (Service) dan manajemen akun pengguna (User).

### 🧺 Dashboard Operator (Kasir)
- **Metrik Operasional**: Jumlah transaksi masuk hari ini, daftar antrean pengambilan (Pending Pickups), dan total pickup sukses.
- **Transaksi Terbaru**: Tabel *real-time* yang menampilkan aktivitas laundry terbaru.
- **POS (Point of Sale)**: Menu "Terima Laundry" yang telah dirombak dengan UI mewah, memudahkan input berat, estimasi harga, dan data pelanggan baru secara instan.

### 📈 Dashboard Pimpinan
- **Analisis Performa**: Statistik mingguan/bulanan mengenai total order dan total pendapatan.
- **Laporan Penjualan**: Filter laporan berdasarkan rentang tanggal untuk kebutuhan audit dan rekapitulasi.

---

## 2. Tabel Hak Akses & Menu

| Modul / Menu               | Kegunaan                                                              | Diakses Oleh                   |
|----------------------------|-----------------------------------------------------------------------|--------------------------------|
| **Dashboard**              | Metrik statistik khusus berdasarkan peran/role pengguna.              | Admin, Operator, Pimpinan      |
| **Data Customer**          | Manajemen data pelanggan laundry.                                     | Admin                          |
| **Data User**              | Pengelolaan akun staf (Operator & Pimpinan).                          | Admin                          |
| **Data Service**           | Pengaturan jenis layanan dan harga per kilogram.                      | Admin                          |
| **Terima Laundry**         | POS modern untuk mencatat cucian masuk (berat & instruksi).           | Admin, Operator                |
| **Pengambilan & Bayar**    | Modul kasir untuk pelunasan dan serah terima pakaian.                 | Admin, Operator                |
| **Laporan Penjualan**      | Laporan detil pendapatan dengan filter periode waktu.                 | Pimpinan                       |

---

## 3. Panduan Kustomisasi Tampilan (Developer)

Sistem ini menggunakan arsitektur komponen React yang sangat modular.

### Mengubah Ikon
Aplikasi ini menggunakan **Lucide React**. Untuk mengubah ikon, Anda cukup mengimpor ikon baru dari library tersebut:
```jsx
import { WashingMachine, User } from 'lucide-react';

// Penggunaan di dalam komponen
<WashingMachine size={24} />
```

### Panduan Kustomisasi Warna (Tailwind v4) 🎨

Aplikasi ini menggunakan skema warna yang fleksibel melalui **Tailwind CSS v4**. Anda dapat mengubah seluruh suasana aplikasi hanya dengan memodifikasi satu file: `resources/css/app.css`.

#### 1. Mengubah Warna Tema Dasar
Buka file `resources/css/app.css` dan tambahkan variabel warna di dalam blok `@theme`. Misalnya, jika Anda ingin mengubah warna **Sky** (Biru) menjadi **Indigo** (Ungu Kebiruan):

```css
@theme {
    /* Mengganti palet warna default Sky dengan Indigo */
    --color-sky-50: var(--color-indigo-50);
    --color-sky-500: var(--color-indigo-500);
    --color-sky-900: var(--color-indigo-900);
    
    /* Atau mendefinisikan warna kustom sendiri */
    --color-primary-brand: #2563eb;
}
```

#### 2. Palet Warna yang Digunakan
Sistem ini secara default menggunakan:
- **Sky**: Sebagai warna utama (Sidebar, tombol primer, link aktif).
- **Slate**: Sebagai warna netral (Teks, ikon, background sekunder).
- **Emerald**: Sebagai indikator sukses/status positif.
- **Rose**: Sebagai indikator error/bahaya/logout.

#### 3. Cara Menggunakan Warna Baru
Setelah Anda mendefinisikan atau mengganti variabel di `@theme`, Anda bisa langsung menggunakannya di komponen React (`.jsx`) menggunakan utility classes standar Tailwind:
```jsx
// Jika Anda menambah warna kustom --color-primary-brand
<div className="bg-primary-brand text-white">
    Konten dengan warna baru
</div>
```

---

### Animasi
Kami menggunakan plugin `tailwindcss-animate` untuk transisi halus pada kartu dan modal. Anda dapat menyesuaikan durasi dengan kelas seperti `duration-500` atau jenis animasi seperti `slide-in-from-bottom`.

---

## 🚀 Langkah Produksi
Sebelum melakukan deployment, pastikan aset frontend telah dioptimasi:
```bash
npm run build
```
Hasil build akan berada di folder `public/build/`, siap untuk dijalankan di server produksi.
