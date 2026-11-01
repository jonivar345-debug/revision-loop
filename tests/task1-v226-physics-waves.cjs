'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v226-physics-waves-audit.json');
const flash=json('physics_waves_reasoning_recall_v226.json');
const exam=json('physics_waves_interference_application_v226.json');
const priorAudit=json('editorial/task1-v159-waves-mock-audit.json');
const deck=json('deck.json'),core=json('exam_questions.json');
const app=read('app.js'),sw=read('sw.js'),html=read('index.html');
assert.equal(audit.version,'v226');assert.equal(audit.limits.task1Complete,false);
assert.equal(priorAudit.rows.length,45);
assert.equal(deck.cards.length,3345);assert.equal(core.questions.length,1268);
assert.equal(flash.cards.length,13);assert.equal(exam.questions.length,1);
assert.equal(audit.newCards,13);assert.equal(audit.newExamMarks,10);
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
assert(html.includes('app.js?v=203'));assert(sw.includes('v226-waves-reasoning'));
for(const name of ['physics_waves_reasoning_recall_v226.json','physics_waves_interference_application_v226.json']){
 assert(app.includes("'./"+name+"'"),'missing app source '+name);
 assert(sw.includes("'./"+name+"'"),'missing offline source '+name);
}
const allNames=s=>[...s.matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
const flashURL=app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/);
const examURL=app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/);
assert(flashURL&&examURL);
const flashNames=allNames(flashURL[1]);
const examNames=allNames(examURL[1]);
assert(flashNames.length>=20,'v226 source was removed');
assert.equal(flashNames[19],'physics_waves_reasoning_recall_v226.json');
const v226Position=examNames.indexOf('physics_waves_interference_application_v226.json');
assert(v226Position>=0,'v226 original practice bank was removed');
const oldFlash=[...deck.cards,...flashNames.slice(0,19).flatMap(p=>json(p).cards||[])];
const oldIds=new Set(oldFlash.map(c=>c.id)),oldFronts=new Set(oldFlash.filter(c=>c.subject==='Physics').map(c=>String(c.front||'').trim().toLowerCase()));
for(let i=0;i<flash.cards.length;i++){
 const c=flash.cards[i];
 assert.equal(c.id,'task1_v226_phy_waves_'+String(i+1).padStart(2,'0'));
 assert(!oldIds.has(c.id),'duplicate card ID '+c.id);oldIds.add(c.id);
 assert(!oldFronts.has(c.front.trim().toLowerCase()),'duplicate Physics prompt '+c.id);oldFronts.add(c.front.trim().toLowerCase());
 assert(c.subject==='Physics'&&c.stage==='AS'&&c.mock===true&&c.taught===true&&c.scope==='mock'&&c.active===true&&c.strictRecall===true);
 assert(['3.3.1.2','3.3.1.3','3.3.2.1','3.3.2.2'].includes(c.specRef));
 assert(c.accept.includes(c.back)&&c.accept.length===4&&c.reject.length===3);
 assert(c.front.length<180&&c.back.length<195);
}
const q=exam.questions[0];
const oldQs=new Set([...core.questions,...examNames.slice(0,v226Position).flatMap(p=>json(p).questions||[])].map(q=>q.id));
assert(!oldQs.has(q.id),'question ID already exists');
assert.equal(q.id,'task1_v226_phy_01');
assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert(q.mock&&q.taught);
assert.equal(q.marks,10);assert.equal(q.markPoints.length,10);
assert.deepEqual(q.markPointMarks,[1,1,1,1,1,1,1,1,1,1]);
assert.equal(q.modelAnswer,q.markPoints.join(' '));
assert.equal(q.sourceVerified,false);
assert.equal(q.verificationLevel,'original-exam-style');
assert(q.prompt.includes('600 lines per mm'));assert(q.prompt.includes('500 nm'));
assert(Math.abs(180/Math.PI*Math.asin(2*500e-9/(1/(600e3)))-36.9)<.1);
assert.equal(Math.floor((1/(600e3))/(500e-9)),3);
const fstart=app.indexOf('function normalise('),fend=app.indexOf('function importantTokens(',fstart);
assert(fstart>0&&fend>fstart);
const evalCard=new Function('window',app.slice(fstart,fend)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accepted=0,rejected=0;
for(const c of flash.cards){
 for(const a of c.accept){assert.equal(evalCard(c,a).status,'correct','valid rejected '+c.id+' '+a);accepted++}
 for(const a of c.reject){assert.notEqual(evalCard(c,a).status,'correct','invalid credited '+c.id+' '+a);rejected++}
 assert.equal(evalCard(c,'').status,'neutral');
}
assert.equal(accepted,52);assert.equal(rejected,39);
const loadStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));');
const loadEnd=app.indexOf(' const added=[',loadStart);assert(loadStart>0&&loadEnd>loadStart);
const loader=app.slice(loadStart,loadEnd);
assert(loader.includes('else if(index===19)'));
const loadCards=new Function('cards','extraFlashBanks',loader+'\nreturn cards;');
const banks=Array.from({length:20},()=>({cards:[]}));banks[19]=flash;
const loaded=loadCards([...deck.cards],banks);
assert.equal(loaded.length,3345+13);
assert.equal(new Set(loaded.map(x=>x.id)).size,loaded.length);
const bad=Array.from({length:20},()=>({cards:[]}));bad[19]={cards:flash.cards.map(x=>({...x}))};
bad[19].cards[0].subject='Chemistry';
bad[19].cards[1].stage='A2';
bad[19].cards[2].mock=false;
bad[19].cards[3].taught=false;
bad[19].cards[4].scope='full';
bad[19].cards[5].active=false;
const filtered=loadCards([...deck.cards],bad);
for(let i=0;i<6;i++)assert(!filtered.some(c=>c.id===flash.cards[i].id),'invalid Physics card entered mock');
assert.equal(loaded.filter(c=>c.subject==='Maths').length,deck.cards.filter(c=>c.subject==='Maths').length);
const a=app.indexOf('function normalise('),b=app.indexOf('function nextSchedule(',a),c=app.indexOf('function evidenceRuleScore(',b),d=app.indexOf('function renderExam(',c);
assert(a>=0&&b>a&&c>b&&d>c);
const marker=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+app.slice(a,b)+app.slice(c,d)+'return examSuggested')();
assert.equal(marker(q,q.modelAnswer).suggested,10,'model answer lost full credit');
assert.equal(marker(q,'').suggested,0);
assert.equal(marker(q,'not sure').suggested,0);
let qAccepted=0,qRejected=0;
const norm=s=>String(s||'').toLowerCase().trim().replace(/[.!?]+$/,'');
for(const [index,alts] of Object.entries(q.reviewedShortAnswerPoints)){
 for(const ans of alts){
  const expected=Object.values(q.reviewedShortAnswerPoints).filter(list=>list.some(x=>norm(x)===norm(ans))).length;
  const got=marker(q,ans);assert.equal(got.suggested,expected,'correct short response '+ans);
  assert.equal(got.preds.filter(Boolean).length,expected,'credited extra point '+ans);
  assert.equal(got.preds[Number(index)],true,'missed intended point '+ans);qAccepted++;
 }
}
for(const wrong of q.reviewedShortAnswerRejects){
 const got=marker(q,wrong);assert.equal(got.suggested,0,'wrong response credited '+wrong);qRejected++;
}
assert.equal(qAccepted,10);assert.equal(qRejected,9);
const eligibility=app.match(/function mockEligibleQuestion\(q\)\{[\s\S]*?\n\}/);
assert(eligibility);const mockEligible=vm.runInNewContext(eligibility[0]+'\nmockEligibleQuestion');
assert(mockEligible(q));
console.log('PASS v226: 13 taught/mock AS Physics waves cards; 52 accepted and 39 rejected variants; original 10-mark application with 19 marking cases; old content/progress intact.');
