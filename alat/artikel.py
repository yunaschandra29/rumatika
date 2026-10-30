#!/usr/bin/env python3
"""
RUMATIKA — pembuat halaman Artikel

Mengubah setiap berkas tulisan/<slug>.md menjadi halaman HTML biasa (bukan alamat #),
supaya bisa dibaca mesin pencari dan peninjau AdSense. Membuat:
  - artikel/index.html            daftar semua artikel
  - artikel/<slug>/index.html     halaman satu artikel
  - assets/og/artikel-<slug>.jpg  gambar pratinjau WhatsApp
  - data/artikel.js               daftar ringkas untuk beranda dan halaman karya
  - sitemap.xml dan robots.txt    peta situs untuk Google
  - ads.txt                       hanya jika ADSENSE di bawah sudah diisi

Jalankan dari folder utama proyek setiap kali ada artikel baru atau diubah:
    python alat/artikel.py
Butuh: pip install markdown pillow json5

Berkas tulisan yang namanya diawali garis bawah (misalnya _contoh.md) dilewati.
"""
import datetime
import html
import json
import pathlib
import re
import shutil
import sys

import markdown
from PIL import Image, ImageDraw

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from bagikan import SITUS, AKAR, baca_katalog, huruf, bungkus, logo, W, H, NAVY, BIRU_MUDA, STABILO, PUTIH  # noqa: E402

# Isi dengan kode penerbit AdSense setelah disetujui, misalnya "ca-pub-1234567890123456".
# Selama kosong, tidak ada skrip iklan yang dipasang.
ADSENSE = ""

PENULIS = "Yunas Chandra Perdana, M.Pd."
PENULIS_PERAN = "Kepala Sekolah dan guru Matematika SMAIT Nurul Ilmi, pengurus MGMP Matematika SMP Kabupaten Bekasi."

TULISAN = AKAR / "tulisan"
KELUAR = AKAR / "artikel"
WAJIB = ["judul", "ringkasan", "fase", "kategori", "tanggal"]
BULAN = ["", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
         "Agustus", "September", "Oktober", "November", "Desember"]
JENIS_KELAS = {"MPI": "mpi", "Gim": "gim", "Lab Maya": "lab"}


# ---------------------------------------------------------------- membaca tulisan

def baca_tulisan(berkas):
    teks = berkas.read_text(encoding="utf-8").replace("\r\n", "\n")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", teks, re.S)
    if not m:
        raise SystemExit(f"{berkas.name}: kepala tulisan (--- ... ---) tidak ditemukan")
    meta = {}
    for baris in m.group(1).splitlines():
        if ":" in baris:
            k, v = baris.split(":", 1)
            meta[k.strip()] = v.strip()
    kurang = [k for k in WAJIB if not meta.get(k)]
    if kurang:
        raise SystemExit(f"{berkas.name}: kolom wajib belum diisi: {', '.join(kurang)}")
    meta["fase"] = meta["fase"].upper()
    meta["slug"] = berkas.stem
    meta["isi_md"] = m.group(2).strip()
    meta["tgl"] = datetime.date.fromisoformat(meta["tanggal"])
    return meta


def tanggal_tampil(t):
    return f"{t.day} {BULAN[t.month]} {t.year}"


def slug_judul(teks):
    s = re.sub(r"<[^>]+>", "", teks).lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "bagian"


