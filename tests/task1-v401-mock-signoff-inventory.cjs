'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const deck=json('deck.json'),bank=json('exam_questions.json');
const status=json('editorial/task1-v401-mock-signoff-inventory.json');
const waves=json('editorial/task1-v360-waves-coverage-and-open-gates.json');
const electricity=json('editorial/task1-v359-electricity-45-evidence-review.json');
const maths=json('editorial/task1-v329-maths-core-coverage-status.json');
const chemistry=json('editorial/task1-v367-chem-as-organic-eleven-gap-recheck.json');
const physicsManual=json('editorial/task1-v400-physics-8-method-qa.json');
const chemistryManual=json('editorial/task1-v398-chemistry-24-working-qa.json');
const mathsManual=json('editorial/task1-v399-maths-15-working-qa.json');
const exclusions=json('editorial/task1-v397-maths-first-pure-functions-qa.json');
assert.equal(deck.cards.length,3345,'Core flashcard bank unexpectedly changed');
assert.equal(new Set(deck.cards.map(x=>x.id)).size,3345,'Duplicate core IDs');
assert.equal(bank.questions.length,1268,'Original exam bank unexpectedly changed');
assert.equal(new Set(bank.questions.map(x=>x.id)).size,1268,'Duplicate original question IDs');
const active=deck.cards.filter(x=>x.mock===true&&x.active!==false);
assert.equal(active.length,2379,'Original school-mock card pool changed');
const empty=active.filter(x=>!String(x.front||'').trim()||!String(x.back||'').trim());
assert.equal(empty.length,0,'Blank original mock flashcards: '+empty.map(x=>x.id).join(','));
const notSubject=active.filter(x=>!['Physics','Chemistry','Maths'].includes(x.subject));
assert.equal(notSubject.length,0);
assert.equal(waves.remainingGates.length,7);
assert.equal(electricity.gates.length,4);
assert.equal(maths.productionMarkerWholeMathsFirstMock.failures,0);
assert.equal(maths.productionMarkerWholeMathsFirstMock.cards,331);
assert.equal(chemistry.counts.legacyUnmapped,11);
assert.equal(chemistry.counts.partiallyMatchedNotSignedOff,1);
assert.equal(physicsManual.counts.protectedMarks,24);
assert.equal(chemistryManual.counts.manualMarks||chemistryManual.counts.protectedMarks||chemistryManual.counts.affectedMarks,114);
assert.equal(mathsManual.counts.manualMarks,84);
assert.equal(exclusions.rows.length,11);
assert(app.includes('applyV400Physics8MethodManual(examQuestions);'));
assert(app.includes('applyV399MathsOriginal15Manual(examQuestions);'));
assert(app.includes('applyV398ChemistryOriginal24Manual(examQuestions);'));
const start=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),end=app.indexOf('function startMockSession(){',start);
assert(start>=0&&end>start,'Cannot find real school mock selector');
const {eligible,eligibleCard}=new Function(app.slice(start,end)+'\nreturn {eligible:mockEligibleQuestion,eligibleCard:mockEligibleCard};')();
const pure=bank.questions.filter(x=>x.subject==='Maths'&&eligible(x));
assert.equal(pure.length,117,'Year 1 Pure original question scope changed');
for(const row of exclusions.rows){const q=bank.questions.find(x=>x.id===row.id);assert(q&&!eligible(q),'Out-of-scope original Year 2 Maths question leaked: '+row.id);}
const keyTerms=/(?:\bbuffer(?:ed|s)?\b|\bhalf[\s-]?neutralisation\b)/i;
const chemBuffers=bank.questions.filter(x=>x.subject==='Chemistry'&&eligible(x)&&keyTerms.test([x.topic,x.subtopic,x.prompt].join(' ')));
const longCards=active.filter(x=>String(x.front||'').length>185||String(x.back||'').length>350);
const multipart=active.filter(x=>/\b(?:\([a-d]\)|[4-9]\s*marks?)\b/i.test(String(x.front||'')));
const oddRubrics=bank.questions.filter(q=>q.mock===true&&q.standalone===true&&Array.isArray(q.markPointMarks)&&q.markPointMarks.length&&q.markPointMarks.reduce((a,b)=>a+(Number(b)||0),0)!==q.marks);
const pendingGateCount=waves.remainingGates.length+electricity.gates.length;
assert.equal(status.subjectSignOff.Physics,false);
assert.equal(status.subjectSignOff.Chemistry,false);
assert.equal(status.subjectSignOff.Maths,false);
assert.equal(status.checks.codeReleaseReady,true);
assert.equal(status.checks.fullSpecIndependentlyCertified,false);
assert.equal(status.checks.handwrittenAndDrawnEvidenceCertified,false);
assert.equal(pendingGateCount,11);
const report={
  originalCore:deck.cards.length, originalMock:active.length, originalExamQuestions:bank.questions.length,
  originalYear1PureExamParts:pure.length,
  wavesIndependentGates:7, electricityIndependentGates:4,
  chemistryOldUnmappedRows:11, chemistryUnresolvedSpecificRow:1,
  mathsKnownAnswerRegressionFailures:0,
  longFlashcardCandidates:longCards.length, longFlashcardSample:longCards.slice(0,18).map(x=>({id:x.id,subject:x.subject,frontLength:String(x.front).length,backLength:String(x.back).length})),
  multipartFlashcardCandidates:multipart.length, multipartFlashcardSample:multipart.slice(0,18).map(x=>x.id),
  originalChemistryBufferExamCandidates:chemBuffers.length, originalChemistryBufferExamSample:chemBuffers.slice(0,15).map(x=>x.id),
  originalQuestionRubricWeightCandidates:oddRubrics.length, originalQuestionRubricWeightSample:oddRubrics.slice(0,15).map(x=>x.id),
  conclusion:'Release invariants verified; candidate lists require human review. Neither complete AQA coverage nor student mastery certified.'
};
console.log('PASS v401 read-only mock sign-off inventory');
console.log(JSON.stringify(report,null,2));