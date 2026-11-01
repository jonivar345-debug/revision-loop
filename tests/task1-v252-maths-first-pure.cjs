'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('maths_first_mock_pure_challenges_v252.json'),deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v252');assert.equal(bank.cards.length,20);assert.equal(deck.cards.length,3345);
const files=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(files.length>=38);assert.equal(files[36],'physics_electricity_applications_v250.json');assert.equal(files[37],'maths_first_mock_pure_challenges_v252.json');
assert(sw.includes("'./maths_first_mock_pure_challenges_v252.json'"));assert(sw.includes('-v252-maths-first-pure'));
const old=[...deck.cards,...files.slice(0,37).flatMap(p=>json(p).cards||[])];
const oldIds=new Set(old.map(c=>c.id)),oldFronts=new Set(old.filter(c=>c.subject==='Maths').map(c=>c.front.trim().toLowerCase()));
const i=app.indexOf('function normalise('),j=app.indexOf('function importantTokens(',i);assert(i>=0&&j>i);
const judge=new Function('window',app.slice(i,j)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let correct=0,incorrect=0;const repeated=[];
for(const c of bank.cards){
 assert(!oldIds.has(c.id),'ID collision '+c.id);oldIds.add(c.id);
 if(oldFronts.has(c.front.trim().toLowerCase()))repeated.push(c.id);
 oldFronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Maths');assert.equal(c.stage,'AS');assert.equal(c.scope,'mock');
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert(['3.2','3.3','3.5','3.9','3.11'].includes(c.specRef));assert(c.accept.length>=3,'Keep original valid answers');assert(c.reject.length>=2,'Keep original invalid answers');
 for(const a of c.accept){assert.equal(judge(c,a).status,'correct','Valid '+c.id+': '+a);correct++;}
 for(const a of c.reject){assert.equal(judge(c,a).status,'wrong','Invalid '+c.id+': '+a);incorrect++;}
}
assert.deepEqual(repeated,[]);assert(correct>=60,'Preserve original 60 valid answers');assert(incorrect>=40,'Preserve original 40 wrong answers');
assert.equal((2*3+1)+(2*3+3),4*(3+1));
assert.equal((2*3+1)**2%8,1);
assert.deepEqual([0,1,2,3].map(n=>n**3-n),[0,0,6,24]);
assert.deepEqual([4-(-2),-5-3],[6,-8]);
assert.equal(Math.hypot(4-(-1),14-2),13);
assert.deepEqual([1+3*(5/3),-2+9*(5/3)],[6,13]);
assert.deepEqual([2+12/4,3-4/4],[5,2]);
assert.equal((4-2)/2,1);assert.equal((4+4)/2,4);assert.equal(-5+3,-2);
assert.equal(4*8*-3,-96);assert.equal(10*(2**3),80);
const F=x=>x**3/3-x;
const signed=F(2)-F(-2);assert(Math.abs(signed-4/3)<1e-10);
const positive=(F(-1)-F(-2))-(F(1)-F(-1))+(F(2)-F(1));assert(Math.abs(positive-4)<1e-10);
assert.equal(3*(2**4-1),45);
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);assert(a>0&&b>a);assert(app.slice(a,b).includes('else if(index===37)'));
const load=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;');
const good=Array.from({length:38},()=>({cards:[]}));good[37]=bank;
assert.equal(load([...deck.cards],good).length,3365);
const bad=Array.from({length:38},()=>({cards:[]}));
bad[37]={cards:bank.cards.slice(0,7).map((c,i)=>({...c,...[
 {subject:'Physics'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.21'}
][i]}))};
assert.equal(load([...deck.cards],bad).length,3345);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v252: 20 first-mock Pure Maths applications, '+correct+' correct and '+incorrect+' wrong answers, independent proofs/vectors/integrals, scope and preserved progress.');
