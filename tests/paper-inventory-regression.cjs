/* Ensures no AQA paper is falsely labelled complete and the 2020/2021
   autumn series is not called June. No copyrighted questions are embedded. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const inventory=read('paper_inventory_2015_2025.json');
const audit=read('paper_coverage_audit_2015_2025.json');
const bank=[...read('exam_questions.json').questions,...read('paper_supplement_2016_2017.json').questions];
assert.equal(inventory.rows.length,66);
assert.equal(audit.rows.length,66);
assert.equal(inventory.papers.length,134);
const key=x=>[x.subject,x.level,x.year,x.paper].join('|');
const papers=new Set();let checks=0;
for(const p of inventory.papers){
 const k=key(p);assert(!papers.has(k),'duplicate paper '+k);papers.add(k);checks++;
 assert(p.year>=2016&&p.year<=2025,'current specification series only '+k);checks++;
 if([2020,2021].includes(p.year))assert.equal(p.series,'November','Autumn exams '+k);
 assert.equal(p.complete,false,'Do not assert complete without paper-by-paper audit '+k);checks++;
 const entries=bank.filter(q=>q.subject===p.subject&&q.level===p.level&&q.year===p.year&&
   q.sourceVerified===true&&q.standalone!==false&&
   (q.paper===p.paper||(p.paper==='7408/3'&&q.paper.startsWith('7408/3'))));
 assert.equal(p.indexedQuestionParts,entries.length,'Paper count mismatch '+k);checks++;
 if(p.linkedOfficialPaper){
  assert(p.linkedOfficialPaper.startsWith('https://filestore.aqa.org.uk/'));checks++;
  assert(p.linkedOfficialMarkScheme.startsWith('https://filestore.aqa.org.uk/'));checks++;
 }
}
for(const q of bank.filter(x=>[2020,2021].includes(x.year)&&x.qpUrl?.includes('/november/'))){
 assert.equal(q.series,'November', 'Incorrect source series '+q.id);checks++;
}
const keys=new Set(inventory.rows.map(x=>[x.subject,x.level,x.year].join('|')));
assert.equal(keys.size,66);checks++;
for(const a of inventory.rows)if(a.classification==='older specification'){
 assert.equal(a.completePaperVerified,false);checks++;
}
console.log('PASS '+checks+' paper inventory, autumn-series and archive-integrity checks');
