'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const core=read('deck.json'),questions=read('exam_questions.json');
const rates=read('chemistry_rates_rp7_recall_v210.json'),rp4=read('chemistry_rp4_recall_v215.json');
const audit=read('editorial/task1-v215-rp4-recall-loader-audit.json');
const app=fs.readFileSync('app.js','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(core.cards.length,3345);
assert.equal(questions.questions.length,1268);
assert.equal(rates.cards.length,11);
assert.equal(rp4.cards.length,7);
assert.equal(audit.counts.additionalActuallyLoadableMockCards,18);
assert.equal(audit.task1Complete,false);
assert.equal(audit.fullSpecCertified,false);
assert.equal(audit.all194A2Reviewed,false);
for(const p of ['chemistry_rates_rp7_recall_v210.json','chemistry_rp4_recall_v215.json']){
 assert(app.includes("'./"+p+"'"),'App missing supplemental card URL '+p);
 assert(sw.includes("'./"+p+"'"),'Offline cache missing '+p);
}
assert(sw.includes('v215-rp4-chem-recall-v210-loader'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const uniqueIds=new Set(core.cards.map(c=>c.id));
assert.equal(uniqueIds.size,3345);
const prompts=new Set(core.cards.filter(c=>c.subject==='Chemistry').map(c=>c.front.trim().toLowerCase()));
const valid={};
for(const c of [...rates.cards,...rp4.cards]){
 assert(!uniqueIds.has(c.id),'Duplicate core or supplement ID '+c.id); uniqueIds.add(c.id);
 assert(!valid[c.id],'Duplicate new ID '+c.id);valid[c.id]=c;
 assert(c.subject==='Chemistry'&&c.mock===true&&c.taught===true&&c.active===true&&c.scope==='mock');
 assert(c.strictRecall===true&&c.accept.includes(c.back)&&c.accept.length>=4&&c.reject.length>=3);
 assert(c.front.length<170&&c.back.length<140);
 if(c.id.startsWith('task1_v215_chem_rp4_')){
  assert.equal(c.stage,'AS');
  assert.equal(c.specRef,'3.2.3 RP4');
  assert(!prompts.has(c.front.trim().toLowerCase()),'Duplicate RP4 prompt '+c.id);
  prompts.add(c.front.trim().toLowerCase());
 }else assert.equal(c.stage,'A2');
}
// Use the application's actual card matcher, not a parallel imitation.
const begin=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',begin);
assert(begin>=0&&end>begin,'Card evaluator source not found');
const evaluate=new Function('window',app.slice(begin,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let good=0,bad=0;
for(const c of rp4.cards){
 for(const answer of c.accept){
  assert.equal(evaluate(c,answer).status,'correct','Rejected a valid RP4 answer: '+c.id+' '+answer);
  good++;
 }
 for(const answer of c.reject){
  assert.notEqual(evaluate(c,answer).status,'correct','Credited a wrong RP4 answer: '+c.id+' '+answer);
  bad++;
 }
 assert.equal(evaluate(c,'').status,'neutral');
}
// Test the actual loader branch and confirm that v210 was *previously* unreachable.
const start=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));');
const stop=app.indexOf(' const added=[',start);
assert(start>=0&&stop>start,'Flashcard loader source not found');
const loader=app.slice(start,stop);
assert(loader.includes('else if(index===10)')&&loader.includes('else if(index===11)')&&loader.includes('else if(index===12)'));
const fake=Array.from({length:13},()=>({cards:[]}));
fake[11]=rates;fake[12]=rp4;
const load=new Function('cards','extraFlashBanks',loader+'\nreturn cards;');
const merged=load([...core.cards],fake);
assert.equal(merged.length,3345+18,'18 supplemental cards did not enter live loader');
assert.equal(new Set(merged.map(c=>c.id)).size,merged.length);
assert.equal(merged.filter(c=>c.subject==='Maths').length,core.cards.filter(c=>c.subject==='Maths').length);
for(const c of [...rates.cards,...rp4.cards])assert(merged.some(a=>a.id===c.id),'Missing mock recall card: '+c.id);
assert(merged.filter(c=>c.id.startsWith('task1_v210_chem_card_')).length===11);
assert(merged.filter(c=>c.id.startsWith('task1_v215_chem_rp4_')).length===7);
const tampered=JSON.parse(JSON.stringify(fake));
tampered[11].cards[0].mock=false;
tampered[12].cards[0].stage='A2';
const filtered=load([...core.cards],tampered);
assert(!filtered.some(c=>c.id===rates.cards[0].id),'v210 non-mock leaked into mock');
assert(!filtered.some(c=>c.id===rp4.cards[0].id),'v215 A2 mis-scope leaked into mock');
console.log('PASS v215: 7 RP4 mock cards, '+good+' correct accepted and '+bad+' wrong rejected; 11 v210 cards now load, 18 extra total, preserving 3345 core IDs and progress keys');
