(function(){
const NS='http://www.w3.org/2000/svg';
function mk(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R=mk(11);
const $=id=>document.getElementById(id);
function el(tag,at,parent){const e=document.createElementNS(NS,tag);for(const k in at)e.setAttribute(k,at[k]);if(parent)parent.appendChild(e);return e}
function ridge(y0,amp,rough){let pts=[[-100,y0+(R()-.5)*amp],[1700,y0+(R()-.5)*amp]],d=amp;for(let i=0;i<7;i++){const np=[];for(let j=0;j<pts.length-1;j++){const a=pts[j],b=pts[j+1];np.push(a,[(a[0]+b[0])/2,(a[1]+b[1])/2+(R()-.5)*d]);}np.push(pts[pts.length-1]);pts=np;d*=rough}return pts}
function toPath(p,b){return'M'+p.map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join('L')+'L1700 '+b+'L-100 '+b+'Z'}
function ry(p,x){for(let i=0;i<p.length-1;i++)if(x>=p[i][0]&&x<=p[i+1][0]){const t=(x-p[i][0])/(p[i+1][0]-p[i][0]);return p[i][1]+t*(p[i+1][1]-p[i][1])}return p[0][1]}
function pine(x,base,h,w){const n=6,top=base-h,L=[[x,top]];for(let i=0;i<n;i++){const yb=top+(i+1)*(h/n)*.92+h*.04,hw=w/2*((i+1)/n)*(.85+R()*.3),ym=yb-(h/n)*.55;L.push([x-hw*.45,ym],[x-hw,yb],[x-hw*.35,yb-(h/n)*.18])}L.push([x-w*.04,base]);const Rr=L.slice().reverse().map(p=>[2*x-p[0],p[1]]);return'M'+L.concat(Rr).map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z'}
function forest(pts,x0,x1,sp,hmin,hmax,off){let d='';for(let x=x0;x<x1;x+=sp*(.6+R()*.8)){const h=hmin+R()*(hmax-hmin);d+=pine(x,ry(pts,x)+(off||4),h,h*.42)}return d}

// stars
const st=$('stars');for(let i=0;i<300;i++){const c=el('circle',{cx:(R()*2000-200).toFixed(0),cy:(R()*R()*-1900+520*R()).toFixed(0),r:(.3+R()*1.3).toFixed(2),fill:R()>.85?'#ffe9c4':'#dfe8ff'},st);c.setAttribute('class','tw');c.style.animationDelay=(-R()*4).toFixed(2)+'s';c.style.animationDuration=(2.5+R()*4).toFixed(1)+'s';c.setAttribute('opacity',(.3+R()*.7).toFixed(2))}

// terrain
const A=ridge(560,190,.56);$('mtA').setAttribute('d',toPath(A,900));$('mtAlight').setAttribute('d','M'+A.map(q=>q[0].toFixed(1)+' '+q[1].toFixed(1)).join('L'));
const B=ridge(640,120,.55);$('mtB').setAttribute('d',toPath(B,900));
const FB=ridge(690,30,.5);$('forB').setAttribute('d',toPath(FB,900)+forest(FB,-80,1680,11,36,80,6));
const FC=ridge(720,14,.5);$('forC').setAttribute('d',toPath(FC,900)+forest(FC,-80,1680,15,70,150,6));
$('hill').setAttribute('d','M-100 770 Q200 735 560 748 Q800 756 1040 748 Q1400 735 1700 770 V900 H-100Z');

// side trees behind village
const sideD=forest([[-100,742],[1700,742]],-60,500,34,180,330,0)+forest([[-100,742],[1700,742]],1110,1680,34,180,330,0);
$('sideTrees').appendChild(el('path',{d:sideD}));

// shields
const sh=$('shields'),cols=[['#7a1f2b','#d9b36a'],['#1f3a5a','#d9d9c8'],['#8a5a1f','#1a1a1a'],['#2a4a2f','#d9b36a']];
[612,672,732,868,928,988].forEach((x,i)=>{const c=cols[i%4];el('circle',{cx:x,cy:726,r:12,fill:c[0]},sh);el('path',{d:`M${x} 714V738M${x-12} 726H${x+12}`,stroke:c[1],'stroke-width':2.4,opacity:.8},sh);el('circle',{cx:x,cy:726,r:3.2,fill:'#9aa0ae'},sh);el('circle',{cx:x,cy:726,r:12,fill:'url(#fl)',opacity:.7},sh);el('circle',{cx:x,cy:726,r:12,fill:'none',stroke:'#05060c','stroke-width':1.5},sh)});

// tents (absolute coords so firelight gradient stays aligned)
const TG=$('tents');
function tent(cx,base,w,h,col){
  const L=cx-w/2,Rr=cx+w/2,top=base-h;
  el('path',{d:`M${L} ${base} L${cx} ${top} L${Rr} ${base}Z`,fill:col},TG);
  el('path',{d:`M${cx} ${top} L${Rr} ${base} H${cx+w*.12}Z`,fill:'#000',opacity:.28},TG);
  el('path',{d:`M${L} ${base} L${cx} ${top} L${Rr} ${base}Z`,fill:'url(#fl)',opacity:.9},TG);
  el('path',{d:`M${cx-w*.11} ${base} L${cx} ${base-h*.55} L${cx+w*.11} ${base}Z`,fill:'url(#door)',opacity:.9,filter:'url(#glow)'},TG).setAttribute('class','flick2');
  el('line',{x1:cx,y1:top,x2:cx,y2:top-h*.14,stroke:'#0a0910','stroke-width':2.4},TG);
  el('path',{d:`M${cx} ${top-h*.14} l${w*.2} ${h*.04} l-${w*.04} ${h*.05}z`,fill:'#8a1f2b'},TG);
  el('path',{d:`M${L} ${base} l-${w*.12} ${h*.06} M${Rr} ${base} l${w*.12} ${h*.06}`,stroke:'#05060c','stroke-width':1.2,opacity:.8},TG);
}
tent(430,752,150,100,'#1d2140');tent(300,770,190,128,'#241c33');tent(170,760,130,88,'#1b2136');tent(1180,752,150,100,'#1d2140');tent(1300,772,190,126,'#241c33');tent(1440,760,130,88,'#1b2136');
tent(500,734,90,58,'#171b33');tent(1108,734,90,58,'#171b33');

// props: banner poles, torches, drying rack
const PR=$('props');
[[530,560],[1070,560]].forEach(([x,y])=>{el('line',{x1:x,y1:y,x2:x,y2:748,stroke:'#07080f','stroke-width':4},PR);el('path',{d:`M${x} ${y+4} h42 l-10 14 l10 14 h-42z`,fill:'#7a1f2b'},PR);el('path',{d:`M${x} ${y+4} h42 l-10 14 l10 14 h-42z`,fill:'url(#fl)',opacity:.6},PR)});
[[700,748],[900,748],[610,752],[990,752]].forEach(([x,y],i)=>{if(i>1)return;el('line',{x1:x,y1:y,x2:x,y2:y-58,stroke:'#07080f','stroke-width':3.5},PR);const f=el('path',{d:`M${x} ${y-58} c-9 -12 -2 -22 0 -30 c4 8 11 18 0 30z`,fill:'#ffb050',filter:'url(#glow)'},PR);f.setAttribute('class',i?'flick2':'flick')});
// logs & stones
const LG=$('logs');[[722,816,-4],[878,816,4]].forEach(([x,y,r])=>{el('rect',{x:x-46,y:y-9,width:92,height:18,rx:9,fill:'#150f0b',transform:`rotate(${r} ${x} ${y})`},LG);el('rect',{x:x-46,y:y-9,width:92,height:18,rx:9,fill:'url(#fl)',transform:`rotate(${r} ${x} ${y})`},LG)});
const ST=$('stones');for(let i=0;i<14;i++){const a=i/14*Math.PI*2,x=800+Math.cos(a)*62,y=806+Math.sin(a)*11;const s=el('ellipse',{cx:x.toFixed(1),cy:y.toFixed(1),rx:(7+R()*3).toFixed(1),ry:(4+R()*2).toFixed(1)},ST)}
for(let i=0;i<14;i++){const a=i/14*Math.PI*2,x=800+Math.cos(a)*62,y=806+Math.sin(a)*11;el('ellipse',{cx:x.toFixed(1),cy:y.toFixed(1),rx:8,ry:4.5,fill:'url(#fl)'},ST)}

// foreground framing trees
const FT=$('fgTrees');
function bigTrunk(x,w,dir){el('path',{d:`M${x-w/2} 920 Q${x-w/2+4} 400 ${x-w*.38} -20 H${x+w*.38} Q${x+w/2-4} 400 ${x+w/2} 920Z`,fill:'url(#trunk)'},FT);
  for(let y=70;y<620;y+=34+R()*14){const len=120+R()*170-y*.12,dy=26+R()*22;let d=`M${x} ${y}`;let cx=x;for(let k=0;k<3;k++){}
    d=`M${x} ${y} Q${x+dir*len*.5} ${y+8} ${x+dir*len} ${y+dy} Q${x+dir*len*.5} ${y+dy-6} ${x} ${y+14}Z`;el('path',{d,fill:'#03040a'},FT);
    for(let n=0;n<9;n++){const t=n/9,nx=x+dir*len*t,ny=y+(dy*t)+4;el('path',{d:`M${nx} ${ny} l${dir*(-3+R()*6)} ${12+R()*22} l${dir*5} -4z`,fill:'#03040a'},FT)}}}
bigTrunk(24,86,1);bigTrunk(1578,92,-1);bigTrunk(-30,110,1);bigTrunk(1630,110,-1);

// grass
(function(){let d='M-100 910';for(let x=-100;x<1700;x+=5+R()*5){const h=18+R()*46;d+=`L${x} 910 L${x+2+R()*3} ${890-h} L${x+7} 910`}d+='V920H-100Z';$('grass').setAttribute('d',d)})();

// ravens
const RV=$('ravens');
function raven(y,s,dur,dl){const o=el('g',{},RV);o.setAttribute('class','cross');o.style.setProperty('--y',y+'px');o.style.setProperty('--d',dur+'s');o.style.setProperty('--dl',dl+'s');
  const i=el('g',{transform:`scale(${s})`,fill:'#04050a'},o);
  el('path',{d:'M-10 2 L2 -2 Q16 -6 28 -1 L40 -3 L29 4 Q16 8 2 5Z'},i);
  const w=el('path',{d:'M8 -1 Q14 -30 38 -36 Q26 -18 24 0Z'},i);w.setAttribute('class','wing');w.style.animationDelay=(-R()).toFixed(2)+'s';
  const w2=el('path',{d:'M6 1 Q8 24 26 30 Q20 12 20 2Z',opacity:.8},i);w2.setAttribute('class','wing');w2.style.animationDelay=(-R()).toFixed(2)+'s'}
raven(150,1.2,46,-4);raven(230,.8,62,-30);raven(110,.6,70,-12);raven(280,.5,80,-50);

// embers
const EM=$('embers'),parts=[];
for(let i=0;i<38;i++){const c=el('circle',{r:1.2,fill:'#ffb25a'},EM);parts.push({c,x:0,y:0,vx:0,vy:0,l:0,m:1,on:false})}
function spawn(p){p.x=800+(R()-.5)*30;p.y=772;p.vx=(R()-.5)*.5;p.vy=-(.5+R()*1.1);p.l=0;p.m=90+R()*140;p.r=.7+R()*1.7;p.on=true}
parts.forEach((p,i)=>{spawn(p);p.l=R()*p.m});
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let tick=0;
function loop(){tick++;parts.forEach(p=>{p.l++;p.x+=p.vx+Math.sin((tick+p.m)/22)*.35;p.y+=p.vy;p.vy*=.998;if(p.l>p.m)spawn(p);const a=1-p.l/p.m;p.c.setAttribute('cx',p.x.toFixed(1));p.c.setAttribute('cy',p.y.toFixed(1));p.c.setAttribute('r',(p.r*a+.2).toFixed(2));p.c.setAttribute('opacity',a.toFixed(2))});if(!reduce)requestAnimationFrame(loop)}
loop();

// fit scene: wide screens crop (slice); tall screens keep the village in view and extend the sky upward
const scene=$('scene');
function fit(){const a=scene.clientWidth/scene.clientHeight;
  if(a>=1.78){scene.setAttribute('viewBox','0 0 1600 900');scene.setAttribute('preserveAspectRatio','xMidYMax slice');$('moonG').setAttribute('transform','');return}
  const W=Math.min(1600,Math.max(1100,1100+(a-.4)/(1.38)*500)),H=W/a;
  $('moonG').setAttribute('transform',`translate(${Math.min(0,-(1230-((1600-W)/2+W-110)))} ${(900-H)+H*.085-200})`);
  scene.setAttribute('viewBox',`${(1600-W)/2} ${900-H} ${W} ${H}`);scene.setAttribute('preserveAspectRatio','xMidYMax meet')}
fit();addEventListener('resize',fit);

// parallax
const layers=[...document.querySelectorAll('.layer')];
if(!reduce){addEventListener('mousemove',e=>{const nx=e.clientX/innerWidth-.5,ny=e.clientY/innerHeight-.5;layers.forEach(l=>{const d=parseFloat(l.dataset.d);l.style.transform=`translate(${(-nx*d*22).toFixed(1)}px,${(-ny*d*7).toFixed(1)}px)`})})}

// reveal
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(n=>io.observe(n));
})();
