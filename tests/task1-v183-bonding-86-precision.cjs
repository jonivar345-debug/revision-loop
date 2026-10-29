'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const a=JSON.parse(fs.readFileSync('editorial/task1-v183-bonding-86-precision.json','utf8')),d=JSON.parse(fs.readFileSync('deck.json','utf8'));
const legacy=JSON.parse(fs.readFileSync('editorial/task1-v166-legacy-mock-card-map.json','utf8'));
const previous=['176-mechanics-manual-spec-audit','177-chemistry-legacy-tests-definitions','178-chemistry-core-definitions','179-chemistry-organic-physical-audit','180-born-haber-gibbs-short-recall','181-science-210-legacy-answer-audit','182-220-physics-chemistry-precision'].map(n=>require('../editorial/task1-v'+n+'.json'));
const historical=require('./task1-v154-legacy-evidence.cjs'),lookup=new Map(d.cards.map(c=>[c.id,c]));
const eligible=new Set(legacy.records.map(c=>c.id)),done=new Set(previous.flatMap(x=>x.reviewed.map(y=>y.id)));
assert.equal(a.version,'v183');assert.equal(a.task1Complete,false);
assert.equal(a.reviewed.length,86);assert.equal(a.corrections.length,10);assert.equal(a.baseline.remainingScience,172);
assert.deepEqual([d.cards.length,d.cards.filter(c=>c.active!==false).length,d.cards.filter(c=>c.active!==false&&c.mock===true).length],[3345,3341,2379]);
for(const row of a.reviewed){const c=lookup.get(row.id);assert(c&&eligible.has(row.id)&&!done.has(row.id),'Not an outstanding legacy card '+row.id);assert(c.mock===true&&c.subject==='Chemistry'&&c.active!==false);assert.equal(c.front,row.front);assert.equal(c.back,row.back);}
for(const row of a.corrections){const c=lookup.get(row.id);assert.equal(historical(row.id,'front',row.previousFront),row.newFront);assert.equal(historical(row.id,'back',row.previousBack),row.newBack);assert.equal(c.front,row.newFront);assert.equal(c.back,row.newBack);assert(c.accept.includes(c.back)&&c.accept.length>=2);}
assert.equal(a.limits.allAqaOutcomesVerified,false);
console.log('PASS v183: 86 bonding cards individually reviewed, 10 simplified, 172 legacy science cards remain');
