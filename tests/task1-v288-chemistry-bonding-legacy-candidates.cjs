'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8')),deck=j('deck.json');
const groups=[['Shapes','3.1.3.5'],['Intermolecular forces','3.1.3.7'],['Crystal structures','3.1.3.4'],['Bond polarity','3.1.3.6']];
const selected=groups.map(([topic,ref])=>{
 const list=deck.cards.filter(c=>c.subject==='Chemistry'&&c.topic===topic&&!String(c.specRef||'').trim());
 return {topic,candidateRef:ref,total:list.length,stageBreakdown:list.reduce((o,c)=>(o[String(c.stage||'unknown')]=(o[String(c.stage||'unknown')]||0)+1,o),{}),
  cards:list.map(c=>({id:c.id,front:String(c.front||'').slice(0,210),back:String(c.back||'').slice(0,230),stage:c.stage,mock:c.mock,taught:c.taught,courseTopic:c.courseTopic}))};
});
assert.equal(deck.cards.length,3345);
assert.deepEqual(selected.map(x=>x.total),[44,30,22,17],'Candidate count changed since previous scope inventory; review exact contents before mapping');
console.log('AUDIT_V288_JSON_BEGIN');console.log(JSON.stringify({version:'v288',selectedCount:selected.reduce((a,g)=>a+g.total,0),groups:selected},null,2));console.log('AUDIT_V288_JSON_END');
console.log('PASS v288: four Chemistry bonding candidate groups individually enumerated for inspection; no wildcard metadata assignments.');
