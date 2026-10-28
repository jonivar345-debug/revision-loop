'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v154-mock-aqa-terminology-audit.json','utf8'));
const questions=JSON.parse(fs.readFileSync('editorial/task1-v154-mock-applied-questions.json','utf8'));
const prior=JSON.parse(fs.readFileSync('editorial/task1-v153-mock-priority-evidence.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
assert(deck.deckVersion>=154);
assert.equal(deck.cards.filter(x=>!x.id.startsWith('task1_v155_')&&!x.id.startsWith('task1_v156_')&&!x.id.startsWith('task1_v157_')&&!x.id.startsWith('task1_v158_')&&!x.id.startsWith('task1_v159_')&&!x.id.startsWith('task1_v160_')).length,3280);
assert.equal(deck.cards.filter(x=>x.active!==false&&!x.id.startsWith('task1_v155_')&&!x.id.startsWith('task1_v156_')&&!x.id.startsWith('task1_v157_')&&!x.id.startsWith('task1_v158_')&&!x.id.startsWith('task1_v159_')&&!x.id.startsWith('task1_v160_')).length,3276);
assert(bank.bankVersion>=64);
assert.equal(bank.questions.filter(q=>!q.id.startsWith('mock_v157_')&&!q.id.startsWith('mock_v158_')&&!q.id.startsWith('mock_v159_')&&!q.id.startsWith('mock_v160_')).length,1247);
const v155=JSON.parse(fs.readFileSync('editorial/task1-v155-mock-scope-recall.json','utf8'));
const oldMock=new Set(v155.changes.removedFromMock.map(x=>x.id));
assert.equal(deck.cards.filter(x=>x.active!==false&&!x.id.startsWith('task1_v155_')&&!x.id.startsWith('task1_v156_')&&!x.id.startsWith('task1_v157_')&&!x.id.startsWith('task1_v158_')&&!x.id.startsWith('task1_v159_')&&!x.id.startsWith('task1_v160_')&&(x.mock===true||oldMock.has(x.id))).length,2343);
assert.equal(new Set(deck.cards.map(x=>x.id)).size,deck.cards.length);
assert.equal(new Set(bank.questions.map(x=>x.id)).size,bank.questions.length);
assert.equal(audit.deck.existingCardsReworded,22);
assert.equal(audit.deck.added,4);
assert.equal(audit.bank.added,9);
assert.equal(audit.bank.marks,55);
assert.equal(audit.status.fullMockSpecificationCoverageCertified,false);
const cardById=new Map(deck.cards.map(x=>[x.id,x]));
const qById=new Map(bank.questions.map(x=>[x.id,x]));
for(const entry of audit.changes.editedCards){
 const c=cardById.get(entry.id);
 assert(c,'AQA-reworded card must keep ID: '+entry.id);
 assert.equal(c.front,entry.front);
 assert.equal(c.back,entry.back);
 assert.equal(c.mock,entry.mock);
 assert(!/[σπ]|\\b(?:sigma|pi)\\s+(?:bond|electron)/i.test(c.front+' '+c.back),'Overextension remains: '+entry.id);
 if(Array.isArray(c.accept))assert.equal(c.accept[0],c.back);
}
for(const c of audit.changes.addedCards){
 const live=cardById.get(c.id);
 assert(live&&live.active!==false&&live.mock===true&&live.taught===true&&live.stage==='AS');
 assert.equal(live.subject,'Physics');assert.equal(live.scope,'mock');
 assert.equal(live.front,c.front);assert.equal(live.back,c.back);
 assert(live.front.length<=110&&live.back.length<=120);
}
assert.equal(deck.cards.filter(x=>!x.id.startsWith('task1_v154_')&&!x.id.startsWith('task1_v155_')&&!x.id.startsWith('task1_v156_')&&!x.id.startsWith('task1_v157_')&&!x.id.startsWith('task1_v158_')&&!x.id.startsWith('task1_v159_')&&!x.id.startsWith('task1_v160_')).length,3276);
assert.equal(bank.questions.filter(x=>!x.id.startsWith('mock_v154_')&&!x.id.startsWith('mock_v157_')&&!x.id.startsWith('mock_v158_')&&!x.id.startsWith('mock_v159_')&&!x.id.startsWith('mock_v160_')).length,1238);
const badChem=deck.cards.filter(c=>c.active!==false&&c.subject==='Chemistry'&&(/[σπ]/.test(c.front+' '+c.back)||/\\b(?:sigma|pi)\\s+(?:bond|electron)/i.test(c.front+' '+c.back)));
assert.deepEqual(badChem.map(x=>x.id),[],'AQA Chemistry cards should not teach optional sigma/pi concepts');
const partial=new Set(prior.rows.filter(x=>x.status==='partial').map(x=>x.id));
const seen=new Set();let marks=0;
for(const [i,item] of questions.questions.entries()){
 assert(partial.has(item.auditId));assert(!seen.has(item.auditId));seen.add(item.auditId);
 const q=qById.get(item.id);
 assert(q,'Missing new original mock question '+item.id);
 assert.equal(q.id,'mock_v154_'+String(i+1).padStart(2,'0'));
 assert.equal(q.subject,item.subject);assert.equal(q.level,'AS');
 assert.equal(q.mock,true);assert.equal(q.year,'Practice');assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.prompt,item.prompt);assert.equal(q.marks,item.marks);
 assert.deepEqual(q.markPoints,item.markPoints);
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 assert.equal(q.standalone,true);assert.equal(q.requiresWorking,true);
 assert(!q.qpUrl&&!q.msUrl);
 assert(q.marks>=5&&q.marks<=7);
 marks+=q.marks;
}
assert.equal(seen.size,9);assert.equal(marks,55);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v154: 22 AQA wording edits, four mock cards, nine mock questions/55 marks and stable IDs/progress keys');
