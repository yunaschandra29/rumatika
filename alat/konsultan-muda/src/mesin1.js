function parseLinear(s){
  s=String(s).replace(/\s+/g,"").replace(/\u00b7|\*/g,"");
  if(!s) return null;
  if(s[0]!=="+"&&s[0]!=="-") s="+"+s;
  if(!/^[-+0-9xy.]+$/.test(s)) return null;
  var a=0,b=0,c=0,re=/([+-])(\d*\.?\d*)([xy]?)/g,m,pos=0,found=false;
  while((m=re.exec(s))!==null){
    if(m.index!==pos) return null;
    if(m[0].length===1) return null;
    pos+=m[0].length;
    var sg=m[1]==="-"?-1:1, ns=m[2], v=m[3];
    if(ns===""&&v==="") return null;
    if(ns==="."||ns.split(".").length>2) return null;
    var num=ns===""?1:parseFloat(ns);
    if(isNaN(num)) return null;
    if(v==="x") a+=sg*num; else if(v==="y") b+=sg*num; else c+=sg*num;
    found=true;
  }
  if(pos!==s.length||!found) return null;
  return {a:a,b:b,c:c};
}
function parseCons(str){
  var s=String(str).replace(/\s+/g,"").replace(/<=/g,"≤").replace(/>=/g,"≥");
  var op=null,i=-1,ops=["≤","≥","<",">"];
  for(var k=0;k<ops.length;k++){ var j=s.indexOf(ops[k]); if(j>-1){ op=ops[k]; i=j; break; } }
  if(!op) return {err:"Belum ada tanda ≤, ≥, < atau >."};
  if(s.indexOf(op,i+1)>-1) return {err:"Gunakan satu tanda pertidaksamaan saja."};
  var L=parseLinear(s.slice(0,i)), R=parseLinear(s.slice(i+1));
  if(!L||!R) return {err:"Bentuknya belum terbaca. Contoh: 2x+3y≤12"};
  var a=L.a-R.a, b=L.b-R.b, c=R.c-L.c;
  if(Math.abs(a)<1e-9&&Math.abs(b)<1e-9) return {err:"Harus memuat x atau y."};
  return {a:a,b:b,op:op,c:c,teks:consText(a,b,op,c)};
}
function numStr(n){
  var r=Math.round(n*1000)/1000;
  if(Math.abs(r-Math.round(r))<1e-9) return String(Math.round(r));
  return String(r).replace(".",",");
}
function termStr(k,v,first){
  if(Math.abs(k)<1e-9) return "";
  var sg=k<0?"−":(first?"":"+"), ak=Math.abs(k);
  var co=Math.abs(ak-1)<1e-9?"":numStr(ak);
  return (first?sg:" "+sg+" ")+co+v;
}
function consText(a,b,op,c){
  var s=termStr(a,"x",true); 
  if(!s){ s=termStr(b,"y",true); } else { s+=termStr(b,"y",false); }
  return s+" "+op+" "+numStr(c);
}
function sat(k,x,y){
  var v=k.a*x+k.b*y, e=1e-9;
  if(k.op==="≤") return v<=k.c+e;
  if(k.op==="≥") return v>=k.c-e;
  if(k.op==="<") return v< k.c-e;
  return v> k.c+e;
}
function satAll(list,x,y){ for(var i=0;i<list.length;i++) if(!sat(list[i],x,y)) return false; return true; }

