'use strict';
/* v433 AQA Chemistry 7405 qualitative-test recall audit. No real learner data. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const priority=require('../flashcard-priority-v429.js');
const app=fs.readFileSync('app.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const addition=JSON.parse(fs.readFileSync('chemistry_qualitative_recall_v433.json','utf8'));
const original=deck.cards.filter(c=>c.subject==='Chemistry');
const before=original.filter(c=>priority.classify(c)?.kind==='chemical-test');
assert(before.length>=90,'Existing Chemistry practical observations should be prioritised');
const required=['chem_rp4','chem_rp6','task1_chem_099','task1_chem_100','task1_chem_101',
 'task1_v125_158','task1_v125_159','task1_v127_048','task1_v127_049','task1_v127_050'];
for(const id of required){
 const c=original.find(c=>c.id===id);assert(c,'Missing original card '+id);
 assert.equal(priority.classify(c)?.kind,'chemical-test','Promote existing test observation '+id);
}
assert.equal(addition.cards.length,11);
assert.equal(new Set(addition.cards.map(c=>c.id)).size,11);
const old=new Set(deck.cards.map(c=>c.id));
for(const c of addition.cards){
 assert(!old.has(c.id),'Historic card IDs preserved: '+c.id);
 assert(/^chem_test_v433_\d{2}$/.test(c.id));
 assert.equal(c.subject,'Chemistry');
 assert(['AS','A2'].includes(c.stage));
 assert.equal(c.mock,c.stage==='AS');
 assert.equal(c.taught,c.stage==='AS');
 assert(c.front.length<=145&&c.back.length<=160,'Short recall, not multipart essay: '+c.id);
 assert(c.accept.length>=2&&c.reject.length>=1);
 assert.equal(c.active,true);
 assert.equal(c.strictRecall,true);
 assert(priority.isMustKnow(c),'New chemical-test/equation is actually prioritised '+c.id);
}
assert.equal(addition.cards.filter(c=>c.stage==='AS').length,6);
assert.equal(addition.cards.filter(c=>c.stage==='A2').length,5);
assert.equal(priority.classify(addition.cards[0]).label,'Chemical test to know');
assert.equal(priority.classify(addition.cards[4]).kind,'equation');
assert.equal(priority.classify(addition.cards[5]).kind,'equation');
const make=(front,topic='Group 7')=>({subject:'Chemistry',stage:'AS',topic,front,back:'Example.',active:true});
assert.equal(priority.classify(make('What flame colour identifies lithium?'))?.kind,null,
 'GCSE flame colours must not silently become compulsory A-level priorities');
assert.equal(priority.classify(make('What reagent reduces aldehydes and ketones?','Aldehydes and ketones'))?.kind,null,
 'Organic synthesis must not be labelled a chemical identification test');
assert.equal(priority.classify(make('What colour is nickel(II) in solution?','Aqueous metal ions'))?.kind,null,
 'Optional nickel colours are not an RP11 core identification requirement');
assert.equal(priority.classify({subject:'Physics',front:'What is the formula for Newton’s second law?',back:'F=ma',active:true}),null);
assert.equal(priority.classify({subject:'Chemistry',front:'What formula gives heat transferred?',back:'q=mcΔT',active:true})?.kind,'equation');
assert(app.includes('chemistry_qualitative_recall_v433.json?v=433'));
assert(app.includes("c.mock!==(c.stage==='AS')"));
assert(app.includes("cards.some(old=>old.id===c.id)"));
assert(html.includes('flashcard-priority-v429.js?v=429&chem=v433'));
assert(html.includes('app.js?v=430&chem=v433'));
assert(sw.includes("'./chemistry_qualitative_recall_v433.json'"));
assert(sw.includes('v433-chem-test-priority'));
for(const pair of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(pair));
new Function(app);
console.log('PASS v433: '+before.length+' existing Chemistry identification cards promoted; 11 new theoretical recall cards; A-level mock split, historical progress IDs, core Physics/Maths and offline cache preserved.');
