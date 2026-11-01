'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const original=j('deck.json'),bank=j('physics_uncertainty_graph_practice_v268.json'),flash=j('physics_uncertainty_graph_recall_v268.json'),app=read('app.js'),sw=read('sw.js');
const phy=j('physics_particle_exchange_diagram_practice_v265.json'),chem=j('chemistry_organic_drawing_practice_v267.json');
assert.equal(original.cards.length,3345);
assert.equal(bank.version,'v268');assert.equal(bank.questions.length,6);
assert.equal(flash.version,'v268');assert.equal(flash.cards.length,12);
const qUrls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const cUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(qUrls.length>=31,'v268 practice bank remains at index 30');assert.equal(qUrls[30],'physics_uncertainty_graph_practice_v268.json');
assert(cUrls.length>=44,'v268 recall bank remains at index 43');assert.equal(cUrls[43],'physics_uncertainty_graph_recall_v268.json');
for(const path of ['physics_uncertainty_graph_practice_v268.json','physics_uncertainty_graph_recall_v268.json'])assert(sw.includes("'./"+path+"'"));
assert(sw.includes('-v268-uncertainty-graphs'));
const priorQ=new Set([...j('exam_questions.json').questions,...phy.questions,...chem.questions].map(q=>q.id));
const priorCards=new Set(original.cards.map(c=>c.id));
let total=0;
for(const q of bank.questions){
 assert(!priorQ.has(q.id),'Duplicate original question '+q.id);priorQ.add(q.id);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.specRef,'3.1.2');
 assert.equal(q.mock,true);assert.equal(q.taught,true);assert.equal(q.standalone,true);
 assert.equal(q.manualDiagramReview,true);assert.equal(q.sourceVerified,false);
 assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.markPoints.length,q.marks);assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(/plot|draw/i.test(q.prompt));assert(q.modelAnswer.length>100);
 total+=q.marks;
}
assert.equal(total,29);
const begin=app.indexOf('function examSuggested(q,answer){'),end=app.indexOf(' // v213:',begin);
assert(begin>0&&end>begin);
const scoring=new Function('window',app.slice(begin,end)+'\n}\nreturn examSuggested;')({});
for(const q of bank.questions){
 const s=scoring(q,'every possible correct graph label without an actual graph');
 assert.equal(s.manualRequired,true);assert.equal(s.suggested,0);
 assert.deepEqual(s.preds,Array(q.marks).fill(false));assert.deepEqual(s.scores,Array(q.marks).fill(0));
}
assert(app.includes('if(q.manualDiagramReview===true){beginManualExamReview(q);return;}'));
assert(app.includes('The text checker cannot verify this drawing or graph.'));
assert(app.includes('window.RevisionSketch?.mount(q)'));
assert(app.includes('window.RevisionScan?.mount(q.id)'));
const normaliseStart=app.indexOf('function normalise('),normaliseEnd=app.indexOf('function importantTokens(',normaliseStart);
assert(normaliseStart>=0&&normaliseEnd>normaliseStart);
const judge=new Function('window',app.slice(normaliseStart,normaliseEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const fronts=new Set(),ids=new Set(priorCards);let correct=0,rejected=0;
for(const c of flash.cards){
 assert(!ids.has(c.id));ids.add(c.id);
 assert(!fronts.has(c.front.trim().toLowerCase()));fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.specRef,'3.1.2');
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert.equal(c.accept.length,2);assert.equal(c.reject.length,2);
 assert(c.accept.includes(c.back)||c.accept.includes(c.back.replace(/\.$/,'')));
 for(const answer of c.accept){assert.equal(judge(c,answer).status,'correct','Accept '+c.id+': '+answer);correct++;}
 for(const answer of c.reject){assert.equal(judge(c,answer).status,'wrong','Reject '+c.id+': '+answer);rejected++;}
}
assert.equal(correct,24);assert.equal(rejected,24);
const x=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),y=app.indexOf(' const added=[',x);
assert(x>0&&y>x&&app.slice(x,y).includes('else if(index===43)'));
const loader=new Function('cards','extraFlashBanks',app.slice(x,y)+'\nreturn cards;');
const good=Array.from({length:44},()=>({cards:[]}));good[43]=flash;
assert.equal(loader([...original.cards],good).length,3357);
const wrong=Array.from({length:44},()=>({cards:[]}));wrong[43]={cards:flash.cards.map((c,i)=>({...c,...[
{subject:'Chemistry'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.17'},{strictRecall:false}
][i%8]}))};assert.equal(loader([...original.cards],wrong).length,3345);
const near=(a,b)=>Math.abs(a-b)<1e-9;
assert(near((7-1)/3,2));
assert(near((6.7-1.3)/6,.9));
for(const [x,y] of [[0,1],[2,3],[4,5],[6,7]])assert(Math.abs((1.3+.9*x)-y)<=.300000000001);
assert(near(Math.abs(1-.9)/1*100,10));
for(const [x,y] of [[0,2],[2,3],[4,4],[6,5]])assert(Math.abs((1.8+(3.4/6)*x)-y)<=.200000000001);
assert(near(Math.abs(2-1.8)/2*100,10));
assert(near((4/20)*1e3,200));
assert(near((2-1.7)/2*100,15));assert(near((3-2.4)/3*100,20));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v268: six manually scored uncertainty graphs (29 marks), 12 recall cards, 24 valid and 24 rejected inputs, numerical independent checks, strict scope and preserved 3345 original IDs.');
