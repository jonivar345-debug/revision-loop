'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8')),app=fs.readFileSync('app.js','utf8');
const data=j('mock_short_varied_recall_v293.json').cards;
assert.equal(data.length,36);
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>=0&&end>start);
const evaluate=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const tally={Physics:0,Chemistry:0,Maths:0};let yes=0,no=0;
for(const c of data){
 tally[c.subject]++;
 assert(c.front.length<=115&&c.back.length<=95);
 assert.equal(c.strictRecall,true);assert.equal(c.kind,'short');
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);
 assert(c.accept.length>=(c.strictSymbolRecall?3:2));assert.equal(c.reject.length,2);
 for(const a of c.accept){assert.equal(evaluate(c,a).status,'correct',c.id+': '+a);yes++;}
 for(const a of c.reject){assert.equal(evaluate(c,a).status,'wrong',c.id+': '+a);no++;}
}
assert.deepEqual(tally,{Physics:12,Chemistry:12,Maths:12});
const list=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(list.length,54);assert.equal(list[53],'mock_short_varied_recall_v293.json');
const original=[...j('deck.json').cards,...list.slice(0,53).flatMap(x=>j(x).cards||[])];
const originalIDs=new Set(original.map(x=>x.id));
const questions=new Set(original.map(x=>x.subject+':'+String(x.front||'').toLowerCase().trim()));
for(const c of data){assert(!originalIDs.has(c.id),'Repeated id '+c.id);assert(!questions.has(c.subject+':'+c.front.toLowerCase().trim()),'Repeated front '+c.front);}
assert.equal(j('deck.json').cards.length,3345);
assert.equal(j('exam_questions.json').questions.length,1268);
const derivative=data.find(c=>c.strictSymbolRecall);assert(derivative);
for(const t of ["f'(a)=0","f′(a)=0","The derivative is zero at x=a."])
 assert.equal(evaluate(derivative,t).status,'correct','Valid derivative notation: '+t);
for(const t of ["f(a)=0","f''(a)=0","f′′(a)=0","f( a ) = 0"])
 assert.equal(evaluate(derivative,t).status,'wrong','Missing or wrong derivative operator: '+t);
const force=data.find(c=>c.numericRecall);assert(force);
for(const t of ['6 N','6.0 N','6.00 N','6e0 N','6 × 10⁰ N'])assert.equal(evaluate(force,t).status,'correct',t);
for(const t of ['6','6 V','12 N','6 × 10¹ N'])assert.equal(evaluate(force,t).status,'wrong',t);
const sw=fs.readFileSync('sw.js','utf8');assert(sw.includes("'./mock_short_varied_recall_v293.json'"));
console.log('PASS v293: '+yes+' accepted, '+no+' rejected using the real flashcard marker, all 36 concise');
