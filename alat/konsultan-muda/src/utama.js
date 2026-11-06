/* ============================================================
   KONSULTAN MUDA v2 — alur novel visual, meja kerja, episode, akhir
   ============================================================ */
var $=function(s,r){return (r||document).querySelector(s);};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function rp(n){return "Rp"+String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,".");}

/* ---------------- layar ---------------- */
var SCREENS={home:"gsHome",mode:"gsMode",id:"gsId",tokoh:"gsTokoh",vn:"gsVN",peta:"gsPeta",pos:"gsPos",end:"gsEnd",ref:"gsRef",prof:"gsProf",set:"gsSet",rapor:"gsRapor"};
var CUR="home";
function show(k){
  $$(".scr").forEach(function(e){e.classList.remove("on");});
  var el=document.getElementById(SCREENS[k]||k); if(el) el.classList.add("on");
  CUR=k;
  if(typeof AEL!=="undefined"&&AEL&&setv("ikut")) lagu(k==="vn"||k==="pos"?"cerita":"menu");
}
document.addEventListener("click",function(e){
  var t=e.target.closest("[data-go]"); if(!t) return;
  go(t.getAttribute("data-go"));
});
function go(k){
  if(k==="home") home();
  else if(k==="peta") peta();
  else if(k==="menu") menuUtama();
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
  catatan:{arsiran:0,garis:0,model:0,pojok:0,irisan:0,tafsir:0},dec:{},buka:0,prolog:false,ulangIntro:false,akhir:false,set:{}};}
