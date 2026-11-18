#!/usr/bin/env python3
"""
RUMATIKA — penyusun katalog

Sumber isi situs ada di data/konten/ (diubah lewat halaman /admin atau langsung):
  - karya.json        daftar karya (Kamar Belajar, Kamar Main, Laboratorium)
  - teras-trik.json   daftar video Teras Trik
  - umum.json         kontak Founder dan keterangan fase

Skrip ini:
  1. Memindahkan berkas yang diunggah lewat /admin (folder unggah/) ke tempatnya:
       - berkas karya (.html atau .zip berisi index.html) -> karya/fase-x/<id>/
       - sampul (gambar apa saja)                        -> assets/img/<id>.webp (16:9, lebar 960)
       - berkas perangkat ajar                           -> karya/fase-x/<id>/perangkat/
     lalu mengisi url, ukuran, dan format secara otomatis.
  2. Memeriksa isian (id unik, fase, jenis, status video).
  3. Menulis data/katalog.js yang dibaca situs.

Jalankan dari folder utama proyek:
    python alat/katalog.py
Butuh Python 3 dengan Pillow:
    pip install pillow
"""
import json
import pathlib
import re
import shutil
import sys
import zipfile

from PIL import Image

AKAR = pathlib.Path(__file__).resolve().parent.parent
KONTEN = AKAR / "data" / "konten"
UNGGAH = "unggah/"

FASE = {"A", "B", "C", "D", "E", "F"}
JENIS = {"MPI", "Gim", "Lab Maya"}
STATUS_VIDEO = {"tayang", "segera"}
POLA_ID = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")

KEPALA = """/*
  KATALOG RUMATIKA — DIBUAT OTOMATIS, JANGAN DIUBAH MANUAL.
  Ubah isinya lewat halaman /admin, atau edit berkas di data/konten/ lalu jalankan
  python alat/katalog.py
*/
"""

galat = []


def baca(nama):
    return json.loads((KONTEN / nama).read_text(encoding="utf-8"))


def tulis(nama, data):
    (KONTEN / nama).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def ukuran_tampil(byte):
    kb = byte / 1024
    if kb < 1000:
        return f"{max(1, round(kb))} KB"
    mb = kb / 1024
    teks = f"{mb:.1f}".replace(".", ",")
    return teks[:-2] + " MB" if teks.endswith(",0") else teks + " MB"


def ukuran_folder(folder):
    return sum(p.stat().st_size for p in folder.rglob("*") if p.is_file() and "perangkat" not in p.relative_to(folder).parts)


def jalur_unggah(nilai):
    """Mengembalikan Path berkas unggahan jika nilai menunjuk ke folder unggah/, selain itu None."""
    if not isinstance(nilai, str):
        return None
    n = nilai.strip().lstrip("/")
    if not n.startswith(UNGGAH):
        return None
    p = AKAR / n
    if not p.is_file():
        galat.append(f"berkas unggahan tidak ditemukan: {n}")
        return None
    return p


def angka_jika_bisa(nilai):
    if isinstance(nilai, str) and nilai.strip().isdigit():
        return int(nilai.strip())
    return nilai


def pasang_karya(k, sumber):
    folder = AKAR / "karya" / f"fase-{k['fase'].lower()}" / k["id"]
    folder.mkdir(parents=True, exist_ok=True)
    if sumber.suffix.lower() == ".zip":
        with zipfile.ZipFile(sumber) as z:
            nama = [n for n in z.namelist() if not n.endswith("/")]
            # buang folder pembungkus jika semua isi ada di satu folder
            awalan = ""
            bagian = {n.split("/", 1)[0] for n in nama}
            if len(bagian) == 1 and all("/" in n for n in nama):
                awalan = bagian.pop() + "/"
            if awalan + "index.html" not in nama:
                galat.append(f"karya '{k['id']}': berkas zip harus berisi index.html")
                return
            for n in nama:
                rel = n[len(awalan):]
                if not rel or rel.startswith("perangkat/") or ".." in pathlib.PurePosixPath(rel).parts:
                    continue
                tujuan = folder / rel
                tujuan.parent.mkdir(parents=True, exist_ok=True)
                tujuan.write_bytes(z.read(n))
    elif sumber.suffix.lower() in (".html", ".htm"):
        shutil.copyfile(sumber, folder / "index.html")
    else:
        galat.append(f"karya '{k['id']}': berkas karya harus .html atau .zip ({sumber.name})")
        return
    sumber.unlink()
    k["url"] = f"karya/fase-{k['fase'].lower()}/{k['id']}/"
    k["ukuran"] = ukuran_tampil(ukuran_folder(folder))
    print(f"  karya dipasang: {k['url']} ({k['ukuran']})")


