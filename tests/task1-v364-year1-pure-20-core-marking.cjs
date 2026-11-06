'use strict';
// v364: real mock-eligible Year 1 Pure Maths short-card marker probes.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),sw=read('sw.js'),deck=json('deck.json').cards;
const report=json('editorial/task1-v364-year1-pure-20-core-marking.json');
assert.equal(deck.length,3345);assert.equal(new Set(deck.map(c=>c.id)).size,3345);
assert.equal(report.version,'v364');assert.equal(report.rows.length,20);
assert.equal(new Set(report.rows.map(r=>r.id)).size,20);
assert(sw.includes('-v364-year1-pure'),'Offline app cache must update');
assert(app.includes('applyV364PureMathsCoreMarking(cards);'),'The real loader must apply the reviewed markers');
const start=app.indexOf('const V364_YEAR1_PURE_PRECISION='),end=app.indexOf('// v344:',start);
assert(start>0&&end>start);
const patch=new Function(app.slice(start,end)+'\nreturn applyV364PureMathsCoreMarking;')();
const mstart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),mend=app.indexOf('function startMockSession(){',mstart);
assert(mstart>0&&mend>mstart);
const eligible=new Function(app.slice(mstart,mend)+'\nreturn mockEligibleCard;')();
const es=app.indexOf('function normalise('),ee=app.indexOf('function importantTokens(',es);
assert(es>0&&ee>es);
const evaluate=new Function('window',app.slice(es,ee)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const byId=new Map(deck.map(c=>[c.id,c]));
const original=report.rows.map(row=>{
 const c=byId.get(row.id);assert(c,'No original card '+row.id);
 assert.equal(c.subject,'Maths');assert.equal(c.stage,'AS');assert.equal(c.mock,true);
 assert.notEqual(c.active,false);assert(eligible(c),'No excluded Maths/Stats/Mech/Year 2 IDs');
 assert.equal(c.front,row.originalFront);assert.equal(c.back,row.originalBack);
 assert(c.front.length<=145&&c.back.length<=195,'Long answers not permitted in short recall');
 assert.equal(row.accept.length,1);assert.equal(row.reject.length,2);
 return {...c,accept:[...(c.accept||[])],reject:[...(c.reject||[])]};
});
let existingGood=0,good=0,bad=0;
for(let i=0;i<report.rows.length;i++){
 const c=patch([original[i]])[0],row=report.rows[i],prev=byId.get(c.id);
 assert.equal(c.v364ExactReviewed,true);assert.equal(c.front,row.originalFront);assert.equal(c.back,row.originalBack);
 assert(eligible(c));assert.equal(evaluate(c,c.back).status,'correct','Original answer no longer correct: '+c.id);
 for(const x of prev.accept||[]){assert.equal(evaluate(c,x).status,'correct','Previous accepted response regressed: '+c.id);existingGood++;}
 for(const x of row.accept){const v=evaluate(c,x);assert.equal(v.status,'correct','Valid variant rejected: '+c.id+' / '+JSON.stringify(v));good++;}
 for(const x of row.reject){const v=evaluate(c,x);assert.equal(v.status,'wrong','Wrong variant falsely accepted: '+c.id+' / '+JSON.stringify(v));assert.equal(v.score,0);bad++;}
}
assert.equal(existingGood,report.counts.existingAcceptedVariants);assert.equal(good,20);assert.equal(bad,40);
const changed=report.rows.map(row=>({...byId.get(row.id),front:'Different front',mock:false,accept:[],reject:[]}));
patch(changed);
assert(changed.every(c=>!c.v364ExactReviewed&&c.reject.length===0),'Modified/out-of-scope IDs must not be patched');
console.log('PASS v364: 20 model answers + '+existingGood+' existing accepts + 20 valid new responses accepted; 40 incorrect answers rejected.');
