/* ---------- musik latar tersintesis ---------- */
var AUD={ctx:null,gain:null,on:false,timer:null,step:0};
function audioInit(){
  if(AUD.ctx) return;
  var C=window.AudioContext||window.webkitAudioContext; if(!C) return;
  AUD.ctx=new C();
  AUD.gain=AUD.ctx.createGain(); AUD.gain.gain.value=0.0; AUD.gain.connect(AUD.ctx.destination);
}
function tone(f,t0,dur,type,vol){
  if(!AUD.ctx) return;
  var o=AUD.ctx.createOscillator(),g=AUD.ctx.createGain();
  o.type=type||"sine"; o.frequency.value=f;
  g.gain.setValueAtTime(0,t0);
  g.gain.linearRampToValueAtTime(vol===undefined?0.13:vol,t0+0.03);
  g.gain.exponentialRampToValueAtTime(0.0008,t0+dur);
  o.connect(g); g.connect(AUD.gain); o.start(t0); o.stop(t0+dur+0.05);
}
var CHORDS=[[220,277.18,329.63],[196,246.94,293.66],[174.61,220,261.63],[164.81,207.65,246.94]];
var MEL=[659.25,587.33,523.25,587.33,659.25,783.99,659.25,523.25];
function loopMusic(){
  if(!AUD.on||!AUD.ctx) return;
  var t=AUD.ctx.currentTime+0.05, ch=CHORDS[AUD.step%4];
  ch.forEach(function(f){ tone(f/2,t,2.6,"triangle",0.05); });
  tone(MEL[AUD.step%8],t+0.1,0.8,"sine",0.045);
  tone(MEL[(AUD.step+3)%8],t+1.3,0.7,"sine",0.032);
  AUD.step++;
}
function musicToggle(){
  if(AEL){ AUD.on=!AUD.on; lagu(LAGU_KINI);
    $$(".muteBtn").forEach(function(b){ b.textContent=AUD.on?"♪":"♪̸"; b.style.color=AUD.on?"#f0b64b":"#7f96ba"; }); return; }
  audioInit(); if(!AUD.ctx) return;
  if(AUD.ctx.state==="suspended") AUD.ctx.resume();
  AUD.on=!AUD.on;
  AUD.gain.gain.linearRampToValueAtTime(AUD.on?0.5:0.0,AUD.ctx.currentTime+0.4);
  if(AUD.on){ loopMusic(); AUD.timer=setInterval(loopMusic,2500); }
  else { clearInterval(AUD.timer); }
  $$(".muteBtn")
    .forEach(function(b){ b.textContent=AUD.on?"♪":"♪̸"; b.style.color=AUD.on?"#f0b64b":"#7f96ba"; });
}
function sfx(kind){
  if(typeof setv==="function"&&setv("sfx")===false) return;
  audioInit(); if(!AUD.ctx) return;
  if(AUD.ctx.state==="suspended") AUD.ctx.resume();
  var t=AUD.ctx.currentTime, was=AUD.gain.gain.value;
  if(was<0.35) AUD.gain.gain.setValueAtTime(0.5,t);
  if(kind==="ok"){ tone(659.25,t,0.16,"triangle",0.16); tone(987.77,t+0.09,0.24,"triangle",0.13); }
  else if(kind==="no"){ tone(196,t,0.3,"sawtooth",0.09); tone(146.83,t+0.08,0.34,"sawtooth",0.07); }
  else if(kind==="tap"){ tone(880,t,0.07,"sine",0.07); }
  else if(kind==="win"){ [523.25,659.25,783.99,1046.5].forEach(function(f,i){ tone(f,t+i*0.13,0.5,"triangle",0.14); }); }
  if(was<0.35) AUD.gain.gain.setValueAtTime(was,t+0.9);
}
document.addEventListener("click",function(e){
  if(e.target.closest(".muteBtn")) musicToggle();
});
