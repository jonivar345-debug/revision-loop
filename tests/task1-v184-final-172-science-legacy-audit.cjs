'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const audit=require('../editorial/task1-v184-final-172-science-legacy-audit.json');
const legacy=require('../editorial/task1-v166-legacy-mock-card-map.json');
const d=JSON.parse(fs.readFileSync('deck.json','utf8'));
const preceding=['176-mechanics-manual-spec-audit','177-chemistry-legacy-tests-definitions','178-chemistry-core-definitions','179-chemistry-organic-physical-audit','180-born-haber-gibbs-short-recall','181-science-210-legacy-answer-audit','182-220-physics-chemistry-precision','183-bonding-86-precision'].map(x=>require('../editorial/task1-v'+x+'.json'));
const historical=require('./task1-v154-legacy-evidence.cjs');
const deckMap=new Map(d.cards.map(c=>[c.id,c]));
const previously=new Set(preceding.flatMap(x=>x.reviewed.map(c=>c.id)));
const legacySet=new Set(legacy.records.map(c=>c.id));
const outstanding=new Set(legacy.records.filter(c=>!previously.has(c.id)).map(c=>c.id));
assert.equal(audit.version,'v184');assert.equal(audit.task1Complete,false);
assert.deepEqual([legacySet.size,previously.size,outstanding.size],[971,799,172]);
assert.deepEqual([d.cards.length,d.cards.filter(c=>c.active!==false).length,d.cards.filter(c=>c.active!==false&&c.mock===true).length],[3345,3341,2379]);
assert.equal(audit.reviewed.length,172);assert.equal(audit.corrections.length,22);
assert.equal(audit.reviewed.filter(r=>r.subject==='Chemistry').length,106);assert.equal(audit.reviewed.filter(r=>r.subject==='Physics').length,66);
const checked=new Set();
for(const row of audit.reviewed){
 const c=deckMap.get(row.id);assert(c,'Missing card '+row.id);
 assert(outstanding.has(row.id)&&!checked.has(row.id),'Non-outstanding or duplicate '+row.id);
 assert(c.active!==false&&c.mock===true&&c.subject===row.subject);
 assert(c.front===row.front&&c.back===row.back);assert(row.aqaCandidate&&row.review);checked.add(row.id);
}
assert.deepEqual([...checked].sort(),[...outstanding].sort());
assert.equal(new Set([...previously,...checked]).size,971);
for(const row of audit.corrections){
 const c=deckMap.get(row.id);assert(checked.has(row.id),'Correction outside reviewed set');
 assert.equal(historical(row.id,'front',row.previousFront),row.newFront);
 assert.equal(historical(row.id,'back',row.previousBack),row.newBack);
 assert.equal(c.front,row.newFront);assert.equal(c.back,row.newBack);
 assert(c.accept.includes(row.newBack)&&c.accept.length>=2);
 for(const variant of row.acceptedVariants)assert(c.accept.includes(variant));
}
// Explicitly guard against reintroducing two incorrect historical learning cues.
assert(!deckMap.get('chem_energetics_v53_03').accept.includes('The most stable physical form of a substance at the specified conditions.'));
assert(!deckMap.get('phy_focus_v39_09').front.includes('constant speed'));
assert.equal(audit.limits.allAqaSpecificationBulletsVerified,false);
assert.equal(audit.limits.allOriginalAqaPastPapersIncluded,false);
console.log('PASS v184: all 971 historical science mock cards now individually reviewed (106 Chemistry + 66 Physics final batch), 22 targeted recall corrections; Task 1 still open');
