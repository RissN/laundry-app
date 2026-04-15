# Panduan Kustomisasi Tampilan Web (UI/UX)

Sistem ini dibangun menggunakan **React 19** dan **Tailwind CSS v4**. Tidak ada file CSS raksasa yang membingungkan. Segala bentuk warna, posisi, dan desain dikendalikan langsung oleh *utility classes* di dalam file-file komponen `.jsx`.

Berikut adalah panduan lengkap cara melakukan kustomisasi komponen website:

---

## 1. Mengubah Skema Warna Utama (Tema)
Aplikasi ini rata-rata mendominasi skema warna **Indigo** (`indigo-x`) untuk aksen utama dan **Emerald** (`emerald-x`) untuk status terselesaikan.

**Cara paling praktis untuk mengubah warna web:**
Buka fitur **Search & Replace** atau Tekan `Ctrl + Shift + F` pada VSCode ("Find in Files"), dan operasikan seperti ini:
- Temukan (Search): `indigo-`
- Ganti dengan (Replace): `blue-` (Jika ingin tema Biru standar) atau `violet-` (Jika ingin lebih ungu modern) atau `rose-` (Untuk warna pink kemerahan).

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
