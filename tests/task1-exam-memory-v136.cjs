'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const plan=JSON.parse(fs.readFileSync('editorial/task1-v136-curated-coverage.json','utf8'));
const cards=deck.cards;
const added=cards.filter(c=>c.id.startsWith('task1_v136_'));
const old=cards.filter(c=>!c.id.startsWith('task1_v136_')&&!c.id.startsWith('task1_v138_')&&!c.id.startsWith('task1_v142_')&&!c.id.startsWith('task1_v144_')&&!c.id.startsWith('task1_v145_')&&!c.id.startsWith('task1_v146_')&&!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')&&!c.id.startsWith('task1_v155_')&&!c.id.startsWith('task1_v156_'));
assert(deck.deckVersion>=136,'v136 deck should have latest version');
assert.equal(old.length,3008,'Must retain 3,008 pre-v136 records');
assert.equal(old.filter(c=>c.active!==false).length,3004);
assert.equal(added.length,105,'Expected exactly 105 carefully curated recall cards');
assert(cards.length>=3113);
assert(cards.filter(c=>c.active!==false).length>=3109);
assert.equal(plan.total,105);
const expected={Maths:46,Physics:29,Chemistry:30};
assert.deepEqual(added.reduce((o,c)=>(o[c.subject]=(o[c.subject]||0)+1,o),{}),expected);
const normalize=s=>String(s).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const ids=new Set(),questions=new Set();
for(const c of old)questions.add(c.subject+':'+normalize(c.front));
for(const c of cards){assert(!ids.has(c.id),'Duplicate progress ID '+c.id);ids.add(c.id);}
assert(ids.has('task1_v134_014')&&ids.has('phy_vectors_001')&&ids.has('math_logs_product'),'Old review IDs must survive');
assert.equal(deck.meta.task1FlashcardAudit.v136.added,105);
assert.deepEqual(deck.meta.task1FlashcardAudit.v136.breakdown,expected);
assert.equal(plan.cards.length,added.length);
for(let i=0;i<added.length;i++){
 const c=added[i],source=plan.cards[i],expectedId='task1_v136_'+String(i+1).padStart(3,'0');
 assert.equal(c.id,expectedId,'Stable and sequential new ID');
 assert.equal(c.subject,source.subject);
 assert.equal(c.specRef,source.specRef);
 assert.equal(c.front,source.front);
 assert.equal(c.back,source.back);
 assert.equal(c.active,true);
 assert.equal(c.kind,'content');
 assert.equal(c.strictRecall,true);
 assert(c.front.length<=150&&c.back.length<=180,'Long answer belongs in exam practice '+c.id);
 assert(c.accept.includes(c.back),'Model answer must be accepted '+c.id);
 assert(c.specRef.startsWith('3.') && c.specRef.split('.').length >= 2,'Missing syllabus section '+c.id);
 assert.equal(c.courseTopic,c.topic);assert.equal(c.revisionTopic,c.topic);
 const pureMathsMock = c.subject !== 'Maths' || !['3.15','3.16','3.18','3.19'].includes(c.specRef);
 assert.equal(c.mock,c.stage==='AS'&&pureMathsMock,'Pure Year 1 mock must exclude Stats, Mechanics and A2 '+c.id);
 assert.equal(c.taught,c.stage==='AS','AS non-Pure cards can be taught but not mock-eligible');
 assert.equal(c.scope,c.mock?'mock':'full');
 const key=c.subject+':'+normalize(c.front);
 assert(!questions.has(key),'Duplicate front with live history '+c.id);
 questions.add(key);
}
const subjectRefs={
 Maths:['3.3','3.5','3.6','3.7','3.8','3.9','3.10','3.15','3.16','3.18'],
 Physics:['3.1.2','3.2.1','3.2.2','3.3.1','3.4.2','3.5.1','3.6.1','3.7.5'],
 Chemistry:['3.1.3','3.1.5','3.1.8','3.1.9','3.1.12','3.2.3','3.3.1']
};
for(const [subject,sections] of Object.entries(subjectRefs))
 for(const section of sections)
   assert(added.some(c=>c.subject===subject&&c.specRef===section),'Expected gap-coverage section '+subject+': '+section);
const app=fs.readFileSync('app.js','utf8');
const begin=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(');
assert(begin>=0&&end>begin,'Website typed-answer grader not found');
const evaluate=new Function('window',app.slice(begin,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of added){
 assert.equal(evaluate(c,c.back).status,'correct','Website rejects model answer '+c.id);
 for(const answer of c.accept)assert.equal(evaluate(c,answer).status,'correct','Website rejects own accepted answer '+c.id);
}
console.log('PASS v136: 105 Maths/Physics/Chemistry short recall cards, existing progress IDs, mock filters, grader aliases verified');
