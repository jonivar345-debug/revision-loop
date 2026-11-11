'use strict';
/* v443: AQA 7407/2 guided-trainer subsection evidence and non-destructive upgrade. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const data=JSON.parse(fs.readFileSync('physics_as_paper2_guided_v430.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const cards=data.cards;
const original=cards.filter(c=>/^as_p2_v430_\d{3}$/.test(c.id));
const added=cards.filter(c=>/^as_p2_v443_\d{3}$/.test(c.id));
assert.equal(cards.length,170);
assert.equal(original.length,132);
assert.equal(added.length,8);
assert.equal(new Set(cards.map(c=>c.id)).size,170);
assert.equal(crypto.createHash('sha256').update(JSON.stringify(original.map(({specRef,...rest})=>rest))).digest('hex'),
 '19fa55eb4dbfee8d9c5115e5fd1daeffc40e3419c7688f2707a024c30e34ddf9',
 'All 132 legacy card prompts, accepted answers, MCQ choices, traps, hints and ID metadata are immutable');
const official=[
 ...[1,2,3].map(i=>'3.1.'+i),
 ...[1,2,3,4,5,6,7].map(i=>'3.2.1.'+i),
 ...[1,2,3,4].map(i=>'3.2.2.'+i),
 ...[1,2,3].map(i=>'3.3.1.'+i),
 ...[1,2,3].map(i=>'3.3.2.'+i),
 ...[1,2,3,4,5,6,7,8].map(i=>'3.4.1.'+i),
 ...[1,2].map(i=>'3.4.2.'+i),
 ...[1,2,3,4,5,6].map(i=>'3.5.1.'+i)
];
assert.equal(official.length,36);
const used=new Set(cards.map(c=>c.specRef));
assert.equal(used.size,36,'At least one guided card per AQA AS subsection');
for(const c of cards){
 assert(official.includes(c.specRef),'Official AS section required: '+c.id+':'+c.specRef);
 assert(c.mock===false&&c.scope==='full'&&c.active===true&&c.taught===true);
 assert(c.paper2Hint?.length>=15&&c.paper2Trap?.length>=15);
 assert(c.front.length<=175&&c.back.length<=165,'Compact card: '+c.id);
 if(c.paper2Section==='C'){
  assert.equal(c.paper2Choices?.length,4,c.id);
  assert.equal(c.paper2Choices[0],c.back,'Correct MCQ choice must be canonical: '+c.id);
  assert.equal(new Set(c.paper2Choices.map(x=>x.toLowerCase())).size,4);
 }
}
for(const [id,ref] of Object.entries({
 as_p2_v430_001:'3.1.2',as_p2_v430_015:'3.4.1.3',
 as_p2_v430_040:'3.4.1.4',as_p2_v430_048:'3.4.1.2',
 as_p2_v430_056:'3.3.2.2',as_p2_v430_061:'3.5.1.6',
 as_p2_v430_070:'3.5.1.3',as_p2_v430_081:'3.3.1.1',
 as_p2_v430_099:'3.4.1.8',as_p2_v430_118:'3.5.1.1',
 as_p2_v430_122:'3.2.1.4',as_p2_v430_129:'3.1.1'
})){
 assert.equal(cards.find(c=>c.id===id)?.specRef,ref,'Precise source-related classification '+id);
}
for(const [ref,section] of [['3.1.3','A'],['3.2.1.1','B'],['3.2.1.5','C'],['3.2.1.7','C']]){
 const matched=added.filter(c=>c.specRef===ref);
 assert.equal(matched.length,2,'Two targeted new cards for previously empty topic '+ref);
 assert(matched.every(c=>c.paper2Section===section));
}
assert.deepEqual({A:cards.filter(c=>c.paper2Section==='A').length,
 B:cards.filter(c=>c.paper2Section==='B').length,
 C:cards.filter(c=>c.paper2Section==='C').length},{A:60,B:37,C:73});
assert(data.specificationAudit?.version==='v443');
assert(data.supplementAudit?.version==='v443');
assert(app.match(/\^as_p2_v\(\?:430\|443\|444\|445\)_\\d\{3\}\$/g)?.length===2,
 'Selection and the loader must both accept new IDs');
assert(html.includes('paper2=v445'));
assert(sw.includes('v443-paper2-guidance'));
assert(sw.includes("'./physics_as_paper2_guided_v430.json'"));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
console.log('PASS v445: all 36 AQA AS tags represented; 132 original prompts unchanged, eight v443, ten v444, twenty v445 guided cards; 60/37/73, offline + progress safeguards');
