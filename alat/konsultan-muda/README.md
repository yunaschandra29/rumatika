# Sumber Konsultan Muda v2

Gim di `karya/fase-e/konsultan-muda/index.html` dirakit dari folder ini. Jangan mengedit berkas gim jadinya secara manual.

- `src/naskah.js`: cerita, episode, keputusan, kunjungan ulang, akhir cerita.
- `src/utama.js`: mesin novel visual, menu episode (drum roll), meja kerja, mode mandiri/kelompok, musik.
- `src/interaksi.js` dan `src/mesin1.js`: kegiatan matematika (dari versi 1).
- `src/gaya1.css`, `src/gaya2.css`, `src/kerangka.html`: tampilan.
- `prompt.py`: daftar 50 aset dan prompt gambarnya; menghasilkan `aset.json` dan `prompt-aset.md`.
- `rakit.py`: merakit semuanya menjadi satu berkas HTML (latar hijau tokoh dibuang otomatis).
- `urai.py`: mengeluarkan gambar dan musik dari gim jadi ke `aset/`, untuk dirakit ulang setelah mengubah kode.
- `uji.js`: main otomatis sampai tamat (Playwright).

Alur revisi:

    python alat/konsultan-muda/urai.py
    # ubah src/... seperlunya
    python alat/konsultan-muda/rakit.py karya/fase-e/konsultan-muda/index.html
    node alat/konsultan-muda/uji.js $PWD/karya/fase-e/konsultan-muda/index.html /tmp/uji 00000000

Folder `aset/` tidak ikut di-commit.