/* potong poligon dengan setengah bidang a·x+b·y ≤ c */
function clipHalf(poly,a,b,c){
  var out=[],n=poly.length,e=1e-9;
  for(var i=0;i<n;i++){
    var P=poly[i],Q=poly[(i+1)%n];
    var dp=a*P[0]+b*P[1]-c, dq=a*Q[0]+b*Q[1]-c;
    if(dp<=e) out.push(P);
    if((dp>e)!==(dq>e)){ var t=dp/(dp-dq); out.push([P[0]+t*(Q[0]-P[0]),P[1]+t*(Q[1]-P[1])]); }
  }
  return out;
}
function regionPoly(list,view){
  var poly=[[view.x0,view.y0],[view.x1,view.y0],[view.x1,view.y1],[view.x0,view.y1]];
  for(var i=0;i<list.length;i++){
    var k=list[i],a=k.a,b=k.b,c=k.c;
    if(k.op==="≥"||k.op===">"){ a=-a;b=-b;c=-c; }
    poly=clipHalf(poly,a,b,c);
    if(poly.length<3) return [];
  }
  return poly;
}
/* titik pojok daerah penyelesaian */
function corners(list){
  var pts=[],e=1e-7;
  for(var i=0;i<list.length;i++) for(var j=i+1;j<list.length;j++){
    var A=list[i],B=list[j], det=A.a*B.b-B.a*A.b;
    if(Math.abs(det)<1e-9) continue;
    var x=(A.c*B.b-B.c*A.b)/det, y=(A.a*B.c-B.a*A.c)/det;
    var ok=true;
    for(var m=0;m<list.length;m++){
      var k=list[m], v=k.a*x+k.b*y;
      if((k.op==="≤"||k.op==="<") && v>k.c+1e-6) ok=false;
      if((k.op==="≥"||k.op===">") && v<k.c-1e-6) ok=false;
    }
    if(!ok) continue;
    var dup=false;
    for(var q=0;q<pts.length;q++) if(Math.abs(pts[q][0]-x)<1e-6&&Math.abs(pts[q][1]-y)<1e-6) dup=true;
    if(!dup) pts.push([x,y]);
  }
  if(pts.length>2){
    var cx=0,cy=0; pts.forEach(function(p){cx+=p[0];cy+=p[1];}); cx/=pts.length; cy/=pts.length;
    pts.sort(function(p,q){ return Math.atan2(p[1]-cy,p[0]-cx)-Math.atan2(q[1]-cy,q[0]-cx); });
  }
  return pts;
}

/* ============================================================
   PENGGAMBAR BIDANG KOORDINAT (SVG)
   ============================================================ */
var VW=420;
function mkView(x0,x1,y0,y1){ return {x0:x0,x1:x1,y0:y0,y1:y1}; }
function PX(v,x){ return (x-v.x0)/(v.x1-v.x0)*VW; }
function PY(v,y){ return VW-(y-v.y0)/(v.y1-v.y0)*VW; }
function fmtT(n){ return numStr(n); }

