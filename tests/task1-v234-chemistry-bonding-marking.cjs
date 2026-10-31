'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const json=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const read=path=>fs.readFileSync(path,'utf8');
const audit=json('editorial/task1-v234-chemistry-bonding-marking-audit.json');
const deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(audit.version,'v234');assert.equal(deck.cards.length,3345);
assert.equal(audit.coreChemistryMockCount,1533);
assert.equal(audit.bondingTopicInventory.total,180);
assert.equal(audit.checks.length,9);
assert.equal(audit.earlierActualWebsiteMarking.scientificallyIncorrectResponsesMarkedPartial,11);
assert.equal(audit.earlierActualWebsiteMarking.validParaphrasesNotMarkedCorrect,6);
assert(sw.includes('v234-chem-bonding-marking'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
for(const done of Object.values(audit.limits))assert.equal(done,false);
const start=app.indexOf('function normalise(');
const end=app.indexOf('function importantTokens(',start);
assert(start>0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accepted=0,rejected=0,model=0;
for(const check of audit.checks){
 const card=deck.cards.find(c=>c.id===check.id);
 assert(card,'Missing historical flashcard '+check.id);
 assert.equal(card.subject,'Chemistry');assert.equal(card.stage,'AS');
 assert.equal(card.mock,true);assert.notEqual(card.active,false);
 assert.equal(card.front,check.front);
 assert.equal(card.back,check.back);
 assert.equal(judge(card,card.back).status,'correct','Model refused: '+check.id);model++;
 for(const ans of check.right){
  assert.equal(judge(card,ans).status,'correct','Undercredited: '+check.id+': '+ans);accepted++;
 }
 for(const ans of check.wrong){
  assert.equal(judge(card,ans).status,'wrong','Wrong or partial credit: '+check.id+': '+ans);rejected++;
 }
 assert.equal(judge(card,'').status,'neutral');
}
assert.equal(accepted,18);assert.equal(rejected,18);assert.equal(model,9);
assert.equal(deck.cards.filter(c=>c.subject==='Chemistry'&&c.mock===true&&c.active!==false).length,1533);
console.log('PASS v234: nine historic Chemistry core cards, 18 valid paraphrases fully credited, 18 opposite/wrong answers fully rejected, model answers preserved; all subject completion gates still false.');
