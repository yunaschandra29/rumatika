/*
  RUMATIKA — notifikasi konten baru (Web Push)

  Alur:
  - Pengunjung menekan "Nyalakan Notifikasi"; browser memberi alamat langganan,
    disimpan di D1 (tabel langganan). Tidak ada nama, email, atau IP yang disimpan.
  - Setiap 10 menit (Cron Trigger) worker membaca data/kabar.json dan data/artikel.js
    dari situs. Karya, video, atau artikel yang belum pernah dilihat dikirim sebagai
    notifikasi ke semua pelanggan. Jadi cukup push ke GitHub seperti biasa.
  - Kunci VAPID dibuat sekali secara otomatis dan disimpan di D1 (tabel pengaturan).

  GET  /api/kabar/kunci       kunci publik VAPID untuk browser
  POST /api/kabar/langganan   simpan langganan  {endpoint, keys:{p256dh, auth}}
  POST /api/kabar/berhenti    hapus langganan   {endpoint}
  GET  /api/kabar/terbaru     kabar terakhir yang dikirim
*/

const SITUS = "https://rumatika.yunaschandra29.workers.dev";
const KONTAK = "mailto:yunaschandra29@gmail.com";
const MAKS_KIRIM = 3;

const SKEMA = [
  "CREATE TABLE IF NOT EXISTS langganan (endpoint TEXT PRIMARY KEY, p256dh TEXT NOT NULL, auth TEXT NOT NULL, dibuat TEXT NOT NULL)",
  "CREATE TABLE IF NOT EXISTS pengaturan (kunci TEXT PRIMARY KEY, nilai TEXT NOT NULL)"
];

/* Hanya layanan push resmi browser yang diterima, supaya worker tidak bisa disuruh mengirim ke alamat lain. */
const LAYANAN_PUSH = [
  /^fcm\.googleapis\.com$/,
  /^android\.googleapis\.com$/,
  /^updates\.push\.services\.mozilla\.com$/,
  /^[a-z0-9.-]*push\.services\.mozilla\.com$/,
  /^web\.push\.apple\.com$/,
  /^[a-z0-9.-]+\.push\.apple\.com$/,
  /^[a-z0-9.-]+\.notify\.windows\.com$/
];

let skemaSiap = false;
async function pastikanSkema(db) {
  if (skemaSiap) return;
  await db.batch(SKEMA.map((s) => db.prepare(s)));
  skemaSiap = true;
}

/* ---------- base64url ---------- */
const enc = new TextEncoder();
export function b64u(buf) {
  const b = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export function dariB64u(s) {
  const t = atob(String(s).replace(/-/g, "+").replace(/_/g, "/") + "===".slice((String(s).length + 3) % 4));
  const b = new Uint8Array(t.length);
  for (let i = 0; i < t.length; i++) b[i] = t.charCodeAt(i);
  return b;
}
function gabung(...bagian) {
  const n = bagian.reduce((a, b) => a + b.length, 0);
  const hasil = new Uint8Array(n);
  let i = 0;
  for (const b of bagian) { hasil.set(b, i); i += b.length; }
  return hasil;
}

/* ---------- pengaturan & kunci VAPID ---------- */
async function bacaAtur(db, kunci) {
  const r = await db.prepare("SELECT nilai FROM pengaturan WHERE kunci = ?1").bind(kunci).first();
  return r ? JSON.parse(r.nilai) : null;
}
async function tulisAtur(db, kunci, nilai) {
  await db.prepare("INSERT INTO pengaturan (kunci, nilai) VALUES (?1, ?2) ON CONFLICT(kunci) DO UPDATE SET nilai = excluded.nilai")
    .bind(kunci, JSON.stringify(nilai)).run();
}

let vapidCache = null;
async function kunciVapid(db) {
  if (vapidCache) return vapidCache;
  let v = await bacaAtur(db, "vapid");
  if (!v) {
    const p = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
    const baru = {
      privat: await crypto.subtle.exportKey("jwk", p.privateKey),
      publik: b64u(await crypto.subtle.exportKey("raw", p.publicKey))
    };
    await db.prepare("INSERT OR IGNORE INTO pengaturan (kunci, nilai) VALUES ('vapid', ?1)").bind(JSON.stringify(baru)).run();
    v = await bacaAtur(db, "vapid");
  }
  const privat = await crypto.subtle.importKey("jwk", v.privat, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  vapidCache = { publik: v.publik, privat };
  return vapidCache;
}

export async function tokenVapid(aud, vapid) {
  const kepala = b64u(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const isi = b64u(enc.encode(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: KONTAK })));
  const ttd = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, vapid.privat, enc.encode(kepala + "." + isi));
  return kepala + "." + isi + "." + b64u(ttd);
}

