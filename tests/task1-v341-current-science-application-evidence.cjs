'use strict';
// Reconcile two historical selected application audits with current loaded practice.
// This proves availability and manual-review requirements, not student mastery.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const audit=j('editorial/task1-v341-current-science-application-evidence.json');
const historicalChem=j(audit.sources.amount);
const historicalPhy=j(audit.sources.physics);
const app=read('app.js');
assert.equal(audit.version,'v341');
assert.equal(historicalChem.rows.length,31);
assert.equal(historicalChem.rows.filter(r=>r.reviewStatus==='short_evidence_plus_exam_work_required').length,17);
assert.equal(historicalPhy.rows.length,9);
assert.equal(audit.chemistryAmount.length,17);
assert.equal(audit.physicsSelected.length,9);
const urls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(urls.length>=49,'The existing 49 practice banks must be retained');
assert.equal(urls[47],'chemistry_atom_economy_sustainability_practice_v338.json');
assert.equal(urls[48],'maths_year1_pure_targeted_practice_v340.json');
const banks=new Map(urls.map(p=>[p,j(p).questions||[]]));
const start=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),end=app.indexOf('function startMockSession(){',start);
assert(start>=0&&end>start);
const eligible=new Function(app.slice(start,end)+'\nreturn mockEligibleQuestion;')();
const found=new Set();let links=0,physicsManual=0;
function checkLink(e,subject,skill){
 assert(urls.includes(e.path),'Bank not loaded for '+skill+': '+e.path);
 const q=banks.get(e.path).find(q=>q.id===e.id);
 assert(q,'Missing linked question '+e.id);
 assert.equal(q.subject,subject,'Wrong subject '+e.id);
 assert.equal(q.mock,true,'Missing mock flag '+e.id);
 assert(eligible(q),'Excluded from actual school mock '+e.id);
 assert(Number.isInteger(q.marks)&&q.marks>=4,'Not a full exam question '+e.id);
 assert(typeof q.modelAnswer==='string'&&q.modelAnswer.length>0,'Missing model answer '+e.id);
 if(subject==='Physics'){
  assert(q.manualDiagramReview===true||q.manualWorkingReview===true,'Physics linked application must be manually checked '+e.id);
  physicsManual++;
 }
 links++;found.add(e.id);return q;
}
const oldById=new Map(historicalChem.rows.map(r=>[r.id,r]));
let newAosLinks=0;
for(const row of audit.chemistryAmount){
 const old=oldById.get(row.id);
 assert(old&&old.reviewStatus==='short_evidence_plus_exam_work_required','Not a historic application '+row.id);
 assert.equal(old.specRef,row.specRef);assert.equal(old.skill,row.skill);
 assert(row.linkedCurrentExamPractice.length>0,'Still missing practice '+row.id);
 assert.equal(row.independentlyStudentWorkMarked,false,'No actual student work examined');
 for(const e of row.linkedCurrentExamPractice){const q=checkLink(e,'Chemistry',row.id);
  if(row.id==='AOS-27'){
   assert.equal(e.id,'task1_v338_chem_amount_01');
   assert.equal(e.path,'chemistry_atom_economy_sustainability_practice_v338.json');
   assert(q.manualWorkingReview===true,'Full sustainability answer must remain manual');
   assert(q.markPoints.some(x=>/economic/i.test(x))&&q.markPoints.some(x=>/environmental/i.test(x))&&q.markPoints.some(x=>/ethical/i.test(x)));
   newAosLinks++;
  }else assert(old.linkedExamPractice.some(x=>x.path===e.path&&x.id===e.id),'Old AOS practice link changed '+row.id);
 }
}
assert.equal(newAosLinks,1);
const oldPhy=new Map(historicalPhy.rows.map(r=>[r.crosswalk+':'+r.requirementNumber,r]));
let linkedPhy=0,missingPhy=0;
for(const row of audit.physicsSelected){
 const old=oldPhy.get(row.sourceCrosswalk+':'+row.sourceRequirement);
 assert(old,'Not a historical Physics gap '+row.skill);
 assert.equal(old.specRef,row.specRef);assert.equal(old.skill,row.skill);
 assert.equal(row.independentlyStudentWorkMarked,false);
 if(row.linkedCurrentExamPractice.length){
  linkedPhy++;for(const e of row.linkedCurrentExamPractice)checkLink(e,'Physics',row.skill);
 }else{
  missingPhy++;assert.equal(row.reviewStatus,'no_manually_verified_link_in_this_focused_audit');
 }
}
assert.equal(linkedPhy,6);assert.equal(missingPhy,3);
assert.deepEqual(audit.nextPriorityPhysics.map(x=>x.sourceRequirement),[6,44,48]);
assert.equal(audit.counts.chemistryAmountRowsWithLinkedExamPractice,17);
assert.equal(audit.counts.physicsRowsWithRepresentativeManualPractice,6);
assert.equal(audit.counts.physicsRowsStillWithoutVerifiedLinkedFullExamPractice,3);
assert(physicsManual>=6);
const q=j('chemistry_atom_economy_sustainability_practice_v338.json').questions[0];
const mstart=app.indexOf('function examSuggested(q,answer){'),mend=app.indexOf(' // v213:',mstart);
assert(mstart>=0&&mend>mstart);
const suggested=new Function('window',app.slice(mstart,mend)+'\n}\nreturn examSuggested;')({});
for(const ans of ['',q.modelAnswer,'economic, ethical and environmental benefits']){
 const s=suggested(q,ans);
 assert.equal(s.manualRequired,true);
 assert.equal(s.suggested,0);
 assert.deepEqual(s.preds,Array(q.marks).fill(false));
}
assert.equal(j('deck.json').cards.length,3345,'Do not change original flashcards');
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k),'Saved progress key changed');
console.log('PASS v341: 17/17 selected Chemistry Amount application skills linked to mock exam practice, 6/9 selected Physics gaps have verified manual practice, 3 still explicitly without verified links; '+links+' exact references ('+found.size+' distinct questions), all original cards and progress keys preserved. Manual student marking remains required.');
