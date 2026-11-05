'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const d=JSON.parse(fs.readFileSync('editorial/task1-v228-mock-review-ledger.json','utf8'));
const base=JSON.parse(fs.readFileSync('deck.json','utf8'));
assert.equal(base.cards.length,3345);
assert.equal(d.reviewedCardSnapshots.length,334);
assert.equal(d.counts.MathsFirstPassFirstMock,162);
assert.equal(d.counts.ChemistryA2TaggedCore,172);
assert.equal(d.unresolvedScope.Chemistry_RP9_pH_curves.length,8);
assert.equal(d.completionGates.task1Complete,false);
for(const x of Object.values(d.fullCardAnswerSignoffStatus))assert.equal(x,false);
const app=fs.readFileSync('app.js','utf8');
const names=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const all=new Map(base.cards.map(c=>['deck.json:'+c.id,c]));
for(const name of names){for(const c of JSON.parse(fs.readFileSync(name,'utf8')).cards||[])all.set(name+':'+c.id,c);}
function fingerprint(c){const s=[c.id,c.front,c.back,c.stage,c.mock,c.active].join('\n');let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return(h>>>0).toString(16).padStart(8,'0');}
// v336 keeps this historical v228 ledger frozen and records separately reviewed
// updates to five Chemistry definitions instead of silently overwriting old stamps.
const updated=JSON.parse(fs.readFileSync('editorial/task1-v336-chem-definition-review-overrides.json','utf8'));
assert.equal(updated.changes.length,5);
const revised=new Map(updated.changes.map(x=>[x.id,x]));
assert.equal(revised.size,5,'No duplicate review overrides');
assert.deepEqual([...revised.keys()].sort(),[
 'task1_chem_017','task1_v125_121','task1_v127_074',
 'task1_v130_084','task1_v130_085'
].sort());
const previous=new Map(d.reviewedCardSnapshots.filter(x=>x.source==='deck.json').map(x=>[x.id,x]));
for(const x of revised.values()){
 const c=all.get('deck.json:'+x.id);
 assert(c&&c.subject==='Chemistry'&&c.mock===true,'Audited changed mock card missing '+x.id);
 assert.equal(fingerprint(c),x.newStamp,'Revised Chemistry definition needs renewed review '+x.id);
 assert.notEqual(x.oldStamp,x.newStamp,'A review override must identify a genuine change '+x.id);
 assert.equal(previous.has(x.id),x.inV228Ledger,'Ledger membership changed '+x.id);
 if(x.inV228Ledger)assert.equal(previous.get(x.id).stamp,x.oldStamp,'Historical review stamp altered '+x.id);
}
let acceptedChanged=0;
for(const rec of d.reviewedCardSnapshots){
 const c=all.get(rec.source+':'+rec.id);assert(c,'Reviewed card missing: '+rec.id);
 const stamp=fingerprint(c);
 if(stamp===rec.stamp)continue;
 const override=rec.source==='deck.json'?revised.get(rec.id):null;
 assert(override&&override.inV228Ledger,'Content changed, needs re-review: '+rec.id);
 assert.equal(stamp,override.newStamp,'Unexpected change beyond the approved definition revision '+rec.id);
 acceptedChanged++;
}
assert.equal(acceptedChanged,3,'Only the three ledger-listed definitions may change');
const p=JSON.parse(fs.readFileSync('editorial/task1-v228-physics-measurements-particles-firstpass.json','utf8'));
assert.equal(p.snapshots.length,239);assert.equal(d.separateFirstPassReviews.totalFirstPassAcrossFiles,573);
for(const r of p.snapshots){const c=base.cards.find(x=>x.id===r.id);assert(c,'Missing Physics card '+r.id);assert.equal(fingerprint(c),r.stamp,'Physics card changed '+r.id);}
const resist=base.cards.find(x=>x.id==='task1_phy_008');assert(!resist.front.includes('base units'));
const weak=base.cards.find(x=>x.id==='task1_v124_bulk_phy_025');assert(!weak.back.includes('Z⁰'));
console.log('PASS: review ledger and pending completion gate');
