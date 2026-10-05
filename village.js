(function(){
var NS='http://www.w3.org/2000/svg',svg=document.getElementById('vmap');
function el(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
var defs=el('defs',{},svg);
defs.innerHTML='<radialGradient id="gr" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#16251f"/><stop offset="1" stop-color="#0a0f16"/></radialGradient>'+
'<radialGradient id="hg"><stop offset="0" stop-color="#ffb050" stop-opacity=".9"/><stop offset="1" stop-color="#ff8030" stop-opacity="0"/></radialGradient>'+
'<pattern id="grs" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="3" cy="4" r=".8" fill="#2c4a38" opacity=".6"/><circle cx="10" cy="10" r=".8" fill="#2c4a38" opacity=".5"/></pattern>'+
'<filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';

// ground
el('rect',{width:1000,height:640,fill:'url(#gr)'},svg);el('rect',{width:1000,height:640,fill:'url(#grs)'},svg);
// palisade with a gate gap at bottom
var cx=500,cy=325,rx=470,ry=295;
el('ellipse',{cx:cx,cy:cy,rx:rx,ry:ry,fill:'none',stroke:'#4a3524','stroke-width':7,'stroke-dasharray':'3 5'},svg);
el('path',{d:'M470 618 L470 640 M530 618 L530 640',stroke:'#0a0f16','stroke-width':16},svg);
// paths
el('ellipse',{cx:cx,cy:cy,rx:250,ry:150,fill:'none',stroke:'#3a3326','stroke-width':14,opacity:.7},svg);
el('path',{d:'M500 640 V470',stroke:'#3a3326','stroke-width':16,opacity:.7},svg);
el('path',{d:'M500 175 V300 M250 325 H430 M570 325 H750',stroke:'#3a3326','stroke-width':10,opacity:.55},svg);

var spots=[
{id:'longhouse',name:'The Longhouse',tag:'Gathering hall',desc:'The great hall of the village: long tables, a center fire, and a turf roof. Feasts, teaching nights, winter gatherings and rites happen here.',draw:function(g){
  el('rect',{x:330,y:55,width:340,height:100,rx:30,fill:'#2b2118',stroke:'#6b4e32','stroke-width':3},g);
  el('path',{d:'M350 105 H650',stroke:'#4a3524','stroke-width':6},g);
  for(var i=0;i<9;i++)el('path',{d:'M'+(358+i*35)+' 62 V148',stroke:'#00000055','stroke-width':1.5},g);
  el('rect',{x:488,y:96,width:24,height:18,rx:4,fill:'#ffb050',filter:'url(#gl)',class:'fire2'},g);
  el('circle',{cx:330,cy:105,r:8,fill:'#6b4e32'},g);el('circle',{cx:670,cy:105,r:8,fill:'#6b4e32'},g);
  return [500,172]}},
{id:'hearth',name:'The Hearth',tag:'Central fire',desc:'The heart of the village. Every path leads here. A ring of stones, log seats, and a fire that anyone may sit beside.',draw:function(g){
  el('circle',{cx:500,cy:325,r:90,fill:'url(#hg)',class:'fire2'},g);
  for(var i=0;i<14;i++){var a=i/14*6.283;el('ellipse',{cx:500+Math.cos(a)*42,cy:325+Math.sin(a)*42,rx:8,ry:6,fill:'#2a2630'},g)}
  for(var j=0;j<8;j++){var b=j/8*6.283;el('rect',{x:500+Math.cos(b)*70-16,y:325+Math.sin(b)*70-6,width:32,height:12,rx:6,fill:'#3a2a1d',transform:'rotate('+(b*57.3+90)+' '+(500+Math.cos(b)*70)+' '+(325+Math.sin(b)*70)+')'},g)}
  var f=el('path',{d:'M500 296 C484 316 484 336 500 346 C516 336 516 316 500 296Z',fill:'#ff8a2a',filter:'url(#gl)',class:'fire2'},g);
  el('path',{d:'M500 316 C493 328 494 338 500 343 C506 338 507 328 500 316Z',fill:'#ffe08a'},g);
  return [500,405]}},
{id:'skill',name:'The Skill Yard',tag:'Axes, wood and craft',desc:'Open ground for woodcraft: chopping blocks, a split-and-stack area, an axe lane for supervised practice, and benches for carving and tool care.',draw:function(g){
  el('rect',{x:70,y:215,width:200,height:150,rx:12,fill:'#1d2418',stroke:'#3b4a2c','stroke-width':2,'stroke-dasharray':'6 5'},g);
  [[110,250],[160,300],[110,335],[230,255]].forEach(function(p){el('circle',{cx:p[0],cy:p[1],r:15,fill:'#4a3524',stroke:'#2a1d12','stroke-width':2},g);el('circle',{cx:p[0],cy:p[1],r:8,fill:'none',stroke:'#2a1d12'},g);});
  el('path',{d:'M205 285 L250 265 L246 252 L200 272Z',fill:'#b7c0d0'},g);
  el('rect',{x:196,y:330,width:60,height:14,rx:3,fill:'#3a2a1d'},g);
  return [170,385]}},
{id:'education',name:'The Education Tent',tag:'Classes and study',desc:'A large open-sided tent for classes, reading, apprenticeships and storytelling. Teachers and students gather here out of the weather.',draw:function(g){
  el('polygon',{points:'170,60 255,125 170,190 85,125',fill:'#2a2744',stroke:'#7d78b8','stroke-width':2.5},g);
  el('path',{d:'M170 60 V190 M85 125 H255',stroke:'#7d78b866','stroke-width':1.5},g);
  el('circle',{cx:170,cy:125,r:9,fill:'#e9c98a'},g);
  return [170,205]}},
{id:'market',name:'The Marketplace',tag:'Makers and trade',desc:'A row of stalls where members sell and trade what they make: bread, leatherwork, herbs, candles, carved goods. Money earned stays in the community.',draw:function(g){
  var cols=['#7a1f2b','#1f3a5a','#8a5a1f','#2a4a2f','#5a2a5a'];
  for(var i=0;i<5;i++){el('rect',{x:700+(i%3)*66,y:90+Math.floor(i/3)*70,width:54,height:46,rx:3,fill:cols[i],stroke:'#00000066'},g);el('path',{d:'M'+(700+(i%3)*66)+' '+(90+Math.floor(i/3)*70)+' h54',stroke:'#f1e9d6','stroke-width':3,'stroke-dasharray':'6 4',opacity:.8},g)}
  return [790,245]}},
{id:'ritual',name:'The Stone Circle',tag:'Rite and observance',desc:'A circle of standing stones set apart from the busy parts of the village, for seasonal rites, memorials and quiet reflection.',draw:function(g){
  for(var i=0;i<9;i++){var a=i/9*6.283;el('rect',{x:820+Math.cos(a)*48-6,y:345+Math.sin(a)*48-10,width:12,height:20,rx:4,fill:'#5a5f6e',stroke:'#2a2e38'},g)}
  el('circle',{cx:820,cy:345,r:9,fill:'#2a2e38'},g);
  return [820,415]}},
{id:'bake',name:'The Bakehouse',tag:'Oven and kitchen',desc:'A clay bread oven and communal kitchen beside the hearth. Bread, stews and feast-day cooking are made here, and the fire skills are taught here.',draw:function(g){
  el('rect',{x:625,y:300,width:70,height:56,rx:8,fill:'#2b2118',stroke:'#6b4e32','stroke-width':2.5},g);
  el('circle',{cx:660,cy:328,r:16,fill:'#6a4a35'},g);el('path',{d:'M652 332 q8 -14 16 0z',fill:'#ffb050',filter:'url(#gl)',class:'fire2'},g);
  return [660,375]}},
{id:'tents',name:"Traveler's Tents",tag:'Rest and shelter',desc:'A ring of simple tents where travelers can rest. A safe place to sleep, wash and eat before moving on or staying to help.',draw:function(g){
  [[120,470],[200,500],[280,470],[160,550],[250,555],[330,520]].forEach(function(p,i){el('polygon',{points:(p[0]-30)+','+(p[1]+22)+' '+p[0]+','+(p[1]-26)+' '+(p[0]+30)+','+(p[1]+22),fill:i%2?'#232746':'#2a2338',stroke:'#7f86c0','stroke-width':1.8},g);el('path',{d:'M'+p[0]+' '+(p[1]-26)+' V'+(p[1]+22),stroke:'#7f86c066'},g);el('rect',{x:p[0]-5,y:p[1]+6,width:10,height:16,fill:'#ffd27a',opacity:.85,class:'fire2'},g)});
  return [225,600]}},
{id:'gardens',name:'The Gardens',tag:'Food and herbs',desc:'Raised beds for vegetables, a herb garden, and fruit trees. Grown by hands that eat from it, and taught as a workshop.',draw:function(g){
  for(var r=0;r<3;r++)for(var c=0;c<4;c++)el('rect',{x:680+c*52,y:450+r*38,width:44,height:28,rx:3,fill:'#27402b',stroke:'#4b7a52'},g);
  [[690,445],[760,445],[830,445]].forEach(function(p){el('circle',{cx:p[0],cy:p[1],r:5,fill:'#6aa56e'},g)});
  return [790,590]}},
{id:'gate',name:'The Gate',tag:'Arrival',desc:'The way in. Two raven banners mark the gate, and someone is always there to greet whoever arrives and show them to the fire.',draw:function(g){
  el('rect',{x:446,y:586,width:12,height:40,fill:'#4a3524'},g);el('rect',{x:542,y:586,width:12,height:40,fill:'#4a3524'},g);
  el('path',{d:'M446 592 h-30 l8 10 l-8 10 h30z M554 592 h30 l-8 10 l8 10 h-30z',fill:'#7a1f2b'},g);
  return [500,572]}}
];

var info=document.getElementById('info'),chips=document.getElementById('chips'),current=null;
function select(id){
  var s=spots.filter(function(x){return x.id===id})[0];if(!s)return;current=id;
  info.querySelector('h3').textContent=s.name;
  info.querySelector('p').textContent=s.desc;
  info.querySelector('.tag').textContent=s.tag;
  svg.querySelectorAll('.spot').forEach(function(n){n.classList.toggle('sel',n.dataset.id===id)});
  chips.querySelectorAll('button').forEach(function(b){b.classList.toggle('sel',b.dataset.id===id)});
}
spots.forEach(function(s){
  var g=el('g',{class:'spot',tabindex:0,role:'button','aria-label':s.name+': '+s.tag,'data-id':s.id},svg);
  var lab=s.draw(g);
  var bb;g.addEventListener('click',function(){select(s.id)});
  g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();select(s.id)}});
  g.setAttribute('data-id',s.id);
  var t=el('text',{x:lab[0],y:lab[1],'text-anchor':'middle'},g);t.textContent=s.name;
  var b=document.createElement('button');b.textContent=s.name;b.dataset.id=s.id;b.type='button';b.addEventListener('click',function(){select(s.id)});chips.appendChild(b);
});
// hit areas from bounding boxes
svg.querySelectorAll('.spot').forEach(function(g){
  var bb=g.getBBox();var h=el('rect',{class:'hit',x:bb.x-8,y:bb.y-8,width:bb.width+16,height:bb.height+16,rx:14},g);g.insertBefore(h,g.firstChild);
});
if(location.hash){select(location.hash.slice(1))}
})();