def ke_html(md_teks):
    """Markdown -> HTML. Rumus $...$ dan $$...$$ diamankan dulu agar tidak diubah Markdown,
    lalu dirender di browser oleh KaTeX (assets/vendor/katex)."""
    rumus = []

    def simpan(m, blok):
        rumus.append((m.group(0), blok))
        return f"RMTKRUMUS{len(rumus) - 1}X"

    md_teks = re.sub(r"\$\$(.+?)\$\$", lambda m: simpan(m, True), md_teks, flags=re.S)
    md_teks = re.sub(r"(?<![\\$])\$(?!\s)([^$\n]+?)(?<!\s)\$", lambda m: simpan(m, False), md_teks)

    isi = markdown.markdown(md_teks, extensions=["sane_lists", "tables"], output_format="html")

    daftar = []
    pakai = set()

    def judul_bagian(m):
        teks = m.group(1)
        s = slug_judul(teks)
        while s in pakai:
            s += "-2"
        pakai.add(s)
        daftar.append((s, re.sub(r"<[^>]+>", "", teks)))
        return f'<h2 id="{s}">{teks}</h2>'

    isi = re.sub(r"<h2>(.*?)</h2>", judul_bagian, isi)

    def pulihkan(m):
        asli, blok = rumus[int(m.group(1))]
        return html.escape(asli, quote=False)

    isi = re.sub(r"<p>RMTKRUMUS(\d+)X</p>",
                 lambda m: '<div class="rumus-blok">' + pulihkan(m) + "</div>"
                 if rumus[int(m.group(1))][1] else "<p>" + pulihkan(m) + "</p>", isi)
    isi = re.sub(r"RMTKRUMUS(\d+)X", pulihkan, isi)
    isi = isi.replace("<table>", '<div class="tabel-gulir"><table>').replace("</table>", "</table></div>")
    return isi, daftar, bool(rumus)


def menit_baca(md_teks):
    kata = len(re.findall(r"[A-Za-zÀ-ÿ0-9]+", re.sub(r"\$[^$]*\$", " ", md_teks)))
    return max(1, round(kata / 200))


# ---------------------------------------------------------------- potongan halaman

E = html.escape

LOGO = ('<svg class="merek-logo" viewBox="0 0 32 32" aria-hidden="true">'
        '<path d="M3 14.5 16 3.5l13 11V29H3z" class="logo-rumah"/>'
        '<path d="M8.5 19.5h2.6l3.2 5.2 5-11.2h4.7" class="logo-akar"/></svg>')

MENU = [("Beranda", "#beranda"), ("Semua Karya", "#semua-karya"), ("Teras Trik", "#teras-trik"),
        ("Pojok Baca", "artikel/"), ("Panduan Guru", "#panduan-guru"), ("Tentang", "#tentang"), ("Kontak", "#kontak")]


def kepala_html(p, judul, desk, kanonik, og_gambar, rumus, jenis_og="article", tambahan=""):
    iklan = (f'<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={E(ADSENSE)}" '
             'crossorigin="anonymous"></script>\n') if ADSENSE else ""
    katex = (f'<link rel="stylesheet" href="{p}assets/vendor/katex/katex.min.css">\n'
             f'<script defer src="{p}assets/vendor/katex/katex.min.js"></script>\n'
             f'<script defer src="{p}assets/vendor/katex/auto-render.min.js"></script>\n'
             '<script>document.addEventListener("DOMContentLoaded",function(){if(window.renderMathInElement)'
             'renderMathInElement(document.querySelector(".prosa"),{delimiters:[{left:"$$",right:"$$",display:true},'
             '{left:"$",right:"$",display:false}],throwOnError:false});});</script>\n') if rumus else ""
    return f"""<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(judul)}</title>
<meta name="description" content="{E(desk)}">
<link rel="canonical" href="{kanonik}">
<meta property="og:type" content="{jenis_og}">
<meta property="og:site_name" content="Rumatika">
<meta property="og:locale" content="id_ID">
<meta property="og:title" content="{E(judul)}">
<meta property="og:description" content="{E(desk)}">
<meta property="og:url" content="{kanonik}">
<meta property="og:image" content="{og_gambar}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
{tambahan}<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500&family=Lexend:wght@400;500;600&display=swap">
<link rel="stylesheet" href="{p}assets/site.css">
{katex}{iklan}</head>
<body>

<header class="kepala">
  <div class="wrap kepala-isi">
    <a class="merek" href="{p}#beranda" aria-label="Rumatika, ke beranda">{LOGO}<span>Rumatika</span></a>
    <nav class="menu" aria-label="Menu utama">
""" + "".join(
        '      <a href="{}{}"{}>{}</a>\n'.format(p, h, ' aria-current="page"' if n == "Pojok Baca" else "", n) for n, h in MENU
    ) + """    </nav>
  </div>
</header>
<script>(function(){var m=document.querySelector(".menu"),a=m&&m.querySelector("[aria-current]");if(a&&m.scrollWidth>m.clientWidth)m.scrollLeft=a.offsetLeft-(m.clientWidth-a.offsetWidth)/2;})();</script>

<main id="isi">
"""


