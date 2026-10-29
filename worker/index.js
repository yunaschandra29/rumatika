/*
  RUMATIKA — penghitung kunjungan dan permainan
  Berjalan di Cloudflare Workers, menyimpan angka di D1 (rumatika-statistik).
  Hanya menyimpan jumlah; tidak ada alamat IP atau data pribadi yang dicatat.

  POST /api/kunjungan          tambah 1 kunjungan (dikirim sekali per sesi browser)
  POST /api/main  {"id": ...}  tambah 1 permainan untuk karya tersebut
  GET  /api/statistik          baca semua angka
*/

const SKEMA = "CREATE TABLE IF NOT EXISTS hitungan (kunci TEXT PRIMARY KEY, jumlah INTEGER NOT NULL DEFAULT 0)";
const TAMBAH = "INSERT INTO hitungan (kunci, jumlah) VALUES (?1, 1) ON CONFLICT(kunci) DO UPDATE SET jumlah = jumlah + 1";

let siap = false;
let daftarId = null;
let daftarIdWaktu = 0;

async function pastikanSkema(db) {
  if (siap) return;
  await db.prepare(SKEMA).run();
  siap = true;
}

/* Tanggal hari ini menurut WIB (UTC+7). */
function hariIni() {
  return new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

/* Hanya id karya yang ada di katalog yang boleh dihitung. Daftar diperbarui tiap 10 menit. */
async function idKarya(env, url) {
  if (daftarId && Date.now() - daftarIdWaktu < 600000) return daftarId;
  try {
    const res = await env.ASSETS.fetch(new URL("/data/katalog.js", url));
    const teks = await res.text();
    const awal = teks.search(/\n\s*karya:\s*\[/);
    const akhir = teks.search(/\n\s*video:\s*\[/);
    const bagian = awal >= 0 ? teks.slice(awal, akhir > awal ? akhir : undefined) : "";
    daftarId = new Set([...bagian.matchAll(/\bid:\s*"([a-z0-9-]{1,64})"/g)].map((m) => m[1]));
    daftarIdWaktu = Date.now();
  } catch (e) {
    daftarId = daftarId || new Set();
  }
  return daftarId;
}

async function bacaStatistik(db) {
  const { results } = await db.prepare("SELECT kunci, jumlah FROM hitungan").all();
  const kunciHari = "kunjungan:" + hariIni();
  const data = { total: 0, hariIni: 0, main: {} };
  for (const r of results) {
    if (r.kunci === "kunjungan:total") data.total = r.jumlah;
    else if (r.kunci === kunciHari) data.hariIni = r.jumlah;
    else if (r.kunci.startsWith("main:")) data.main[r.kunci.slice(5)] = r.jumlah;
  }
  return data;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

    try {
      await pastikanSkema(env.DB);

      if (url.pathname === "/api/statistik" && request.method === "GET") {
        return json(await bacaStatistik(env.DB));
      }

      if (url.pathname === "/api/kunjungan" && request.method === "POST") {
        await env.DB.batch([
          env.DB.prepare(TAMBAH).bind("kunjungan:total"),
          env.DB.prepare(TAMBAH).bind("kunjungan:" + hariIni())
        ]);
        return json(await bacaStatistik(env.DB));
      }

      if (url.pathname === "/api/main" && request.method === "POST") {
        let id = "";
        try { id = String(JSON.parse(await request.text()).id || ""); } catch (e) { /* abaikan */ }
        const valid = await idKarya(env, url);
        if (!valid.has(id)) return json({ ok: false, pesan: "Karya tidak dikenal" }, 400);
        await env.DB.prepare(TAMBAH).bind("main:" + id).run();
        return json({ ok: true });
      }

      return json({ ok: false, pesan: "Alamat tidak dikenal" }, 404);
    } catch (e) {
      return json({ ok: false, pesan: "Statistik sedang tidak tersedia" }, 503);
    }
  }
};
