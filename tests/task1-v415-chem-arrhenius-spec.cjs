'use strict';
// Chemistry 7405 rate equations: Arrhenius equation and Arrhenius plots are
// in 3.1.9.1, not a non-existent 3.1.9.3. Read-only metadata audit.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8'),json=path=>JSON.parse(read(path));
const app=read('app.js'),sw=read('sw.js');
const original=json('exam_questions.json'),deck=json('deck.json');
assert.equal(original.questions.length,1268);
assert.equal(deck.cards.length,3345);
assert(sw.includes('-v415-arrhenius-ref'),'Offline Chemistry practice must refresh');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"]){
 assert(app.includes(key),'Student history/profile key changed');
}
const candidates=[
 'gap_questions_chemistry_v48.json','atomic_structure_focus_v43.json',
 'amount_of_substance_focus_v44.json','bonding_focus_v49.json',
 'bonding_weakness_focus_v52.json','energetics_focus_v50.json',
 'energetics_worked_followups_v51.json','energetics_weakness_focus_v53.json',
 'science_practical_data_v194.json','science_mock_application_v195.json',
 'science_mock_evidence_v196.json','science_waves_energetics_v198.json',
 'chemistry_mock_precision_v199.json','chemistry_rp4_rp6_evidence_v202.json',
 'chemistry_rates_rp7_kp_v210.json','chemistry_organic_drawing_practice_v267.json',
 'chemistry_amount_applied_practice_v270.json',
 'chemistry_as_inorganic_tests_practice_v274.json',
 'chemistry_as_bonding_shapes_practice_v276.json',
 'chemistry_as_bonding_structures_practice_v277.json',
 'chemistry_amount_precision_applications_v278.json',
 'science_practical_diagram_applications_v313.json',
 'science_application_gaps_v333.json',
 'chemistry_atom_economy_sustainability_practice_v338.json'
];
const manifest=app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/);
assert(manifest,'No additional practice loader');
const questions=candidates.flatMap(path=>{
 assert(manifest[1].includes("'./"+path+"'"),'Chem source not loaded '+path);
 return (json(path).questions||[]).filter(q=>q.subject==='Chemistry'&&q.mock===true)
 .map(q=>({...q,__auditSource:path}));
});
assert.equal(questions.length,145,'Chemistry supplementary source inventory changed');
assert.equal(new Set(questions.map(q=>q.id)).size,145,'Duplicate supplementary Chemistry ID');
assert.equal(questions.filter(q=>q.specRef==='3.1.9.3').length,0,
 'Invented Arrhenius spec reference 3.1.9.3 resurfaced');
const refMustBePresent=questions.filter(q=>q.__auditSource==='chemistry_mock_precision_v199.json');
assert.equal(refMustBePresent.length,8);
assert(refMustBePresent.every(q=>q.specRef),'Newer verified bank lost its spec refs');
const q=questions.find(q=>q.id==='task1_v199_exam_07');
assert(q&&q.__auditSource==='chemistry_mock_precision_v199.json');
assert.equal(q.subject,'Chemistry');
assert.equal(q.topic,'Rate equations');
assert.equal(q.specRef,'3.1.9.1');
assert.equal(q.marks,7);
assert.equal(q.taught,true);
assert.equal(q.standalone,true);
assert(q.subtopic.includes('Arrhenius')&&q.prompt.includes('ln k'),'Not the sourced task');
const hash=value=>{
 let h=2166136261,s=String(value||'');
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16);
};
assert.equal(hash(JSON.stringify({prompt:q.prompt,modelAnswer:q.modelAnswer,
 markPoints:q.markPoints,markPointMarks:q.markPointMarks,marks:q.marks})),
 '93a7586c','Arrhenius worked question/marking criteria changed without review');
const noSpec=questions.filter(q=>!q.specRef).length;
console.log('PASS v415: all '+questions.length+' mock Chemistry supplementary items across '+
 candidates.length+' candidate sources scanned; incorrect 3.1.9.3 eliminated. '+
 'Correct AQA 3.1.9.1 Arrhenius answer/rubric locked (7 marks); '+
 noSpec+' older questions still lack section metadata and are NOT certified by this audit. '+
 '3,345 core flashcards, 1,268 original questions, offline refresh and progress keys unchanged.');
