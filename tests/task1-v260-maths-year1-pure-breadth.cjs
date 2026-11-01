'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const deck=json('deck.json'),bank=json('maths_year1_pure_breadth_v260.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v260');assert.equal(bank.cards.length,38);assert.equal(deck.cards.length,3345);
const urls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(urls.length>=43,'v260 must retain all first 43 appended banks');assert.equal(urls[41],'physics_mechanics_applications_v257.json');assert.equal(urls[42],'maths_year1_pure_breadth_v260.json');
assert(sw.includes("'./maths_year1_pure_breadth_v260.json'"));assert(sw.includes('-v260-maths-pure'));
const existing=[...deck.cards,...urls.slice(0,42).flatMap(p=>json(p).cards||[])];
const ids=new Set(existing.map(c=>c.id)),fronts=new Set(existing.filter(c=>c.subject==='Maths').map(c=>c.front.trim().toLowerCase()));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);assert(start>=0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const allowed=new Set(['3.2','3.3','3.4','3.5','3.6','3.7','3.8','3.9','3.11']);
let right=0,wrong=0;const duplicates=[],sections=new Set();
for(const c of bank.cards){
 assert(!ids.has(c.id),'Existing ID '+c.id);ids.add(c.id);
 if(fronts.has(c.front.trim().toLowerCase()))duplicates.push(c.id);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Maths');assert.equal(c.stage,'AS');assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert(allowed.has(c.specRef));sections.add(c.specRef);
 assert(c.accept.length>=3,'Preserve at least three correct answers '+c.id);assert(c.reject.length>=2,'Preserve both wrong alternatives '+c.id);assert(c.accept.includes(c.back));
 for(const answer of c.accept){assert.equal(judge(c,answer).status,'correct','Valid '+c.id+': '+answer);right++;}
 for(const answer of c.reject){assert.equal(judge(c,answer).status,'wrong','Wrong '+c.id+': '+answer);wrong++;}
}
assert.deepEqual(duplicates,[],'New exact Maths prompts duplicate existing deck');
assert.equal(sections.size,9);assert(right>=114,'At least 114 verified original right examples');assert(wrong>=76,'At least 76 verified original wrong examples');
const near=(a,b)=>Math.abs(a-b)<Math.max(1e-12,Math.abs(b)*1e-9);
assert.deepEqual([-1,0,1,2].map(n=>n*n+n),[0,0,2,6]);
assert.equal((2*7)**3%8,0);
assert(near((Math.sqrt(3)-1)*5/2,5/(Math.sqrt(3)+1)));
assert.equal(9*4,36);assert.equal(((-8)**2-4*1*19),-12); 
assert.equal(2**2-2-6,-4);assert.equal(3**2-3-6,0);assert.equal((-2)**2-(-2)-6,0);
assert.equal(2**3-4*2**2+2+6,0);assert.equal((-1)**3-4*(-1)**2+(-1)+6,0);
assert.equal(4*2-11,-3);assert.equal(3*3+4*4,25);
assert.equal(12/2*(2*7+11*4),348);assert.equal(15*16,240);assert.equal(12/(1-.5),24);
assert.equal([1,3,5,7,9,11].reduce((a,b)=>a+b),36);
assert(near(Math.sqrt(5*5+7*7-2*5*7*.5),Math.sqrt(39)));
assert(near(.5*8*5*.5,10));assert(near(10*Math.sin(Math.PI/4)/Math.sin(Math.PI/6),10*Math.sqrt(2)));
assert(near(Math.log(1/8)/Math.log(2),-3));assert.equal(25/4,6.25);
assert(near(Math.exp(2*(Math.log(7)/2)),7));
assert.equal(12*1**3-4*1,8);assert.equal(2*1+3,5);assert.equal(5*1-1,4);
assert.equal(3*1**2-12*1+9,0);assert.equal(3*3**2-12*3+9,0);
assert.equal(2*2**3-2*2**2+3*2,14);
assert.equal(2*3**3/6-2*3**2, -9); 
const antiderivative=x=>x**3/3-2*x*x;
assert(near(antiderivative(3)-antiderivative(0),-9));
assert(near(-(antiderivative(4)-antiderivative(0)),32/3));
assert.equal(Math.hypot(-5,12),13);assert.deepEqual([8-(-2),-1-5],[10,-6]);
assert.deepEqual([(1+11)/2,(4-6)/2],[6,-1]); // second position-vector test; see independent midpoint below
assert.deepEqual([(-2+8)/2,(5-1)/2],[3,2]);
assert.deepEqual([1+(11-1)*2/5,4+(-6-4)*2/5],[5,0]);
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),b=app.indexOf(' const added=[',a);assert(a>0&&b>a);assert(app.slice(a,b).includes('else if(index===42)'));
const loader=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;');
const good=Array.from({length:43},()=>({cards:[]}));good[42]=bank;assert.equal(loader([...deck.cards],good).length,3383);
const bad=Array.from({length:43},()=>({cards:[]}));bad[42]={cards:bank.cards.slice(0,7).map((c,i)=>({...c,...[
 {subject:'Physics'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.17'}
][i]}))};assert.equal(loader([...deck.cards],bad).length,3345);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v260: 38 first-mock Year 1 Pure applications, '+right+' correct and '+wrong+' incorrect examples, 9 AQA sections, independent maths and preserved IDs.');
