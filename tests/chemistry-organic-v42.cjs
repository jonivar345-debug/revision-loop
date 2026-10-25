'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const d = JSON.parse(fs.readFileSync(path.join(root,'deck.json'),'utf8'));
const app = fs.readFileSync(path.join(root,'app.js'),'utf8');
const newCards = d.cards.filter(c=>/^(chem_spec_v40_|chem_acyl_review_v41_|chem_mechanisms_v42_)/.test(c.id));
assert(d.deckVersion>=42, 'Expected chemistry organic deck v42 or later');
assert.equal(newCards.length,86, 'Preserve all 86 organic chemistry review cards');
const topics = ['Carboxylic acids','Esters','Acyl chlorides','Organic chemistry','Alkanes','Halogenoalkanes','Alkenes','Alcohols','Aldehydes and ketones','Optical isomerism'];
const present = new Set(newCards.map(c=>c.revisionTopic||c.topic));
for(const topic of topics)assert(present.has(topic),'Missing organic topic: '+topic);
const ids = new Set();
for(const c of d.cards) {
 assert(!ids.has(c.id),'Duplicate flashcard id: '+c.id);
 ids.add(c.id);
}
for(const c of newCards) {
 assert.equal(c.subject,'Chemistry');
 assert.equal(c.mock,true,'Card must enter mock flashcard pool: '+c.id);
 assert.equal(c.active,true);
 assert.equal(c.taught,true);
 assert.equal(c.scope,'mock');
 assert(c.front && c.back,'Incomplete flashcard: '+c.id);
 assert(c.front.length<=175&&c.back.length<=200,'Card too long: '+c.id);
}
const start=app.slice(app.indexOf('function startMockSession()'),app.indexOf('function selectedFlashCards()'));
assert(start.includes("c.mock===true"),'Mock mode must include flagged cards');
assert(start.includes('weightedPick(cardPool'),'Mock flashcards should remain weighted by weakness');
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"),'Keep existing flashcard progress keys');
console.log('PASS Chemistry organic v42: 86 mock flashcards, 10 topic groups, progress preserved');
