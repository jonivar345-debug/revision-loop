'use strict';
// v365: first-school-mock eligible original AQA Physics short card marking precision.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json').cards;
const audit=json('editorial/task1-v365-physics-20-original-marker-review.json');
assert.equal(deck.length,3345);assert.equal(new Set(deck.map(x=>x.id)).size,3345);
assert.equal(audit.version,'v365');assert.equal(audit.rows.length,20);
assert.equal(new Set(audit.rows.map(x=>x.id)).size,20);
assert(sw.includes('-v365-physics20'),'Offline cache should refresh');
assert(app.includes('applyV365PhysicsCoreMarkerProbes(cards);'),'Loader must call v365 calibration');
const st=app.indexOf('const V365_PHYSICS_CORE_PROBES='),ed=app.indexOf('// v344:',st);
assert(st>0&&ed>st);
const patch=new Function(app.slice(st,ed)+'\nreturn applyV365PhysicsCoreMarkerProbes;')();
const es=app.indexOf('function normalise('),ee=app.indexOf('function importantTokens(',es);
assert(es>0&&ee>es);
const evaluate=new Function('window',app.slice(es,ee)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const ms=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),me=app.indexOf('function startMockSession(){',ms);
assert(ms>0&&me>ms);
const eligible=new Function(app.slice(ms,me)+'\nreturn mockEligibleCard;')();
const byId=new Map(deck.map(c=>[c.id,c]));
const originals=audit.rows.map(r=>{
 const c=byId.get(r.id);assert(c,'Missing original ID '+r.id);
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert.equal(c.mock,true);
 assert.notEqual(c.active,false);assert(eligible(c),'Must actually be in first Physics school mock');
 assert.equal(c.front,r.originalFront);assert.equal(c.back,r.originalBack);
 assert(c.front.length<=140&&c.back.length<=200,'No long-response cards masquerading as recall');
 assert.equal((c.accept||[]).length,0);assert.equal((c.reject||[]).length,0);
 assert.equal(r.accept.length,1);assert.equal(r.reject.length,2);
 return {...c,accept:[],reject:[]};
});
const patched=patch(originals);
let accepted=0,rejected=0;
for(let i=0;i<patched.length;i++){
 const c=patched[i],r=audit.rows[i];
 assert.equal(c.v365ExactReviewed,true);assert.equal(c.front,r.originalFront);assert.equal(c.back,r.originalBack);assert(eligible(c));
 assert.equal(evaluate(c,c.back).status,'correct','Original model answer rejected: '+c.id);
 for(const s of r.accept){const mark=evaluate(c,s);assert.equal(mark.status,'correct','Valid answer rejected: '+c.id+' / '+JSON.stringify(mark));accepted++;}
 for(const s of r.reject){const mark=evaluate(c,s);assert.equal(mark.status,'wrong','Incorrect answer accepted: '+c.id+' / '+JSON.stringify(mark));assert.equal(mark.score,0);rejected++;}
}
assert.equal(accepted,20);assert.equal(rejected,40);
const changed=audit.rows.map(r=>({...byId.get(r.id),front:'Other question',mock:false,accept:[],reject:[]}));
patch(changed);
assert(changed.every(c=>!c.v365ExactReviewed&&c.reject.length===0),'Changed original or mock-excluded cards must remain unchanged');
console.log('PASS v365: 20 original Physics model answers, 20 new valid answers accepted, 40 wrong responses rejected against production marker.');
