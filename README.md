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

## Menambah video Teras Trik

Tambahkan satu objek di daftar `video` pada `data/katalog.js`.
Setelah video tayang, ganti `url` dengan tautan YouTube-nya dan ubah `status` menjadi `"tayang"`.

## Rilis ke internet (Cloudflare Pages)

1. Unggah folder ini ke repositori GitHub, misalnya `rumatika`.
2. Dasbor Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** → pilih repo `rumatika`.
3. Pengaturan build: Framework preset **None**, Build command **kosong**, Build output directory **/**.
4. Klik **Save and Deploy**. Situs aktif di `rumatika.pages.dev` (atau nama lain jika sudah dipakai orang).
5. Setiap perubahan yang di-push ke GitHub otomatis tayang dalam beberapa menit.

## Alamat halaman

| Alamat | Halaman |
| --- | --- |
| `#beranda` | Beranda dengan denah ruang fase |
| `#fase-a` … `#fase-f` | Ruang Fase |
| `#kamar-belajar`, `#kamar-main`, `#laboratorium` | Semua karya MPI, Gim, Lab Maya |
| `#karya-<id>` | Halaman satu karya |
| `#teras-trik` | Video tips & trik |
| `#panduan-guru`, `#tentang` | Halaman pendukung |
