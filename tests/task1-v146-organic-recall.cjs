'use strict';
const allowed=require('./task1-v154-legacy-evidence.cjs');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v146-organic-recall-audit.json','utf8'));
const all=deck.cards.filter(c=>!c.id.startsWith('task1_v150_')&&!c.id.startsWith('task1_v152_')&&!c.id.startsWith('task1_v154_')&&!c.id.startsWith('task1_v155_')&&!c.id.startsWith('task1_v156_')&&!c.id.startsWith('task1_v157_')&&!c.id.startsWith('task1_v158_')&&!c.id.startsWith('task1_v159_')&&!c.id.startsWith('task1_v160_')), added=all.filter(c=>c.id.startsWith('task1_v146_'));
const old=all.filter(c=>!c.id.startsWith('task1_v146_'));
assert(deck.deckVersion>=146);
assert.equal(all.length,3263);
assert.equal(all.filter(c=>c.active!==false).length,3259);
assert.equal(old.length,3179);
assert.equal(old.filter(c=>c.active!==false).length,3175);
assert.equal(added.length,84);
assert.equal(audit.newCards,84);
assert.equal(audit.cards.length,84);
assert.equal(audit.fullSpecCoverageCertified,false);
const ids=new Set(old.map(c=>c.id));
assert.equal(ids.size,old.length,'Earlier card IDs must remain unique');
const norm=s=>s.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g,'');
const fronts=new Set(old.filter(c=>c.active!==false).map(c=>c.subject+':'+norm(c.front)));
const counts={};let special=0;
for(let i=0;i<added.length;i++){
 const c=added[i],id='task1_v146_'+String(i+1).padStart(3,'0'),ev=audit.cards[i];
 assert.equal(c.id,id);assert(!ids.has(id));ids.add(id);
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');
 assert.equal(c.active,true);assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');
 assert.equal(c.strictRecall,true);assert.equal(c.kind,'content');
 assert(c.specRef.startsWith('3.3.'),'Not organic AQA specification '+id);
 assert(c.front.length<=145 && c.back.length<=150,'Too long '+id);
 assert(c.accept.includes(c.back),'Model answer missing from accepted aliases '+id);
 assert.equal(c.courseTopic,c.topic);assert.equal(c.revisionTopic,c.topic);
 const key=c.subject+':'+norm(c.front);
 assert(!fronts.has(key),'Duplicate front '+id);fronts.add(key);
 assert.equal(ev.id,id);assert.equal(allowed(c.id,'front',ev.front),c.front);assert.equal(allowed(c.id,'back',ev.back),c.back);
 counts[c.specRef]=(counts[c.specRef]||0)+1;
 if(ev.activity==='staged_or_cloze')special++;
}
assert.deepEqual(counts,audit.byRef);
assert(special>=30,'Insufficient staged mechanism and cloze prompts');
for(const topic of ['Organic chemistry','Organic mechanisms','Alkanes','Halogenoalkanes','Alkenes','Alcohols','Organic analysis'])
 assert(added.some(c=>c.topic===topic),'Missed lesson topic '+topic);
const app=fs.readFileSync('app.js','utf8');
const st=app.indexOf('function normalise('),en=app.indexOf('function importantTokens(');
assert(st>=0&&en>st);
const evaluate=new Function('window',app.slice(st,en)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of added)for(const answer of [c.back,...c.accept])
 assert.equal(evaluate(c,answer).status,'correct','Website grader rejects model answer '+c.id);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(k),'Progress storage key changed');
assert.equal(deck.meta.task1FlashcardAudit.v146.added,84);
assert.equal(deck.meta.task1FlashcardAudit.v146.fullSpecCoverageCertified,false);
console.log('PASS v146: 84 short organic recall cards; 3179 older records preserved; all model answers accepted; mocks/progress safe');
