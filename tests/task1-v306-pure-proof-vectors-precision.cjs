'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const app=fs.readFileSync('app.js','utf8'),core=j('deck.json');
const paths=['maths_first_mock_pure_applied_v245.json','maths_first_mock_pure_challenges_v252.json','maths_year1_pure_breadth_v260.json'];
const ids=[
'task1_v245_maths_pure_applied_01','task1_v245_maths_pure_applied_02','task1_v245_maths_pure_applied_03','task1_v245_maths_pure_applied_06','task1_v245_maths_pure_applied_09','task1_v245_maths_pure_applied_10',
'task1_v252_maths_pure_applied_01','task1_v252_maths_pure_applied_02','task1_v252_maths_pure_applied_03','task1_v252_maths_pure_applied_07','task1_v252_maths_pure_applied_08','task1_v252_maths_pure_applied_11','task1_v252_maths_pure_applied_12',
'task1_v260_maths_year1_01','task1_v260_maths_year1_02','task1_v260_maths_year1_03','task1_v260_maths_year1_36','task1_v260_maths_year1_37','task1_v260_maths_year1_38'
];
assert.equal(ids.length,19);
const a=app.indexOf('function normalise('),b=app.indexOf('function importantTokens(',a);
assert(a>0&&b>a);
const mark=new Function('window',app.slice(a,b)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const files=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
const start=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),end=app.indexOf(' const added=[',start);
const all=new Function('cards','extraFlashBanks',app.slice(start,end)+'\nreturn cards;')([...core.cards],files.map(j));
assert.equal(all.length,4313);
const eligStart=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),eligEnd=app.indexOf('function startMockSession(){',eligStart);
const eligible=new Function(app.slice(eligStart,eligEnd)+'\nreturn mockEligibleCard;')();
const by=new Map(all.map(c=>[c.id,c]));
const input=paths.flatMap(p=>j(p).cards||[]);
const review=new Map(input.map(c=>[c.id,c]));
let accepted=0, rejected=0, counts={};
for(const id of ids){
 const c=review.get(id),loaded=by.get(id);
 assert(c&&loaded,'card must exist and load: '+id);
 assert.equal(loaded.front,c.front,id+' loaded prompt should match file');
 assert.equal(c.subject,'Maths');assert.equal(c.stage,'AS');
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.strictRecall,true);
 assert(eligible(c),'mock eligible: '+id);
 assert(c.front.length<=110,'short prompt: '+id);
 assert.equal(mark(c,c.back).status,'correct',id+' model answer');
 for(const good of c.accept){
  const out=mark(c,good);
  assert.equal(out.status,'correct',id+' correct alias '+good+' marked '+JSON.stringify(out));
  accepted++;
 }
 for(const bad of c.reject){
  const out=mark(c,bad);
  assert.equal(out.status,'wrong',id+' wrong alternative '+bad+' marked '+JSON.stringify(out));
  rejected++;
 }
 const origin=paths.find(p=>(j(p).cards||[]).some(x=>x.id===id));
 counts[origin]=(counts[origin]||0)+1;
}
assert.deepEqual(Object.values(counts),[6,7,6]);
assert.equal(accepted,108);assert.equal(rejected,68);
// Verify the key mathematical relationships independently, not just marking stored text.
for(let n=-50;n<=50;n++){
 assert.equal(Math.abs((n**3-n)%6),0,'n³−n always divisible by 6');
 assert.equal(Math.abs((n*(n+1))%2),0,'consecutive-integer product always even');
 if(n%2===0)assert.equal(Math.abs(n**3%8),0,'even cube divisible by 8');
 if(Math.abs(n%2)===1)assert.equal(((n*n-1)%8+8)%8,0,'odd square one mod eight');
}
const vec=(A,B)=>[B[0]-A[0],B[1]-A[1]];
const AB=vec([1,2],[4,8]),AC=vec([1,2],[6,12]);
assert.deepEqual(AB,[3,6]);assert.deepEqual(AC,[5,10]);
assert.equal(3*AC[0],5*AB[0]);assert.equal(3*AC[1],5*AB[1]);
assert.deepEqual([2+(14-2)/4,3+(-1-3)/4],[5,2]);
assert.deepEqual([1+2/5*(11-1),4+2/5*(-6-4)],[5,0]);
console.log('PASS v306: 19 concise first-mock Pure proof/vector cards, 108 correct and 68 wrong examples with real marker; all math invariants and live mock selector verified.');
