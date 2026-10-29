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

## Tampilan
- Warna hanya lewat token di bagian atas `assets/site.css`; setiap token punya nilai terang dan gelap.
- Nuansa biru: biru utama, biru tua, biru muda; kuning stabilo hanya untuk sorotan kecil.
- Huruf: Bricolage Grotesque (judul), Lexend (teks), IBM Plex Mono (label & angka).
- Setiap perubahan dicek di lebar HP (±400 px) dan lebar proyektor (1280 × 720).

## Rilis
- Situs dirilis otomatis oleh Cloudflare Pages setiap kali ada push ke cabang `main`.
- Perubahan besar dikerjakan di cabang terpisah dulu agar bisa dicek lewat tautan pratinjau.
