"""
Membuat rekap progres Rumatika per fase untuk dasbor "Progres Rumatika".

    python alat/progres.py

Membaca data/katalog.js (karya dan video) dan alat/rencana.json (karya yang belum
masuk katalog), lalu menulis alat/progres.json: satu baris per karya/video dengan
status "Tayang", "Segera hadir" (kartu ada, berkas belum), atau "Belum masuk situs".
Butuh Node.js untuk membaca katalog.
"""
import json, subprocess, pathlib

AKAR = pathlib.Path(__file__).resolve().parent.parent
JENJANG = {"A": "SD", "B": "SD", "C": "SD", "D": "SMP", "E": "SMA", "F": "SMA"}

def baca_katalog():
    kode = ("const fs=require('fs');const window={};"
            "eval(fs.readFileSync(process.argv[1],'utf8'));"
            "process.stdout.write(JSON.stringify(window.RUMATIKA_KATALOG));")
    keluar = subprocess.run(["node", "-e", kode, str(AKAR / "data/katalog.js")],
                            capture_output=True, text=True, check=True)
    return json.loads(keluar.stdout)

def main():
    kat = baca_katalog()
    ren = json.loads((AKAR / "alat/rencana.json").read_text(encoding="utf-8"))
    judul_asli = ren.get("judulAsli", {})
    baris = []
    for k in kat["karya"]:
        siap = bool(k.get("url"))
        baris.append({
            "id": k["id"], "fase": k["fase"], "jenjang": JENJANG.get(k["fase"], "-"),
            "jenis": k["jenis"], "judul": judul_asli.get(k["id"], k["judul"]),
            "topik": k.get("topik", ""),
            "status": "Tayang" if siap else "Segera hadir",
            "catatan": k.get("ukuran", "") if siap else "Kartu sudah ada, berkas belum dikirim",
        })
    for v in kat.get("video", []):
        tayang = v.get("status") == "tayang" and v.get("url")
        baris.append({
            "id": "video-" + v["id"], "fase": v["fase"], "jenjang": JENJANG.get(v["fase"], "-"),
            "jenis": "Video", "judul": v["judul"], "topik": v.get("ringkasan", ""),
            "status": "Tayang" if tayang else "Segera hadir",
            "catatan": "Teras Trik" if tayang else "Judul sudah ada, video belum",
        })
    for i, r in enumerate(ren.get("rencana", []), 1):
        baris.append({
            "id": "rencana-%02d" % i, "fase": r["fase"], "jenjang": JENJANG.get(r["fase"], "-"),
            "jenis": r["jenis"], "judul": r["judul"], "topik": r.get("topik", ""),
            "status": "Belum masuk situs", "catatan": r.get("catatan", "Belum dikirim ke repo"),
        })
    out = AKAR / "alat/progres.json"
    out.write_text(json.dumps(baris, ensure_ascii=False, indent=1), encoding="utf-8")
    from collections import Counter
    c = Counter((b["fase"], b["status"]) for b in baris)
    print("Ditulis", out.relative_to(AKAR), "-", len(baris), "baris")
    for f in "ABCDEF?":
        print(" Fase", f, {s: c[(f, s)] for s in ("Tayang", "Segera hadir", "Belum masuk situs") if c[(f, s)]})

if __name__ == "__main__":
    main()
