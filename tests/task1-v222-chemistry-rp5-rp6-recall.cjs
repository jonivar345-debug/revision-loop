'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const deck=json('deck.json'),exam=json('exam_questions.json'),extra=json('chemistry_rp5_rp6_reasoning_recall_v222.json');
const report=json('editorial/task1-v222-chemistry-rp5-rp6-concepts-audit.json');
const app=read('app.js'),sw=read('sw.js'),html=read('index.html');
const bank202=json('chemistry_rp4_rp6_evidence_v202.json');
assert.equal(deck.cards.length,3345,'immutable core deck count');
assert.equal(exam.questions.length,1268,'immutable core question count');
assert.equal(extra.cards.length,8);
assert.equal(report.improvements.newASChemMockCards,8);
assert.equal(report.task1Complete,false);
assert.equal(bank202.questions.filter(q=>q.requiredPractical===5).length,3,'existing RP5 exam questions');
assert.equal(bank202.questions.filter(q=>q.requiredPractical===6).length,3,'existing RP6 exam questions');
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"),'progress key unchanged');
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"),'profile key unchanged');
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"),'settings key unchanged');
assert(html.includes('app.js?v=203'),'retain existing asset version regression contract');
assert(sw.includes('v222-rp5-rp6-recall'),'offline cache namespace');
assert(sw.includes("'./chemistry_rp5_rp6_reasoning_recall_v222.json'"),'precache supplement');
assert(app.includes("'./chemistry_rp5_rp6_reasoning_recall_v222.json'"),'fetch supplement');
const oldBanks=['maths_mock_recall_v186.json','maths_mock_recall_v187.json','chemistry_mock_recall_v189.json','maths_mock_recall_v192.json','physics_mock_recall_v193.json','chemistry_mock_recall_v193.json','physics_mock_recall_v195.json','chemistry_mock_recall_v195.json','physics_mock_recall_v196.json','chemistry_mock_recall_v196.json','chemistry_mock_recall_v199.json','chemistry_rates_rp7_recall_v210.json','chemistry_rp4_recall_v215.json','chemistry_as_measurement_recall_v218.json','chemistry_tof_precision_recall_v219.json','chemistry_ion_tests_recall_v220.json','chemistry_practicals_analysis_recall_v221.json'];
const old=[...deck.cards,...oldBanks.flatMap(p=>json(p).cards||[])];
const knownIds=new Set(old.map(c=>c.id));
const knownFronts=new Set(old.filter(c=>c.subject==='Chemistry').map(c=>String(c.front).trim().toLowerCase()));
for(let i=0;i<extra.cards.length;i++){
 const c=extra.cards[i];
 assert.equal(c.id,'task1_v222_chem_rp_'+String(i+1).padStart(2,'0'));
 assert(!knownIds.has(c.id),'duplicate card id: '+c.id);knownIds.add(c.id);
 assert(!knownFronts.has(c.front.trim().toLowerCase()),'duplicate question text: '+c.id);knownFronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,'AS');
 assert.equal(c.requiredPractical,i<4?5:6);
 assert(c.mock===true&&c.taught===true&&c.scope==='mock'&&c.active===true&&c.strictRecall===true);
 assert(c.accept.includes(c.back)&&c.accept.length>=4&&c.reject.length>=3);
 assert(c.front.length<180&&c.back.length<190);
}
const evalStart=app.indexOf('function normalise('),evalEnd=app.indexOf('function importantTokens(',evalStart);
assert(evalStart>0&&evalEnd>evalStart);
const evaluate=new Function('window',app.slice(evalStart,evalEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accepted=0,rejected=0;
for(const c of extra.cards){
 for(const a of c.accept){assert.equal(evaluate(c,a).status,'correct','Wrongly rejected: '+c.id+' '+a);accepted++;}
 for(const a of c.reject){assert.notEqual(evaluate(c,a).status,'correct','Wrongly accepted: '+c.id+' '+a);rejected++;}
 assert.equal(evaluate(c,'').status,'neutral');
}
const loadStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),loadEnd=app.indexOf(' const added=[',loadStart);
assert(loadStart>=0&&loadEnd>loadStart);
const loader=app.slice(loadStart,loadEnd);
assert(loader.includes('else if(index===17)'), 'v222 loader must exist');
const loadCards=new Function('cards','extraFlashBanks',loader+'\nreturn cards;');
const banks=Array.from({length:18},()=>({cards:[]}));banks[17]=extra;
const loaded=loadCards([...deck.cards],banks);
assert.equal(loaded.length,3345+8);
assert.equal(new Set(loaded.map(c=>c.id)).size,loaded.length);
for(const c of extra.cards)assert(loaded.some(x=>x.id===c.id));
const bad=Array.from({length:18},()=>({cards:[]}));bad[17]={cards:extra.cards.map(x=>({...x}))};
bad[17].cards[0].subject='Physics';
bad[17].cards[1].stage='A2';
bad[17].cards[2].mock=false;
bad[17].cards[3].taught=false;
bad[17].cards[4].scope='full';
bad[17].cards[5].active=false;
const filtered=loadCards([...deck.cards],bad);
for(let i=0;i<6;i++)assert(!filtered.some(c=>c.id===extra.cards[i].id),'invalid mock entry leaked: '+i);
assert.equal(loaded.filter(c=>c.subject==='Maths').length,deck.cards.filter(c=>c.subject==='Maths').length);
assert(sw.includes("'./chemistry_practicals_analysis_recall_v221.json'"),'previous bank must remain cached');
console.log('PASS v222: eight AS Chemistry RP5–RP6 conceptual mock cards, '+accepted+' accepted, '+rejected+' rejected answer variants, live app evaluator/loader index 17, 3345 core ids and progress keys preserved');
