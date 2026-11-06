"""Merakit Konsultan Muda v2 menjadi satu berkas HTML.

    python rakit.py [keluaran.html]

Gambar dibaca dari aset/bg (bg_<kunci>.*) dan aset/sp (sp_<tokoh>_<pose>.*), musik dari aset/audio (musik_<kunci>.mp3).
Latar diubah ke 1280×720 JPEG. Sprite berlatar hijau #00FF00 dibuat transparan, dipotong, lalu disimpan WebP tinggi 760 px.
Aset yang belum ada otomatis memakai ilustrasi pengganti di dalam gim.
"""
import base64, io, json, pathlib, sys
import numpy as np
from PIL import Image

AKAR = pathlib.Path(__file__).parent
SRC = AKAR / "src"

def b64(data, mime):
    return f"data:{mime};base64," + base64.b64encode(data).decode()

def latar(p):
    im = Image.open(p).convert("RGB")
    W, H = 1280, 720
    r = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    x, y = (im.width - W) // 2, (im.height - H) // 2
    im = im.crop((x, y, x + W, y + H))
    buf = io.BytesIO(); im.save(buf, "JPEG", quality=80, optimize=True, progressive=True)
    return b64(buf.getvalue(), "image/jpeg")

def sprite(p):
    im = Image.open(p).convert("RGBA")
    a = np.array(im).astype(np.int16)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    if al.min() > 250:                       # belum transparan: buang hijau
        hijau = (g > 90) & (g > r * 1.25) & (g > b * 1.25)
        tepi = (g > r * 1.05) & (g > b * 1.05) & ~hijau
        al = np.where(hijau, 0, 255)
        g = np.where(tepi | hijau, np.minimum(g, np.maximum(r, b)), g)   # hilangkan pantulan hijau di tepi
        a[..., 1] = g; a[..., 3] = al
    im = Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
    bbox = im.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()
    if bbox: im = im.crop(bbox)
    H = 760
    if im.height > H:
        im = im.resize((round(im.width * H / im.height), H), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, "WEBP", quality=82, method=6)
    return b64(buf.getvalue(), "image/webp")

def cari(folder, nama):
    for ext in (".png", ".webp", ".jpg", ".jpeg"):
        f = AKAR / "aset" / folder / (nama + ext)
        if f.exists(): return f
    return None

def main():
    daf = json.loads((AKAR / "aset.json").read_text(encoding="utf-8"))
    ASSET = {"bg": {}, "sp": {}, "mus": {}}
    for a in daf["aset"]:
        f = cari(a["jenis"], a["berkas"].rsplit(".", 1)[0])
        if not f: continue
        ASSET[a["jenis"]][a["k"]] = latar(f) if a["jenis"] == "bg" else sprite(f)
    for k in daf["musik"]:
        f = AKAR / "aset" / "audio" / f"musik_{k}.mp3"
        if f.exists(): ASSET["mus"][k] = b64(f.read_bytes(), "audio/mpeg")
    css = (SRC / "gaya1.css").read_text(encoding="utf-8") + (SRC / "gaya2.css").read_text(encoding="utf-8")
    js = ("var ASSET=" + json.dumps(ASSET) + ";\nvar ASETDAF=" + json.dumps(daf, ensure_ascii=False) + ";\n" +
          "\n".join((SRC / n).read_text(encoding="utf-8") for n in
                    ["naskah.js", "audio.js", "mesin1.js", "interaksi.js", "utama.js"]))
    html = ('<!DOCTYPE html>\n<html lang="id">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            '<title>Konsultan Muda — Klinik Usaha</title>\n<style>\n' + css + '\n</style>\n</head>\n<body>\n' +
            (SRC / "kerangka.html").read_text(encoding="utf-8") + '\n<script>\n"use strict";\n' + js + '\n</script>\n</body>\n</html>\n')
    out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else AKAR / "out" / "index.html"
    out.write_text(html, encoding="utf-8")
    n = {k: len(v) for k, v in ASSET.items()}
    print(f"{out} · {len(html.encode())/1048576:.2f} MB · latar {n['bg']}, sprite {n['sp']}, musik {n['mus']} dari {len(daf['aset'])} gambar")

if __name__ == "__main__":
    main()
