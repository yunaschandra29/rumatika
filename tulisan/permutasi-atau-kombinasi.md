---
judul: Permutasi atau Kombinasi? Satu Pertanyaan untuk Memilih Rumus yang Tepat
ringkasan: Banyak siswa hafal rumus permutasi dan kombinasi, tetapi bingung kapan memakainya. Satu pertanyaan sederhana tentang urutan sudah cukup untuk memilih rumus yang benar.
fase: F
kategori: Konsep
topik: Kaidah pencacahan
karya: ragam-susun
tanggal: 2026-10-30
simbol: P(n, r) vs C(n, r)
---

Hampir setiap kali saya mengajar kaidah pencacahan, ada siswa yang bertanya, "Pak, soal ini pakai P atau C?" Rumusnya sudah mereka hafal. Yang belum mereka miliki adalah alasan untuk memilih salah satunya.

Kabar baiknya, alasan itu bisa diringkas menjadi satu pertanyaan:

> **Jika susunannya ditukar, apakah hasilnya dianggap berbeda?**

Jika jawabannya *ya*, urutan penting dan kita memakai **permutasi**. Jika jawabannya *tidak*, urutan tidak penting dan kita memakai **kombinasi**.

## Dua soal yang tampak mirip

Bayangkan sebuah kelas berisi 8 siswa.

**Soal pertama.** Dari 8 siswa akan dipilih ketua, sekretaris, dan bendahara. Ada berapa cara?

**Soal kedua.** Dari 8 siswa akan dipilih 3 orang untuk menjadi panitia. Ada berapa cara?

Kedua soal sama-sama memilih 3 dari 8 orang. Bedanya ada pada pertanyaan tadi. Jika Andi menjadi ketua dan Budi menjadi sekretaris, lalu jabatannya ditukar, susunannya jelas berbeda. Jadi soal pertama memakai permutasi. Pada soal kedua, panitia "Andi, Budi, Cici" sama saja dengan "Cici, Andi, Budi". Jadi soal kedua memakai kombinasi.

## Permutasi: memilih sambil mengurutkan

Untuk soal pertama, kita bisa berpikir langkah demi langkah dengan aturan perkalian. Ada 8 calon ketua. Setelah ketua terpilih, tersisa 7 calon sekretaris, lalu 6 calon bendahara.

$$8 \times 7 \times 6 = 336 \text{ cara}$$

Perkalian ini adalah permutasi 3 unsur dari 8 unsur. Rumus umumnya:

$$P(n, r) = \frac{n!}{(n - r)!}$$

Dengan $n = 8$ dan $r = 3$, kita mendapat $P(8, 3) = \dfrac{8!}{5!} = 8 \times 7 \times 6 = 336$.

## Kombinasi: memilih tanpa mengurutkan

Untuk soal kedua, kita boleh mulai dari hasil permutasi lalu membuang susunan yang dihitung berulang. Tiga orang yang sama, misalnya Andi, Budi, dan Cici, bisa diurutkan dengan $3! = 6$ cara. Dalam 336 susunan tadi, setiap kelompok panitia terhitung 6 kali. Maka:

$$\frac{336}{6} = 56 \text{ cara}$$

Inilah kombinasi 3 unsur dari 8 unsur:

$$C(n, r) = \frac{n!}{r!\,(n - r)!}$$

Perhatikan hubungannya: kombinasi sama dengan permutasi dibagi $r!$. Pembagian oleh $r!$ itulah yang "menghapus" urutan.

## Daftar cek singkat

Sebelum menulis rumus, minta siswa menjawab tiga hal berikut.

1. **Berapa unsur yang tersedia?** Ini nilai $n$.
2. **Berapa unsur yang dipilih atau disusun?** Ini nilai $r$.
3. **Jika susunannya ditukar, apakah hasilnya berbeda?** Ya berarti permutasi, tidak berarti kombinasi.

Beberapa kata dalam soal sering menjadi petunjuk, tetapi jangan dijadikan satu-satunya pegangan:

- **Cenderung permutasi:** jabatan berbeda, urutan tampil, juara 1–2–3, nomor atau kode, susunan duduk.
- **Cenderung kombinasi:** tim, panitia, kelompok, delegasi, memilih soal yang dikerjakan, mengambil beberapa bola sekaligus.

Kata "memilih" muncul di kedua jenis soal. Karena itu, pertanyaan tentang urutan tetap lebih bisa diandalkan daripada menghafal kata kunci.

## Kesalahan yang sering muncul

**Memakai permutasi untuk tim.** Siswa melihat kata "susunan tim" lalu langsung memakai $P$. Padahal, jika semua anggota tim berkedudukan sama, urutan tidak penting.

**Lupa bahwa satu soal bisa memakai keduanya.** Contohnya: dari 8 siswa dipilih 3 orang, lalu satu di antaranya ditunjuk sebagai ketua. Kita bisa memilih kelompoknya dulu dengan $C(8, 3) = 56$, lalu memilih ketua dari 3 orang itu dengan 3 cara, sehingga hasilnya $56 \times 3 = 168$ cara.

**Langsung menghitung faktorial besar.** Sederhanakan dulu. $\dfrac{8!}{5!}$ cukup ditulis $8 \times 7 \times 6$, tidak perlu menghitung $8! = 40.320$.

## Saran untuk guru

Saya biasanya membuka materi ini tanpa rumus. Siswa diminta mendaftar semua susunan secara manual untuk kasus kecil, misalnya memilih 2 dari 4 orang. Setelah mereka melihat sendiri bahwa "AB" dan "BA" muncul sebagai dua susunan pada soal jabatan tetapi hanya satu pada soal panitia, rumus kombinasi terasa masuk akal, bukan sekadar dihafal.

Jika ingin latihan dalam bentuk cerita, MPI **Ragam Susun** di Rumatika memuat situasi festival sekolah, seperti urutan tampil, kursi tamu, kode tiket, dan susunan tim. Di dalamnya juga ada gim Gladi Bersih untuk menguji pemahaman siswa.
