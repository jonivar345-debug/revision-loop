'use strict';
// Raw source audit for original AQA school-mock flashcards using the REAL
// evaluateCard function. Cards receive extra editorial calibrations at runtime;
// therefore source-level mismatches are triage leads, not a production verdict.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),deck=json('deck.json');
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
const isMock=deck.cards.filter(c=>c.mock===true&&c.active!==false);
assert.equal(isMock.length,2379);
const selectorStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const selectorEnd=app.indexOf('function startMockSession(){',selectorStart);
assert(selectorStart>0&&selectorEnd>selectorStart);
const eligibleCard=new Function(app.slice(selectorStart,selectorEnd)+
 '\nreturn mockEligibleCard;')();
const cards=isMock.filter(c=>c.taught!==false&&eligibleCard(c));
assert.equal(cards.length,2369);
const begin=app.indexOf('function normalise('),end=app.indexOf('function rateCard(',begin);
assert(begin>0&&end>begin);
const scorerSource=app.slice(begin,end);
assert(scorerSource.includes('function evaluateCard(c,input){'));
const evaluate=new Function('window',scorerSource+'\nreturn evaluateCard;')({
 RevisionPhotoelectricCardMarking:{TARGET_ID:'no-core-target-in-source-qa',evaluate:()=>null}
});
const summary={
 run:'v426',scope:'original_raw_school_mock_cards',readOnly:true,
 rawCore:deck.cards.length,rawMockActive:isMock.length,
 mockSelectorCandidates:cards.length,probes:0,
 counts:{modelCorrect:0,modelNotCorrect:0,acceptedCorrect:0,acceptedAttempted:0,
  acceptedNotCorrect:0,explicitRejectCredited:0,fullModelDenialCredited:0,
  questionEchoCredited:0,blankCredited:0,idkCredited:0,scorerErrors:0},
 bySubject:Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,{
  candidateCards:0,probes:0,modelCorrect:0,modelNotCorrect:0,
  rejectFull:0,quoteDenialFull:0,scorerErrors:0
 }])),
 examples:{
  modelNotCorrect:[],acceptedNotCorrect:[],explicitRejectCredited:[],
  fullModelDenialCredited:[],questionEchoCredited:[],blankCredited:[],idkCredited:[],
  scorerErrors:[]
 },
 limitations:[
 'This audits 2,369 original source cards before the full set of runtime-only exact-ID answer and marker calibrations. Any mismatches require rechecking the live calibrated form.',
 'A wrong answer containing the full correct model only as a quotation should not receive credit, but a bare quote plus a true correction may still be a genuine answer.',
 'A curated reject variant should never be scored as fully correct; partial credit still requires context and source-specific review.',
 'This does not assess handwriting, diagrams, long explanations or complete AQA specification coverage.'
 ]
};
const record=(key,c,input,result)=>{
 if(summary.examples[key].length<110)summary.examples[key].push({
  id:c.id,subject:c.subject,topic:c.topic,specRef:c.specRef||null,
  input:String(input).slice(0,250),front:String(c.front||'').slice(0,220),
  back:String(c.back||'').slice(0,240),result:result?.status||null,
  score:result?.score??null
 });
};
function probe(c,kind,input){
 summary.probes++;summary.bySubject[c.subject].probes++;
 try{
  const r=evaluate(c,input);
  if(!r||!['wrong','partial','correct','neutral'].includes(r.status))
   throw Error('Invalid evaluator response');
  const full=r.status==='correct'&&Number(r.score)>=1;
  if(kind==='model'){
   if(full){summary.counts.modelCorrect++;summary.bySubject[c.subject].modelCorrect++;}
   else{summary.counts.modelNotCorrect++;summary.bySubject[c.subject].modelNotCorrect++;record('modelNotCorrect',c,input,r);}
  }else if(kind==='accepted'){
   summary.counts.acceptedAttempted++;
   if(full)summary.counts.acceptedCorrect++;
   else{summary.counts.acceptedNotCorrect++;record('acceptedNotCorrect',c,input,r);}
  }else if(full){
   const key={reject:'explicitRejectCredited',denial:'fullModelDenialCredited',
    echo:'questionEchoCredited',blank:'blankCredited',idk:'idkCredited'}[kind];
   summary.counts[key]++;record(key,c,input,r);
   if(kind==='reject')summary.bySubject[c.subject].rejectFull++;
   if(kind==='denial')summary.bySubject[c.subject].quoteDenialFull++;
  }
 }catch(e){
  summary.counts.scorerErrors++;summary.bySubject[c.subject].scorerErrors++;
  if(summary.examples.scorerErrors.length<110)summary.examples.scorerErrors.push({
   id:c.id,subject:c.subject,kind,error:String(e).slice(0,175)
  });
 }
}
for(const c of cards){
 assert(['Physics','Chemistry','Maths'].includes(c.subject),'Unexpected subject '+c.id);
 summary.bySubject[c.subject].candidateCards++;
 probe(c,'model',c.back);
 probe(c,'blank','');
 probe(c,'idk','I do not know');
 probe(c,'echo',c.front);
 probe(c,'denial','The statement "'+c.back+'" is wrong.');
 for(const x of (Array.isArray(c.reject)?c.reject:[]).slice(0,3))
  if(String(x||'').trim())probe(c,'reject',x);
 for(const x of (Array.isArray(c.accept)?c.accept:[]).slice(0,3))
  if(String(x||'').trim())probe(c,'accepted',x);
}
assert.equal(Object.values(summary.bySubject).reduce((n,s)=>n+s.candidateCards,0),2369);
assert.equal(summary.counts.blankCredited,0,'Raw core blank answer got full marks');
assert.equal(summary.counts.idkCredited,0,'Raw core nonanswer got full marks');
assert.equal(summary.counts.fullModelDenialCredited,0,'Exact quoted source answer denied yet marked correct');
assert.equal(summary.counts.explicitRejectCredited,0,'Curated rejected response earned full credit');
assert.equal(summary.counts.questionEchoCredited,0,'Repeating the question earned full credit');
assert.equal(summary.counts.modelCorrect,2369,'Raw correct model no longer accepted');
assert.equal(summary.counts.acceptedCorrect,summary.counts.acceptedAttempted,'Valid sourced alternative was rejected');
assert.equal(json('exam_questions.json').questions.length,1268);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v426 raw core flashcard source marker harness; calibration-dependent discrepancies reported below, not automatically signed off.');
console.log('V426_CORE_FLASHCARD_REPORT_START');
console.log(JSON.stringify(summary,null,2));
console.log('V426_CORE_FLASHCARD_REPORT_END');
