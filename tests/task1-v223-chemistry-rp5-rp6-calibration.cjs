'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8')),read=p=>fs.readFileSync(p,'utf8');
const source=json('chemistry_rp4_rp6_evidence_v202.json'),report=json('editorial/task1-v223-chemistry-rp5-rp6-calibration-audit.json');
const deck=json('deck.json'),core=json('exam_questions.json');
const app=read('app.js'),sw=read('sw.js'),html=read('index.html');
assert.equal(report.version,'v223');assert.equal(report.safeguards.task1Complete,false);
assert.equal(source.questions.length,9);assert.equal(deck.cards.length,3345);assert.equal(core.questions.length,1268);
assert(sw.includes('v223-chemistry-marking'));assert(html.includes('app.js?v=203'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
assert(app.includes("'./chemistry_rp4_rp6_evidence_v202.json'"));
const byId=Object.fromEntries(source.questions.map(q=>[q.id,q]));
const q4=byId.task1_v202_chem_04,q7=byId.task1_v202_chem_07;
assert(q4.markPoints[0].includes('cyclohexanol produces one mole of cyclohexene and one mole of water'));
assert(!q4.markPoints[0].includes('gives cyclohexene and cyclohexanol'));
assert(q7.markPoints[6].includes('Reduction of chromium(VI) to chromium(III)'));
assert(!q7.markPoints[6].includes('Oxidation of dichromate'));
const a=app.indexOf('function normalise('),b=app.indexOf('function nextSchedule(',a),
      c=app.indexOf('function evidenceRuleScore(',b),d=app.indexOf('function renderExam(',c);
assert(a>=0&&b>a&&c>b&&d>c);
const judge=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(a,b)+app.slice(c,d)+'return examSuggested')();
const canonical=s=>String(s||'').toLowerCase().trim().replace(/[.!?]+$/,'');
let aliases=0,rejected=0;
for(const q of source.questions){
 assert.equal(q.modelAnswer,q.markPoints.join(' '),q.id+' model is inconsistent');
 assert.equal(q.markPoints.length,q.marks);
 assert.equal(q.markPointMarks.length,q.marks);
 assert.equal(judge(q,q.modelAnswer).suggested,q.marks,q.id+' model lost credit');
 assert.equal(judge(q,'').suggested,0);
 assert.equal(judge(q,'not sure').suggested,0);
 for(const [index,alts] of Object.entries(q.reviewedShortAnswerPoints||{})){
  for(const alt of alts){
   const all=Object.values(q.reviewedShortAnswerPoints).filter(items=>items.some(s=>canonical(s)===canonical(alt))).length;
   const result=judge(q,alt);aliases++;
   assert.equal(result.suggested,all,q.id+' wrongly scored '+alt);
   assert.equal(result.preds.filter(Boolean).length,all,q.id+' extra mark point '+alt);
   assert.deepEqual(result.scores.map(s=>s>=.5),result.preds,q.id+' flag/score mismatch');
  }
 }
 for(const bad of q.reviewedShortAnswerRejects||[]){
  rejected++;
  const result=judge(q,bad);
  assert.equal(result.suggested,0,q.id+' wrongly credited incorrect statement '+bad);
  assert(result.preds.every(on=>on===false),q.id+' incorrect flag '+bad);
 }
}
assert.equal(aliases,65);assert.equal(rejected,17);
const expectOne=[
 ['task1_v202_chem_04','One mole of cyclohexanol gives one mole of cyclohexene and one mole of water.',0],
 ['task1_v202_chem_04','The theoretical maximum mass of cyclohexene is 20.5 grams.',2],
 ['task1_v202_chem_04','The percentage yield of cyclohexene is 80.0 percent.',3],
 ['task1_v202_chem_05','The condenser cools vapour into liquid.',6],
 ['task1_v202_chem_06','The unrecovered mass is 1.0 g.',1],
 ['task1_v202_chem_07','Dichromate(VI) is reduced from chromium(VI) to chromium(III).',6],
 ['task1_v202_chem_07','D is a primary or secondary alcohol.',3],
 ['task1_v202_chem_08','R is 2-methylpropan-2-ol.',2],
 ['task1_v202_chem_09','Butanal is one possible aldehyde for U.',1]
];
for(const [id,ans,index] of expectOne){
 const got=judge(byId[id],ans);
 assert.equal(got.suggested,1,id+' '+ans);
 assert.deepEqual(got.preds.map((on,i)=>on?i:null).filter(x=>x!==null),[index],id+' relevant point only');
}
for(const [id,ans] of [
 ['task1_v202_chem_04','The theoretical mass is 20.5 kg.'],
 ['task1_v202_chem_04','Dehydration produces cyclohexanol and cyclohexene as the two products.'],
 ['task1_v202_chem_07','Dichromate(VI) is oxidised from chromium(VI) to chromium(III).'],
 ['task1_v202_chem_07','Chromium(VI) loses electrons to become chromium(III).'],
 ['task1_v202_chem_09','A positive Tollens test proves U is butanal rather than 2-methylpropanal.']
]){
 assert.equal(judge(byId[id],ans).suggested,0,'Chemically incorrect wording awarded marks '+id+' '+ans);
}
const baseline=['task1_v202_chem_04','task1_v202_chem_05','task1_v202_chem_06','task1_v202_chem_07','task1_v202_chem_08','task1_v202_chem_09'];
assert.deepEqual(source.questions.filter(q=>q.requiredPractical>=5).map(q=>q.id),baseline);
assert(source.questions.every(q=>q.sourceVerified===false&&q.verificationLevel==='original-exam-style'));
console.log('PASS v223: corrected 2 chemical facts, 65 AS Chemistry RP4–6 reviewed short responses (26 new), 17 false-positive rejects (14 new), model marking, original question IDs/core progress keys retained');
