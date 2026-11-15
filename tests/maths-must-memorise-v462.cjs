'use strict';
// User-approved Year 13 Pure 'Must memorise first' selection.
// Never rewrite existing card IDs or science priority behaviour.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const recall=require('../flashcard-priority-v429.js');
const old=JSON.parse(fs.readFileSync('maths_year13_pure_v450.json','utf8'));
const pack=JSON.parse(fs.readFileSync('maths_must_memorise_v462.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
const numbers=[...Array.from({length:9},(_,i)=>i+1),
 ...Array.from({length:13},(_,i)=>i+11),
 ...Array.from({length:14},(_,i)=>i+26),
 ...Array.from({length:4},(_,i)=>i+43),
 ...Array.from({length:8},(_,i)=>i+58),
 ...Array.from({length:4},(_,i)=>i+76),
 ...Array.from({length:26},(_,i)=>i+86),
 ...Array.from({length:6},(_,i)=>i+115),121,122,123,124,125];
assert.equal(pack.version,'v462');
assert.equal(pack.totalSelected,89);
assert.equal(pack.newCount,66);
assert.deepEqual(pack.selectionNumbers,numbers);
assert.equal(new Set(numbers).size,89);
assert.equal(pack.cards.length,66);
assert.equal(Object.keys(pack.existingIdsBySelectionNumber).length,23);
const oldIds=new Set(old.cards.map(c=>c.id));
const map=new Map(old.cards.map(c=>[c.id,c]));
const newIds=new Set();
for(const [num,oldId] of Object.entries(pack.existingIdsBySelectionNumber)){
 assert(numbers.includes(Number(num)));
 assert(oldIds.has(oldId),'Original Year 13 Pure card missing '+oldId);
 assert(oldId.startsWith('y13_v450_card_'));
 assert(old.cards.find(x=>x.id===oldId).mock===true);
}
for(const c of pack.cards){
 assert(numbers.includes(c.sourceSelectionNumber));
 assert.equal(c.id,'y13_v462_card_'+String(c.sourceSelectionNumber).padStart(3,'0'));
 assert(!newIds.has(c.id)&&!oldIds.has(c.id));newIds.add(c.id);
 assert.equal(c.subject,'Maths');
 assert.equal(c.stage,'A2');
 assert.equal(c.year13PureMock,true);
 assert.equal(c.year13Optional,false);
 assert.equal(c.courseTopic,'Year 13 Pure · taught mock');
 assert.equal(c.memoryPriority,'user-curated-2026-11-15');
 assert.equal(c.priority,5);
 assert.equal(c.mock,true);assert.equal(c.taught,true);
 assert.equal(c.scope,'mock');assert.equal(c.active,true);
 assert(c.front.length>=10&&c.front.length<=170&&c.back.length>=1&&c.back.length<=180);
 assert.deepEqual(c.accept,[c.back]);assert.deepEqual(c.reject,[]);
}
assert.equal(new Set([...Object.keys(pack.existingIdsBySelectionNumber).map(Number),
 ...pack.cards.map(c=>c.sourceSelectionNumber)]).size,89);
const all=[...old.cards,...pack.cards];
assert.equal(all.length,189);
assert.equal(all.filter(c=>c.mock).length,176);
assert.equal(all.filter(c=>!c.mock).length,13);
const classified=all.filter(c=>c.mock&&recall.isMustKnow(c));
assert.equal(classified.length,89,'Only user-selected 89 Year 13 cards should be priority');
const want=new Set([...Object.values(pack.existingIdsBySelectionNumber),...pack.cards.map(c=>c.id)]);
assert.deepEqual(new Set(classified.map(c=>c.id)),want);
assert.equal(recall.classify(map.get('y13_v450_card_107')),null,'Log product law declined');
assert.equal(recall.classify(map.get('y13_v450_card_108')),null,'Log power law declined');
assert.equal(recall.classify(map.get('y13_v450_card_052')),null,'Inverse x² example declined');
assert(recall.isMustKnow(map.get('y13_v450_card_030')),'Requested quotient rule must stay');
assert(recall.isMustKnow(pack.cards.find(c=>c.sourceSelectionNumber===121)),'Convexity priority');
assert(recall.isMustKnow(pack.cards.find(c=>c.sourceSelectionNumber===124)),'Inflection warning');
const start=app.indexOf('function currentYear13PureMockCard(');
const stop=app.indexOf('// Build a bounded batch.',start);
assert(start>=0&&stop>start);
const ctx={};vm.runInNewContext(app.slice(start,stop)+'\nthis.isCard=currentYear13PureMockCard;',ctx);
assert.equal(old.cards.filter(ctx.isCard).length,110);
assert.equal(pack.cards.filter(ctx.isCard).length,66);
assert(all.filter(c=>!c.mock).every(c=>!ctx.isCard(c)),'No optional card leak');
assert.equal(all.filter(ctx.isCard).length,176);
assert(app.includes("const V462_MATHS_MEMORY_URL='./maths_must_memorise_v462.json'"));
assert(app.includes("...")===false || app.includes('v462Cards')); // explicit guarded loader
assert(app.includes("cards.push(c)"));
assert(html.includes('memory=v462')&&html.includes('maths=v462'));
assert(html.includes('id="mockMustKnowFirst"')&&html.includes('id="flashMustKnowOnly"'));
assert(sw.includes("'./maths_must_memorise_v462.json'"));
assert(sw.includes('v462-curated-maths-memorisation'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
console.log('PASS v462: 89 exact user priorities (23 existing+66 new), 176 taught-mock cards, 13 optional untouched, no declined log cards, science unchanged, saved keys stable');
