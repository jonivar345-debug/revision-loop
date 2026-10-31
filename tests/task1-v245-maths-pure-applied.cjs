'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('maths_first_mock_pure_applied_v245.json'),deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(deck.cards.length,3345);assert.equal(bank.version,'v245');assert.equal(bank.cards.length,17);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
assert(sw.includes("'./maths_first_mock_pure_applied_v245.json'"));assert(sw.includes('-v245-pure-applied'));
const names=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(names.length,32);assert.equal(names[30],'physics_particles_applications_v243.json');assert.equal(names[31],'maths_first_mock_pure_applied_v245.json');
const old=[...deck.cards,...names.slice(0,31).flatMap(file=>json(file).cards||[])];
const ids=new Set(old.map(x=>x.id)),fronts=new Set(old.filter(x=>x.subject==='Maths').map(x=>String(x.front).trim().toLowerCase()));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>=0&&end>start);const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const expected={'3.2':5,'3.3':3,'3.5':2,'3.9':2,'3.11':5};
let correct=0,wrong=0;
for(const c of bank.cards){
 assert(!ids.has(c.id),'ID collision '+c.id);ids.add(c.id);
 assert(!fronts.has(c.front.trim().toLowerCase()),'Repeated maths question '+c.id);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Maths');assert.equal(c.stage,'AS');assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert(Object.hasOwn(expected,c.specRef),'Out of scope specRef '+c.id);
 assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
 assert.equal(judge(c,c.back).status,'correct','Model rejected '+c.id);
 for(const ans of c.accept){assert.equal(judge(c,ans).status,'correct','Valid answer not accepted '+c.id+': '+ans);correct++;}
 for(const ans of c.reject){assert.equal(judge(c,ans).status,'wrong','Invalid answer wrongly accepted '+c.id+': '+ans);wrong++;}
}
for(const [ref,n] of Object.entries(expected))assert.equal(bank.cards.filter(c=>c.specRef===ref).length,n);
assert.equal(correct,51);assert.equal(wrong,34);
const vec=[2,-1],other=[-4,7],dx=other[0]-vec[0],dy=other[1]-vec[1];
assert.deepEqual([dx,dy],[-6,8]);assert.equal(Math.hypot(dx,dy),10);
assert(Math.abs(Math.atan2(4,-3)*180/Math.PI-126.9)<0.05);
assert.deepEqual([5-1,10-2],[2*(3-1),2*(6-2)]);
assert.notEqual((5-1)/(3-1),(9-2)/(6-2));
assert.equal(6*2*2,24);assert.equal(3*3,9);
const signed=(4**3/3-2*4**2);assert(Math.abs(signed+32/3)<1e-10);
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);assert(a>0&&b>a);
assert(app.slice(a,b).includes('else if(index===31)'));
const loader=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;');
const empty=Array.from({length:32},()=>({cards:[]}));empty[31]=bank;
const output=loader([...deck.cards],empty);assert.equal(output.length,3345+17);
for(const c of bank.cards)assert(output.some(x=>x.id===c.id));
const negative=Array.from({length:32},()=>({cards:[]}));
negative[31]={cards:bank.cards.slice(0,7).map((c,i)=>({...c,...[
 {subject:'Physics'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{specRef:'3.12'},{specRef:'3.20'}
][i]}))};
const omitted=loader([...deck.cards],negative);
for(const c of negative[31].cards)assert(!omitted.some(x=>x.id===c.id),'Out of scope card admitted '+c.id);
console.log('PASS v245: 17 AS Pure mock applications, 51 valid and 34 invalid answers, independent calculations, proper Year 1 only scope, progress and offline loader.');