var S=baru();
var SET_DEF={spd:18,auto:2200,sfx:true,ikut:true,vol:0.4};
function setv(k){ var o=S&&S.set||{}; return o[k]===undefined?SET_DEF[k]:o[k]; }
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
    tb("Lanjutkan sebagai "+S.nama+(S.mode==="kelompok"?" ("+S.anggota.length+" orang)":""),"",function(){ sfx("ok"); if(!S.prolog) prolog(); else menuUtama(); });
    tb("Mulai baru","gh",function(){ var st=S.set; S=baru(); S.set=st||{}; DRIX={menu:0,ep:null}; simpan(); pilihMode(); });
  } else tb("Buka klinik","",function(){ sfx("ok"); pilihMode(); });
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
    b.addEventListener("click",function(){ S.tokoh=t.id; simpan(); sfx("ok"); if(S.prolog) menuUtama(); else prolog(); });
    g.appendChild(b);
  });
}
function prolog(){ vn(PROLOG,function(){ S.prolog=true; simpan(); DRIX.ep=null; DRIX.menu=0; menuUtama(); },{back:false}); }

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
  },setv("spd"));
  v.tm=id;
}
function selesaiKetik(){
  var v=V; clearInterval(v.tm); v.tm=null; $("#dtx").textContent=v.full; v.typing=false; $("#dlg").classList.remove("typ"); jadwalAuto(v);
}
function jadwalAuto(v){
  if(!v.auto) return; clearTimeout(v.at); var s=v.i;
  v.at=setTimeout(function(){ if(V===v&&v.i===s&&!v.busy&&!v.typing) adv(); },setv("auto"));
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
function acak(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function putuskan(id){
  var v=V, D=DEC[id];
  var o=buka('<div class="dim2"></div><div class="dbox gl"><div class="dh">'+(S.mode==="kelompok"?"Keputusan tim · diskusikan dulu sebelum memilih":"Keputusan konsultan")+'</div><h3>'+esc(D.q)+'</h3>'+
    acak(D.o.map(function(_,i){ return i; })).map(function(i,n){ return '<button class="dop" data-o="'+i+'"><span class="nb">'+(n+1)+'</span><span>'+esc(D.o[i].l)+'</span></button>'; }).join("")+'</div>');
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
    ketikPertidaksamaan:rKetikPtd,ketikAngka:rKetikAngka,gambarGaris:rGambarGaris})[t.tipe](t,A);
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
  simpan(); DRIX.ep=null;
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
/* menu bergulir dipakai dua kali: Menu Utama dan Daftar Episode */
var DRMODE="menu", DRIX={menu:0,ep:null}, DRI=0;
function bukaKah(i){ return i<=S.buka; }
function semuaSelesai(){ return S.bintang.every(function(x){return x>=0;}); }
var WARNA_EP={p:"#3f9f7a",b1:"#2f90d8",b2:"#d8892f",e:"#8f6ad8"};
var IKON={
 main:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
 ref:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V5a2 2 0 0 1 2-2h14v15H6a2 2 0 0 0-2 2z"/><path d="M8 7h8M8 11h6"/></svg>',
 profil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
 set:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg>'
};
function daftarMenu(){
  var R=nilaiRJ(), nx=-1; for(var i=0;i<NB;i++){ if(bukaKah(i)&&S.bintang[i]<0){ nx=i; break; } }
  return [
   {k:"main",l:"Main",ic:IKON.main,c:"#d8892f",sub:"Prolog, 11 episode, dan epilog",sp:["p","yakin"],bg:"klinik",
    j:"Main",g:"Menu utama",kl:R.sel+" dari "+NB+" episode selesai",
    d:"Lanjutkan cerita di Klinik Usaha. Pilih episode, bantu klien menyusun model, lalu ambil keputusan yang jujur.",
    st:nx>=0?"Berikutnya: <b>Episode "+(nx+1)+" · "+esc(EPS[nx].j)+"</b>":(S.akhir?"Semua episode dan epilog selesai.":"Epilog sudah terbuka."),btn:"Buka daftar episode"},
   {k:"ref",l:"Referensi",ic:IKON.ref,c:"#7a4fb0",sub:"Sumber dan galeri aset",sp:["hadi","jelaskan"],bg:"sampul",
    j:"Referensi",g:"Menu utama",kl:"Sumber belajar dan ilustrasi",
    d:"Acuan kurikulum, buku rujukan, catatan tentang angka di dalam gim, serta galeri 50 ilustrasi lengkap dengan prompt pembuatnya.",
    st:"",btn:"Buka referensi"},
   {k:"profil",l:"Profil Pengembang",ic:IKON.profil,c:"#c0443c",sub:"Founder Rumatika",sp:["hadi","senang"],bg:"end_hh",
    j:"Profil Pengembang",g:"Menu utama",kl:"Yunas Chandra Perdana, M.Pd.",
    d:"Siapa yang membuat Konsultan Muda, tentang karya ini, dan cara menghubungi pengembangnya.",st:"",btn:"Buka profil"},
   {k:"set",l:"Pengaturan",ic:IKON.set,c:"#3f9f7a",sub:"Musik, teks, identitas, data",sp:["raka","santai"],bg:"end_lh",
    j:"Pengaturan",g:"Menu utama",kl:"Atur sesuai kelasmu",
    d:"Pilih musik latar dan volumenya, atur kecepatan teks dan mode otomatis, ubah identitas, atau mulai dari awal.",st:"",btn:"Buka pengaturan"}
  ];
}
function daftarEpisode(){
  var R=nilaiRJ(), L=[{k:"prolog",l:"Prolog",ic:"P",c:WARNA_EP.p,sub:"Klinik Usaha · Pak Hadi",sp:["hadi","sapa"],bg:"klinik",
    j:"Klinik Usaha Dibuka",g:"Pembuka",kl:"Pak Hadi dan Raka",d:"Perkenalan dengan Klinik Usaha dan tiga catatan rekam jejak konsultan.",st:"Bisa diputar ulang kapan saja.",btn:"Putar prolog"}];
  BERKAS.forEach(function(B,i){
    var dn=S.bintang[i]>=0, lk=!bukaKah(i), g=i<NAWAL?BAGIAN[0]:BAGIAN[1];
    L.push({k:i,l:"Episode "+(i+1),ic:String(i+1),c:i<NAWAL?WARNA_EP.b1:WARNA_EP.b2,sub:EPS[i].j+" · "+NM[B.klien],
      sp:[B.klien,dn?"lega":"bingung"],bg:B.scn,j:EPS[i].j,g:g.n+" · "+g.t,kl:B.nama,d:EPS[i].l,
      dn:dn,lk:lk,st:dn?'Bintang terbaik: <b>'+"★".repeat(S.bintang[i])+"☆".repeat(3-S.bintang[i])+'</b>':"Belum dimainkan.",
      msg:i===NAWAL?"Selesaikan Bagian 1 (Episode 1–8) dulu.":"Selesaikan Episode "+i+" dulu.",btn:(dn?"Main ulang ":"Mulai ")+"Episode "+(i+1)});
  });
  var bisa=semuaSelesai();
  L.push({k:"epilog",l:"Epilog",ic:"E",c:WARNA_EP.e,sub:EPILOG.j,sp:["hadi","senang"],bg:S.akhir?ENDS[kunciAkhir(R)].sc:"klinik",
    j:EPILOG.j,g:"Penutup",kl:"Pak Hadi",d:EPILOG.l,dn:S.akhir,lk:!bisa,st:S.akhir?"Akhir cerita: <b>"+ENDS[kunciAkhir(R)].n+"</b>":"Terbuka setelah semua episode selesai.",
    msg:"Selesaikan semua episode dulu.",btn:S.akhir?"Lihat akhir cerita":"Buka epilog"});
  return L;
}
function menuUtama(){ V=null; DRMODE="menu"; tampilDrum(daftarMenu(),"Menu Utama","Gulir, geser, atau tekan tombol panah untuk memilih menu."); }
function peta(){ V=null; DRMODE="ep"; tampilDrum(daftarEpisode(),"Daftar Episode","Gulir, geser, atau tekan tombol panah untuk memilih episode."); }
function tampilDrum(L,judul,petunjuk){
  show("peta");
  $("#drTtl").textContent=judul;
  $("#drBack").title=DRMODE==="ep"?"Kembali ke Menu Utama":"Kembali ke sampul";
  $("#petaBg").style.backgroundImage='url("'+bgSrc("klinik")+'")';
  var R=nilaiRJ();
  $("#petaMeter").innerHTML=meterHTML(R);
  $("#petaSub").textContent=(S.nama||"Konsultan")+" · "+R.sel+" dari "+NB+" episode selesai";
  $("#petaBintang").textContent="★ "+R.bin+" / "+(NB*3);
  var N=L.length;
  if(DRMODE==="ep"&&(DRIX.ep==null||DRIX.ep>=N)){
    var t=1; for(var i=0;i<NB;i++){ if(bukaKah(i)&&S.bintang[i]<0){ t=i+1; break; } } if(semuaSelesai()) t=N-1; DRIX.ep=t;
  }
  DRI=Math.min(DRIX[DRMODE]||0,N-1);
  $("#drum").innerHTML='<div class="drh">'+petunjuk+'</div><div class="mndots" style="top:'+(29.2+3.6-N*0.65)+'cqw">'+L.map(function(m,i){return '<i data-d="'+i+'"></i>';}).join("")+'</div>'+
    L.map(function(m,i){
      return '<button class="it'+(m.lk?' lk':'')+'" data-it="'+i+'" style="--c:'+m.c+'"><span class="itc">'+m.ic+'</span>'+
        '<span class="itl"><b>'+esc(m.l)+'</b><small>'+esc(m.sub)+'</small></span><span class="ar">'+(m.lk?"Terkunci":m.dn?"Selesai":"›")+'</span></button>';
    }).join("");
  DRUM=L; dpos(true);
}
var DRUM=[], DRS=null, DRT=0, DRSKIP=false;
function dpos(awal){
  var L=DRUM, N=L.length, h=Math.floor(N/2);
  DRIX[DRMODE]=DRI;
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
    (m.lk?'<div class="lkm">'+esc(m.msg)+'</div>':(m.st?'<div class="stt">'+m.st+'</div>':''));
  var g=$("#gob"); g.textContent=m.lk?"Terkunci":m.btn; g.classList.toggle("dis",!!m.lk);
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
  if(DRMODE==="menu"){ ({main:peta,ref:referensi,profil:profilPengembang,set:pengaturan})[m.k](); return; }
  if(m.k==="prolog"){ vn(PROLOG,function(){ peta(); },{back:true}); return; }
  if(m.k==="epilog"){ if(S.akhir) akhir(); else laporanMingguan(); return; }
  mulaiBerkas(m.k);
}
function drumKembali(){ sfx("tap"); if(DRMODE==="ep") menuUtama(); else home(); }
$("#drum").addEventListener("click",function(e){
  var b=e.target.closest("[data-it]"); if(!b||DRSKIP) return; var i=+b.getAttribute("data-it");
  if(i===DRI) dopen(); else { DRI=i; sfx("tap"); dpos(); }
});
$("#gob").addEventListener("click",function(){ dopen(); });
$("#drBack").addEventListener("click",drumKembali);
$("#gsPeta").addEventListener("wheel",function(e){ e.preventDefault(); if(Date.now()-DRT>250){ DRT=Date.now(); dmv(e.deltaY>0?1:-1); } },{passive:false});
$("#gsPeta").addEventListener("pointerdown",function(e){ DRS=e.clientY; DRSKIP=false; });
$("#gsPeta").addEventListener("pointerup",function(e){
  if(DRS==null) return; var d=e.clientY-DRS; DRS=null;
  var skala=$("#stage").getBoundingClientRect().width/1280;
  if(Math.abs(d)>40*skala){ DRSKIP=true; dmv(d<0?1:-1); setTimeout(function(){ DRSKIP=false; },80); }
});
document.addEventListener("keydown",function(e){
  if(e.target.closest("input,textarea")) return;
  if(e.key==="Escape"&&$("#lbx").classList.contains("on")){ $("#lbx").classList.remove("on"); $("#lbx").innerHTML=""; return; }
  if(e.key==="Escape"&&CUR==="rapor"){ raporKembali(); return; }
  if(e.key==="Escape"&&(CUR==="ref"||CUR==="prof"||CUR==="set")){ menuUtama(); return; }
  if(CUR!=="peta") return;
  if(e.key==="ArrowDown"){ e.preventDefault(); dmv(1); }
  else if(e.key==="ArrowUp"){ e.preventDefault(); dmv(-1); }
  else if(e.key==="Escape"){ e.preventDefault(); drumKembali(); }
  else if(e.key==="Enter"&&!e.target.closest(".icb")){ e.preventDefault(); dopen(); }
});

/* ============================================================
   AKHIR CERITA
   ============================================================ */
function akhir(diam){
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
    '<button class="btn sm" id="endRapor">Lihat rapor</button><button class="btn gh sm" id="endUlang">Buka klinik lagi</button><button class="btn gh sm" data-go="peta">Daftar episode</button><button class="btn gh sm" data-go="menu">Menu utama</button></div>';
  $("#endRapor").addEventListener("click",function(){ sfx("ok"); rapor("end"); });
  $("#endUlang").addEventListener("click",function(){
    var nm=S.nama,kl=S.kelas,tk=S.tokoh,md=S.mode,ag=S.anggota,st=S.set; S=baru(); S.nama=nm; S.kelas=kl; S.tokoh=tk; S.mode=md; S.anggota=ag; S.prolog=true; S.set=st; DRIX.ep=null; simpan(); peta();
  });
  if(!diam) sfx("win");
}

/* ============================================================
   REFERENSI
   ============================================================ */
function galSrc(a){ if(a.jenis==="bg") return bgSrc(a.k); var i=a.k.lastIndexOf("_"); var k=a.k.slice(0,i),p=a.k.slice(i+1);
  return ASSET.sp[a.k]||phSp(k,p); }
function adaAset(a){ return a.jenis==="bg"?!!ASSET.bg[a.k]:!!ASSET.sp[a.k]; }
var RFT=0, LBL=[];
function referensi(){
  show("ref"); $("#refBg").style.backgroundImage='url("'+bgSrc("sampul")+'")';
  $("#refTab").innerHTML=["Sumber","Galeri Aset"].map(function(t,i){ return '<button data-t="'+i+'" class="'+(i===RFT?"on":"")+'">'+t+'</button>'; }).join("");
  var B=$("#refBody"); B.scrollTop=0;
  if(RFT===0){
    B.className="panel gl rfl";
    B.innerHTML='<ol>'+
      '<li>Badan Standar, Kurikulum, dan Asesmen Pendidikan. (2024). <i>Keputusan Kepala BSKAP Nomor 032/H/KR/2024 tentang Capaian Pembelajaran pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah pada Kurikulum Merdeka</i>. Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi.'+
        '<small>Acuan elemen Aljabar dan Fungsi Fase E: sistem pertidaksamaan linear dua variabel.</small></li>'+
      '<li>Susanto, D., dkk. (2021). <i>Matematika untuk SMA/SMK Kelas X</i>. Pusat Kurikulum dan Perbukuan, Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi.'+
        '<small>Rujukan materi sistem pertidaksamaan linear: model, daerah penyelesaian, dan penafsirannya.</small></li>'+
      '<li>Rumatika. (2026). <i>RPP dan LKPD Konsultan Muda: Klinik Usaha</i>.'+
        '<small>Acuan alur kegiatan kelas, pembagian peran kelompok, dan lembar kerja yang menyertai gim ini.</small></li>'+
      '</ol>'+
      '<div class="note"><b>Tentang angka di dalam gim</b><p>Nama usaha, tokoh, harga, dan batasan di setiap episode adalah ilustrasi yang disusun agar soalnya masuk akal. Angka itu bukan data usaha yang sebenarnya.</p></div>'+
      '<div class="note"><b>Ilustrasi dan musik</b><p>Semua latar dan tokoh bergaya tanah liat tiga dimensi dibuat dengan bantuan kecerdasan buatan. Prompt setiap gambar bisa dilihat dan disalin di tab Galeri Aset. Musik latar berupa dua lagu instrumental, Golden Hour dan Curious Focus.</p></div>';
  } else {
    B.className="panel gl";
    LBL=[];
    var grup=[["Halaman","Sampul gim"],["Latar","Tempat usaha setiap episode"],["Akhir","Empat akhir cerita"],["Tokoh","Pemain, Pak Hadi, dan Raka"],["Klien","Para pelaku usaha"]];
    var h=grup.map(function(g){
      var it=ASETDAF.aset.filter(function(a){ return a.g===g[0]; }); if(!it.length) return "";
      var sp=it[0].jenis==="sp";
      return '<div class="glh">'+g[0]+'<small>'+g[1]+' · '+it.length+' gambar</small></div><div class="glg'+(sp?" sp":"")+'">'+
        it.map(function(a){ var n=LBL.length; LBL.push({src:galSrc(a),t:a.t,sub:a.berkas+" · "+a.sz,p:a.p,sp:sp});
          return '<button class="glt" data-l="'+n+'"><div class="im" style="background-image:url(&quot;'+galSrc(a)+'&quot;)"></div><span>'+esc(a.t)+'</span></button>'; }).join("")+'</div>';
    }).join("");
    var mk=Object.keys(ASETDAF.musik);
    h+='<div class="glh">Musik<small>Instrumental, diputar berulang · '+mk.length+' lagu</small></div><div class="glg">'+
      mk.map(function(k){ var n=LBL.length, I=LAGU_INFO[k]||{n:k,d:""}; LBL.push({src:"",t:"Musik: "+I.n,sub:"musik_"+k+".mp3 · "+I.d,p:ASETDAF.musik[k],sp:false});
        return '<button class="glt" data-l="'+n+'"><div class="im" style="display:grid;place-items:center;font-size:3cqw;color:#f0b64b">♪</div><span>'+esc(I.n)+'</span></button>'; }).join("")+'</div>';
    B.innerHTML=h;
  }
}
$("#refTab").addEventListener("click",function(e){ var b=e.target.closest("[data-t]"); if(!b) return; RFT=+b.getAttribute("data-t"); sfx("tap"); referensi(); });
$("#refBody").addEventListener("click",function(e){ var b=e.target.closest("[data-l]"); if(b) lbxBuka(+b.getAttribute("data-l")); });
var LBI=0;
function lbxBuka(n){
  LBI=(n+LBL.length)%LBL.length; var a=LBL[LBI], L=$("#lbx");
  L.innerHTML='<div class="in gl"><div class="pv" style="'+(a.src?'background-image:url(&quot;'+a.src+'&quot;)':'display:grid;place-items:center;font-size:8cqw;color:#f0b64b')+(a.sp?';background-color:#13213f':'')+'">'+(a.src?'':'♪')+'</div>'+
    '<div style="display:flex;flex-direction:column;gap:.8cqw;min-height:0"><div class="h3">'+esc(a.t)+'</div><code style="color:#9db2d2;font-size:1.15cqw">'+esc(a.sub)+'</code>'+
    '<pre>'+esc(a.p)+'</pre><div style="display:flex;gap:1cqw;align-items:center"><button class="btn sm" id="lbxC" style="white-space:nowrap">Salin prompt</button><button class="btn gh sm" id="lbxX">Tutup</button>'+
    '<div class="nav"><button class="btn gh sm" id="lbxP">‹</button><span style="white-space:nowrap">'+(LBI+1)+' / '+LBL.length+'</span><button class="btn gh sm" id="lbxN">›</button></div></div></div></div>';
  L.classList.add("on");
  $("#lbxX").onclick=lbxTutup;
  $("#lbxC").onclick=function(){ salin(a.p); toast("Prompt disalin"); };
  $("#lbxP").onclick=function(){ lbxBuka(LBI-1); };
  $("#lbxN").onclick=function(){ lbxBuka(LBI+1); };
}
function lbxTutup(){ var L=$("#lbx"); L.classList.remove("on"); L.innerHTML=""; }
$("#lbx").addEventListener("click",function(e){ if(e.target===this) lbxTutup(); });
document.addEventListener("keydown",function(e){
  if(!$("#lbx").classList.contains("on")) return;
  if(e.key==="ArrowRight"){ e.preventDefault(); lbxBuka(LBI+1); }
  else if(e.key==="ArrowLeft"){ e.preventDefault(); lbxBuka(LBI-1); }
});
function salin(t){
  function cad(){ var a=document.createElement("textarea"); a.value=t; document.body.appendChild(a); a.select(); try{document.execCommand("copy");}catch(e){} document.body.removeChild(a); }
  try{ if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).catch(cad); else cad(); }catch(e){ cad(); }
}