/* ---------- enkripsi isi pesan (RFC 8291, aes128gcm) ---------- */
async function hmac(kunci, data) {
  const k = await crypto.subtle.importKey("raw", kunci, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, data));
}

export async function enkripsi(teks, p256dh, auth) {
  const uaPublik = dariB64u(p256dh);
  const rahasiaAuth = dariB64u(auth);
  const sementara = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const asPublik = new Uint8Array(await crypto.subtle.exportKey("raw", sementara.publicKey));
  const kunciUa = await crypto.subtle.importKey("raw", uaPublik, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: kunciUa }, sementara.privateKey, 256));

  const prkKunci = await hmac(rahasiaAuth, ecdh);
  const ikm = await hmac(prkKunci, gabung(enc.encode("WebPush: info\0"), uaPublik, asPublik, new Uint8Array([1])));
  const garam = crypto.getRandomValues(new Uint8Array(16));
  const prk = await hmac(garam, ikm);
  const cek = (await hmac(prk, gabung(enc.encode("Content-Encoding: aes128gcm\0"), new Uint8Array([1])))).slice(0, 16);
  const nonce = (await hmac(prk, gabung(enc.encode("Content-Encoding: nonce\0"), new Uint8Array([1])))).slice(0, 12);

  const kunciAes = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM" }, false, ["encrypt"]);
  const sandi = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce },
    kunciAes, gabung(enc.encode(teks), new Uint8Array([2]))));

  const kepala = new Uint8Array(21);
  kepala.set(garam, 0);
  new DataView(kepala.buffer).setUint32(16, 4096);
  kepala[20] = asPublik.length;
  return gabung(kepala, asPublik, sandi);
}

/* ---------- kirim ke satu pelanggan ---------- */
async function kirimSatu(db, vapid, sub, teks) {
  const aud = new URL(sub.endpoint).origin;
  const badan = await enkripsi(teks, sub.p256dh, sub.auth);
  const res = await fetch(sub.endpoint, {
    method: "POST",
    headers: {
      Authorization: "vapid t=" + (await tokenVapid(aud, vapid)) + ", k=" + vapid.publik,
      TTL: "172800",
      Urgency: "normal",
      "Content-Encoding": "aes128gcm",
      "Content-Type": "application/octet-stream"
    },
    body: badan
  });
  if (res.status === 404 || res.status === 410) {
    await db.prepare("DELETE FROM langganan WHERE endpoint = ?1").bind(sub.endpoint).run();
  }
  return res.status;
}

async function kirimSemua(env, item) {
  const vapid = await kunciVapid(env.DB);
  const { results } = await env.DB.prepare("SELECT endpoint, p256dh, auth FROM langganan").all();
  const teks = JSON.stringify({ item });
  const hasil = { terkirim: 0, gagal: 0, pelanggan: results.length };
  for (let i = 0; i < results.length; i += 20) {
    const status = await Promise.allSettled(results.slice(i, i + 20).map((s) => kirimSemuaAman(env.DB, vapid, s, teks)));
    for (const s of status) {
      if (s.status === "fulfilled" && s.value >= 200 && s.value < 300) hasil.terkirim++;
      else hasil.gagal++;
    }
  }
  return hasil;
}
function kirimSemuaAman(db, vapid, s, teks) {
  return kirimSatu(db, vapid, s, teks).catch(() => 0);
}

/* ---------- membaca isi situs ---------- */
async function bacaJson(env, jalur) {
  const res = await env.ASSETS.fetch(new Request(SITUS + jalur));
  if (!res.ok) throw new Error("Tidak bisa membaca " + jalur);
  return res.json();
}
async function bacaArtikel(env) {
  const res = await env.ASSETS.fetch(new Request(SITUS + "/data/artikel.js"));
  if (!res.ok) return [];
  const teks = await res.text();
  const awal = teks.indexOf("[");
  const akhir = teks.lastIndexOf("]");
  return awal >= 0 && akhir > awal ? JSON.parse(teks.slice(awal, akhir + 1)) : [];
}

