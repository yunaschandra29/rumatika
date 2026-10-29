/* RUMATIKA — logika portal
   Semua halaman ada di index.html; alamat setelah tanda # menentukan halaman yang tampil:
   #beranda, #semua-karya, #kamar-belajar, #kamar-main, #laboratorium,
   #fase-a … #fase-f, #karya-<id>, #teras-trik, #panduan-guru, #tentang
   Data dibaca dari data/katalog.js. */
(function () {
  "use strict";

  var K = window.RUMATIKA_KATALOG || { fase: [], karya: [], video: [] };
  var PRATINJAU = !!window.RUMATIKA_PRATINJAU;

  var JENIS = {
    "MPI": { kelas: "mpi", kamar: "Kamar Belajar", rute: "kamar-belajar" },
    "Gim": { kelas: "gim", kamar: "Kamar Main", rute: "kamar-main" },
    "Lab Maya": { kelas: "lab", kamar: "Laboratorium", rute: "laboratorium" }
  };
  var RUTE_JENIS = { "kamar-belajar": "MPI", "kamar-main": "Gim", "laboratorium": "Lab Maya" };

  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fase(kode) { return K.fase.filter(function (f) { return f.kode === kode; })[0]; }
  function karya(id) { return K.karya.filter(function (k) { return k.id === id; })[0]; }
  function video(id) { return K.video.filter(function (v) { return v.id === id; })[0]; }
  function tersedia(k) { return !!(k && k.url); }
  /* Alamat berkas karya. Folder ("…/") dilengkapi index.html supaya tetap jalan
     saat index.html dibuka langsung dari laptop tanpa server. */
  /* Sampul cadangan untuk karya yang belum siap (url kosong) dan belum punya sampul. */
  var SAMPUL_SEGERA = "assets/img/segera-hadir.webp";
  function sampulKarya(k) { return k.sampul || (tersedia(k) ? "" : SAMPUL_SEGERA); }
  function alamat(k) { return /\/$/.test(k.url) ? k.url + "index.html" : k.url; }
  function jenisKelas(j) { return (JENIS[j] || JENIS["MPI"]).kelas; }

  /* ---------- komponen ---------- */
  function kartuKarya(k) {
    var f = fase(k.fase);
    var j = jenisKelas(k.jenis);
    return '<a class="kartu" href="#karya-' + esc(k.id) + '">' +
      '<div class="sampul" data-jenis="' + j + '">' +
        '<span class="sampul-rumus">' + esc(k.simbol) + '</span>' +
        (sampulKarya(k) ? '<img class="sampul-gambar" src="' + esc(sampulKarya(k)) + '" alt="" loading="lazy" onerror="this.remove()">' : '') +
        (tersedia(k) ? '' : '<span class="label-segera">Segera hadir</span>') +
      '</div>' +
      '<div class="kartu-isi">' +
        '<div class="chip-baris"><span class="chip" data-jenis="' + j + '">' + esc(k.jenis) + '</span>' +
        '<span class="chip">Fase ' + esc(k.fase) + '</span></div>' +
        '<h3>' + esc(k.judul) + '</h3>' +
        '<p>' + esc(k.topik) + '</p>' +
        '<div class="kartu-kaki"><span>' + esc(k.durasi) + ' menit</span><span>' +
          esc(f ? f.jenjang + ' ' + f.kelas : '') + '</span></div>' +
      '</div></a>';
  }

  function idYoutube(url) {
    var m = /(?:shorts\/|youtu\.be\/|[?&]v=)([\w-]{11})/.exec(url || "");
    return m ? m[1] : "";
  }

  function kartuVideo(v) {
    var terkait = karya(v.karya);
    var tayang = v.status === "tayang";
    var yt = tayang ? idYoutube(v.url) : "";
    var isiLayar = '<span class="video-rumus">' + esc(v.simbol) + '</span>' +
      (yt ? '<img class="video-gambar" src="https://i.ytimg.com/vi/' + yt + '/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()">' : '') +
      '<span class="video-putar" aria-hidden="true"></span>' +
      '<span class="video-durasi">' + esc(v.detik) + ' dtk</span>';
    var layar = tayang
      ? '<a class="video-layar" href="' + esc(v.url) + '" target="_blank" rel="noopener" aria-label="Tonton ' + esc(v.judul) + ' di YouTube">' + isiLayar + '</a>'
      : '<div class="video-layar">' + isiLayar + '</div>';
    return '<article class="video">' + layar +
      '<div class="video-isi">' +
        '<div class="chip-baris"><span class="chip">Fase ' + esc(v.fase) + '</span>' +
          (tayang ? '' : '<span class="status-segera">Segera tayang</span>') + '</div>' +
        '<h3>' + esc(v.judul) + '</h3>' +
        '<p>' + esc(v.ringkas) + '</p>' +
        '<div class="video-tautan">' +
          '<a href="' + esc(v.url) + '" target="_blank" rel="noopener">' +
            (tayang ? 'Tonton di YouTube' : 'Kanal @yunascp') + '</a>' +
          (terkait ? '<a href="#karya-' + esc(terkait.id) + '">Coba karyanya →</a>' : '') +
        '</div>' +
      '</div></article>';
  }

  function tombolPil(nilai, label, aktif, attr) {
    return '<button class="pil" type="button" ' + attr + '="' + esc(nilai) + '" aria-pressed="' + (aktif ? 'true' : 'false') + '">' + esc(label) + '</button>';
  }

  /* ---------- beranda ---------- */
  function renderBeranda() {
    $("#denah-ruang").innerHTML = K.fase.map(function (f) {
      var n = K.karya.filter(function (k) { return k.fase === f.kode; }).length;
      return '<a class="ruang' + (n ? '' : ' ruang-kosong') + '" href="#fase-' + f.kode.toLowerCase() + '">' +
        '<span class="ruang-label">Ruang</span>' +
        '<span class="ruang-huruf">' + esc(f.kode) + '</span>' +
        '<span class="ruang-kelas">' + esc(f.jenjang + ' ' + f.kelas) + '</span>' +
        '<span class="ruang-hitung">' + (n ? n + ' karya' : 'sedang ditata') + '</span></a>';
    }).join("");

    var siap = K.karya.filter(tersedia).length;
    $("#ringkas-angka").textContent =
      K.karya.length + " karya (" + siap + " siap dimainkan) · " + K.fase.length + " ruang fase · " + K.video.length + " video";

    $$("[data-hitung-jenis]").forEach(function (el) {
      var n = K.karya.filter(function (k) { return k.jenis === el.getAttribute("data-hitung-jenis"); }).length;
      el.textContent = n + " karya →";
    });

    $("#grid-baru").innerHTML = K.karya.slice(0, 4).map(kartuKarya).join("");
    $("#grid-video-beranda").innerHTML = K.video.slice(0, 3).map(kartuVideo).join("");
  }

  /* ---------- semua karya ---------- */
  var saring = { fase: "Semua", jenis: "Semua", cari: "" };

  function renderSemua() {
    var dariKamar = saring.jenis !== "Semua" && JENIS[saring.jenis];
    $("#semua-alis").textContent = dariKamar ? JENIS[saring.jenis].kamar : "Semua karya";
    $("#semua-judul").textContent = dariKamar ? "Karya " + saring.jenis : "Semua karya Rumatika";

    $("#saring-fase").innerHTML = '<span class="saring-label">Fase</span>' +
      ["Semua"].concat(K.fase.map(function (f) { return f.kode; })).map(function (k) {
        return tombolPil(k, k, saring.fase === k, "data-fase");
      }).join("");
    $("#saring-jenis").innerHTML = '<span class="saring-label">Jenis</span>' +
      ["Semua", "MPI", "Gim", "Lab Maya"].map(function (j) {
        return tombolPil(j, j, saring.jenis === j, "data-jenis-pil");
      }).join("");

    var q = saring.cari.trim().toLowerCase();
    var hasil = K.karya.filter(function (k) {
      if (saring.fase !== "Semua" && k.fase !== saring.fase) return false;
      if (saring.jenis !== "Semua" && k.jenis !== saring.jenis) return false;
      if (q && (k.judul + " " + k.topik + " " + k.tujuan + " " + k.jenis).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    $("#grid-semua").innerHTML = hasil.map(kartuKarya).join("");
    $("#kosong-semua").hidden = hasil.length > 0;
    $("#hasil-hitung").textContent = hasil.length + " dari " + K.karya.length + " karya";
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-fase]");
    if (b) { saring.fase = b.getAttribute("data-fase"); renderSemua(); return; }
    b = e.target.closest("[data-jenis-pil]");
    if (b) { saring.jenis = b.getAttribute("data-jenis-pil"); renderSemua(); return; }
    b = e.target.closest("[data-fase-jenis]");
    if (b) { faseJenis = b.getAttribute("data-fase-jenis"); renderFase(faseAktif); return; }
    b = e.target.closest("[data-video-fase]");
    if (b) { videoFase = b.getAttribute("data-video-fase"); renderTeras(); return; }
    b = e.target.closest("[data-gulir]");
    if (b) {
      var target = document.getElementById(b.getAttribute("data-gulir"));
      if (target) target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    }
  });
  var cari = $("#cari-karya");
  if (cari) cari.addEventListener("input", function () { saring.cari = cari.value; renderSemua(); });

  /* ---------- ruang fase ---------- */
  var faseAktif = "A";
  var faseJenis = "Semua";

  function renderFase(kode) {
    faseAktif = kode;
    var f = fase(kode);
    var idx = K.fase.indexOf(f);
    $("#fase-huruf").textContent = f.kode;
    $("#fase-alis").textContent = "Ruang Fase " + f.kode;
    $("#fase-judul").textContent = f.jenjang + " " + f.kelas;
    $("#fase-lead").textContent = f.ringkas;

    var semua = K.karya.filter(function (k) { return k.fase === kode; });
    var ada = ["MPI", "Gim", "Lab Maya"].filter(function (j) {
      return semua.some(function (k) { return k.jenis === j; });
    });
    if (faseJenis !== "Semua" && ada.indexOf(faseJenis) === -1) faseJenis = "Semua";
    $("#fase-saring-jenis").innerHTML = semua.length && ada.length > 1
      ? ["Semua"].concat(ada).map(function (j) { return tombolPil(j, j, faseJenis === j, "data-fase-jenis"); }).join("")
      : "";

    var hasil = semua.filter(function (k) { return faseJenis === "Semua" || k.jenis === faseJenis; });
    $("#grid-fase").innerHTML = hasil.map(kartuKarya).join("");
    $("#kosong-fase").hidden = semua.length > 0;
    $("#kosong-fase-teks").textContent = "Karya pertama untuk Fase " + f.kode +
      " sedang disiapkan. Sementara itu, tonton video di Teras Trik.";

    var sebelum = K.fase[idx - 1], sesudah = K.fase[idx + 1];
    $("#fase-tetangga").innerHTML =
      (sebelum ? '<a href="#fase-' + sebelum.kode.toLowerCase() + '"><small>← Ruang sebelumnya</small>Fase ' + sebelum.kode + ' · ' + esc(sebelum.jenjang + ' ' + sebelum.kelas) + '</a>' : '') +
      (sesudah ? '<a class="kanan" href="#fase-' + sesudah.kode.toLowerCase() + '"><small>Ruang berikutnya →</small>Fase ' + sesudah.kode + ' · ' + esc(sesudah.jenjang + ' ' + sesudah.kelas) + '</a>' : '');
  }

  /* ---------- halaman karya ---------- */
  function renderKarya(k) {
    var f = fase(k.fase);
    var j = jenisKelas(k.jenis);
    var v = video(k.video);
    var siap = tersedia(k);

    var bingkai = siap
      ? '<div class="bingkai bingkai-segera bingkai-siap' + (k.sampul ? ' ada-sampul' : '') + '" id="bingkai-karya" data-jenis="' + j + '">' +
          (k.sampul ? '<img class="sampul-gambar" src="' + esc(k.sampul) + '" alt="" onerror="this.remove()">' : '') +
          '<span class="rumus">' + esc(k.simbol) + '</span>' +
          '<button class="tombol tombol-muat" type="button" id="tombol-muat">Muat di halaman ini' + (k.ukuran ? ' · ' + esc(k.ukuran) : '') + '</button>' +
          '<p>Karya dimuat setelah diklik, supaya kuota HP tidak terpakai sebelum siap.</p></div>' +
        (k.sampul ? '<p class="ket-muat">Klik gambar untuk memuat gim di halaman ini. Gim baru diunduh setelah diklik, supaya kuota HP tidak terpakai sebelum siap.</p>' : '')
      : '<div class="bingkai bingkai-segera ada-sampul-segera" data-jenis="' + j + '">' +
          '<img class="sampul-gambar" src="' + esc(sampulKarya(k)) + '" alt="Karya sedang dibangun" onerror="this.remove()">' +
          '<span class="rumus">' + esc(k.simbol) + '</span></div>' +
        '<p class="ket-muat">Karya ini sedang disiapkan untuk diunggah. Kartu dan halamannya sudah bisa dibagikan.</p>';

    var aksi = siap
      ? '<a class="tombol tombol-utama" href="' + esc(alamat(k)) + '">Mainkan</a>' +
        '<button class="tombol tombol-garis" type="button" id="tombol-proyektor">Mode Proyektor</button>' +
        (PRATINJAU ? '' : '<a class="tombol tombol-garis" href="' + esc(alamat(k)) + '" download="' + esc(k.id) + '.html">Unduh offline</a>')
      : '<span class="tombol tombol-utama" aria-disabled="true">Segera hadir</span>';
    aksi += '<button class="tombol tombol-garis" type="button" id="tombol-salin">Salin tautan</button>';
    if (v) {
      aksi += '<a class="tombol tombol-garis" href="' + esc(v.url) + '" target="_blank" rel="noopener">' +
        (v.status === "tayang" ? 'Tonton videonya' : 'Video segera tayang') + '</a>';
    }

    var lain = K.karya.filter(function (x) { return x.fase === k.fase && x.id !== k.id; }).slice(0, 3);

    $("#karya-isi").innerHTML =
      '<nav class="remah" aria-label="Posisi halaman"><a href="#beranda">Beranda</a><span aria-hidden="true">/</span>' +
        '<a href="#fase-' + k.fase.toLowerCase() + '">Ruang Fase ' + esc(k.fase) + '</a><span aria-hidden="true">/</span>' +
        '<span>' + esc(k.judul) + '</span></nav>' +
      '<div class="karya-tata"><div class="karya-media">' + bingkai + '</div>' +
        '<div class="karya-info">' +
          '<div class="chip-baris"><span class="chip" data-jenis="' + j + '">' + esc((JENIS[k.jenis] || {}).kamar || k.jenis) + '</span>' +
            '<span class="chip">Fase ' + esc(k.fase) + '</span></div>' +
          '<h1>' + esc(k.judul) + '</h1>' +
          '<p class="tujuan">' + esc(k.tujuan) + '</p>' +
          '<dl class="meta">' +
            '<dt>Jenis</dt><dd>' + esc(k.jenis) + '</dd>' +
            '<dt>Fase</dt><dd>' + esc(k.fase + (f ? ' · ' + f.jenjang + ' ' + f.kelas : '')) + '</dd>' +
            '<dt>Topik</dt><dd>' + esc(k.topik) + '</dd>' +
            '<dt>Durasi</dt><dd>' + (typeof k.durasi === "number" ? '± ' : '') + esc(k.durasi) + ' menit</dd>' +
            '<dt>Perangkat</dt><dd>' + esc(k.perangkat) + '</dd>' +
          '</dl>' +
          '<div class="karya-aksi">' + aksi + '</div>' +
          '<p class="pesan-salin" id="pesan-salin" aria-live="polite"></p>' +
        '</div>' +
      '</div>' +
      (lain.length ? '<div class="karya-lain"><h2>Karya lain di Ruang Fase ' + esc(k.fase) + '</h2><div class="grid-kartu">' + lain.map(kartuKarya).join("") + '</div></div>' : '');

    function muat() {
      var el = $("#bingkai-karya");
      if (!el || $("iframe", el)) return el;
      el.className = "bingkai";
      var ket = $(".ket-muat");
      if (ket) ket.remove();
      el.innerHTML = '<iframe src="' + esc(alamat(k)) + '" title="' + esc(k.judul) + '" allow="fullscreen; autoplay; camera; microphone"></iframe>';
      return el;
    }
    var bingkaiMuat = $("#bingkai-karya.bingkai-siap");
    if (bingkaiMuat) bingkaiMuat.addEventListener("click", function () {
      muat();
    });

    var proyektor = $("#tombol-proyektor");
    if (proyektor) proyektor.addEventListener("click", function () {
      var el = muat();
      var minta = el && (el.requestFullscreen || el.webkitRequestFullscreen);
      if (!minta) { location.href = alamat(k); return; }
      try {
        var p = minta.call(el);
        if (p && p.catch) p.catch(function () { location.href = alamat(k); });
      } catch (err) { location.href = alamat(k); }
    });

    $("#tombol-salin").addEventListener("click", function () {
      var tautan = location.href;
      var pesan = $("#pesan-salin");
      function gagal() { pesan.textContent = "Salin manual: " + tautan; }
      try {
        navigator.clipboard.writeText(tautan).then(function () {
          pesan.textContent = "Tautan tersalin. Tempel di grup kelas.";
        }, gagal);
      } catch (err) { gagal(); }
    });
  }

  /* ---------- teras trik ---------- */
  var videoFase = "Semua";
  function renderTeras() {
    var adaFase = K.fase.map(function (f) { return f.kode; }).filter(function (kode) {
      return K.video.some(function (v) { return v.fase === kode; });
    });
    $("#saring-video").innerHTML = '<span class="saring-label">Fase</span>' +
      ["Semua"].concat(adaFase).map(function (kode) { return tombolPil(kode, kode, videoFase === kode, "data-video-fase"); }).join("");
    var hasil = K.video.filter(function (v) { return videoFase === "Semua" || v.fase === videoFase; });
    $("#grid-video").innerHTML = hasil.map(kartuVideo).join("");
    $("#kosong-video").hidden = hasil.length > 0;
  }

  /* ---------- rute ---------- */
  var JUDUL_DASAR = "Rumatika";
  function tampil(nama, navAktif, judul) {
    $$("[data-view]").forEach(function (s) { s.hidden = s.getAttribute("data-view") !== nama; });
    $$("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === navAktif) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.title = judul ? judul + " · " + JUDUL_DASAR : JUDUL_DASAR;
  }

  function rute(awal) {
    var h = decodeURIComponent(location.hash.replace(/^#/, "")) || "beranda";
    var m;

    if (h === "semua-karya" || RUTE_JENIS[h]) {
      saring = { fase: "Semua", jenis: RUTE_JENIS[h] || "Semua", cari: "" };
      if (cari) cari.value = "";
      renderSemua();
      tampil("semua-karya", "semua-karya", RUTE_JENIS[h] ? JENIS[RUTE_JENIS[h]].kamar : "Semua Karya");
    } else if ((m = /^fase-([a-f])$/.exec(h))) {
      faseJenis = "Semua";
      renderFase(m[1].toUpperCase());
      tampil("fase", "", "Ruang Fase " + m[1].toUpperCase());
    } else if ((m = /^karya-(.+)$/.exec(h)) && karya(m[1])) {
      renderKarya(karya(m[1]));
      tampil("karya", "", karya(m[1]).judul);
    } else if (h === "teras-trik") {
      renderTeras();
      tampil("teras-trik", "teras-trik", "Teras Trik");
    } else if (h === "panduan-guru") {
      tampil("panduan-guru", "panduan-guru", "Panduan Guru");
    } else if (h === "tentang") {
      tampil("tentang", "tentang", "Tentang");
    } else {
      renderBeranda();
      tampil("beranda", "beranda", "");
    }
    if (!awal) window.scrollTo(0, 0);
  }

  window.addEventListener("hashchange", function () { rute(false); });
  rute(true);
})();
