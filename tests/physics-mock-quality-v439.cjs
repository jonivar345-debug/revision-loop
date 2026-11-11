'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const cards=JSON.parse(fs.readFileSync('physics_mock_practical_recall_v439.json','utf8')).cards;
const questions=JSON.parse(fs.readFileSync('physics_mock_practical_exam_v439.json','utf8')).questions;
const deck=JSON.parse(fs.readFileSync('deck.json','utf8')).cards;
const coreQuestions=JSON.parse(fs.readFileSync('exam_questions.json','utf8')).questions;
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(cards.length,20);
assert.equal(questions.length,6);
const knownIds=new Set([...deck,...coreQuestions].map(x=>x.id));
const ids=new Set();
for(const c of cards){
 assert(c.id.startsWith('v439_phy_')&&!knownIds.has(c.id)&&!ids.has(c.id),'Unique new card ID');
 ids.add(c.id);
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.active,true);
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');
 assert.equal(c.kind,'short');assert.equal(c.strictRecall,true);
 assert(c.front.length<=140&&c.back.length<=150,'Single-fact flashcard');
 assert(Array.isArray(c.accept)&&c.accept.includes(c.back)&&c.accept.length>=2);
 assert(Array.isArray(c.reject)&&c.reject.length>=1,'Wrong-answer probes');
 assert(/^3\.1\.2$|^7\.2 RP[1-6]$/.test(c.specRef));
}
for(const q of questions){
 assert(/^v439_phy_exam_rp[1-6]$/.test(q.id)&&!ids.has(q.id)&&!knownIds.has(q.id));
 ids.add(q.id);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.mock,true);
 assert.equal(q.taught,true);assert.equal(q.standalone,true);
 assert.equal(q.marks,6);
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks);
 assert.equal(q.groupId,q.id);assert.equal(q.verificationLevel,'original-exam-style');
 assert(q.modelAnswer.length>60&&q.prompt.length>75);
 assert(/^7\.2 RP[1-6]$/.test(q.specRef));
}
for(let n=1;n<=6;n++){
 assert.equal(cards.filter(c=>c.specRef==='7.2 RP'+n).length,2);
 assert.equal(questions.filter(q=>q.specRef==='7.2 RP'+n).length,1);
}
const physicsCore=deck.filter(c=>c.subject==='Physics'&&c.mock===true&&c.active!==false);
const physicsExam=coreQuestions.filter(q=>q.subject==='Physics'&&q.mock===true);
for(const [label,pattern] of [
 ['measurements',/measurements|uncertainty/i],
 ['particles',/particle|radiation|photoelectric/i],
 ['waves',/waves|interference|diffraction|refraction/i],
 ['mechanics',/mechanics|motion|materials/i],
 ['electricity',/electricity|resistance|potential divider/i]
]){
 assert(physicsCore.some(c=>pattern.test(c.topic+' '+c.courseTopic)), 'Missing core flashcards for '+label);
 assert(physicsExam.some(q=>pattern.test(q.topic+' '+q.courseTopic)), 'Missing core exam questions for '+label);
}
assert(app.includes("'./physics_mock_practical_recall_v439.json'"));
assert(app.includes("'./physics_mock_practical_exam_v439.json'"));
assert(app.includes('V439_PHYSICS_RECALL_URL')&&app.includes('V439_PHYSICS_EXAM_URL'));
assert(app.includes('validatedV439PhysicsExam')&&app.includes('knownFlashIds.add(c.id);cards.push(c)'));
for(const [name,original] of [['EXTRA_FLASHCARD_URLS',56],['EXTRA_PRACTICE_URLS',52]]){
 const m=app.match(new RegExp('const '+name+'=\\[([^\\]]+)\\];'));
 assert(m,'Existing '+name+' manifest must exist');
 assert.equal((m[1].match(/'\\.\\//g)||[]).length,original,'Historical supplement indices must remain fixed');
}
assert(app.includes('knownFlashIds.add(c.id);cards.push(c)'));
assert(html.includes('app.js?v=430&physics=v439'));
assert(sw.includes('v439-physics-mock-practicals'));
assert(sw.includes("'./physics_mock_practical_recall_v439.json'")&&sw.includes("'./physics_mock_practical_exam_v439.json'"));
assert(app.includes('function buildMockSessionItems('));
assert(app.includes('const qAll=subjectExam(sub).filter(mockEligibleQuestion)'));
const approx=(a,b,tolerance)=>assert(Math.abs(a-b)<tolerance,'Calculated answer differs from reference');
approx(2*0.8/4,0.4,0.01);
approx(0.015*(30*0.4)**2,2.16,0.01);
approx(2e-6*Math.sin(22*Math.PI/180),7.49e-7,1e-9);
approx(1.6/0.405**2,9.75,0.02);
approx(Math.PI*(0.0005**2)/4,1.96e-7,1e-9);
approx((10*2)/(Math.PI*(0.0005**2)/4*0.0005),2.04e11,2e9);
approx(4*(Math.PI*0.0003**2/4)/1.5,1.88e-7,1e-9);
approx((1.35-1.45)/(0.3-0.1),-0.5,0.001);
console.log('PASS v439: five AS subject domains, RP1–RP6, 20 recall cards, six worked 6-mark questions, answer and loader audits.');
