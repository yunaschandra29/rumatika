"""Mengeluarkan gambar dan musik dari gim jadi agar bisa dirakit ulang.

    python alat/konsultan-muda/urai.py

Membaca karya/fase-e/konsultan-muda/index.html lalu menulis aset/bg (JPEG), aset/sp (WebP transparan),
dan aset/audio (MP3) di folder ini. Setelah itu rakit.py bisa dijalankan lagi tanpa gambar asli.
"""
import base64, json, pathlib, re
AKAR = pathlib.Path(__file__).parent
GIM = AKAR.parent.parent / "karya/fase-e/konsultan-muda/index.html"
s = GIM.read_text(encoding="utf-8")
m = re.search(r"var ASSET=(\{.*?\});\nvar ASETDAF", s, re.S)
A = json.loads(m.group(1))
daf = json.loads((AKAR / "aset.json").read_text(encoding="utf-8"))
nama = {(a["jenis"], a["k"]): a["berkas"].rsplit(".", 1)[0] for a in daf["aset"]}
n = 0
for jenis, ext in (("bg", "jpg"), ("sp", "webp")):
    (AKAR / "aset" / jenis).mkdir(parents=True, exist_ok=True)
    for k, uri in A[jenis].items():
        (AKAR / "aset" / jenis / f"{nama[(jenis, k)]}.{ext}").write_bytes(base64.b64decode(uri.split(",", 1)[1])); n += 1
(AKAR / "aset" / "audio").mkdir(parents=True, exist_ok=True)
for k, uri in A["mus"].items():
    (AKAR / "aset" / "audio" / f"musik_{k}.mp3").write_bytes(base64.b64decode(uri.split(",", 1)[1])); n += 1
print(n, "berkas dikeluarkan ke", AKAR / "aset")