def kaki_html(p, kontak, teks_wa):
    wa = ""
    if kontak.get("wa"):
        from urllib.parse import quote
        wa = (f'<a class="wa-melayang" href="https://wa.me/{E(kontak["wa"])}?text={quote(teks_wa)}" target="_blank" rel="noopener" '
              'aria-label="Chat WhatsApp dengan kreator Rumatika">'
              '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.6 18.6z"/>'
              '<path d="M9 10.5h6M9 13.5h4"/></svg><span>Tanya via WA</span></a>\n')
    tahun = datetime.date.today().year
    return f"""</main>

<footer class="kaki">
  <div class="wrap kaki-isi">
    <div>
      <a class="merek" href="{p}#beranda">{LOGO}<span>Rumatika</span></a>
      <p class="kecil">Rumahnya Matematika Interaktif</p>
    </div>
    <nav class="kaki-menu" aria-label="Menu bawah">
      <a href="{p}#semua-karya">Semua Karya</a>
      <a href="{p}#teras-trik">Teras Trik</a>
      <a href="{p}artikel/">Pojok Baca</a>
      <a href="{p}#panduan-guru">Panduan Guru</a>
      <a href="{p}#tentang">Tentang</a>
      <a href="{p}#kontak">Kontak</a>
    </nav>
    <p class="kecil kaki-hak">© {tahun} Rumatika · {E(PENULIS)} · Dibangun dengan NI Engine</p>
  </div>
</footer>

{wa}</body>
</html>
"""


def info_fase(katalog, kode):
    f = next((x for x in katalog["fase"] if x["kode"] == kode), None)
    return f"Fase {kode}" + (f" · {f['jenjang']} {f['kelas']}" if f else "")


def kartu_artikel(a, p, href):
    k = a.get("_karya")
    jenis = JENIS_KELAS.get(k["jenis"], "mpi") if k else "mpi"
    sampul = (k.get("sampul") if k else "") or ""
    gambar = f'<img class="sampul-gambar" src="{p}{E(sampul)}" alt="" loading="lazy" onerror="this.remove()">' if sampul else ""
    return (f'<a class="kartu kartu-artikel" href="{href}" data-fase="{E(a["fase"])}" data-kategori="{E(a["kategori"])}">'
            f'<div class="sampul" data-jenis="{jenis}"><span class="sampul-rumus">{E(a.get("simbol") or a["judul"])}</span>{gambar}'
            f'<span class="label-segera">Artikel</span></div>'
            f'<div class="kartu-isi"><div class="chip-baris"><span class="chip">{E(a["kategori"])}</span>'
            f'<span class="chip">Fase {E(a["fase"])}</span></div>'
            f'<h3>{E(a["judul"])}</h3><p>{E(a["ringkasan"])}</p>'
            f'<div class="kartu-kaki"><span>{tanggal_tampil(a["tgl"])}</span><span>{a["menit"]} menit baca</span></div>'
            f'</div></a>')


# ---------------------------------------------------------------- halaman

