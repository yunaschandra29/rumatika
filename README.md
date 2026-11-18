# Rumatika — Rumahnya Matematika Interaktif

Portal MPI, gim edukasi, lab maya, dan video tips matematika Fase A–F.
Situs statis murni: tidak perlu database, tidak perlu proses build.

## Isi folder

```
rumatika/
├─ index.html                 semua halaman portal (beranda, ruang fase, karya, teras trik, panduan, tentang)
├─ assets/
│  ├─ site.css                tampilan & warna (token warna di bagian paling atas)
│  └─ site.js                 logika halaman, saringan, Mode Proyektor
├─ data/
│  ├─ konten/                 DAFTAR KARYA, VIDEO, KONTAK (diubah lewat /admin)
│  └─ katalog.js              dibuat otomatis oleh alat/katalog.py
├─ karya/
│  └─ fase-b/lab-pecahan-senilai/index.html   contoh karya yang bisa dimainkan
├─ CLAUDE.md                  aturan proyek untuk Claude Code
└─ README.md
```

## Melihat di laptop

Cara paling cepat: klik dua kali `index.html`, situs terbuka di browser.

Atau jalankan server lokal dari folder ini:

```
python -m http.server 8080
```

lalu buka http://localhost:8080

## Halaman admin (tanpa push manual)

Buka https://rumatika.yunaschandra29.workers.dev/admin/ dari laptop atau HP.

1. Pertama kali: pilih **Sign In Using Access Token**. Klik tautan di kotak itu untuk membuat token GitHub
   (izin repo `rumatika`: Contents read and write), salin, lalu tempel. Token tersimpan di browser itu.
2. **Katalog → Karya**: tombol *Add karya* menaruh karya baru di paling atas. Isi ID, judul, fase, jenis, deskripsi,
   lalu unggah berkas karya (.html satu berkas, atau .zip berisi index.html beserta asetnya) dan sampul (gambar apa saja).
   Perangkat ajar (LKPD, RPM, kunci jawaban) diunggah di bagian *Perangkat Ajar Guru*.
3. **Katalog → Teras Trik**: tambah atau ubah video; ubah status menjadi *Tayang* setelah videonya ada di YouTube.
4. **Pojok Baca**: tombol *New* untuk artikel baru. Tanggal di masa depan berarti terjadwal.
5. Tekan **Save**. Dalam 1–3 menit GitHub Action "Olah konten" menyiapkan semua berkas dan situs ikut diperbarui.
   Jika ada isian yang salah, Action gagal (tanda silang merah di tab *Actions* GitHub) dan situs tidak berubah;
   perbaiki isiannya di admin lalu simpan lagi.

## Menambah karya secara manual

1. Buat folder `karya/fase-<huruf>/<nama-karya>/` dan taruh berkas HTML karya sebagai `index.html`.
2. Buka `data/konten/karya.json`, salin satu objek di daftar `karya`, taruh di paling atas, lalu ubah isinya.
3. Isi `url` dengan alamat foldernya, misalnya `"karya/fase-d/operasi-sigap/"`.
   Kosongkan (`""`) jika belum siap; kartunya tetap tampil dengan label "Segera hadir".

4. Jalankan `python alat/katalog.py` lalu `python alat/bagikan.py` (butuh `pip install pillow json5`). Skrip ini membuat halaman berbagi
   `k/<id>/` dan gambar pratinjau di `assets/og/`, sehingga tautan yang dikirim ke WhatsApp menampilkan
   sampul dan judul karya.

## Menulis artikel

Artikel adalah halaman biasa di `artikel/<slug>/` (bukan alamat `#`), supaya bisa dibaca Google dan peninjau AdSense.

1. Salin `tulisan/_contoh.md` menjadi `tulisan/<slug>.md`, misalnya `tulisan/teorema-pythagoras.md`.
   Nama berkas menjadi alamat: `/artikel/teorema-pythagoras/`.
2. Isi kepala tulisan (`judul`, `ringkasan`, `fase`, `kategori`, `tanggal`; `karya`, `topik`, `simbol` opsional).
   `karya` diisi id dari `data/konten/karya.json`, supaya artikel menautkan ke karyanya dan sebaliknya.
