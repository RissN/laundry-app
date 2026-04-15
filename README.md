# Panduan Penggunaan & Alur Kerja Sistem Informasi Laundry (LaundriQ)

Sistem Informasi Laundry ini dirancang secara spesifik untuk mematuhi kaidah Uji Kompetensi (UJIKOM) Keahlian Rekayasa Perangkat Lunak / Web Programming. 

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
