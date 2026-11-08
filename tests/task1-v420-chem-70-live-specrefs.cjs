'use strict';
// Stage source-verified AQA 7405 metadata without changing mock question
// wording, marks or solution. v417 source evidence remains an immutable
// historical crosswalk even though the live specRef fields are now present.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=f=>fs.readFileSync(f,'utf8'),json=f=>JSON.parse(read(f));
const ledger=json('editorial/task1-v417-chem-legacy-70-syllabus-map.json');
const app=read('app.js'),sw=read('sw.js');
const hash=v=>{
 let h=2166136261,s=String(v||'');
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16);
};
assert.equal(ledger.rows.length,70);
assert(sw.includes('-v420-chem-70-specrefs'),'Offline version must refresh for new references');
const manifest=app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/);
assert(manifest,'Supplementary practice loader moved');
const sources=[...new Set(ledger.rows.map(r=>r.source))];
assert.equal(sources.length,7);
let total=0,coveredMarks=0;
const subjects={};
for(const path of sources){
 assert(manifest[1].includes("'./"+path+"'"),'Source no longer loaded: '+path);
 const d=json(path),items=d.questions;
 assert(Array.isArray(items));
 const expected=ledger.rows.filter(row=>row.source===path);
 assert.equal(items.length,expected.length,'New items in 70-question bank need separate review: '+path);
 for(const row of expected){
  const q=items.find(q=>q.id===row.id);
  assert(q,'Lost question '+row.id);
  assert.equal(q.subject,'Chemistry');
  assert.equal(q.mock,true);
  assert.equal(q.standalone,true);
  assert.equal(q.specRef,row.primarySpecRef,'AQA 7405 metadata disagreement '+q.id);
  assert.equal(q.marks,row.marks);
  assert.equal(hash(q.prompt),row.promptHash,'Prompt changed '+q.id);
  assert.equal(hash(q.modelAnswer),row.answerHash,'Model answer changed '+q.id);
  assert.equal(hash(JSON.stringify({
   markPoints:q.markPoints,markPointMarks:q.markPointMarks,marks:q.marks
  })),row.criteriaHash,'Rubric changed '+q.id);
  assert(Array.isArray(q.markPoints)&&q.markPoints.length>0);
  total++;coveredMarks+=row.marks;
  const key=row.primarySpecRef.slice(0,5);
  subjects[key]=(subjects[key]||0)+1;
 }
}
assert.equal(total,70);
assert.equal(coveredMarks,445);
assert.deepEqual(subjects,{'3.1.1':15,'3.1.2':9,'3.1.3':23,'3.1.4':23});
assert.equal(json('deck.json').cards.length,3345);
assert.equal(json('exam_questions.json').questions.length,1268);
const protectedKeys=["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"];
protectedKeys.forEach(k=>assert(app.includes(k)));
console.log('PASS v420: all '+total+' exact AQA Chemistry subsection references applied, '+
 coveredMarks+' marks of question wording/model/rubric source-hashed unchanged; '+
 '3,345 flashcards, 1,268 original exam questions and saved keys preserved. '+
 'This does not certify alternative student working, diagram assessment or complete syllabus.');