var PSV_ID=0;
function plotSVG(o){
  // o: {view, cons:[], shadeEach, region, pts:[{x,y,ok,label}], corners:[], small, step, labelStep,
  //     anim: animasikan proses terbentuknya grafik, animLines:[i] hanya garis tertentu yang digambar,
  //     colors:[warna tiap garis tanpa arsiran]}
  var v=o.view, s='<svg viewBox="0 0 '+VW+' '+VW+'" xmlns="http://www.w3.org/2000/svg"'+(o.anim?' class="psAnim"':'')+'>';
  var sm=!!o.small, step=o.step||1, id="ps"+(++PSV_ID), defs='';
  var A=!!o.anim, nK=o.cons?o.cons.length:0;
  var T0=A?0.35:0, DT=sm?0.42:0.7, DUR=sm?0.38:0.6;
  function tl(i){ return T0+i*DT; }
  var tEnd=A?tl(nK)+0.05:0;
  function an(kls,del,dur){ return A?' class="'+kls+'" style="animation-delay:'+del.toFixed(2)+'s'+(dur?';animation-duration:'+dur.toFixed(2)+'s':'')+'"':''; }
  s+='<rect width="'+VW+'" height="'+VW+'" fill="#060c18"/>';
  // grid
  var g='';
  for(var x=Math.ceil(v.x0/step)*step;x<=v.x1+1e-9;x+=step){
    var px=PX(v,x); g+='<line x1="'+px.toFixed(1)+'" y1="0" x2="'+px.toFixed(1)+'" y2="'+VW+'" />';
  }
  for(var y=Math.ceil(v.y0/step)*step;y<=v.y1+1e-9;y+=step){
    var py=PY(v,y); g+='<line x1="0" y1="'+py.toFixed(1)+'" x2="'+VW+'" y2="'+py.toFixed(1)+'" />';
  }
  s+='<g stroke="#1b2c4c" stroke-width="1"'+an("anFade",0,0.4)+'>'+g+'</g>';

  var pal=["#49c6b8","#f0b64b","#e08b52","#8f7ae0","#5fd18a","#5aa9f0"];
  function poly(p){ return p.map(function(q){return PX(v,q[0]).toFixed(1)+","+PY(v,q[1]).toFixed(1);}).join(" "); }
  // arsiran tiap kendala (transparan) — muncul setelah garisnya selesai digambar
  if(o.shadeEach&&o.cons){
    o.cons.forEach(function(k,i){
      var p=regionPoly([k],v); if(p.length<3) return;
      s+='<polygon points="'+poly(p)+'" fill="'+pal[i%6]+'" fill-opacity="0.13"'+an("anFade",tl(i)+DUR,0.5)+'/>';
    });
  }
  // daerah penyelesaian (irisan)
  if(o.region&&o.cons&&o.cons.length){
    var rp=regionPoly(o.cons,v);
    if(rp.length>=3){
      s+='<polygon points="'+poly(rp)+'" fill="#f0b64b" fill-opacity="0.30" stroke="#f0b64b" stroke-opacity="0.5" stroke-width="1.5"'+an("anFade",tEnd,0.7)+'/>';
    }
  }
  // sumbu
  var ox=PX(v,0), oy=PY(v,0);
  s+='<g stroke="#5f7aa6" stroke-width="2"'+an("anFade",0.05,0.4)+'>';
  if(v.y0<=0&&v.y1>=0) s+='<line x1="0" y1="'+oy.toFixed(1)+'" x2="'+VW+'" y2="'+oy.toFixed(1)+'"/>';
  if(v.x0<=0&&v.x1>=0) s+='<line x1="'+ox.toFixed(1)+'" y1="0" x2="'+ox.toFixed(1)+'" y2="'+VW+'"/>';
  s+='</g>';
  // label sumbu
  if(!sm){
    var ls=o.labelStep||step, t='';
    for(var x2=Math.ceil(v.x0/ls)*ls;x2<=v.x1+1e-9;x2+=ls){
      if(Math.abs(x2)<1e-9) continue;
      t+='<text x="'+PX(v,x2).toFixed(1)+'" y="'+(oy+14).toFixed(1)+'" text-anchor="middle">'+fmtT(x2)+'</text>';
    }
    for(var y2=Math.ceil(v.y0/ls)*ls;y2<=v.y1+1e-9;y2+=ls){
      if(Math.abs(y2)<1e-9) continue;
      t+='<text x="'+(ox-6).toFixed(1)+'" y="'+(PY(v,y2)+4).toFixed(1)+'" text-anchor="end">'+fmtT(y2)+'</text>';
    }
    s+='<g fill="#7f96ba" font-size="11" font-family="sans-serif"'+an("anFade",0.1,0.4)+'>'+t+'</g>';
    s+='<text x="'+(VW-6)+'" y="'+(oy-7).toFixed(1)+'" text-anchor="end" fill="#9db2d2" font-size="13" font-family="sans-serif">x</text>';
    s+='<text x="'+(ox+8).toFixed(1)+'" y="14" fill="#9db2d2" font-size="13" font-family="sans-serif">y</text>';
  }
  // garis batas: titik potong sumbu muncul dulu, lalu garis ditarik melewatinya
  if(o.cons) o.cons.forEach(function(k,i){
    var seg=lineSeg(k,v); if(!seg) return;
    var dash=(k.op==="<"||k.op===">")?' stroke-dasharray="7 6"':"";
    var col=o.colors?o.colors[i%o.colors.length]:o.shadeEach?pal[i%6]:"#f0b64b";
    var ln='x1="'+PX(v,seg[0][0]).toFixed(1)+'" y1="'+PY(v,seg[0][1]).toFixed(1)+
       '" x2="'+PX(v,seg[1][0]).toFixed(1)+'" y2="'+PY(v,seg[1][1]).toFixed(1)+'"';
    var gerak=A||(o.animLines&&o.animLines.indexOf(i)>=0), mask='';
    if(gerak){
      var t1=A?tl(i)+0.15:0.05, mid=id+"m"+i;
      defs+='<mask id="'+mid+'" maskUnits="userSpaceOnUse" x="0" y="0" width="'+VW+'" height="'+VW+'"><line '+ln+
        ' stroke="#fff" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" class="anDraw" style="animation-delay:'+t1.toFixed(2)+'s;animation-duration:'+DUR.toFixed(2)+'s"/></mask>';
      mask=' mask="url(#'+mid+')"';
      if(A&&!sm){
        var tp=[]; if(Math.abs(k.b)>1e-9) tp.push([0,k.c/k.b]); if(Math.abs(k.a)>1e-9) tp.push([k.c/k.a,0]);
        if(Math.abs(k.a)>1e-9&&Math.abs(k.b)>1e-9) tp.forEach(function(p){
          if(p[0]<v.x0||p[0]>v.x1||p[1]<v.y0||p[1]>v.y1) return;
          var cx=PX(v,p[0]).toFixed(1), cy=PY(v,p[1]).toFixed(1);
          s+='<g class="anTmp" style="animation-delay:'+tl(i).toFixed(2)+'s;animation-duration:'+(DT+DUR).toFixed(2)+'s"><circle cx="'+cx+'" cy="'+cy+'" r="6" fill="'+col+'"/>'+
             '<text x="'+(+cx+9)+'" y="'+(+cy-9)+'" fill="'+col+'" font-size="12" font-family="sans-serif">('+fmtT(p[0])+', '+fmtT(p[1])+')</text></g>';
        });
      }
    }
    s+='<line '+ln+' stroke="'+col+'" stroke-width="'+(sm?2.4:3)+'"'+dash+' stroke-linecap="round"'+mask+'/>';
  });
  // titik pojok
  if(o.corners) o.corners.forEach(function(p,i){
    var px=PX(v,p[0]),py=PY(v,p[1]);
    s+='<g'+an("anPop",tEnd+0.4+i*0.12,0.4)+'><circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="5.5" fill="#49c6b8" stroke="#062" stroke-width="1.5"/>';
    if(!sm) s+='<text x="'+(px+9).toFixed(1)+'" y="'+(py-8).toFixed(1)+'" fill="#bdf1ea" font-size="12" font-family="sans-serif">('+fmtT(p[0])+", "+fmtT(p[1])+')</text>';
    s+='</g>';
  });
  // titik uji
  if(o.pts) o.pts.forEach(function(p,i){
    var px=PX(v,p.x),py=PY(v,p.y), c=p.col||(p.ok?"#5fd18a":"#f2706a");
    s+='<g'+an("anPop",tEnd+0.2+i*0.1,0.4)+'><circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="'+(p.r||(p.big?6.5:5))+'" fill="'+c+'" fill-opacity="0.92"'+(p.ring?' stroke="#fff" stroke-width="2"':'')+'/>';
    if(p.label) s+='<text x="'+(px+8).toFixed(1)+'" y="'+(py-7).toFixed(1)+'" fill="'+c+'" font-size="12" font-family="sans-serif">'+p.label+'</text>';
    s+='</g>';
  });
  s+=(defs?'<defs>'+defs+'</defs>':'')+'</svg>';
  return s;
}
function lineSeg(k,v){
  var pts=[],a=k.a,b=k.b,c=k.c,e=1e-9;
  function push(x,y){ if(x>=v.x0-1e-6&&x<=v.x1+1e-6&&y>=v.y0-1e-6&&y<=v.y1+1e-6) pts.push([x,y]); }
  if(Math.abs(b)>e){ push(v.x0,(c-a*v.x0)/b); push(v.x1,(c-a*v.x1)/b); }
  if(Math.abs(a)>e){ push((c-b*v.y0)/a,v.y0); push((c-b*v.y1)/a,v.y1); }
  if(pts.length<2) return null;
  var best=null,d=-1;
  for(var i=0;i<pts.length;i++) for(var j=i+1;j<pts.length;j++){
    var dd=Math.pow(pts[i][0]-pts[j][0],2)+Math.pow(pts[i][1]-pts[j][1],2);
    if(dd>d){ d=dd; best=[pts[i],pts[j]]; }
  }
  return d<1e-9?null:best;
}
/* koordinat klik → koordinat matematika */
function clickMath(el,ev,view){
  var r=el.getBoundingClientRect();
  var fx=(ev.clientX-r.left)/r.width, fy=(ev.clientY-r.top)/r.height;
  return {x:view.x0+fx*(view.x1-view.x0), y:view.y1-fy*(view.y1-view.y0)};
}