def halaman_artikel(a, semua, katalog):
    p = "../../"
    kanonik = f"{SITUS}/artikel/{a['slug']}/"
    k = a.get("_karya")

    samping = ""
    if k:
        jenis = JENIS_KELAS.get(k["jenis"], "mpi")
        siap = bool(k.get("url"))
        segera = "" if siap else '<span class="label-segera">Segera hadir</span>'
        gambar = (f'<img class="sampul-gambar" src="{p}{E(k["sampul"])}" alt="" loading="lazy" onerror="this.remove()">'
                  if k.get("sampul") else "")
        samping += (f'<div class="samping-kotak"><p class="alis">Coba karyanya</p>'
                    f'<a class="samping-karya" href="{p}#karya-{E(k["id"])}">'
                    f'<div class="sampul" data-jenis="{jenis}"><span class="sampul-rumus">{E(k["simbol"])}</span>{gambar}'
                    f'{segera}</div>'
                    f'<b>{E(k["judul"])}</b><span>{E(k["jenis"])} · Fase {E(k["fase"])} · {E(k["topik"])}</span></a>'
                    f'<a class="tombol tombol-utama" href="{p}#karya-{E(k["id"])}">{"Buka karya" if siap else "Lihat karya"}</a></div>')
    if len(a["daftar"]) >= 3:
        samping += ('<nav class="samping-kotak daftar-isi" aria-label="Isi artikel"><p class="alis">Isi artikel</p><ol>' +
                    "".join(f'<li><a href="#{s}">{E(t)}</a></li>' for s, t in a["daftar"]) + "</ol></nav>")

    lain = [x for x in semua if x["slug"] != a["slug"]]
    lain.sort(key=lambda x: (x["fase"] != a["fase"], x["kategori"] != a["kategori"], -x["tgl"].toordinal()))
    lain = lain[:3]

    data_terstruktur = json.dumps({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": a["judul"],
        "description": a["ringkasan"],
        "datePublished": a["tgl"].isoformat(),
        "dateModified": a.get("diperbarui") or a["tgl"].isoformat(),
        "inLanguage": "id",
        "author": {"@type": "Person", "name": PENULIS},
        "publisher": {"@type": "Organization", "name": "Rumatika"},
        "image": f"{SITUS}/assets/og/artikel-{a['slug']}.jpg",
        "mainEntityOfPage": kanonik,
    }, ensure_ascii=False)

    teks = kepala_html(p, f"{a['judul']} · Rumatika", a["ringkasan"], kanonik,
                       f"{SITUS}/assets/og/artikel-{a['slug']}.jpg", a["rumus"],
                       tambahan=f'<meta property="article:published_time" content="{a["tgl"].isoformat()}">\n'
                                f'<script type="application/ld+json">{data_terstruktur}</script>\n')
    teks += f"""
  <div class="kepala-halaman">
    <div class="wrap artikel-kepala">
      <nav class="remah" aria-label="Posisi halaman"><a href="{p}#beranda">Beranda</a><span aria-hidden="true">/</span><a href="../">Pojok Baca</a><span aria-hidden="true">/</span><span>{E(info_fase(katalog, a['fase']).split(' · ')[0])}</span></nav>
      <div class="chip-baris"><span class="chip">{E(a['kategori'])}</span><span class="chip">{E(info_fase(katalog, a['fase']))}</span></div>
      <h1 class="judul-halaman">{E(a['judul'])}</h1>
      <p class="lead">{E(a['ringkasan'])}</p>
      <p class="artikel-byline">Oleh <b>{E(PENULIS)}</b><span aria-hidden="true">·</span><time datetime="{a['tgl'].isoformat()}">{tanggal_tampil(a['tgl'])}</time><span aria-hidden="true">·</span>{a['menit']} menit baca</p>
    </div>
  </div>

  <div class="wrap isi-halaman artikel-tata{'' if samping else ' tanpa-samping'}">
    <article class="prosa">
{a['isi']}
    </article>
    {f'<aside class="artikel-samping">{samping}</aside>' if samping else ''}
  </div>

  <div class="wrap artikel-bawah">
    <aside class="kreator penulis">
      <p class="alis">Penulis</p>
      <h2>{E(PENULIS)}</h2>
      <p class="kecil">{E(PENULIS_PERAN)}</p>
      <div class="kreator-tautan">
        <a class="tombol tombol-garis" href="{p}#kontak">Undang sebagai narasumber</a>
        <a class="tombol tombol-garis" href="https://www.youtube.com/@yunascp" target="_blank" rel="noopener">YouTube @yunascp</a>
      </div>
    </aside>
"""
    if lain:
        teks += ('    <div class="karya-lain"><div class="bagian-kepala"><div><p class="alis">Baca juga</p><h2>Artikel lainnya</h2></div>'
                 '<a class="tautan-panah" href="../">Ke Pojok Baca →</a></div>'
                 '<div class="grid-kartu grid-artikel">' +
                 "".join(kartu_artikel(x, p, f"../{x['slug']}/") for x in lain) + "</div></div>\n")
    teks += "  </div>\n"
    sapa = katalog["kontak"].get("nama", "Pak Yunas")
    teks += kaki_html(p, katalog["kontak"], f'Halo {sapa}, saya membaca artikel Rumatika "{a["judul"]}" dan ingin bertanya: ')
    return teks


