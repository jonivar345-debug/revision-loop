'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const deck=json('deck.json'),bank=json('chemistry_atomic_tof_applications_v254.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v254');assert.equal(bank.cards.length,30);assert.equal(deck.cards.length,3345);
const urls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(urls.length,40);assert.equal(urls[38],'physics_waves_applications_v253.json');assert.equal(urls[39],'chemistry_atomic_tof_applications_v254.json');
assert(sw.includes("'./chemistry_atomic_tof_applications_v254.json'"));assert(sw.includes('-v254-chem-tof'));
const existing=[...deck.cards,...urls.slice(0,39).flatMap(p=>json(p).cards||[])];
const ids=new Set(existing.map(c=>c.id)),fronts=new Set(existing.filter(c=>c.subject==='Chemistry').map(c=>c.front.trim().toLowerCase()));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);assert(start>0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const duplicates=[];let accept=0,reject=0;
for(const c of bank.cards){
 assert(!ids.has(c.id),'Repeated ID '+c.id);ids.add(c.id);
 if(fronts.has(c.front.trim().toLowerCase()))duplicates.push(c.id);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert(/^3\.1\.1\.[123]$/.test(c.specRef));assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);
 for(const a of c.accept){assert.equal(judge(c,a).status,'correct','Valid '+c.id+': '+a);accept++;}
 for(const a of c.reject){assert.equal(judge(c,a).status,'wrong','Wrong '+c.id+': '+a);reject++;}
}
assert.deepEqual(duplicates,[],'New flashcards duplicate existing Chemistry');
assert.equal(accept,90);assert.equal(reject,60);
const near=(a,b)=>Math.abs(a-b)<Math.max(1e-12,Math.abs(b)*1e-7);
assert(near((63*69+65*31)/100,63.62));assert(near((35*75+37*25)/100,35.5));
assert(near((24*79+25*10+26*11)/100,24.32));assert.equal((52+54)/2,53);
assert.equal(13-3,10);assert.equal(56-26,30);assert.equal(17+1,18);
assert(near(Math.sqrt(25/20),1.1180339887));
assert(near(Math.sqrt(2*1.2e-15/6e-26),2e5));
assert(near(.5*4e-26*(2e5)**2,8e-16));
assert(near(1.2/(3e4),4e-5));
assert.equal(26-2,24);assert.equal(26-3,23);
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);assert(a>0&&b>a);assert(app.slice(a,b).includes('else if(index===39)'));
const loader=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;');
const good=Array.from({length:40},()=>({cards:[]}));good[39]=bank;
assert.equal(loader([...deck.cards],good).length,3375);
const bad=Array.from({length:40},()=>({cards:[]));bad[39]={cards:bank.cards.slice(0,7).map((c,i)=>({...c,...[
 {subject:'Physics'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.1.8'}
][i]}))};assert.equal(loader([...deck.cards],bad).length,3345);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v254: 30 AS Chemistry atomic/TOF recall applications; 90 valid and 60 invalid answers, numeric/isotope checks, mock-scope filter, stable IDs.');
