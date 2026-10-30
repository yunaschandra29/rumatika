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
│  └─ katalog.js              DAFTAR KARYA & VIDEO — berkas yang paling sering diubah
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

## Menambah karya

1. Buat folder `karya/fase-<huruf>/<nama-karya>/` dan taruh berkas HTML karya sebagai `index.html`.
2. Buka `data/katalog.js`, salin satu objek di daftar `karya`, taruh di paling atas, lalu ubah isinya.
3. Isi `url` dengan alamat foldernya, misalnya `"karya/fase-d/operasi-sigap/"`.
   Kosongkan (`""`) jika belum siap; kartunya tetap tampil dengan label "Segera hadir".

4. Jalankan `python alat/bagikan.py` (butuh `pip install pillow json5`). Skrip ini membuat halaman berbagi
   `k/<id>/` dan gambar pratinjau di `assets/og/`, sehingga tautan yang dikirim ke WhatsApp menampilkan
   sampul dan judul karya.

## Menulis artikel

Artikel adalah halaman biasa di `artikel/<slug>/` (bukan alamat `#`), supaya bisa dibaca Google dan peninjau AdSense.

1. Salin `tulisan/_contoh.md` menjadi `tulisan/<slug>.md`, misalnya `tulisan/teorema-pythagoras.md`.
   Nama berkas menjadi alamat: `/artikel/teorema-pythagoras/`.
2. Isi kepala tulisan (`judul`, `ringkasan`, `fase`, `kategori`, `tanggal`; `karya`, `topik`, `simbol` opsional).
   `karya` diisi id dari `data/katalog.js`, supaya artikel menautkan ke karyanya dan sebaliknya.
3. Tulis isinya dengan Markdown. Rumus memakai `$...$` (dalam kalimat) dan `$$...$$` (baris sendiri).
4. Jalankan `python alat/artikel.py` (butuh `pip install markdown pillow json5`).
   Skrip ini membuat `artikel/`, `data/artikel.js`, gambar pratinjau `assets/og/artikel-*.jpg`, `sitemap.xml`, dan `robots.txt`.
   Artikel dengan tanggal di masa depan dilewati sampai tanggalnya tiba.

Setelah AdSense disetujui, isi `ADSENSE` di `alat/artikel.py` dengan kode `ca-pub-...`, lalu jalankan ulang skripnya.
Iklan hanya dipasang di halaman artikel, tidak di dalam karya, dan `ads.txt` dibuat otomatis.

## Kontak

Nomor WhatsApp dan email kreator diatur di bagian `kontak` pada `data/katalog.js`.
Tombol "Tanya via WA" di setiap halaman dan halaman `#kontak` memakai data itu.

## Menambah video Teras Trik

Tambahkan satu objek di daftar `video` pada `data/katalog.js`.
Setelah video tayang, ganti `url` dengan tautan YouTube-nya dan ubah `status` menjadi `"tayang"`.

## Rilis ke internet (Cloudflare Workers)

Situs aktif di **https://rumatika.yunaschandra29.workers.dev** dan tersambung ke repo GitHub `rumatika`.
Setiap push ke cabang `main` otomatis dibangun dan tayang dalam beberapa menit.
Statusnya bisa dilihat di dasbor Cloudflare → Workers & Pages → rumatika → Deployments.

Berkas kerja (`alat/`, `CLAUDE.md`, `README.md`) tidak ikut diunggah; daftarnya ada di `.assetsignore`.

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
