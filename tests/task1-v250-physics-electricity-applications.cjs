'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('physics_electricity_applications_v250.json'),deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v250');assert.equal(bank.cards.length,26);assert.equal(deck.cards.length,3345);
const files=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(files.length>=37);assert.equal(files[35],'chemistry_rates_kp_applications_v249.json');assert.equal(files[36],'physics_electricity_applications_v250.json');
assert(sw.includes("'./physics_electricity_applications_v250.json'"));assert(sw.includes('-v250-electricity'));
const previous=[...deck.cards,...files.slice(0,36).flatMap(p=>json(p).cards||[])];
const ids=new Set(previous.map(x=>x.id)),fronts=new Set(previous.filter(x=>x.subject==='Physics').map(x=>x.front.trim().toLowerCase()));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);assert(start>=0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const repeated=[];let right=0,wrong=0;
for(const c of bank.cards){
 assert(!ids.has(c.id),'ID collision '+c.id);ids.add(c.id);
 if(fronts.has(c.front.trim().toLowerCase()))repeated.push(c.id);
 fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert(/^3\.5\.1\.[1-6]$/.test(c.specRef));
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
 for(const a of c.accept){assert.equal(judge(c,a).status,'correct','Correct rejected '+c.id+': '+a);right++;}
 for(const a of c.reject){assert.equal(judge(c,a).status,'wrong','Wrong accepted '+c.id+': '+a);wrong++;}
}
assert.deepEqual(repeated,[],'New fronts must not duplicate existing Physics content');
assert.equal(right,78);assert.equal(wrong,52);
assert(Math.abs(3.6/120-.03)<1e-12);assert.equal(12/3,4);assert.equal(3/.25,12);assert.equal(1/.5,2);
assert.equal(5*2e-7/2,5e-7);assert.equal(5*4e-7,2e-6);
assert(Math.abs(2*.01/.4*100-5)<1e-12);
assert.equal(12*8/(4+8),8);assert.equal((6*3)/(6+3),2);
assert.equal(9*4/(2+4),6);assert.equal(9*2/(2+2),4.5);
assert.equal((1.50-1.25)/.5,.5);assert.equal(2**2*.25,1);
assert.equal(6/(1+5),1);assert.equal(.2/2,.1);
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);
assert(a>=0&&b>a);assert(app.slice(a,b).includes('else if(index===36)'));
const loader=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;');
const good=Array.from({length:37},()=>({cards:[]}));good[36]=bank;
assert.equal(loader([...deck.cards],good).length,3345+26);
const bad=Array.from({length:37},()=>({cards:[]}));
bad[36]={cards:bank.cards.slice(0,7).map((c,i)=>({...c,...[
 {subject:'Chemistry'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.6.1'}
][i]}))};
assert.equal(loader([...deck.cards],bad).length,3345);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v250: 26 AS electricity applications, 78 accepted, 52 rejected, arithmetic, duplicate and mock-only checks.');
