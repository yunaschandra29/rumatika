/* ============================================================
   KONSULTAN MUDA v2 — alur novel visual, meja kerja, episode, akhir
   ============================================================ */
var $=function(s,r){return (r||document).querySelector(s);};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function rp(n){return "Rp"+String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,".");}

/* ---------------- layar ---------------- */
var SCREENS={home:"gsHome",mode:"gsMode",id:"gsId",tokoh:"gsTokoh",vn:"gsVN",peta:"gsPeta",pos:"gsPos",end:"gsEnd",gal:"gsGal"};
var CUR="home";
function show(k){
  $$(".scr").forEach(function(e){e.classList.remove("on");});
  var el=document.getElementById(SCREENS[k]||k); if(el) el.classList.add("on");
  CUR=k;
  if(typeof AEL!=="undefined"&&AEL) lagu(k==="vn"||k==="pos"?"cerita":"menu");
}
document.addEventListener("click",function(e){
  var t=e.target.closest("[data-go]"); if(!t) return;
  go(t.getAttribute("data-go"));
});
function go(k){
  if(k==="home") home();
  else if(k==="peta") peta();
  else if(k==="gal") galeri();
  else show(k);
}

/* ---------------- aset dan ilustrasi pengganti ---------------- */
var POSE_DEF={hadi:"sapa",raka:"santai",nayla:"berdiri",dimas:"berdiri"};
function poseDef(k){return POSE_DEF[k]||"bingung";}
var WARNA={
 nayla:{kulit:"#c98e62",baju:"#f4f6fb",bawah:"#7d8594",hijab:"#f7f8fb"},
 dimas:{kulit:"#b98257",baju:"#f4f6fb",bawah:"#7d8594",rambut:"#1d1712"},
 raka:{kulit:"#c08a5e",baju:"#f4f6fb",bawah:"#7d8594",rambut:"#241a14"},
 hadi:{kulit:"#b5835c",baju:"#5b86c4",bawah:"#3b4252",rambut:"#1b1714",kacamata:1},
 ratmi:{kulit:"#b98257",baju:"#8a3b3b",bawah:"#d1a843",hijab:"#9a6a45"},
 hasan:{kulit:"#a87850",baju:"#8fc1e3",bawah:"#3b4252",rambut:"#4a4540"},
 yudi:{kulit:"#a87048",baju:"#4b5058",bawah:"#2f3540",rambut:"#151210"},
 sinta:{kulit:"#d4a07a",baju:"#f1e4cf",bawah:"#e9b8c4",hijab:"#f3b6c8"},
 anwar:{kulit:"#a97a54",baju:"#5a3d2b",bawah:"#353b45",rambut:"#8a8a8a",peci:1,kacamata:1},
 rina:{kulit:"#c99268",baju:"#7a5236",bawah:"#d7a53b",hijab:"#d9c2a0"},
 lastri:{kulit:"#b98257",baju:"#f4f1ea",bawah:"#7d2f3a",hijab:"#8c2f3f"},
 gunawan:{kulit:"#a87850",baju:"#2c3e66",bawah:"#3b4252",rambut:"#8d8d8d",kumis:1}
};
var PHX={};
function phSp(k,pose){
  var id=k+"|"+pose; if(PHX[id]) return PHX[id];
  var c=WARNA[k]||WARNA.dimas;
  var s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600">';
  s+='<path d="M120 470 L280 470 L300 600 L100 600Z" fill="'+c.bawah+'"/>';
  s+='<path d="M96 490 L110 372 Q124 322 200 316 Q276 322 290 372 L304 490Z" fill="'+c.baju+'"/>';
  var up=(pose==="sapa"||pose==="senang"||pose==="yakin"), chin=(pose==="bingung"||pose==="berpikir"||pose==="tanya");
  s+='<path d="M112 380 Q84 430 92 '+(up?"300":"470")+'" stroke="'+c.baju+'" stroke-width="34" stroke-linecap="round" fill="none"/>';
  s+='<path d="M288 380 Q318 430 '+(chin?"250 250":"308 470")+'" stroke="'+c.baju+'" stroke-width="34" stroke-linecap="round" fill="none"/>';
  if(c.hijab) s+='<path d="M118 330 Q118 150 200 140 Q282 150 282 330 Q240 360 200 360 Q160 360 118 330Z" fill="'+c.hijab+'"/>';
  s+='<ellipse cx="200" cy="230" rx="68" ry="74" fill="'+c.kulit+'"/>';
  if(c.hijab) s+='<path d="M132 210 Q138 150 200 148 Q262 150 268 210 Q262 176 200 172 Q138 176 132 210Z" fill="'+c.hijab+'"/>';
  else s+='<path d="M132 220 Q128 150 200 146 Q272 150 268 220 Q250 178 200 176 Q150 178 132 220Z" fill="'+(c.rambut||"#1d1712")+'"/>';
  if(c.peci) s+='<rect x="146" y="136" width="108" height="40" rx="8" fill="#14161c"/>';
  var ey=pose==="kecewa"?240:232;
  s+='<circle cx="176" cy="'+ey+'" r="8" fill="#1b1410"/><circle cx="224" cy="'+ey+'" r="8" fill="#1b1410"/>';
  s+='<circle cx="179" cy="'+(ey-3)+'" r="2.5" fill="#fff"/><circle cx="227" cy="'+(ey-3)+'" r="2.5" fill="#fff"/>';
  if(c.kacamata) s+='<g fill="none" stroke="#2a2a2a" stroke-width="3"><rect x="158" y="'+(ey-13)+'" width="36" height="26" rx="6"/><rect x="206" y="'+(ey-13)+'" width="36" height="26" rx="6"/><path d="M194 '+ey+' L206 '+ey+'"/></g>';
  if(pose==="bingung"||pose==="tanya") s+='<path d="M162 210 L188 216 M212 216 L238 210" stroke="#3a2a20" stroke-width="4" stroke-linecap="round"/>';
  if(c.kumis) s+='<path d="M178 266 Q200 258 222 266" stroke="#3a3a3a" stroke-width="7" stroke-linecap="round" fill="none"/>';
  var mouth = (pose==="kecewa")?'M184 282 Q200 270 216 282':(pose==="bingung"||pose==="berpikir"||pose==="kaget")?'M188 278 L212 278':'M180 270 Q200 292 220 270';
  if(pose==="kaget") s+='<ellipse cx="200" cy="280" rx="10" ry="12" fill="#5a2a22"/>';
  else s+='<path d="'+mouth+'" stroke="#5a2a22" stroke-width="5" stroke-linecap="round" fill="none"/>';
  s+='<circle cx="160" cy="262" r="10" fill="#e88a7a" opacity=".35"/><circle cx="240" cy="262" r="10" fill="#e88a7a" opacity=".35"/>';
  s+='</svg>';
  return PHX[id]="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s);
}
var PHB={sampul:["#2a3f66","#e0a06a","#5a3f2c"],klinik:["#e8d9b8","#d7c39a","#7a5b3e"],peta:["#7fb36a","#a9cf86","#8a7a5a"],
 pos1:["#f0c98e","#e0a868","#7a4e2e"],pos2:["#bfe0ef","#9cc8dd","#6f7f8a"],pos3:["#c9c2b4","#a9a08e","#4f4a42"],
 pos4:["#f7d8d8","#f0c2b8","#8a5a4a"],pos5:["#d9dfe6","#bcc6d1","#5a6270"],pos6:["#e9cfa8","#d6b285","#6a4a30"],
 pos7:["#f2e2c6","#e6caa0","#7a5a3a"],pos8:["#c8d3ea","#a9b8d8","#4a5578"],
 end_hh:["#ffd98a","#f3b35f","#8a5a2a"],end_hl:["#41557a","#2c3a58","#1f2638"],end_lh:["#f2d2a8","#e6b88a","#7a5a3a"],end_ll:["#9aa6b8","#7d889a","#4a5260"]};
