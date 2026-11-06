/* ---------------- jenis interaksi ---------------- */
function rPilihGambar(t,A){
  var box=document.createElement("div");
  box.className="gopts"+(t.opsi.length===2?" dua":"");
  var urut=t.opsi.map(function(_,i){return i;});
  for(var i=urut.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var tmp=urut[i];urut[i]=urut[j];urut[j]=tmp; }
  box.dataset.urut=urut.join(",");
  urut.forEach(function(idx,pos){
    var K=t.opsi[idx].cons.map(parseCons), v=autoView(K);
    var d=document.createElement("div"); d.className="gopt"; d.setAttribute("tabindex","0");
    d.innerHTML=plotSVG({view:v,cons:K,region:true,step:v.step,labelStep:v.step,small:true})+
      '<div class="cap">Gambar '+String.fromCharCode(65+pos)+'</div>';
    d.addEventListener("click",function(){
      if(box.dataset.kunci) return;
      if(idx===t.benar){ box.dataset.kunci="1"; d.classList.add("benar"); benarkan(t.bahas); }
      else{
        d.classList.add("salah");
        var kunci=salahkan(t,function(){
          box.children[urut.indexOf(t.benar)].classList.add("benar");
        });
        if(kunci) box.dataset.kunci="1";
      }
    });
    d.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); d.click(); } });
    box.appendChild(d);
  });
  A.appendChild(box);
}
function rPilihKalimat(t,A){
  var box=document.createElement("div"); box.className="kopts";
  t.opsi.forEach(function(teks,i){
    var b=document.createElement("button"); b.className="kopt"; b.type="button"; b.textContent=teks;
    b.addEventListener("click",function(){
      if(box.dataset.kunci) return;
      if(i===t.benar){ box.dataset.kunci="1"; b.classList.add("benar"); benarkan(t.bahas); }
      else{
        b.classList.add("salah"); b.disabled=true;
        var kunci=salahkan(t,function(){ box.children[t.benar].classList.add("benar"); });
        if(kunci) box.dataset.kunci="1";
      }
    });
    box.appendChild(b);
  });
  A.appendChild(box);
}
function rUjiTitik(t,A){
  var K=t.cons.map(parseCons), v=autoView(K), pilih={};
  var row=document.createElement("div"); row.className="kerjaRow";
  var kiri=document.createElement("div"); kiri.className="bidang";
  var kanan=document.createElement("div"); kanan.className="sisi";
  row.appendChild(kiri); row.appendChild(kanan); A.appendChild(row);
  function gambar(){
    kiri.innerHTML=plotSVG({view:v,cons:K,region:false,step:v.step,labelStep:v.step,
      pts:t.rencana.map(function(r,i){
        return {x:r.x,y:r.y,col:pilih[i]?"#49c6b8":"#7f96ba",r:6,label:String.fromCharCode(65+i)};
      })});
  }
  t.rencana.forEach(function(r,i){
    var d=document.createElement("div"); d.className="rencana"; d.setAttribute("tabindex","0");
    d.innerHTML='<b>'+r.nama+'</b> <span class="mathline">('+r.x+", "+r.y+')</span>'+
      '<span class="ket">'+r.x+' '+(t.satX||'')+', '+r.y+' '+(t.satY||'')+'</span>';
    d.addEventListener("click",function(){
      if(row.dataset.kunci) return;
      pilih[i]=!pilih[i]; d.classList.toggle("pilih",!!pilih[i]); sfx("tap"); gambar();
    });
    d.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); d.click(); } });
    kanan.appendChild(d);
  });
  gambar();
  var kirim=document.createElement("button"); kirim.className="btn"; kirim.textContent="Kirim laporan";
  kirim.addEventListener("click",function(){
    if(row.dataset.kunci) return;
    var semua=true;
    t.rencana.forEach(function(r,i){ if(satAll(K,r.x,r.y)!==!!pilih[i]) semua=false; });
    if(semua){
      row.dataset.kunci="1";
      t.rencana.forEach(function(r,i){ kanan.children[i].classList.add("benar"); });
      benarkan(t.pesanBenar);
    } else {
      var kunci=salahkan(t,function(){
        t.rencana.forEach(function(r,i){
          var aman=satAll(K,r.x,r.y);
          kanan.children[i].classList.add(aman===!!pilih[i]?"benar":"salah");
          var langgar=null; for(var q=0;q<K.length;q++){ if(!sat(K[q],r.x,r.y)){ langgar=K[q]; break; } }
          kanan.children[i].querySelector(".ket").textContent=
            aman?"memenuhi semua kendala":"melanggar "+langgar.teks;
        });
      });
      if(kunci) row.dataset.kunci="1";
    }
  });
  document.getElementById("aksi").appendChild(kirim);
}
function rSeretTitik(t,A){
  var K=t.cons.map(parseCons), v=autoView(K), titik={x:1,y:1};
  var row=document.createElement("div"); row.className="kerjaRow";
  var kiri=document.createElement("div"); kiri.className="bidang";
  var kanan=document.createElement("div"); kanan.className="sisi";
  row.appendChild(kiri); row.appendChild(kanan); A.appendChild(row);
  function gambar(){
    kiri.innerHTML=plotSVG({view:v,cons:K,region:false,step:v.step,labelStep:v.step,
      pts:[{x:titik.x,y:titik.y,col:"#f0b64b",r:8,label:"("+titik.x+", "+titik.y+")"}]});
    var h='<div class="lbl">Rencana sekarang</div><div class="mathline" style="font-size:1.9cqw">('+
      titik.x+", "+titik.y+')</div>';
    t.sumber.forEach(function(s){
      h+='<div class="rencana"><b>'+s.nama+'</b><span class="ket">sisa '+
         numStr(s.total-(s.a*titik.x+s.b*titik.y))+" "+s.sat+'</span></div>';
    });
    kanan.innerHTML=h;
  }
  function set(mx,my){
    var x=Math.max(0,Math.min(Math.ceil(v.x1),Math.round(mx)));
    var y=Math.max(0,Math.min(Math.ceil(v.y1),Math.round(my)));
    if(x!==titik.x||y!==titik.y){ titik.x=x; titik.y=y; gambar(); }
  }
  var seret=false;
  function dari(ev){ var m=clickMath(kiri,ev,v); set(m.x,m.y); }
  kiri.addEventListener("pointerdown",function(e){ if(row.dataset.kunci) return; seret=true;
    if(kiri.setPointerCapture) kiri.setPointerCapture(e.pointerId); dari(e); e.preventDefault(); });
  kiri.addEventListener("pointermove",function(e){ if(seret&&!row.dataset.kunci) dari(e); });
  kiri.addEventListener("pointerup",function(){ seret=false; });
  kiri.addEventListener("pointercancel",function(){ seret=false; });
  kiri.addEventListener("click",function(e){ if(!row.dataset.kunci) dari(e); });
  gambar();
  var a=document.getElementById("aksi");
  var nav=document.createElement("div"); nav.style.cssText="display:flex;gap:.5cqw";
  [["x −1",-1,0],["x +1",1,0],["y −1",0,-1],["y +1",0,1]].forEach(function(k){
    var b=document.createElement("button"); b.className="btn gh sm"; b.textContent=k[0];
    b.addEventListener("click",function(){ if(!row.dataset.kunci) set(titik.x+k[1],titik.y+k[2]); });
    nav.appendChild(b);
  });
  a.appendChild(nav);
  var kirim=document.createElement("button"); kirim.className="btn"; kirim.textContent="Serahkan rencana";
  kirim.addEventListener("click",function(){
    if(row.dataset.kunci) return;
    if(titik.x===t.target[0]&&titik.y===t.target[1]){ row.dataset.kunci="1"; benarkan(t.pesanBenar); }
    else{
      var kunci=salahkan(t,function(){ titik.x=t.target[0]; titik.y=t.target[1]; gambar(); });
      if(kunci) row.dataset.kunci="1";
    }
  });
  a.appendChild(kirim);
}
function rSeretKartu(t,A){
  var wrap=document.createElement("div");
  wrap.style.cssText="display:flex;flex-direction:column;gap:1.1cqw";
  var srow=document.createElement("div"); srow.className="slotrow";
  var lbl=document.createElement("div"); lbl.className="lbl"; lbl.textContent="Kartu tersedia";
  var bank=document.createElement("div"); bank.className="bank";
  wrap.appendChild(srow); wrap.appendChild(lbl); wrap.appendChild(bank); A.appendChild(wrap);
  var sel={t:null};
  t.slot.forEach(function(nm,i){
    var d=document.createElement("div"); d.className="slotbox"; d.dataset.i=i;
    d.innerHTML='<div>'+nm+'</div>';
    d.addEventListener("dragover",function(e){ e.preventDefault(); d.classList.add("over"); });
    d.addEventListener("dragleave",function(){ d.classList.remove("over"); });
    d.addEventListener("drop",function(e){ e.preventDefault(); d.classList.remove("over");
      taruh(d,e.dataTransfer.getData("text")); });
    d.addEventListener("click",function(){ if(sel.t) taruh(d,sel.t); });
    srow.appendChild(d);
  });
  var kartu=t.jawab.concat(t.umpan);
  for(var i=kartu.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1));
    var tmp=kartu[i]; kartu[i]=kartu[j]; kartu[j]=tmp; }
  kartu.forEach(function(teks){
    var k=document.createElement("div"); k.className="kartu"; k.textContent=teks; k.draggable=true;
    k.setAttribute("tabindex","0");
    k.addEventListener("dragstart",function(e){ e.dataTransfer.setData("text",teks); });
    k.addEventListener("click",function(){
      if(wrap.dataset.kunci) return;
      Array.prototype.forEach.call(bank.children,function(c){c.classList.remove("pilih");});
      k.classList.add("pilih"); sel.t=teks; sfx("tap");
    });
    k.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); k.click(); } });
    bank.appendChild(k);
  });
  function pakai(teks,on){
    Array.prototype.forEach.call(bank.children,function(c){
      if(c.textContent===teks) c.classList.toggle("pakai",on);
    });
  }
  function taruh(slot,teks){
    if(wrap.dataset.kunci||!teks) return;
    if(slot.dataset.val) pakai(slot.dataset.val,false);
    slot.dataset.val=teks; slot.classList.add("isi");
    slot.innerHTML='<div style="font-size:1.2cqw;color:#8fa5c6">'+t.slot[slot.dataset.i]+
      '</div><div class="isian">'+teks+'</div>';
    pakai(teks,true); sel.t=null;
    Array.prototype.forEach.call(bank.children,function(c){c.classList.remove("pilih");});
    sfx("tap");
  }
  var per=document.createElement("button"); per.className="btn"; per.textContent="Periksa";
  per.addEventListener("click",function(){
    if(wrap.dataset.kunci) return;
    var semua=true;
    Array.prototype.forEach.call(srow.children,function(d,i){ if(d.dataset.val!==t.jawab[i]) semua=false; });
    if(semua){
      wrap.dataset.kunci="1";
      Array.prototype.forEach.call(srow.children,function(d){ d.classList.add("benar"); });
      benarkan(t.pesanBenar);
    } else {
      Array.prototype.forEach.call(srow.children,function(d,i){
        if(d.dataset.val!==t.jawab[i]) d.classList.add("salah");
      });
      var kunci=salahkan(t,function(){
        Array.prototype.forEach.call(srow.children,function(d,i){
          d.classList.remove("salah"); d.classList.add("benar");
          d.innerHTML='<div style="font-size:1.2cqw;color:#8fa5c6">'+t.slot[i]+'</div>'+
            '<div class="isian">'+t.jawab[i]+'</div>';
        });
      });
      if(kunci) wrap.dataset.kunci="1";
    }
  });
  document.getElementById("aksi").appendChild(per);
}
/* ---- mengetik pertidaksamaan ---- */
function rKetikPtd(t,A){
  var wrap=document.createElement("div");
  wrap.style.cssText="display:flex;gap:2.4cqw;align-items:flex-start";
  wrap.innerHTML='<div style="width:34cqw;display:flex;flex-direction:column;gap:.7cqw">'+
    '<div class="lbl">Tulis pertidaksamaannya</div>'+
    '<div class="kpDisp aktif" id="ptdDisp"></div>'+
    '<div class="err" id="ptdErr"></div>'+
    '<div class="kp" id="ptdKp"></div></div>'+
    '<div class="sisi" style="flex:1">'+
    '<div class="lbl">Ingat</div>'+
    '<div class="p" style="font-size:1.4cqw;margin-top:.5cqw">Pakai huruf <b>x</b> dan <b>y</b> sesuai penamaan pada berkas. '+
    'Bentuk yang setara diterima — 6x + 4y ≤ 48 dinilai sama dengan 3x + 2y ≤ 24.</div></div>';
  A.appendChild(wrap);
  buildKeypad(document.getElementById("ptdKp"),document.getElementById("ptdDisp"),function(){
    document.getElementById("ptdErr").textContent="";
  });
  var kunciJawab=parseCons(t.jawab);
  var per=document.createElement("button"); per.className="btn"; per.textContent="Serahkan";
  per.addEventListener("click",function(){
    if(wrap.dataset.kunci) return;
    var r=parseCons(document.getElementById("ptdDisp").textContent);
    if(r.err){ document.getElementById("ptdErr").textContent=r.err; sfx("no"); return; }
    if(setaraKendala(r,kunciJawab)){
      wrap.dataset.kunci="1";
      document.getElementById("ptdDisp").style.borderColor="#5fd18a";
      benarkan(t.bahas);
    } else {
      var kunci=salahkan(t,function(){
        document.getElementById("ptdDisp").textContent=kunciJawab.teks;
        document.getElementById("ptdDisp").style.borderColor="#5fd18a";
      });
      if(kunci) wrap.dataset.kunci="1";
    }
  });
  document.getElementById("aksi").appendChild(per);
}
/* ---- mengetik satu bilangan ---- */
function rKetikAngka(t,A){
  var wrap=document.createElement("div");
  wrap.style.cssText="display:flex;gap:2.4cqw;align-items:flex-start";
  wrap.innerHTML='<div style="width:20cqw;display:flex;flex-direction:column;gap:.7cqw">'+
    '<div class="lbl">Jawaban</div><div class="kpDisp aktif" id="agkDisp"></div>'+
    '<div class="mut" style="font-size:1.35cqw">'+(t.satuan||"")+'</div>'+
    '<div class="kpnum" id="agkKp"></div></div>';
  A.appendChild(wrap);
  var nilai="";
  var num=document.getElementById("agkKp");
  ["7","8","9","4","5","6","1","2","3","0","⌫"].forEach(function(k){
    var b=document.createElement("button"); b.className="key"+(k==="⌫"?" warnk":""); b.type="button"; b.textContent=k;
    b.addEventListener("click",function(){
      if(wrap.dataset.kunci) return;
      nilai = k==="⌫" ? nilai.slice(0,-1) : (nilai.length<4 ? nilai+k : nilai);
      document.getElementById("agkDisp").textContent=nilai; sfx("tap");
    });
    num.appendChild(b);
  });
  var per=document.createElement("button"); per.className="btn"; per.textContent="Serahkan";
  per.addEventListener("click",function(){
    if(wrap.dataset.kunci) return;
    if(nilai===""){ document.getElementById("umpan").innerHTML='<span class="no">Isi dulu jawabannya.</span>'; return; }
    if(parseInt(nilai,10)===t.jawab){ wrap.dataset.kunci="1"; benarkan(t.pesanBenar||t.bahas); }
    else{
      var kunci=salahkan(t,function(){ document.getElementById("agkDisp").textContent=String(t.jawab); });
      if(kunci) wrap.dataset.kunci="1"; else { nilai=""; document.getElementById("agkDisp").textContent=""; }
    }
  });
  document.getElementById("aksi").appendChild(per);
}
/* ---- mengetik koordinat titik pojok ---- */
function rKetikKoordinat(t,A){
  var K=t.cons.map(parseCons), v=autoView(K);
  var row=document.createElement("div"); row.className="kerjaRow";
  var kiri=document.createElement("div"); kiri.className="bidang";
  kiri.innerHTML=plotSVG({view:v,cons:K,region:true,step:v.step,labelStep:v.step});
  var kanan=document.createElement("div"); kanan.className="sisi";
  kanan.innerHTML='<div class="lbl">Koordinat titik pojok</div>'+
    '<div style="display:flex;gap:1cqw;align-items:center">'+
    '<span class="mathline" style="font-size:2cqw">x =</span><div class="kpDisp aktif" id="kX" style="min-width:7cqw"></div>'+
    '<span class="mathline" style="font-size:2cqw">y =</span><div class="kpDisp" id="kY" style="min-width:7cqw"></div></div>'+
    '<div class="kpnum" id="kNum" style="margin-top:.6cqw"></div>';
  row.appendChild(kiri); row.appendChild(kanan); A.appendChild(row);
  var aktif="x", nilai={x:"",y:""};
  function tulis(){
    document.getElementById("kX").textContent=nilai.x;
    document.getElementById("kY").textContent=nilai.y;
    document.getElementById("kX").classList.toggle("aktif",aktif==="x");
    document.getElementById("kY").classList.toggle("aktif",aktif==="y");
  }
  document.getElementById("kX").addEventListener("click",function(){ aktif="x"; tulis(); });
  document.getElementById("kY").addEventListener("click",function(){ aktif="y"; tulis(); });
  var num=document.getElementById("kNum");
  ["7","8","9","4","5","6","1","2","3","0","⌫","→"].forEach(function(k){
    var b=document.createElement("button"); b.className="key"+(k==="⌫"?" warnk":""); b.type="button"; b.textContent=k;
    b.addEventListener("click",function(){
      if(row.dataset.kunci) return;
      if(k==="⌫") nilai[aktif]=nilai[aktif].slice(0,-1);
      else if(k==="→") aktif=(aktif==="x"?"y":"x");
      else if(nilai[aktif].length<3) nilai[aktif]+=k;
      tulis(); sfx("tap");
    });
    num.appendChild(b);
  });
  tulis();
  var per=document.createElement("button"); per.className="btn"; per.textContent="Serahkan jawaban";
  per.addEventListener("click",function(){
    if(row.dataset.kunci) return;
    if(nilai.x===""||nilai.y===""){
      document.getElementById("umpan").innerHTML='<span class="no">Isi dulu nilai x dan y.</span>'; return;
    }
    if(parseInt(nilai.x,10)===t.jawab[0]&&parseInt(nilai.y,10)===t.jawab[1]){
      row.dataset.kunci="1"; benarkan(t.pesanBenar||t.bahas);
    } else {
      var kunci=salahkan(t,function(){
        nilai.x=String(t.jawab[0]); nilai.y=String(t.jawab[1]); tulis();
        kiri.innerHTML=plotSVG({view:v,cons:K,region:true,step:v.step,labelStep:v.step,corners:[t.jawab]});
      });
      if(kunci) row.dataset.kunci="1";
      else { nilai.x=""; nilai.y=""; aktif="x"; tulis(); }
    }
  });
  document.getElementById("aksi").appendChild(per);
}
