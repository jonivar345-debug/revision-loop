'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json');
const audit=json('editorial/task1-v389-question-echo-false-positives.json');
assert.equal(deck.cards.length,3345);
assert.equal(new Set(deck.cards.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v389');
assert.equal(audit.counts.activeCoreMockCardsAudited,2379);
assert.equal(audit.counts.falseFullMarkQuestionEchoesBefore,39);
assert.equal(audit.rows.length,39);
assert(sw.includes('-v389-echo-guard'));
assert(app.includes('That repeats the question rather than answering it.'));
const st=app.indexOf('function normalise('),en=app.indexOf('function importantTokens(',st);
assert(st>0&&en>st);
const src=app.slice(st,en);
const guardStart=src.indexOf(' // v389: repeating the full flashcard question');
const guardEnd=src.indexOf(' if(isReversedChemistryEquation(c,input))',guardStart);
assert(guardStart>0&&guardEnd>guardStart);
const mk=script=>new Function('window',script+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:{TARGET_ID:'__none__',evaluate:()=>null}});
const current=mk(src);
const previous=mk(src.slice(0,guardStart)+src.slice(guardEnd));
const active=deck.cards.filter(c=>c.mock===true&&c.active!==false);
assert.equal(active.length,2379);
const expected=new Map(audit.rows.map(r=>[r.id,r]));
const observedBefore=new Map();
let originalGood=0,echoRejected=0,denialCorrect=0,dontKnowCorrect=0;
const k=v=>String(v||'').trim().toLowerCase().replace(/\s+/g,' ').replace(/[\s?.!]+$/g,'');
for(const c of active){
 const model=current(c,c.back),beforeModel=previous(c,c.back);
 assert.equal(model.status,'correct','Correct original model answer rejected '+c.id);
 assert.equal(beforeModel.status,'correct','Unexpected previous model failure '+c.id);
 originalGood++;
 const before=previous(c,c.front),after=current(c,c.front);
 if(before.status==='correct')observedBefore.set(c.id,before);
 const isActualAnswer=[c.back,...(Array.isArray(c.accept)?c.accept:[])].some(a=>k(a)===k(c.front));
 if(isActualAnswer)assert.equal(after.status,'correct','Genuine echo-like answer rejected '+c.id);
 else{assert.equal(after.status,'wrong','Question echo not rejected '+c.id);assert.equal(after.score,0);echoRejected++;}
 assert.notEqual(current(c,'not '+c.back).status,'correct','Negated model got full credit '+c.id);
 assert.notEqual(current(c,"I don't know").status,'correct','No-answer got full credit '+c.id);
 if(current(c,'not '+c.back).status==='correct')denialCorrect++;
 if(current(c,"I don't know").status==='correct')dontKnowCorrect++;
}
assert.equal(originalGood,2379);
assert.equal(observedBefore.size,39);
assert.equal(echoRejected,2379);
assert.equal(denialCorrect,0);
assert.equal(dontKnowCorrect,0);
assert.deepEqual([...observedBefore.keys()].sort(),[...expected.keys()].sort());
const counts={};
for(const [id,r] of observedBefore){
 const row=expected.get(id),source=active.find(c=>c.id===id);
 assert(source&&row);
 assert.equal(row.originalFront,source.front);
 assert.equal(row.originalModelAnswer,source.back);
 assert.equal(row.subject,source.subject);
 assert.equal(row.beforeStatus,'correct');
 assert.equal(row.beforeScore,r.score);
 counts[row.subject]=(counts[row.subject]||0)+1;
}
assert.deepEqual(counts,audit.counts.bySubjectBefore);
assert.deepEqual(counts,{Physics:10,Chemistry:28,Maths:1});
// An answer identical to the front must still work if the official back is
// literally that same phrase; this protects unusual yet legitimate cards.
const synthetic={id:'standalone-valid-repeat',subject:'Physics',stage:'AS',mock:true,front:'zero',back:'zero',accept:[],reject:[]};
assert.equal(current(synthetic,'zero').status,'correct');
assert.equal(current(active[0],active[0].front.replace(/\?$/,'')).status,'wrong');
const mstart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),mend=app.indexOf('function startMockSession(){',mstart);
assert(mstart>0&&mend>mstart);
const inMock=new Function(app.slice(mstart,mend)+'\nreturn mockEligibleCard;')();
const eligibility=active.filter(inMock);
assert.equal(eligibility.length,2369);
assert.equal(active.filter(c=>c.subject==='Maths'&&!inMock(c)).length,10);
assert.equal(deck.cards.filter(c=>c.subject==='Physics'&&c.stage==='A2'&&c.mock===true).length,0);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v389: 2379 original correct model answers, 2379 copied questions rejected, 39 former full-mark echoes eliminated (10 Physics, 28 Chemistry, 1 Maths); 0 negations/no-answer credit; original 3345 card IDs and 10 Year-2 Maths mock exclusions preserved.');