var PBX={};
function phBg(k){
  if(PBX[k]) return PBX[k];
  var c=PHB[k]||PHB.klinik;
  var s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">'+
    '<stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient></defs>'+
    '<rect width="1280" height="720" fill="url(#g)"/>';
  if(k==="peta"){
    s+='<path d="M0 520 C300 380 500 640 760 470 S1150 300 1280 380" stroke="#d8cfb4" stroke-width="70" fill="none"/>';
    for(var i=0;i<8;i++){ var x=90+i*150, y=i%2?220:420; s+='<rect x="'+x+'" y="'+y+'" width="110" height="80" rx="14" fill="'+["#e9a46b","#8fc1e3","#b0a58e","#f3b6c8","#c9d1dc","#c99a6a","#e6caa0","#9fb0d8"][i]+'"/><path d="M'+(x-8)+' '+y+' L'+(x+55)+' '+(y-40)+' L'+(x+118)+' '+y+'Z" fill="#9b5a3c"/>'; }
    s+='<rect x="560" y="60" width="180" height="110" rx="16" fill="#f4f6fb"/><path d="M548 60 L650 10 L752 60Z" fill="#3c5a8a"/>';
  } else {
    s+='<rect y="520" width="1280" height="200" fill="'+c[2]+'"/>';
    s+='<rect x="80" y="90" width="300" height="230" rx="18" fill="#ffffff" opacity=".35"/>';
    s+='<rect x="900" y="120" width="300" height="260" rx="18" fill="#000" opacity=".08"/>';
    s+='<rect x="120" y="430" width="320" height="110" rx="16" fill="#000" opacity=".12"/>';
    s+='<rect x="860" y="420" width="340" height="120" rx="16" fill="#000" opacity=".12"/>';
  }
  s+='</svg>';
  return PBX[k]="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s);
}
function spSrc(k,pose){
  var kk=k==="p"?S.tokoh:k; pose=pose||poseDef(kk);
  return ASSET.sp[kk+"_"+pose]||ASSET.sp[kk+"_"+poseDef(kk)]||phSp(kk,pose);
}
function bgSrc(k){return ASSET.bg[k]||phBg(k);}
function imgTokoh(id,pose,kelas){return '<img class="tk '+(kelas||"")+'" src="'+spSrc(id,pose)+'" alt="">';}

/* ---------------- keadaan dan simpan ---------------- */
var KUNCI="konsultan_muda_v2";
var NB=BERKAS.length, NAWAL=8;
function baru(){return {v:2,mode:"mandiri",nama:"",kelas:"",anggota:[],tokoh:"nayla",bintang:BERKAS.map(function(){return -1;}),
  catatan:{arsiran:0,garis:0,model:0,pojok:0,irisan:0,tafsir:0},dec:{},buka:0,prolog:false,ulangIntro:false,akhir:false};}
var S=baru();
function simpan(){try{localStorage.setItem(KUNCI,JSON.stringify(S));}catch(e){}}
function muat(){try{var t=localStorage.getItem(KUNCI); if(!t) return false; var o=JSON.parse(t);
  if(!o||o.v!==2) return false; var d=baru(); for(var k in d) if(o[k]!==undefined) d[k]=o[k]; S=d; return true;}catch(e){return false;}}
function adaSimpanan(){try{return !!localStorage.getItem(KUNCI);}catch(e){return false;}}

/* ---------------- rekam jejak ---------------- */
function nilaiRJ(dec){
  dec=dec||S.dec; var kep=50,itg=50;
  URUT_DEC.forEach(function(id){ var c=dec[id]; if(c==null) return; var d=DEC[id].o[c].d;
    kep+=d.kep||0; itg+=d.int||0; });
  var sel=0,bin=0; S.bintang.forEach(function(b){ if(b>=0){ sel++; bin+=b; } });
  return {kep:clamp(kep,0,100),int:clamp(itg,0,100),tepat:sel?Math.round(bin/(sel*3)*100):0,bin:bin,sel:sel};
}
function meterHTML(R,besar){
  return ["tepat","kep","int"].map(function(k){
    return '<div class="mt '+k+'"><span><b>'+RJL[k]+'</b><b>'+R[k]+'</b></span><i><b style="width:'+R[k]+'%"></b></i></div>';
  }).join("");
}
function kunciAkhir(R){
  var kar=Math.round((R.kep+R.int)/2);
  return (R.tepat>=BATAS.tepat?"H":"L")+(kar>=BATAS.karakter?"H":"L");
}
function toast(h){
  var c=$("#tst"); while(c.children.length>=3) c.removeChild(c.firstChild);
  var d=document.createElement("div"); d.innerHTML=h; c.appendChild(d);
  setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d); },3200);
}

/* ============================================================
   SAMPUL, KARTU, TOKOH
   ============================================================ */
