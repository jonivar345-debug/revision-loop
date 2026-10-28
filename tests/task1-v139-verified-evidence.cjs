'use strict';
const {expectedCardField,expectedCardMock}=require('./task1-v154-historical-normalisation.cjs');
const fs=require('node:fs'),assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const evidence=JSON.parse(fs.readFileSync('editorial/task1-v139-verified-answer-evidence.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v137-additional-syllabus-candidate-ledger.json','utf8'));
const cards=new Map(deck.cards.map(c=>[c.id,c])),rows=new Map(audit.rows.map(r=>[r.id,r]));
assert(deck.deckVersion>=138);
assert(deck.cards.length>=3128);
assert.equal(evidence.reviewedCount,48);
assert.deepEqual(evidence.bySubject,{Physics:21,Chemistry:27});
assert(evidence.scope.includes('not whole'),'No full coverage certification');
const seen=new Set();
for(const v of evidence.reviewed){
 assert(!seen.has(v.requirementId),'Duplicate narrow requirement');seen.add(v.requirementId);
 const r=rows.get(v.requirementId);
 assert(r,'Syllabus requirement disappeared '+v.requirementId);
 assert.equal(v.requirement,r.requirement,'Syllabus wording changed');
 assert.equal(v.specRef,r.specRef);assert.equal(v.subject,r.subject);
 assert.equal(v.status,'answer_checked_for_narrow_recall');
 assert(v.support.length>=1,'No supporting answer '+v.requirementId);
 for(const item of v.support){
   const c=cards.get(item.id);
   assert(c&&c.active!==false&&c.subject===v.subject,'Lost existing card '+item.id);
   assert.equal(c.front,expectedCardField(c.id,'front',item.front),'Reviewed question changed '+item.id);
   assert.equal(c.back,expectedCardField(c.id,'back',item.back),'Reviewed answer changed '+item.id);
 }
}
const quotient=evidence.specials.find(x=>x.requirementId==='B125');
assert.equal(quotient.status,'filled_by_v138');
assert(quotient.support.some(s=>s.id==='task1_v138_001'));
const partial=evidence.specials.find(x=>x.requirementId==='B050');
assert.equal(partial.status,'partial_evidence');
for(const t of evidence.specials){
 assert(rows.has(t.requirementId));
 for(const item of t.support){const c=cards.get(item.id);assert(c);assert.equal(c.front,expectedCardField(c.id,'front',item.front));assert.equal(c.back,expectedCardField(c.id,'back',item.back));}
}
console.log('PASS v139: 48 further answer-verified AQA recall requirements, 2 explicitly qualified cases, stable IDs');
