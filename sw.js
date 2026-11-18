/*
  RUMATIKA — service worker
  Tugasnya hanya dua: membuat Rumatika bisa dipasang sebagai aplikasi, dan menampilkan
  notifikasi saat ada konten baru. Tidak menyimpan cache halaman, jadi karya selalu
  dimuat versi terbaru dari situs.
*/
const IKON = "/assets/merek/ikon-192.png";
const LENCANA = "/assets/merek/lencana-96.png";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

async function ambilKabar(e) {
  try {
    if (e.data) {
      const data = e.data.json();
      if (data && Array.isArray(data.item) && data.item.length) return data.item;
    }
  } catch (err) { /* lanjut ke cadangan */ }
  try {
    const res = await fetch("/api/kabar/terbaru", { cache: "no-store" });
    const data = await res.json();
    if (data && Array.isArray(data.item) && data.item.length) return data.item;
  } catch (err) { /* lanjut ke cadangan */ }
  return [{ judul: "Ada konten baru di Rumatika", isi: "Ketuk untuk melihat.", url: "/", tag: "rumatika" }];
}

self.addEventListener("push", (e) => {
  e.waitUntil(ambilKabar(e).then((item) => Promise.all(item.slice(0, 3).map((it) =>
    self.registration.showNotification(it.judul, {
      body: it.isi || "",
      icon: IKON,
      badge: LENCANA,
      image: it.gambar || undefined,
      tag: it.tag || it.url || "rumatika",
      data: { url: it.url || "/" },
      lang: "id"
    })
  ))));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const tujuan = new URL((e.notification.data && e.notification.data.url) || "/", self.location.origin).href;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((daftar) => {
    for (const c of daftar) {
      if (new URL(c.url).origin === self.location.origin && "focus" in c) {
        return c.focus().then((w) => (w && "navigate" in w ? w.navigate(tujuan) : null));
      }
    }
    return self.clients.openWindow(tujuan);
  }));
});
