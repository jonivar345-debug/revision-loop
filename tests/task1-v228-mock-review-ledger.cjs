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
for(const rec of d.reviewedCardSnapshots){const c=all.get(rec.source+':'+rec.id);assert(c,'Reviewed card missing: '+rec.id);assert.equal(fingerprint(c),rec.stamp,'Content changed, needs re-review: '+rec.id);}
const p=JSON.parse(fs.readFileSync('editorial/task1-v228-physics-measurements-particles-firstpass.json','utf8'));
assert.equal(p.snapshots.length,239);assert.equal(d.separateFirstPassReviews.totalFirstPassAcrossFiles,573);
for(const r of p.snapshots){const c=base.cards.find(x=>x.id===r.id);assert(c,'Missing Physics card '+r.id);assert.equal(fingerprint(c),r.stamp,'Physics card changed '+r.id);}
const resist=base.cards.find(x=>x.id==='task1_phy_008');assert(!resist.front.includes('base units'));
const weak=base.cards.find(x=>x.id==='task1_v124_bulk_phy_025');assert(!weak.back.includes('Z⁰'));
console.log('PASS: review ledger and pending completion gate');
