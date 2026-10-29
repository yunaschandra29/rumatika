/*
  KATALOG RUMATIKA
  ----------------
  Satu-satunya berkas yang perlu diubah saat menambah karya atau video.

  Menambah karya:
    1. Taruh berkas HTML karya di  karya/fase-x/nama-karya/index.html
    2. Tambahkan satu objek di daftar "karya" di bawah (paling atas = paling baru).
    3. Isi "url" dengan alamat foldernya. Kosongkan url ("") jika karya belum siap:
       kartunya tetap tampil dengan label "Segera hadir".
    4. Isi "ukuran" dengan besar berkasnya (misalnya "7 MB"). Angka ini tampil di
       tombol muat, supaya guru tahu kuota yang dipakai sebelum membuka di HP.

  Nilai "jenis" harus salah satu: "MPI", "Gim", "Lab Maya".
  Nilai "fase" harus salah satu: "A", "B", "C", "D", "E", "F".
*/
window.RUMATIKA_KATALOG = {
  fase: [
    { kode: "A", jenjang: "SD", kelas: "Kelas 1–2", ringkas: "Bilangan sampai 100, penjumlahan dan pengurangan, bentuk datar." },
    { kode: "B", jenjang: "SD", kelas: "Kelas 3–4", ringkas: "Perkalian dan pembagian, pecahan, pengukuran." },
    { kode: "C", jenjang: "SD", kelas: "Kelas 5–6", ringkas: "Pecahan dan desimal, bangun ruang, penyajian data." },
    { kode: "D", jenjang: "SMP", kelas: "Kelas 7–9", ringkas: "Aljabar, persamaan linear, geometri, statistika dan peluang." },
    { kode: "E", jenjang: "SMA", kelas: "Kelas 10", ringkas: "Eksponen dan logaritma, trigonometri, peluang, data dua variabel." },
    { kode: "F", jenjang: "SMA", kelas: "Kelas 11–12", ringkas: "Polinomial, matriks, matematika keuangan, model linear data." }
  ],

  karya: [
    {
      id: "warisan-cicilan",
      judul: "Warisan Cicilan",
      fase: "F",
      jenis: "Gim",
      topik: "Anuitas dan rencana angsuran",
      tujuan: "Menghitung bunga majemuk dan anuitas, menyusun tabel angsuran, lalu memutuskan pinjaman terbaik dalam kisah tiga generasi keluarga.",
      durasi: 90,
      perangkat: "Proyektor dan HP",
      simbol: "A = M·i / (1 − (1+i)⁻ⁿ)",
      url: "karya/fase-f/warisan-cicilan/",
      ukuran: "11 MB",
      video: "anuitas-90-detik"
    },
    {
      id: "bendahara-baru",
      judul: "Bendahara Baru",
      fase: "D",
      jenis: "Gim",
      topik: "Aritmetika sosial",
      tujuan: "Mengelola kas kelas lewat novel visual: menghitung untung-rugi, diskon bertingkat, bruto-neto-tara, bunga tunggal, dan pajak dari setiap pilihan cerita.",
      durasi: 120,
      perangkat: "Proyektor dan HP",
      simbol: "untung = jual − beli",
      url: "karya/fase-d/bendahara-baru/",
      ukuran: "7 MB",
      video: ""
    },
    {
      id: "lab-pecahan-senilai",
      judul: "Lab Pecahan Senilai",
      fase: "B",
      jenis: "Lab Maya",
      topik: "Pecahan senilai",
      tujuan: "Menunjukkan dua pecahan senilai dengan membandingkan panjang arsiran pada dua pita pecahan.",
      durasi: 15,
      perangkat: "Proyektor dan HP",
      simbol: "1/2 = 2/4",
      url: "karya/fase-b/lab-pecahan-senilai/",
      ukuran: "10 KB",
      video: "kenapa-penyebut-disamakan"
    },
    {
      id: "operasi-sigap",
      judul: "Operasi SIGAP",
      fase: "D",
      jenis: "MPI",
      topik: "Teorema Pythagoras",
      tujuan: "Menemukan dan menerapkan hubungan sisi-sisi segitiga siku-siku.",
      durasi: 40,
      perangkat: "Proyektor dan HP",
      simbol: "a² + b² = c²",
      url: "",
      video: ""
    },
    {
      id: "duo-dagang",
      judul: "Duo Dagang",
      fase: "D",
      jenis: "MPI",
      topik: "Sistem persamaan linear dua variabel",
      tujuan: "Memodelkan masalah jual-beli dengan sistem persamaan linear dua variabel.",
      durasi: 40,
      perangkat: "Proyektor dan HP",
      simbol: "2x + 3y = 12",
      url: "",
      video: ""
    },
    {
      id: "batik-transformasi",
      judul: "Batik Transformasi",
      fase: "D",
      jenis: "MPI",
      topik: "Transformasi geometri",
      tujuan: "Mengenali translasi, refleksi, rotasi, dan dilatasi lewat pola batik.",
      durasi: 40,
      perangkat: "Proyektor",
      simbol: "(x, y) → (−y, x)",
      url: "",
      video: ""
    },
    {
      id: "porsenika",
      judul: "PORSENIKA",
      fase: "D",
      jenis: "Gim",
      topik: "Pembuka kelas bertema lomba 17-an",
      tujuan: "Membuka pelajaran dengan lomba matematika berkelompok yang menghangatkan kelas.",
      durasi: 20,
      perangkat: "Proyektor",
      simbol: "+ − × ÷",
      url: "",
      video: ""
    },
    {
      id: "arena-juara",
      judul: "Arena Juara",
      fase: "D",
      jenis: "Gim",
      topik: "Kuis antartim",
      tujuan: "Menguatkan materi Fase D lewat kuis antartim dengan papan skor langsung.",
      durasi: 30,
      perangkat: "Proyektor",
      simbol: "Σ skor",
      url: "",
      video: "negatif-kali-negatif"
    },
    {
      id: "langkah-penyusup",
      judul: "Langkah Penyusup",
      fase: "E",
      jenis: "Gim",
      topik: "Eksponen dan logaritma",
      tujuan: "Melacak satu langkah keliru di antara langkah penyelesaian soal eksponen dan logaritma.",
      durasi: 30,
      perangkat: "Proyektor dan HP",
      simbol: "²log 8 = 3",
      url: "",
      video: "pangkat-nol"
    },
    {
      id: "lab-trigonometri",
      judul: "Lab Trigonometri",
      fase: "E",
      jenis: "Lab Maya",
      topik: "Perbandingan trigonometri",
      tujuan: "Mengamati perubahan nilai sin, cos, dan tan saat besar sudut diubah.",
      durasi: 25,
      perangkat: "Proyektor dan HP",
      simbol: "sin²θ + cos²θ = 1",
      url: "",
      video: ""
    },
    {
      id: "lab-peluang",
      judul: "Lab Peluang",
      fase: "E",
      jenis: "Lab Maya",
      topik: "Peluang empirik dan teoretik",
      tujuan: "Membandingkan peluang teoretik dengan hasil percobaan yang diulang ratusan kali.",
      durasi: 25,
      perangkat: "Proyektor dan HP",
      simbol: "P(A) = n(A) / n(S)",
      url: "",
      video: ""
    },
    {
      id: "lab-anuitas",
      judul: "Lab Anuitas",
      fase: "F",
      jenis: "Lab Maya",
      topik: "Bunga majemuk dan anuitas",
      tujuan: "Menghitung angsuran dan melihat porsi bunga serta pokok di setiap periode.",
      durasi: 30,
      perangkat: "Proyektor dan HP",
      simbol: "A = b + a",
      url: "",
      video: "anuitas-90-detik"
    },
    {
      id: "lab-regresi",
      judul: "Lab Regresi",
      fase: "F",
      jenis: "Lab Maya",
      topik: "Model linear terbaik",
      tujuan: "Mencocokkan garis lurus terbaik pada data dua variabel dan membaca kemiringannya.",
      durasi: 25,
      perangkat: "Proyektor dan HP",
      simbol: "ŷ = a + bx",
      url: "",
      video: ""
    }
  ],

  /*
    VIDEO TERAS TRIK
    "url": tautan video YouTube. Selama video belum tayang, biarkan url berisi
    alamat kanal dan "status": "segera". Setelah tayang, ganti url dengan tautan
    videonya dan "status": "tayang".
  */
  video: [
    {
      id: "mengalikan-pecahan",
      judul: "Bagaimana cara mengalikan pecahan?",
      fase: "C",
      detik: 76,
      simbol: "2/3 × 3/4",
      ringkas: "Cara mengalikan dua pecahan dan alasan di balik langkahnya, dalam waktu singkat.",
      karya: "",
      url: "https://www.youtube.com/shorts/M7RE_m5rEMI",
      status: "tayang"
    },
    {
      id: "kenapa-penyebut-disamakan",
      judul: "Kenapa harus samakan penyebut?",
      fase: "C",
      detik: 67,
      simbol: "1/2 + 1/3",
      ringkas: "Alasan penyebut harus disamakan dulu sebelum dua pecahan dijumlahkan atau dikurangkan.",
      karya: "lab-pecahan-senilai",
      url: "https://www.youtube.com/shorts/vRyYFs6cXrk",
      status: "tayang"
    },
    {
      id: "negatif-kali-negatif",
      judul: "Kenapa negatif × negatif jadi positif?",
      fase: "D",
      detik: 80,
      simbol: "(−2) × (−3) = 6",
      ringkas: "Pola perkalian yang bergeser ke kiri garis bilangan menjelaskan aturannya.",
      karya: "arena-juara",
      url: "https://www.youtube.com/@yunascp",
      status: "segera"
    },
    {
      id: "pangkat-nol",
      judul: "Kenapa a⁰ = 1?",
      fase: "D",
      detik: 60,
      simbol: "a⁰ = 1",
      ringkas: "Turunkan pangkat satu per satu, lihat apa yang terjadi saat pangkatnya habis.",
      karya: "langkah-penyusup",
      url: "https://www.youtube.com/@yunascp",
      status: "segera"
    },
    {
      id: "anuitas-90-detik",
      judul: "Anuitas dalam 90 detik",
      fase: "F",
      detik: 90,
      simbol: "A = b + a",
      ringkas: "Angsuran tetap, tetapi porsi bunganya mengecil dan porsi pokoknya membesar.",
      karya: "warisan-cicilan",
      url: "https://www.youtube.com/@yunascp",
      status: "segera"
    }
  ]
};
