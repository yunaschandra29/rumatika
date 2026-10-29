#!/usr/bin/env python3
"""
RUMATIKA — pembuat halaman berbagi

Membuat, untuk setiap karya di data/katalog.js:
  - k/<id>/index.html     halaman kecil berisi tag pratinjau (judul, deskripsi, gambar)
                          yang langsung mengarahkan ke halaman karya di portal
  - assets/og/<id>.jpg    gambar pratinjau 1200 x 630 untuk WhatsApp, Facebook, dan lain-lain
serta assets/og/rumatika.jpg dan tag pratinjau beranda di index.html.

Jalankan dari folder utama proyek setiap kali katalog berubah:
    python alat/bagikan.py
Butuh Python 3 dengan Pillow dan json5:
    pip install pillow json5
"""
import html
import json5
import pathlib
import re
import shutil
from PIL import Image, ImageDraw, ImageFont

SITUS = "https://rumatika.pages.dev"   # ganti di sini jika memakai domain sendiri

AKAR = pathlib.Path(__file__).resolve().parent.parent
HURUF = AKAR / "alat" / "huruf"
W, H = 1200, 630

NAVY = (15, 30, 69)
BIRU = (37, 84, 214)
BIRU_MUDA = (201, 215, 255)
STABILO = (255, 210, 64)
PUTIH = (255, 255, 255)


def baca_katalog():
    teks = (AKAR / "data" / "katalog.js").read_text(encoding="utf-8")
    awal = teks.index("{", teks.index("RUMATIKA_KATALOG"))
    akhir = teks.rindex("}") + 1
    return json5.loads(teks[awal:akhir])


def huruf(nama, ukuran, tebal=None):
    f = ImageFont.truetype(str(HURUF / nama), ukuran)
    if tebal is not None:
        try:
            sumbu = f.get_variation_axes()
            nilai = []
            for s in sumbu:
                n = s["name"].decode() if isinstance(s["name"], bytes) else s["name"]
                if n == "Weight":
                    nilai.append(tebal)
                elif n == "Optical size":
                    nilai.append(min(s["maximum"], max(s["minimum"], ukuran)))
                else:
                    nilai.append(s["default"])
            f.set_variation_by_axes(nilai)
        except Exception:
            pass
    return f


def bungkus(draw, teks, font, lebar):
    baris, kini = [], ""
    for kata in teks.split():
        coba = (kini + " " + kata).strip()
        if draw.textlength(coba, font=font) <= lebar:
            kini = coba
        else:
            if kini:
                baris.append(kini)
            kini = kata
    if kini:
        baris.append(kini)
    return baris


