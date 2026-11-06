"""Daftar aset Konsultan Muda v2 + prompt gambar. Menulis aset.json dan prompt-aset.md.
Gaya sama dengan Bendahara Baru (clay 3D) agar satu keluarga visual."""
import json, pathlib
AKAR = pathlib.Path(__file__).parent

GAYA = ("3D claymation style, handcrafted plasticine and polymer clay look, soft rounded chunky shapes, "
        "matte clay texture with subtle fingerprint and sculpting marks, slightly stylized cute proportions, "
        "simple expressive faces with glossy bead-like eyes, miniature stop-motion feel, warm saturated pastel palette, "
        "high-quality render, no text, no letters, no readable writing, no logo, no watermark, no signature")
# cahaya yang sama untuk latar dan tokoh supaya tokoh tidak terlihat tempelan
CAHAYA = ("warm late-afternoon golden hour key light coming from the upper left, soft cool bluish fill light from the right, "
          "gentle soft shadows")

def bg(d):
    return (f"{d}. Empty set with absolutely no people, no characters, no figures, no mannequins, no animals. "
            f"Composition for a visual novel background: the floor is visible across the bottom third so standing "
            f"characters can be placed on it later; keep two clear standing areas on the left third and the right third; "
            f"keep the lower third uncluttered because a dialog box covers it; main props and details along the back wall "
            f"and the far edges. Eye-level camera at standing chest height, straight-on view, 16:9 wide landscape, built as "
            f"a handmade clay miniature set, {CAHAYA}, the back wall slightly soft with shallow depth of field, {GAYA}")
def halaman(d):
    return (f"{d}. Empty set with absolutely no people, no characters, no figures. Leave the left half calm, softly "
            f"blurred and uncluttered for menu panels and a title; main details on the right side. Eye-level camera, "
            f"16:9 wide landscape, built as a handmade clay miniature set, {CAHAYA}, shallow depth of field, {GAYA}")
def sprite(d, pose, arah):
    return (f"{d}. Expression and pose: {pose}. Single character only: one 3D clay figurine shown from the top of the head "
            f"down to the knees, standing upright, three-quarter view with body and face turned toward the {arah} side of "
            f"the image, the figure fills about 90 percent of the image height and is centered, eye-level camera at chest "
            f"height, {CAHAYA}, the whole figure in sharp focus. Isolated on a solid flat pure green background #00FF00, "
            f"no floor, no ground shadow, no props on the ground, no other objects, crisp clean edges with no green tint "
            f"on the character. Keep exactly the same face, hairstyle, outfit and colors as in this character's other "
            f"images. Vertical 2:3 portrait, {GAYA}")

SMA_PA = ("white short-sleeve Indonesian senior high school shirt with a small round navy school badge on the chest "
          "pocket, grey necktie, grey school trousers, a navy lanyard with a small blank white ID card")
SMA_PI = ("neatly wrapped white hijab, white long-sleeve Indonesian senior high school shirt with a small round navy "
          "school badge on the chest pocket, grey necktie, long grey pleated school skirt, a navy lanyard with a "
          "small blank white ID card")

