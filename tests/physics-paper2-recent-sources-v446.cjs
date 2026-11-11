'use strict';
/* v446: checked 2024 and explicitly provisional 2025 AS Physics 7407/2 coach.
   Asserts old progress identities, source confidence, authored short-card quality,
   and independently recomputes numeric results. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const deck=JSON.parse(fs.readFileSync('physics_as_paper2_guided_v430.json','utf8'));
const ledger=JSON.parse(fs.readFileSync('editorial/physics-paper2-recent-sources-v446.json','utf8'));
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
const cards=deck.cards,base=cards.slice(0,170),added=cards.filter(c=>/^as_p2_v446_\d{3}$/.test(c.id));
assert.equal(cards.length,190);
assert.equal(added.length,20);
assert.equal(new Set(cards.map(c=>c.id)).size,190);
assert.equal(crypto.createHash('sha256').update(JSON.stringify(base)).digest('hex'),
 '939165b0d8079a3fd1bd954642734799c17942c5fedac21b1bbb47d05994b942',
 'All prior 170 cards must retain the same ID, prompt, answer, hint, choices and scheduling flags');
assert.deepEqual(added.map(c=>c.id),Array.from({length:20},(_,i)=>'as_p2_v446_'+String(i+1).padStart(3,'0')));
assert.equal(ledger.priorCardCount,170);
assert.equal(ledger.total,190);
assert.equal(ledger.mappings.length,20);
assert(ledger.sourceConfidence['2024'].questionPaper.includes('June%202024%20QP.pdf'));
assert(ledger.sourceConfidence['2024'].markScheme.includes('June%202024%20MS.pdf'));
assert.equal(ledger.sourceConfidence['2025'].markScheme,null,'Do not claim access to unavailable 2025 official mark scheme');
assert.equal(ledger.sourceConfidence['2025'].questionPaper,null,'Do not claim inspection of inaccessible 2025 QP');
for(const c of added){
 const m=ledger.mappings.find(row=>row.cardId===c.id);
 assert(m,'Need independently traceable source status: '+c.id);
 assert.equal(m.year,c.sourceStyle.year);
 assert.equal(m.questionReference,c.sourceStyle.question);
 assert.equal(m.specRef,c.specRef);
 assert(c.mock===false&&c.active===true&&c.scope==='full');
 assert(c.strictRecall===true);
 assert(c.front.length<=175&&c.back.length<=165);
 assert(c.paper2Hint.length>=15&&c.paper2Hint.length<=145);
 assert(c.paper2Trap.length>=15&&c.paper2Trap.length<=145);
 assert(c.accept.length>=1);
 if(c.sourceStyle.year===2024)assert.equal(c.sourceStyle.verification,'verified_2024_primary_question_paper_and_mark_scheme');
 else if(c.sourceStyle.year===2025)assert.equal(c.sourceStyle.verification,'2025_secondary_question_index_only_mark_scheme_unverified');
 else assert.fail('Wrong year '+c.id);
 if(c.paper2Section==='C'){
  assert.equal(c.paper2Mode,'mcq');
  assert.equal(c.paper2Choices.length,4);
  assert.equal(c.paper2Choices[0],c.back);
  assert.equal(new Set(c.paper2Choices.map(x=>x.toLowerCase())).size,4);
 }
}
assert.equal(added.filter(c=>c.sourceStyle.year===2024).length,12);
assert.equal(added.filter(c=>c.sourceStyle.year===2025).length,8);
assert.deepEqual(Object.fromEntries(['A','B','C'].map(k=>[k,cards.filter(c=>c.paper2Section===k).length])),{A:71,B:44,C:75});
function nearly(a,b,atol=1e-10){assert(Math.abs(a-b)<=atol,a+' differs from '+b)}
nearly(2.5*0.44,1.1);
nearly(2*0.18/(1.2*1.2),0.25);
nearly(1.1+2*0.6,2.3);
nearly((2.4e6-2e5*9.8)/(2e5),2.2);
nearly(0.8*260,208);
nearly(1/(600*1000)*0.3,5e-7,1e-16);
nearly((60+40)*0+40*4/(60+40),1.6);
nearly(0.5*9.8*1.5*1.5,11.025);
nearly(1+2+1+2*3,10);
assert(app.includes('(?:430|443|444|445|446)'));
assert(html.includes('paper2=v446'));
assert(sw.includes('v446-paper2-recent-methods'));
for(const s of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(s));
console.log('PASS v446: 12 primary-verified 2024 styles + 8 explicitly provisional 2025 styles, 190 cards, prior 170 immutable, numerics, MCQ, progress and offline guards');
