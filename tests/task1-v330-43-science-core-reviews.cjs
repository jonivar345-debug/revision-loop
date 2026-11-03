'use strict';
// v330: exact 43 remaining hand-curated science samples from the balanced v323 core audit.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),deck=j('deck.json'),ledger=j('editorial/task1-v330-43-science-core-reviews.json');
const v323=j('editorial/task1-v323-balanced-48-topic-evidence.json');
const prior=["editorial/task1-v324-60-cross-topic-core-precision.json","editorial/task1-v326-five-compound-core-rewrites.json","editorial/task1-v327-60-more-balanced-core-answers.json","editorial/task1-v328-science-60-vetted-core.json"].map(j);
const done=new Set(prior.flatMap(x=>(x.records||x.revisions).map(y=>y.id)));
const candidates=v323.topicGroups.filter(g=>g.subject!=='Maths').flatMap(g=>
 g.reviewedSample.filter(s=>!done.has(s.id)).map(s=>({id:s.id,subject:g.subject,section:g.topic,front:s.front,back:s.back})));
assert.equal(candidates.length,43);
assert.equal(ledger.records.length,43);
assert.deepEqual(ledger.records.map(r=>r.id),candidates.map(r=>r.id),'Must cover all remaining v323 sampled science candidates exactly once');
assert.equal(new Set(ledger.records.map(r=>r.id)).size,43);
assert.equal(ledger.records.filter(x=>x.subject==='Physics').length,10);
assert.equal(ledger.records.filter(x=>x.subject==='Chemistry').length,33);
for(let i=0;i<43;i++){
 const a=candidates[i],b=ledger.records[i];
 assert.equal(a.front,b.originalFront,a.id+' front evidence');
 assert.equal(a.back,b.originalBack,a.id+' back evidence');
 assert.equal(a.section,b.section,a.id+' topic evidence');
 assert.equal(b.accept.length,1);assert.equal(b.reject.length,2);
 assert(b.accept[0]!==b.reject[0]&&b.accept[0]!==b.reject[1]);
}
assert.equal(deck.cards.length,3345);
const s=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),e=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',s);
assert(s>=0&&e>s);
const apply=new Function(app.slice(s,e)+
 '\nreturn (cards,v330)=>{applyV287LegacySpecRefs(cards);applyV288LegacyChemBondingSpecRefs(cards);applyV289LegacyEnergeticsSpecRefs(cards);applyV290LegacyElectricitySpecRefs(cards);applyV314CoreMockQuality(cards);applyV315CoreRecallCalibration(cards);applyV316CoreRecallCalibration(cards);applyV321CoreRecallCalibration(cards);applyV322CoreRecallCalibration(cards);applyV324CoreRecallCalibration(cards);applyV326CoreClarityFixes(cards);applyV327CoreRecallCalibration(cards);applyV328ScienceCoreCalibration(cards);applyV329MathsCorePrecision(cards);if(v330)applyV330ScienceCoreCalibration(cards);return cards;}')();
const before=apply(structuredClone(deck.cards),false),after=apply(structuredClone(deck.cards),true);
const a=new Map(before.map(c=>[c.id,c])),b=new Map(after.map(c=>[c.id,c]));
assert.deepEqual(before.map(c=>c.id),after.map(c=>c.id),'Do not change saved flashcard progress IDs');
const m1=app.indexOf('function normalise('),m2=app.indexOf('function importantTokens(',m1);
const evaluate=new Function('window',app.slice(m1,m2)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const filterStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),filterEnd=app.indexOf('function startMockSession(){',filterStart);
const mockEligible=new Function(app.slice(filterStart,filterEnd)+'\nreturn mockEligibleCard;')();
let models=0,accepted=0,rejected=0,negations=0,historic=0;
const changed=new Set();
for(const r of ledger.records){
 const old=a.get(r.id),c=b.get(r.id);
 assert(old&&c,'Missing source core card '+r.id);
 assert.equal(old.subject,r.subject);assert.equal(old.front,r.originalFront);assert.equal(old.back,r.originalBack);
 assert.equal(c.v330ExactReviewed,true,'Correction must pass exact ID/front/back gate '+r.id);
 assert.equal(c.front,old.front);assert.equal(c.back,old.back);
 assert.deepEqual(c.accept,[...new Set([c.back,...(old.accept||[]),...r.accept])]);
 assert.deepEqual(c.reject,[...new Set([...(old.reject||[]),...r.reject])]);
 assert(mockEligible(c),'The card must remain selectable for this school mock: '+r.id);
 assert(c.front.length<=145&&c.back.length<=215,'Keep concise school-mock prompts: '+r.id);
 assert.equal(evaluate(c,c.back).status,'correct','Model response '+r.id);models++;
 for(const good of c.accept){assert.equal(evaluate(c,good).status,'correct','Correct alternative '+r.id+' '+good);accepted++;}
 for(const bad of c.reject){assert.equal(evaluate(c,bad).status,'wrong','Incorrect misconception '+r.id+' '+bad);rejected++;}
 for(const good of r.accept){assert.equal(evaluate(c,'not '+good).status,'wrong','Negation '+r.id);negations++;}
 for(const good of old.accept||[]){assert.equal(evaluate(c,good).status,'correct','Old approved answer '+r.id+' '+good);historic++;}
 changed.add(r.id);
}
for(const c of after.filter(c=>!changed.has(c.id)))assert.deepEqual(c,a.get(c.id),'Unreviewed core card mutated: '+c.id);
const paths=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(paths.length,56);
const l1=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),l2=app.indexOf(' const added=[',l1);
const all=new Function('cards','extraFlashBanks',app.slice(l1,l2)+'\nreturn cards;')(after,paths.map(j));
assert.equal(all.length,4344);assert.equal(new Set(all.map(c=>c.id)).size,4344);
const mock=all.filter(mockEligible);assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
for(const r of ledger.records)assert(mock.some(c=>c.id===r.id),'Reviewed card not in school mock '+r.id);
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k),'Keep cloud/local progress names');
assert(app.includes(' applyV330ScienceCoreCalibration(cards);'));
assert(app.includes('||c?.v330ExactReviewed===true){'));
assert(read('sw.js').includes('-v330-43-science-core'));
console.log('PASS v330: 43 curated original science cards, 10 Physics + 33 Chemistry; '+models+' model answers, '+accepted+' approved answers, '+rejected+' rejected misconceptions, '+negations+' explicit negation tests, '+historic+' previously accepted variants retained. Full 4344 cards/3372 mock cards and progress IDs preserved.');
