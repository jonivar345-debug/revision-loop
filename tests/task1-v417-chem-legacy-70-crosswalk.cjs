'use strict';
// Editorial evidence crosswalk only. Do not assign missing live specRefs until
// per-question marking guards and Vercel preview constraints can be reviewed.
const assert=require('node:assert/strict'),fs=require('node:fs');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const ledger=json('editorial/task1-v417-chem-legacy-70-syllabus-map.json');
assert.equal(ledger.version,'v417');
assert.equal(ledger.rows.length,70);
assert.equal(ledger.counts.rows,70);
assert.equal(ledger.counts.sources,7);
assert.equal(ledger.counts.independentlyMarkedStudentAnswers,0);
assert.equal(ledger.counts.wholeChemistryMockSignedOff,false);
assert.equal(ledger.counts.linkedButNotYetRuntimeUpdated,70,'The dated v417 baseline report remains historical; v420 separately verifies its application');
const allowed=new Set([
 '3.1.1.1','3.1.1.2','3.1.1.3',
 '3.1.2.2','3.1.2.3','3.1.2.4','3.1.2.5',
 '3.1.3.1','3.1.3.2','3.1.3.3','3.1.3.4','3.1.3.5','3.1.3.6','3.1.3.7',
 '3.1.4.1','3.1.4.2','3.1.4.3','3.1.4.4'
]);
const sources=[...new Set(ledger.rows.map(r=>r.source))];
assert.equal(sources.length,7);
const expected={
 'atomic_structure_focus_v43.json':15,
 'amount_of_substance_focus_v44.json':9,
 'bonding_focus_v49.json':11,
 'bonding_weakness_focus_v52.json':12,
 'energetics_focus_v50.json':11,
 'energetics_worked_followups_v51.json':3,
 'energetics_weakness_focus_v53.json':9
};
assert.deepEqual(ledger.counts.byFile,expected);
const match=app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/);
assert(match,'Practice loader list not found');
const banks=Object.fromEntries(sources.map(file=>{
 assert(match[1].includes("'./"+file+"'"),'Mapped source not loaded '+file);
 return [file,json(file)];
}));
const hash=v=>{
 let h=2166136261,s=String(v||'');
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return (h>>>0).toString(16);
};
const selectorStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const selectorEnd=app.indexOf('function startMockSession(){',selectorStart);
assert(selectorStart>0&&selectorEnd>selectorStart);
const eligible=new Function(app.slice(selectorStart,selectorEnd)+
 '\nreturn mockEligibleQuestion;')();
const seen=new Set(),bySubject={},marksByChapter={};
let tally=0;
for(const row of ledger.rows){
 assert(!seen.has(row.id),'Repeated mapping '+row.id);
 seen.add(row.id);
 assert(allowed.has(row.primarySpecRef),'Not a listed AQA physical-chemistry subsection '+row.primarySpecRef);
 const bank=banks[row.source];
 assert(bank&&Array.isArray(bank.questions));
 const q=bank.questions.find(q=>q.id===row.id);
 assert(q,'Missing sourced task '+row.id);
 assert.equal(q.subject,'Chemistry');
 assert.equal(q.mock,true);
 assert.equal(q.standalone,true);
 assert.notEqual(q.taught,false);
 assert.equal(q.specRef,row.primarySpecRef,'v420 should now apply the source-locked AQA subsection: '+q.id);
 assert(eligible(q),'Review task no longer reaches mock '+q.id);
 assert.equal(q.marks,row.marks);
 assert.equal(hash(q.prompt),row.promptHash,'Prompt drift '+q.id);
 assert.equal(hash(q.modelAnswer),row.answerHash,'Worked answer drift '+q.id);
 assert.equal(hash(JSON.stringify({markPoints:q.markPoints,markPointMarks:q.markPointMarks,marks:q.marks})),
  row.criteriaHash,'Marking rubric drift '+q.id);
 assert(Array.isArray(q.markPoints)&&q.markPoints.length>0);
 tally+=row.marks;
 const chapter=row.primarySpecRef.split('.').slice(0,3).join('.');
 marksByChapter[chapter]=(marksByChapter[chapter]||0)+row.marks;
}
assert.equal(seen.size,70);
assert.equal(tally,445);
assert.equal(json('deck.json').cards.length,3345);
assert.equal(json('exam_questions.json').questions.length,1268);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(k));
console.log('PASS v417: '+seen.size+' original legacy supplementary Chemistry school-mock worked parts ('+
 tally+' marks) source-locked and editorially associated with exact AQA 7405 primary sections across '+sources.length+
 ' files. Chapter marks: '+JSON.stringify(marksByChapter)+
 '. v420 exact primary subsection labels applied; no student mastery/marking or whole syllabus sign-off is asserted.');
