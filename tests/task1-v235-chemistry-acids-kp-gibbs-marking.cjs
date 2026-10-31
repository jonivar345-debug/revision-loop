'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v235-chemistry-acids-kp-gibbs-marking-audit.json');
const deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(audit.version,'v235');assert.equal(deck.cards.length,3345);
assert.equal(audit.coreChemistryMockActive,1533);assert.equal(audit.checkedCards,15);
assert.equal(audit.baselineOnActualMarker.correctParaphrasesUndercredited,19);
assert.equal(audit.baselineOnActualMarker.incorrectAnswersPreviouslyGivenPartialCredit,5);
assert(sw.includes('v234-chem-bonding-marking')&&sw.includes('v235-chem-acids-kp-gibbs'));
for(const value of Object.values(audit.completion))assert.equal(value,false);
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let right=0,wrong=0,models=0;
for(const x of audit.checks){
 const c=deck.cards.find(c=>c.id===x.id);
 assert(c&&c.subject==='Chemistry'&&c.mock===true&&c.active!==false,'Missing mock card '+x.id);
 assert.equal(c.front,x.front);assert.equal(c.back,x.back);
 assert.equal(judge(c,c.back).status,'correct','Model '+x.id);models++;
 for(const s of x.right){assert.equal(judge(c,s).status,'correct','Correct paraphrase '+x.id+': '+s);right++;}
 for(const s of x.wrong){assert.equal(judge(c,s).status,'wrong','Scientifically wrong statement '+x.id+': '+s);wrong++;}
 assert.equal(judge(c,'').status,'neutral');
}
assert.equal(right,30);assert.equal(wrong,30);assert.equal(models,15);
assert.equal(deck.cards.filter(c=>c.subject==='Chemistry'&&c.mock===true&&c.active!==false).length,1533);
console.log('PASS v235: 15 existing Chemistry school mock cards; 30 correct paraphrases accepted, 30 deliberate false statements rejected; historical source deck/IDs preserved. Full AQA audit still incomplete.');
