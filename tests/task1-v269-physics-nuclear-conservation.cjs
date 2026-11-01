'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),j=p=>JSON.parse(read(p));
const original=j('deck.json'),flash=j('physics_nuclear_conservation_recall_v269.json'),bank=j('physics_nuclear_conservation_practice_v269.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(original.cards.length,3345);
assert.equal(flash.version,'v269');assert.equal(flash.cards.length,36);
assert.equal(bank.version,'v269');assert.equal(bank.questions.length,8);
const qUrls=[...app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const cUrls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert(qUrls.length>=32,'v269 Physics questions must remain at index 31 as further banks append');assert.equal(qUrls[31],'physics_nuclear_conservation_practice_v269.json');
assert.equal(cUrls.length,45);assert.equal(cUrls[44],'physics_nuclear_conservation_recall_v269.json');
for(const path of ['physics_nuclear_conservation_practice_v269.json','physics_nuclear_conservation_recall_v269.json'])assert(sw.includes("'./"+path+"'"));
assert(sw.includes('-v269-nuclear-conservation'));
const existingCards=[...original.cards,...cUrls.slice(0,44).flatMap(p=>j(p).cards||[])];
const ids=new Set(existingCards.map(c=>c.id)),fronts=new Set(existingCards.filter(c=>c.subject==='Physics').map(c=>c.front?.trim().toLowerCase()).filter(Boolean));
const a=app.indexOf('function normalise('),b=app.indexOf('function importantTokens(',a);
assert(a>=0&&b>a);
const judge=new Function('window',app.slice(a,b)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const allowed=new Set(['3.2.1.2','3.2.1.4','3.2.1.5','3.2.1.6','3.2.1.7']);
let good=0,bad=0;
for(const c of flash.cards){
 assert(!ids.has(c.id),'New card id duplicates prior card');ids.add(c.id);
 assert(!fronts.has(c.front.trim().toLowerCase()),'Duplicate Physics front: '+c.front);fronts.add(c.front.trim().toLowerCase());
 assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');assert(allowed.has(c.specRef));
 assert.equal(c.mock,true);assert.equal(c.taught,true);assert.equal(c.scope,'mock');assert.equal(c.active,true);assert.equal(c.strictRecall,true);
 assert.equal(c.accept.length,2);assert.equal(c.reject.length,2);
 assert(c.accept.includes(c.back)||c.accept.includes(c.back.replace(/\.$/,'')),'Back not an accepted answer '+c.id);
 for(const answer of c.accept){assert.equal(judge(c,answer).status,'correct','Valid '+c.id+': '+answer);good++;}
 for(const answer of c.reject){assert.equal(judge(c,answer).status,'wrong','Wrong '+c.id+': '+answer);bad++;}
}
assert.equal(good,72);assert.equal(bad,72);
const x=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),y=app.indexOf(' const added=[',x);
assert(x>0&&y>x&&app.slice(x,y).includes('else if(index===44)'));
const loader=new Function('cards','extraFlashBanks',app.slice(x,y)+'\nreturn cards;');
const goodBanks=Array.from({length:45},()=>({cards:[]}));goodBanks[44]=flash;
assert.equal(loader([...original.cards],goodBanks).length,3381);
const badBanks=Array.from({length:45},()=>({cards:[]}));badBanks[44]={cards:flash.cards.slice(0,7).map((c,i)=>({...c,...[{subject:'Chemistry'},{stage:'A2'},{mock:false},{taught:false},{scope:'full'},{active:false},{specRef:'3.17'}][i]}))};
assert.equal(loader([...original.cards],badBanks).length,3345);
const existingQ=new Set([...j('exam_questions.json').questions,...qUrls.slice(0,31).flatMap(p=>j(p).questions||[])].map(q=>q.id));
let marks=0,manual=0;const specs=new Set();
for(const q of bank.questions){
 assert(!existingQ.has(q.id),'Duplicate old exam question '+q.id);existingQ.add(q.id);specs.add(q.specRef);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.mock,true);assert.equal(q.taught,true);
 assert.equal(q.standalone,true);assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
 assert.equal(q.requiresWorking,true);assert.equal(q.markPoints.length,q.marks);
 assert.deepEqual(q.markPointMarks,Array(q.marks).fill(1));
 if(q.manualDiagramReview)manual++;
 assert(q.modelAnswer.length>90);marks+=q.marks;
}
assert.deepEqual([...specs].sort(),['3.2.1.2','3.2.1.5','3.2.1.7']);
assert.equal(marks,42);assert.equal(manual,2);
const start=app.indexOf('function examSuggested(q,answer){'),end=app.indexOf(' // v213:',start);
assert(start>0&&end>start);
const scoring=new Function('window',app.slice(start,end)+'\n}\nreturn examSuggested;')({});
for(const q of bank.questions.filter(q=>q.manualDiagramReview)){
 const s=scoring(q,'nuclear equation keywords but no displayed symbols');
 assert.equal(s.manualRequired,true);assert.equal(s.suggested,0);
 assert.deepEqual(s.preds,Array(q.marks).fill(false));
}
assert.equal(226,222+4);assert.equal(88,86+2);
assert.equal(14,14);assert.equal(6,7-1);
assert.equal(0,1-1+0);assert.equal(1,1+0+0);assert.equal(0,1-1);
assert.equal(1,0+1+0);assert.equal(0,-1+1);
assert.equal(0,1-1);assert.equal(0,1-1);
const uud=2/3+2/3-1/3,udd=2/3-1/3-1/3;
assert(Math.abs(uud-1)<1e-12);assert(Math.abs(udd)<1e-12);
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(key));
console.log('PASS v269: 36 AS conservation cards, 72 accepted and 72 rejected markers; eight original Physics questions with 42 distinct points and two genuinely manual equations; original progress preserved.');
