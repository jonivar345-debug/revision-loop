'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const deck=load('deck.json');
const historic=load('editorial/task1-v166-legacy-mock-card-map.json');
const review=load('editorial/task1-v216-a2-chemistry-194-answer-scope-review.json');
const exam=load('exam_questions.json');
const app=fs.readFileSync('app.js','utf8');
assert.equal(review.version,'v216');
assert.equal(review.task1Complete,false);
assert.equal(review.fullAqaSpecificationCertified,false);
assert.equal(review.allModelAnswersExaminerCertified,false);
assert.equal(deck.cards.length,3345,'Original core deck changed');
assert.equal(exam.questions.length,1268,'Original core exam bank changed');
const legacy=historic.records.filter(r=>r.subject==='Chemistry'&&r.stage==='A2');
const byId=new Map(deck.cards.map(c=>[c.id,c]));
assert.equal(legacy.length,194);
assert.equal(review.records.length,194);
assert.equal(new Set(review.records.map(r=>r.id)).size,194);
assert.deepEqual(
 new Set(review.records.map(r=>r.id)),
 new Set(legacy.map(r=>r.id)),
 'Individual audit does not match historical 194-card cohort'
);
const allowedTopics={
 'Acids and bases':'3.1.12.2–4',
 'Acyl chlorides':'3.3.9.2',
 'Aldehydes and ketones':'3.3.8',
 'Arrhenius':'3.1.9.1',
 'Born–Haber cycles':'3.1.8.1',
 'Carboxylic acids':'3.3.9.1',
 'Entropy':'3.1.8.2',
 'Esters':'3.3.9.1',
 'Gibbs free energy':'3.1.8.2',
 'Kp':'3.1.10',
 'Kw':'3.1.12.3',
 'Optical isomerism':'3.3.7',
 'Rate equations':'3.1.9.1–2',
 'Weak acids':'3.1.12.4'
};
let actual={};const flagged=[];
for(const row of review.records){
 const c=byId.get(row.id);
 assert(c,'Missing legacy A2 card '+row.id);
 assert.equal(c.subject,'Chemistry');
 assert.equal(c.stage,'A2');
 assert(c.mock===true&&c.taught===true&&c.active!==false,'Incorrect mock eligibility '+row.id);
 assert(c.front.trim().length>0&&c.back.trim().length>0,'Blank recall text '+row.id);
 assert.equal(row.front,c.front,'Question has drifted since audit '+row.id);
 assert.equal(row.back,c.back,'Answer has drifted since audit '+row.id);
 assert.equal(row.topic,c.topic,'Topic drift '+row.id);
 assert.equal(row.assessment,'taught-content-scope-reviewed');
 assert(allowedTopics[c.topic],'Unknown A2 topic '+c.topic);
 const expected=row.id==='chem_cip'?'3.3.1.3':allowedTopics[c.topic];
 assert.equal(row.aqaSection,expected,'Wrong AQA topic-to-section map '+row.id);
 actual[row.topic]=(actual[row.topic]||0)+1;
 if(row.issueType)flagged.push(row.id);
 const content=row.front+' '+row.back;
 assert(!/\b(?:buffer solutions?|nmr|chromatography|electrode potentials?|cisplatin)\b/i.test(content),
  'Unexpected advanced excluded subject in historical mock set: '+row.id);
}
assert.deepEqual(actual,review.countsByTopic);
assert.equal(Object.keys(actual).length,14);
assert.deepEqual(flagged.sort(),[
 'chem_arrhenius_001','chem_cip','chem_kp_recap_20261024_pressure_position'
].sort());
assert.equal(review.counts.legacyChemistryA2,194);
assert.equal(review.counts.rowsReviewed,194);
assert.equal(review.counts.withinTaughtMockScope,194);
assert.equal(review.counts.unequivocalOutOfScope,0);
assert.equal(review.counts.reviewNotes,3);
assert.equal(review.counts.coreDeckChanged,0);
assert.equal(review.counts.coreQuestionsChanged,0);
assert.equal(review.records.find(x=>x.id==='chem_cip').aqaSection,'3.3.1.3');
assert(review.records.find(x=>x.id==='chem_kp_recap_20261024_pressure_position').reviewNote.includes('equal'));
assert(byId.get('task1_chem_056')?.back?.includes('equal numbers of gas molecules'),
 'Existing equal-gas-moles exception has disappeared');
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
console.log('PASS v216: 194 individual taught-scope and answer-text records verified, 14 official AQA topic mappings, 3 qualified review findings; core bank and saved-state keys preserved');