def pasang_sampul(k, sumber):
    tujuan = AKAR / "assets" / "img" / f"{k['id']}.webp"
    try:
        img = Image.open(sumber).convert("RGB")
    except Exception:
        galat.append(f"karya '{k['id']}': sampul bukan gambar yang bisa dibaca ({sumber.name})")
        return
    w, h = img.size
    # potong ke 16:9 dari tengah
    if w / h > 16 / 9:
        baru = round(h * 16 / 9)
        img = img.crop(((w - baru) // 2, 0, (w - baru) // 2 + baru, h))
    else:
        baru = round(w * 9 / 16)
        img = img.crop((0, (h - baru) // 2, w, (h - baru) // 2 + baru))
    img = img.resize((960, 540), Image.LANCZOS)
    tujuan.parent.mkdir(parents=True, exist_ok=True)
    img.save(tujuan, "WEBP", quality=78, method=6)
    sumber.unlink()
    k["sampul"] = f"assets/img/{k['id']}.webp"
    print(f"  sampul dipasang: {k['sampul']}")


def pasang_perangkat(k, b, sumber):
    folder = AKAR / "karya" / f"fase-{k['fase'].lower()}" / k["id"] / "perangkat"
    folder.mkdir(parents=True, exist_ok=True)
    nama = re.sub(r"[^A-Za-z0-9._-]+", "-", sumber.name).strip("-")
    tujuan = folder / nama
    shutil.move(str(sumber), tujuan)
    b["berkas"] = str(tujuan.relative_to(AKAR)).replace("\\", "/")
    b["format"] = tujuan.suffix.lstrip(".").upper() or b.get("format", "")
    b["ukuran"] = ukuran_tampil(tujuan.stat().st_size)
    print(f"  perangkat ajar dipasang: {b['berkas']}")


def olah_karya(daftar):
    ids = set()
    for i, k in enumerate(daftar):
        label = k.get("id") or f"#{i + 1}"
        awal = len(galat)
        for kolom in ("id", "judul", "fase", "jenis"):
            if not str(k.get(kolom) or "").strip():
                galat.append(f"karya {label}: kolom '{kolom}' wajib diisi")
        if len(galat) > awal:
            continue
        k["id"] = k["id"].strip()
        if not POLA_ID.match(k["id"]):
            galat.append(f"karya '{k['id']}': id hanya boleh huruf kecil, angka, dan tanda hubung")
        if k["id"] in ids:
            galat.append(f"karya '{k['id']}': id dipakai lebih dari sekali")
        ids.add(k["id"])
        if k.get("fase") not in FASE:
            galat.append(f"karya '{k['id']}': fase harus A–F")
        if k.get("jenis") not in JENIS:
            galat.append(f"karya '{k['id']}': jenis harus MPI, Gim, atau Lab Maya")
    return ids


def pasang_unggahan(daftar):
    for k in daftar:
        k["durasi"] = angka_jika_bisa(k.get("durasi", ""))
        for kolom in ("topik", "tujuan", "perangkat", "simbol", "url", "video"):
            k[kolom] = k.get(kolom) or ""

        s = jalur_unggah(k.pop("berkasKarya", None))
        if s:
            pasang_karya(k, s)
        s = jalur_unggah(k.get("sampul"))
        if s:
            pasang_sampul(k, s)
        if not k.get("sampul"):
            k.pop("sampul", None)
        if not k.get("ukuran"):
            k.pop("ukuran", None)

        pa = [b for b in (k.get("perangkatAjar") or []) if b and (b.get("nama") or b.get("berkas"))]
        for b in pa:
            s = jalur_unggah(b.get("berkas"))
            if s:
                pasang_perangkat(k, b, s)
            for kolom in ("nama", "ket", "format", "ukuran", "berkas"):
                b[kolom] = b.get(kolom) or ""
        if pa:
            k["perangkatAjar"] = pa
        else:
            k.pop("perangkatAjar", None)


def olah_video(daftar, ids_karya):
    ids = set()
    for i, v in enumerate(daftar):
        label = v.get("id") or f"#{i + 1}"
        for kolom in ("id", "judul", "fase"):
            if not str(v.get(kolom) or "").strip():
                galat.append(f"video {label}: kolom '{kolom}' wajib diisi")
        vid = str(v.get("id") or "").strip()
        if vid and not POLA_ID.match(vid):
            galat.append(f"video '{vid}': id hanya boleh huruf kecil, angka, dan tanda hubung")
        if vid in ids:
            galat.append(f"video '{vid}': id dipakai lebih dari sekali")
        ids.add(vid)
        if v.get("fase") and v["fase"] not in FASE:
            galat.append(f"video '{vid}': fase harus A–F")
        v["status"] = v.get("status") or "segera"
        if v["status"] not in STATUS_VIDEO:
            galat.append(f"video '{vid}': status harus 'tayang' atau 'segera'")
        v["karya"] = v.get("karya") or ""
        if v["karya"] and v["karya"] not in ids_karya:
            galat.append(f"video '{vid}': karya '{v['karya']}' tidak ada di daftar karya")
        for kolom in ("simbol", "ringkas", "url"):
            v[kolom] = v.get(kolom) or ""
        if v.get("detik") in ("", None):
            v.pop("detik", None)
        else:
            v["detik"] = angka_jika_bisa(v["detik"])


def gagal():
    print("Katalog TIDAK diperbarui. Perbaiki isian berikut:", file=sys.stderr)
    for g in galat:
        print("  - " + g, file=sys.stderr)
    sys.exit(1)


def main():
    umum = baca("umum.json")
    karya = baca("karya.json")
    video = baca("teras-trik.json")

    ids = olah_karya(karya["karya"])
    olah_video(video["video"], ids)
    if galat:
        gagal()

    # berkas unggahan baru dipindahkan setelah semua isian dinyatakan benar
    pasang_unggahan(karya["karya"])
    tulis("karya.json", karya)
    tulis("teras-trik.json", video)
    if galat:
        gagal()

    katalog = {"kontak": umum["kontak"], "fase": umum["fase"], "karya": karya["karya"], "video": video["video"]}
    (AKAR / "data" / "katalog.js").write_text(
        KEPALA + "window.RUMATIKA_KATALOG = " + json.dumps(katalog, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8")
    print(f"Selesai: {len(karya['karya'])} karya dan {len(video['video'])} video di data/katalog.js")


if __name__ == "__main__":
    main()
