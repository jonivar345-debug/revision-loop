'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const d=JSON.parse(fs.readFileSync('deck.json','utf8'));
const q=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const a=JSON.parse(fs.readFileSync('editorial/task1-v148-as-organic-crosswalk.json','utf8'));
const cards=new Map(d.cards.map(x=>[x.id,x]));
const qs=new Map(q.questions.map(x=>[x.id,x]));
assert(d.deckVersion>=146);assert.equal(d.cards.filter(c=>!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')).length,3263);
assert.equal(d.cards.filter(c=>c.active!==false&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')).length,3259);
assert(q.bankVersion>=60);assert.equal(q.questions.filter(x=>!x.id.startsWith('organic_v149_')&&!x.id.startsWith('organic_v152_')&&!x.id.startsWith('organic_v153_')&&!x.id.startsWith('mock_v154_')).length,1200);
assert.equal(a.counts.subsections,19);assert.equal(a.rows.length,a.counts.atomicChecks);
assert(a.rows.length>=75,'Insufficient Year 1 organic atomic evidence rows');
const refs=new Set(a.rows.map(r=>r.specRef));assert.equal(refs.size,19);
const statuses={};const ids=new Set();
for(const row of a.rows){
 assert(!ids.has(row.id));ids.add(row.id);
 assert(['supported_recall','supported_application','partial','gap_recall','gap_applied'].includes(row.status));
 statuses[row.status]=(statuses[row.status]||0)+1;
 assert(row.requirement.length>12);
 if(row.status==='supported_application')assert(row.evidence.questions.length>0);
 if(row.status.startsWith('gap_'))assert(row.limitation&&row.next,'Unqualified gap '+row.id);
 for(const e of row.evidence.cards){const c=cards.get(e.id);assert(c&&c.active!==false,'Missing active '+e.id);assert.equal(c.front,e.front);assert.equal(c.back,e.back);}
 for(const e of row.evidence.questions){const x=qs.get(e.id);assert(x,'Missing question '+e.id);assert.equal(x.prompt,e.prompt);assert.equal(x.marks,e.marks);assert.deepEqual(x.markPoints,e.markPoints);}
}
assert.deepEqual(statuses,a.counts.byStatus);
assert(a.rows.some(r=>r.specRef==='3.3.6.2'&&r.status==='gap_applied'),'Must report precise mass application gap');
assert(a.rows.some(r=>r.specRef==='3.3.5.1'&&r.status==='gap_recall'),'Must report fermentation recall gap');
assert(a.scope.includes('not a guarantee'));
assert.equal(a.policy.excludesA2,true);
console.log('PASS v148: '+a.rows.length+' Year 1 organic evidence checks over 19 subsections, exact card/question snapshots verified, older records unchanged');
