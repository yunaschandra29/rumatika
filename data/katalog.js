/*
  KATALOG RUMATIKA
  ----------------
  Satu-satunya berkas yang perlu diubah saat menambah karya atau video.

  Menambah karya:
    1. Taruh berkas HTML karya di  karya/fase-x/nama-karya/index.html
    2. Tambahkan satu objek di daftar "karya" di bawah (paling atas = paling baru).
    3. Isi "url" dengan alamat foldernya. Kosongkan url ("") jika karya belum siap:
       kartunya tetap tampil dengan label "Segera hadir".
    4. (Opsional) Isi "sampul" dengan gambar 16:9 di assets/img/, misalnya
       "assets/img/nama-karya.webp". Tanpa sampul, kartu menampilkan rumusnya.
    5. Isi "ukuran" dengan besar berkasnya (misalnya "7 MB"). Angka ini tampil di
       tombol muat, supaya guru tahu kuota yang dipakai sebelum membuka di HP.

  Nilai "jenis" harus salah satu: "MPI", "Gim", "Lab Maya".
  Nilai "fase" harus salah satu: "A", "B", "C", "D", "E", "F".
*/
window.RUMATIKA_KATALOG = {
  /* Kontak kreator. "wa" memakai kode negara tanpa tanda + dan tanpa angka 0 di depan. */
  kontak: {
    nama: "Pak Yunas",
    wa: "6282261578489",
    waTampil: "0822-6157-8489",
    email: "yunaschandra29@gmail.com"
  },

  fase: [
    { kode: "A", jenjang: "SD", kelas: "Kelas 1–2", ringkas: "Bilangan sampai 100, penjumlahan dan pengurangan, bentuk datar." },
    { kode: "B", jenjang: "SD", kelas: "Kelas 3–4", ringkas: "Perkalian dan pembagian, pecahan, pengukuran." },
    { kode: "C", jenjang: "SD", kelas: "Kelas 5–6", ringkas: "Pecahan dan desimal, bangun ruang, penyajian data." },
    { kode: "D", jenjang: "SMP", kelas: "Kelas 7–9", ringkas: "Aljabar, persamaan linear, geometri, statistika dan peluang." },
    { kode: "E", jenjang: "SMA", kelas: "Kelas 10", ringkas: "Eksponen dan logaritma, trigonometri, peluang, data dua variabel." },
    { kode: "F", jenjang: "SMA", kelas: "Kelas 11–12", ringkas: "Lingkaran, peluang majemuk dan bersyarat, matematika keuangan, model linear data." }
  ],

  karya: [
    {
      id: "sonar-teluk",
      judul: "Sonar Teluk",
      fase: "E",
      jenis: "Gim",
      topik: "Persamaan dan fungsi kuadrat",
      tujuan: "Menjadi kru magang Kapal Riset Pelita yang memetakan dasar teluk berkabut dengan ping sonar terbatas: mencari akar, membaca diskriminan dan akar imajiner, menyusun fungsi kuadrat, dan menentukan nilai optimum dalam enam misi.",
      durasi: 90,
      perangkat: "Proyektor dan HP",
      simbol: "D = b² − 4ac",
      url: "karya/fase-e/sonar-teluk/",
      sampul: "assets/img/sonar-teluk.webp",
      ukuran: "2 MB",
      video: ""
    },
    {
      id: "jadwal-kereta",
      judul: "Jadwal Kereta",
      fase: "C",
      jenis: "MPI",
      topik: "Menghitung durasi waktu",
      tujuan: "Menemani Raka naik kereta: menghitung lama perjalanan dengan lompatan garis waktu dan cara bersusun, termasuk perjalanan lintas tengah malam, lalu menentukan waktu tiba atau waktu berangkat.",
      durasi: 70,
      perangkat: "Proyektor dan HP",
      simbol: "tiba − berangkat",
      url: "karya/fase-c/jadwal-kereta/",
      sampul: "assets/img/jadwal-kereta.webp",
      ukuran: "1,1 MB",
      video: ""
    },
    {
      id: "jam-ajaib",
      judul: "Jam Ajaib",
      fase: "B",
      jenis: "MPI",
      topik: "Membaca jam dan menit",
      tujuan: "Membaca jam tepat, setengah, seperempat, lewat, dan kurang bersama Dina: memutar jarum sendiri di bawah langit pagi sampai malam, lalu berlatih memilih, mengatur, menjodohkan, dan mengurutkan jam.",
      durasi: 70,
      perangkat: "Proyektor dan HP",
      simbol: "1 jam = 60 menit",
      url: "karya/fase-b/jam-ajaib/",
      sampul: "assets/img/jam-ajaib.webp",
      ukuran: "0,5 MB",
      video: ""
    },
    {
      id: "jaring-andal",
      judul: "Jaring Andal",
      fase: "F",
      jenis: "Gim",
      topik: "Peluang kejadian majemuk dan bersyarat",
      tujuan: "Menjadi teknisi sekolah yang merakit genset, pompa, dan pengeras suara: memakai peluang kejadian majemuk dan bersyarat agar listrik dan air tetap menyala.",
      durasi: 90,
      perangkat: "Proyektor dan HP",
      simbol: "P(A | B)",
      url: "karya/fase-f/jaring-andal/",
      sampul: "assets/img/jaring-andal.webp",
      ukuran: "0,8 MB",
      video: ""
    },
    {
      id: "potong-pas",
      judul: "Potong Pas",
      fase: "F",
      jenis: "Gim",
      topik: "Lingkaran",
      tujuan: "Menjadi montir magang di Bengkel Poros Kota: mengukur, menghitung, dan memotong tujuh komponen jam kincir dengan sifat-sifat lingkaran.",
      durasi: 45,
      perangkat: "Proyektor dan HP",
      simbol: "K = 2πr",
      url: "karya/fase-f/potong-pas/",
      sampul: "assets/img/potong-pas.webp",
      ukuran: "0,8 MB",
      video: ""
    },
    {
      id: "power-core",
      judul: "POWER CORE: Krisis Eksponen",
      fase: "E",
      jenis: "Gim",
      topik: "Bilangan berpangkat dan eksponen",
      tujuan: "Menjinakkan reaktor Kota Nova dalam tujuh misi dengan menerapkan sifat-sifat bilangan berpangkat.",
      durasi: 40,
      perangkat: "Proyektor dan HP",
      simbol: "aᵐ × aⁿ = aᵐ⁺ⁿ",
      url: "karya/fase-e/power-core/",
      sampul: "assets/img/power-core.webp",
      ukuran: "1,4 MB",
      video: "pangkat-nol"
    },
    {
      id: "delapan-sudut-kota",
      judul: "Delapan Sudut Kota",
      fase: "E",
      jenis: "Gim",
      topik: "Trigonometri: sudut elevasi dan depresi",
      tujuan: "Menyelesaikan delapan kasus pengukuran tinggi dan jarak di kota memakai perbandingan trigonometri, sudut istimewa, serta sudut elevasi dan depresi.",
      durasi: 45,
      perangkat: "Proyektor dan HP",
      simbol: "tan θ = depan / samping",
      url: "karya/fase-e/delapan-sudut-kota/",
      sampul: "assets/img/delapan-sudut-kota.webp",
      ukuran: "1,2 MB",
      video: ""
    },
    {
      id: "misteri-transaksi",
      judul: "Misteri Transaksi",
      fase: "E",
      jenis: "Gim",
      topik: "Barisan, deret, dan bunga",
      tujuan: "Menyelidiki delapan buku kas sekolah: memakai uji selisih dan uji rasio untuk menemukan baris yang salah catat pada barisan aritmetika, geometri, serta bunga tunggal dan majemuk.",
      durasi: 45,
      perangkat: "Proyektor dan HP",
      simbol: "Mₙ = M(1 + i)ⁿ",
      url: "karya/fase-e/misteri-transaksi/",
      sampul: "assets/img/misteri-transaksi.webp",
      ukuran: "1,2 MB",
      video: ""
    },
    {
      id: "brankas-menara-pola",
      judul: "Brankas Menara Pola",
      fase: "E",
      jenis: "Gim",
      topik: "Barisan dan deret aritmetika",
      tujuan: "Membuka lima brankas dengan menemukan suku ke-n, melengkapi barisan berlubang, dan menjumlahkan deret aritmetika.",
      durasi: 30,
      perangkat: "Proyektor dan HP",
      simbol: "Uₙ = a + (n − 1)b",
      url: "karya/fase-e/brankas-menara-pola/",
      sampul: "assets/img/brankas-menara-pola.webp",
      ukuran: "0,9 MB",
      video: ""
    },
    {
      id: "arena-juara",
      judul: "Arena Juara",
      fase: "E",
      jenis: "Gim",
      topik: "Kuis antarlegiun 14 bab Fase E",
      tujuan: "Menguatkan materi Fase E, dari eksponen dan logaritma sampai data dan peluang, lewat perebutan kotak soal antarkelompok dengan papan skor langsung.",
      durasi: "10–60",
      perangkat: "Proyektor",
      simbol: "Σ skor",
      url: "karya/fase-e/arena-juara/",
      sampul: "assets/img/arena-juara.webp",
      ukuran: "5 MB",
      video: "pangkat-nol"
    },
    {
      id: "porsenika",
      judul: "PORSENIKA",
      fase: "D",
      jenis: "Gim",
      topik: "Pembuka kelas bertema lomba 17-an",
      tujuan: "Membuka pelajaran dengan lomba 2–4 pemain: cari nilai x, hitung cepat dan KPK-FPB, volume dan luas bangun, serta perbandingan, skala, dan pola.",
      durasi: 20,
      perangkat: "Proyektor (sentuh, papan tuts, atau gerakan tangan)",
      simbol: "+ − × ÷",
      url: "karya/fase-d/porsenika/",
      sampul: "assets/img/porsenika.webp",
      ukuran: "3 MB",
      video: ""
    },
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
      sampul: "assets/img/warisan-cicilan.webp",
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
      sampul: "assets/img/bendahara-baru.webp",
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
      id: "timbangan-persamaan",
      judul: "Timbangan Persamaan",
      fase: "D",
      simbol: "2x + 3 = 11",
      ringkas: "Persamaan linear satu variabel dibayangkan sebagai timbangan: apa pun yang dilakukan di satu sisi, lakukan juga di sisi lainnya.",
      karya: "porsenika",
      url: "https://www.youtube.com/shorts/38IczGNhlLg",
      status: "tayang"
    },
    {
      id: "bahas-soal-tka",
      judul: "Bahas Soal TKA",
      fase: "D",
      simbol: "TKA",
      ringkas: "Pembahasan singkat soal Tes Kemampuan Akademik matematika, langkah demi langkah.",
      karya: "",
      url: "https://www.youtube.com/shorts/ghVUGxmrYLE",
      status: "tayang"
    },
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
      karya: "",
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
      karya: "power-core",
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
