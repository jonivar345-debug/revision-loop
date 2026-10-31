'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('physics_measurements_applications_v248.json'),deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v248');assert.equal(bank.cards.length,28);assert.equal(deck.cards.length,3345);
const files=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(files.length,35);assert.equal(files[33],'chemistry_energetics_applications_v247.json');assert.equal(files[34],'physics_measurements_applications_v248.json');
assert(sw.includes("'./physics_measurements_applications_v248.json'"));assert(sw.includes('-v248-physics-measurements'));
const existing=[...deck.cards,...files.slice(0,34).flatMap(f=>json(f).cards||[])];
const ids=new Set(existing.map(c=>c.id));const fronts=new Set(existing.filter(c=>c.subject==='Physics').map(c=>c.front.trim().toLowerCase()));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);assert(start>=0&&end>start);
const marker=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let good=0,bad=0;
for(const card of bank.cards){
 assert(!ids.has(card.id),'ID collision '+card.id);ids.add(card.id);
 assert(!fronts.has(card.front.trim().toLowerCase()),'Duplicate Physics prompt '+card.id);fronts.add(card.front.trim().toLowerCase());
 assert.equal(card.subject,'Physics');assert.equal(card.stage,'AS');assert(/^3\.1\.[1-3]$/.test(card.specRef));
 assert.equal(card.mock,true);assert.equal(card.scope,'mock');assert.equal(card.taught,true);assert.equal(card.active,true);assert.equal(card.strictRecall,true);
 assert.equal(card.accept.length,3);assert.equal(card.reject.length,2);assert(card.accept.includes(card.back));
 for(const answer of card.accept){assert.equal(marker(card,answer).status,'correct','Valid '+card.id+': '+answer);good++;}
 for(const answer of card.reject){assert.equal(marker(card,answer).status,'wrong','Invalid '+card.id+': '+answer);bad++;}
}
assert.equal(good,84);assert.equal(bad,56);
assert.equal(2.50e6,2500000);assert.equal(.08e-9,8e-11);assert.equal(.75e-6/1e-9,750);
assert.equal(4.8*3.6e6,17280000);assert.equal(2*1.6e-19,3.2e-19);
assert.equal(.15/3*100,5);assert.equal(.04/2,.02);assert(Math.abs((12.4-5.1)-7.3)<1e-9);
assert.equal((.1/5+.2/4)*100,7);assert.equal(2*2,4);
assert(Math.abs((12.5-12.1)/2-.2)<1e-8);
assert.equal((3.3-.2).toFixed(1),'3.1');assert.equal((3.3+.2).toFixed(1),'3.5');
assert(Math.abs((2.3-1.9)/2-.2)<1e-9);
assert.equal((.2/2.1*100).toFixed(1),'9.5');
assert(Math.abs((.7-.3)/2-.2)<1e-9);
assert(Math.round(Math.log10(4700)),4);assert(Math.round(Math.log10(2.5e-5)),-5);
assert.equal(2/1000*1000,2);assert.equal(30/1.5,20);
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);
assert(a>=0&&b>a);assert(app.slice(a,b).includes('else if(index===34)'));
const loader=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;');
const valid=Array.from({length:35},()=>({cards:[]}));valid[34]=bank;assert.equal(loader([...deck.cards],valid).length,3373);
const invalid=Array.from({length:35},()=>({cards:[]}));
invalid[34]={cards:bank.cards.slice(0,7).map((c,i)=>({...c,...[
 {subject:'Maths'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.2'}
][i]}))};
assert.equal(loader([...deck.cards],invalid).length,3345);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v248: 28 AS measurement applications, 84 valid and 56 invalid responses, independent calculations, mock-only loader, existing keys preserved.');
