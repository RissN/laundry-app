# Panduan Penggunaan & Alur Kerja Sistem Informasi Laundry (LaundriQ)

Sistem Informasi Laundry ini dirancang secara spesifik untuk mematuhi kaidah Uji Kompetensi (UJIKOM) Keahlian Rekayasa Perangkat Lunak / Web Programming. 

---

## Tech Stack & Spesifikasi Teknologi 🛠️

Sistem ini dikembangkan menggunakan kombinasi teknologi web modern (Full-Stack Monolith) untuk menjamin performa, keamanan, dan *developer experience* yang handal:

1. **Laravel 12 (PHP 8.2+)**: Berperan sebagai *Backend / Core Framework*. Bertugas penuh dalam mengelola *Routing*, koneksi ke *Database*, pengamanan rute melalui *Middleware (CheckRole)*, validasi form, dan *Eloquent ORM*.
2. **React 19**: Digunakan sebagai *Library Frontend* utama. Seluruh antar-muka (*User Interface*) pengguna dibangun berbasis komponen yang reaktif dan interaktif (khususnya untuk halaman Transaksi Kasir POS).
3. **Inertia.js**: Berperan memfasilitasi komunikasi tipe SPA (*Single Page Application*) klasik. Inertia menjembatani pertukaran properti data langsung dari Controller Server Laravel ke komponen View React tanpa perlu merancang API terpisah (Tanpa REST API / JWT Token).
4. **Tailwind CSS v4**: Sistem desain grafis *Utility-First* yang mengatur penempatan *layout*, tipografi, skema warna gelap-terang (Indigo/Slate), hingga pembuatan desain kartu dan *sidebar* agar terasa minimalis.
5. **Laravel Breeze**: Sebuah sistem perancah (*scaffolding*) yang menghandle gerbang keamanan pintu masuk, mencakup proses otentikasi (Sistem Mendaftar / Verifikasi *Login* Aman).

---

## Panduan Instalasi (Setup Project) ⚙️

Ikuti langkah-langkah di bawah ini untuk menjalankan project ke komputer lokal Anda:

1. **Clone Repositori**
   ```bash
   git clone https://github.com/RissN/laundry-app.git
   cd laundry-app
   ```

2. **Install Dependensi PHP & Node.js**
   ```bash
   composer install
   npm install
   ```

3. **Konfigurasi Environment (.env)**
   * Duplikasi file `.env.example` dan ubah namanya menjadi `.env`.
   * Atur kredensial *Database* pada file `.env` ke nama database lokal Anda (misal `db_laundry`):
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=db_laundry
     DB_USERNAME=root
     DB_PASSWORD=
     ```

4. **Generate Key & Migrasi Database Eksekusi**
   ```bash
   php artisan key:generate
   php artisan migrate --seed
   ```
   *(Harap pastikan modul MySQL pada aplikasi XAMPP Anda sudah distart dan databse tujuan telah dibuat sebelum melakukan iterasi ini).*

5. **Jalankan Development Server**
   Buka dua jendela terminal secara terpisah pada direktori project Anda:
   * **Terminal 1** (Service PHP Backend):
     ```bash
     php artisan serve
     ```
   * **Terminal 2** (Vite / React Auto-refresh Server):
     ```bash
     npm run dev
     ```
     
6. **Selesai!** 
Akses `http://127.0.0.1:8000` di web browser Anda dan login dengan akun default Administrator: 
   * **Email**: `admin@laundry.com`
   * **Password**: `password`

---

## 1. Alur Kerja (Workflow) Program Utama

Sistem ini membagi wewenang berdasarkan tiga jenis hak akses (Role): **Admin**, **Operator**, dan **Pimpinan**.

### A. Persiapan Master Data (Oleh Admin)
Sebelum sistem dapat digunakan untuk transaksi sehari-hari, **Admin** harus memasukkan data dasar:
1. Menambahkan master data **Jenis Layanan** beserta harganya per satuan Kilogram (Contoh: "Cuci Komplit", Rp8.000).
2. Menambahkan akun **User** baru dari pegawai yang akan bekerja (Misalnya mendaftarkan akun untuk Operator kasir, atau Pimpinan).
 *(Catatan: Data pelanggan juga bisa ditambah oleh Admin, namun bisa juga ditambah secara dinamis oleh Operator saat transaksi).*

