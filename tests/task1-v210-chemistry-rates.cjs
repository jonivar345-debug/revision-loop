'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const load=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const bank=load('chemistry_rates_rp7_kp_v210.json'),flash=load('chemistry_rates_rp7_recall_v210.json');
const core=load('exam_questions.json'),app=fs.readFileSync('app.js','utf8');
const sw=fs.readFileSync('sw.js','utf8'),html=fs.readFileSync('index.html','utf8');
const source=fs.readFileSync('chemistry-rates-marking-v210.js','utf8');
assert.equal(bank.version,'v210');assert.equal(bank.questions.length,5);
assert.deepEqual(bank.questions.map(q=>q.marks),[9,8,8,8,9]);
assert.equal(bank.questions.reduce((s,q)=>s+q.marks,0),42);
assert.equal(flash.version,'v210');assert.equal(flash.cards.length,11);
assert.equal(new Set(flash.cards.map(q=>q.id)).size,11);
assert.equal(core.questions.length,1268);
assert(app.includes("'./chemistry_rates_rp7_kp_v210.json'"));
assert(app.includes("'./chemistry_rates_rp7_recall_v210.json'"));
assert(sw.includes("'./chemistry_rates_rp7_kp_v210.json'"));
assert(sw.includes("'./chemistry_rates_rp7_recall_v210.json'"));
assert(sw.includes("'./chemistry-rates-marking-v210.js'"));
assert(sw.includes('v210-chemistry-rp7-kp'));
assert(html.includes('chemistry-rates-marking-v210.js?v=210'));
assert(html.indexOf('chemistry-rates-marking-v210.js')<html.indexOf('app.js?v=203'));
assert(app.includes('window.RevisionChemRatesV210?.evaluate(q,answer)'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
const eligibility=app.match(/function mockEligibleQuestion\(q\)\{[\s\S]*?\n\}/);
assert(eligibility);const mockEligible=vm.runInNewContext(eligibility[0]+'\nmockEligibleQuestion');
const root={};vm.runInNewContext(source,{window:root});
const direct=root.RevisionChemRatesV210?.evaluate;
assert.equal(typeof direct,'function');
const a=app.indexOf('function normalise('),b=app.indexOf('function nextSchedule(',a);
const c=app.indexOf('function evidenceRuleScore(',b),d=app.indexOf('function renderExam(',c);
assert(a>=0&&b>a&&c>b&&d>c);
const suggested=new Function('window','function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(a,b)+app.slice(c,d)+'return examSuggested')(root);
const existing=new Set(core.questions.map(q=>q.id));
for(const q of bank.questions){
 assert(!existing.has(q.id),'Duplicate question id: '+q.id);existing.add(q.id);
 assert(q.subject==='Chemistry'&&q.level==='A2'&&q.mock===true&&q.taught===true);
 assert(['3.1.9.1','3.1.9.2','3.1.10'].includes(q.specRef));
 assert(q.year==='Practice'&&q.sourceVerified===false&&q.verificationLevel==='original-exam-style');
 assert(q.requiresWorking&&q.difficulty==='hard');
 assert.equal(q.marks,q.markPoints.length);assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert.equal(q.modelAnswer,q.markPoints.join(' '));assert(mockEligible(q));
 assert.equal(direct(q,q.modelAnswer).suggested,q.marks);
 const actual=suggested(q,q.modelAnswer);
 assert.equal(actual.suggested,q.marks,'Full model not credited: '+q.id);
 assert(actual.preds.every(Boolean));
 for(const blank of ['', 'no idea','not sure'])
  assert.equal(suggested(q,blank).suggested,0,'Blank work wrongly credited: '+q.id);
}
for(const card of flash.cards){
 assert(/^task1_v210_chem_card_\d\d$/.test(card.id));
 assert(card.subject==='Chemistry'&&card.stage==='A2'&&card.taught&&card.mock&&card.active);
 assert(['3.1.9.1','3.1.9.2','3.1.10'].includes(card.specRef));
 assert(card.strictRecall&&card.accept.includes(card.back)&&card.reject.length>=2);
 assert(card.front.length>25&&card.back.length>8);
}
const valid=[
 ['rate = k[A]^2[B]','Overall order = 3','k = 0.100','units dm^6 mol^-2 s^-1'],
 ['Tangent gradient is -9.00e-4 mol dm^-3 s^-1','Rate of disappearance is +9.00e-4 mol dm^-3 s^-1','Average rate = 9.50e-4 mol dm^-3 s^-1'],
 ['Dataset X is zero order','Dataset Y is first order','The half-life is 20 s','k = 0.0347 s^-1'],
 ['Gradient = -Ea/R','Activation energy = 74.8 kJ mol^-1','ln k = -5.00','k = 0.00674 s^-1'],
 ['n(N2O4)=0.600 mol','n(NO2)=0.800 mol','Total =1.40 mol','Kp=107 kPa']
];
const invalid=[
 ['Rate is zero','k=5','rate=k[A][B]'],
 ['Gradient = +9e-4','rate is negative -9e-4','Average rate is -9.5e-4'],
 ['X is first order and Y is zero order','k = 0.10 s^-1','half-life increases for Y'],
 ['Ea=9 kJ mol^-1','ln k=+5.00','k=0.0674'],
 ['Kp doubles with pressure','NO2 is 60 kPa','N2O4 80 kPa']
];
let accepted=0,rejected=0;
for(let i=0;i<bank.questions.length;i++){
 for(const answer of valid[i]){
  const r=suggested(bank.questions[i],answer);accepted++;
  assert.equal(r.suggested,1,'Valid short form not credited once: '+bank.questions[i].id+' '+answer);
  assert.equal(r.preds.filter(Boolean).length,1);
 }
 for(const answer of invalid[i]){
  rejected++;
  assert.equal(suggested(bank.questions[i],answer).suggested,0,
   'Unsupported or wrong data claim credited: '+bank.questions[i].id+' '+answer);
 }
}
assert.equal(accepted,19);assert.equal(rejected,15);
assert.equal(direct({id:'unrelated',markPoints:['yes'],marks:1},'yes'),null);
console.log('PASS v210: 5 original school Chemistry mock problems (42 marks), 11 flashcards, 19 accepted short claims, 15 false claims rejected, progress and 1268-question bank retained');
