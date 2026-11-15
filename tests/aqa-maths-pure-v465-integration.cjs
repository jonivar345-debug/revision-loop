'use strict';
// v465 integration checks for AQA Year 13 Pure, preserving v462 strict memorisation.
// Paper source inventories and original method variants are distinct: never claim that
// these are the original copyrighted AQA examination questions.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const bases=['maths_year13_pure_v450.json','maths_pure_past_methods_v451.json',
 'maths_pure_2024_p1_v452.json','maths_pure_2024_p2p3_v457.json',
 'maths_pure_2023_p1_v458.json','maths_pure_2023_p2_v459.json',
 'maths_pure_2023_p3_v460.json','maths_pure_2022_p1_v461.json'];
const banks=bases.map(read);
const all=banks.flatMap(p=>p.questions);
const idSet=new Set(all.map(q=>q.id));
assert.equal(all.length,156,'All 156 independently authored Year 13 practices retained');
assert.equal(idSet.size,156,'No duplicate question IDs or overwritten prior progress');
assert.deepEqual(banks.slice(-3).map(b=>b.questions.length),[10,9,14]);
assert.deepEqual(banks.slice(-3).map(b=>b.questions.filter(q=>q.mock).length),[6,6,12]);
const st=app.indexOf('function currentYear13PureMockCard(');
const ed=app.indexOf('// Build a bounded batch.',st);
assert(st>=0&&ed>st);
const scope={};vm.runInNewContext(app.slice(st,ed)+
 '\nthis.isQuestion=currentYear13PureMockQuestion;this.isCard=currentYear13PureMockCard;',scope);
assert.equal(all.filter(scope.isQuestion).length,126);
assert.equal(all.filter(q=>!scope.isQuestion(q)).length,30);
for(const q of all){
 assert.equal(q.year,'Practice');
 assert.equal(q.sourceVerified,false,'New practice must not be labelled as an original AQA question');
 assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.year13PureMock,q.mock);
 assert.equal(q.year13Optional,!q.mock);
 assert(q.markPoints.length===q.marks&&q.markPointMarks.length===q.marks);
 assert(q.markPointMarks.every(n=>n===1));
 assert.equal(q.modelAnswer,q.markPoints.join(' '));
 if(!q.mock)assert(!scope.isQuestion(q),'Optional method leaked into taught-only mock: '+q.id);
}
for(const [file,ver,mock,optional,pureCount] of [
 ['maths_pure_2023_p2_v459.json','v459',6,4,10],
 ['maths_pure_2023_p3_v460.json','v460',6,3,9],
 ['maths_pure_2022_p1_v461.json','v461',12,2,15]
]){
 const p=read(file);
 assert.equal(p.version,ver);
 assert.equal(p.questions.filter(x=>x.mock).length,mock);
 assert.equal(p.questions.filter(x=>!x.mock).length,optional);
 assert.equal(p.inventory.length,pureCount);
 assert(p.sourceQuestionPaper.startsWith('https://filestore.aqa.org.uk/'));
 assert(p.sourceMarkScheme.startsWith('https://filestore.aqa.org.uk/'));
 assert.equal(p.fullVisualAuditComplete,false,'No visual verification claims');
 assert(p.questions.every(q=>q.sourceStyle?.questionPaper===p.sourceQuestionPaper));
}
const p2=read('maths_pure_2023_p2_v459.json'),p3=read('maths_pure_2023_p3_v460.json');
assert.equal(p2.pureMarks,50);assert.equal(p3.pureMarks,50);
assert.equal(p2.pureSection,'Section A, Questions 1–10');
assert.equal(p3.pureSection,'Section A, Questions 1–9');
assert(p2.questions.every(q=>q.sourceStyle.methodQuestion<=10),'No Mechanics imported');
assert(p3.questions.every(q=>q.sourceStyle.methodQuestion<=9),'No Statistics imported');
const p22=read('maths_pure_2022_p1_v461.json');
assert.equal(p22.inventory.reduce((t,r)=>t+r.marks,0),100);
const v462=read('maths_must_memorise_v462.json'),v450=read('maths_year13_pure_v450.json');
assert.equal(v462.cards.length,66);
assert.equal(Object.keys(v462.existingIdsBySelectionNumber).length,23);
const cards=[...v450.cards,...v462.cards];
assert.equal(cards.length,189);
assert.equal(cards.filter(scope.isCard).length,176);
assert.equal(v462.totalSelected,89);
const ids=new Set([...Object.values(v462.existingIdsBySelectionNumber),...v462.cards.map(c=>c.id)]);
assert.equal(ids.size,89);
assert(app.includes("const mustOnly=sub==='Maths'&&settings.recallMustKnowFirst!==false;"));
assert(app.includes("const effectiveMode=mustOnly?'flash':mode;"));
assert(app.includes("const qAll=sub==='Maths'&&!mustOnly?examQuestions.filter(currentYear13PureMockQuestion):[]"));
for(const v of ['459','460','461']){
 assert(app.includes('...validatedV'+v+'Questions'),'v'+v+' not appended');
 assert(sw.includes("'./maths_pure_"+(v==='461'?'2022_p1':'2023_p'+(v==='459'?'2':'3'))+"_v"+v+".json'"));
}
assert(html.includes('papers=v465'));
assert(app.includes('2023 · all three Pure paper methods reviewed'));
assert(app.includes('2022 Paper 1 · 15 questions'));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'",
 "SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
assert(Math.abs(3*(1+Math.SQRT2)/4-1.8106601717798212)<1e-12);
assert(Math.abs(200*2/(2+2)**2-25)<1e-12);
assert(Math.abs(25*(3*25+13)/2-1100)<1e-12);
assert(10*(1-2**(-6))>9.8 && 10*(1-2**(-5))<=9.8);
console.log('PASS v465: 156 distinct original worked questions, 126 taught and 30 optional; two 2023 Pure sections and 2022 Paper 1 source inventories, 89 strict must-memorise cards, progress/cloud preserved.');