/* ============================================================
   PROFIL PENGEMBANG
   ============================================================ */
function profilPengembang(){
  show("prof"); $("#profBg").style.backgroundImage='url("'+bgSrc("klinik")+'")';
  var kel=S.mode==="kelompok", tk=(TOKOH.filter(function(t){ return t.id===S.tokoh; })[0]||{nm:"-"}).nm;
  $("#profBody").innerHTML=
    '<div class="gl pc pdev" style="justify-content:center"><div class="avat">YC</div><div class="lb">PENGEMBANG</div>'+
      '<h2 class="disp">Yunas Chandra Perdana, M.Pd.</h2><div class="rl">Founder Rumatika</div>'+
      '<dl><dt>Unit Kerja</dt><dd>SMPIT–SMAIT Nurul Ilmi</dd><dt>Email</dt><dd>yunaschandra29@gmail.com</dd><dt>Situs</dt><dd>rumatika.yunaschandra29.workers.dev</dd></dl></div>'+
    '<div class="gl pc"><div class="lb">TENTANG KARYA</div><h3 class="disp">Konsultan Muda: Klinik Usaha</h3>'+
      '<p>Gim novel visual Matematika Fase E tentang sistem pertidaksamaan linear dua variabel. Pemain menjadi konsultan muda yang menerjemahkan keluhan pelaku usaha menjadi model, wilayah penyelesaian, dan keputusan.</p>'+
      '<p style="color:#9db2d2">11 episode · 2 bagian · 4 akhir cerita · 3 JP (3 × 45 menit) · Versi 2 · November 2026. Bagian dari koleksi Rumatika.</p></div>'+
    '<div class="gl pc"><div class="lb">PEMAIN</div><h3 class="disp">'+esc(S.nama||"Belum diisi")+'</h3>'+
      '<p>Kelas '+esc(S.kelas||"-")+' · Mode '+(kel?"kelompok":"mandiri")+' · Tokoh '+esc(tk)+'</p>'+
      (kel&&S.anggota.length?'<p style="color:#9db2d2">Anggota: '+S.anggota.map(esc).join(", ")+'</p>':'')+
      '<div class="row"><button class="btn gh sm" id="profUbah">Ubah identitas</button></div></div>';
  $("#profUbah").onclick=function(){ sfx("ok"); pilihMode(); };
}