TOKOH = {
 # kunci: (nama tampil, deskripsi, arah hadap, {pose: deskripsi pose})
 "nayla": ("Nayla (pemain)", "Indonesian high school girl, 16 years old, calm attentive face, warm tan skin, holding a "
           "slim blue clipboard with blank paper, " + SMA_PI, "right",
           {"berdiri": "neutral calm expression with a slight friendly smile, relaxed natural pose",
            "yakin": "confident warm smile, holding the clipboard up slightly toward the viewer",
            "berpikir": "thoughtful focused expression, pen lightly touching the chin, looking slightly up"}),
 "dimas": ("Dimas (pemain)", "Indonesian high school boy, 16 years old, short neat black hair with a slight side "
           "part, light brown skin, friendly calm face, holding a slim blue clipboard with blank paper, " + SMA_PA, "right",
           {"berdiri": "neutral calm expression with a slight friendly smile, relaxed natural pose",
            "yakin": "confident warm smile, holding the clipboard up slightly toward the viewer",
            "berpikir": "thoughtful focused expression, pen lightly touching the chin, looking slightly up"}),
 "hadi": ("Pak Hadi (pembina)", "Indonesian male mathematics teacher, about 40 years old, neat short black hair, short "
          "trimmed beard, kind calm face, thin rimless rectangular glasses, long-sleeve shirt with a subtle blue batik "
          "pattern, dark grey trousers, holding a thin blue folder", "left",
          {"sapa": "warm welcoming smile, one hand raised in a friendly greeting",
           "jelaskan": "explaining calmly, one open palm gesturing to the side, folder in the other hand",
           "tanya": "curious questioning expression, eyebrows slightly raised, index finger lightly raised",
           "senang": "proud happy smile, giving a gentle thumbs-up"}),
 "raka": ("Raka (teman konsultan)", "Indonesian high school boy, 16 years old, slightly messy wavy black hair, playful "
          "sly half-grin, shirt sleeves casually rolled up, holding a smartphone, " + SMA_PA, "left",
          {"santai": "relaxed overconfident grin, one hand in the trouser pocket",
           "kaget": "surprised embarrassed expression, eyes wide, scratching the back of the head"}),
 "ratmi": ("Bu Ratmi (warung nasi uduk)", "Indonesian woman, about 50 years old, food stall owner, round kind face, "
           "simple brown floral hijab, maroon long-sleeve blouse, faded mustard-yellow kitchen apron, holding a small tin biscuit "
           "can", "left", None),
 "hasan": ("Pak Hasan (laundry)", "Indonesian man, about 45 years old, laundry shop owner, short black hair with grey "
           "streaks, light blue polo shirt, a small white towel over one shoulder, dark trousers", "left", None),
 "yudi": ("Mas Yudi (bengkel sepeda)", "Indonesian young man, about 28 years old, bicycle mechanic, short undercut "
          "black hair, dark grey work shirt with small oil smudges, rolled sleeves, a small wrench in one hand", "left", None),
 "sinta": ("Bu Sinta (toko kue)", "Indonesian woman, about 35 years old, cake shop owner, soft pastel pink hijab, cream "
           "baker's apron over a light pink long-sleeve dress, a little flour on the apron", "left", None),
 "anwar": ("Pak Anwar (percetakan)", "Indonesian man, about 55 years old, printing shop owner, black peci cap, grey "
           "hair at the temples, thick round glasses, dark brown long-sleeve shirt, holding a rolled blank paper order",
           "left", None),
 "rina": ("Mbak Rina (kedai kopi)", "Indonesian young woman, about 25 years old, coffee kiosk owner, soft beige hijab, "
          "brown barista apron over a mustard long-sleeve shirt, holding a plastic iced coffee cup", "left", None),
 "lastri": ("Bu Lastri (katering)", "Indonesian woman, about 45 years old, home catering owner, maroon hijab, white "
            "kitchen apron over a maroon modest dress, holding a small paper order note", "left", None),
 "gunawan": ("Pak Gunawan (konveksi)", "Indonesian man, about 50 years old, garment workshop owner, short grey hair, "
             "thick mustache, navy short-sleeve shirt, a yellow tailor tape measure around the neck", "left", None),
}
POSE_KLIEN = {"bingung": "worried puzzled expression, slightly furrowed brows, one hand touching the chin",
              "lega": "relieved warm smile, shoulders relaxed, one hand on the chest",
              "kecewa": "disappointed sad expression, eyes looking down, shoulders slumped"}

LATAR = {
 "sampul": ("Sampul gim", halaman("a cozy Indonesian high school classroom converted into a small business consultation "
            "clinic, a wooden desk with neat stacks of blank folders, a desk lamp, a small potted plant, a cork board with "
            "blank colored sticky notes and a hand-drawn line graph with a shaded region, large window showing a street "
            "of small shops outside")),
 "klinik": ("Ruang Klinik Usaha", bg("inside a cozy Indonesian high school classroom converted into a small business "
            "consultation clinic, two wooden desks facing each other, blank folders and a calculator on the desk, a "
            "whiteboard with a simple coordinate graph and a shaded region, a cork board with blank sticky notes")),
 "pos1": ("Warung nasi uduk", bg("small Indonesian roadside food stall kitchen, a wooden counter with a big rice "
          "steamer, banana leaves, plates of fried snacks, a small gas stove with a pot, a tin biscuit can on the counter")),
 "pos2": ("Laundry kilat", bg("small Indonesian laundry shop, a row of washing machines and one large tumble dryer, "
          "plastic laundry baskets of two sizes, folded clothes on shelves, a hanging scale")),
 "pos3": ("Bengkel sepeda", bg("small Indonesian bicycle repair workshop, bicycle frames hanging on the wall, spare "
          "wheels stacked, a workbench with tools, a children's bicycle and an adult bicycle on stands")),
 "pos4": ("Toko kue", bg("small Indonesian home cake shop, a glass display case of colorful traditional cakes, cooling "
          "racks with baking trays, a compact oven, flour bags")),
 "pos5": ("Percetakan", bg("small Indonesian printing shop, an offset printing machine, tall stacks of paper reams, "
          "bundles of notebooks and drawing books with blank covers, a cutting machine")),
 "pos6": ("Kedai kopi", bg("small Indonesian coffee kiosk popular with students, a counter with milk jugs and syrup "
          "bottles without labels, rows of plastic cups, a small menu board with no readable text, stools")),
 "pos7": ("Dapur katering", bg("busy Indonesian home catering kitchen, a large oven, many food boxes stacked, trays of "
          "portions, a wall hook with paper order notes with no readable text")),
 "pos8": ("Konveksi seragam", bg("small Indonesian garment workshop, a row of sewing machines, rolls of navy and white "
          "fabric on shelves, a cutting table, finished shirts and trousers on hangers")),
 "end_hh": ("Akhir: Konsultan Tepercaya", bg("the consultation clinic classroom decorated with paper garlands, a wall "
            "covered with many colorful thank-you cards with no readable text, small gifts from shops on the desk, joyful mood")),
 "end_hl": ("Akhir: Pintar Hitung, Kurang Dipercaya", bg("the consultation clinic classroom at dusk, a desk full of "
            "neatly finished graphs and folders, empty chairs for clients, quiet slightly lonely cool lighting")),
 "end_lh": ("Akhir: Jujur, Perlu Lebih Teliti", bg("the consultation clinic classroom, a few handmade thank-you "
            "cards with no text pinned on a cork board, a crumpled graph paper and an eraser on the desk, warm hopeful light")),
 "end_ll": ("Akhir: Masih Magang", bg("the consultation clinic classroom on a cloudy afternoon, a fresh empty notebook "
            "and a pencil on the desk ready for a new start, soft light breaking through clouds")),
}
MUSIK = {
 "menu": "warm cozy acoustic instrumental, soft nylon guitar and ukulele, light marimba, gentle piano, subtle Indonesian "
         "gamelan bell texture, mellow brushed drums, hopeful late afternoon mood, small neighborhood shops, 88 bpm, "
         "clean mix, loopable, no vocals",
 "cerita": "calm focus study instrumental, soft felt piano, pizzicato strings, light glockenspiel, kalimba, airy pads, "
           "thoughtful curious mood, problem solving, animated film underscore, 72 bpm, minimal, loopable, no vocals",
}

