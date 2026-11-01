'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('physics_mechanics_applications_v257.json'),deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v257');assert.equal(bank.cards.length,34);assert.equal(deck.cards.length,3345);
const urls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(urls.length,42);assert.equal(urls[40],'chemistry_thermodynamics_applications_v256.json');assert.equal(urls[41],'physics_mechanics_applications_v257.json');
assert(sw.includes("'./physics_mechanics_applications_v257.json'"));assert(sw.includes('-v257-mechanics'));
const existing=[...deck.cards,...urls.slice(0,41).flatMap(f=>json(f).cards||[])];
const ids=new Set(existing.map(c=>c.id)),fronts=new Set(existing.filter(c=>c.subject==='Physics').map(c=>c.front.trim().toLowerCase()));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);assert(start>0&&end>start);
const marker=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accepted=0,rejected=0;const repeated=[];
for(const c of bank.cards){
 assert(!ids.has(c.id),'Duplicate ID '+c.id);ids.add(c.id);
 if(fronts.has(c.front.trim().toLowerCase()))repeated.push(c.id);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert(/^3\.4\.[12]\.[1-8]$/.test(c.specRef));
 assert.equal(c.mock,true);assert.equal(c.scope,'mock');assert.equal(c.taught,true);assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);
 for(const a of c.accept){assert.equal(marker(c,a).status,'correct','Valid '+c.id+': '+a);accepted++;}
 for(const a of c.reject){assert.equal(marker(c,a).status,'wrong','Wrong '+c.id+': '+a);rejected++;}
}
assert.deepEqual(repeated,[]);assert.equal(accepted,102);assert.equal(rejected,68);
const near=(x,y)=>Math.abs(x-y)<=Math.max(1e-12,Math.abs(y)*1e-7);
assert(near(20*Math.cos(Math.PI/6),17.320508));assert(near(20*Math.sin(Math.PI/6),10));
assert(near(5*9.8*Math.sin(Math.PI/6),24.5));assert(near(5*9.8*Math.cos(Math.PI/6),42.435245));
assert.equal(Math.hypot(6,8),10);assert(near(Math.atan2(4,3)*180/Math.PI,53.130102));
assert.equal(12*.25,3);assert.equal(15*.4,6);assert.equal(4/2,2);
assert.equal(15/3,5);assert.equal(((-2+6)/2)*4,8);assert.equal((-3-5)/4,-2);assert.equal(2*4.9,9.8);
assert.equal(Math.sqrt(2*19.6/9.8),2);assert.equal(12*2,24);assert(near(20*Math.sin(Math.PI/6)/9.8,1.020408));
assert.equal((12-3)/3,3);assert.equal(5/(2+3),1);assert.equal(.2*15,3);
assert.equal(.15*(-8-12)/.04,-75);assert.equal(.5*8/(.5+.5),4);
assert.equal(150*3,450);assert.equal(120/200*100,60);assert.equal(5*9.8*2,98);
assert.equal(.5*2*(10**2-6**2),64);assert.equal(20/.04,500);assert.equal(.5*20*.04,.4);
assert(near(60/2e-6,3e7));assert(near(.001/2,5e-4));
assert(near(100*2/(1e-6*.002),1e11));assert(near(200e6/.001,2e11));
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);assert(a>0&&b>a);assert(app.slice(a,b).includes('else if(index===41)'));
const load=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;');
const pass=Array.from({length:42},()=>({cards:[]}));pass[41]=bank;assert.equal(load([...deck.cards],pass).length,3379);
const bad=Array.from({length:42},()=>({cards:[]}));bad[41]={cards:bank.cards.slice(0,7).map((c,i)=>({...c,...[
 {subject:'Maths'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.6.2'}
][i]}))};assert.equal(load([...deck.cards],bad).length,3345);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v257: 34 AS Physics Mechanics application cards, 102 correct and 68 wrong variants, numerics, mock-only loader and saved progress.');
