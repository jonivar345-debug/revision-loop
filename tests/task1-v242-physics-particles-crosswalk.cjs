'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const audit=json('editorial/task1-v242-physics-particles-crosswalk.json'),deck=json('deck.json');
const topicNames=Object.keys(audit.coreTopicInventory).filter(k=>k!=='total');
const core=deck.cards.filter(c=>c.subject==='Physics'&&c.stage==='AS'&&c.mock===true&&c.active!==false&&topicNames.includes(c.topic));
assert.equal(deck.cards.length,3345);assert.equal(audit.version,'v242');assert.equal(core.length,167);assert.equal(audit.coreTopicInventory.total,167);
for(const topic of topicNames)assert.equal(core.filter(c=>c.topic===topic).length,audit.coreTopicInventory[topic],topic);
const originals=new Map(audit.coreFrontBackSnapshot.map(c=>[c.id,c]));assert.equal(originals.size,167);
for(const c of core){const x=originals.get(c.id);assert(x,'missing core ID '+c.id);assert.equal(x.front,c.front,'changed question '+c.id);assert.equal(x.back,c.back,'changed answer '+c.id);assert.equal(x.topic,c.topic);}
assert.equal(audit.requirements.length,48);const sectionSet=new Set(),evidence=new Set(),notVerified=[];
for(const row of audit.requirements){assert(/^3\.2\.(?:1\.[1-7]|2\.[1-4])$/.test(row.specRef),'invalid subsection '+row.specRef);sectionSet.add(row.specRef);for(const id of row.coreEvidenceIds){assert(originals.has(id),'unknown cited card '+id);evidence.add(id);}if(!row.coreEvidenceIds.length){assert.equal(row.reviewLevel,'application_unverified_in_selected_core_inventory');notVerified.push(row.assessableSkill);}}
assert.equal(sectionSet.size,11);assert(evidence.size>=75);assert.equal(notVerified.length,6);
assert.equal(audit.completion.elevenParticleRadiationSubsectionsMapped,true);
for(const [k,v] of Object.entries(audit.completion))if(k!=='elevenParticleRadiationSubsectionsMapped')assert.equal(v,false,'premature completion flag '+k);
assert.equal(audit.changes.newCards,0);assert.equal(audit.changes.progressChanged,false);
console.log('PASS v242: 167 Physics particle/radiation original cards, 48 AQA evidence rows, 11 subsections; 6 application areas unverified and Task 1 still incomplete.');
