'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const inv=JSON.parse(fs.readFileSync('paper_inventory_2015_2025.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v164-paper-and-science-coverage-truth.json','utf8'));
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const app=fs.readFileSync('app.js','utf8');

assert.equal(inv.papers.length,134);
assert.equal(inv.papers.filter(p=>p.indexedQuestionParts>0).length,31);
assert.equal(inv.papers.reduce((n,p)=>n+p.indexedQuestionParts,0),231);
assert.equal(inv.papers.filter(p=>p.complete===true).length,0);
assert.equal(audit.totals.currentSpecPapers2016to2025,134);
assert.equal(audit.totals.papersWithAnyIndexedPart,31);
assert.equal(audit.totals.indexedQuestionParts,231);
assert.equal(audit.totals.completePaperCertified,0);
assert.equal(audit.totals.pendingSummer2026Papers,15);
assert.equal(audit.pending2026Papers.length,15);
assert.equal(new Set(audit.pending2026Papers.map(p=>p.subject+'|'+p.level+'|'+p.paper)).size,15);
for(const p of audit.pending2026Papers){
 assert.equal(p.year,2026);
 assert.equal(p.indexedQuestionParts,0);
 assert.equal(p.completePaperVerified,false);
 assert.match(p.status,/9 July 2027/);
}
for(const subject of ['Physics','Chemistry','Maths']){
 const row=audit.groups.find(g=>g.subject===subject);
 const cards=deck.cards.filter(c=>c.active!==false&&c.subject===subject);
 const papers=inv.papers.filter(p=>p.subject===subject);
 assert(row);
 assert.equal(row.activeFlashcards,cards.length);
 assert.equal(row.mockEligibleFlashcards,cards.filter(c=>c.mock===true).length);
 assert.equal(row.flashcardsWithoutExplicitSpecReference,cards.filter(c=>!c.specRef).length);
 assert.equal(row.papersTrackedThrough2025,papers.length);
 assert.equal(row.papersWithIndexedParts,papers.filter(p=>p.indexedQuestionParts>0).length);
 assert.equal(row.indexedQuestionParts,papers.reduce((n,p)=>n+p.indexedQuestionParts,0));
 assert.equal(row.completePapers,0);
 assert.equal(row.fullSpecCardCoverageCertified,false);
}
assert.equal(audit.fullSpecificationCertified,false);
assert.equal(audit.studentMasteryCertified,false);
assert(app.includes('const years=Array.from({length:12},(_,i)=>2026-i);'));
assert(app.includes('9 July 2027'));
assert(app.includes('Summer 2026 papers not yet publicly released'));
assert(app.includes('current-specification paper checklist, 2026–2015'));
assert(app.includes('https://www.aqa.org.uk/exams-administration/exams/whats-available-when'));
console.log('PASS v164: AQA 2015-2026 paper transparency, exact 134/31/231/0 inventory, 15 pending 2026 papers, science card counts and honest site release notice');