def halaman_daftar(semua, katalog):
    p = "../"
    kategori = sorted({a["kategori"] for a in semua})
    fase = sorted({a["fase"] for a in semua})
    pil = lambda attr, nilai, label, aktif: (f'<button class="pil" type="button" {attr}="{E(nilai)}" '
                                            f'aria-pressed="{"true" if aktif else "false"}">{E(label)}</button>')
    teks = kepala_html(p, "Pojok Baca · Rumatika",
                       "Pojok Baca Rumatika: artikel matematika berisi penjelasan konsep untuk siswa dan tips mengajar untuk guru, Fase A sampai F.",
                       f"{SITUS}/artikel/", f"{SITUS}/assets/og/rumatika.jpg", False, jenis_og="website")
    teks += f"""
  <div class="kepala-halaman">
    <div class="wrap">
      <p class="alis">Pojok Baca</p>
      <h1 class="judul-halaman">Bacaan singkat untuk guru dan siswa</h1>
      <p class="lead">Penjelasan konsep yang bisa dibaca siswa, dan tips mengajar dari kelas yang sebenarnya. Setiap artikel menautkan ke karya Rumatika untuk latihan lanjutan.</p>
    </div>
  </div>

  <div class="wrap isi-halaman">
    <div class="saring" id="saring-artikel">
      <div class="saring-baris" role="group" aria-label="Saring kategori"><span class="saring-label">Kategori</span>{pil("data-kategori", "Semua", "Semua", True)}{"".join(pil("data-kategori", k, k, False) for k in kategori)}</div>
      <div class="saring-baris" role="group" aria-label="Saring fase"><span class="saring-label">Fase</span>{pil("data-fase", "Semua", "Semua", True)}{"".join(pil("data-fase", f, f, False) for f in fase)}</div>
    </div>
    <p class="hasil-hitung" id="hasil-artikel" aria-live="polite">{len(semua)} artikel</p>
    <div class="grid-kartu grid-artikel" id="grid-artikel">
{"".join(kartu_artikel(a, p, a["slug"] + "/") for a in semua)}
    </div>
    <div class="kosong" id="kosong-artikel" hidden>
      <h3>Belum ada artikel yang cocok</h3>
      <p>Pilih "Semua" pada salah satu saringan.</p>
    </div>
  </div>

<script>
(function () {{
  var pilihan = {{ kategori: "Semua", fase: "Semua" }};
  var kartu = [].slice.call(document.querySelectorAll("#grid-artikel .kartu"));
  document.getElementById("saring-artikel").addEventListener("click", function (e) {{
    var b = e.target.closest("button.pil");
    if (!b) return;
    var jenis = b.hasAttribute("data-kategori") ? "kategori" : "fase";
    pilihan[jenis] = b.getAttribute("data-" + jenis);
    [].forEach.call(b.parentNode.querySelectorAll("button.pil"), function (x) {{ x.setAttribute("aria-pressed", x === b ? "true" : "false"); }});
    var n = 0;
    kartu.forEach(function (k) {{
      var ok = (pilihan.kategori === "Semua" || k.getAttribute("data-kategori") === pilihan.kategori) &&
               (pilihan.fase === "Semua" || k.getAttribute("data-fase") === pilihan.fase);
      k.hidden = !ok;
      if (ok) n++;
    }});
    document.getElementById("hasil-artikel").textContent = n + " artikel";
    document.getElementById("kosong-artikel").hidden = n > 0;
  }});
}})();
</script>
"""
    sapa = katalog["kontak"].get("nama", "Pak Yunas")
    teks += kaki_html(p, katalog["kontak"], f"Halo {sapa}, saya membaca artikel di Rumatika dan ingin bertanya: ")
    return teks


# ---------------------------------------------------------------- gambar pratinjau

