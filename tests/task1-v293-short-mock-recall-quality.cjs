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
 assert.equal(c.accept.length,2);assert.equal(c.reject.length,2);
 for(const a of c.accept){assert.equal(evaluate(c,a).status,'correct',c.id+': '+a);yes++;}
 for(const a of c.reject){assert.equal(evaluate(c,a).status,'wrong',c.id+': '+a);no++;}
}
assert.deepEqual(tally,{Physics:12,Chemistry:12,Maths:12});
console.log('PASS v293: '+yes+' accepted, '+no+' rejected using the real flashcard marker, all 36 concise');
