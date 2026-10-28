'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const a=JSON.parse(fs.readFileSync('editorial/task1-v151-a2-organic-crosswalk.json','utf8'));
const d=JSON.parse(fs.readFileSync('deck.json','utf8'));
const b=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
assert.equal(d.deckVersion,150);assert.equal(d.cards.length,3270);assert.equal(d.cards.filter(c=>c.active!==false).length,3266);
assert.equal(b.bankVersion,61);assert.equal(b.questions.length,1212);
assert.equal(a.counts.sections,10);assert.equal(a.counts.numberedSubsections,19);
assert.equal(a.counts.atomicChecks,a.rows.length);assert(a.rows.length>=100,'Need real A2 organic atomic checks');
const ids=new Set(),refs=new Set(),cm=new Map(d.cards.map(c=>[c.id,c])),qm=new Map(b.questions.map(q=>[q.id,q]));
const summaries={};const groups={};
for(const row of a.rows){
 assert(!ids.has(row.id),'Repeated audit row '+row.id);ids.add(row.id);
 assert(/3\\.3\\.(?:[7-9]|1[0-6])(?:\\.[1-5])?$/.test(row.specRef),'Invalid spec ref '+row.specRef);
 refs.add(row.specRef);
 assert(['supported_recall','supported_practice','partial','gap_applied','gap_recall'].includes(row.status));
 summaries[row.status]=(summaries[row.status]||0)+1;
 if(row.status==='supported_practice')assert(row.evidence.questions.length>0);
 if(row.status.startsWith('gap_'))assert(row.limitation&&row.next);
 for(const e of row.evidence.cards){const c=cm.get(e.id);assert(c&&c.active!==false,'Card missing '+e.id);assert.equal(c.front,e.front);assert.equal(c.back,e.back);assert.equal(c.specRef||null,e.specRef);assert.equal(c.mock??null,e.mock);}
 for(const e of row.evidence.questions){const q=qm.get(e.id);assert(q,'Question missing '+e.id);assert.equal(q.prompt,e.prompt);assert.equal(q.marks,e.marks);assert.deepEqual(q.markPoints,e.markPoints);assert.equal(q.revisionTopic,e.revisionTopic);}
}
assert.equal(refs.size,19);assert.deepEqual(summaries,a.counts.byStatus);
assert.equal(a.policy.fullSpecCertification,false);assert.equal(a.policy.auditOnly,true);
assert(a.rows.some(x=>x.specRef==='3.3.14'&&x.status==='gap_applied'));
assert(a.rows.some(x=>x.specRef==='3.3.15'&&x.next==='scope_review'));
console.log('PASS v151 A2 Organic Chemistry evidence audit: '+a.rows.length+' checks, 19 subsections, exact live card and question snapshots, no data migration');
