'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v225-physics-fibre-audit.json');
const flash=json('physics_optical_fibre_precision_recall_v225.json');
const exam=json('physics_fibre_signal_application_v225.json');
const waves=json('editorial/task1-v159-waves-mock-audit.json');
const core=json('deck.json'),questions=json('exam_questions.json');
const app=read('app.js'),sw=read('sw.js'),html=read('index.html');
assert.equal(audit.version,'v225');assert.equal(audit.limitations.task1Complete,false);
assert.equal(waves.rows.length,45);assert.equal(core.cards.length,3345);assert.equal(questions.questions.length,1268);
assert.equal(flash.cards.length,7);assert.equal(exam.questions.length,1);
const q=exam.questions[0];assert.equal(q.id,'task1_v225_phy_01');
assert.equal(q.marks,10);assert.equal(q.markPoints.length,10);
assert.equal(q.markPointMarks.length,10);assert(q.markPointMarks.every(n=>n===1));
assert.equal(q.modelAnswer,q.markPoints.join(' '));
assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.specRef,'3.3.2.3');
assert.equal(q.mock,true);assert.equal(q.taught,true);
assert.equal(q.sourceVerified,false);assert.equal(q.verificationLevel,'original-exam-style');
assert(q.prompt.includes('step-index'));assert(!q.prompt.includes('graded-index'));
assert(questions.questions.some(x=>x.id==='mock_v159_03'),'existing fibre question retained');
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
assert(html.includes('app.js?v=203'));
assert(sw.includes('v225-fibre-physics'));
for(const n of ['physics_optical_fibre_precision_recall_v225.json','physics_fibre_signal_application_v225.json']){
 assert(app.includes("'./"+n+"'"),'loader omits '+n);
 assert(sw.includes("'./"+n+"'"),'offline cache omits '+n);
}
const allFlash=app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/);
assert(allFlash,'missing flash URLs');
const flashNames=[...allFlash[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert.equal(flashNames.length,19);
assert.equal(flashNames[18],'physics_optical_fibre_precision_recall_v225.json');
const oldCoreAndExtra=[...core.cards,...flashNames.slice(0,-1).flatMap(p=>json(p).cards||[])];
const previousIds=new Set(oldCoreAndExtra.map(x=>x.id));
const previousFronts=new Set(oldCoreAndExtra.filter(x=>x.subject==='Physics').map(x=>String(x.front).toLowerCase().trim()));
for(let i=0;i<7;i++){
 const c=flash.cards[i];
 assert.equal(c.id,'task1_v225_phy_fibre_'+String(i+1).padStart(2,'0'));
 assert(!previousIds.has(c.id),'duplicate ID '+c.id);previousIds.add(c.id);
 assert(!previousFronts.has(c.front.toLowerCase().trim()),'duplicate front '+c.id);previousFronts.add(c.front.toLowerCase().trim());
 assert(c.subject==='Physics'&&c.stage==='AS'&&c.specRef==='3.3.2.3');
 assert(c.mock===true&&c.taught===true&&c.scope==='mock'&&c.active===true&&c.strictRecall===true);
 assert(c.accept.includes(c.back)&&c.accept.length>=4&&c.reject.length>=3);
 assert(c.front.length<180&&c.back.length<190);
}
const possibleQ=app.match(/const EXTRA_PRACTICE_URLS=\[([^\]]+)\];/);
assert(possibleQ);const oldQNames=[...possibleQ[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]).filter(p=>p!=='physics_fibre_signal_application_v225.json');
const oldQIds=new Set([...questions.questions,...oldQNames.flatMap(p=>(json(p).questions||[]))].map(x=>x.id));
assert(!oldQIds.has(q.id),'duplicate supplementary question ID');
const fa=app.indexOf('function normalise('),fb=app.indexOf('function importantTokens(',fa);
assert(fa>0&&fb>fa);
const evalCard=new Function('window',app.slice(fa,fb)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let accepted=0,rejected=0;
for(const c of flash.cards){
 for(const good of c.accept){assert.equal(evalCard(c,good).status,'correct','rejects valid '+c.id+' '+good);accepted++}
 for(const bad of c.reject){assert.notEqual(evalCard(c,bad).status,'correct','credits invalid '+c.id+' '+bad);rejected++}
 assert.equal(evalCard(c,'').status,'neutral');
}
const loadStart=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),loadEnd=app.indexOf(' const added=[',loadStart);
assert(loadStart>0&&loadEnd>loadStart);
const loader=app.slice(loadStart,loadEnd);
assert(loader.includes('else if(index===18)'));
const loadCards=new Function('cards','extraFlashBanks',loader+'\nreturn cards;');
const banks=Array.from({length:19},()=>({cards:[]}));banks[18]=flash;
const loaded=loadCards([...core.cards],banks);
assert.equal(loaded.length,3345+7);
assert.equal(new Set(loaded.map(c=>c.id)).size,loaded.length);
const bad=Array.from({length:19},()=>({cards:[]}));bad[18]={cards:flash.cards.map(x=>({...x}))};
bad[18].cards[0].subject='Chemistry';
bad[18].cards[1].stage='A2';
bad[18].cards[2].mock=false;
bad[18].cards[3].taught=false;
bad[18].cards[4].scope='full';
bad[18].cards[5].active=false;
const excluded=loadCards([...core.cards],bad);
for(let i=0;i<6;i++)assert(!excluded.some(c=>c.id===flash.cards[i].id),'invalid Physics mock card leaked');
const a=app.indexOf('function normalise('),b=app.indexOf('function nextSchedule(',a);
const c=app.indexOf('function evidenceRuleScore(',b),d=app.indexOf('function renderExam(',c);
assert(a>=0&&b>a&&c>b&&d>c);
const marker=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+app.slice(a,b)+app.slice(c,d)+'return examSuggested')();
assert.equal(marker(q,q.modelAnswer).suggested,10,'full correct model not credited');
assert.equal(marker(q,'').suggested,0);
assert.equal(marker(q,'not sure').suggested,0);
let goodQuestions=0,badQuestions=0;
const canon=x=>String(x).toLowerCase().replace(/[.!?]+$/,'').trim();
for(const [key,alts] of Object.entries(q.reviewedShortAnswerPoints)){
 for(const alt of alts){
  const expected=Object.values(q.reviewedShortAnswerPoints).filter(group=>group.some(s=>canon(s)===canon(alt))).length;
  const result=marker(q,alt);
  assert.equal(result.suggested,expected,'wrong short-answer score '+alt);
  assert.equal(result.preds.filter(Boolean).length,expected,'unexpected marked points '+alt);
  assert.equal(result.preds[Number(key)],true,'missing intended point '+alt);
  goodQuestions++;
 }
}
for(const invalid of q.reviewedShortAnswerRejects){
 const result=marker(q,invalid);
 assert.equal(result.suggested,0,'wrong answer got points '+invalid);badQuestions++;
}
assert.equal(goodQuestions,10);assert.equal(badQuestions,6);
const eligiblePart=app.match(/function mockEligibleQuestion\(q\)\{[\s\S]*?\n\}/);
assert(eligiblePart);const eligible=vm.runInNewContext(eligiblePart[0]+'\nmockEligibleQuestion');
assert(eligible(q),'new question missing from mock');
assert.equal(loaded.filter(x=>x.subject==='Maths').length,core.cards.filter(x=>x.subject==='Maths').length);
console.log('PASS v225: 7 AS Physics fibre recall cards ('+accepted+' accepted, '+rejected+' rejected), 10-mark original mock question with 16 scored cases; eligibility, no prompt or ID duplicates, 3,345 core cards, 1,268 core questions and saved progress intact.');