def daftar():
    out = []
    for k, (t, p) in LATAR.items():
        g = "Akhir" if k.startswith("end_") else ("Halaman" if k == "sampul" else "Latar")
        out.append({"k": k, "jenis": "bg", "g": g, "t": t, "berkas": f"bg_{k}.png", "sz": "1920×1080", "p": p})
    for k, (t, d, arah, poses) in TOKOH.items():
        poses = poses or POSE_KLIEN
        for pk, pd in poses.items():
            out.append({"k": f"{k}_{pk}", "jenis": "sp", "g": "Tokoh" if k in ("nayla", "dimas", "hadi", "raka") else "Klien",
                        "t": f"{t}: {pk}", "berkas": f"sp_{k}_{pk}.png", "sz": "1024×1536", "p": sprite(d, pd, arah)})
    return out

if __name__ == "__main__":
    A = daftar()
    (AKAR / "aset.json").write_text(json.dumps({"aset": A, "musik": MUSIK}, ensure_ascii=False, indent=1), encoding="utf-8")
    L = ["# Prompt aset Konsultan Muda v2", "",
         f"Total {len(A)} gambar: {sum(a['jenis']=='bg' for a in A)} latar dan {sum(a['jenis']=='sp' for a in A)} tokoh. "
         "Gayanya sama dengan Bendahara Baru (clay 3D), jadi semua karya Rumatika satu keluarga visual.", "",
         "## Cara pakai", "",
         "1. Latar dan tokoh dibuat terpisah. Latar selalu kosong tanpa orang (16:9, 1920×1080). Tokoh dibuat sendiri dengan latar hijau polos #00FF00 (2:3, 1024×1536); hijaunya nanti dibuang otomatis lalu tokoh ditempatkan di atas latar dan bisa dianimasikan.",
         "   Karena latarnya hijau, tidak ada tokoh yang memakai pakaian hijau. Jika hasilnya tetap ada unsur hijau di pakaian, minta diganti warnanya.",
         "   Latar dan tokoh memakai arah cahaya yang sama (cahaya senja dari kiri atas) supaya tokoh menyatu dengan latarnya.",
         "2. Agar wajah dan pakaian tokoh konsisten, buat semua pose satu tokoh dalam satu percakapan alat gambar yang sama. Buat pose pertama, lalu minta pose berikutnya dengan menyertakan gambar pertama sebagai acuan.",
         "3. Simpan setiap gambar dengan nama berkas yang tertulis di bawah judulnya, lalu kirim ke Claude. Tidak perlu memotong atau mengecilkan gambar.",
         "4. Gambar yang belum ada tetap aman: gim memakai ilustrasi pengganti sampai gambarnya dikirim.",
         "5. Urutan yang disarankan: Pak Hadi dan tokoh pemain dulu (paling sering tampil), lalu latar, lalu klien, terakhir layar akhir.", ""]
    for g in ["Halaman", "Latar", "Akhir", "Tokoh", "Klien"]:
        L += [f"## {g}", ""]
        for a in A:
            if a["g"] == g:
                L += [f"### {a['t']}", f"Nama berkas: `{a['berkas']}` · ukuran {a['sz']}", "", "```", a["p"], "```", ""]
    L += ["## Musik (opsional)", ""]
    for k, p in MUSIK.items():
        L += [f"### Musik {k}", f"Nama berkas: `musik_{k}.mp3`", "", "```", p, "```", ""]
    (AKAR / "prompt-aset.md").write_text("\n".join(L), encoding="utf-8")
    print(len(A), "aset")