function home(){
  V=null; show("home");
  $("#homeBg").style.backgroundImage='url("'+bgSrc("sampul")+'")';
  var ada=adaSimpanan(), r=$("#homeRow"); r.innerHTML="";
  function tb(teks,kelas,fn){ var b=document.createElement("button"); b.className="btn "+(kelas||""); b.textContent=teks;
    b.addEventListener("click",fn); r.appendChild(b); }
  if(ada&&muat()&&S.nama){
    tb("Lanjutkan sebagai "+S.nama+(S.mode==="kelompok"?" ("+S.anggota.length+" orang)":""),"",function(){ sfx("ok"); if(!S.prolog) prolog(); else peta(); });
    tb("Mulai baru","gh",function(){ S=baru(); simpan(); pilihMode(); });
  } else tb("Buka klinik","",function(){ sfx("ok"); pilihMode(); });
  tb("Galeri aset","gh",function(){ galeri(); });
}
function pilihMode(){ show("mode"); }
$("#modeGrid").addEventListener("click",function(e){
  var c=e.target.closest("[data-mode]"); if(!c) return;
  S.mode=c.getAttribute("data-mode"); sfx("ok"); kartu();
});
function kartu(){
  show("id"); $("#idErr").textContent="";
  var kel=S.mode==="kelompok";
  $("#idEyebrow").textContent=kel?"Kartu tim konsultan":"Kartu tanda konsultan";
  $("#idJudul").textContent=kel?"Tim mana yang bertugas sore ini?":"Siapa yang bertugas sore ini?";
  var h;
  if(!kel){
    h='<div class="field"><label for="inNama">Nama lengkap</label><input id="inNama" autocomplete="off" maxlength="40" placeholder="Tulis namamu"></div>'+
      '<div class="field"><label for="inKelas">Kelas</label><input id="inKelas" autocomplete="off" maxlength="20" placeholder="Contoh: X-1"></div>';
  } else {
    h='<div class="idRow"><div class="field"><label for="inNama">Nama tim</label><input id="inNama" autocomplete="off" maxlength="30" placeholder="Contoh: Tim Elang"></div>'+
      '<div class="field"><label for="inKelas">Kelas</label><input id="inKelas" autocomplete="off" maxlength="20" placeholder="Contoh: X-1"></div></div>'+
      '<div class="field sm" style="width:auto"><label>Anggota tim (2–5 orang, urutan menentukan giliran peran)</label></div>'+
      '<div class="angg">'+[0,1,2,3,4].map(function(i){
        return '<input class="inAng" data-i="'+i+'" autocomplete="off" maxlength="30" aria-label="Anggota '+(i+1)+'" placeholder="Anggota '+(i+1)+(i<2?'':' (boleh kosong)')+'">';
      }).join("")+'</div>';
  }
  $("#idForm").innerHTML=h;
  $("#inNama").value=S.nama||""; $("#inKelas").value=S.kelas||"";
  $$(".inAng").forEach(function(el,i){ el.value=S.anggota[i]||""; });
  $$("#idForm input").forEach(function(el){ el.addEventListener("keydown",function(e){ if(e.key==="Enter") $("#idGo").click(); }); });
  setTimeout(function(){ try{$("#inNama").focus();}catch(e){} },50);
}
$("#idGo").addEventListener("click",function(){
  var kel=S.mode==="kelompok";
  var n=$("#inNama").value.trim(), k=$("#inKelas").value.trim();
  var ang=$$(".inAng").map(function(el){ return el.value.trim(); }).filter(function(x){ return x; });
  if(n.length<2){ $("#idErr").textContent=kel?"Tulis nama tim dulu.":"Tulis namamu dulu."; sfx("no"); return; }
  if(!k){ $("#idErr").textContent="Tulis kelas juga."; sfx("no"); return; }
  if(kel&&ang.length<2){ $("#idErr").textContent="Isi paling sedikit dua nama anggota."; sfx("no"); return; }
  S.nama=n; S.kelas=k; S.anggota=kel?ang:[]; simpan(); sfx("ok"); pilihTokoh();
});
/* peran kelompok bergiliran setiap dua berkas */
var PERAN=["Pembaca berkas","Penghitung","Pelapor"];
function peranTim(i){
  if(S.mode!=="kelompok"||!S.anggota.length) return null;
  var g=Math.floor(i/2), n=S.anggota.length;
  return PERAN.map(function(p,r){ return {p:p,n:S.anggota[(r+g)%n]}; });
}
function peranHTML(i){
  var pr=peranTim(i); if(!pr) return "";
  return '<div class="peranTim">'+pr.map(function(x){ return x.p+': <b>'+esc(x.n)+'</b>'; }).join(" · ")+'</div>';
}
function pilihTokoh(){
  show("tokoh");
  $("#gsTokoh .sub").textContent=S.mode==="kelompok"?"Tokoh ini mewakili tim kalian di dalam cerita. Isi soalnya sama persis.":"Isi soal sama persis; yang berbeda hanya siapa yang kamu mainkan.";
  var g=$("#tokohGrid"); g.innerHTML="";
  TOKOH.forEach(function(t){
    var b=document.createElement("button"); b.className="tokohCard"+(S.tokoh===t.id?" pilih":"");
    b.innerHTML='<img class="tk" src="'+spSrc(t.id,"berdiri")+'" alt=""><div class="nm disp">'+t.nm+'</div><div class="ds">'+t.ds+'</div>';
    b.addEventListener("click",function(){ S.tokoh=t.id; simpan(); sfx("ok"); prolog(); });
    g.appendChild(b);
  });
}
function prolog(){ vn(PROLOG,function(){ S.prolog=true; simpan(); DRI=null; peta(); },{back:false}); }

/* ============================================================
   MESIN NOVEL VISUAL
   ============================================================ */
