'use strict';
// v356: precision checks on seven original first-mock Year 1 Pure functions cards.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json').cards;
const audit=json('editorial/task1-v356-year1-functions-marking-probes.json');
assert.equal(deck.length,3345,'Do not alter original flashcard IDs or saved progress');
assert.equal(new Set(deck.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v356');
assert.equal(audit.rows.length,7);
assert.equal(audit.counts.cards,7);
assert.equal(audit.counts.newAcceptedParaphrases,7);
assert.equal(audit.counts.newKnownWrongVariants,14);
assert.equal(new Set(audit.rows.map(x=>x.id)).size,7);
assert(sw.includes('-v356-year1-functions-reject'),'New offline cache version required');
assert(app.includes('applyV356Year1FunctionsWrongAnswerProbes(cards);'),'Production loader must use updated Year 1 markers');
const patchStart=app.indexOf('const V356_MATHS_FUNCTION_PROBES='),patchEnd=app.indexOf('// v344:',patchStart);
assert(patchStart>0&&patchEnd>patchStart);
const patch=new Function(app.slice(patchStart,patchEnd)+'\nreturn applyV356Year1FunctionsWrongAnswerProbes;')();
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
 assert.equal(c.subject,'Maths');
 assert.equal(c.stage,'AS');
 assert.equal(c.mock,true);
 assert.equal(c.front,row.originalFront);
 assert.equal(c.back,row.originalBack);
 assert(c.front.length<=145&&c.back.length<=170,'Keep short factual recall');
 assert((c.accept||[]).length>0,'Original already has accepted answers to preserve');
 assert.equal((c.reject||[]).length,0,'Only add tested wrong examples where original lacks them');
 assert.equal(row.accept.length,1);
 assert.equal(row.reject.length,2);
 assert(mockEligible(c),'This core AS Maths card must be eligible for the first school mock');
 return {...c,accept:[...(c.accept||[])],reject:[]};
});
const patched=patch(originals);
let validatedExisting=0,addedValid=0,rejected=0;
for(let i=0;i<patched.length;i++){
 const c=patched[i],row=audit.rows[i];
 assert.equal(c.id,row.id);
 assert.equal(c.front,row.originalFront);
 assert.equal(c.back,row.originalBack);
 assert.equal(c.v356ExactReviewed,true);
 assert.equal(evaluate(c,c.back).status,'correct','Original model answer rejected: '+c.id);
 const old=byId.get(c.id).accept||[];
 for(const x of old){const v=evaluate(c,x);assert.equal(v.status,'correct','Existing accepted variant lost: '+c.id+' / '+x+' / '+JSON.stringify(v));validatedExisting++}
 for(const x of row.accept){const v=evaluate(c,x);assert.equal(v.status,'correct','New valid alternative not accepted: '+c.id+' / '+x+' / '+JSON.stringify(v));addedValid++}
 for(const x of row.reject){const v=evaluate(c,x);assert.equal(v.status,'wrong','Known-wrong Maths answer credited: '+c.id+' / '+x+' / '+JSON.stringify(v));assert.equal(v.score,0);rejected++}
}
const changed=audit.rows.map(row=>({...byId.get(row.id),front:'Changed question',mock:false,accept:[...(byId.get(row.id).accept||[])],reject:[]}));
patch(changed);
assert(changed.every(c=>!c.v356ExactReviewed&&c.reject.length===0),'Do not patch changed model/other scopes');
assert(addedValid===7&&rejected===14&&validatedExisting>=15);
console.log('PASS v356: seven exact AS Year 1 Pure original function cards, all '+validatedExisting+' existing accepted answers retained, 7 new alternatives and 14 wrong concepts correctly checked by production marker.');
