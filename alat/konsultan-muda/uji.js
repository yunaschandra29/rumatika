// Uji main penuh Konsultan Muda v2:  node uji.js <berkas.html> <folder-shot> <pola-keputusan, mis. 00000000> [salah]
const { chromium } = require('playwright');
const [,, FILE, SHOT, POLA='00000000', SALAH=''] = process.argv;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  const err = [];
  p.on('pageerror', e => err.push('pageerror: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') err.push('console: ' + m.text()); });
  await p.goto('file://' + FILE);
  await p.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await p.reload();
  const shot = async n => { await p.waitForTimeout(450); return p.screenshot({ path: `${SHOT}/${n}.png` }); };
  const cur = () => p.evaluate(() => CUR);
  await shot('01-sampul');
  await p.click('#homeRow .btn');
  await shot('01b-mode');
  if (process.env.KELOMPOK) {
    await p.click('[data-mode=kelompok]');
    await p.fill('#inNama', 'Tim Elang'); await p.fill('#inKelas', 'X-1');
    await p.click('#idGo'); await shot('02a-kurang-anggota');
    await p.fill('.inAng >> nth=0', 'Alya'); await p.fill('.inAng >> nth=1', 'Bima'); await p.fill('.inAng >> nth=2', 'Citra');
  } else {
    await p.click('[data-mode=mandiri]');
    await p.fill('#inNama', 'Uji Coba'); await p.fill('#inKelas', 'X-1');
  }
  await shot('02-kartu');
  await p.click('#idGo');
  await shot('03-tokoh');
  await p.click('.tokohCard');
  let langkah = 0, shots = {}, decN = 0, salahDipakai = false;
  const once = async (k) => { if (!shots[k]) { shots[k] = 1; await shot(k); } };
  while (langkah++ < 3000) {
    const c = await cur();
    if (c === 'end') break;
    if (c === 'vn') {
      const dop = await p.$('.vov.on .dop');
      if (dop) {
        await once('05-keputusan');
        const idx = +(POLA[decN] || 0); decN++;
        await p.click(`.vov.on .dop[data-o="${idx}"]`);
        continue;
      }
      if (await p.$('.vov.on .epjudul')) { await once('05a-judul-' + (await p.evaluate(() => G.kini))); await p.click('.vov.on .epjudul'); continue; }
      if (await p.$('.vov.on .epend')) { await once('05b-selesai-' + (await p.evaluate(() => G.kini))); const daf = !shots['xdaftar']; if (daf) { shots['xdaftar']=1; await p.click('.vov.on [data-x=daftar]'); } else await p.click('.vov.on [data-x=lanjut]'); continue; }
      const mj = await p.$('.vov.on [data-x]');
      if (mj) { await once('04-meja-' + (await p.evaluate(() => V && V.i))); await p.click('.vov.on [data-x]'); continue; }
      if (!shots['06-adegan'] && await p.evaluate(() => V && V.cast[0] && V.cast[1] && !V.typing)) await once('06-adegan');
      await p.click('#dlg'); continue;
    }
    if (c === 'peta' && await p.evaluate(() => DRMODE) === 'menu') {
      await once('07a-menu-utama');
      for (let n = 0; n < 6 && (await p.evaluate(() => DRI)) !== 0; n++) await p.keyboard.press('ArrowDown');
      await p.click('#gob'); continue;
    }
    if (c === 'peta') {
      await once('07-episode');
      const i = await p.evaluate(() => { for (let i = 0; i < NB; i++) if (bukaKah(i) && S.bintang[i] < 0) return i; return -1; });
      const t = i < 0 ? await p.evaluate(() => DRUM.length - 1) : i + 1;
      // pilih lewat tombol panah sampai item yang dituju aktif
      for (let n = 0; n < 20 && (await p.evaluate(() => DRI)) !== t; n++) await p.keyboard.press('ArrowDown');
      await p.click('#gob'); continue;
    }
    if (c === 'pos') {
      const info = await p.evaluate(() => ({ t: BERKAS[G.kini].tahap[G.tahap], k: G.kini, ta: G.tahap }));
      const t = info.t;
      await once(`08-kerja-${info.k}-${info.ta}-${t.tipe}`);
      // satu kali: jawab salah tiga kali untuk melihat bantuan dan kunci
      if (SALAH && !salahDipakai && t.tipe === 'ketikPertidaksamaan') {
        salahDipakai = true;
        for (let n = 0; n < 3; n++) {
          for (const ch of '1x≥99') await p.click(`#ptdKp .key:text-is("${ch}")`);
          await p.click('#aksi .btn');
          await shot('09-salah-' + n);
          const coba = await p.$('#aksi .btn.gh'); if (coba) await coba.click();
        }
        await p.click('#aksi .btn'); continue;
      }
      const keyTo = s => s.replace(/-/g, '−');
      if (t.tipe === 'ketikPertidaksamaan') {
        for (const ch of keyTo(t.jawab)) await p.click(`#ptdKp .key:text-is("${ch}")`);
      } else if (t.tipe === 'pilihGambar') {
        const pos = await p.evaluate(b => document.querySelector('.gopts').dataset.urut.split(',').map(Number).indexOf(b), t.benar);
        await p.click(`.gopts .gopt >> nth=${pos}`);
      } else if (t.tipe === 'pilihKalimat') {
        await p.click(`.kopts .kopt >> nth=${t.benar}`);
      } else if (t.tipe === 'ujiTitik') {
        const ok = await p.evaluate(t => { const K = t.cons.map(parseCons); return t.rencana.map(r => satAll(K, r.x, r.y)); }, t);
        for (let i = 0; i < ok.length; i++) if (ok[i]) await p.click(`.sisi .rencana >> nth=${i}`);
      } else if (t.tipe === 'seretTitik') {
        for (let i = 1; i < t.target[0]; i++) await p.click('#aksi button:text-is("x +1")');
        for (let i = 1; i < t.target[1]; i++) await p.click('#aksi button:text-is("y +1")');
      } else if (t.tipe === 'seretKartu') {
        for (let i = 0; i < t.jawab.length; i++) {
          await p.click(`.bank .kartu:text-is("${t.jawab[i]}")`);
          await p.click(`.slotrow .slotbox >> nth=${i}`);
        }
      } else if (t.tipe === 'ketikKoordinat') {
        for (const ch of String(t.jawab[0])) await p.click(`#kNum .key:text-is("${ch}")`);
        await p.click('#kNum .key:text-is("→")');
        for (const ch of String(t.jawab[1])) await p.click(`#kNum .key:text-is("${ch}")`);
      } else if (t.tipe === 'ketikAngka') {
        for (const ch of String(t.jawab)) await p.click(`#agkKp .key:text-is("${ch}")`);
      }
      const kirim = await p.$('#aksi .btn:not(.gh):not(.sm)');
      if (kirim && !(await p.$('.pilihGambar-x'))) {
        const sudah = await p.evaluate(() => !!document.querySelector('#umpan .ok'));
        if (!sudah) await kirim.click();
      }
      const ok = await p.evaluate(() => !!document.querySelector('#umpan .ok'));
      if (!ok) { err.push(`tahap gagal dijawab benar: berkas ${info.k} tahap ${info.ta} (${t.tipe}) umpan=` + await p.evaluate(() => document.querySelector('#umpan').innerText)); await shot('xx-gagal'); break; }
      await once(`08-kerja-benar-${t.tipe}`);
      await p.click('#aksi .btn');
      continue;
    }
    err.push('layar tak terduga: ' + c); break;
  }
  await shot('10-akhir');
  const R = await p.evaluate(() => ({ R: nilaiRJ(), ek: kunciAkhir(nilaiRJ()), bintang: S.bintang, dec: S.dec, cat: S.catatan }));
  console.log(JSON.stringify(R));
  // tampilan HP mendatar & galeri
  await p.setViewportSize({ width: 800, height: 400 }); await shot('11-hp-mendatar-akhir');
  await p.evaluate(() => peta()); await shot('12-hp-mendatar-episode');
  await p.setViewportSize({ width: 400, height: 860 }); await shot('13-hp-tegak');
  await p.setViewportSize({ width: 1280, height: 720 });
  await p.evaluate(() => { RFT = 1; referensi(); }); await shot('14-galeri');
  await p.click('#refBody .glt >> nth=20'); await shot('15-galeri-lbx');
  await p.keyboard.press('Escape'); await p.evaluate(() => pengaturan()); await shot('16-pengaturan');
  console.log('langkah', langkah, 'error', err.length ? err : 'tidak ada');
  await b.close();
})();