var V=null;
function vn(steps,onDone,opt){
  opt=opt||{};
  if(V){ clearInterval(V.tm); clearTimeout(V.at); }
  var v={steps:steps.slice(),i:-1,onDone:onDone,opt:opt,cast:[null,null],pose:{},hist:[],auto:V?V.auto:false,busy:false,typing:false};
  V=v;
  show("vn");
  $("#vov").classList.remove("on"); $("#vov").innerHTML="";
  $("#vhd").innerHTML=""; $("#dnm").textContent=""; $("#dtx").textContent="";
  ["#spL","#spR"].forEach(function(q){ $(q).classList.remove("masuk","dim","bicara"); $(q).classList.add("hid"); $(q).querySelector(".vin").classList.remove("turun","hop","goyang"); });
  $("#vbg").classList.remove("kb");
  $("[data-a=back]").style.display=opt.back===false?"none":"";
  $("[data-a=auto]").classList.toggle("on",!!v.auto);
  adv();
}
$("#gsVN").addEventListener("click",function(e){
  var v=V; if(!v||CUR!=="vn") return;
  if(e.target.closest(".vov")) return;
  var a=e.target.closest("[data-a]");
  if(a){ hud(a.getAttribute("data-a")); return; }
  if(e.target.closest(".muteBtn")) return;
  adv();
});
document.addEventListener("keydown",function(e){
  var v=V; if(!v||CUR!=="vn") return;
  if(v.pick&&/^[1-4]$/.test(e.key)){ v.pick(+e.key-1); return; }
  if((e.key===" "||e.key==="Enter")&&!e.target.closest("input,textarea,button")){ e.preventDefault(); if(v.ovNext) v.ovNext(); else adv(); }
});
function hud(a){
  var v=V;
  if(a==="back"){ batalBerkas(); return; }
  if(a==="auto"){ v.auto=!v.auto; $("[data-a=auto]").classList.toggle("on",v.auto); if(v.auto&&!v.typing&&!v.busy) jadwalAuto(v); return; }
  if(a==="log"){
    var h=v.hist.slice(-30).map(function(x){ return '<div class="logl">'+(x.n?'<b>'+esc(x.n)+':</b> ':'')+esc(x.t)+'</div>'; }).join("")||'<p class="mjp">Belum ada percakapan.</p>';
    meja({t:"Riwayat percakapan",h:h},true); return;
  }
  if(a==="skip"){ lewati(); return; }
}
function adv(){
  var v=V; if(!v||v.busy) return;
  if(v.typing){ selesaiKetik(); return; }
  for(;;){
    v.i++;
    if(v.i>=v.steps.length){ v.busy=true; var f=v.onDone; if(f) f(); return; }
    var st=v.steps[v.i];
    if(Array.isArray(st)){ ucap(st); return; }
    if(st.scn) $("#vbg").style.backgroundImage='url("'+bgSrc(st.scn)+'")';
    if(st.hd!=null) $("#vhd").innerHTML=st.hd?'<span>'+esc(st.hd)+'</span>':'';
    if(st.cast) setCast(st.cast);
    if(st.cabang){ var c=S.dec[st.cabang]; var ins=st.o[c==null?0:c]||[]; v.steps.splice.apply(v.steps,[v.i+1,0].concat(ins)); continue; }
    if(st.judulEp!=null){ v.busy=true; kartuJudul(st.judulEp); return; }
    if(st.meja){ v.busy=true; meja(st.meja); return; }
    if(st.kerja){ v.busy=true; mulaiKerja(st.kerja); return; }
    if(st.dec){ v.busy=true; putuskan(st.dec); return; }
  }
}
function lewati(){
  var v=V; if(!v||v.busy) return;
  if(v.typing) selesaiKetik();
  for(;;){
    var nx=v.steps[v.i+1];
    if(!nx) break;
    if(Array.isArray(nx)){ v.i++; var k=nx[0]; if(k!=="nar"){ var sl=k==="p"?0:1; if(v.cast[sl]!==k) setCast(sl===0?["p",v.cast[1]]:[v.cast[0]||"p",k]); if(nx[2]) setPose(k,nx[2]); }
      v.hist.push({n:k==="p"?S.nama:NM[k],t:isi(nx[1])}); continue; }
    if(nx.meja||nx.kerja||nx.dec||nx.judulEp!=null) break;
    v.i++;
    if(nx.scn) $("#vbg").style.backgroundImage='url("'+bgSrc(nx.scn)+'")';
    if(nx.hd!=null) $("#vhd").innerHTML=nx.hd?'<span>'+esc(nx.hd)+'</span>':'';
    if(nx.cast) setCast(nx.cast);
    if(nx.cabang){ var c=S.dec[nx.cabang]; var ins=nx.o[c==null?0:c]||[]; v.steps.splice.apply(v.steps,[v.i+1,0].concat(ins)); }
  }
  adv();
}
function isi(t){ return String(t).replace(/\{N\}/g,S.nama||"kamu"); }
function slotEl(i){ return i===0?$("#spL"):$("#spR"); }
function setCast(c){
  var v=V;
  [0,1].forEach(function(i){
    var k=c[i], el=slotEl(i);
    if(!k){ el.classList.remove("masuk","bicara"); el.classList.add("hid"); v.cast[i]=null; return; }
    var baru=v.cast[i]!==k; v.cast[i]=k;
    if(baru){ el.querySelector("img").src=spSrc(k,v.pose[k]); el.querySelector(".vin").classList.toggle("turun",v.pose[k]==="kecewa"); }
    el.classList.remove("hid","dim");
    if(baru){ el.classList.remove("masuk"); void el.offsetWidth; el.classList.add("masuk"); }
  });
}
function setPose(k,p){
  var v=V; if(!p) return; v.pose[k]=p;
  var i=v.cast[0]===k?0:v.cast[1]===k?1:-1;
  if(i>=0){ gantiGambar(slotEl(i).querySelector("img"),spSrc(k,p)); slotEl(i).querySelector(".vin").classList.toggle("turun",p==="kecewa"); }
}
/* pergantian pose memudar halus */
function gantiGambar(img,src){
  if(img.getAttribute("src")===src) return;
  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){ img.src=src; return; }
  img.style.opacity="0";
  setTimeout(function(){ img.src=src; img.style.opacity="1"; },110);
}
function animasi(el,kelas){ el.classList.remove("hop","goyang"); void el.offsetWidth; el.classList.add(kelas); }
function ucap(st){
  var v=V, k=st[0], t=isi(st[1]), p=st[2];
  if(k!=="nar"){
    var sl=k==="p"?0:1;
    if(v.cast[sl]!==k){ if(sl===0) setCast(["p",v.cast[1]]); else setCast([v.cast[0]||"p",k]); }
    setPose(k,p);
    [0,1].forEach(function(j){ slotEl(j).classList.toggle("dim",j!==sl); slotEl(j).classList.toggle("bicara",j===sl); });
    var vin=slotEl(sl).querySelector(".vin");
    if(p==="kaget") animasi(vin,"goyang"); else if(v.lastSp!==k) animasi(vin,"hop");
  } else { [0,1].forEach(function(j){ slotEl(j).classList.remove("dim","bicara"); }); }
  v.lastSp=k;
  $("#dlg").style.visibility="";
  var nm=k==="p"?(S.nama||"Kamu"):(NM[k]||"");
  $("#dlg").classList.toggle("nar",k==="nar"); $("#dnm").textContent=nm;
  v.hist.push({n:nm,t:t}); ketik(t);
}
function ketik(t){
  var v=V, el=$("#dtx"), d=$("#dlg"); v.full=t; v.typing=true; d.classList.add("typ");
  clearInterval(v.tm); clearTimeout(v.at); var i=0; el.textContent="";
  var cepat=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(cepat){ selesaiKetik(); return; }
  var id=setInterval(function(){
    if(V!==v||v.tm!==id){ clearInterval(id); return; }
    i+=1; el.textContent=t.slice(0,i);
    if(i>=t.length){ clearInterval(id); v.tm=null; v.typing=false; d.classList.remove("typ"); jadwalAuto(v); }
  },18);
  v.tm=id;
}
function selesaiKetik(){
  var v=V; clearInterval(v.tm); v.tm=null; $("#dtx").textContent=v.full; v.typing=false; $("#dlg").classList.remove("typ"); jadwalAuto(v);
}
function jadwalAuto(v){
  if(!v.auto) return; clearTimeout(v.at); var s=v.i;
  v.at=setTimeout(function(){ if(V===v&&v.i===s&&!v.busy&&!v.typing) adv(); },2200);
}
function buka(h){ var o=$("#vov"); o.innerHTML=h; o.classList.add("on"); return o; }
function tutup(lanjut){
  var v=V; var o=$("#vov"); o.classList.remove("on"); o.innerHTML=""; o.onclick=null;
  v.pick=null; v.ovNext=null; if(lanjut!==false){ v.busy=false; adv(); }
}
function meja(m,info){
  var v=V;
  var o=buka('<div class="dim2"></div><div class="mj gl"><h3>'+m.t+'</h3>'+m.h+
    '<div class="ft"><button class="btn" data-x="1">'+(info?"Tutup":"Lanjut ›")+'</button></div></div>');
  var dipakai=false;
  var nx=function(){ if(dipakai||V!==v) return; dipakai=true; if(info){ var oo=$("#vov"); oo.classList.remove("on"); oo.innerHTML=""; v.ovNext=null; } else tutup(); };
  v.ovNext=nx;
  o.onclick=function(e){ e.stopPropagation(); if(e.target.closest("[data-x]")) nx(); };
  setTimeout(function(){ var b=o.querySelector("[data-x]"); if(b) try{b.focus();}catch(e){} },30);
}

