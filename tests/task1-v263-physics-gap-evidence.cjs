'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v263-physics-core-gaps-evidence.json');
const a=json('editorial/task1-v241-physics-measurements-crosswalk.json'),b=json('editorial/task1-v242-physics-particles-crosswalk.json');
const measurements=json('physics_measurements_applications_v248.json').cards,particles=json('physics_particles_applications_v243.json').cards;
const maps={'editorial/task1-v241-physics-measurements-crosswalk.json':a,'editorial/task1-v242-physics-particles-crosswalk.json':b};
const cards=new Map([...measurements,...particles].map(c=>[c.id,c]));
assert.equal(a.requirements.length,27);assert.equal(b.requirements.length,48);assert.equal(audit.rows.length,9);
const oldGaps=Object.entries(maps).flatMap(([source,obj])=>obj.requirements.map((r,i)=>({r,i,source})).filter(x=>x.r.coreEvidenceIds.length===0));
assert.equal(oldGaps.length,9);
const inLedger=audit.rows.map(r=>r.crosswalk+':'+r.requirementNumber).sort();
const inOld=oldGaps.map(x=>x.source+':'+(x.i+1)).sort();assert.deepEqual(inLedger,inOld);
const app=read('app.js'),i=app.indexOf('function normalise('),j=app.indexOf('function importantTokens(',i);
assert(i>=0&&j>i);const judge=new Function('window',app.slice(i,j)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let right=0,wrong=0,withCards=0;
const statuses={worked_selected_example:0,component_only:0,unevidenced:0};
for(const row of audit.rows){
 const original=maps[row.crosswalk].requirements[row.requirementNumber-1];assert(original);
 assert.equal(row.specRef,original.specRef);assert.equal(row.skill,original.skill||original.assessableSkill);
 assert.equal(row.fullExamSkillVerified,false);assert.equal(original.coreEvidenceIds.length,0);
 statuses[row.status]++;
 if(row.cardIds.length)withCards++;
 for(const id of row.cardIds){
  const c=cards.get(id);assert(c,'Missing exact case '+id);assert.equal(c.subject,'Physics');
  assert.equal(c.mock,true);assert.equal(c.active,true);assert.equal(c.specRef,row.specRef);
  for(const ans of c.accept){assert.equal(judge(c,ans).status,'correct','Correct rejected '+id+': '+ans);right++;}
  for(const ans of c.reject){assert.equal(judge(c,ans).status,'wrong','Wrong accepted '+id+': '+ans);wrong++;}
 }
}
assert.equal(statuses.unevidenced,1);assert.equal(statuses.component_only,4);assert.equal(statuses.worked_selected_example,4);
assert.equal(withCards,8);assert.equal(right,39);assert.equal(wrong,26);
const missing=audit.rows.find(r=>r.status==='unevidenced');
assert(missing.skill.includes('draw')&&missing.cardIds.length===0);
const close=(x,y)=>Math.abs(x-y)<Math.max(1e-12,Math.abs(y)*1e-6);
assert(close(3.2e-19/6.64e-27,4.819277108e7));
assert.equal(226-4,222);assert.equal(88-2,86);assert.equal(14,14);assert.equal(6+1,7);
assert(close(6.63e-34*3e8/3.2e-19,6.215625e-7));
assert(close(6.63e-34/3.315e-24,2e-10));
assert(close(Math.sqrt(1/4),.5));
assert.equal(3.3-.2,3.0999999999999996);assert(close((2.3-1.9)/2,.2));
assert.equal(audit.completion.fullPhysicsMockSpecCertified,false);
console.log('PASS v263: nine Physics core-only gaps audited; 8 with relevant partial/selected supplemental examples, 1 diagram unverified, 39 accepted + 26 rejected examples.');
