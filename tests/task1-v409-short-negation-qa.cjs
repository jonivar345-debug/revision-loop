'use strict';
// v409: real original school-mock short answers must never gain credit when
// they explicitly call a sourced correct marking point false/wrong.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js');
const bank=json('exam_questions.json'),deck=json('deck.json');
const corrections=json('exam_answer_corrections.json');
assert.equal(deck.cards.length,3345);
assert.equal(bank.questions.length,1268);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,1268);
assert(sw.includes('-v409-negated-markpoints'),'Ensure offline scorer cache refreshes');
const es=app.indexOf('function examSuggested(q,answer){');
const coreStart=app.indexOf(' // v404:',es);
const coreEnd=app.indexOf(' // v213:',coreStart);
const end=app.indexOf('function examGraphDiagram(',es);
assert(es>0&&coreEnd>coreStart&&end>coreEnd);
const v409=app.slice(es,coreEnd);
assert(v409.includes('explicitPointDenialPrefixed'),'Missing v409 reject helper');
const early=new Function('window',v409+'\n}\nreturn examSuggested;')({});
const short=bank.questions.filter(q=>q.mock===true&&q.standalone===true&&
 q.taught!==false&&q.answerType==='points'&&q.marks>0&&q.marks<=2);
assert.equal(short.length,120,'Unexpected original short-point sample');
const correctModel=q=>{
 if(Object.hasOwn(corrections.modelAnswers||{},q.id))return corrections.modelAnswers[q.id];
 return corrections.questionCorrections?.[q.id]?.modelAnswer||q.modelAnswer;
};
const variants=[
 p=>'This marking point is incorrect: '+p,
 p=>'This mark point is wrong: '+p,
 p=>'The statement "'+p+'" is wrong.',
 p=>'The statement "'+p+'" is untrue.',
 p=>'It is false that '+p,
 p=>'This claim is false: '+p,
 p=>'I disagree that '+p,
 p=>'The claim "'+p+'" is incorrect.',
 p=>'This statement is false: '+p, // v406 regression
 p=>'The statement "'+p+'" is incorrect.' // v406 regression
];
let negatives=0,modelControls=0,contrastControls=0,manualNegatives=0;
for(const q of short){
 const manual=q.manualDiagramReview===true||q.manualWorkingReview===true;
 for(const p of q.markPoints||[]){
  for(const make of variants){
   const result=early(q,make(p));
   assert(result&&result.suggested===0,'False point awarded '+q.id+' / '+make(p));
   assert.equal(result.finalCorrect,false);
   assert.deepEqual(result.preds,Array(q.markPoints.length).fill(false));
   if(manual){assert.equal(result.manualRequired,true);manualNegatives++}
   else assert(result.v406RejectedPointDenial===true||result.v425QuotedModelDenial===true,'Denial form not recognised '+q.id);
   negatives++;
  }
 }
 const model=correctModel(q);
 if(!manual){
  assert.equal(early(q,model),undefined,'Legitimate model caught by new guard '+q.id);
  modelControls++;
  for(const a of [
   'This claim is false: unrelated incorrect claim; '+model,
   'It is false that a completely unrelated claim; '+model,
   'I disagree that a completely unrelated claim; '+model,
   'The statement "an unrelated incorrect claim" is wrong. '+model
  ]){
   assert.equal(early(q,a),undefined,'Legitimate correction caught by guard '+q.id);
   contrastControls++;
  }
 }
}
// Apply reviewed full evaluator to actual one-mark originals previously proved
// to give false credit when a correct point was explicitly rejected.
const helperNames=['clamp','normalise','tokens','compact','contradicts','importantTokens',
 'markPointPrediction','parseNumber','numericMatch','formulaScore','phraseScore',
 'evidenceRuleScore','totalMarkingPoints','acceptedMarkPointAlternative',
 'singleClaimEvidenceCap','reviewedShortAnswerFlags','hasMeaning','synonymSet',
 'stemToken','close','oppositeDirectionWords','lev'];
