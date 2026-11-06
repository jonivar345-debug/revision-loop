'use strict';
// v358: verify exact existing school-mock Chemistry Ka/Kw/pH flashcard markers.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json').cards;
const audit=json('editorial/task1-v358-chem-acid-base-15-marker-review.json');
assert.equal(deck.length,3345,'Preserve all original flashcard progress IDs');
assert.equal(new Set(deck.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v358');assert.equal(audit.rows.length,15);
assert.equal(new Set(audit.rows.map(x=>x.id)).size,15);
assert(sw.includes('-v358-chem-acids'),'Offline cache must refresh');
assert(app.includes('applyV358ChemAcidBaseRecallCalibration(cards);'),'Actual app loader must patch the reviewed cards');
const st=app.indexOf('const V358_ACID_BASE_PROBES='),end=app.indexOf('// v344:',st);
assert(st>0&&end>st);
const patch=new Function(app.slice(st,end)+'\nreturn applyV358ChemAcidBaseRecallCalibration;')();
const ms=app.indexOf('function normalise('),me=app.indexOf('function importantTokens(',ms);
assert(ms>0&&me>ms);
const evaluate=new Function('window',app.slice(ms,me)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const mstart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),mend=app.indexOf('function startMockSession(){',mstart);
assert(mstart>0&&mend>mstart);
const mockEligible=new Function(app.slice(mstart,mend)+'\nreturn mockEligibleCard;')();
const core=new Map(deck.map(c=>[c.id,c]));
const original=audit.rows.map(row=>{
 const c=core.get(row.id);assert(c,'Missing original '+row.id);
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'A2');assert.equal(c.mock,true);
 assert.notEqual(c.active,false);
 assert.equal(c.front,row.originalFront);assert.equal(c.back,row.originalBack);
 assert(c.front.length<=145&&c.back.length<=190,'No long-answer flashcards');
 assert(mockEligible(c),'Review only eligible school-mock cards');
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,2);
 return {...c,accept:[...(c.accept||[])],reject:[...(c.reject||[])]};
});
const patched=patch(original);let originals=0,previousGood=0,newGood=0,previousWrong=0,newWrong=0;
for(let i=0;i<patched.length;i++){
 const c=patched[i],row=audit.rows[i],prev=core.get(c.id);
 assert.equal(c.v358ExactReviewed,true);assert.equal(c.front,row.originalFront);assert.equal(c.back,row.originalBack);
 assert.equal(evaluate(c,c.back).status,'correct','Original model answer '+c.id);originals++;
 for(const x of prev.accept||[]){const m=evaluate(c,x);assert.equal(m.status,'correct','Existing correct answer: '+c.id+' / '+x+' / '+JSON.stringify(m));previousGood++}
 for(const x of row.accept){const m=evaluate(c,x);assert.equal(m.status,'correct','New correct answer: '+c.id+' / '+JSON.stringify(m));newGood++}
 for(const x of prev.reject||[]){const m=evaluate(c,x);assert.equal(m.status,'wrong','Existing wrong probe: '+c.id+' / '+JSON.stringify(m));assert.equal(m.score,0);previousWrong++}
 for(const x of row.reject){const m=evaluate(c,x);assert.equal(m.status,'wrong','New misconception incorrectly accepted: '+c.id+' / '+x+' / '+JSON.stringify(m));assert.equal(m.score,0);newWrong++}
}
assert.equal(originals,15);assert.equal(newGood,15);assert.equal(newWrong,30);
assert.equal(previousGood,audit.counts.existingAcceptedAlternatives);
assert.equal(previousWrong,audit.counts.existingWrongProbes);
const changed=audit.rows.map(row=>({...core.get(row.id),front:'Changed prompt',mock:false,accept:[],reject:[]}));
patch(changed);
assert(changed.every(c=>!c.v358ExactReviewed&&c.reject.length===0),'Do not change eligibility or overwrite unrelated cards');
console.log('PASS v358: 15 original model answers, '+previousGood+' existing valid answers, 15 new valid answers and 30 new wrong variants, with existing rejects and mock eligibility intact.');
