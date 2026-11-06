'use strict';
// v357: exact original mock-eligible science short-answer marker calibration.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json').cards;
const audit=json('editorial/task1-v357-science-mock-14-markers.json');
assert.equal(deck.length,3345,'Retain all original saved-progress flashcard IDs');
assert.equal(new Set(deck.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v357');
assert.equal(audit.rows.length,14);
assert.equal(audit.counts.physics,7);
assert.equal(audit.counts.chemistry,7);
assert.equal(new Set(audit.rows.map(r=>r.id)).size,14);
assert(sw.includes('-v357-science-mock-markers'),'Offline cache must refresh');
assert(app.includes('applyV357ScienceMockMarkerProbes(cards);'),'Production loader must apply v357 marking');
const patchStart=app.indexOf('const V357_SCIENCE_MOCK_PROBES='),patchEnd=app.indexOf('// v344:',patchStart);
assert(patchStart>0&&patchEnd>patchStart);
const patch=new Function(app.slice(patchStart,patchEnd)+'\nreturn applyV357ScienceMockMarkerProbes;')();
const markStart=app.indexOf('function normalise('),markEnd=app.indexOf('function importantTokens(',markStart);
assert(markStart>0&&markEnd>markStart);
const evaluate=new Function('window',app.slice(markStart,markEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const mockStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),mockEnd=app.indexOf('function startMockSession(){',mockStart);
assert(mockStart>0&&mockEnd>mockStart);
const mockEligible=new Function(app.slice(mockStart,mockEnd)+'\nreturn mockEligibleCard;')();
const byId=new Map(deck.map(c=>[c.id,c]));
const originals=audit.rows.map(row=>{
 const c=byId.get(row.id);
 assert(c,'Missing original '+row.id);
 assert.equal(c.subject,row.subject);
 assert.equal(c.stage,row.stage);
 assert.equal(c.mock,true);
 assert.notEqual(c.active,false);
 assert.equal(c.front,row.originalFront);
 assert.equal(c.back,row.originalBack);
 assert(c.front.length<=145&&c.back.length<=190,'No long-response questions as flashcards');
 assert.equal((c.accept||[]).length,0,'Previously uncalibrated correct-answer list expected');
 assert.equal((c.reject||[]).length,0,'Previously uncalibrated wrong-answer list expected');
 assert(mockEligible(c),'Must be an actual first-school-mock card');
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,2);
 return {...c,accept:[],reject:[]};
});
const patched=patch(originals);
let good=0,bad=0;
for(let i=0;i<patched.length;i++){
 const c=patched[i],row=audit.rows[i];
 assert.equal(c.id,row.id);
 assert.equal(c.front,row.originalFront);
 assert.equal(c.back,row.originalBack);
 assert.equal(c.v357ExactReviewed,true);
 assert(mockEligible(c));
 assert.equal(evaluate(c,c.back).status,'correct','Original answer rejected: '+c.id);
 for(const x of row.accept){let v=evaluate(c,x);assert.equal(v.status,'correct','Correct alternative rejected: '+c.id+' / '+JSON.stringify(v));good++;}
 for(const x of row.reject){let v=evaluate(c,x);assert.equal(v.status,'wrong','Incorrect answer accepted: '+c.id+' / '+JSON.stringify(v));assert.equal(v.score,0);bad++;}
}
const changed=audit.rows.map(row=>({...byId.get(row.id),front:'Altered question',mock:false,accept:[],reject:[]}));
patch(changed);
assert(changed.every(c=>!c.v357ExactReviewed&&c.reject.length===0),'Changed scope/content must not be calibrated');
assert.equal(good,14);assert.equal(bad,28);
console.log('PASS v357: 14 genuine science mock cards; original 14 model answers, 14 acceptable paraphrases and 28 wrong concepts verified against production evaluator; mock scope/IDs preserved.');
