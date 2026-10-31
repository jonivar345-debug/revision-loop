'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const deck=json('deck.json'),bank=json('chemistry_rates_kp_applications_v249.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v249');assert.equal(bank.cards.length,28);assert.equal(deck.cards.length,3345);
const urls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(urls.length,36);assert.equal(urls[34],'physics_measurements_applications_v248.json');assert.equal(urls[35],'chemistry_rates_kp_applications_v249.json');
assert(sw.includes("'./chemistry_rates_kp_applications_v249.json'"));assert(sw.includes('-v249-rates-kp'));
const old=[...deck.cards,...urls.slice(0,35).flatMap(p=>json(p).cards||[])];const ids=new Set(old.map(c=>c.id)),fronts=new Set(old.filter(c=>c.subject==='Chemistry').map(c=>c.front.trim().toLowerCase()));
const a=app.indexOf('function normalise('),b=app.indexOf('function importantTokens(',a);assert(a>=0&&b>a);
const judge=new Function('window',app.slice(a,b)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let good=0,bad=0;
for(const c of bank.cards){
 assert(!ids.has(c.id),'ID collision '+c.id);ids.add(c.id);
 assert(!fronts.has(c.front.trim().toLowerCase()),'Repeated question '+c.id);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'A2');assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert(['3.1.9.1','3.1.9.2','3.1.10'].includes(c.specRef));assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
 for(const ans of c.accept){assert.equal(judge(c,ans).status,'correct','Valid '+c.id+': '+ans);good++;}
 for(const ans of c.reject){assert.equal(judge(c,ans).status,'wrong','Invalid '+c.id+': '+ans);bad++;}
}
assert.equal(good,84);assert.equal(bad,56);
assert.equal(2**2*2,8);assert.equal((.02)**2*2,.0008);assert.equal(.012/.20,.06);
assert.equal(6000*8.31/1000,49.86);assert.equal(.25*400,100);assert.equal(2/(2+6),.25);
assert.equal(40**2/80,20);assert.equal(60**2/(40*20),4.5);
assert.equal((.10-0)/20,.005);
const begin=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),end=app.indexOf(' const added=[',begin);assert(begin>0&&end>begin);assert(app.slice(begin,end).includes('else if(index===35)'));
const loader=new Function('cards','extraFlashBanks',app.slice(begin,end)+'\nreturn cards;');
const goodBanks=Array.from({length:36},()=>({cards:[]}));goodBanks[35]=bank;assert.equal(loader([...deck.cards],goodBanks).length,3373);
const badBanks=Array.from({length:36},()=>({cards:[]}));
badBanks[35]={cards:bank.cards.slice(0,7).map((c,i)=>({...c,...[
 {subject:'Physics'},{stage:'AS'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.1.11'}
][i]}))};
assert.equal(loader([...deck.cards],badBanks).length,3345);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v249: 28 taught A2 rate/Kp mock cards, 84 correct and 56 false answers, independent numerical checks, exclusion filters and preservation.');
