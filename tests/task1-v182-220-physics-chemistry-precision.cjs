'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const audit=JSON.parse(fs.readFileSync('editorial/task1-v182-220-physics-chemistry-precision.json','utf8'));
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const ledger=JSON.parse(fs.readFileSync('editorial/task1-v166-legacy-mock-card-map.json','utf8'));
const previous=[
'task1-v176-mechanics-manual-spec-audit','task1-v177-chemistry-legacy-tests-definitions',
'task1-v178-chemistry-core-definitions','task1-v179-chemistry-organic-physical-audit',
'task1-v180-born-haber-gibbs-short-recall','task1-v181-science-210-legacy-answer-audit'
].map(f=>JSON.parse(fs.readFileSync('editorial/'+f+'.json','utf8')));
const expected=require('./task1-v154-legacy-evidence.cjs'),app=fs.readFileSync('app.js','utf8');
assert.equal(audit.version,'v182');assert.equal(audit.reviewed.length,220);assert.equal(audit.corrections.length,22);
assert.deepEqual([audit.baseline.totalReviewed,audit.baseline.remainingScience,audit.baseline.remainingChemistry,audit.baseline.remainingPhysics],[713,258,192,66]);
assert.deepEqual([deck.cards.length,deck.cards.filter(c=>c.active!==false).length,deck.cards.filter(c=>c.active!==false&&c.mock===true).length],[3345,3341,2379]);
const byId=new Map(deck.cards.map(c=>[c.id,c])),old=new Set(ledger.records.map(x=>x.id)),prior=new Set(previous.flatMap(x=>x.reviewed.map(y=>y.id)));
assert.equal(new Set(audit.reviewed.map(x=>x.id)).size,220);
assert.equal(audit.reviewed.filter(x=>x.subject==='Chemistry').length,120);assert.equal(audit.reviewed.filter(x=>x.subject==='Physics').length,100);
for(const row of audit.reviewed){
 const c=byId.get(row.id);assert(c&&c.mock===true&&c.active!==false,'Missing active mock '+row.id);
 assert(old.has(row.id)&&!prior.has(row.id),'Invalid or repeated legacy candidate '+row.id);
 assert.equal(c.subject,row.subject);assert.equal(c.front,row.front);assert.equal(c.back,row.back);
 assert(row.section.startsWith('3.'),'Missing AQA topic candidate '+row.id);
}
const i=app.indexOf('function normalise('),j=app.indexOf('function importantTokens(');
assert(i>=0&&j>i);
const evaluate=new Function('window',app.slice(i,j)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const row of audit.reviewed){
 const c=byId.get(row.id);assert.equal(evaluate(c,c.back).status,'correct','Model answer rejected '+c.id);
}
for(const correction of audit.corrections){
 const c=byId.get(correction.id);
 assert.equal(expected(c.id,'front',correction.previousFront),correction.newFront);
 assert.equal(expected(c.id,'back',correction.previousBack),correction.newBack);
 assert(c.accept&&c.accept.length>=3,'Missing concise accepted alternatives '+c.id);
 for(const answer of c.accept)assert.equal(evaluate(c,answer).status,'correct','Incorrectly rejected accepted phrasing '+c.id+' '+answer);
}
for(const [id,bad] of [
 ['chem_config_weak_v45_01','[Ar]3d4 4s2'],
 ['chem_config_weak_v45_02','[Ar]3d9 4s2'],
 ['chem_config_weak_v45_05','Cu'],
 ['phy_pandr_v29_sketch_beta_minus','W+'],
 ['phy_pandr_v29_sketch_beta_plus','W-'],
 ['phy_pandr_v29_sketch_annihilation','1 photon'],
 ['phy_pandr_v29_sketch_pair','0.511 MeV']
])assert.equal(evaluate(byId.get(id),bad).status,'wrong','Wrong fact must not receive credit: '+id);
assert.equal(audit.notCertified.fullAqaSpec,true);
assert.equal(audit.preserved.originalPracticeQuestionBank,true);
console.log('PASS v182: 220 more mock science flashcards reviewed; 22 precision corrections, correct alternatives accepted, false configurations and particle answers rejected');
