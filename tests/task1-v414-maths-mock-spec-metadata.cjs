'use strict';
// AQA Mathematics 7357: exact Year 1 Pure specification section labels.
// Metadata-only correction for previously unmapped/mislabelled exam practice.
const assert=require('node:assert/strict'),fs=require('node:fs');
const json=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const beforeKeys=["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"];
beforeKeys.forEach(s=>assert(app.includes(s),'Saved user progress key changed'));
const official={
 'Proof':'3.2','Algebra and functions':'3.3','Transformations':'3.3',
 'Coordinate geometry':'3.4','Sequences and series':'3.5',
 'Sequences & series':'3.5','Trigonometry':'3.6',
 'Exponentials and logarithms':'3.7','Differentiation':'3.8',
 'Integration':'3.9','Vectors':'3.11'
};
const files=[
 'gap_questions_maths_v48.json','maths_pure_proof_vectors_v190.json',
 'maths_as_pure_gap_challenges_v191.json',
 'maths_pure_proof_vector_applications_v209.json',
 'maths_year1_pure_reasoning_v271.json',
 'maths_as_graph_transform_sketches_v272.json',
 'maths_year1_circle_vector_gaps_v273.json',
 'maths_year1_trigonometry_differentiation_practice_v292.json',
 'maths_inequality_sign_reasoning_v335.json',
 'maths_year1_pure_targeted_practice_v340.json'
];
const manifest=app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/);
assert(manifest);
for(const file of files)assert(manifest[1].includes("'./"+file+"'"),'Source no longer loads: '+file);
const every=files.flatMap(file=>(json(file).questions||[])
 .filter(q=>q.subject==='Maths'&&q.mock===true&&q.standalone!==false).map(q=>({...q,__file:file})));
assert.equal(every.length,42,'The current ten-bank first-mock Maths practice cohort changed');
assert.equal(new Set(every.map(q=>q.id)).size,every.length,'Duplicate Maths IDs');
const invalid=every.filter(q=>official[q.topic]!==q.specRef);
assert.deepEqual(invalid.map(q=>q.id),[],
 'Wrong AQA 7357 section or missing reference: '+JSON.stringify(invalid.map(q=>({id:q.id,topic:q.topic,specRef:q.specRef,expected:official[q.topic]}))));
const expected={
 'task1_v190_maths_001':['3.2','84c5f809',4],
 'task1_v190_maths_002':['3.2','daf7e848',4],
 'task1_v190_maths_003':['3.11','5c5fcba5',5],
 'task1_v190_maths_004':['3.11','51d7fec7',6],
 'task1_v209_maths_003':['3.11','ac4be3a5',8],
 'task1_v209_maths_004':['3.11','9a458b20',8],
 'task1_v340_maths_01':['3.7','f3fafa2',8],
 'task1_v340_maths_02':['3.6','54331057',8],
 'task1_v340_maths_03':['3.8','4e8ddf98',7]
};
const hash=v=>{
 let h=2166136261,s=String(v||'');
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16);
};
let repaired=0,totalMarks=0;
for(const [id,[ref,fingerprint,marks]] of Object.entries(expected)){
 const q=every.find(x=>x.id===id);
 assert(q,'Missing audited Maths exam practice '+id);
 assert.equal(q.specRef,ref,id+' specRef');
 assert.equal(q.marks,marks,id+' marks');
 assert.equal(hash(JSON.stringify({prompt:q.prompt,modelAnswer:q.modelAnswer,
  markPoints:q.markPoints,markPointMarks:q.markPointMarks,marks:q.marks})),
  fingerprint,'Unreviewed question/mark-scheme mutation '+id);
 assert(q.mock===true&&q.taught!==false&&q.level==='AS','Out-of-scope question '+id);
 repaired++;totalMarks+=marks;
}
const selectorStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const selectorEnd=app.indexOf('function startMockSession(){',selectorStart);
assert(selectorStart>0&&selectorEnd>selectorStart);
const eligible=new Function(app.slice(selectorStart,selectorEnd)+
 '\nreturn mockEligibleQuestion;')();
for(const q of every)assert(eligible(q),'Corrected question escaped Year 1 mock: '+q.id);
const bank=json('exam_questions.json'),deck=json('deck.json');
assert.equal(bank.questions.length,1268);
assert.equal(deck.cards.length,3345);
console.log('PASS v414: '+every.length+' loaded Maths original practice questions across '+
 files.length+' supplement banks map to the official AQA 7357 section numbers; '+
 repaired+' corrected/missing references covering '+totalMarks+' marks source-locked to unchanged prompts, answers and criteria. 1,268 core questions, 3,345 cards, scope and progress keys retained.');
