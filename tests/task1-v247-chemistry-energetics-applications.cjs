'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('chemistry_energetics_applications_v247.json'),deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(bank.cards.length,18);assert.equal(bank.version,'v247');assert.equal(deck.cards.length,3345);
const urls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(urls.length,34);assert.equal(urls[32],'maths_first_mock_circle_geometry_v246.json');assert.equal(urls[33],'chemistry_energetics_applications_v247.json');
assert(sw.includes("'./chemistry_energetics_applications_v247.json'"));assert(sw.includes('-v247-chem-energetics'));
const previous=[...deck.cards,...urls.slice(0,33).flatMap(f=>json(f).cards||[])],ids=new Set(previous.map(c=>c.id));
const fronts=new Set(previous.filter(c=>c.subject==='Chemistry').map(c=>c.front.trim().toLowerCase()));
const i=app.indexOf('function normalise('),j=app.indexOf('function importantTokens(',i);
assert(i>=0&&j>i);const judge=new Function('window',app.slice(i,j)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accept=0,reject=0;
for(const c of bank.cards){
 assert(!ids.has(c.id),'ID collision '+c.id);ids.add(c.id);
 assert(!fronts.has(c.front.trim().toLowerCase()),'Repeated prompt '+c.id);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');assert.equal(c.mock,true);
 assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert(/^3\.1\.4\.[1-4]$/.test(c.specRef),'Out of scope '+c.id);
 assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
 for(const a of c.accept){assert.equal(judge(c,a).status,'correct','Valid response rejected '+c.id+': '+a);accept++;}
 for(const a of c.reject){assert.equal(judge(c,a).status,'wrong','Invalid response accepted '+c.id+': '+a);reject++;}
}
assert.equal(accept,54);assert.equal(reject,36);
assert.equal(50*4.18*5,1045);assert.equal(.025*2,.05);assert.equal(-2.09/.05,-41.8);
assert.equal(40*4.18*7.5,1254);assert(Math.abs(-1.254/.02+62.7)<1e-9);
assert(Math.abs((32.4-20)-12.4)<1e-9);assert.equal(.2/8*100,2.5);
assert.equal((-394+2*-286)-(-239),-727);assert.equal(-1411-286+1560,-137);
assert.equal(-50-(-15),-35);
assert.equal((4*413+2*498)-(2*805+4*463),-814);
const begin=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),finish=app.indexOf(' const added=[',begin);
assert(begin>0&&finish>begin);assert(app.slice(begin,finish).includes('else if(index===33)'));
const loader=new Function('cards','extraFlashBanks',app.slice(begin,finish)+'\nreturn cards;');
const banks=Array.from({length:34},()=>({cards:[]}));banks[33]=bank;
assert.equal(loader([...deck.cards],banks).length,3345+18);
const invalid=Array.from({length:34},()=>({cards:[]}));
invalid[33]={cards:bank.cards.slice(0,7).map((c,i)=>({...c,...[
 {subject:'Physics'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.1.8.1'}
][i]}))};
assert.equal(loader([...deck.cards],invalid).length,3345);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v247: 18 Energetics/RP2 mock application cards, 54 accepted and 36 rejected answers, independent numerical checks, proper offline and mock-only inclusion.');
