'use strict';
// v466: cross-paper structural regression; independently authored questions only.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const paths=['maths_year13_pure_v450.json','maths_pure_past_methods_v451.json',
 'maths_pure_2024_p1_v452.json','maths_pure_2024_p2p3_v457.json',
 'maths_pure_2023_p1_v458.json','maths_pure_2023_p2_v459.json',
 'maths_pure_2023_p3_v460.json','maths_pure_2022_p1_v461.json'];
const older=paths.flatMap(p=>read(p).questions);
const p2=read('maths_pure_2022_p2_v466.json');
const p3=read('maths_pure_2022_p3_v466.json');
const all=[...older,...p2.questions,...p3.questions];
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(older.length,156);
assert.equal(p2.questions.length,10);assert.equal(p3.questions.length,10);
assert.equal(all.length,176);
assert.equal(new Set(all.map(q=>q.id)).size,176,'No overwritten progress IDs');
const start=app.indexOf('function currentYear13PureMockCard(');
const stop=app.indexOf('// Build a bounded batch.',start);
assert(start>=0&&stop>start);
const gates={};
vm.runInNewContext(app.slice(start,stop)+
 '\nthis.checkQuestion=currentYear13PureMockQuestion;',gates);
assert.equal(older.filter(gates.checkQuestion).length,126);
assert.equal(p2.questions.filter(gates.checkQuestion).length,6);
assert.equal(p3.questions.filter(gates.checkQuestion).length,9);
assert.equal(all.filter(gates.checkQuestion).length,141);
assert.equal(all.filter(q=>!gates.checkQuestion(q)).length,35);
for(const [pack,n,marks,optional,perQuestionMarks] of [
 [p2,2,50,4,[1,1,1,3,6,5,9,5,4,15]],
 [p3,3,50,1,[1,1,1,2,3,9,7,7,6,13]]
]){
 assert.equal(pack.version,'v466');
 assert.equal(pack.paperId,'7357-2022-'+n);
 assert.equal(pack.paper,'7357/'+n);
 assert.equal(pack.pureSection,'Section A, Questions 1–10');
 assert.equal(pack.pureQuestionCount,10);
 assert.equal(pack.pureMarks,marks);
 assert.equal(pack.sourceAuditStatus,'provisional-method-crosswalk');
 assert.equal(pack.fullVisualAuditComplete,false);
 assert.equal(pack.fullMarkSchemeAuditComplete,false);
 assert.equal(pack.inventory.length,10);
 assert.deepEqual(pack.inventory.map(q=>q.marks),perQuestionMarks);
 assert.equal(pack.inventory.reduce((v,q)=>v+q.marks,0),marks);
 assert(pack.inventory.every((q,i)=>q.question===i+1&&q.classification==='pure'&&q.textQuoted===false));
 assert.equal(pack.questions.filter(q=>!q.mock).length,optional);
 assert(pack.sourceQuestionPaper.startsWith('https://filestore.aqa.org.uk/'));
 assert(pack.sourceMarkScheme.startsWith('https://filestore.aqa.org.uk/'));
 for(const [i,q] of pack.questions.entries()){
  assert.equal(q.id,'y13_v466_p'+n+'_q_'+String(i+1).padStart(3,'0'));
  assert.equal(q.year,'Practice');assert.equal(q.level,'A-level');
  assert.equal(q.subject,'Maths');assert.equal(q.stage,'A2');
  assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
  assert(q.standalone&&q.manualWorkingReview&&q.requiresWorking);
  assert.equal(q.year13PureMock,q.mock);assert.equal(q.year13Optional,!q.mock);
  assert.equal(q.taught,q.mock);
  assert.equal(q.courseTopic,q.mock?'Year 13 Pure · taught mock':'Year 13 Pure · additional practice');
  assert(q.marks>=3&&q.marks<=9);
  assert.equal(q.markPoints.length,q.marks);assert.equal(q.markPointMarks.length,q.marks);
  assert(q.markPointMarks.every(x=>x===1));
  assert.equal(q.modelAnswer,q.markPoints.join(' '));
  assert(q.prompt.endsWith('['+q.marks+' marks]'));
  assert(q.sourceStyle.methodPaper===n&&q.sourceStyle.methodYear===2022);
  assert.equal(q.sourceStyle.methodQuestion,i+1);
  assert.equal(q.sourceStyle.questionPaper,pack.sourceQuestionPaper);
  assert.equal(q.sourceStyle.markScheme,pack.sourceMarkScheme);
  assert.equal(gates.checkQuestion(q),q.mock,'Bad taught-only eligibility '+q.id);
 }
}
assert(p2.appliedSection.includes('Mechanics'));
assert(p3.appliedSection.includes('Statistics'));
assert(p2.questions[6].modelAnswer.includes('32 cm²'));
assert(p2.questions[8].modelAnswer.includes('A=9'));
assert(p3.questions[1].modelAnswer.includes('4/3'));
assert(p3.questions[4].modelAnswer.includes('six solutions'));
assert(p3.questions[9].modelAnswer.includes('2<k<6'));
assert(Math.abs((4-8/3)-(4/3))<1e-12);
assert(Math.abs((16*.5*.5/2+64*Math.pow(.5,4)/4)-3)<1e-12);
assert(app.includes("const V466_2022_P2_URL='./maths_pure_2022_p2_v466.json'"));
assert(app.includes("const V466_2022_P3_URL='./maths_pure_2022_p3_v466.json'"));
assert(app.includes('...validatedV466P2,...validatedV466P3'));
assert(app.includes('mapped2022Html'));
assert(app.includes("const mustOnly=sub==='Maths'&&settings.recallMustKnowFirst!==false;"));
assert(app.includes('examYear13PurePreset=true;'));
assert(app.includes("(!examYear13PurePreset||currentYear13PureMockQuestion(q))"));
const v462=read('maths_must_memorise_v462.json');
assert.equal(v462.totalSelected,89);
assert.equal(v462.cards.length,66);
assert.equal(Object.keys(v462.existingIdsBySelectionNumber).length,23);
assert(html.includes('papers=v466'));
assert(sw.includes("'./maths_pure_2022_p2_v466.json'"));
assert(sw.includes("'./maths_pure_2022_p3_v466.json'"));
assert(sw.includes("'./maths_must_memorise_v462.json'"));
for(const marker of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"]){
 assert(app.includes(marker),'Saved progress key unexpectedly modified: '+marker);
}
console.log('PASS v466: 176 original worked Pure problems (141 taught, 35 optional), two provisional 2022 Pure Section A crosswalks, 89 strict flashcards and stable saved progress.');
