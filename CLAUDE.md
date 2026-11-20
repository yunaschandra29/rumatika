# Aturan proyek Rumatika

Rumatika adalah portal statis (HTML + CSS + JS tanpa build) berisi MPI, gim edukasi, lab maya, dan video tips Matematika Fase A–F. Pemilik: Yunas Chandra Perdana, M.Pd.

## Bahasa dan gaya
- Semua teks di situs memakai Bahasa Indonesia yang baku dan ramah guru.
- Istilah tetap: Ruang Fase (halaman fase), Kamar Belajar (MPI), Kamar Main (Gim), Laboratorium (Lab Maya), Teras Trik (video), Pojok Baca (artikel; alamatnya tetap `/artikel/`), Founder Rumatika (sebutan untuk Yunas Chandra Perdana, M.Pd.; bukan "kreator" dan bukan "Co-Founder").
- Jangan memakai emoji di antarmuka.

## Struktur
- Semua halaman portal ada di `index.html` dan dipilih lewat alamat `#...` (lihat README).
- Sumber daftar karya dan video ada di `data/konten/`: `karya.json`, `teras-trik.json`, dan `umum.json` (kontak dan fase). Karya terbaru ditaruh paling atas.
- `data/katalog.js` dibuat oleh `python alat/katalog.py` dari `data/konten/`; jangan diedit manual. Skrip ini juga memeriksa isian dan memindahkan berkas dari folder `unggah/`.
- Setiap karya baru: folder `karya/fase-<huruf>/<nama-karya>/index.html` + satu entri di `data/konten/karya.json`. Keduanya wajib.
- Karya berupa HTML satu berkas agar bisa diunduh dan dibuka offline. Aset besar (audio, gambar) dipisah dan dijaga di bawah 25 MiB per berkas.
- Setiap karya wajib menyimpan progres di perangkat (localStorage) dan memulihkannya saat dibuka lagi, supaya siswa tidak mengulang dari awal: nama/kelas, modul atau level yang tuntas, nilai, dan posisi terakhir. Halaman depan menawarkan "Lanjutkan …" dan "Mulai dari awal" bila ada progres. Karya baru memakai kunci `rumatika:<id-karya>` dan potongan `RSIMPAN` (simpan otomatis tiap 2 detik dan saat halaman ditutup; contoh di `karya/fase-e/brankas-menara-pola/`). Soal acak dipulihkan lewat `RSIMPAN.benih()` agar soalnya sama setelah dimuat ulang. Uji dengan memuat ulang halaman di tengah permainan sebelum commit.
- Sampul karya: gambar 16:9 di `assets/img/<id>.webp` (lebar 960 px, sekitar 50 KB), dicatat di kolom `sampul`. Karya belum siap tanpa sampul otomatis memakai `segera-hadir.webp`.
- Setiap kali isi `data/konten/` berubah, jalankan `python alat/katalog.py` lalu `python alat/bagikan.py` sebelum commit. Skrip ini membuat `k/<id>/` (halaman berbagi), `assets/og/` (gambar pratinjau WhatsApp), dan `data/kabar.json` (bahan notifikasi). Jangan mengedit ketiganya secara manual.
- Alamat situs untuk tautan berbagi diatur di `SITUS` pada `alat/bagikan.py`. Ganti di sana jika memakai domain sendiri, lalu jalankan ulang skripnya.
- Nomor WA dan email Founder hanya diatur di `kontak` pada `data/konten/umum.json`.
- Artikel ditulis di `tulisan/<slug>.md` (Markdown + kepala tulisan, contoh di `tulisan/_contoh.md`). Setelah menambah atau mengubah artikel, jalankan `python alat/artikel.py`. Skrip ini membuat `artikel/`, `data/artikel.js`, `assets/og/artikel-*.jpg`, `sitemap.xml`, `robots.txt`, dan `ads.txt`; jangan mengedit hasilnya secara manual.
- Artikel adalah halaman HTML biasa (bukan alamat `#`) agar terbaca Google dan AdSense. Iklan AdSense hanya dipasang di halaman artikel, diatur lewat `ADSENSE` di `alat/artikel.py`.
- Rumus artikel dirender KaTeX dari `assets/vendor/katex/` (disimpan sendiri, tanpa CDN).

