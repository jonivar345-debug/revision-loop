'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const ext=JSON.parse(fs.readFileSync('maths_mock_recall_v187.json','utf8'));
const v186=JSON.parse(fs.readFileSync('maths_mock_recall_v186.json','utf8'));
const base=JSON.parse(fs.readFileSync('deck.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v187-proof-vectors-recall-crosswalk.json','utf8'));
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(ext.version,'v187');
assert.equal(ext.cards.length,15);
assert.equal(ext.cards.filter(c=>c.topic==='Vectors').length,9);
assert.equal(ext.cards.filter(c=>c.topic==='Proof').length,6);
assert.equal(base.cards.length,3345);
assert.equal(base.cards.filter(c=>c.subject==='Maths'&&c.active!==false&&c.mock===true).length,116);
assert.equal(v186.cards.length,9);
assert.equal(116+v186.cards.length+ext.cards.length,140);
assert.equal(audit.addedCards.length,15);
const allIds=new Set([...base.cards.map(c=>c.id),...v186.cards.map(c=>c.id)]);
assert.equal(new Set(ext.cards.map(c=>c.id)).size,15);
for(const c of ext.cards){
 assert(!allIds.has(c.id),'Duplicate ID '+c.id);
 assert(c.subject==='Maths'&&c.stage==='AS'&&c.scope==='mock'&&c.mock===true&&c.taught===true&&c.active===true);
 assert(c.strictRecall===true&&c.front.length<170&&c.back.length<125);
 assert(c.accept.includes(c.back)&&c.accept.length>=2);
 assert(c.specRef===(c.topic==='Proof'?'3.2':'3.10'));
}
assert(app.includes("'./maths_mock_recall_v186.json','./maths_mock_recall_v187.json'"));
assert(app.includes('knownFlashIds.has(c.id)'));
assert.match(html,/app\\.js\\?v=187/);
assert(sw.includes("'./maths_mock_recall_v187.json'"));
assert(sw.includes('v187-proof-vectors'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(');
assert(start>=0&&end>start);
const evaluate=new Function('window',app.slice(start,end)+'\\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of ext.cards){
 for(const answer of c.accept)assert.equal(evaluate(c,answer).status,'correct',c.id+': valid wording '+answer);
 assert.equal(evaluate(c,'').status,'neutral',c.id);
}
const wrong=[
['task1_v187_maths_001','equal magnitude'],
['task1_v187_maths_002','AB and AC have same length'],
['task1_v187_maths_003','(a-b)/2'],
['task1_v187_maths_004','a+b'],
['task1_v187_maths_005','a vector of magnitude two'],
['task1_v187_maths_006','v times magnitude v'],
['task1_v187_maths_007','(r sin θ, r cos θ)'],
['task1_v187_maths_008','b-a'],
['task1_v187_maths_009','(ma+nb)/(m+n)'],
['task1_v187_maths_010','2n+1'],
['task1_v187_maths_011','2n'],
['task1_v187_maths_012','k+n'],
['task1_v187_maths_013','n,n+2,n+3'],
['task1_v187_maths_014','an example outside the domain'],
['task1_v187_maths_015','just check n=1']
];
for(const [id,answer] of wrong){
 const status=evaluate(ext.cards.find(c=>c.id===id),answer).status;
 assert.notEqual(status,'correct','Wrong answer was accepted: '+id+' '+answer);
}
console.log('PASS v187: 15 AS Pure vectors/proof recall cards, 140 Maths mock cards with supplements, scope and marking checked');