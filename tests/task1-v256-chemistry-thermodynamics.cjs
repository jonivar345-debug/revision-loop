'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('chemistry_thermodynamics_applications_v256.json'),deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v256');assert.equal(bank.cards.length,28);assert.equal(deck.cards.length,3345);
const files=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(files.length,41);assert.equal(files[39],'chemistry_atomic_tof_applications_v254.json');assert.equal(files[40],'chemistry_thermodynamics_applications_v256.json');
assert(sw.includes("'./chemistry_thermodynamics_applications_v256.json'"));assert(sw.includes('-v256-thermodynamics'));
const existing=[...deck.cards,...files.slice(0,40).flatMap(f=>json(f).cards||[])];
const ids=new Set(existing.map(c=>c.id)),fronts=new Set(existing.filter(c=>c.subject==='Chemistry').map(c=>c.front.trim().toLowerCase()));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);assert(start>=0&&end>start);
const marker=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let valid=0,invalid=0;const duplicates=[];
for(const c of bank.cards){
 assert(!ids.has(c.id),'Duplicate id '+c.id);ids.add(c.id);
 if(fronts.has(c.front.trim().toLowerCase()))duplicates.push(c.id);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'A2');assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert(['3.1.8.1','3.1.8.2'].includes(c.specRef));assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);
 for(const answer of c.accept){assert.equal(marker(c,answer).status,'correct','Valid answer failed '+c.id+': '+answer);valid++;}
 for(const answer of c.reject){assert.equal(marker(c,answer).status,'wrong','Wrong answer passed '+c.id+': '+answer);invalid++;}
}
assert.deepEqual(duplicates,[],'New prompts duplicate existing Chemistry');
assert.equal(valid,84);assert.equal(invalid,56);
const near=(x,y)=>Math.abs(x-y)<Math.max(1e-10,Math.abs(y)*1e-9);
assert.equal(-411-(108+121+496-349),-787);
assert.equal(-411-(108+121+496-787),-349);
assert.equal(-411-(108+121-349-787),496);
assert.equal(-574-(108+79+496-328),-929);
assert.equal(-602-(150+249+738+1450-141+744),-3792);
assert.equal(2*-349,-698);assert.equal(242/2,121);
assert.equal(787-406-363,18);assert.equal(2526-1920-2*364,-122);
assert.equal(-5-750+400,-355);
assert(near(-120-298*(-100/1000),-90.2));
assert.equal(40-350*(200/1000),-30);
assert.equal(75/(250/1000),300);assert.equal(-60/(-150/1000),400);
assert.equal(250-180-190,-120);
assert.equal(2*257-(2*248+205),-187);
assert.equal(-125/1000,-0.125);assert.equal(-80/(-160/1000),500);
assert.equal(-100-400*(-200/1000),-20);
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);assert(a>0&&b>a);assert(app.slice(a,b).includes('else if(index===40)'));
const loader=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;');
const good=Array.from({length:41},()=>({cards:[]}));good[40]=bank;assert.equal(loader([...deck.cards],good).length,3373);
const bad=Array.from({length:41},()=>({cards:[]}));bad[40]={cards:bank.cards.slice(0,7).map((c,i)=>({...c,...[
 {subject:'Physics'},{stage:'AS'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.1.11'}
][i]}))};assert.equal(loader([...deck.cards],bad).length,3345);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v256: 28 A2 school-mock Born-Haber/Gibbs applications, 84 valid and 56 wrong, independent enthalpy and entropy arithmetic, scoped loader, saved progress.');