/* ============================================================
   KEYPAD
   ============================================================ */
var KEYS=["7","8","9","x","y","4","5","6","+","−","1","2","3","≤","≥","0",".","⌫","<",">"];
function buildKeypad(host,disp,onChange){
  host.innerHTML="";
  KEYS.forEach(function(k){
    var b=document.createElement("button"); b.className="key"; b.type="button"; b.textContent=k;
    if(k==="≤"||k==="≥"||k==="<"||k===">") b.className="key acc";
    if(k==="⌫") b.className="key warnk";
    b.addEventListener("click",function(){
      var s=disp.textContent;
      if(k==="⌫") s=s.slice(0,-1);
      else if(k==="−") s+="-";
      else s+=k;
      disp.textContent=s; sfx("tap"); if(onChange) onChange(s);
    });
    host.appendChild(b);
  });
}
function dispSet(disp,v){ disp.textContent=v; }

/* ---------- penentuan jendela tampilan otomatis ---------- */
function niceStep(span){
  var raw=span/9, p=Math.pow(10,Math.floor(Math.log(raw)/Math.LN10)), n=raw/p;
  var m = n<1.5?1 : n<3?2 : n<7?5 : 10;
  return m*p;
}
function autoView(cons){
  var xs=[0],ys=[0];
  cons.forEach(function(k){
    if(Math.abs(k.a)>1e-9) xs.push(k.c/k.a);
    if(Math.abs(k.b)>1e-9) ys.push(k.c/k.b);
  });
  corners(cons).forEach(function(p){ xs.push(p[0]); ys.push(p[1]); });
  xs=xs.filter(function(n){return isFinite(n)&&Math.abs(n)<1e5;});
  ys=ys.filter(function(n){return isFinite(n)&&Math.abs(n)<1e5;});
  var xmax=Math.max.apply(null,xs.concat([4])), xmin=Math.min.apply(null,xs.concat([0]));
  var ymax=Math.max.apply(null,ys.concat([4])), ymin=Math.min.apply(null,ys.concat([0]));
  var m=Math.max(xmax-xmin,ymax-ymin,4)*0.18+0.6;
  var v=mkView(xmin-m,xmax+m,ymin-m,ymax+m);
  v.step=niceStep(Math.max(v.x1-v.x0,v.y1-v.y0));
  return v;
}
/* kesetaraan dua kendala: 3x+2y≤24 setara 6x+4y≤48, juga setara −3x−2y≥−24 */
function opBalik(op){ return {"≤":"≥","≥":"≤","<":">",">":"<"}[op]; }
function setaraKendala(A,B){
  var k=null;
  if(Math.abs(B.a)>1e-9) k=A.a/B.a;
  else if(Math.abs(B.b)>1e-9) k=A.b/B.b;
  else return false;
  if(!isFinite(k)||Math.abs(k)<1e-9) return false;
  if(Math.abs(A.a-k*B.a)>1e-6) return false;
  if(Math.abs(A.b-k*B.b)>1e-6) return false;
  if(Math.abs(A.c-k*B.c)>1e-6) return false;
  return k>0 ? A.op===B.op : A.op===opBalik(B.op);
}