/* ---------------- kartu judul episode ---------------- */
function kartuJudul(i){
  var v=V, B=BERKAS[i], g=i<NAWAL?BAGIAN[0]:BAGIAN[1];
  $("#vbg").style.backgroundImage='url("'+bgSrc(B.scn)+'")'; $("#vhd").innerHTML="";
  $("#dnm").textContent=""; $("#dtx").textContent=""; $("#dlg").style.visibility="hidden";
  var seb=i>0?'<div class="epseb"><span>Sebelumnya</span>'+esc(EPS[i-1].s)+'</div>':'';
  var o=buka('<div class="epjudul"><div class="eyebrow">'+g.n+' · '+g.t+'</div><div class="epn disp">Episode '+(i+1)+'</div>'+
    '<div class="ept disp">'+esc(EPS[i].j)+'</div><div class="epk2">'+esc(B.nama)+'</div>'+seb+
    '<button class="btn" data-x="1">Mulai ›</button></div>');
  var dipakai=false;
  var nx=function(){ if(dipakai||V!==v) return; dipakai=true; $("#vbg").classList.remove("kb"); tutup(); };
  v.ovNext=nx;
  o.onclick=function(e){ e.stopPropagation(); nx(); };
  requestAnimationFrame(function(){ $("#vbg").classList.add("kb"); });
  sfx("tap");
}

/* ---------------- keputusan ---------------- */
function putuskan(id){
  var v=V, D=DEC[id];
  var o=buka('<div class="dim2"></div><div class="dbox gl"><div class="dh">'+(S.mode==="kelompok"?"Keputusan tim · diskusikan dulu sebelum memilih":"Keputusan konsultan")+'</div><h3>'+esc(D.q)+'</h3>'+
    D.o.map(function(x,i){ return '<button class="dop" data-o="'+i+'"><span class="nb">'+(i+1)+'</span><span>'+esc(x.l)+'</span></button>'; }).join("")+'</div>');
  var dipakai=false;
  v.pick=function(i){
    var x=D.o[i]; if(dipakai||!x||V!==v) return; dipakai=true;
    var R0=nilaiRJ(); S.dec[id]=i; simpan(); var R1=nilaiRJ();
    sfx(x.best?"ok":"tap");
    var bag=[]; [["kep","Kepercayaan"],["int","Integritas"]].forEach(function(p){
      var d=R1[p[0]]-R0[p[0]];
      if(d) bag.push(p[1]+' <span class="'+(d>0?"naik":"turun")+'">'+(d>0?"+":"")+d+'</span>');
    });
    if(bag.length) toast(bag.join(" · "));
    v.steps.splice.apply(v.steps,[v.i+1,0].concat(x.r||[]));
    tutup();
  };
  o.onclick=function(e){ e.stopPropagation(); var b=e.target.closest(".dop"); if(b) v.pick(+b.getAttribute("data-o")); };
}

/* ============================================================
   MEJA KERJA (tahap matematika di dalam berkas)
   ============================================================ */
var G={kini:0,daftar:[],idx:0,salahPos:0,salahTahap:0,tahap:0};
function mulaiBerkas(i){
  G.kini=i; G.salahPos=0;
  var B=BERKAS[i];
  var pr=peranTim(i); if(pr) setTimeout(function(){ toast("Giliran peran · "+pr.map(function(x){return x.p+": "+esc(x.n);}).join(" · ")); },400);
  var R0=nilaiRJ();
  var langkah=[{judulEp:i}].concat(i===NAWAL&&!S.ulangIntro?ULANG_INTRO:[]).concat(B.alur);
  vn(langkah,function(){ selesaiBerkas(i,R0); },{back:true});
}
function batalBerkas(){
  var v=V; if(v){ clearInterval(v.tm); clearTimeout(v.at); }
  V=null;
  if(!S.prolog){ home(); return; }
  peta();
}
function mulaiKerja(daftar){
  G.daftar=daftar.slice(); G.idx=0;
  var B=BERKAS[G.kini];
  $("#posTtl").textContent=B.nama;
  $("#posSub").textContent="Episode "+(G.kini+1)+" · "+EPS[G.kini].j;
  $("#posBg").style.backgroundImage='url("'+bgSrc(B.scn)+'")';
  var ka=$("#kartuAdegan"); ka.style.backgroundImage='url("'+bgSrc(B.scn)+'")';
  ka.innerHTML='<img src="'+spSrc(B.klien,"bingung")+'" alt="">';
  $("#berkas").innerHTML="<ul>"+B.berkas.map(function(b){return "<li>"+b+"</li>";}).join("")+"</ul>"+peranHTML(G.kini);
  show("pos"); G.tahap=G.daftar[0]; G.salahTahap=0; renderTahap();
}
$("#posBack").addEventListener("click",function(){ batalBerkas(); });
function bintangHTML(b){
  if(b<0) return '<span class="mati">☆☆☆</span>';
  return "★".repeat(b)+'<span class="mati">'+"☆".repeat(3-b)+'</span>';
}
function renderTahap(){
  var B=BERKAS[G.kini], t=B.tahap[G.tahap];
  $("#posBintang").innerHTML=bintangHTML(Math.max(0,3-G.salahPos));
  $("#tanya").innerHTML=t.tanya+' <span class="mut" style="font-size:1.25cqw">(tahap '+(G.tahap+1)+' dari '+B.tahap.length+')</span>';
  $("#umpan").innerHTML=""; $("#aksi").innerHTML="";
  var A=$("#alat"); A.innerHTML="";
  ({pilihGambar:rPilihGambar,pilihKalimat:rPilihKalimat,ujiTitik:rUjiTitik,
    seretTitik:rSeretTitik,seretKartu:rSeretKartu,ketikKoordinat:rKetikKoordinat,
    ketikPertidaksamaan:rKetikPtd,ketikAngka:rKetikAngka})[t.tipe](t,A);
}
function adaTahapLagi(){ return G.idx<G.daftar.length-1; }
function lanjut(){
  if(adaTahapLagi()){ G.idx++; G.tahap=G.daftar[G.idx]; G.salahTahap=0; renderTahap(); return; }
  show("vn"); var v=V; if(v){ v.busy=false; adv(); }
}
function benarkan(pesan){
  sfx("ok");
  $("#umpan").innerHTML='<span class="ok"><b>Benar.</b></span> '+(pesan||"");
  var a=$("#aksi"); a.innerHTML="";
  var b=document.createElement("button"); b.className="btn";
  b.textContent=adaTahapLagi()?"Lanjut":"Sampaikan ke klien";
  b.addEventListener("click",lanjut); a.appendChild(b);
  setTimeout(function(){ try{b.focus();}catch(e){} },30);
}
/* bantuan dibuka bertahap; kunci muncul di percobaan ketiga */
function salahkan(t,bukaKunci){
  G.salahPos++; G.salahTahap++;
  if(t.jenis) S.catatan[t.jenis]=(S.catatan[t.jenis]||0)+1;
  $("#posBintang").innerHTML=bintangHTML(Math.max(0,3-G.salahPos));
  sfx("no");
  var a=$("#aksi"); a.innerHTML="";
  var u=$("#umpan");
  if(G.salahTahap===1) u.innerHTML='<span class="no"><b>Belum tepat.</b></span> Periksa lagi berkasnya.';
  else if(G.salahTahap===2) u.innerHTML='<span class="no"><b>Masih belum.</b></span> '+(t.nudge||"Baca ulang permintaan kliennya kalimat per kalimat.");
  else {
    u.innerHTML='<span class="no"><b>Belum tepat.</b></span> '+(t.bahas||"");
    if(bukaKunci) bukaKunci();
    var c=document.createElement("button"); c.className="btn"; c.textContent="Lanjut";
    c.addEventListener("click",lanjut); a.appendChild(c);
    return true;
  }
  var b=document.createElement("button"); b.className="btn gh"; b.textContent="Coba lagi";
  b.addEventListener("click",renderTahap); a.appendChild(b);
  return false;
}

