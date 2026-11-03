'use strict';
// Diagnostic only: candidates need human content review before rewriting any flashcard.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json');
assert.equal(core.cards.length,3345);
const pStart=app.indexOf('const V287_LEGACY_SPEC_GROUPS='),pEnd=app.indexOf('// v217: Fix three previously audited legacy Chemistry cards in memory.',pStart);
const patch=new Function(app.slice(pStart,pEnd)+
 '\nreturn cs=>{applyV287LegacySpecRefs(cs);applyV288LegacyChemBondingSpecRefs(cs);applyV289LegacyEnergeticsSpecRefs(cs);applyV290LegacyElectricitySpecRefs(cs);applyV314CoreMockQuality(cs);applyV315CoreRecallCalibration(cs);applyV316CoreRecallCalibration(cs);applyV321CoreRecallCalibration(cs);applyV322CoreRecallCalibration(cs);applyV324CoreRecallCalibration(cs);return cs;}')();
const initialIds=core.cards.map(c=>c.id),cards=patch(structuredClone(core.cards));
assert.deepEqual(cards.map(c=>c.id),initialIds);
const idx=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(z=>z[1]);
assert.equal(idx.length,56);
const lStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),lEnd=app.indexOf(' const added=[',lStart);
const all=new Function('cards','extraFlashBanks',app.slice(lStart,lEnd)+'\nreturn cards;')(cards,idx.map(j));
assert.equal(all.length,4344);
const sStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),sEnd=app.indexOf('function startMockSession(){',sStart);
const eligible=new Function(app.slice(sStart,sEnd)+'\nreturn mockEligibleCard;')();
const originalIds=new Set(initialIds);
const mock=all.filter(eligible),legacy=mock.filter(c=>originalIds.has(c.id));
assert.equal(mock.length,3372);assert.equal(legacy.length,2373);
const issues=[],counts={};
for(const c of legacy){
 const front=String(c.front||''),back=String(c.back||'');
 const reasons=[];
 if((front.match(/\?/g)||[]).length>=2)reasons.push('two_or_more_questions');
 if(/\band\s+(?:what|how|why|which|where|when)\b/i.test(front))reasons.push('and_second_question');
 if(/\b(?:state|give|describe|explain|calculate|find|identify)\b.{1,85}\b(?:and|then)\b.{0,60}\b(?:state|give|describe|explain|calculate|find|identify)\b/i.test(front))reasons.push('two_independent_commands');
 if(front.length>115)reasons.push('long_prompt');
 if(back.length>160)reasons.push('long_answer');
 if((back.match(/[;。]/g)||[]).length>=2&&back.length>105)reasons.push('multi_clause_answer');
 if(/\b(?:explain|describe)\b/i.test(front)&&back.length>120&&/\b(?:because|therefore|then|which)\b/i.test(back))reasons.push('reasoning_disguised_as_recall');
 if((back.match(/\n/g)||[]).length>=2)reasons.push('multiple_answer_lines');
 if(reasons.length){
  counts[c.subject]??={total:0,reasons:{}};
  counts[c.subject].total++;
  for(const reason of reasons)counts[c.subject].reasons[reason]=(counts[c.subject].reasons[reason]||0)+1;
  issues.push({id:c.id,subject:c.subject,topic:c.topic||c.revisionTopic||'',front,back,accept:c.accept?.length||0,reject:c.reject?.length||0,reasons,weight:reasons.length*4+Math.ceil(back.length/75)});
 }
}
issues.sort((a,b)=>b.weight-a.weight||a.id.localeCompare(b.id));
const bySubject=Object.fromEntries(['Physics','Chemistry','Maths'].map(s=>[s,issues.filter(x=>x.subject===s).slice(0,30)]));
const report={version:'v325',date:'2026-11-03',coreMock:legacy.length,allMock:mock.length,subjects:counts,candidateCount:issues.length,
 ranked:bySubject,notes:['This flags potential one-card/multiple-skill or lengthy-response issues, not automatic factual errors.','Do not rewrite long answers when a concise applied calculation or two-step relationship is pedagogically useful.','Review original model, marking and prompt independently before any change.','All original ID/progress and mock selection constraints remain unchanged.']};
console.log('V325_CORE_CARD_READABILITY_BEGIN');
console.log(JSON.stringify(report));
console.log('V325_CORE_CARD_READABILITY_END');
assert.equal(legacy.length,2373);
for(const s of ['Physics','Chemistry','Maths'])assert(bySubject[s].length>=1,'Expected at least one candidate '+s);
console.log('PASS v325: independently scored '+legacy.length+' first-mock original core card prompts/answers for multi-skill and long-response editorial candidates. '+issues.length+' provisional candidates; no automatic edits or false full-AQA certification.');
