'use strict';
/* v444: source-verified 2022/2023 AQA AS Physics Paper 2 skill audit.
   Neither the archive metadata nor these short original prompts claim to
   reproduce AQA's copyrighted questions or mark schemes. */
const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const bank=JSON.parse(fs.readFileSync('physics_as_paper2_guided_v430.json','utf8'));
const crosswalk=JSON.parse(fs.readFileSync('editorial/physics-as-paper2-selected-sources-v444.json','utf8'));
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
const all=bank.cards;
assert.equal(all.length,218);
assert.equal(crypto.createHash('sha256').update(JSON.stringify(all.slice(0,140))).digest('hex'),
 '7367d4a13e90caf94a99e6234f21df9fa587960d85c84e7a6458886ae5b7f528',
 'The existing 140 v430/v443 cards must not change in any field');
const added=all.filter(c=>/^as_p2_v444_\d{3}$/.test(c.id));
assert.equal(added.length,10);
assert.deepEqual(added.map(c=>c.id),Array.from({length:10},(_,i)=>'as_p2_v444_'+String(i+1).padStart(3,'0')));
assert.equal(new Set(all.map(c=>c.id)).size,218,'No review/history ID may be reused');
assert.equal(crosswalk.mappings.length,10);
assert.deepEqual(crosswalk.paperSources.map(s=>s.year),[2022,2023]);
for(const year of [2022,2023]){
 const source=crosswalk.paperSources.find(s=>s.year===year);
 assert(source.questionPaper.startsWith('https://filestore.aqa.org.uk/'));
 assert(source.markScheme.startsWith('https://filestore.aqa.org.uk/'));
 assert(source.questionPaper.includes('74072-QP-JUN'+String(year).slice(-2)));
 assert(source.markScheme.includes('74072-MS-JUN'+String(year).slice(-2)));
}
const refs=new Set();
for(const m of crosswalk.mappings){
 const card=added.find(c=>c.id===m.cardId);
 assert(card,'Missing source-mapped card '+m.cardId);
 assert.equal(card.paper2Section,m.section);
 assert.equal(card.sourceStyle?.year,m.year);
 assert.equal(card.sourceStyle?.paper,'7407/2');
 assert.equal(card.sourceStyle?.question,m.question);
 assert(card.sourceStyle?.status.includes('original adaptation'),'Do not imply original AQA text');
 assert(m.markingFocus.length>10&&m.assessedMethod.length>10);
 const key=m.year+':'+m.question;
 assert(!refs.has(key),'Duplicate paper question: '+key);refs.add(key);
 assert(card.active===true&&card.taught===true&&card.mock===false&&card.scope==='full');
 assert(card.front.length<=175&&card.back.length<=165);
 assert(card.paper2Hint.length<=145&&card.paper2Trap.length<=145);
 assert(card.accept.length>=1);
 if(card.paper2Section==='C'){
  assert.equal(card.paper2Mode,'mcq');
  assert.equal(card.paper2Choices.length,4);
  assert.equal(card.paper2Choices[0],card.back);
  assert.equal(new Set(card.paper2Choices.map(x=>x.toLowerCase())).size,4);
 }
}
assert.deepEqual(Object.fromEntries(['A','B','C'].map(k=>[k,all.filter(c=>c.paper2Section===k).length])),{A:71,B:44,C:103});
assert.equal(bank.historicalStyleAudit?.addedOriginalCards,10);
assert.equal(bank.historicalStyleAudit?.preexistingCards,140);
assert(app.includes('(?:430|443|444|445|446|447|448)')&&app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(html.includes('paper2=v448'));
assert(sw.includes('v444-paper-style-audit')&&sw.includes("'./physics_as_paper2_guided_v430.json'"));
console.log('PASS v445: ten original v444 cards remain traced to selected 2022/2023 AQA scheme questions, prior 140 byte-equivalent, 60/37/73, IDs/progress/offline intact.');
