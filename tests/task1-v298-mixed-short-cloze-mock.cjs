'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const app=read('app.js'),core=j('deck.json'),newCards=j('mock_short_recall_and_cloze_v298.json').cards;
assert.equal(newCards.length,97);
const tally={Physics:0,Chemistry:0,Maths:0},methods=new Set();
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>0&&end>start);
const evaluate=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const names=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(names[53],'mock_short_varied_recall_v293.json');
assert.equal(names[54],'mock_short_recall_and_cloze_v298.json');
const prior=[...core.cards,...names.slice(0,54).flatMap(n=>j(n).cards||[])];
assert.equal(prior.length,4216,'append-only 4,216 previously loaded cards');
const existingIDs=new Set(prior.map(c=>c.id));
const allKeys=new Set(prior.map(c=>c.subject+'::'+String(c.front||'').trim().toLowerCase()));
const loc=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),stop=app.indexOf('function startMockSession(){',loc);
const mockEligibleCard=new Function(app.slice(loc,stop)+'\nreturn mockEligibleCard;')();
let accepted=0,rejected=0,cloze=0;const duplicateFronts=[];
for(const c of newCards){
 tally[c.subject]++;
 methods.add(c.method);
 assert(c.id && !existingIDs.has(c.id),'No old ID overwritten: '+c.id);
 const key=c.subject+'::'+String(c.front||'').trim().toLowerCase();
 if(allKeys.has(key))duplicateFronts.push({id:c.id,front:c.front});
 allKeys.add(key);existingIDs.add(c.id);
 assert(c.mock===true && c.taught===true && c.scope==='mock' && c.active===true && c.kind==='short' && c.strictRecall===true);
 assert(mockEligibleCard(c),c.id+' must qualify for mock');
 assert(c.front.length<=115&&c.back.length<=95,'Short visible prompt/response: '+c.id);
 if(c.subject==='Physics')assert.equal(c.stage,'AS');
 if(c.subject==='Maths'){assert.equal(c.stage,'AS');assert.equal(c.courseTopic,'Year 1 Pure');assert(!/statistics|mechanics|radian/i.test(c.topic+' '+c.front));}
 if(c.method==='fill gaps'){cloze++;assert(c.front.includes('___'));}
 assert(c.accept.length>=2 && c.reject.length>=2);
 for(const a of c.accept){
  const r=evaluate(c,a);
  assert.equal(r.status,'correct',c.id+' valid '+JSON.stringify(a)+' result '+r.status);
  accepted++;
 }
 for(const a of c.reject){
  const r=evaluate(c,a);
  assert.equal(r.status,'wrong',c.id+' invalid '+JSON.stringify(a)+' result '+r.status);
  rejected++;
 }
}
assert.equal(duplicateFronts.length,0,'Duplicate existing fronts: '+JSON.stringify(duplicateFronts));
// Formula symbols change the scientific meaning: both must be strictly marked.
const chemMagnitude=newCards.find(c=>c.id==='task1_v298_chemistry_15');
const derivative=newCards.find(c=>c.id==='task1_v298_maths_25');
assert.equal(chemMagnitude.strictSymbolRecall,true);
assert.equal(derivative.strictSymbolRecall,true);
for(const [c,valid,invalid] of [
 [chemMagnitude,'n × |ΔH|','n × ΔH'],
 [chemMagnitude,'q = n × |ΔH|','q = n × ΔH'],
 [chemMagnitude,'n*abs(ΔH)','n / ΔH'],
 [derivative,"f'(a)=0",'f(a)=0'],
 [derivative,'The first derivative is zero.',"f''(a)=0"],
 [derivative,'0','f(a) = 0']
]){
 assert.equal(evaluate(c,valid).status,'correct',c.id+' correct symbols');
 assert.equal(evaluate(c,invalid).status,'wrong',c.id+' wrong symbols');
}
assert.deepEqual(tally,{Physics:32,Chemistry:32,Maths:33});
assert.equal(cloze,6);
assert(methods.size>=7,'Varied flashcard styles');
const shell=read('sw.js');
assert(shell.includes("'./mock_short_recall_and_cloze_v298.json'"));
const expected=prior.length+newCards.length;
assert.equal(expected,4313);
console.log('PASS v298 '+newCards.length+' cards, '+cloze+' cloze, '+methods.size+' methods; '+accepted+' accepted and '+rejected+' rejected answers tested with actual marker. Previous 4,216 cards and progress IDs untouched.');
