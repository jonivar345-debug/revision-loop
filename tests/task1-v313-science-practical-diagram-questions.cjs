'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),bank=j('science_practical_diagram_applications_v313.json');
const core=j('deck.json'),exam=j('exam_questions.json');
const prs=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const fls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(prs.length,45);
assert.equal(prs[42],'physics_mechanics_signed_area_couples_practice_v280.json');
assert.equal(prs[43],'maths_year1_trigonometry_differentiation_practice_v292.json');
assert.equal(prs[44],'science_practical_diagram_applications_v313.json');
assert(sw.includes("'./science_practical_diagram_applications_v313.json'"));
assert.equal(bank.questions.length,8);
assert.equal(bank.version,'v313');
const base=[...exam.questions,...prs.slice(0,44).flatMap(p=>j(p).questions||[])];
const oldIds=new Set(base.map(q=>q.id));
const all=[...base,...prs.slice(44).flatMap(p=>j(p).questions||[])];
const newQ=all.filter(q=>q.id.startsWith('task1_v313_'));
assert.equal(newQ.length,8);
assert.equal(all.length,base.length+8);
assert.equal(new Set(newQ.map(q=>q.id)).size,8);
const selectorStart=app.indexOf('function mockEligibleQuestion(q){');
const selectorEnd=app.indexOf('function startMockSession(){',selectorStart);
assert(selectorStart>0&&selectorEnd>selectorStart);
const eligible=new Function(app.slice(selectorStart,selectorEnd)+'\nreturn mockEligibleQuestion;')();
const es=app.indexOf('function examSuggested(q,answer){'),ee=app.indexOf(' // v213:',es);
assert(es>0&&ee>es);
const suggest=new Function('window',app.slice(es,ee)+'\n}\nreturn examSuggested;')({});
const expected=new Set(['P003','P019','P024','P026','P043','P046','C053']);
const bySkill=new Map(),manual=[];
let marks=0,phy=0,chem=0;
for(const q of newQ){
 assert(!oldIds.has(q.id),'Never replace an existing exam-question ID');
 assert(expected.has(q.skillId),'Only the seven known partial skills');
 bySkill.set(q.skillId,(bySkill.get(q.skillId)||0)+1);
 assert(['Physics','Chemistry'].includes(q.subject));
 assert.equal(q.level,'AS');
 if(q.subject==='Physics'){phy++;assert(/^3\.4\./.test(q.specRef));}
 else {chem++;assert.equal(q.specRef,'3.1.4.2');}
 assert(q.mock===true&&q.taught===true&&q.standalone===true&&q.requiresWorking===true);
 assert(q.sourceVerified===false&&q.verificationLevel==='original-exam-style');
 assert.equal(q.manualWorkingReview,true,'No automated keyword points on multi-step responses '+q.id);
 assert(q.prompt.includes('['+q.marks+' marks]'));
 assert(q.markPoints.every(m=>m.length>=20),'Each mark criterion must state a meaningful check');
 assert(q.modelAnswer.length>150);
 assert.equal(q.markPoints.length,q.marks);
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(eligible(q),'All new tasks must be available in first school science mock');
 assert(q.groupId===q.id);
 for(const answer of [q.modelAnswer,'full correct graph shown in photograph','not '+q.modelAnswer,'']){
  const result=suggest(q,answer);
  assert.equal(result.manualRequired,true,'Manual-only review must be explicit');
  assert.equal(result.suggested,0,'Never automatically award a drawing or complete practical answer');
  assert.deepEqual(result.preds,Array(q.marks).fill(false));
  assert.deepEqual(result.scores,Array(q.marks).fill(0));
 }
 if(q.manualDiagramReview)manual.push(q.id);
 marks+=q.marks;
}
assert.equal(marks,59);
assert.equal(phy,7);assert.equal(chem,1);
assert.equal(manual.length,4,'Vector scale drawing, freefall graph, FBD and stress-strain plot must be inspected');
assert.deepEqual([...bySkill.keys()].sort(),[...expected].sort());
assert.equal(bySkill.get('P019'),2);
const near=(a,b,t=1e-8)=>Math.abs(a-b)<t;
// Independent values used in the marking criteria and model solutions.
const rx=7+5*Math.cos(Math.PI/3),ry=5*Math.sin(Math.PI/3);
assert(near(rx,9.5));assert(near(ry,4.3301270189));
assert(near(Math.hypot(rx,ry),Math.sqrt(109)));
assert(near(Math.atan2(ry,rx)*180/Math.PI,24.51,0.02));
assert(near((1.25-.20)/(.250-.040),5));
assert(near(2*.800/(.400**2),10));
assert(near(100*(.010/.800+2*.010/.400),6.25));
assert(near((2400-1800-600)/1200,0));
assert(near((2*9.8*.5-3)/2,3.4));
assert(near((300-150)*1e6/(.002-.001),1.5e11));
const d=.400e-3,A=Math.PI*d*d/4,E=12*1.5/(A*.001);
assert(near(A,1.2566370614359172e-7,1e-15));
assert(near(E/1e11,1.4323944878,.00001));
assert(near(2*(.010/.400)*100+(.02/1)*100,7));
assert(near(100*4.18*6,2508));
assert(near(-2508/1000/.05,-50.16));
assert(near(.2/6*100,3.3333333333));
const cross=j('editorial/task1-v309-science-individual-skill-crosswalk.json');
assert.equal(cross.summary.sample,65);
assert.equal(cross.summary.partial,7);
assert(cross.completion.task1Complete===false);
for(const id of expected){
 const row=cross.rows.find(r=>r.id===id);
 assert(row&&row.status==='partial','Question existence cannot certify diagram/manual mastery');
 const wanted=newQ.filter(q=>q.skillId===id).map(q=>q.id);
 assert.deepEqual(row.practiceQuestionEvidenceIds,wanted,'Crosswalk must link real exam tasks for '+id);
}
const lStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),lEnd=app.indexOf(' const added=[',lStart);
const loaded=new Function('cards','extraFlashBanks',app.slice(lStart,lEnd)+'\nreturn cards;')([...core.cards],fls.map(j));
assert.equal(loaded.length,4344,'No historical flashcards added, removed or replaced in v313');
console.log('PASS v313: 8 original exam questions, '+marks+' manually reviewed marks, seven remaining practical/diagram skills, four actual-drawing tasks, numerical results checked independently; 4344 previous flashcards unchanged, and automatic keyword grading disabled.');
