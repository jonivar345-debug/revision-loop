'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v224-chemistry-rates-kp-marking-audit.json');
const bank=json('chemistry_rates_rp7_kp_v210.json'),deck=json('deck.json'),core=json('exam_questions.json');
const src=read('chemistry-rates-marking-v210.js'),app=read('app.js'),sw=read('sw.js'),html=read('index.html');
assert.equal(audit.version,'v224');assert.equal(audit.newReviewedAcceptances,34);assert.equal(audit.newReviewedRejections,18);
assert.equal(bank.questions.length,5);assert.equal(bank.questions.reduce((n,q)=>n+q.marks,0),42);
assert.equal(deck.cards.length,3345);assert.equal(core.questions.length,1268);
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
assert(sw.includes('v224-rates-kp-calibration'));
assert(sw.includes("'./chemistry-rates-marking-v210.js'"));
assert(html.includes('chemistry-rates-marking-v210.js?v=210'));
assert(app.includes('window.RevisionChemRatesV210?.evaluate(q,answer)'));
const root={};vm.runInNewContext(src,{window:root});
const direct=root.RevisionChemRatesV210?.evaluate;
assert.equal(typeof direct,'function');
const a=app.indexOf('function normalise('),b=app.indexOf('function nextSchedule(',a),
      c=app.indexOf('function evidenceRuleScore(',b),d=app.indexOf('function renderExam(',c);
assert(a>=0&&b>a&&c>b&&d>c);
const score=new Function('window','function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(a,b)+app.slice(c,d)+'return examSuggested')(root);
const byId=Object.fromEntries(bank.questions.map(q=>[q.id,q]));
const reviewedStart=src.indexOf('const V224_REVIEWED='),reviewedEnd=src.indexOf(';\nfunction v224Reviewed',reviewedStart);
assert(reviewedStart>0&&reviewedEnd>reviewedStart,'missing reviewed v224 cases');
const reviewed=vm.runInNewContext(src.slice(reviewedStart,reviewedEnd)+'; V224_REVIEWED');
let accepted=0,rejected=0;
for(const [id,bundle] of Object.entries(reviewed)){
 const q=byId[id];assert(q,id+' missing from bank');
 for(const [index,phrases] of Object.entries(bundle.accept)){
  for(const phrase of phrases){
   const directResult=direct(q,phrase),actual=score(q,phrase);
   assert.equal(directResult.suggested,1,'direct correct alias '+id+' '+phrase);
   assert.equal(actual.suggested,1,'app correct alias '+id+' '+phrase);
   assert.equal(actual.preds.filter(Boolean).length,1,'no extra marks '+id+' '+phrase);
   assert.equal(actual.preds[Number(index)],true,'wrong marked point '+id+' '+phrase);
   assert.deepEqual(Array.from(actual.scores).map(v=>v>=.5),Array.from(actual.preds));
   accepted++;
  }
 }
 for(const phrase of bundle.reject){
  const directResult=direct(q,phrase),actual=score(q,phrase);
  assert.equal(directResult.suggested,0,'direct invalid '+id+' '+phrase);
  assert.equal(actual.suggested,0,'app invalid '+id+' '+phrase);
  assert(actual.preds.every(on=>!on),'false positive mark '+id+' '+phrase);
  rejected++;
 }
 assert.equal(score(q,q.modelAnswer).suggested,q.marks,'full model scored incorrectly '+id);
 assert.equal(score(q,'not sure').suggested,0);
}
assert.equal(accepted,34);assert.equal(rejected,18);
assert.equal(direct({id:'unrelated',markPoints:['yes'],marks:1},'yes'),null);
console.log('PASS v224: 34 Chemistry rate/Arrhenius/Kp reviewed valid statements, 18 invalid statement guards, 5 full models, 42 marks, original IDs and cloud keys intact');
