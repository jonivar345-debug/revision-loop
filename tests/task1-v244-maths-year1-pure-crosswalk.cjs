'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const audit=json('editorial/task1-v244-maths-year1-pure-crosswalk.json'),deck=json('deck.json'),v232=json('editorial/task1-v232-maths-year1-pure-scope.json');
assert.equal(audit.version,'v244');assert.equal(deck.cards.length,3345);
const excluded=new Set([...v232.exclusions.previouslyExcludedCore,...v232.exclusions.newlyExcludedCore]);
assert.deepEqual(new Set(audit.excludedSecondYearCardIds),excluded);
const core=deck.cards.filter(c=>c.subject==='Maths'&&c.stage==='AS'&&c.mock===true&&c.active!==false&&!excluded.has(c.id));
assert.equal(core.length,106);assert.equal(audit.eligibleCoreMockCards,106);
assert.equal(audit.coreSnapshot.length,106);const original=new Map(audit.coreSnapshot.map(x=>[x.id,x]));assert.equal(original.size,106);
for(const c of core){const q=original.get(c.id);assert(q,'missing '+c.id);assert.equal(q.topic,c.topic);assert.equal(q.originalFront,c.front);assert.equal(q.originalBack,c.back);}
for(const [topic,count] of Object.entries(audit.coreTopicInventory))assert.equal(core.filter(c=>c.topic===topic).length,count);
const sections=new Set(),cited=new Set(),gaps=[];
for(const r of audit.requirements){
 assert(['3.2','3.3','3.4','3.5','3.6','3.7','3.8','3.9','3.11'].includes(r.specRef),'invalid first-mock reference '+r.specRef);sections.add(r.specRef);
 for(const id of r.coreEvidenceIds){assert(original.has(id),'non Year 1 core evidence '+id);cited.add(id);}
 if(r.coreEvidenceIds.length===0){assert.equal(r.reviewLevel,'unfamiliar_exam_application_unverified_by_core_cards');gaps.push(r.assessableSkill);}
}
assert.equal(sections.size,9);assert.equal(audit.requirements.length,49);assert(cited.size>=60);assert.equal(gaps.length,8);
assert.equal(audit.completion.nineSchoolYear1PureSectionsMapped,true);
for(const [k,v] of Object.entries(audit.completion))if(k!=='nineSchoolYear1PureSectionsMapped')assert.equal(v,false,'false completion '+k);
assert.equal(audit.changes.newCards,0);
console.log('PASS v244: 106 Year 1 Pure core cards fingerprinted, 49 selected AQA checks across 9 sections, 8 unverified multi-step tasks; mock scope and original progress preserved.');