3. Tulis isinya dengan Markdown. Rumus memakai `$...$` (dalam kalimat) dan `$$...$$` (baris sendiri).
4. Jalankan `python alat/artikel.py` (butuh `pip install markdown pillow json5`).
   Skrip ini membuat `artikel/`, `data/artikel.js`, gambar pratinjau `assets/og/artikel-*.jpg`, `sitemap.xml`, dan `robots.txt`.
   Artikel dengan tanggal di masa depan dilewati sampai tanggalnya tiba.

Setelah AdSense disetujui, isi `ADSENSE` di `alat/artikel.py` dengan kode `ca-pub-...`, lalu jalankan ulang skripnya.
Iklan hanya dipasang di halaman artikel, tidak di dalam karya, dan `ads.txt` dibuat otomatis.

## Kontak

Nomor WhatsApp dan email Founder diatur di bagian `kontak` pada `data/konten/umum.json`.
Tombol "Tanya via WA" di setiap halaman dan halaman `#kontak` memakai data itu.

## Menambah video Teras Trik

Tambahkan satu objek di daftar `video` pada `data/konten/teras-trik.json`, lalu jalankan `python alat/katalog.py`.
Setelah video tayang, ganti `url` dengan tautan YouTube-nya dan ubah `status` menjadi `"tayang"`.

## Rilis ke internet (Cloudflare Workers)

Situs aktif di **https://rumatika.yunaschandra29.workers.dev** dan tersambung ke repo GitHub `rumatika`.
Setiap push ke cabang `main` otomatis dibangun dan tayang dalam beberapa menit.
Statusnya bisa dilihat di dasbor Cloudflare → Workers & Pages → rumatika → Deployments.

Berkas kerja (`alat/`, `CLAUDE.md`, `README.md`) tidak ikut diunggah; daftarnya ada di `.assetsignore`.

## Aplikasi dan notifikasi

Pengunjung bisa memasang Rumatika di HP atau laptop lewat blok "Aplikasi Rumatika" di beranda,
lalu menyalakan notifikasi. Setiap 10 menit worker memeriksa `data/kabar.json` (dibuat `alat/bagikan.py`)
dan `data/artikel.js`; karya, video, atau artikel yang baru tayang langsung dikirim sebagai notifikasi.
Daftar pelanggan dan kunci notifikasi tersimpan di D1. Rincian ada di `worker/kabar.js`.

## Statistik pengunjung

Beranda menampilkan jumlah kunjungan (total dan hari ini) serta karya yang paling sering dimainkan.
Kartu dan halaman karya menampilkan berapa kali karya dimainkan, dan Semua Karya bisa diurutkan "Terpopuler".

- Penghitungnya ada di `worker/index.js`, datanya disimpan di database D1 `rumatika-statistik` (diatur di `wrangler.jsonc`).
- Satu browser dihitung sekali per sesi, baik untuk kunjungan maupun untuk tiap karya yang dimainkan.
- Hanya jumlah yang disimpan; tidak ada data pribadi.
- Jika penghitung bermasalah, situs tetap berjalan normal tanpa angka.

Menguji di laptop: `npx wrangler dev`, lalu buka http://localhost:8787

## Alamat halaman

| Alamat | Halaman |
| --- | --- |
| `#beranda` | Beranda dengan denah ruang fase |
| `#fase-a` … `#fase-f` | Ruang Fase |
| `#kamar-belajar`, `#kamar-main`, `#laboratorium` | Semua karya MPI, Gim, Lab Maya |
| `#karya-<id>` | Halaman satu karya |
| `#teras-trik` | Video tips & trik |
| `#panduan-guru`, `#tentang`, `#kontak` | Halaman pendukung |
| `k/<id>/` | Tautan berbagi karya (pratinjau WhatsApp), langsung membuka halaman karya |
| `artikel/` | Pojok Baca, daftar artikel (halaman biasa, bukan `#`) |
| `artikel/<slug>/` | Halaman satu artikel, dibuat dari `tulisan/<slug>.md` |
