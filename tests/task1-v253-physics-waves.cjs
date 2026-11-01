'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('physics_waves_applications_v253.json'),deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v253');assert.equal(bank.cards.length,34);assert.equal(deck.cards.length,3345);
const urls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(urls.length,39);assert.equal(urls[37],'maths_first_mock_pure_challenges_v252.json');assert.equal(urls[38],'physics_waves_applications_v253.json');
assert(sw.includes("'./physics_waves_applications_v253.json'"));assert(sw.includes('-v253-physics-waves'));
const before=[...deck.cards,...urls.slice(0,38).flatMap(p=>json(p).cards||[])];
const ids=new Set(before.map(c=>c.id)),fronts=new Set(before.filter(c=>c.subject==='Physics').map(c=>c.front.trim().toLowerCase()));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);assert(start>0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const duplicates=[];let accepted=0,rejected=0;
for(const c of bank.cards){
 assert(!ids.has(c.id),'Repeated ID '+c.id);ids.add(c.id);
 if(fronts.has(c.front.trim().toLowerCase()))duplicates.push(c.id);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert(/^3\.3\.[12]\.[123]$/.test(c.specRef));assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);
 for(const a of c.accept){assert.equal(judge(c,a).status,'correct','Valid '+c.id+': '+a);accepted++;}
 for(const a of c.reject){assert.equal(judge(c,a).status,'wrong','Wrong '+c.id+': '+a);rejected++;}
}
assert.deepEqual(duplicates,[],'Duplicate prompt(s) against existing Physics deck');
assert.equal(accepted,102);assert.equal(rejected,68);
const near=(a,b)=>Math.abs(a-b)<1e-7;
assert.equal(.75*40,30);assert.equal(1/.025,40);assert.equal(120/(2*1.5),40);
assert(near(.0000005*2/.0005,.002));assert(near(1/(500*1000),2e-6));
assert(near(Math.asin(600e-9/2e-6)*180/Math.PI,17.457603));
assert.equal(Math.floor(2.5e-6/600e-9),4);
assert(near(Math.asin(Math.sin(Math.PI/6)/1.5)*180/Math.PI,19.471221));
assert(near(3e8/1.5,2e8));assert(near(600/1.5,400));
assert(near(Math.asin(1/1.5)*180/Math.PI,41.810315));
assert(near(Math.asin(1.45/1.5)*180/Math.PI,75.164889));
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);assert(a>0&&b>a);assert(app.slice(a,b).includes('else if(index===38)'));
const loader=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;');
const banks=Array.from({length:39},()=>({cards:[]}));banks[38]=bank;assert.equal(loader([...deck.cards],banks).length,3379);
const bad=Array.from({length:39},()=>({cards:[]}));bad[38]={cards:bank.cards.slice(0,7).map((c,i)=>({...c,...[
 {subject:'Chemistry'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.4'}
][i]}))};assert.equal(loader([...deck.cards],bad).length,3345);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v253: 34 Physics waves applications, 102 accepted and 68 rejected variants, numerical proofs, mock-only loader and preserved progress.');
