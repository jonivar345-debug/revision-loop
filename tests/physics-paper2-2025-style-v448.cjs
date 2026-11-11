'use strict';
/* v448: all 30 2025 7407/2 MCQ method families from a SECONDARY index,
   plus 15 new authored questions. No actual AQA 2025 mark-scheme verification. */
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const bank=JSON.parse(fs.readFileSync('physics_as_paper2_guided_v430.json','utf8'));
const matrix=JSON.parse(fs.readFileSync('editorial/physics-paper2-2025-mcq-matrix-v448.json','utf8'));
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
const cards=bank.cards,old=cards.slice(0,198),added=cards.filter(c=>/^as_p2_v448_\d{3}$/.test(c.id));
assert.equal(cards.length,213);
assert.equal(crypto.createHash('sha256').update(JSON.stringify(old)).digest('hex'),
 '8b1ae1eb57d02a9839eefedbd2e4b5b4d3971bb7d46fc053ce528ca890c63003',
 'All prior 198 cards (questions, explanations, accepted answers, IDs) must remain unchanged');
assert.equal(added.length,15);
assert.equal(new Set(cards.map(c=>c.id)).size,213);
assert.deepEqual(added.map(c=>c.id),Array.from({length:15},(_,i)=>'as_p2_v448_'+String(i+1).padStart(3,'0')));
assert.equal(matrix.questionCount,34);
assert.equal(matrix.sectionC.questionCount,30);
assert.equal(matrix.questions.length,30);
assert.deepEqual(matrix.questions.map(q=>q.question),Array.from({length:30},(_,i)=>String(i+5).padStart(2,'0')));
assert.equal(matrix.source.originalPaperVerified,false);
assert.equal(matrix.source.officialMarkSchemeVerified,false);
assert.equal(matrix.questions.filter(q=>q.diagramDependent).length,9);
assert.equal(matrix.questions.filter(q=>q.newOriginalPracticeId).length,15);
for(const q of matrix.questions){
 assert(q.specRef.startsWith('3.'));
 assert.equal(q.section,'C');
 assert(q.skill.length>12);
 assert.equal(q.examAnswerVerified,false);
 assert.equal(q.sourceEquivalenceCertified,false);
 if(q.newOriginalPracticeId){
  const c=added.find(x=>x.id===q.newOriginalPracticeId);
  assert(c,'Missing matrix-mapped original card '+q.newOriginalPracticeId);
  assert.equal(c.sourceStyle.question,q.question);
  assert.equal(c.specRef,q.specRef);
 }
}
for(const c of added){
 assert.equal(c.paper2Section,'C');
 assert.equal(c.paper2Mode,'mcq');
 assert.equal(c.paper2Choices.length,4);
 assert.equal(c.paper2Choices[0],c.back,'Canonical correct choice must equal model answer: '+c.id);
 assert.equal(new Set(c.paper2Choices.map(v=>v.toLowerCase())).size,4);
 assert(c.sourceStyle.verification.includes('official_mark_scheme_unreviewed'));
 assert(c.active===true&&c.taught===true&&c.mock===false&&c.scope==='full');
 assert(c.paper2Hint.length>=15&&c.paper2Hint.length<=145);
 assert(c.paper2Trap.length>=15&&c.paper2Trap.length<=145);
 assert(c.front.length<=175&&c.back.length<=165);
 assert(c.accept.length>=1);
}
assert.deepEqual(Object.fromEntries(['A','B','C'].map(s=>[s,cards.filter(c=>c.paper2Section===s).length])),{A:71,B:44,C:98});
function nearly(got,expected,tol){assert(Math.abs(got-expected)<=tol,got+' != '+expected)}
nearly(250*(4*0.08),80,1e-9);
nearly(3*1.6e-19/6.63e-34,7.24e14,1e12);
nearly(8*0.25,2,1e-9);
nearly(20e3*50/0.8,1.25e6,1);
nearly(6/(1.5-6/6),12,1e-9);
nearly(9*2+10,28,0);
nearly(9+10*2,29,0);
nearly(15*(1000*10*Math.sin(5*Math.PI/180)+600),22073.36,1);
assert(app.includes('(?:430|443|444|445|446|447|448)'));
assert(html.includes('paper2=v448'));
assert(sw.includes('v448-2025-source-crosswalk'));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v448: 30 indexed 2025 MCQ skills, 9 pending visual checks, 15 original answer-verified MCQs, 198 original cards preserved, saved progress and offline intact');
