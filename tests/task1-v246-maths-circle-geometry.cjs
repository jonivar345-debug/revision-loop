'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const bank=json('maths_first_mock_circle_geometry_v246.json'),deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v246');assert.equal(bank.cards.length,12);assert.equal(deck.cards.length,3345);
const list=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(list.length>=33); // Preserve first 33 banks; later additions append safely.assert.equal(list[31],'maths_first_mock_pure_applied_v245.json');
assert.equal(list[32],'maths_first_mock_circle_geometry_v246.json');
assert(sw.includes("'./maths_first_mock_circle_geometry_v246.json'"));assert(sw.includes('-v246-maths-circle'));
const allPrev=[...deck.cards,...list.slice(0,32).flatMap(f=>json(f).cards||[])];
const ids=new Set(allPrev.map(c=>c.id)),mathFronts=new Set(allPrev.filter(c=>c.subject==='Maths').map(c=>c.front.trim().toLowerCase()));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>=0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accepted=0,rejected=0;
for(const c of bank.cards){
 assert(!ids.has(c.id),'ID collision '+c.id);ids.add(c.id);
 assert(!mathFronts.has(c.front.trim().toLowerCase()),'Duplicate flashcard '+c.id);mathFronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Maths');assert.equal(c.stage,'AS');assert.equal(c.specRef,'3.4');
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);assert(c.accept.includes(c.back));
 for(const ans of c.accept){assert.equal(judge(c,ans).status,'correct','Should accept '+c.id+': '+ans);accepted++;}
 for(const ans of c.reject){assert.equal(judge(c,ans).status,'wrong','Should reject '+c.id+': '+ans);rejected++;}
}
assert.equal(accepted,36);assert.equal(rejected,24);
assert.equal(3**2+4**2,25); // radius to (3,4), tangent dot product
assert.equal(3*3+4*4,25);
assert.equal(9+4+12,25); // completed square
assert.equal((6-2)/(4-1),4/3);
assert.equal(-1/(4/3),-3/4);
assert.equal(2*Math.sqrt(25-9),8);
assert.equal(Math.sqrt(25-3**2),4);
assert.equal((-1+5)/2,2);assert.equal((5-(-1))/2,3);
assert(6**2>25);
const begin=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),finish=app.indexOf(' const added=[',begin);
assert(begin>0&&finish>begin);assert(app.slice(begin,finish).includes('else if(index===32)'));
const loader=new Function('cards','extraFlashBanks',app.slice(begin,finish)+'\nreturn cards;');
const extra=Array.from({length:33},()=>({cards:[]}));extra[32]=bank;
const loaded=loader([...deck.cards],extra);assert.equal(loaded.length,3357);
for(const c of bank.cards)assert(loaded.some(d=>d.id===c.id));
const blocked=Array.from({length:33},()=>({cards:[]}));
blocked[32]={cards:bank.cards.slice(0,6).map((c,i)=>({...c,...[
 {subject:'Physics'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{specRef:'3.5'}
][i]}))};
const none=loader([...deck.cards],blocked);assert.equal(none.length,3345);
console.log('PASS v246: 12 original AQA AS circle geometry cards, 36 valid and 24 invalid answers, numerical checks, mock-only loader and offline cache.');
