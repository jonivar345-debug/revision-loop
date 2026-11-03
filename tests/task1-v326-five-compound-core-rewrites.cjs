'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json'),ledger=j('editorial/task1-v326-five-compound-core-rewrites.json');
assert.equal(core.cards.length,3345);assert.equal(ledger.revisions.length,5);
const a=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),b=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',a);
assert(a>0&&b>a);
const patch=new Function(app.slice(a,b)+
 '\nreturn (cs,newVersion)=>{applyV287LegacySpecRefs(cs);applyV288LegacyChemBondingSpecRefs(cs);applyV289LegacyEnergeticsSpecRefs(cs);applyV290LegacyElectricitySpecRefs(cs);applyV314CoreMockQuality(cs);applyV315CoreRecallCalibration(cs);applyV316CoreRecallCalibration(cs);applyV321CoreRecallCalibration(cs);applyV322CoreRecallCalibration(cs);applyV324CoreRecallCalibration(cs);if(newVersion)applyV326CoreClarityFixes(cs);return cs;}')();
const before=patch(structuredClone(core.cards),false),after=patch(structuredClone(core.cards),true);
assert.deepEqual(before.map(x=>x.id),after.map(x=>x.id),'Never change old progress IDs');
const orig=new Map(before.map(x=>[x.id,x])),revised=new Map(after.map(x=>[x.id,x]));
const m1=app.indexOf('function normalise('),m2=app.indexOf('function importantTokens(',m1);
const evaluate=new Function('window',app.slice(m1,m2)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const s1=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),s2=app.indexOf('function startMockSession(){',s1);
const mockEligible=new Function(app.slice(s1,s2)+'\nreturn mockEligibleCard;')();
const seen=new Set();let accepted=0,rejected=0,oldModels=0,models=0,negations=0,ordered=0;
for(const row of ledger.revisions){
 assert(!seen.has(row.id));seen.add(row.id);
 const was=orig.get(row.id),now=revised.get(row.id);
 assert(was&&now,'Original core card absent '+row.id);
 assert.equal(was.front,row.originalFront);assert.equal(was.back,row.originalBack);
 assert.equal(now.front,row.newFront,'Simplified prompt '+row.id);
 assert.equal(now.back,row.newBack,'Concise model '+row.id);
 assert.equal(now.v326ExactReviewed,true);
 assert.equal(now.strictRecall,true);
 assert(mockEligible(now),'Still first-mock eligible '+row.id);
 assert(now.front.length<=110&&now.back.length<=150,'No long disguised recall '+row.id);
 assert.deepEqual(now.accept,[...new Set([row.newBack,row.originalBack,...(was.accept||[]),...row.accept])]);
 assert.deepEqual(now.reject,[...new Set([...(was.reject||[]),...row.reject])]);
 if(row.method==='fill gaps'){
  assert.equal(now.method,'fill gaps');
  assert.deepEqual(now.clozeParts,row.clozeParts);
  assert.equal(now.clozeParts.length,4);
  const natural='down; perpendicular; along rope; opposes sliding';
  const out=evaluate(now,natural);
  assert.equal(out.status,'correct','Ordinary correctly filled gaps should be credited '+JSON.stringify(out));
  assert.equal(evaluate(now,'down; parallel; along rope; opposes sliding').status,'partial','One incorrect gap must give partial, never full credit');
  assert.notEqual(evaluate(now,'perpendicular; down; along rope; opposes sliding').status,'correct','Swapping force directions must never pass');
  assert.notEqual(evaluate(now,'down; perpendicular; along rope; opposite direction of motion').status,'correct','Friction can act in the same direction as the object moves; must test relative sliding');
  ordered++;
 }
 assert.equal(evaluate(now,now.back).status,'correct');models++;
 assert.equal(evaluate(now,row.originalBack).status,'correct','Previously correct long explanation remains valid '+row.id);oldModels++;
 for(const good of now.accept){const out=evaluate(now,good);assert.equal(out.status,'correct',row.id+' valid '+good+' '+JSON.stringify(out));accepted++;}
 for(const wrong of now.reject){const out=evaluate(now,wrong);assert.equal(out.status,'wrong',row.id+' wrong '+wrong+' '+JSON.stringify(out));rejected++;}
 for(const good of row.accept){assert.equal(evaluate(now,'not '+good).status,'wrong','Negated answer '+row.id);negations++;}
}
assert.equal(models,5);assert.equal(oldModels,5);assert.equal(ordered,1);
for(const c of after.filter(c=>!seen.has(c.id)))assert.deepEqual(c,orig.get(c.id),'Unreviewed core card changed '+c.id);
const files=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
const l1=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),l2=app.indexOf(' const added=[',l1);
const all=new Function('cards','extraFlashBanks',app.slice(l1,l2)+'\nreturn cards;')(after,files.map(j));
assert.equal(all.length,4344);assert.equal(new Set(all.map(c=>c.id)).size,all.length);
const mock=all.filter(mockEligible);assert.equal(mock.length,3372);
assert.deepEqual(Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,mock.filter(c=>c.subject===s).length])),{Physics:1125,Chemistry:1916,Maths:331});
for(const row of ledger.revisions)assert(mock.some(c=>c.id===row.id),'Corrected card missing from first mock '+row.id);
assert(app.includes(' applyV326CoreClarityFixes(cards);'));
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v326: five compound original-core prompts reduced to short single-focus or four-slot cloze recall; '+models+' new and '+oldModels+' original models, '+accepted+' correct and '+rejected+' incorrect, '+negations+' negation checks with real production marker. 4344 total, 3372 first-mock, learner progress intact.');
