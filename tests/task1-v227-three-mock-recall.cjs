'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v227-three-mock-coverage-gate.json');
const deck=json('deck.json'),exam=json('exam_questions.json');
const app=read('app.js'),sw=read('sw.js'),html=read('index.html');
const names=['physics_cross_spec_recall_v227.json','chemistry_cross_spec_recall_v227.json','maths_as_pure_cross_spec_recall_v227.json'];
const banks=names.map(json),expected=['Physics','Chemistry','Maths'];
assert.equal(audit.currentSignOff.task1Complete,false);
for(const x of ['physics','chemistry','maths'])assert.equal(audit.currentSignOff[x],false);
assert.equal(audit.newContent.totalCards,45);
assert.equal(deck.cards.length,3345);assert.equal(exam.questions.length,1268);
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
assert(html.includes('app.js?v=203'));assert(sw.includes('v227-three-mocks'));
const match=app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/);
assert(match,'missing flashbank manifest');
const listed=[...match[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(listed.length,23);
assert.deepEqual(listed.slice(20),names);
for(const n of names){assert(sw.includes("'./"+n+"'"),'offline missing '+n);}
const old=[...deck.cards,...listed.slice(0,20).flatMap(n=>json(n).cards||[])];
const ids=new Set(old.map(x=>x.id)),bySubject=Object.fromEntries(expected.map(x=>[x,new Set(old.filter(y=>y.subject===x).map(y=>String(y.front||'').toLowerCase().replace(/\s+/g,' ').trim()))]));
let n=0,accept=0,reject=0;
for(let k=0;k<3;k++){
 const bank=banks[k];
 assert.equal(bank.version,'v227');
 assert.equal(bank.cards.length,15);assert.equal(bank.subject,expected[k]);
 for(let i=0;i<15;i++){
  const c=bank.cards[i];
  assert.equal(c.subject,expected[k]);
  assert.equal(c.id,'task1_v227_'+['phy','chem','math'][k]+'_'+String(i+1).padStart(2,'0'));
  assert(!ids.has(c.id),'duplicate card ID '+c.id);ids.add(c.id);
  const front=c.front.toLowerCase().replace(/\s+/g,' ').trim();
  assert(!bySubject[c.subject].has(front),'duplicate exact question '+c.id);
  bySubject[c.subject].add(front);
  assert(c.active===true&&c.mock===true&&c.taught===true&&c.scope==='mock'&&c.strictRecall===true);
  assert(k===1?['AS','A2'].includes(c.stage):c.stage==='AS');
  assert(c.specRef&&c.front&&c.back);
  assert.equal(c.accept.length,3);assert.equal(c.reject.length,2);
  assert(c.accept.includes(c.back));
  if(k===2){assert(!['Statistics','Mechanics'].includes(c.topic));assert(!/\bradians?\b|\bchain rule\b/i.test(c.front+' '+c.back));}
  if(k===1){assert(!/\bbuffers?\b|\bNMR\b|\bchromatography\b/i.test(c.front+' '+c.back));}
  n++;
 }
}
assert.equal(n,45);
const fa=app.indexOf('function normalise('),fb=app.indexOf('function importantTokens(',fa);
assert(fa>0&&fb>fa);const judge=new Function('window',app.slice(fa,fb)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const bank of banks)for(const c of bank.cards){
 for(const x of c.accept){assert.equal(judge(c,x).status,'correct','rejects correct '+c.id+' '+x);accept++;}
 for(const x of c.reject){assert.notEqual(judge(c,x).status,'correct','credits wrong '+c.id+' '+x);reject++;}
 assert.equal(judge(c,'').status,'neutral');
}
assert.equal(accept,135);assert.equal(reject,90);
const lstart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),lend=app.indexOf(' const added=[',lstart);
assert(lstart>=0&&lend>lstart);
const loader=app.slice(lstart,lend);for(const i of [20,21,22])assert(loader.includes('else if(index==='+i+')'));
const load=new Function('cards','extraFlashBanks',loader+'\nreturn cards;');
const list=Array.from({length:23},()=>({cards:[]}));for(let i=0;i<3;i++)list[i+20]=banks[i];
const loaded=load([...deck.cards],list);
assert.equal(loaded.length,3345+45);
assert.equal(new Set(loaded.map(x=>x.id)).size,loaded.length);
const invalid=Array.from({length:23},()=>({cards:[]}));
invalid[20]={cards:banks[0].cards.map((c,i)=>i===0?{...c,subject:'Chemistry'}:c)};
invalid[21]={cards:banks[1].cards.map((c,i)=>i===0?{...c,mock:false}:c)};
invalid[22]={cards:banks[2].cards.map((c,i)=>i===0?{...c,stage:'A2'}:c)};
const blocked=load([...deck.cards],invalid);
for(let i=0;i<3;i++)assert(!blocked.some(x=>x.id===banks[i].cards[0].id),'invalid scoped card leaked');
const eligible=app.match(/function mockEligibleCard\(c\)\{[\s\S]*?\n\}/);
assert(eligible);const isEligible=vm.runInNewContext("const MOCK_MATHS_YEAR2_EXCLUDED_IDS = new Set(['math_function_composite','math_inverse_condition','task1_v136_063']);\n"+eligible[0]+"\nmockEligibleCard");
for(const bank of banks)for(const c of bank.cards)assert(isEligible(c),'new content not in mock '+c.id);
assert.equal(loaded.filter(c=>c.subject==='Maths').length,deck.cards.filter(c=>c.subject==='Maths').length+15);
console.log('PASS v227: 45 new scoped Physics/Chemistry/AS Pure Maths mock recall cards; 135 accepted and 90 rejected answer variants; live evaluator and loader indices 20-22; old IDs, 3345 core cards, 1268 core questions and progress keys unchanged. Completion intentionally NOT certified.');
