'use strict';
// Read-only, repeatable whole-bank triage. Findings are explicitly NOT automatic
// corrections: scientific correctness and all examiner alternatives require review.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json'),questions=j('exam_questions.json');
const flashNames=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const practiceNames=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(core.cards.length,3345);assert.equal(questions.questions.length,1268);
assert(flashNames.length>=53);assert(practiceNames.length>=43);
const banks=flashNames.map(path=>j(path));
const pos=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),end=app.indexOf(' const added=[',pos);
assert(pos>=0&&end>pos);
const loadCards=new Function('cards','extraFlashBanks',app.slice(pos,end)+'\nreturn cards;');
const actual=loadCards([...core.cards],banks),base=new Set(core.cards.map(c=>c.id));
const ns=app.indexOf('function normalise('),ne=app.indexOf('function importantTokens(',ns);assert(ns>=0&&ne>ns);
const evaluate=new Function('window',app.slice(ns,ne)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const audit={coreCards:core.cards.length,coreQuestions:questions.questions.length,flashBanks:flashNames.length,questionBanks:practiceNames.length,loadedCards:actual.length,subjectCounts:{},specRefCounts:{},mappedToMock:0,explicitAcceptedAnswersChecked:0,explicitRejectedAnswersChecked:0,modelAnswersChecked:0,acceptedNotCorrect:[],rejectedMarkedCorrect:[],modelNotCorrect:[],frontDuplicates:[],missingMetadata:[],idDuplicates:[],physicsA2MarkedMockCount:0,physicsA2MarkedMockExamples:[],questionAudit:{total:questions.questions.length,extended:0,missingMarks:0,missingModel:0,badPointCount:0,idDuplicates:[],physicsA2MarkedMockCount:0,physicsA2MarkedMockExamples:[]}};
const byId=new Set(),fronts=new Map();
const sample=(target,row)=>{if(target.length<70)target.push(row)};
for(const card of actual){
 if(!card||typeof card!=='object')continue;
 const id=String(card.id||'');
 if(byId.has(id))sample(audit.idDuplicates,id);byId.add(id);
 const subject=String(card.subject||'unknown');
 audit.subjectCounts[subject]=(audit.subjectCounts[subject]||0)+1;
 if(card.specRef){const ref=subject+':'+card.specRef;audit.specRefCounts[ref]=(audit.specRefCounts[ref]||0)+1;}
 if(card.mock===true)audit.mappedToMock++;
 if(subject==='Physics'&&card.stage==='A2'&&card.mock===true){audit.physicsA2MarkedMockCount++;sample(audit.physicsA2MarkedMockExamples,{id,front:String(card.front||'').slice(0,115),specRef:card.specRef});}
 if(!id||!card.front||!card.back||!['Maths','Physics','Chemistry'].includes(subject))sample(audit.missingMetadata,{id,subject,front:card.front});
 const frontKey=subject+':'+String(card.front||'').trim().toLowerCase().replace(/\s+/g,' ');
 if(frontKey.length>8&&fronts.has(frontKey))sample(audit.frontDuplicates,{a:fronts.get(frontKey),b:id,subject,front:String(card.front||'').slice(0,130)});
 else fronts.set(frontKey,id);
 if(typeof card.back==='string'&&card.back.trim()){
  const r=evaluate(card,card.back);audit.modelAnswersChecked++;
  if(r.status!=='correct')sample(audit.modelNotCorrect,{id,subject,front:String(card.front||'').slice(0,90),result:r.status});
 }
 if(Array.isArray(card.accept))for(const text of card.accept){
  if(typeof text!=='string'||!text.trim())continue;
  audit.explicitAcceptedAnswersChecked++;
  const r=evaluate(card,text);
  if(r.status!=='correct')sample(audit.acceptedNotCorrect,{id,subject,text:text.slice(0,115),result:r.status});
 }
 if(Array.isArray(card.reject))for(const text of card.reject){
  if(typeof text!=='string'||!text.trim())continue;
  audit.explicitRejectedAnswersChecked++;
  const r=evaluate(card,text);
  if(r.status==='correct')sample(audit.rejectedMarkedCorrect,{id,subject,text:text.slice(0,115),result:r.status});
 }
}
const qset=new Set();
for(const q of [...questions.questions,...practiceNames.flatMap(path=>j(path).questions||[])]){
 audit.questionAudit.extended++;
 const id=String(q.id||'');
 if(qset.has(id))sample(audit.questionAudit.idDuplicates,id);qset.add(id);
 if(q.subject==='Physics'&&q.mock===true&&q.level==='A2'){audit.questionAudit.physicsA2MarkedMockCount++;sample(audit.questionAudit.physicsA2MarkedMockExamples,{id,question:q.question,level:q.level,specRef:q.specRef});}
 if(!Number.isFinite(q.marks)||q.marks<1)audit.questionAudit.missingMarks++;
 if(!q.modelAnswer&&!q.answer&&!q.numericAnswer&&!q.markScheme)audit.questionAudit.missingModel++;
 if(Array.isArray(q.markPoints)&&q.markPoints.length&&q.markPointMarks&&q.markPointMarks.length!==q.markPoints.length)audit.questionAudit.badPointCount++;
}
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
const short={...audit,specRefCounts:Object.entries(audit.specRefCounts).sort((a,b)=>b[1]-a[1]).slice(0,35)};
console.log('AUDIT_V282_JSON_BEGIN');
console.log(JSON.stringify(short,null,2));
console.log('AUDIT_V282_JSON_END');
console.log('PASS v282 full-bank diagnostic executed: no model answer changes, grading mutations or cloud/progress key changes. All flagged cases are triage candidates and require human judgement.');
