# Aturan proyek Rumatika

Rumatika adalah portal statis (HTML + CSS + JS tanpa build) berisi MPI, gim edukasi, lab maya, dan video tips Matematika Fase A–F. Pemilik: Yunas Chandra Perdana, M.Pd.

## Bahasa dan gaya
- Semua teks di situs memakai Bahasa Indonesia yang baku dan ramah guru.
- Istilah tetap: Ruang Fase (halaman fase), Kamar Belajar (MPI), Kamar Main (Gim), Laboratorium (Lab Maya), Teras Trik (video).
- Jangan memakai emoji di antarmuka.

## Struktur
- Semua halaman portal ada di `index.html` dan dipilih lewat alamat `#...` (lihat README).
- Daftar karya dan video hanya di `data/katalog.js`. Karya terbaru ditaruh paling atas.
- Setiap karya baru: folder `karya/fase-<huruf>/<nama-karya>/index.html` + satu entri katalog. Keduanya wajib.
- Karya berupa HTML satu berkas agar bisa diunduh dan dibuka offline. Aset besar (audio, gambar) dipisah dan dijaga di bawah 25 MiB per berkas.
- Sampul karya: gambar 16:9 di `assets/img/<id>.webp` (lebar 960 px, sekitar 50 KB), dicatat di kolom `sampul`. Karya belum siap tanpa sampul otomatis memakai `segera-hadir.webp`.
- Setiap kali `data/katalog.js` berubah, jalankan `python alat/bagikan.py` sebelum commit. Skrip ini membuat `k/<id>/` (halaman berbagi) dan `assets/og/` (gambar pratinjau WhatsApp). Jangan mengedit kedua folder itu secara manual.
- Alamat situs untuk tautan berbagi diatur di `SITUS` pada `alat/bagikan.py`. Ganti di sana jika memakai domain sendiri, lalu jalankan ulang skripnya.
- Nomor WA dan email kreator hanya diatur di `kontak` pada `data/katalog.js`.
- Artikel ditulis di `tulisan/<slug>.md` (Markdown + kepala tulisan, contoh di `tulisan/_contoh.md`). Setelah menambah atau mengubah artikel, jalankan `python alat/artikel.py`. Skrip ini membuat `artikel/`, `data/artikel.js`, `assets/og/artikel-*.jpg`, `sitemap.xml`, `robots.txt`, dan `ads.txt`; jangan mengedit hasilnya secara manual.
- Artikel adalah halaman HTML biasa (bukan alamat `#`) agar terbaca Google dan AdSense. Iklan AdSense hanya dipasang di halaman artikel, diatur lewat `ADSENSE` di `alat/artikel.py`.
- Rumus artikel dirender KaTeX dari `assets/vendor/katex/` (disimpan sendiri, tanpa CDN).

## Tampilan
- Warna hanya lewat token di bagian atas `assets/site.css`; setiap token punya nilai terang dan gelap.
- Nuansa biru: biru utama, biru tua, biru muda; kuning stabilo hanya untuk sorotan kecil.
- Huruf: Bricolage Grotesque (judul), Lexend (teks), IBM Plex Mono (label & angka).
- Setiap perubahan dicek di lebar HP (±400 px) dan lebar proyektor (1280 × 720).

## Rilis
- Situs (https://rumatika.yunaschandra29.workers.dev) dirilis otomatis oleh Cloudflare Workers setiap kali ada push ke cabang `main`.
- Perubahan besar dikerjakan di cabang terpisah dulu dan dicek di pratinjau lokal sebelum digabung ke `main`.
- Berkas kerja yang tidak boleh tampil di situs didaftarkan di `.assetsignore`.
- `wrangler.jsonc` mengatur Worker dan database D1 `rumatika-statistik`; `worker/index.js` hanya menangani alamat `/api/*`, sisanya berkas statis.
- Perubahan pada `worker/` atau `wrangler.jsonc` diuji dulu dengan `npx wrangler dev` sebelum digabung.
