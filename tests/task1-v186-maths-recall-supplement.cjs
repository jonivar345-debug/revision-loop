'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const extra=JSON.parse(fs.readFileSync('maths_mock_recall_v186.json','utf8'));
const base=JSON.parse(fs.readFileSync('deck.json','utf8'));
const crosswalk=JSON.parse(fs.readFileSync('editorial/task1-v185-maths-as-pure-outcome-crosswalk.json','utf8'));
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
assert.equal(extra.version,'v186');
assert.equal(extra.cards.length,9);
assert.equal(base.cards.length,3345);
assert.equal(base.cards.filter(c=>c.active!==false&&c.subject==='Maths'&&c.mock===true).length,116);
assert.equal(extra.cards.length+116,125);
assert.equal(crosswalk.outcomes.filter(x=>x.kind==='candidate_recall_gap').length,9);
const ids=new Set(base.cards.map(c=>c.id));
assert.equal(new Set(extra.cards.map(c=>c.id)).size,9);
for(const c of extra.cards){
 assert(!ids.has(c.id),'ID conflict '+c.id);
 assert(c.subject==='Maths'&&c.stage==='AS'&&c.scope==='mock'&&c.mock===true&&c.taught===true&&c.active===true);
 assert(c.strictRecall===true&&c.front.length<150&&c.back.length<120);
 assert(c.accept.includes(c.back));
 assert(/^3\.[3-9]$/.test(c.specRef));
}
assert(app.includes("'./maths_mock_recall_v186.json'"));
assert(app.includes("for(const [index,bank] of extraFlashBanks.entries())"));
assert(app.includes("knownFlashIds.has(c.id)"));
assert(app.includes("c.subject!=='Maths'||c.stage!=='AS'||c.mock!==true||c.taught!==true||c.scope!=='mock'"));
assert.match(html,/app\.js\?v=\d+/);
assert.match(sw,/v186-maths-recall/);
assert(sw.includes("'./maths_mock_recall_v186.json'"));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(');
assert(start>=0&&end>start);
const evaluate=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
for(const c of extra.cards){
 for(const answer of c.accept)assert.equal(evaluate(c,answer).status,'correct',c.id+': '+answer);
 assert.equal(evaluate(c,'').status,'neutral',c.id);
}
const incorrect=[
['task1_v186_maths_002','1/2'],['task1_v186_maths_002','3'],['task1_v186_maths_003','sqrt(3)'],['task1_v186_maths_004','(1,0)'],
['task1_v186_maths_005','e^(kx)'],['task1_v186_maths_006','ln a'],
['task1_v186_maths_007','positive'],['task1_v186_maths_009','f(a)-f(b)']];
for(const [id,answer] of incorrect)
 assert.equal(evaluate(extra.cards.find(c=>c.id===id),answer).status,'wrong','Wrong answer accepted '+id);
assert(app.includes("[/√/g,' sqrt ']"),'Square roots must not normalise to bare numbers');
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
console.log('PASS v186: nine new AS Pure recall cards, core deck unchanged, new maths mock count 125 if extra bank loads');
