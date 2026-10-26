'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const cards=deck.cards;
const newCards=cards.filter(c=>c.id.startsWith('task1_v123_'));
assert(deck.deckVersion>=123);
assert.equal(newCards.length,69);
assert(cards.length>=1826);
assert(cards.filter(c=>c.active!==false).length>=1822);
const canonical=s=>String(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const fronts=new Set();
const ids=new Set();
for(const c of cards){
 assert(!ids.has(c.id),'Duplicate ID '+c.id);ids.add(c.id);
 if(c.front){const key=c.subject+':'+canonical(c.front);if(c.id.startsWith('task1_v123_'))assert(!fronts.has(key),'Duplicate prompt '+c.id);fronts.add(key)}
}
for(const subject of ['Physics','Chemistry']){
 const relevant=newCards.filter(c=>c.subject===subject);
 assert(relevant.length>=30);
 for(let n=7;n<=12;n++){
  const rp=relevant.filter(c=>c.practicalNumber===n);
  assert(rp.length>=5,subject+' RP'+n+' needs 5+ brief prompts');
  for(const card of rp){
   assert.equal(card.specRef,'7.2 RP'+n);
   assert.equal(card.kind,'practical');
   assert.equal(card.stage,'A2');
   assert.equal(card.mock,false,'Untaught A2 should be hidden from mock');
   assert.equal(card.taught,false);
   assert(card.front.length<=150&&card.back.length<=190,'Prompt too long '+card.id);
   assert(Array.isArray(card.accept)&&card.accept.length>=2,'No curated answer alternatives '+card.id);
   assert(!/^calculate\b|^work out\b/i.test(card.front),'Long calculation in flashcard '+card.id);
  }
 }
}
const keyIDs=['phy_motion_d','chem_ar_def','math_modulus','phy_spectra_photo_v32_below_threshold_graph'];
keyIDs.forEach(id=>assert(ids.has(id),'Old saved progress ID removed: '+id));
assert.match(app,/function flashEligible\(c\)/);
console.log('PASS v123 required-practical flashcards:',newCards.length,'across RP7-12 in Physics and Chemistry; previous IDs preserved');
