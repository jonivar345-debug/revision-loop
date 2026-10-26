'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const cards=deck.cards;
const added=cards.filter(c=>c.id.startsWith('task1_v124_'));
assert.equal(deck.deckVersion,124);
assert.equal(cards.length,1864);
assert.equal(cards.filter(c=>c.active!==false).length,1860);
assert.equal(added.length,38);
assert.equal(added.filter(c=>c.subject==='Physics').length,20);
assert.equal(added.filter(c=>c.subject==='Chemistry').length,18);
assert.equal(cards.filter(c=>!c.id.startsWith('task1_v124_')).length,1826,'Keep all v123 records');
const norm=s=>String(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const fronts=new Set(),ids=new Set();
for(const c of cards){
 assert(!ids.has(c.id),'Duplicate ID '+c.id);ids.add(c.id);
 const f=c.subject+':'+norm(c.front);if(c.id.startsWith('task1_v124_'))assert(!fronts.has(f),'Duplicate prompt '+c.id);fronts.add(f);
}
for(const c of added){
 assert(c.front.length<=170&&c.back.length<=205,'Overlong recall card '+c.id);
 assert(c.stage==='A2'&&c.taught===false&&c.mock===false,'Untaught card must not reach mock '+c.id);
 assert(/^3\.\d/.test(c.specRef),'Missing AQA tag '+c.id);
 assert(Array.isArray(c.accept)&&c.accept.length>=1,'Missing answer alternatives '+c.id);
 assert(!/^(calculate|work out)\b/i.test(c.front),'Long question belongs in exam practice '+c.id);
}
for(const id of ['phy_motion_d','chem_ar_def','math_modulus','task1_v123_phy_001','task1_v123_chem_071'])assert(ids.has(id),'Progress ID missing: '+id);
const audit=deck.meta.task1FlashcardAudit.v124;
assert.equal(audit.physicsAdded,20);
assert.equal(audit.chemistryAdded,18);
assert.equal(audit.originalCardsPreserved,1826);
const source=fs.readFileSync('app.js','utf8');
assert.match(source,/flashScopeFilter==='mock'\?c\.mock===true/);
console.log('PASS: 38 concise v124 AQA gap cards and 1,826 previous cards preserved, no untaught mock leakage');
