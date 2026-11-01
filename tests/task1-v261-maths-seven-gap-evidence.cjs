'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8')),old=j('editorial/task1-v244-maths-year1-pure-crosswalk.json');
const ledger=j('editorial/task1-v261-maths-seven-gap-evidence.json'),a=j('maths_first_mock_pure_challenges_v252.json'),b=j('maths_year1_pure_breadth_v260.json');
const app=fs.readFileSync('app.js','utf8'),cards=new Map([...a.cards,...b.cards].map(c=>[c.id,c]));
assert.equal(old.requirements.length,50);
assert.equal(ledger.baseline.requirementsWithExistingCorePromptEvidence,43);
const absent=old.requirements.map((r,i)=>({r,i})).filter(x=>x.r.coreEvidenceIds.length===0);
assert.equal(absent.length,7);assert.equal(ledger.rows.length,7);
const markerStart=app.indexOf('function normalise('),markerEnd=app.indexOf('function importantTokens(',markerStart);
assert(markerStart>=0&&markerEnd>markerStart);
const mark=new Function('window',app.slice(markerStart,markerEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const found=new Set();let accepted=0,rejected=0;
for(const row of ledger.rows){
 const original=old.requirements[row.originalRequirementNumber-1];assert(original);
 assert.equal(original.specRef,row.specRef);assert.equal(original.assessableSkill,row.assessableSkill);
 assert.equal(original.coreEvidenceIds.length,0);
 assert(row.additionalSupplementExampleIds.length>0);found.add(row.originalRequirementNumber-1);
 assert.equal(row.completeSkillAndExaminerMarkingVerified,false);
 for(const id of row.additionalSupplementExampleIds){
  const c=cards.get(id);assert(c,'Missing exact card '+id);
  assert.equal(c.subject,'Maths');assert.equal(c.stage,'AS');assert.equal(c.mock,true);assert.equal(c.active,true);assert.equal(c.specRef,row.specRef);
  assert(c.front.trim().length>18&&c.back.trim().length>0);
  for(const ans of c.accept){assert.equal(mark(c,ans).status,'correct','Example rejected: '+id+': '+ans);accepted++;}
  for(const ans of c.reject){assert.equal(mark(c,ans).status,'wrong','False example credited: '+id+': '+ans);rejected++;}
 }
}
assert.deepEqual([...found].sort((a,b)=>a-b),absent.map(x=>x.i));
assert.equal(accepted,30);assert.equal(rejected,20);
// Independent numerical and algebraic checks for each seven-row representative.
for(let n=-80;n<=80;n++)assert((n*(n+1))%2===0,'Evenness holds for integer '+n);
assert.deepEqual([-1,0,1,2].map(n=>n*n+n),[0,0,2,6]);
assert.equal((-2*1+4),2);
assert.equal(3*3+4*4,25);
assert.equal(4*4+3*3,25);
assert.equal(15*Math.pow(2,4),240);
const antiderivative=x=>x*x*x/3-2*x*x;
assert(Math.abs(-(antiderivative(4)-antiderivative(0))-32/3)<1e-10);
assert.deepEqual([6-1,12-2],[5,10]);
assert.deepEqual([4-1,8-2].map(x=>x*5/3),[5,10]);
assert.equal(ledger.completion.firstYearPureMockFullSpecificationCertified,false);
assert.equal(ledger.completion.task1Complete,false);
console.log('PASS v261: seven old core-only evidence gaps have 10 exact tested supplemental examples, 30 accepted + 20 rejected, without certifying full spec.');