/* ---------------- akhir episode ---------------- */
function selesaiBerkas(i,R0){
  var b=Math.max(0,3-G.salahPos);
  if(S.bintang[i]<0||b>S.bintang[i]) S.bintang[i]=b;
  if(i===S.buka&&S.buka<NB) S.buka=i+1;
  if(i===NAWAL) S.ulangIntro=true;
  simpan(); DRI=null;
  var R1=nilaiRJ(), nx=i+1;
  var bag=[["kep","Kepercayaan"],["int","Integritas"]].map(function(p){
    var d=R1[p[0]]-(R0?R0[p[0]]:R1[p[0]]);
    return '<div class="mt '+p[0]+'"><span><b>'+p[1]+'</b><b>'+R1[p[0]]+(d?' <em class="'+(d>0?"naik":"turun")+'">'+(d>0?"+":"")+d+'</em>':'')+'</b></span><i><b style="width:'+R1[p[0]]+'%"></b></i></div>';
  }).join("");
  var berikut=nx<NB?'Episode '+(nx+1)+' · '+EPS[nx].j:'Epilog · '+EPILOG.j;
  var baruBagian=nx===NAWAL?'<p class="mjp">Bagian 1 selesai. Seminggu kemudian, tiga klien akan kembali.</p>':'';
  var v=V; if(!v) return;
  var o=buka('<div class="dim2"></div><div class="mj gl epend"><div class="dh">Episode '+(i+1)+' selesai</div>'+
    '<h3>'+esc(EPS[i].j)+'</h3><div class="epbin">'+"★".repeat(b)+'<span>'+"☆".repeat(3-b)+'</span></div>'+
    '<div class="ebar2">'+bag+'</div>'+baruBagian+
    '<div class="epnext"><span>Berikutnya</span><b>'+esc(berikut)+'</b></div>'+
    '<div class="ft"><button class="btn gh" data-x="daftar">Daftar episode</button> <button class="btn" data-x="lanjut">Lanjutkan ›</button></div></div>');
  o.onclick=function(e){ e.stopPropagation(); var x=e.target.closest("[data-x]"); if(!x) return;
    var w=x.getAttribute("data-x"); sfx("tap");
    if(w==="daftar") peta(); else if(nx<NB) mulaiBerkas(nx); else laporanMingguan(); };
  v.ovNext=function(){ if(nx<NB) mulaiBerkas(nx); else laporanMingguan(); };
  sfx("win");
}
function laporanMingguan(){
  var h='<div class="testi">'+URUT_DEC.map(function(id){
    var c=S.dec[id], B=BERKAS.filter(function(x){return x.id===id;})[0];
    if(c==null) return '<div class="sedang"><b>'+esc(NM[B.klien])+'</b>Belum ada keputusan.</div>';
    var o=DEC[id].o[c];
    return '<div class="'+(o.best?"":(o.d.int<-6||o.d.kep<-6)?"buruk":"sedang")+'"><b>'+esc(NM[B.klien])+'</b>'+esc(o.testi)+'</div>';
  }).join("")+'</div>';
  var R=nilaiRJ(), ek=kunciAkhir(R);
  vn([{scn:"klinik",hd:"Laporan mingguan",cast:["p","hadi"]},
      ["hadi","Ini kabar dari klien-klienmu minggu ini. Mari kita baca bersama.","jelaskan"],
      {meja:{t:"Kabar dari klien",h:h}},
      ["hadi",END_HADI[ek],ek==="HH"?"senang":"jelaskan"]],
    function(){ S.akhir=true; simpan(); akhir(); },{back:false});
}

/* ============================================================
   DAFTAR EPISODE
   ============================================================ */
