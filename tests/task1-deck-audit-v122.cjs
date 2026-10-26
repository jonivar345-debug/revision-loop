'use strict';
const fs=require('fs');
const assert=require('assert');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const source=fs.readFileSync('app.js','utf8');
const cards=deck.cards;
const added=cards.filter(c=>c.id.startsWith('task1_'));
const existing=cards.filter(c=>!c.id.startsWith('task1_'));
const key=x=>String(x).toLowerCase().replace(/[^a-z0-9]/g,'');
const visualNames=new Set([...source.matchAll(/if\(t==='([^']+)'\)/g)].map(x=>x[1]));
const ids=new Set();
assert.equal(existing.length,1220,'All 1,220 pre-existing IDs should remain');
assert.ok(added.length>=300,'This is intended to be a substantial coverage batch');
assert.ok(deck.deckVersion>=122);
for(const c of cards){
  assert.ok(!ids.has(c.id),'Duplicate ID '+c.id);ids.add(c.id);
  assert.ok(typeof c.front==='string'&&c.front.trim());
  assert.ok(typeof c.back==='string'&&c.back.trim());
}
const seenOld=new Set(existing.map(c=>key(c.front)));
const seenNew=new Set();
for(const c of added){
  assert.ok(c.front.length<=170,'Flashcard front too long '+c.id);
  assert.ok(c.back.length<=205,'Flashcard answer too long '+c.id);
  assert.ok(!/\[[2-9]\s*marks?\]/i.test(c.front),'Exam-style marks on a flashcard '+c.id);
  assert.ok(!/^(?:calculate|work out)\b/i.test(c.front),'Long working should belong in exam practice '+c.id);
  assert.ok(/^3\.\d/.test(String(c.specRef)),'Missing AQA section tag '+c.id);
  assert.ok(!seenOld.has(key(c.front)),'Exact legacy duplicate '+c.id);
  assert.ok(!seenNew.has(key(c.front)),'Exact new duplicate '+c.id);seenNew.add(key(c.front));
  assert.ok(c.active===true);
  if(c.stage==='A2'&&c.taught===false)assert.equal(c.mock,false,'Untaught A2 cannot enter mock '+c.id);
  if(c.visual||c.visualBack)assert.ok(visualNames.has(c.visual||c.visualBack),'Unknown diagram '+c.id);
}
const count=subject=>added.filter(c=>c.subject===subject).length;
assert.equal(deck.meta.task1FlashcardAudit.physicsNew,count('Physics'));
assert.equal(deck.meta.task1FlashcardAudit.chemistryNew,count('Chemistry'));
assert.equal(deck.meta.task1FlashcardAudit.mathsNew,count('Maths'));
assert.ok(count('Physics')>100&&count('Chemistry')>100&&count('Maths')<20);
for(const id of ['phy_motion_d','phy_spectra_photo_v32_below_threshold_graph','chem_ar_def','chem_bh_defs_20261024_latt_formation_def','math_modulus'])assert.ok(ids.has(id),'Existing progress ID missing '+id);
console.log('Task 1 deck checks passed:',JSON.stringify({cards:cards.length,legacy:existing.length,added:added.length,physics:count('Physics'),chemistry:count('Chemistry'),maths:count('Maths'),diagrams:added.filter(c=>c.visualBack||c.visual).length}));