/* ============================================================
   PENGATURAN
   ============================================================ */
var LAGU_INFO={menu:{n:"Golden Hour",d:"Menu dan layar akhir"},cerita:{n:"Curious Focus",d:"Adegan cerita dan meja kerja"}};
var SET_TM=null;
function setSimpan(k,v){ S.set=S.set||{}; S.set[k]=v; simpan(); }
function mmss(s){ s=Math.max(0,Math.floor(s||0)); return Math.floor(s/60)+":"+("0"+s%60).slice(-2); }
function pengaturan(){
  show("set"); $("#setBg").style.backgroundImage='url("'+bgSrc("klinik")+'")';
  var R=nilaiRJ(), b1=0, b2=0; S.bintang.forEach(function(x,i){ if(x>=0){ if(i<NAWAL) b1++; else b2++; } });
  function ring(nil,maks,lab,sub,war){ var p=maks?Math.round(nil/maks*100):0;
    return '<div class="mc"><div class="rg" style="background:conic-gradient('+war+' '+p+'%,rgba(255,255,255,.12) 0)"><span>'+(maks===100?nil:nil+"/"+maks)+'</span></div><b>'+lab+'</b><small>'+sub+'</small></div>'; }
  function seg(k,pil){ return '<div style="display:flex;gap:.5cqw">'+pil.map(function(o){ return '<button class="sg'+(setv(k)===o[1]?" on":"")+'" data-s="'+k+'" data-v="'+o[1]+'">'+o[0]+'</button>'; }).join("")+'</div>'; }
  var mk=Object.keys(LAGU), adaLagu=!!AEL&&mk.length;
  $("#setBody").innerHTML=
    '<div class="pc smus"><div class="cv" id="cv"><i style="height:45%"></i><i style="height:80%"></i><i style="height:60%"></i><i style="height:95%"></i><i style="height:50%"></i><i style="height:70%"></i></div>'+
      '<div class="lb">MUSIK LATAR</div><div class="tkn disp" id="tkn"></div><div class="tkd" id="tkd"></div>'+
      (adaLagu?'<div class="mprog"><span id="mt0">0:00</span><div><i id="mpf"></i></div><span id="mtd">0:00</span></div>'+
        '<div class="mctl"><button class="sg" id="mPrev" title="Lagu sebelumnya">‹</button><button class="play" id="mPlay"></button><button class="sg" id="mNext" title="Lagu berikutnya">›</button></div>'+
        '<label class="vol"><span>Volume</span><input type="range" id="mVol" min="0" max="100" value="'+Math.round(setv("vol")*100)+'"></label>'+
        '<div style="display:flex;flex-direction:column;gap:.3cqw">'+mk.map(function(k){ var I=LAGU_INFO[k]||{n:k,d:""}; return '<button class="trk" data-k="'+k+'"><b>'+esc(I.n)+'</b><small>'+esc(I.d)+'</small></button>'; }).join("")+'</div>'
        :'<p class="fl">Berkas musik tidak tersedia; tombol musik memakai nada sintesis.</p><div class="mctl"><button class="play" id="mPlay"></button></div>')+
      '<div class="srow" style="margin-top:auto"><span>Ganti lagu otomatis (menu/cerita)</span>'+seg("ikut",[["Ya",true],["Tidak",false]])+'</div>'+
      '<div class="srow"><span>Efek suara</span>'+seg("sfx",[["Ya",true],["Tidak",false]])+'</div></div>'+
    '<div class="pc" style="grid-column:2 / span 2"><div style="display:flex;align-items:center"><div class="lb">PROGRES</div><button class="btn gh sm" id="sRapor" style="margin-left:auto">Lihat rapor</button></div><div class="pg5">'+
      ring(b1,NAWAL,"Bagian 1","Episode 1–8","#2f90d8")+ring(b2,NB-NAWAL,"Bagian 2","Episode 9–11","#d8892f")+
      ring(R.tepat,100,"Ketepatan",R.bin+" dari "+(NB*3)+" bintang","#f0b64b")+ring(R.kep,100,"Kepercayaan","Rekam jejak klien","#3f9f7a")+ring(R.int,100,"Integritas","Kejujuran keputusan","#8f6ad8")+'</div></div>'+
    '<div class="pc"><div class="lb">PROFIL SISWA</div>'+
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.9cqw"><label><div class="fl">'+(S.mode==="kelompok"?"Nama tim":"Nama")+'</div><input type="text" id="sNama" maxlength="40" value="'+esc(S.nama)+'"></label>'+
      '<label><div class="fl">Kelas</div><input type="text" id="sKelas" maxlength="20" value="'+esc(S.kelas)+'"></label></div>'+
      '<div class="srow"><span>Tokoh</span><div style="display:flex;gap:.5cqw">'+TOKOH.map(function(t){ return '<button class="sg'+(S.tokoh===t.id?" on":"")+'" data-tk="'+t.id+'">'+esc(t.nm)+'</button>'; }).join("")+'</div></div>'+
      '<div class="srow"><span>Kecepatan teks</span>'+seg("spd",[["Lambat",40],["Normal",18],["Cepat",7]])+'</div>'+
      '<div class="srow"><span>Jeda mode otomatis</span>'+seg("auto",[["Lambat",3800],["Normal",2200],["Cepat",1300]])+'</div>'+
      '<div class="row"><button class="btn gh sm" id="sMode">Ubah mode dan anggota</button></div></div>'+
    '<div class="pc"><div class="lb">MULAI DARI AWAL</div><p>Menghapus nama, bintang, keputusan, dan akhir cerita yang tersimpan di perangkat ini. Pengaturan musik dan teks juga kembali ke awal.</p>'+
      '<button class="rstb" id="sReset">Hapus progres</button></div>';
  var bd=$("#setBody");
  bd.querySelectorAll("[data-s]").forEach(function(b){ b.onclick=function(){
    var k=b.getAttribute("data-s"), v=b.getAttribute("data-v"); v=v==="true"?true:v==="false"?false:+v;
    setSimpan(k,v); sfx("tap"); if(k==="ikut"&&v) lagu(CUR==="vn"||CUR==="pos"?"cerita":"menu"); pengaturan(); }; });
  bd.querySelectorAll("[data-tk]").forEach(function(b){ b.onclick=function(){ S.tokoh=b.getAttribute("data-tk"); simpan(); sfx("tap"); pengaturan(); }; });
  bd.querySelectorAll("[data-k]").forEach(function(b){ b.onclick=function(){ MUSIK_DISENTUH=true; lagu(b.getAttribute("data-k")); if(!AUD.on) musicToggle(); setMusik(); }; });
  $("#sNama").onchange=function(){ var v=this.value.trim(); if(v.length>=2){ S.nama=v; simpan(); toast("Nama disimpan"); } else { this.value=S.nama; toast("Nama minimal dua huruf"); } };
  $("#sKelas").onchange=function(){ var v=this.value.trim(); if(v){ S.kelas=v; simpan(); toast("Kelas disimpan"); } else this.value=S.kelas; };
  $("#sMode").onclick=function(){ sfx("ok"); pilihMode(); };
  $("#sRapor").onclick=function(){ sfx("ok"); rapor("set"); };
  var rs=$("#sReset"), siap=false;
  rs.onclick=function(){
    if(!siap){ siap=true; rs.textContent="Klik lagi untuk menghapus"; setTimeout(function(){ if(rs.isConnected){ siap=false; rs.textContent="Hapus progres"; } },3500); return; }
    try{ localStorage.removeItem(KUNCI); }catch(e){} S=baru(); DRIX={menu:0,ep:null}; sfx("no"); toast("Progres dihapus"); home();
  };
  $("#mPlay").onclick=function(){ MUSIK_DISENTUH=true; musicToggle(); setMusik(); };
  if(adaLagu){
    $("#mPrev").onclick=function(){ var i=mk.indexOf(LAGU_KINI); MUSIK_DISENTUH=true; lagu(mk[(i-1+mk.length)%mk.length]); setMusik(); };
    $("#mNext").onclick=function(){ var i=mk.indexOf(LAGU_KINI); MUSIK_DISENTUH=true; lagu(mk[(i+1)%mk.length]); setMusik(); };
    $("#mVol").oninput=function(){ var v=+this.value/100; mk.forEach(function(k){ LAGU[k].volume=v; }); };
    $("#mVol").onchange=function(){ setSimpan("vol",+this.value/100); };
  }
  setMusik();
  clearInterval(SET_TM); SET_TM=setInterval(function(){ if(CUR!=="set"){ clearInterval(SET_TM); return; } setMusik(); },500);
}
function setMusik(){
  if(!$("#tkn")) return;
  var I=LAGU_INFO[LAGU_KINI]||{n:"Nada sintesis",d:"Musik cadangan"};
  if(!AEL) I={n:"Nada sintesis",d:"Musik cadangan bawaan gim"};
  $("#tkn").textContent=I.n; $("#tkd").textContent=I.d+(AUD.on?" · sedang diputar":" · berhenti");
  $("#mPlay").textContent=AUD.on?"❚❚":"▶"; $("#mPlay").title=AUD.on?"Jeda musik":"Putar musik";
  $("#cv").classList.toggle("on",!!AUD.on);
  $$("#setBody .trk").forEach(function(b){ b.classList.toggle("on",b.getAttribute("data-k")===LAGU_KINI); });
  var a=AEL&&LAGU[LAGU_KINI];
  if(a&&$("#mpf")){ var d=a.duration||0; $("#mpf").style.width=(d?a.currentTime/d*100:0)+"%"; $("#mt0").textContent=mmss(a.currentTime); $("#mtd").textContent=mmss(d); }
}