const functions=[...app.matchAll(/^function ([\w]+)\(/gm)].map(m=>({name:m[1],at:m.index}));
const get=name=>{
 const f=functions.find(x=>x.name===name);
 assert(f,'Missing evaluator helper '+name);
 return app.slice(f.at,functions.find(x=>x.at>f.at)?.at||app.length);
};
const full=new Function('window',helperNames.map(get).join('\n')+'\n'+app.slice(es,end)+
 '\nreturn examSuggested;')({});
const liveIds=['aqa_chem_as16_p1_q1_2','aqa_phy_as17_p1_q1_5','aqa_phy_as19_p1_q1_2'];
let fullNegatives=0,validFull=0;
for(const id of liveIds){
 const q=bank.questions.find(x=>x.id===id);
 assert(q&&q.marks===1&&q.markPoints?.length===1,'Missing 1-mark original '+id);
 for(const make of variants){
  const result=full(q,make(q.markPoints[0]));
  assert.equal(result.suggested,0,'Real full evaluator credited false claim '+id);
  assert(result.v406RejectedPointDenial===true||result.v425QuotedModelDenial===true,'Explicit correct-point denial must be rejected');
  fullNegatives++;
 }
 const result=full(q,correctModel(q));
 assert.equal(result.suggested,1,'Real correct one-mark model undercredited '+id);
 validFull++;
}
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key),'Student progress key altered');
assert(app.includes('applyV403Original82ManualReview(examQuestions);'));
assert(app.includes('applyV405ShortSemanticManualReview(examQuestions);'));
assert(app.includes('if(q.manualDiagramReview===true||q.manualWorkingReview===true)'));
assert(app.includes('chemistryMockBufferExcluded')===false,'v408 selectors remain standalone');
assert(app.includes('function mockEligibleQuestion(q){'));
// A real 2018 AQA Chemistry concordant-titre special marker previously
// stripped minus signs while extracting measurements and gave even 2/2 to
// three negative readings. Review the selected readings and signed mean.
const titre=bank.questions.find(x=>x.id==='aqa_2018_C_2_3');
assert(titre&&titre.markingMode==='concordantTitres2018'&&titre.marks===2);
const titreRight=[
 '23.90 and 24.00; mean 23.95 cm3',
 '23.90, 24.00 therefore mean = 23.95 cm³'
];
const titreWrong=[
 '-23.90 and -24.00; mean -23.95 cm3',
 '−23.90 and −24.00; mean −23.95 cm3',
 '− 23.90 and − 24.00; mean − 23.95 cm3',
 '–23.90 and —24.00; mean –23.95 cm3',
 '-23.95',
 '−23.86',
 '23.90 and -24.00; mean -23.95 cm3'
];
for(const response of titreRight){
 const grade=full(titre,response);
 assert.equal(grade.suggested,2,'Valid positive concordant titres lost marks: '+response);
 assert.equal(grade.finalCorrect,true);
}
for(const response of titreWrong){
 const grade=full(titre,response);
 assert.equal(grade.suggested,0,'Negative titres or mean falsely earned credit: '+response);
 assert.equal(grade.finalCorrect,false);
}
const titrePartial=full(titre,'23.90 and 24.00; mean -23.95 cm3');
assert.equal(titrePartial.suggested,1,'Correct selection can earn one mark with a wrong-signed mean');
assert.equal(titrePartial.finalCorrect,false);

console.log('PASS v409: '+negatives+' original short mark-point denial probes (including '+
 manualNegatives+' manual), '+modelControls+' exact model controls, '+
 contrastControls+' legitimate corrective explanations, '+fullNegatives+
 ' real wrong-answer full-score probes and '+validFull+
 ' correct one-mark controls, 2 positive and 7 negative titration probes plus 1 partial valid selection. v406/v408 and saved identity schemes preserved.');
