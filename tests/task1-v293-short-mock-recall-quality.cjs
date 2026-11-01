'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cards=JSON.parse(fs.readFileSync('mock_short_varied_recall_v293.json','utf8')).cards;
assert.equal(cards.length,36);
for(const card of cards){assert.equal(card.strictRecall,true);assert.equal(card.accept.length,2);assert.equal(card.reject.length,2);}
console.log('PASS: 36 short flashcards have explicit accepted and rejected forms');
