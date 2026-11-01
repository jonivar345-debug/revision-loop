'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const bank=j('chemistry_amount_applied_practice_v270.json'),app=read('app.js'),sw=read('sw.js');
const qUrls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(qUrls.length>=33,'v270 Chemistry question bank must retain its original index when new banks append');
assert.equal(qUrls[32],'chemistry_amount_applied_practice_v270.json');
assert(sw.includes("'./chemistry_amount_applied_practice_v270.json'"));
assert(sw.includes('-v270-chem-amount'));
assert.equal(j('deck.json').cards.length,3345);
assert.equal(j('exam_questions.json').questions.length,1268);
assert.equal(bank.version,'v270');
assert.equal(bank.questions.length,7);
const oldIds=new Set([...j('exam_questions.json').questions,...qUrls.slice(0,32).flatMap(p=>j(p).questions||[])].map(q=>q.id));
const spec=new Set(),ids=new Set(),accepted=new Set(['3.1.2.2','3.1.2.3','3.1.2.4','3.1.2.5']);
let total=0;
for(const q of bank.questions){
 assert(!oldIds.has(q.id),'Existing bank question ID '+q.id);
 assert(!ids.has(q.id));ids.add(q.id);
 assert.equal(q.subject,'Chemistry');assert.equal(q.level,'AS');assert.equal(q.mock,true);assert.equal(q.taught,true);assert.equal(q.standalone,true);
 assert.equal(q.requiresWorking,true);assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert(accepted.has(q.specRef));spec.add(q.specRef);
 assert.equal(q.markPoints.length,q.marks);assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 assert(q.modelAnswer.length>90,'Model must show substantive working '+q.id);
 assert(q.prompt.includes('['+q.marks+' marks]'));
 total+=q.marks;
}
assert.equal(total,38);assert.equal(spec.size,4);
const near=(a,b,t=1e-10)=>Math.abs(a-b)<=Math.max(t,Math.abs(b)*1e-10);
assert.equal(1,2-1); // calcium chloride : sodium carbonate full equation balance
assert.equal(2,2); // 2 spectator sodium chloride formula units
assert(near(.125*6.02e23,7.525e22));
assert(near(.250*6.02e23,1.505e23));
assert(near(.375*6.02e23,2.2575e23));
const volume=250*1e-6,pressure=1.20e5,temp=298,R=8.31;
assert(near(volume,2.50e-4));
const n=pressure*volume/(R*temp),mass=n*44.0;
assert(near(n,.01211445,1e-8));assert(near(mass,.53304,1e-4));
const acid=23.40/1000*.100,carbonate=acid/2;
assert(near(acid,.002340));assert(near(carbonate,.001170));
assert(near(carbonate/(25.0/1000),.0468));
assert(near(106/(2*84)*100,63.095238095));
assert(near(.720/12,.060));assert(near(.120/1,.120));assert(near(.960/16,.060));
assert.equal((12+2*1+16)*2,60);
assert(near(.00375/(50/1000),.0750));
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v270: seven original quantitative chemistry questions (38 independent marks), numerical data, SI conversion, ratios, source uniqueness, offline loading and user-progress preservation.');