/* ============================================================
   RAPOR (bisa dicetak atau disimpan sebagai PDF)
   ============================================================ */
var ASPEK=[
 {k:"model",n:"Menyusun model pertidaksamaan dari cerita",
  kuat:"Mampu mengubah keterangan klien menjadi pertidaksamaan yang tepat, termasuk memilih tanda yang sesuai.",
  saran:"Latih kebiasaan menandai setiap kendala pada cerita: apa yang dibatasi, berapa batasnya, dan apakah batas itu boleh tepat dicapai."},
 {k:"garis",n:"Menggambar garis batas dan memaknai tanda < atau ≤",
  kuat:"Mampu menggambar garis batas dari dua titik dan membedakan garis penuh (≤, ≥) dengan garis putus-putus (<, >).",
  saran:"Gambar garis dari dua titik potong sumbu (x = 0 lalu y = 0), kemudian periksa apakah titik tepat di garis ikut memenuhi."},
 {k:"arsiran",n:"Menentukan daerah (arsiran) yang memenuhi",
  kuat:"Mampu menentukan sisi yang diarsir dengan uji titik, tidak hanya menebak dari arah tanda.",
  saran:"Biasakan uji titik (0, 0) atau titik lain di luar garis sebelum menentukan arah arsiran."},
 {k:"irisan",n:"Menentukan irisan beberapa kendala",
  kuat:"Mampu membaca daerah yang memenuhi semua kendala sekaligus.",
  saran:"Periksa setiap kendala satu per satu; titik yang benar harus lolos semuanya, bukan sebagian."},
 {k:"pojok",n:"Menentukan titik pojok dan nilai terbaik",
  kuat:"Mampu menghitung titik potong dua garis dan membandingkan nilai pada titik-titik pojok.",
  saran:"Ulangi langkah eliminasi atau substitusi dengan rapi, lalu cek hasilnya ke kedua persamaan."},
 {k:"tafsir",n:"Menafsirkan hasil menjadi keputusan",
  kuat:"Mampu menerjemahkan hasil hitung menjadi saran yang bisa dijalankan klien.",
  saran:"Setelah menemukan angka, tuliskan kembali artinya dalam kalimat klien: berapa yang dibuat, dan apa akibatnya."}
];
function jumlahTahap(){ var n={}; BERKAS.forEach(function(B){ B.tahap.forEach(function(t){ n[t.jenis]=(n[t.jenis]||0)+1; }); }); return n; }
function capaianAspek(k,nT){
  var e=S.catatan[k]||0, r=nT?e/nT:0;
  if(e===0) return {e:e,lv:4,n:"Sangat baik"};
  if(r<=0.5) return {e:e,lv:3,n:"Baik"};
  if(r<=1) return {e:e,lv:2,n:"Cukup"};
  return {e:e,lv:1,n:"Perlu bimbingan"};
}
function epsDenganJenis(k){
  var L=[]; BERKAS.forEach(function(B,i){ if(B.tahap.some(function(t){return t.jenis===k;})) L.push("Episode "+(i+1)); });
  return L.slice(0,3).join(", ");
}
function tglIndo(d){ var b=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  return d.getDate()+" "+b[d.getMonth()]+" "+d.getFullYear(); }
function raporHTML(){
  var R=nilaiRJ(), ek=kunciAkhir(R), E=ENDS[ek], nT=jumlahTahap(), kel=S.mode==="kelompok";
  var tk=(TOKOH.filter(function(t){ return t.id===S.tokoh; })[0]||{nm:"-"}).nm;
  var tgl=setv("tgl")||tglIndo(new Date()), guru=setv("guru"), nip=setv("nip"), tempat=setv("tempat");
  var selesai=R.sel===NB&&S.akhir;
  function bar(n){ return '<span class="rbar"><i style="width:'+n+'%"></i></span><b>'+n+'</b>'; }
  var asp=ASPEK.map(function(a){ var c=capaianAspek(a.k,nT[a.k]||0); a.c=c; return a; });
  var kuat=asp.filter(function(a){ return a.c.lv>=3; }), lemah=asp.filter(function(a){ return a.c.lv<=2; });
  lemah.sort(function(a,b){ return a.c.lv-b.c.lv; });
  var poinKuat=kuat.map(function(a){ return a.kuat; }), poinSaran=lemah.map(function(a){ return a.saran+" Ulangi "+epsDenganJenis(a.k)+"."; });
  if(R.int>=70) poinKuat.push("Berani menyampaikan hasil hitung apa adanya, walaupun kabarnya tidak menyenangkan bagi klien.");
  else poinSaran.push("Integritas masih "+R.int+". Sampaikan hasil hitung apa adanya; keputusan yang jujur melindungi klien dari kerugian.");
  if(R.kep>=70) poinKuat.push("Memberi saran yang jelas dan bisa dijalankan sehingga klien percaya.");
  else poinSaran.push("Kepercayaan klien masih "+R.kep+". Selain menolak rencana yang tidak mungkin, tawarkan pilihan lain yang masuk akal.");
  if(!poinSaran.length) poinSaran.push("Pertahankan ketelitian. Coba jelaskan cara kerjamu kepada teman yang masih kesulitan.");
  if(!poinKuat.length) poinKuat.push("Sudah menyelesaikan "+R.sel+" episode dan mengenal alur kerja konsultan: model, grafik, titik pojok, lalu keputusan.");
  var eps=BERKAS.map(function(B,i){
    var b=S.bintang[i], D=DEC[B.id], c=S.dec[B.id], kp="–";
    if(D&&c!=null){ var o=D.o[c]; kp=o.best?"Terbaik":((o.d.kep||0)+(o.d.int||0)>=0?"Cukup":"Kurang tepat"); }
    else if(D) kp="Belum";
    return '<tr><td>'+(i+1)+'</td><td><b>'+esc(EPS[i].j)+'</b> <span>· '+esc(B.nama)+'</span></td><td class="c bin">'+
      (b<0?'<span class="mut">belum</span>':"★".repeat(b)+'<span class="mut">'+"☆".repeat(3-b)+'</span>')+'</td><td class="c">'+kp+'</td></tr>';
  }).join("");
  var hadi=END_HADI[ek].replace(/\{N\}/g,S.nama||"Konsultan");
  return '<div class="rpg">'+
   '<div class="rhead"><div><div class="rk">RAPOR KEGIATAN · MATEMATIKA FASE E</div><h1>Konsultan Muda: Klinik Usaha</h1>'+
     '<div class="rs">Sistem pertidaksamaan linear dua variabel · Alokasi waktu 3 JP (3 × 45 menit)</div></div>'+
     '<div class="rlogo">Rumatika</div></div>'+
   (selesai?'':'<div class="rwarn">Rapor sementara: baru '+R.sel+' dari '+NB+' episode yang selesai'+(S.akhir?'':' dan epilog belum dibuka')+'.</div>')+
   '<table class="rid"><tr><th>'+(kel?"Nama tim":"Nama")+'</th><td>'+esc(S.nama||"-")+'</td><th>Kelas</th><td>'+esc(S.kelas||"-")+'</td></tr>'+
     '<tr><th>Mode</th><td>'+(kel?"Kelompok":"Mandiri")+'</td><th>Tokoh</th><td>'+esc(tk)+'</td></tr>'+
     (kel?'<tr><th>Anggota</th><td colspan="3">'+(S.anggota.length?S.anggota.map(esc).join(", "):"-")+'</td></tr>':'')+
     '<tr><th>Tanggal</th><td colspan="3">'+esc(tgl)+'</td></tr></table>'+
   '<h2>1. Ringkasan hasil</h2>'+
   '<div class="rsum"><div class="rend"><div class="rk">AKHIR CERITA</div><b>'+(S.akhir?E.n:"Belum ditentukan")+'</b><p>'+(S.akhir?E.d:"Akhir cerita muncul setelah semua episode dan laporan mingguan selesai.")+'</p></div>'+
     '<table class="rmet"><tr><th>Episode selesai</th><td><b>'+R.sel+'</b> dari '+NB+'</td></tr><tr><th>Bintang</th><td><b>'+R.bin+'</b> dari '+(NB*3)+'</td></tr>'+
     '<tr><th>Ketepatan</th><td>'+bar(R.tepat)+'</td></tr><tr><th>Kepercayaan</th><td>'+bar(R.kep)+'</td></tr><tr><th>Integritas</th><td>'+bar(R.int)+'</td></tr></table></div>'+
   '<p class="rnote">Ketepatan dihitung dari bintang (3 bintang jika benar tanpa salah, berkurang satu setiap kekeliruan). Kepercayaan dan Integritas berangkat dari 50 dan berubah menurut keputusan pada setiap episode.</p>'+
   '<h2>2. Hasil per episode</h2>'+
   '<table class="rtab"><thead><tr><th>No</th><th>Episode</th><th class="c">Bintang</th><th class="c">Keputusan</th></tr></thead><tbody>'+eps+'</tbody></table>'+
   '<h2>3. Capaian per aspek</h2>'+
   '<table class="rtab"><thead><tr><th>Aspek</th><th class="c">Tahap</th><th class="c">Kekeliruan</th><th class="c">Capaian</th></tr></thead><tbody>'+
     asp.map(function(a){ return '<tr><td>'+esc(a.n)+'</td><td class="c">'+(nT[a.k]||0)+'</td><td class="c">'+a.c.e+'</td><td class="c"><span class="rlv l'+a.c.lv+'">'+a.c.n+'</span></td></tr>'; }).join("")+'</tbody></table>'+
   '<h2>4. Umpan balik</h2>'+
   '<div class="rfb"><div><div class="rk">KEKUATAN</div><ul>'+poinKuat.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul></div>'+
     '<div><div class="rk">PERLU DITINGKATKAN</div><ul>'+poinSaran.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul></div></div>'+
   '<div class="rquote"><b>Pesan Pak Hadi</b> '+esc(hadi)+'</div>'+
   '<h2>5. Refleksi '+(kel?"tim":"siswa")+'</h2>'+
   '<div class="rref"><p>Hal yang paling '+(kel?"kami":"saya")+' pahami hari ini:</p><i></i><i></i>'+
     '<p>Hal yang masih membingungkan:</p><i></i><i></i>'+
     '<p>Keputusan yang paling sulit dan alasannya:</p><i></i><i></i></div>'+
   '<h2>6. Catatan guru</h2><div class="rref"><i></i><i></i></div>'+
   '<div class="rttd"><div><p>&nbsp;</p><p>'+(kel?"Ketua tim":"Siswa")+'</p><div class="sp"></div><b>'+esc(kel&&S.anggota[0]?S.anggota[0]:(S.nama||"..............................."))+'</b></div>'+
     '<div><p>'+esc(tempat||"................")+', '+esc(tgl)+'</p><p>Guru Mata Pelajaran Matematika</p><div class="sp"></div><b>'+esc(guru||"...............................")+'</b>'+
     '<p class="nip">NIP. '+esc(nip||"...............................")+'</p></div></div>'+
   '<div class="rfoot">Dicetak dari Konsultan Muda: Klinik Usaha · Rumatika · rumatika.yunaschandra29.workers.dev</div>'+
  '</div>';
}
var RAPOR_DARI="end";
function rapor(dari){
  if(dari) RAPOR_DARI=dari;
  show("rapor"); $("#rapBg").style.backgroundImage='url("'+bgSrc("klinik")+'")';
  function inp(id,lab,k,ph){ return '<label><div class="fl">'+lab+'</div><input type="text" id="'+id+'" data-k="'+k+'" maxlength="60" placeholder="'+ph+'" value="'+esc(setv(k)||"")+'"></label>'; }
  $("#rapForm").innerHTML='<div class="lb">RAPOR KONSULTAN</div><h2 class="disp">Rapor dan umpan balik</h2>'+
    '<p>Isi data guru, lalu cetak. Untuk menyimpan sebagai PDF, pilih <b>Simpan sebagai PDF</b> di jendela cetak.</p>'+
    inp("rGuru","Nama guru","guru","Nama lengkap dan gelar")+inp("rNip","NIP (boleh dikosongkan)","nip","")+
    inp("rTempat","Tempat","tempat","Misalnya Bekasi")+inp("rTgl","Tanggal","tgl",tglIndo(new Date()))+
    '<div class="row"><button class="btn" id="rCetak">Cetak rapor</button><button class="btn gh" id="rKembali">Kembali</button></div>';
  $$("#rapForm input").forEach(function(el){ el.oninput=function(){ S.set=S.set||{}; S.set[el.getAttribute("data-k")]=el.value.trim(); simpan(); raporIsi(); }; });
  $("#rCetak").onclick=function(){ sfx("ok"); raporIsi(); setTimeout(function(){ window.print(); },60); };
  $("#rKembali").onclick=function(){ sfx("tap"); raporKembali(); };
  raporIsi();
  $("#rapPrev").scrollTop=0;
}
function raporKembali(){ if(RAPOR_DARI==="set") pengaturan(); else if(RAPOR_DARI==="end") akhir(true); else menuUtama(); }
function raporIsi(){
  var h=raporHTML();
  var c=$("#raporCetak"); c.innerHTML=h;
  var p=$("#rapPrev"); p.innerHTML='<div class="rdoc prev"><div class="rsc">'+h+'</div></div>';
  raporSkala();
}
function raporSkala(){
  var p=$("#rapPrev"); if(!p||CUR!=="rapor") return; var d=p.querySelector(".rdoc"), sc=p.querySelector(".rsc"); if(!d) return;
  var s=(p.clientWidth-16)/794; sc.style.transform="scale("+s+")"; d.style.height=(sc.offsetHeight*s)+"px"; d.style.width=(794*s)+"px";
}
window.addEventListener("resize",raporSkala);

/* ---------------- mulai ---------------- */
var AEL=null, LAGU={}, LAGU_KINI="menu", MUSIK_DISENTUH=false;
try{ Object.keys(ASSET.mus).forEach(function(k){ var a=new Audio(ASSET.mus[k]); a.loop=true; a.volume=setv("vol"); LAGU[k]=a; AEL=true; }); }catch(e){ AEL=null; }
function lagu(k){
  if(!AEL) return; if(!LAGU[k]) k=Object.keys(LAGU)[0]; LAGU_KINI=k;
  Object.keys(LAGU).forEach(function(n){ if(n!==k||!AUD.on){ try{ LAGU[n].pause(); }catch(e){} } });
  if(AUD.on&&LAGU[k].paused){ var pr=LAGU[k].play(); if(pr&&pr.catch) pr.catch(function(){}); }
}
/* musik menyala otomatis pada klik pertama di sampul, kecuali pemain sudah mengaturnya */
document.addEventListener("click",function(e){ if(e.target.closest(".muteBtn")) MUSIK_DISENTUH=true; },true);
$("#homeRow").addEventListener("click",function(){ if(AEL&&!AUD.on&&!MUSIK_DISENTUH){ MUSIK_DISENTUH=true; musicToggle(); } });
home();