### B. Menerima Cucian Masuk (Oleh Operator)
Saat pelanggan datang membawa pakaian kotor:
1. **Operator** membuka menu **Terima Laundry**.
2. Jika ini adalah pelanggan lama, Operator cukup memilih nama pelanggan dari _dropdown list_. Jika ini pelanggan baru, Operator dapat langsung mengetikkan Nama, Nomor HP, dan Alamat di form yang sama tanpa perlu pindah halaman.
3. Operator memilih layanannya apa, lalu memasukkan total persis gram/kg pakaian pelanggan ke form input "Berat". Subtotal langsung terhitung otomatis.
4. Klik **Proses Transaksi**. Order sukses dibuat dengan Status "**Diproses / Baru**".

### C. Pengambilan Cucian & Pembayaran (Oleh Operator)
Saat pelanggan datang mengambil pakaian dan melunasi pembayaran:
1. **Operator** membuka menu **Pengambilan & Bayar**.
2. Halaman ini HANYA menampilkan daftar pakaian pelanggan yang statusnya masih belum diambil.
3. Operator mengarahkan klik pada tombol merah mudah **Ambil & Bayar**. Sebuah popup akan muncul.
4. Operator menginput jumlah uang riil (Rp) yang diberikan oleh pelanggan. Sistem seketika memberitahu berapa uang **Kembalian**.
5. Transaksi selesai! Status Order berubah menjadi "**Selesai / Diambil**".

### D. Rekapitulasi & Pelaporan (Oleh Pimpinan)
Di akhir bulan atau hari:
1. **Pimpinan** masuk dan membuka menu **Laporan Penjualan**.
2. Pimpinan bisa melihat seluruh riwayat secara rinci, serta melihat box besar **Total Pendapatan** uang yang sukses masuk ke laci (Hanya menghitung order yang statusnya *Selesai*).
3. Pimpinan dapat melakukan input filter "Dari Tanggal" dan "Sampai Tanggal" untuk melihat uang masuk berdasarkan periode tertentu.

---

## 2. Tabel Hak Akses & Modul Penggunaan

Berikut adalah rincian hak akses modul apa saja yang dimanifestasikan pada sisi navigasi (Sidebar):

| Modul / Menu               | Kegunaan                                                              | Diakses Oleh                   |
|----------------------------|-----------------------------------------------------------------------|--------------------------------|
| **Dashboard**              | Tampilan sapaan awal dan metrik statistik (Total pelanggan & profit)  | Admin, Operator, Pimpinan      |
| **Data Customer**          | CRUD (Tambah, Edit, Hapus) Master Data Pelanggan.                     | Admin                          |
| **Data User**              | CRUD Akun yang diperbolehkan masuk ke web.                            | Admin                          |
| **Data Service**           | CRUD Jenis perbaikan / layanan laundry beserta daftar Harga.          | Admin                          |
| **Terima Laundry**         | Form POS untuk checkout dan mencatat penerimaan baju dari pelanggan.  | Admin, Operator                |
| **Pengambilan & Bayar**    | Modul kasir kas masuk untuk menerima uang dan memberikan pakaian.     | Admin, Operator                |
| **Laporan Penjualan**      | Table History dengan custom filter by Date Range dan Agregat total.   | Pimpinan                       |

*_Aturan Khusus:_ Karena Administrator adalah level tertinggi, ia juga diperbolehkan untuk bertindak sebagai Operator (Melakukan transaksi POS).*

---

# Panduan Kustomisasi Tampilan Web (UI/UX)

Sistem ini dibangun menggunakan **React 19** dan **Tailwind CSS v4**. Tidak ada file CSS raksasa yang membingungkan. Segala bentuk warna, posisi, dan desain dikendalikan langsung oleh *utility classes* di dalam file-file komponen `.jsx`.

Berikut adalah panduan lengkap cara melakukan kustomisasi komponen website:

