'use strict';
// v362: exact original Chemistry school-mock core card marker precision.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json').cards;
const audit=json('editorial/task1-v362-chem-twenty-core-markers.json');
assert.equal(deck.length,3345);assert.equal(new Set(deck.map(c=>c.id)).size,3345);
assert.equal(audit.version,'v362');assert.equal(audit.rows.length,20);
assert.equal(new Set(audit.rows.map(x=>x.id)).size,20);
assert(sw.includes('-v362-chem20'),'Service worker must refresh live cache');
assert(app.includes('applyV362ChemTwentyCoreMarking(cards);'),'Production loader must call v362');
const st=app.indexOf('const V362_CHEM_MOCK_PRECISION='),end=app.indexOf('// v344:',st);
assert(st>0&&end>st);
const patch=new Function(app.slice(st,end)+'\nreturn applyV362ChemTwentyCoreMarking;')();
const ms=app.indexOf('function normalise('),me=app.indexOf('function importantTokens(',ms);
assert(ms>0&&me>ms);
const evaluate=new Function('window',app.slice(ms,me)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const mstart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),mend=app.indexOf('function startMockSession(){',mstart);
assert(mstart>0&&mend>mstart);
const mockEligible=new Function(app.slice(mstart,mend)+'\nreturn mockEligibleCard;')();
const byId=new Map(deck.map(c=>[c.id,c]));
const originals=audit.rows.map(row=>{
 const c=byId.get(row.id);assert(c,'Missing original '+row.id);
 assert.equal(c.subject,'Chemistry');assert.equal(c.stage,row.stage);assert.equal(c.mock,true);
 assert.notEqual(c.active,false);assert(mockEligible(c),'Must actually belong in first mock');
 assert.equal(c.front,row.originalFront);assert.equal(c.back,row.originalBack);
 assert(c.front.length<=140&&c.back.length<=200,'Do not disguise long answers as recall');
 assert.equal((c.accept||[]).length,0,'Unexpected pre-existing accept list: '+c.id);
 assert.equal((c.reject||[]).length,0,'Unexpected pre-existing rejects: '+c.id);
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,2);
 return {...c,accept:[],reject:[]};
});
const patched=patch(originals);
let good=0,wrong=0;
for(let i=0;i<patched.length;i++){
 const c=patched[i],row=audit.rows[i];
 assert.equal(c.v362ExactReviewed,true);assert.equal(c.front,row.originalFront);assert.equal(c.back,row.originalBack);
 assert(mockEligible(c));
 assert.equal(evaluate(c,c.back).status,'correct','Original model answer rejected: '+c.id);
 for(const x of row.accept){const v=evaluate(c,x);assert.equal(v.status,'correct','Correct answer rejected: '+c.id+' '+JSON.stringify(v));good++;}
 for(const x of row.reject){const v=evaluate(c,x);assert.equal(v.status,'wrong','False-positive answer accepted: '+c.id+' '+JSON.stringify(v));assert.equal(v.score,0);wrong++;}
}
assert.equal(good,20);assert.equal(wrong,40);
const changed=audit.rows.map(row=>({...byId.get(row.id),front:'Question modified',mock:false,accept:[],reject:[]}));
patch(changed);
assert(changed.every(c=>!c.v362ExactReviewed&&c.reject.length===0),'Modified out-of-scope cards must never be patched');
console.log('PASS v362: 20 original mock answers + 20 valid alternatives accepted; 40 misconception examples rejected; no new or modified core card IDs.');