## Halaman admin
- `/admin/` adalah Sveltia CMS (`admin/index.html`, pengaturan isian di `admin/config.yml`). Pemilik masuk dengan token GitHub dan setiap simpan langsung menjadi commit ke `main`.
- Unggahan dari admin masuk ke `unggah/`. `alat/katalog.py` memindahkannya: berkas karya (.html atau .zip berisi index.html) ke `karya/fase-x/<id>/`, sampul ke `assets/img/<id>.webp` (16:9, lebar 960), perangkat ajar ke `karya/fase-x/<id>/perangkat/`, lalu mengisi `url`, `ukuran`, dan `format`.
- GitHub Action `.github/workflows/olah-konten.yml` menjalankan `katalog.py`, `bagikan.py`, `artikel.py`, dan `progres.py` setiap ada perubahan di `data/konten/`, `tulisan/`, `unggah/`, atau `alat/`, lalu meng-commit hasilnya. Action juga berjalan tiap 00.05 WIB untuk artikel terjadwal.
- Jika menambah kolom baru di katalog, tambahkan juga di `admin/config.yml` dan di `alat/katalog.py`.
- Kepala tulisan artikel dibaca sebagai YAML (admin menulis nilai bertanda kutip jika perlu).

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

## Aplikasi dan notifikasi
- Rumatika bisa dipasang sebagai aplikasi (PWA): `manifest.webmanifest`, `sw.js` (di akar situs, jangan dipindah), dan `assets/aplikasi.js` yang mengatur blok `#aplikasi` di beranda.
- `sw.js` sengaja tidak menyimpan cache halaman; tugasnya hanya menampilkan notifikasi.
- Notifikasi dikirim otomatis oleh `worker/kabar.js`: Cron Trigger tiap 10 menit membaca `data/kabar.json` dan `data/artikel.js`, lalu mengirim kabar untuk karya yang baru siap (`url` terisi), video berstatus `tayang`, dan artikel baru. Tidak perlu langkah tambahan selain menjalankan skrip seperti biasa dan push.
- Langganan dan kunci VAPID tersimpan di D1 (tabel `langganan` dan `pengaturan`). Jangan mengganti kunci VAPID; semua pelanggan akan berhenti menerima notifikasi.
- Pindah ke domain sendiri berarti pengguna harus memasang ulang aplikasi dan menyalakan ulang notifikasi. Ganti juga `SITUS` di `worker/kabar.js`.

## Dasbor progres (wajib setiap push)
- Rekap progres per fase ada di dasbor claude.ai "Progres Rumatika": https://claude.ai/artifact/5VDCku5v3tcXuLK2wY4u8c
- Karya yang sudah dibuat atau direncanakan tetapi belum masuk katalog dicatat di `alat/rencana.json`. Hapus entrinya begitu karya itu masuk `data/konten/karya.json`; isi `judulAsli` jika kartu katalog masih memakai nama sementara.
- Konten yang masuk lewat `/admin` sudah dihitung ulang di `alat/progres.json` oleh GitHub Action, tetapi dasbor claude.ai hanya bisa diperbarui dari chat. Setiap mulai bekerja di repo ini, jika `alat/progres.json` di `main` lebih baru daripada data dasbor, lakukan langkah 2–4 di bawah.
- Setiap kali push ke `main` (karya baru, video baru, atau perubahan katalog/rencana), lakukan juga:
  1. `python alat/progres.py` (menulis `alat/progres.json`; butuh Node.js) dan ikutkan hasilnya di commit.
  2. Unggah `alat/progres.json` sebagai aset ke dasbor di atas (Artifact `publish` dengan `url` dasbor, `file_path`, `asset: true`).
  3. Baca dokumen `datasets/karya` di dasbor, lalu `update` kolom `source.url` (alamat `/_blob/...` dari hasil unggah), `source.name`, `updated {at, by}`, dan `edit {via: "claude", at}`. Halaman dasbor (`files/index.html`) tidak perlu diubah.
  4. Sebutkan ke pemilik bahwa dasbor progres sudah diperbarui.
