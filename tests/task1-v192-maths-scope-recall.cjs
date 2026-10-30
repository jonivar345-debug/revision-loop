'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const ext=JSON.parse(fs.readFileSync('maths_mock_recall_v192.json','utf8'));
const base=JSON.parse(fs.readFileSync('deck.json','utf8'));
const v186=JSON.parse(fs.readFileSync('maths_mock_recall_v186.json','utf8'));
const v187=JSON.parse(fs.readFileSync('maths_mock_recall_v187.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v192-maths-scope-and-recall-audit.json','utf8'));
const bank=JSON.parse(fs.readFileSync('exam_questions.json','utf8'));
const app=fs.readFileSync('app.js','utf8'),sw=fs.readFileSync('sw.js','utf8'),html=fs.readFileSync('index.html','utf8');
assert.equal(ext.version,'v192');
assert.equal(ext.cards.length,10);
assert.equal(base.cards.length,3345);
assert.equal(bank.questions.length,1268);
assert.equal(base.cards.filter(c=>c.active!==false&&c.subject==='Maths'&&c.mock===true).length,116);
assert.equal(v186.cards.length,9);assert.equal(v187.cards.length,15);
assert.equal(116+9+15+10,150);
const previousIds=new Set([...base.cards,...v186.cards,...v187.cards].map(c=>c.id));
assert.equal(new Set(ext.cards.map(c=>c.id)).size,10);
for(const c of ext.cards){
 assert(!previousIds.has(c.id),'Duplicate card '+c.id);
 assert(c.subject==='Maths'&&c.stage==='AS'&&c.mock===true&&c.taught===true&&c.scope==='mock'&&c.active===true);
 assert(c.strictRecall===true&&c.front.length<170&&c.back.length<130);
 assert(c.accept.includes(c.back)&&c.accept.length>=2);
 assert(['3.3','3.6','3.7','3.9'].includes(c.specRef));
}
assert.equal(audit.expected.firstMockEligible,147);
assert.equal(audit.excludedFromMathsFirstMock.length,3);
assert(app.includes("'./maths_mock_recall_v192.json'"));
assert(app.includes('else if(index===3)'));
assert(app.includes("knownFlashIds.has(c.id)"));
assert(sw.includes("'./maths_mock_recall_v192.json'"));
assert(sw.includes('v192-as-pure-scope-recall'));
assert(html.includes('app.js?v=202'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("const cardPool=cards.filter(c=>c.active!==false&&c.subject===sub&&mockEligibleCard(c))"));
assert(app.includes("flashScopeFilter==='mock'?mockEligibleCard(c)"));
assert(app.includes("scope==='mock'?a.filter(mockEligibleCard)"));
assert(app.includes("p==='mock'?base.filter(mockEligibleCard)"));
const s=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),e=app.indexOf('function mockEligibleQuestion(q)',s);
assert(s>=0&&e>s,'Missing dedicated mock card guard');
const mockEligibleCard=vm.runInNewContext(app.slice(s,e)+'\nmockEligibleCard');
const all=[...base.cards,...v186.cards,...v187.cards,...ext.cards].filter(c=>c.subject==='Maths'&&c.active!==false);
assert.equal(all.filter(mockEligibleCard).length,147,'First Year 1 Pure mock card pool');
for(const {id} of audit.excludedFromMathsFirstMock){
 const c=all.find(c=>c.id===id);assert(c,'Existing historical card must remain '+id);
 assert.equal(c.mock,true);
 assert.equal(mockEligibleCard(c),false,'A-level-only functions card must not be in first mock '+id);
}
assert.equal(mockEligibleCard({subject:'Maths',mock:true,stage:'A2',topic:'Algebra',id:'test_a2'}),false);
assert.equal(mockEligibleCard({subject:'Maths',mock:true,stage:'AS',topic:'Statistics',id:'test_stat'}),false);
assert.equal(mockEligibleCard({subject:'Maths',mock:true,stage:'AS',topic:'Mechanics',id:'test_mech'}),false);
assert.equal(mockEligibleCard({subject:'Chemistry',mock:true,stage:'A2',topic:'Organic',id:'test_chem'}),true);
const normaliseStart=app.indexOf('function normalise('),normaliseEnd=app.indexOf('function importantTokens(');
assert(normaliseStart>=0&&normaliseEnd>normaliseStart);
const evaluate=new Function('window',app.slice(normaliseStart,normaliseEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of ext.cards){
 for(const answer of c.accept)assert.equal(evaluate(c,answer).status,'correct',c.id+' correct '+answer);
 for(const answer of c.reject)assert.notEqual(evaluate(c,answer).status,'correct',c.id+' wrong '+answer);
 assert.equal(evaluate(c,'').status,'neutral');
}
console.log('PASS v192: 10 exact-recall AS Pure cards; 147 eligible first-mock cards; 3 Year 2 function cards remain for full revision; stable IDs, cache and cloud');
