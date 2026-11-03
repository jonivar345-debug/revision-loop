'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),deck=j('deck.json'),ledger=j('editorial/task1-v331-65-original-core-reviews.json');
const records=ledger.records;
assert.equal(deck.cards.length,3345);
assert.equal(records.length,65);
assert.equal(records.filter(x=>x.subject==='Physics').length,30);
assert.equal(records.filter(x=>x.subject==='Chemistry').length,35);
assert.equal(new Set(records.map(x=>x.id)).size,65,'Unique individual original core card IDs');
const s=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),e=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',s);
assert(s>=0&&e>s,'Exact ID runtime core patch section exists');
const patch=new Function(app.slice(s,e)+
 '\nreturn (cards,applyV331)=>{applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);applyV321CoreRecallCalibration(cards);applyV322CoreRecallCalibration(cards);applyV324CoreRecallCalibration(cards);applyV326CoreClarityFixes(cards);applyV327CoreRecallCalibration(cards);applyV328ScienceCoreCalibration(cards);applyV329MathsCorePrecision(cards);applyV330ScienceCoreCalibration(cards);if(applyV331)applyV331CoreAnswerCalibration(cards);return cards;}')();
const before=patch(structuredClone(deck.cards),false),after=patch(structuredClone(deck.cards),true);
const old=new Map(before.map(c=>[c.id,c])),now=new Map(after.map(c=>[c.id,c]));
assert.deepEqual(before.map(c=>c.id),after.map(c=>c.id),'Keep all existing progress IDs');
const m1=app.indexOf('function normalise('),m2=app.indexOf('function importantTokens(',m1);
assert(m1>=0&&m2>m1);
const mark=new Function('window',app.slice(m1,m2)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const q1=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),q2=app.indexOf('function startMockSession(){',q1);
const eligible=new Function(app.slice(q1,q2)+'\nreturn mockEligibleCard;')();
let models=0,accepted=0,rejected=0,negation=0,oldCorrect=0;const reviewed=new Set();
for(const row of records){
 const c=now.get(row.id),o=old.get(row.id);
 assert(c&&o,'Original core ID absent '+row.id);
 assert.equal(c.subject,row.subject,row.id+' subject must match');
 assert.equal(o.front,row.originalFront,row.id+' original front');
 assert.equal(o.back,row.originalBack,row.id+' original back');
 assert.equal(c.front,o.front,row.id+' do not alter prompt');
 assert.equal(c.back,o.back,row.id+' do not alter model');
 assert.equal(c.v331ExactReviewed,true,row.id+' review must actually apply after legacy patches');
 assert(eligible(c),row.id+' remains in correct mock');
 assert(c.front.length<=145&&c.back.length<=215,row.id+' avoid disguised long-answer recall');
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,2);
 assert.deepEqual(c.accept,[...new Set([c.back,...(o.accept||[]),...row.accept])]);
 assert.deepEqual(c.reject,[...new Set([...(o.reject||[]),...row.reject])]);
 assert.equal(mark(c,c.back).status,'correct','Model must mark correct '+row.id);models++;
 for(const good of c.accept){const out=mark(c,good);assert.equal(out.status,'correct','Valid variant '+row.id+' '+good+' '+JSON.stringify(out));accepted++;}
 for(const bad of c.reject){const out=mark(c,bad);assert.equal(out.status,'wrong','Wrong misconception '+row.id+' '+bad+' '+JSON.stringify(out));rejected++;}
 for(const good of row.accept){assert.equal(mark(c,'not '+good).status,'wrong','Do not award negated answers '+row.id);negation++;}
 for(const good of o.accept||[]){assert.equal(mark(c,good).status,'correct','Keep old valid answers '+row.id);oldCorrect++;}
 reviewed.add(row.id);
}
for(const c of after.filter(c=>!reviewed.has(c.id)))assert.deepEqual(c,old.get(c.id),'Unreviewed original core must not change '+c.id);
const paths=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(paths.length,56,'Do not alter supplement bank list');
const l1=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),l2=app.indexOf(' const added=[',l1);
const all=new Function('cards','extraFlashBanks',app.slice(l1,l2)+'\nreturn cards;')(after,paths.map(j));
assert.equal(all.length,4344);assert.equal(new Set(all.map(x=>x.id)).size,4344,'All cards have unique progress IDs');
const mock=all.filter(eligible);
assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(subject=>[subject,mock.filter(c=>c.subject===subject).length])),{Physics:1125,Chemistry:1916,Maths:331});
for(const r of records)assert(mock.some(c=>c.id===r.id),'Reviewed card omitted from school mock '+r.id);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key),'Existing local/cloud progress preserved');
assert(app.includes(' applyV331CoreAnswerCalibration(cards);'),'Runtime patch wired in mock bank loader');
assert(app.includes('||c?.v331ExactReviewed===true'),'Correct/incorrect exact reviewer marking remains wired when later versions are appended');
assert(read('sw.js').includes('-v331-65-core-review'),'New versions must update offline application cache');
console.log('PASS v331: '+records.length+' exact reviewed original core flashcards (30 Physics, 35 Chemistry), '+models+' model answers, '+accepted+' approved, '+rejected+' rejected, '+negation+' negations, '+oldCorrect+' old accepted responses retained. 4344 total / 3372 mock; progress keys and 56 supplemental banks unchanged.');
