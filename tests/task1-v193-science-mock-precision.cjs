'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const phy=JSON.parse(fs.readFileSync('physics_mock_recall_v193.json','utf8'));
const chem=JSON.parse(fs.readFileSync('chemistry_mock_recall_v193.json','utf8'));
const oldChem=JSON.parse(fs.readFileSync('chemistry_mock_recall_v189.json','utf8'));
const maths186=JSON.parse(fs.readFileSync('maths_mock_recall_v186.json','utf8'));
const maths187=JSON.parse(fs.readFileSync('maths_mock_recall_v187.json','utf8'));
const maths192=JSON.parse(fs.readFileSync('maths_mock_recall_v192.json','utf8'));
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const exams=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v193-science-mock-precision-audit.json','utf8'));
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(phy.version,'v193');assert.equal(chem.version,'v193');
assert.equal(phy.cards.length,4);assert.equal(chem.cards.length,4);
assert.equal(deck.cards.length,3345);assert.equal(exams.questions.length,1268);
assert.equal(deck.cards.filter(c=>c.subject==='Physics'&&c.active!==false&&c.mock===true).length,730);
assert.equal(deck.cards.filter(c=>c.subject==='Chemistry'&&c.active!==false&&c.mock===true).length,1533);
assert.equal(oldChem.cards.length,1);
assert.equal(maths186.cards.length+maths187.cards.length+maths192.cards.length,34);
assert.equal(audit.counts.expectedPhysicsMockTotal,734);
assert.equal(audit.counts.expectedChemistryMockTotal,1538);
assert.equal(audit.counts.mathsFirstMockUnchanged,147);
assert.equal(audit.task1Complete,false);
const ids=new Set([...deck.cards,...oldChem.cards,...maths186.cards,...maths187.cards,...maths192.cards].map(c=>c.id));
for(const [subject,bank] of [['Physics',phy],['Chemistry',chem]]){
 for(const c of bank.cards){
  assert(!ids.has(c.id),'Duplicate flashcard ID '+c.id);ids.add(c.id);
  assert(c.subject===subject&&c.stage==='AS'&&c.taught===true&&c.mock===true&&c.scope==='mock'&&c.active===true);
  assert(c.strictRecall===true);
  assert(c.front.length<180&&c.back.length<140);
  assert(c.accept.includes(c.back)&&c.accept.length>=2&&c.reject.length>=2);
  assert(c.specRef.startsWith(subject==='Physics'?'3.5.1.':'3.1.'));
 }
}
assert(app.includes("'./physics_mock_recall_v193.json','./chemistry_mock_recall_v193.json'"));
assert(app.includes('else if(index===4)')&&app.includes("c.subject!=='Physics'"));
assert(app.includes('else if(index===5)')&&app.includes("c.subject!=='Chemistry'"));
assert(app.includes('knownFlashIds.has(c.id)'));
assert(sw.includes("'./physics_mock_recall_v193.json'")&&sw.includes("'./chemistry_mock_recall_v193.json'"));
assert(sw.includes('v193-science-mock-precision'));
assert(html.includes('app.js?v=202'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(!audit.limits.some(l=>l.toLowerCase().includes('certified complete')));
const from=app.indexOf('function normalise('),to=app.indexOf('function importantTokens(');
assert(from>=0&&to>from,'Could not find original flashcard marker');
const evaluate=new Function('window',app.slice(from,to)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of [...phy.cards,...chem.cards]){
 for(const text of c.accept){
  assert.equal(evaluate(c,text).status,'correct','Accept '+c.id+': '+text);
 }
 for(const text of c.reject){
  assert.notEqual(evaluate(c,text).status,'correct','Reject '+c.id+': '+text);
 }
 assert.equal(evaluate(c,'').status,'neutral');
}
console.log('PASS v193: eight scoped science recall cards, strict positive/negative answer marking, old bank counts, cache, progress and new content audit');
