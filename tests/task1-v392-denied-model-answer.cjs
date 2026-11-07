'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');
const app=read('app.js'),sw=read('sw.js'),deck=JSON.parse(read('deck.json'));
const audit=JSON.parse(read('editorial/task1-v392-model-answer-denial-audit.json'));
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v392');
assert(sw.includes('-v392-denied-model-guard'));
const a=app.indexOf('function normalise('),b=app.indexOf('function importantTokens(',a);
assert(a>=0&&b>a);
const block=app.slice(a,b);
const guardStart=block.indexOf(' // v392: Reject explicitly denying a whole known answer;');
const guardEnd=block.indexOf(' if(isReversedChemistryEquation(c,input))',guardStart);
assert(guardStart>=0&&guardEnd>guardStart);
const mk=src=>new Function('window',src+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:{TARGET_ID:'__none__',evaluate:()=>null}});
const previous=mk(block.slice(0,guardStart)+block.slice(guardEnd)),current=mk(block);
const active=deck.cards.filter(c=>c.mock===true&&c.active!==false);
assert.equal(active.length,2379);
const counts={Physics:0,Chemistry:0,Maths:0};
let previousFalseCorrect=0,allDenied=0,modelAccepted=0,normalUnchanged=0,sampledOtherDenials=0,variantUnchanged=0;
for(let i=0;i<active.length;i++){
 const c=active[i],clean=String(c.back||'').replace(/[.!?]+$/,'');
 const response='The answer is not '+clean;
 const before=previous(c,response),after=current(c,response);
 if(before.status==='correct'){previousFalseCorrect++;counts[c.subject]++;}
 assert.equal(after.status,'wrong','Explicit model denial not rejected '+c.id);
 assert.equal(after.score,0,'Explicit model denial scored '+c.id);
 allDenied++;
 assert.equal(current(c,c.back).status,'correct','Valid model rejected '+c.id);
 modelAccepted++;
 const ordinary='The answer is '+clean;
 const was=previous(c,ordinary),now=current(c,ordinary);
 assert.deepEqual(now,was,'Ordinary answer changed '+c.id);normalUnchanged++;
 if(i%10===0){
  for(const beginning of ['The correct answer is not ','My answer is not ','The result is not ']){
   const result=current(c,beginning+clean);
   assert.equal(result.status,'wrong','Alternate denial not rejected '+c.id);
   assert.equal(result.score,0);sampledOtherDenials++;
  }
 }
 for(const v of (Array.isArray(c.accept)?c.accept:[]).slice(0,1)){
  if(/^(?:the (?:correct )?answer|my answer|the result)\s+is\s+not\s+/i.test(v))continue;
  assert.deepEqual(current(c,v),previous(c,v),'Approved variant altered '+c.id);
  variantUnchanged++;
 }
}
assert.equal(previousFalseCorrect,2062);
assert.deepEqual(counts,{Physics:648,Chemistry:1362,Maths:52});
assert.equal(allDenied,2379);
assert.equal(modelAccepted,2379);
assert.equal(normalUnchanged,2379);
assert.deepEqual(audit.baseline.beforeCorrectCountBySubject,counts);
assert.equal(audit.baseline.beforeCorrectCount,previousFalseCorrect);
const synthetic={id:'v392_synthetic',subject:'Physics',stage:'AS',mock:true,front:'Which colour?',back:'blue',accept:['navy blue'],reject:[]};
assert.equal(current(synthetic,'The answer is not navy blue').status,'wrong');
assert.equal(current(synthetic,'The answer is not navy blue').score,0);
const contrast='The answer is not red, it is blue';
assert.deepEqual(current(synthetic,contrast),previous(synthetic,contrast));
const trueNegative={...synthetic,back:'not a proton'};
assert.deepEqual(current(trueNegative,'The answer is not a proton'),previous(trueNegative,'The answer is not a proton'));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v392: 2062 previously falsely accepted whole-answer denials fixed across 2379 original mock flashcards; all 2379 original model answers accepted; ordinary answers, reviewed variants and progress keys preserved; '+sampledOtherDenials+' other denial phrasings checked, '+variantUnchanged+' existing accepted variants unchanged.');