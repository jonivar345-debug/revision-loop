'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.match(html,/<select id="mockCount">[\s\S]*?<option value="unlimited">Unlimited/);
for(const length of [10,15,20,30])assert.match(html,new RegExp('<option value="'+length+'"'));
assert.match(css,/\.session-end-btn\{/);
assert.match(sw,/v438-unlimited-mock-sessions/);
assert.match(source,/function endUnlimitedMockSession\(\)/);
assert.match(source,/activeSession\.kind==='mock'&&activeSession\.unlimited/);

const sampleCards=Array.from({length:30},(_,i)=>({id:'card'+i,subject:'Physics',mock:true}));
const sampleQuestions=Array.from({length:10},(_,i)=>({id:'part'+i,groupId:'group'+Math.floor(i/2),groupOrder:i%2,subject:'Physics',mock:true}));
const controls={mockSubject:{value:'Physics'},mockMode:{value:'flash'},mockCount:{value:'unlimited'},answerInput:{value:''}};
const banner={classList:{add(){},remove(){}},textContent:'',appendChild(button){this.button=button;}};
let saved=0,renders=0,decision=true,confirmation='';
const ctx={
 cards:sampleCards,activeSession:null,currentCardId:null,currentEvaluation:null,currentFlashAwarded:false,currentExamScore:0,
 document:{getElementById:id=>id==='sessionBanner'?banner:controls[id]||null,createElement:()=>({})},
 window:{confirm:message=>{confirmation=message;return decision},RevisionScan:{countFor:()=>0},RevisionSketch:{hasPendingInk:()=>false}},
 subjectExam:()=>sampleQuestions,mockEligibleCard:c=>c.mock===true,mockEligibleQuestion:q=>q.mock===true,
 pickRecallCards:(pool,n)=>pool.slice(0,n),weightedPick:(pool,n)=>pool.slice(0,n),
 weakness:()=>0,isDue:()=>false,memoryHealth:()=>1,groupWeakness:()=>1,
 settings:{recallMustKnowFirst:false},urgentRecallMustKnow:()=>false,
 renderAll:()=>{renders++;},save:()=>{saved++;},showToast:()=>assert.fail('There is eligible mock material'),
};
const start=source.indexOf('function buildMockSessionItems('),stop=source.indexOf('function flashEligible(',start);
assert(start>=0&&stop>start,'mock batch generator and starting function are available');
vm.runInNewContext(source.slice(start,stop)+'\nthis.startMockSession=startMockSession;this.buildMockSessionItems=buildMockSessionItems;',ctx);
const advance=source.indexOf('function advanceSession(){'),endAdvance=source.indexOf('function diagram(',advance);
assert(advance>=0&&endAdvance>advance);
vm.runInNewContext(source.slice(advance,endAdvance)+'\nthis.advanceSession=advanceSession;',ctx);
const finish=source.indexOf('function endUnlimitedMockSession(){'),endFinish=source.indexOf('function renderCard(',finish);
assert(finish>=0&&endFinish>finish);
vm.runInNewContext(source.slice(finish,endFinish)+'\nthis.endUnlimitedMockSession=endUnlimitedMockSession;this.renderSessionBanner=renderSessionBanner;',ctx);

ctx.startMockSession();
assert(ctx.activeSession.unlimited,'unlimited selection must be recognised');
assert.equal(ctx.activeSession.items.length,15,'initial session should be a manageable batch');
assert.equal(new Set(ctx.activeSession.items.map(x=>x.id)).size,15);
ctx.activeSession.index=14;
ctx.advanceSession();
assert.equal(ctx.activeSession.index,15);
assert.equal(ctx.activeSession.items.length,30,'another batch must appear without ending the session');
assert.notEqual(ctx.activeSession.done,true);
assert.equal(new Set(ctx.activeSession.items.map(x=>x.id)).size,30,'no repetition before exhausting the available bank');
ctx.activeSession.index=29;
ctx.advanceSession();
assert.equal(ctx.activeSession.items.length,45,'unlimited mode continues after all unique items are used');
assert.notEqual(ctx.activeSession.done,true);
ctx.renderSessionBanner();
assert.match(banner.textContent,/Item 31 · Unlimited/);
assert.equal(banner.button.textContent,'End session');
assert.equal(typeof banner.button.onclick,'function');

controls.answerInput.value='My partly typed answer';
decision=false;
ctx.endUnlimitedMockSession();
assert.notEqual(ctx.activeSession.done,true,'cancel keeps the session alive');
assert.equal(saved,0);
assert.match(confirmation,/unfinished answer/);
decision=true;
ctx.endUnlimitedMockSession();
assert.equal(ctx.activeSession.done,true,'user can finish at any point');
assert.equal(ctx.activeSession.endedEarly,true);
assert.equal(saved,1,'ending an unlimited session saves completed progress');
assert.equal(ctx.currentCardId,null);

// All existing finite lengths remain finite; exam question parts stay together.
controls.mockMode.value='mixed';controls.mockCount.value='10';
ctx.startMockSession();
assert.equal(ctx.activeSession.unlimited,undefined);
const mixed=ctx.activeSession.items;
for(let i=0;i<sampleQuestions.length;i+=2){
 const a=mixed.findIndex(x=>x.id==='part'+i),b=mixed.findIndex(x=>x.id==='part'+(i+1));
 if(a>=0||b>=0)assert.equal(Math.abs(a-b),1,'linked exam question parts must stay adjacent');
}
ctx.activeSession.index=ctx.activeSession.items.length-1;
ctx.advanceSession();
assert.equal(ctx.activeSession.done,true,'finite session still finishes naturally');
console.log('PASS v438: 10/15/20/30 and unlimited, replenishment, no premature repeats, manual finish and saved progress.');