def penuhi(img):
    """Potong gambar agar rasionya 1200:630, lalu ubah ukurannya."""
    w, h = img.size
    target = W / H
    if w / h > target:
        lw = round(h * target)
        img = img.crop(((w - lw) // 2, 0, (w - lw) // 2 + lw, h))
    else:
        lh = round(w / target)
        img = img.crop((0, (h - lh) // 2, w, (h - lh) // 2 + lh))
    return img.resize((W, H), Image.LANCZOS)


def logo(draw, x, y, s):
    """Rumah biru dengan tanda akar putih, setara logo situs (kotak 32 x 32)."""
    k = s / 32
    rumah = [(3, 14.5), (16, 3.5), (29, 14.5), (29, 29), (3, 29)]
    draw.polygon([(x + a * k, y + b * k) for a, b in rumah], fill=BIRU)
    akar = [(8.5, 19.5), (11.1, 19.5), (14.3, 24.7), (19.3, 13.5), (24, 13.5)]
    draw.line([(x + a * k, y + b * k) for a, b in akar], fill=PUTIH, width=max(2, round(2.4 * k)), joint="curve")


WARNA_JENIS = {"MPI": (37, 84, 214), "Gim": (11, 120, 150), "Lab Maya": (62, 68, 184)}


def sampul_rumus(k):
    """Sampul pengganti untuk karya siap main yang belum punya gambar: rumus di atas kisi."""
    img = Image.new("RGB", (W, H), WARNA_JENIS.get(k["jenis"], BIRU))
    d = ImageDraw.Draw(img, "RGBA")
    for x in range(0, W, 30):
        d.line((x, 0, x, H), fill=(255, 255, 255, 26))
    for y in range(0, H, 30):
        d.line((0, y, W, y), fill=(255, 255, 255, 26))
    d.text((W / 2, (H - 200) / 2 + 10), k["simbol"], font=huruf("PlexMono.ttf", 84), fill=PUTIH, anchor="mm")
    return img


def gambar_karya(k):
    sendiri = k.get("sampul")
    siap = bool(k.get("url"))
    if sendiri:
        # sampul buatan kreator sudah memuat judul; dipakai apa adanya
        img = penuhi(Image.open(AKAR / sendiri).convert("RGB"))
    else:
        img = sampul_rumus(k) if siap else penuhi(Image.open(AKAR / "assets/img/segera-hadir.webp").convert("RGB"))
        d = ImageDraw.Draw(img, "RGBA")
        d.rectangle((0, H - 200, W, H), fill=(10, 21, 48, 232))
        fj = huruf("Bricolage.ttf", 58, 800)
        d.text((56, H - 168), bungkus(d, k["judul"], fj, W - 112)[0], font=fj, fill=PUTIH)
        fs = huruf("Lexend.ttf", 28, 500)
        ket = "Siap dimainkan di Rumatika" if siap else "Segera hadir di Rumatika"
        d.text((56, H - 82), "{} · {} Fase {}".format(ket, k["jenis"], k["fase"]), font=fs, fill=BIRU_MUDA)
    keluar = AKAR / "assets" / "og" / (k["id"] + ".jpg")
    img.save(keluar, "JPEG", quality=84, optimize=True, progressive=True)
    return keluar


def gambar_beranda(katalog):
    img = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(img, "RGBA")
    for x in range(0, W, 30):
        d.line((x, 0, x, H), fill=(255, 255, 255, 14))
    for y in range(0, H, 30):
        d.line((0, y, W, y), fill=(255, 255, 255, 14))

    logo(d, 72, 92, 72)
    d.text((164, 128), "Rumatika", font=huruf("Bricolage.ttf", 92, 800), fill=PUTIH, anchor="lm")
    ft = huruf("Lexend.ttf", 38, 500)
    y = 222
    for b in bungkus(d, "Rumahnya matematika yang bisa dimainkan.", ft, 560):
        d.text((72, y), b, font=ft, fill=BIRU_MUDA)
        y += 52
    siap = sum(1 for k in katalog["karya"] if k.get("url"))
    fm = huruf("PlexMono.ttf", 24)
    d.text((72, 470), "MPI · GIM EDUKASI · LAB MAYA", font=fm, fill=STABILO)
    d.text((72, 508), "{} karya siap main · Fase A–F".format(siap), font=fm, fill=PUTIH)

    # denah 3 x 2 ruang fase
    x0, y0, rw, rh, dinding = 676, 150, 150, 150, 6
    d.rectangle((x0 - dinding, y0 - dinding, x0 + 3 * rw + 2 * dinding + dinding, y0 + 2 * rh + dinding + dinding), fill=PUTIH)
    fh = huruf("Bricolage.ttf", 76, 800)
    fl = huruf("PlexMono.ttf", 16)
    for i, f in enumerate(katalog["fase"]):
        c, r = i % 3, i // 3
        rx, ry = x0 + c * (rw + dinding / 2), y0 + r * (rh + dinding / 2)
        ada = any(k["fase"] == f["kode"] and k.get("url") for k in katalog["karya"])
        d.rectangle((rx, ry, rx + rw - dinding / 2, ry + rh - dinding / 2), fill=(24, 44, 98) if ada else (19, 36, 80))
        d.text((rx + 16, ry + 14), "RUANG", font=fl, fill=BIRU_MUDA)
        d.text((rx + 16, ry + 38), f["kode"], font=fh, fill=(120, 155, 255) if ada else (95, 115, 170))
    keluar = AKAR / "assets" / "og" / "rumatika.jpg"
    img.save(keluar, "JPEG", quality=86, optimize=True, progressive=True)
    return keluar


HALAMAN = """<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{judul} · Rumatika</title>
<meta name="description" content="{desk}">
<link rel="canonical" href="{situs}/k/{id}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Rumatika">
<meta property="og:locale" content="id_ID">
<meta property="og:title" content="{judul} · {jenis} Fase {fase}">
<meta property="og:description" content="{desk}">
<meta property="og:url" content="{situs}/k/{id}/">
<meta property="og:image" content="{situs}/assets/og/{id}.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0; url=../../#karya-{id}">
<script>location.replace("../../#karya-{id}");</script>
</head>
<body>
<p>Membuka <a href="../../#karya-{id}">{judul}</a> di Rumatika…</p>
</body>
</html>
"""

OG_BERANDA = """<!--OG:MULAI (dibuat otomatis oleh alat/bagikan.py; jangan diubah manual)-->
<link rel="canonical" href="{situs}/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Rumatika">
<meta property="og:locale" content="id_ID">
<meta property="og:title" content="Rumatika · Rumahnya Matematika Interaktif">
<meta property="og:description" content="MPI, gim edukasi, lab maya, dan video tips matematika untuk Fase A sampai F. Siap tayang di proyektor, ringan di HP, tanpa login.">
<meta property="og:url" content="{situs}/">
<meta property="og:image" content="{situs}/assets/og/rumatika.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<!--OG:SELESAI-->"""


def main():
    katalog = baca_katalog()
    (AKAR / "assets" / "og").mkdir(parents=True, exist_ok=True)
    folder_k = AKAR / "k"
    folder_k.mkdir(exist_ok=True)

    ids = set()
    for k in katalog["karya"]:
        ids.add(k["id"])
        gambar_karya(k)
        tujuan = folder_k / k["id"]
        tujuan.mkdir(exist_ok=True)
        (tujuan / "index.html").write_text(HALAMAN.format(
            situs=SITUS, id=k["id"], fase=k["fase"], jenis=html.escape(k["jenis"]),
            judul=html.escape(k["judul"]), desk=html.escape(k["tujuan"])), encoding="utf-8")

    # bersihkan halaman berbagi untuk karya yang sudah dihapus dari katalog
    for lama in folder_k.iterdir():
        if lama.is_dir() and lama.name not in ids:
            shutil.rmtree(lama)
            og = AKAR / "assets" / "og" / (lama.name + ".jpg")
            if og.exists():
                og.unlink()

    gambar_beranda(katalog)
    idx = AKAR / "index.html"
    teks = idx.read_text(encoding="utf-8")
    teks = re.sub(r"<!--OG:MULAI[\s\S]*?<!--OG:SELESAI-->", OG_BERANDA.format(situs=SITUS), teks)
    idx.write_text(teks, encoding="utf-8")
    print("Selesai: {} halaman berbagi di k/, gambar pratinjau di assets/og/".format(len(ids)))


if __name__ == "__main__":
    main()