function idYoutube(url) {
  const m = String(url || "").match(/(?:shorts\/|v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : "";
}

/* Semua konten yang sudah tayang, dari yang terbaru. Kuncinya dipakai untuk mengenali konten baru. */
async function kontenTayang(env) {
  const kabar = await bacaJson(env, "/data/kabar.json");
  const daftar = [];
  for (const k of kabar.karya || []) {
    if (!k.siap) continue;
    daftar.push({
      kunci: "karya:" + k.id,
      judul: k.jenis + " baru di Rumatika",
      isi: k.judul + " · Fase " + k.fase,
      url: "/#karya-" + k.id,
      gambar: "/assets/og/" + k.id + ".jpg",
      tag: "karya-" + k.id
    });
  }
  for (const v of kabar.video || []) {
    if (v.status !== "tayang" || !v.url) continue;
    const yt = idYoutube(v.url);
    daftar.push({
      kunci: "video:" + v.id,
      judul: "Video baru di Teras Trik",
      isi: v.judul + " · Fase " + v.fase,
      url: "/#teras-trik",
      gambar: yt ? "https://i.ytimg.com/vi/" + yt + "/hqdefault.jpg" : undefined,
      tag: "video-" + v.id
    });
  }
  for (const a of await bacaArtikel(env)) {
    daftar.push({
      kunci: "artikel:" + a.slug,
      judul: "Bacaan baru di Pojok Baca",
      isi: a.judul,
      url: "/artikel/" + a.slug + "/",
      gambar: "/assets/og/artikel-" + a.slug + ".jpg",
      tag: "artikel-" + a.slug
    });
  }
  return daftar;
}

/* Dipanggil oleh Cron Trigger. Pertama kali hanya mencatat isi situs tanpa mengirim apa pun. */
export async function periksaKontenBaru(env) {
  await pastikanSkema(env.DB);
  const daftar = await kontenTayang(env);
  const dikenal = await bacaAtur(env.DB, "dikenal");
  if (!dikenal) {
    await tulisAtur(env.DB, "dikenal", daftar.map((d) => d.kunci));
    return { awal: true, jumlah: daftar.length };
  }
  const sudah = new Set(dikenal);
  const baru = daftar.filter((d) => !sudah.has(d.kunci));
  if (!baru.length) return { baru: 0 };

  let item = baru.slice(0, MAKS_KIRIM).map(({ kunci, ...sisa }) => sisa);
  if (baru.length > MAKS_KIRIM) {
    item = item.slice(0, MAKS_KIRIM - 1);
    item.push({ judul: "Rumatika bertambah " + baru.length + " konten", isi: "Lihat semua karya terbaru di Rumatika.", url: "/#semua-karya", tag: "rumatika-banyak" });
  }
  await tulisAtur(env.DB, "dikenal", [...sudah, ...baru.map((d) => d.kunci)]);
  await tulisAtur(env.DB, "terbaru", { waktu: new Date().toISOString(), item });
  return { baru: baru.length, ...(await kirimSemua(env, item)) };
}

/* ---------- alamat /api/kabar/* ---------- */
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

function langgananSah(s) {
  if (!s || typeof s.endpoint !== "string" || s.endpoint.length > 1000 || !s.keys) return false;
  let u;
  try { u = new URL(s.endpoint); } catch (e) { return false; }
  if (u.protocol !== "https:" || !LAYANAN_PUSH.some((r) => r.test(u.hostname))) return false;
  const { p256dh, auth } = s.keys;
  return typeof p256dh === "string" && /^[A-Za-z0-9_-]{80,100}$/.test(p256dh)
    && typeof auth === "string" && /^[A-Za-z0-9_-]{16,32}$/.test(auth);
}

export async function tanganiKabar(request, env, url) {
  await pastikanSkema(env.DB);
  const jalur = url.pathname;

  if (jalur === "/api/kabar/kunci" && request.method === "GET") {
    return json({ kunci: (await kunciVapid(env.DB)).publik });
  }

  if (jalur === "/api/kabar/terbaru" && request.method === "GET") {
    return json((await bacaAtur(env.DB, "terbaru")) || { item: [] });
  }

  if ((jalur === "/api/kabar/langganan" || jalur === "/api/kabar/berhenti") && request.method === "POST") {
    let s = null;
    try { s = JSON.parse(await request.text()); } catch (e) { /* abaikan */ }
    if (jalur === "/api/kabar/berhenti") {
      if (!s || typeof s.endpoint !== "string") return json({ ok: false }, 400);
      await env.DB.prepare("DELETE FROM langganan WHERE endpoint = ?1").bind(s.endpoint).run();
      return json({ ok: true });
    }
    if (!langgananSah(s)) return json({ ok: false, pesan: "Langganan tidak sah" }, 400);
    await env.DB.prepare(
      "INSERT INTO langganan (endpoint, p256dh, auth, dibuat) VALUES (?1, ?2, ?3, ?4) " +
      "ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth"
    ).bind(s.endpoint, s.keys.p256dh, s.keys.auth, new Date().toISOString().slice(0, 10)).run();
    return json({ ok: true });
  }

  return json({ ok: false, pesan: "Alamat tidak dikenal" }, 404);
}