var DRI=null;
function bukaKah(i){ return i<=S.buka; }
function semuaSelesai(){ return S.bintang.every(function(x){return x>=0;}); }
var WARNA_EP={p:"#3f9f7a",b1:"#2f90d8",b2:"#d8892f",e:"#8f6ad8"};
function daftarDrum(){
  var R=nilaiRJ(), L=[{k:"prolog",l:"Prolog",ic:"P",c:WARNA_EP.p,sub:"Klinik Usaha · Pak Hadi",sp:["hadi","sapa"],bg:"klinik",
    j:"Klinik Usaha Dibuka",g:"Pembuka",kl:"Pak Hadi dan Raka",d:"Perkenalan dengan Klinik Usaha dan tiga catatan rekam jejak konsultan.",st:"Bisa diputar ulang kapan saja."}];
  BERKAS.forEach(function(B,i){
    var dn=S.bintang[i]>=0, lk=!bukaKah(i), g=i<NAWAL?BAGIAN[0]:BAGIAN[1];
    L.push({k:i,l:"Episode "+(i+1),ic:String(i+1),c:i<NAWAL?WARNA_EP.b1:WARNA_EP.b2,sub:EPS[i].j+" · "+NM[B.klien],
      sp:[B.klien,dn?"lega":"bingung"],bg:B.scn,j:EPS[i].j,g:g.n+" · "+g.t,kl:B.nama,d:EPS[i].l,
      dn:dn,lk:lk,st:dn?'Bintang terbaik: <b>'+"★".repeat(S.bintang[i])+"☆".repeat(3-S.bintang[i])+'</b>':"Belum dimainkan.",
      msg:i===NAWAL?"Selesaikan Bagian 1 (Episode 1–8) dulu.":"Selesaikan Episode "+i+" dulu."});
  });
  var bisa=semuaSelesai();
  L.push({k:"epilog",l:"Epilog",ic:"E",c:WARNA_EP.e,sub:EPILOG.j,sp:["hadi","senang"],bg:S.akhir?ENDS[kunciAkhir(R)].sc:"klinik",
    j:EPILOG.j,g:"Penutup",kl:"Pak Hadi",d:EPILOG.l,dn:S.akhir,lk:!bisa,st:S.akhir?"Akhir cerita: <b>"+ENDS[kunciAkhir(R)].n+"</b>":"Terbuka setelah semua episode selesai.",msg:"Selesaikan semua episode dulu."});
  return L;
}
function peta(){
  V=null; show("peta");
  $("#petaBg").style.backgroundImage='url("'+bgSrc("klinik")+'")';
  var R=nilaiRJ();
  $("#petaMeter").innerHTML=meterHTML(R);
  $("#petaSub").textContent=(S.nama||"Konsultan")+" · "+R.sel+" dari "+NB+" episode selesai";
  $("#petaBintang").textContent="★ "+R.bin+" / "+(NB*3);
  var L=daftarDrum();
  if(DRI==null||DRI>=L.length){ DRI=1; for(var i=0;i<NB;i++){ if(bukaKah(i)&&S.bintang[i]<0){ DRI=i+1; break; } } if(semuaSelesai()) DRI=L.length-1; }
  var N=L.length;
  $("#drum").innerHTML='<div class="drh">Gulir, geser, atau tekan tombol panah untuk memilih episode.</div><div class="mndots" style="top:'+(29.2+3.6-N*0.65)+'cqw">'+L.map(function(m,i){return '<i data-d="'+i+'"></i>';}).join("")+'</div>'+
    L.map(function(m,i){
      return '<button class="it'+(m.lk?' lk':'')+'" data-it="'+i+'" style="--c:'+m.c+'"><span class="itc">'+m.ic+'</span>'+
        '<span class="itl"><b>'+esc(m.l)+'</b><small>'+esc(m.sub)+'</small></span><span class="ar">'+(m.lk?"Terkunci":m.dn?"Selesai":"›")+'</span></button>';
    }).join("");
  DRUM=L; dpos(true);
}
var DRUM=[], DRS=null, DRT=0, DRSKIP=false;
function dpos(awal){
  var L=DRUM, N=L.length, h=Math.floor(N/2);
  L.forEach(function(m,i){
    var e=$('[data-it="'+i+'"]'), rel=((i-DRI+h+N)%N)-h, a=Math.abs(rel), sel=rel===0;
    e.style.top=(29.2+rel*8.125)+"cqw"; e.style.left=(5.5-Math.min(a,3)*1.4)+"cqw";
    e.style.transform="scale("+(sel?1:Math.max(.7,.9-.08*(a-1)))+")";
    e.style.opacity=a>=3?0:sel?1:a===1?.8:.45; e.style.pointerEvents=a>=3?"none":""; e.style.zIndex=10-a;
    e.tabIndex=sel?0:-1; e.classList.toggle("on",sel);
    var d=$('[data-d="'+i+'"]'); if(d) d.classList.toggle("on",sel);
  });
  var m=L[DRI];
  $("#mni").innerHTML='<div class="eyebrow">'+esc(m.g)+'</div><h3>'+esc(m.j)+'</h3><div class="kl">'+esc(m.kl)+'</div><p>'+esc(m.d)+'</p>'+
    (m.lk?'<div class="lkm">'+esc(m.msg)+'</div>':'<div class="stt">'+m.st+'</div>');
  var g=$("#gob"); g.textContent=m.lk?"Terkunci":(m.k==="prolog"?"Putar prolog":m.k==="epilog"?(m.dn?"Lihat akhir cerita":"Buka epilog"):(m.dn?"Main ulang ":"Mulai ")+m.l);
  g.classList.toggle("dis",!!m.lk);
  var bg=$("#ekBg"), src='url("'+bgSrc(m.bg)+'")';
  if(bg.style.backgroundImage!==src){ if(awal){ bg.style.backgroundImage=src; } else { bg.classList.add("ganti"); setTimeout(function(){ bg.style.backgroundImage=src; bg.classList.remove("ganti"); },180); } }
  var sp=$("#ekSp"); sp.classList.toggle("kunci",!!m.lk); sp.classList.remove("masuk"); void sp.offsetWidth;
  sp.innerHTML='<img src="'+spSrc(m.sp[0],m.sp[1])+'" alt="">'; sp.classList.add("masuk");
}
function dmv(d){ DRI=(DRI+d+DRUM.length)%DRUM.length; sfx("tap"); dpos(); }
function dopen(){
  var m=DRUM[DRI]; if(!m) return;
  if(m.lk){ sfx("no"); toast(m.msg); return; }
  sfx("ok");
  if(m.k==="prolog"){ vn(PROLOG,function(){ peta(); },{back:true}); return; }
  if(m.k==="epilog"){ if(S.akhir) akhir(); else laporanMingguan(); return; }
  mulaiBerkas(m.k);
}
$("#drum").addEventListener("click",function(e){
  var b=e.target.closest("[data-it]"); if(!b||DRSKIP) return; var i=+b.getAttribute("data-it");
  if(i===DRI) dopen(); else { DRI=i; sfx("tap"); dpos(); }
});
$("#gob").addEventListener("click",function(){ dopen(); });
$("#gsPeta").addEventListener("wheel",function(e){ e.preventDefault(); if(Date.now()-DRT>250){ DRT=Date.now(); dmv(e.deltaY>0?1:-1); } },{passive:false});
$("#gsPeta").addEventListener("pointerdown",function(e){ DRS=e.clientY; DRSKIP=false; });
$("#gsPeta").addEventListener("pointerup",function(e){
  if(DRS==null) return; var d=e.clientY-DRS; DRS=null;
  var skala=$("#stage").getBoundingClientRect().width/1280;
  if(Math.abs(d)>40*skala){ DRSKIP=true; dmv(d<0?1:-1); setTimeout(function(){ DRSKIP=false; },80); }
});
document.addEventListener("keydown",function(e){
  if(CUR!=="peta"||e.target.closest("input,textarea")) return;
  if(e.key==="ArrowDown"){ e.preventDefault(); dmv(1); }
  else if(e.key==="ArrowUp"){ e.preventDefault(); dmv(-1); }
  else if(e.key==="Enter"&&!e.target.closest(".icb")){ e.preventDefault(); dopen(); }
});
$("#petaHome").addEventListener("click",function(){ home(); });

/* ============================================================
   AKHIR CERITA
   ============================================================ */