---

## 1. Mengubah Skema Warna Utama (Tema)
Aplikasi ini rata-rata mendominasi skema warna **Sky** (`sky-x`) untuk aksen utama dan **Emerald** (`emerald-x`) untuk status terselesaikan.

**Cara paling praktis untuk mengubah warna web:**
Buka fitur **Search & Replace** atau Tekan `Ctrl + Shift + F` pada VSCode ("Find in Files"), dan operasikan seperti ini:
- Temukan (Search): `sky-`
- Ganti dengan (Replace): `indigo-` (Jika ingin kembali ke ungu) atau `emerald-` (Untuk tema hijau laundry).

*Pastikan Anda melakukan *Replace All* hanya di dalam lingkup folder `resources/js/` saja.*

### Kustomisasi Warna Secara Manual per Konteks
Apabila Anda hanya ingin mengganti warna spesifik di suatu halaman (misal Sidebar):
1. Buka file komponennya, contoh: `resources/js/Layouts/AuthenticatedLayout.jsx`.
2. Cari baris yang merender *sidebar*:
   ```jsx
   <aside className={`fixed ... bg-indigo-900 text-white ...`}>
   ```
3. Ubah tulisan `bg-indigo-900` menjadi `bg-slate-900` (untuk warna hitam pekat modern) atau `bg-blue-800`.
4. Jangan lupa tekan `Save` (Ctrl+S) dan sistem akan otomatis menyesuaikan *reload* jika terminal `npm run dev` sedang hidup.

---

## 2. Mengubah Logo & Teks Utama
1. **Nama Aplikasi di Sidebar / Dashboard**:
   Buka file `resources/js/Layouts/AuthenticatedLayout.jsx`. 
   Cari teks `"LaundriQ"`.
   ```jsx
   // Anda dapat mengubah icon dan judulnya di blok ini
   <span className="text-indigo-900 font-bold text-xl px-1">🧺</span>
   ...
   <h1 className="text-xl font-bold font-sans tracking-wide">LaundriQ</h1>
   ```

2. **Nama Aplikasi / Title pada Tab Browser (`<title>`)**:
   Buka masing-masing Page (`Index.jsx` atau `Form.jsx`).
   Anda akan selalu menemukan *tag* `<Head>` yang diimpor dari Inertia.
   Contoh: `<Head title="Data Customer" />` bisa Anda ganti sesuai kata-kata Anda sendiri.

---

## 3. Mengubah Lebar Tabel & Ukuran Text
Rangkaian tabel dibangun dengan standar padding kelas Tailwind.
Contoh untuk file **Data Customer** (`resources/js/Pages/Admin/Customer/Index.jsx`):
- Jika isi tabel terlihat kekecilan, ganti `text-sm` menjadi `text-base` pada tag `<table>`.
- Jika Anda ingin tabel tidak bersisi, hapus efek `border border-gray-100` pada kontainer pelindungnya:
  ```jsx
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
  ```

---

## 4. Mengubah Posisi Layout (Atas-Bawah vs Samping)
Layout saat ini menggunakan model **Sidebar** (menyamping). Jika penilai (asesor UJIKOM) menginginkan menu diletakkan sejajar horizontal di bagian paling *atas* layar, Anda dapat:
1. Menghapus tag `<aside>...</aside>` yang berada di dalam `AuthenticatedLayout.jsx`.
2. Menyisipkan daftar menu (*navLinks*) baru tepat di area tag `<header>...</header>`.
3. Mengganti *Wrapper* `<div className="h-screen flex overflow-hidden">` kembali ke versi susun ke bawah secara alamiah seperti: `<div className="min-h-screen flex-col">`.

---

## Penting:
Agar warna atau komponen CSS yang baru saja Anda ubah **mampu dideteksi dan dicompile** menjadi *final*, ingatlah bahwa terminal perintah ke-dua harus selalu berstatus menyala/berjalan (!):
```bash
npm run dev
```
Setelah proses selesai / website di-hosting ke internet, jalankan langkah penutup ini untuk membuat versi "langsing" / *"production-ready"*:
```bash
npm run build
```

