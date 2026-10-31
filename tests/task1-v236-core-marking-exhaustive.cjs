'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v236-core-marking-exhaustive-audit.json'),deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(audit.version,'v236');assert.equal(deck.cards.length,3345);
assert(sw.includes('v236-full-core-marking-audit'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
for(const completed of Object.values(audit.limits))assert.equal(completed,true);
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let models=0,accepted=0,rejected=0;
for(const c of deck.cards){
 assert.equal(judge(c,c.back).status,'correct','Core model response incorrect '+c.id);models++;
 for(const x of (c.accept||[])){assert.equal(judge(c,x).status,'correct','Stored accept incorrectly marked '+c.id+': '+x);accepted++;}
 for(const x of (c.reject||[])){assert.equal(judge(c,x).status,'wrong','Stored reject credited '+c.id+': '+x);rejected++;}
}
assert.equal(models,3345);assert.equal(accepted,4942);assert.equal(rejected,90);
assert.equal(judge(deck.cards.find(c=>c.id==='maths_transform_003'),'1 over a').status,'correct');
assert.equal(judge(deck.cards.find(c=>c.id==='maths_transform_003'),'scale factor a').status,'wrong');
assert.equal(audit.results.unexpectedResults,0);
console.log('PASS v236: 3345/3345 core models correct, 4942/4942 declared accepts correct and 90/90 declared rejects wrong; Maths one-over-a fixed. Subject truth and AQA coverage still NOT certified.');