function akhir(){
  V=null; var R=nilaiRJ(), ek=kunciAkhir(R), E=ENDS[ek];
  show("end");
  $("#endBg").style.backgroundImage='url("'+bgSrc(E.sc)+'")';
  $("#endSp").innerHTML='<img src="'+spSrc("p",ek==="LL"?"berpikir":"yakin")+'" alt="">';
  var nama={arsiran:"menentukan arah arsiran",garis:"membedakan garis penuh dan putus-putus",
    model:"menyusun model dari cerita",pojok:"menghitung titik pojok dan memilih yang paling untung",
    irisan:"membaca irisan sistem",tafsir:"menafsirkan hasil menjadi keputusan"};
  var lemah=null,n=0; Object.keys(S.catatan).forEach(function(k){ if(S.catatan[k]>n){ n=S.catatan[k]; lemah=k; } });
  var baris=BERKAS.map(function(B,i){
    var b=Math.max(0,S.bintang[i]);
    return '<div><span>'+(B.ulang?"↺ ":(i+1)+". ")+esc(B.pendek)+'</span><b>'+"★".repeat(b)+'<i>'+"☆".repeat(3-b)+'</i></b></div>';
  }).join("");
  $("#endBox").innerHTML=
    '<div class="eyebrow">Akhir cerita · '+esc(S.nama)+' · '+esc(S.kelas)+'</div>'+
    (S.mode==="kelompok"?'<div class="mut" style="font-size:1.2cqw">Anggota: '+S.anggota.map(esc).join(", ")+'</div>':'')+
    '<div class="h2 disp gold">'+E.n+'</div>'+
    '<p class="p">'+E.d+'</p>'+
    '<div class="ebar">'+meterHTML(R)+'</div>'+
    '<div class="bl">'+baris+'</div>'+
    (lemah?'<div class="note warn">Kekeliruan yang paling sering muncul: <b>'+nama[lemah]+'</b> ('+n+' kali). Ketepatan '+R.tepat+' dihitung dari '+R.bin+' dari '+(NB*3)+' bintang.</div>'
          :'<div class="note ok">Semua tahap dilewati tanpa satu pun kesimpulan yang meleset. Ketepatan '+R.tepat+' dari '+R.bin+' bintang.</div>')+
    '<div style="display:flex;gap:1cqw;flex-wrap:wrap">'+
    '<button class="btn" id="endUlang">Buka klinik lagi</button><button class="btn gh" data-go="peta">Daftar episode</button></div>';
  $("#endUlang").addEventListener("click",function(){
    var nm=S.nama,kl=S.kelas,tk=S.tokoh,md=S.mode,ag=S.anggota; S=baru(); S.nama=nm; S.kelas=kl; S.tokoh=tk; S.mode=md; S.anggota=ag; S.prolog=true; simpan(); peta();
  });
  sfx("win");
}

/* ============================================================
   GALERI ASET
   ============================================================ */
var GALF="Semua";
function galSrc(a){ if(a.jenis==="bg") return bgSrc(a.k); var i=a.k.lastIndexOf("_"); var k=a.k.slice(0,i),p=a.k.slice(i+1);
  return ASSET.sp[a.k]||phSp(k,p); }
function adaAset(a){ return a.jenis==="bg"?!!ASSET.bg[a.k]:!!ASSET.sp[a.k]; }
function galeri(){
  show("gal");
  var grup=["Semua","Halaman","Latar","Akhir","Tokoh","Klien","Musik"];
  $("#galF").innerHTML=grup.map(function(g){ return '<button class="btn gh sm'+(g===GALF?" on":"")+'" data-f="'+g+'">'+g+'</button>'; }).join("");
  var item=GALF==="Musik"?[]:ASETDAF.aset.filter(function(a){ return GALF==="Semua"||a.g===GALF; });
  var h=item.map(function(a){
    var i=ASETDAF.aset.indexOf(a);
    return '<button class="gt" data-g="'+i+'" style="font:inherit;color:inherit;text-align:left;cursor:pointer">'+
      '<div class="im '+(a.jenis==="sp"?"sp":"")+'" style="background-image:url(&quot;'+galSrc(a)+'&quot;)"></div>'+
      '<b>'+esc(a.t)+'</b><code>'+esc(a.berkas)+' · '+a.sz+'</code>'+
      '<span class="st '+(adaAset(a)?"ada":"belum")+'">'+(adaAset(a)?"Sudah ada":"Belum dibuat")+'</span></button>';
  }).join("");
  if(GALF==="Semua"||GALF==="Musik") h+=Object.keys(ASETDAF.musik).map(function(k){
    return '<button class="gt" data-m="'+k+'" style="font:inherit;color:inherit;text-align:left;cursor:pointer">'+
      '<div class="im" style="display:flex;align-items:center;justify-content:center;font-size:3cqw;color:#f0b64b">♪</div>'+
      '<b>Musik '+k+'</b><code>musik_'+k+'.mp3</code><span class="st '+(ASSET.mus[k]?"ada":"belum")+'">'+(ASSET.mus[k]?"Sudah ada":"Belum dibuat (musik sintesis dipakai)")+'</span></button>';
  }).join("");
  $("#galBox").innerHTML=h;
}
$("#galF").addEventListener("click",function(e){ var b=e.target.closest("[data-f]"); if(!b) return; GALF=b.getAttribute("data-f"); galeri(); });
$("#galBox").addEventListener("click",function(e){
  var g=e.target.closest("[data-g]"), m=e.target.closest("[data-m]");
  if(g){ var a=ASETDAF.aset[+g.getAttribute("data-g")]; lbx(galSrc(a),a.t,a.berkas+" · "+a.sz,a.p,a.jenis==="sp"); }
  if(m){ var k=m.getAttribute("data-m"); lbx("","Musik "+k,"musik_"+k+".mp3 · instrumental, bisa diulang",ASETDAF.musik[k]); }
});
function lbx(src,t,sub,p,sp){
  var L=$("#lbx");
  L.innerHTML='<div class="in gl"><div class="pv" style="'+(src?'background-image:url(&quot;'+src+'&quot;)':'')+(sp?';background-color:#13213f':'')+'"></div>'+
    '<div style="display:flex;flex-direction:column;gap:.8cqw;min-height:0"><div class="h3">'+esc(t)+'</div><code style="color:#9db2d2;font-size:1.15cqw">'+esc(sub)+'</code>'+
    '<pre id="lbxP">'+esc(p)+'</pre><div style="display:flex;gap:1cqw"><button class="btn" id="lbxC">Salin prompt</button><button class="btn gh" id="lbxX">Tutup</button></div></div></div>';
  L.classList.add("on");
  $("#lbxX").onclick=function(){ L.classList.remove("on"); L.innerHTML=""; };
  $("#lbxC").onclick=function(){ salin(p); toast("Prompt disalin"); };
}
function salin(t){
  function cad(){ var a=document.createElement("textarea"); a.value=t; document.body.appendChild(a); a.select(); try{document.execCommand("copy");}catch(e){} document.body.removeChild(a); }
  try{ if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).catch(cad); else cad(); }catch(e){ cad(); }
}

/* ---------------- mulai ---------------- */
var AEL=null, LAGU={}, LAGU_KINI="menu", MUSIK_DISENTUH=false;
try{ Object.keys(ASSET.mus).forEach(function(k){ var a=new Audio(ASSET.mus[k]); a.loop=true; a.volume=0.4; LAGU[k]=a; AEL=true; }); }catch(e){ AEL=null; }
function lagu(k){
  if(!AEL) return; if(!LAGU[k]) k=Object.keys(LAGU)[0]; LAGU_KINI=k;
  Object.keys(LAGU).forEach(function(n){ if(n!==k||!AUD.on){ try{ LAGU[n].pause(); }catch(e){} } });
  if(AUD.on&&LAGU[k].paused){ var pr=LAGU[k].play(); if(pr&&pr.catch) pr.catch(function(){}); }
}
/* musik menyala otomatis pada klik pertama di sampul, kecuali pemain sudah mengaturnya */
document.addEventListener("click",function(e){ if(e.target.closest(".muteBtn")) MUSIK_DISENTUH=true; },true);
$("#homeRow").addEventListener("click",function(){ if(AEL&&!AUD.on&&!MUSIK_DISENTUH){ MUSIK_DISENTUH=true; musicToggle(); } });
home();
