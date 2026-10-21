/* Ensure historical supplements are source-linked, standalone, accurately marked
   and routed to existing subject topics. These questions paraphrase limited
   independently checked source parts; they do not recreate whole AQA papers. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const main=JSON.parse(fs.readFileSync(path.join(root,'exam_questions.json'),'utf8')).questions;
const more=JSON.parse(fs.readFileSync(path.join(root,'paper_supplement_2016_2017.json'),'utf8')).questions;
const deck=JSON.parse(fs.readFileSync(path.join(root,'deck.json'),'utf8'));
const topics=new Map();
for(const card of deck.cards||[]){
 if(card.active===false)continue;
 if(!topics.has(card.subject))topics.set(card.subject,new Set());
 topics.get(card.subject).add(card.revisionTopic||card.topic);
}
const keys=new Set(main.map(q=>q.id));
const sourceUrls=[
 /https:\/\/filestore\.aqa\.org\.uk\/sample-papers-and-mark-schemes\/2016\/june\/AQA-74071-/i,
 /https:\/\/filestore\.aqa\.org\.uk\/sample-papers-and-mark-schemes\/2017\/june\/AQA-7404[12]-/i,
 /https:\/\/filestore\.aqa\.org\.uk\/sample-papers-and-mark-schemes\/2017\/june\/AQA-7405[123]-/i
];
const evaluator=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('))+
 app.slice(app.indexOf('function examSuggested('),app.indexOf('function renderExam(',app.indexOf('function examSuggested(')))+
 'return {examSuggested}')();
let total=0;
for(const q of more){
 assert(!keys.has(q.id),'Duplicate question ID: '+q.id);keys.add(q.id);
 assert(q.sourceVerified&&q.standalone!==false,'Only verified standalone entries: '+q.id);
 assert(q.year===2016||q.year===2017,'Historical supplement year '+q.id);
 assert(q.level==='AS'||q.level==='A-level','Qualification '+q.id);
 assert(q.subject==='Physics'||q.subject==='Chemistry','Subject '+q.id);
 assert(q.year!==2016||q.level==='AS','2016 A-level did not exist in these specifications');
 assert(q.markPoints.length===q.marks,'Correct mark totals '+q.id);
 assert(q.markPointMarks.reduce((a,b)=>a+b,0)===q.marks,'Correct mark weights '+q.id);
 assert(topics.get(q.subject)?.has(q.revisionTopic),'Recognised topic '+q.id+': '+q.revisionTopic);
 assert(sourceUrls.some(re=>re.test(q.qpUrl)),'Official question URL '+q.id);
 assert(sourceUrls.some(re=>re.test(q.msUrl)),'Official mark scheme URL '+q.id);
 assert.equal(evaluator.examSuggested(q,q.modelAnswer).suggested,q.marks,'Model answer is credited '+q.id);
 assert.equal(evaluator.examSuggested(q,'I do not know').suggested,0,'Unknown answer gets no marks '+q.id);
 total++;
}
const n=(subject,year,level)=>more.filter(q=>q.subject===subject&&q.year===year&&q.level===level).length;
assert(n('Physics',2016,'AS')>=3,'Physics AS 2016 supplement exists');
assert(n('Chemistry',2017,'AS')>=3,'Chemistry AS 2017 supplement exists');
assert(n('Chemistry',2017,'A-level')>=3,'Chemistry A-level 2017 supplement exists');
console.log('PASS '+total+' checked historical source-linked parts, correct marking and topic mapping');