def gambar_artikel(a, katalog):
    img = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(img, "RGBA")
    for x in range(0, W, 30):
        d.line((x, 0, x, H), fill=(255, 255, 255, 14))
    for y in range(0, H, 30):
        d.line((0, y, W, y), fill=(255, 255, 255, 14))
    logo(d, 64, 58, 48)
    d.text((124, 82), "Rumatika", font=huruf("Bricolage.ttf", 44, 800), fill=PUTIH, anchor="lm")
    fm = huruf("PlexMono.ttf", 24)
    d.text((64, 150), f"ARTIKEL · {a['kategori'].upper()} · FASE {a['fase']}", font=fm, fill=STABILO)
    ukuran = 64
    while True:
        fj = huruf("Bricolage.ttf", ukuran, 800)
        baris = bungkus(d, a["judul"], fj, W - 128)
        if len(baris) <= 4 or ukuran <= 44:
            break
        ukuran -= 4
    y = 198
    for b in baris[:4]:
        d.text((64, y), b, font=fj, fill=PUTIH)
        y += round(ukuran * 1.12)
    fs = huruf("Lexend.ttf", 26, 500)
    d.text((64, H - 70), f"{PENULIS} · {a['menit']} menit baca", font=fs, fill=BIRU_MUDA)
    img.save(AKAR / "assets" / "og" / f"artikel-{a['slug']}.jpg", "JPEG", quality=84, optimize=True, progressive=True)


# ---------------------------------------------------------------- utama

def main():
    katalog = baca_katalog()
    karya = {k["id"]: k for k in katalog["karya"]}
    berkas = sorted(b for b in TULISAN.glob("*.md") if not b.name.startswith("_"))
    semua = []
    for b in berkas:
        a = baca_tulisan(b)
        if a["tgl"] > datetime.date.today() + datetime.timedelta(days=1):
            print(f"Dilewati (dijadwalkan {a['tanggal']}): {b.name}")
            continue
        if a.get("karya") and a["karya"] not in karya:
            raise SystemExit(f"{b.name}: karya '{a['karya']}' tidak ada di data/katalog.js")
        a["_karya"] = karya.get(a.get("karya", ""))
        a["isi"], a["daftar"], a["rumus"] = ke_html(a["isi_md"])
        a["menit"] = menit_baca(a["isi_md"])
        semua.append(a)
    semua.sort(key=lambda a: (a["tgl"], a["slug"]), reverse=True)

    KELUAR.mkdir(exist_ok=True)
    (AKAR / "assets" / "og").mkdir(parents=True, exist_ok=True)
    ada = set()
    for a in semua:
        ada.add(a["slug"])
        folder = KELUAR / a["slug"]
        folder.mkdir(exist_ok=True)
        (folder / "index.html").write_text(halaman_artikel(a, semua, katalog), encoding="utf-8")
        gambar_artikel(a, katalog)
    for lama in KELUAR.iterdir():
        if lama.is_dir() and lama.name not in ada:
            shutil.rmtree(lama)
            og = AKAR / "assets" / "og" / f"artikel-{lama.name}.jpg"
            if og.exists():
                og.unlink()
    (KELUAR / "index.html").write_text(halaman_daftar(semua, katalog), encoding="utf-8")

    ringkas = [{
        "slug": a["slug"], "judul": a["judul"], "ringkasan": a["ringkasan"], "fase": a["fase"],
        "kategori": a["kategori"], "karya": a.get("karya", ""), "simbol": a.get("simbol", ""),
        "tanggal": a["tgl"].isoformat(), "tanggalTampil": tanggal_tampil(a["tgl"]), "menit": a["menit"],
    } for a in semua]
    (AKAR / "data" / "artikel.js").write_text(
        "/* DAFTAR ARTIKEL — dibuat otomatis oleh alat/artikel.py dari folder tulisan/. Jangan diubah manual. */\n"
        "window.RUMATIKA_ARTIKEL = " + json.dumps(ringkas, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")

    terbaru = semua[0]["tgl"].isoformat() if semua else datetime.date.today().isoformat()
    url = [(f"{SITUS}/", terbaru), (f"{SITUS}/artikel/", terbaru)]
    url += [(f"{SITUS}/artikel/{a['slug']}/", a.get("diperbarui") or a["tgl"].isoformat()) for a in semua]
    (AKAR / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        "".join(f"  <url><loc>{E(u)}</loc><lastmod>{t}</lastmod></url>\n" for u, t in url) +
        "</urlset>\n", encoding="utf-8")
    (AKAR / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {SITUS}/sitemap.xml\n", encoding="utf-8")
    ads = AKAR / "ads.txt"
    if ADSENSE:
        ads.write_text(f"google.com, {ADSENSE.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n", encoding="utf-8")
    elif ads.exists():
        ads.unlink()

    print(f"Selesai: {len(semua)} artikel di artikel/, data/artikel.js, sitemap.xml, robots.txt")


if __name__ == "__main__":
    main()
