'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const audit=JSON.parse(fs.readFileSync('editorial/task1-v180-born-haber-gibbs-short-recall.json','utf8'));
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const old=JSON.parse(fs.readFileSync('editorial/task1-v166-legacy-mock-card-map.json','utf8'));
const prev=[176,177,178,179].map(v=>require('../editorial/'+({176:'task1-v176-mechanics-manual-spec-audit',177:'task1-v177-chemistry-legacy-tests-definitions',178:'task1-v178-chemistry-core-definitions',179:'task1-v179-chemistry-organic-physical-audit'})[v]+'.json'));
const historical=require('./task1-v154-legacy-evidence.cjs');
assert.equal(audit.version,'v180');assert.equal(audit.task1Complete,false);
assert.equal(audit.reviewed.length,52);assert.equal(audit.corrections.length,13);
assert.deepEqual([audit.baseline.reviewedTotal,audit.baseline.remainingScience,audit.baseline.remainingChemistry,audit.baseline.remainingPhysics],[283,688,462,226]);
assert.deepEqual([deck.cards.length,deck.cards.filter(c=>c.active!==false).length,deck.cards.filter(c=>c.active!==false&&c.mock===true).length],[3345,3341,2379]);
const byId=new Map(deck.cards.map(c=>[c.id,c])),oldIds=new Set(old.records.map(x=>x.id)),prior=new Set(prev.flatMap(a=>a.reviewed.map(x=>x.id)));
assert.equal(new Set(audit.reviewed.map(x=>x.id)).size,52);
for(const row of audit.reviewed){
 const c=byId.get(row.id);assert(c,'Missing '+row.id);assert(oldIds.has(row.id)&&!prior.has(row.id),'Not a new legacy candidate '+row.id);
 assert(c.subject==='Chemistry'&&c.mock===true&&c.active!==false,'Lost Chemistry mock scope '+row.id);
 assert.equal(c.front,row.front,'Altered reviewed question '+row.id);assert.equal(c.back,row.back,'Altered reviewed answer '+row.id);
 assert(/^(3\.\d|7\.2)/.test(row.aqaSection),'Bad AQA section '+row.id);
}
for(const change of audit.corrections){
 const c=byId.get(change.id);assert(c);
 assert.equal(c.front,change.newFront);assert.equal(c.back,change.newBack);
 assert.equal(historical(change.id,'front',change.previousFront),change.newFront);
 assert.equal(historical(change.id,'back',change.previousBack),change.newBack);
 assert(!c.concepts,'Edited short card should not demand multiple vague keywords '+c.id);
 assert(c.accept&&c.accept.includes(c.back)&&c.accept.length>=3,'Keep model answer and genuine alternatives '+c.id);
}
assert(audit.corrections.find(x=>x.id==='chem_bh_weak_20261024_sixmark_theoretical_rank'));
assert(!byId.get('chem_bh_weak_20261024_sixmark_theoretical_rank').back.includes('+2223'),'Do not require memorising isolated sample numbers');
assert(!byId.get('chem_bh_weak_20261024_sixmark_discrepancies').back.includes('135'),'Do not require memorising arbitrary example discrepancies');
assert.equal(audit.limitations.fullAqaSpecificationCertified,false);
assert.equal(audit.limitations.questionBankEdited,false);
console.log('PASS v180: 52 individually checked mock Chemistry cards, 13 concise corrections and stable historic IDs');
