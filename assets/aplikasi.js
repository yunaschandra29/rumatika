/*
  RUMATIKA — pasang aplikasi (PWA) dan notifikasi konten baru
  Mengatur blok "Aplikasi Rumatika" di beranda: tombol pasang, petunjuk iPhone/iPad,
  dan tombol nyalakan/matikan notifikasi. Situs tetap berjalan normal di browser
  yang tidak mendukung fitur ini.
*/
(function () {
  "use strict";

  var tPasang = document.getElementById("aplikasi-pasang");
  var tNotif = document.getElementById("aplikasi-notif");
  var elStatus = document.getElementById("aplikasi-status");
  var elIos = document.getElementById("aplikasi-ios");

  var dukungSw = "serviceWorker" in navigator;
  var dukungPush = dukungSw && "PushManager" in window && "Notification" in window;
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var terpasang = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
    navigator.standalone === true;
  var ajakan = null;
  var reg = null;

  function status(teks) { if (elStatus) elStatus.textContent = teks || ""; }

  /* ---------- tombol pasang ---------- */
  function aturPasang() {
    if (!tPasang) return;
    if (terpasang) {
      tPasang.hidden = true;
      if (elIos) elIos.hidden = true;
      return;
    }
    tPasang.hidden = !ajakan;
    if (elIos) elIos.hidden = !(ios && !ajakan);
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    ajakan = e;
    aturPasang();
  });

  window.addEventListener("appinstalled", function () {
    terpasang = true;
    ajakan = null;
    aturPasang();
    status("Rumatika sudah terpasang. Bukalah dari layar utama atau daftar aplikasi.");
  });

  if (tPasang) {
    tPasang.addEventListener("click", function () {
      if (!ajakan) return;
      ajakan.prompt();
      ajakan.userChoice.then(function () { ajakan = null; aturPasang(); });
    });
  }

  /* ---------- notifikasi ---------- */
  function keUint8(b64) {
    var s = atob(b64.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64.length + 3) % 4));
    var a = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return a;
  }

  function kirim(jalur, data) {
    return fetch(jalur, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store"
    }).then(function (r) { if (!r.ok) throw new Error("gagal"); return r; });
  }

  function tampilNotif(aktif) {
    if (!tNotif) return;
    tNotif.hidden = false;
    tNotif.disabled = false;
    tNotif.setAttribute("aria-pressed", aktif ? "true" : "false");
    tNotif.textContent = aktif ? "Matikan Notifikasi" : "Nyalakan Notifikasi";
  }

  function aturNotif() {
    if (!tNotif) return;
    if (!dukungPush) {
      tNotif.hidden = true;
      if (ios && !terpasang) status("Di iPhone/iPad, notifikasi bisa dinyalakan setelah Rumatika dipasang di layar utama.");
      return;
    }
    if (Notification.permission === "denied") {
      tNotif.hidden = true;
      status("Notifikasi diblokir di browser ini. Izinkan lewat pengaturan situs, lalu muat ulang halaman.");
      return;
    }
    reg.pushManager.getSubscription().then(function (s) {
      tampilNotif(!!s);
      if (s) {
        status("Notifikasi menyala. Anda akan diberi tahu setiap ada konten baru.");
        /* segarkan langganan di server sekali per sesi */
        try {
          if (!sessionStorage.getItem("rumatika-langganan")) {
            kirim("/api/kabar/langganan", s.toJSON()).then(function () {
              sessionStorage.setItem("rumatika-langganan", "1");
            }).catch(function () {});
          }
        } catch (e) { /* abaikan */ }
      }
    });
  }

  function nyalakan() {
    tNotif.disabled = true;
    status("Meminta izin notifikasi…");
    Notification.requestPermission().then(function (izin) {
      if (izin !== "granted") {
        aturNotif();
        if (izin === "default") status("Notifikasi belum dinyalakan.");
        return;
      }
      return fetch("/api/kabar/kunci", { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keUint8(d.kunci) });
        })
        .then(function (s) { return kirim("/api/kabar/langganan", s.toJSON()); })
        .then(function () {
          tampilNotif(true);
          status("Notifikasi menyala. Anda akan diberi tahu setiap ada konten baru.");
        });
    }).catch(function () {
      tNotif.disabled = false;
      status("Notifikasi belum berhasil dinyalakan. Periksa koneksi internet, lalu coba lagi.");
    });
  }

  function matikan() {
    tNotif.disabled = true;
    reg.pushManager.getSubscription().then(function (s) {
      if (!s) return;
      var endpoint = s.endpoint;
      return s.unsubscribe().then(function () {
        return kirim("/api/kabar/berhenti", { endpoint: endpoint }).catch(function () {});
      });
    }).then(function () {
      tampilNotif(false);
      status("Notifikasi dimatikan.");
    }).catch(function () {
      tNotif.disabled = false;
    });
  }

  if (tNotif) {
    tNotif.addEventListener("click", function () {
      if (!reg) return;
      if (tNotif.getAttribute("aria-pressed") === "true") matikan(); else nyalakan();
    });
  }

  /* ---------- mulai ---------- */
  aturPasang();
  if (terpasang) status("Anda sedang membuka Rumatika sebagai aplikasi.");
  if (!dukungSw) { aturNotif(); return; }

  navigator.serviceWorker.register("/sw.js").then(function (r) {
    return navigator.serviceWorker.ready.then(function () { reg = r; aturNotif(); });
  }).catch(function () {
    if (tNotif) tNotif.hidden = true;
  });
})();
