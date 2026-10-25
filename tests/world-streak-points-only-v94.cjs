/* Execute actual Revision Loop daily-streak awarding code in isolation.
   No real account or localStorage data is read or changed. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const cut=(a,b)=>{const i=app.indexOf(a),j=app.indexOf(b,i+1);assert(i>=0&&j>i,a+' source bounds missing');return app.slice(i,j);};
assert(!app.includes("award(bonus,'challenge-streak')"),'Streak still routes through XP award');
const RealDate=Date;
class MockDate extends RealDate{
 constructor(...args){super(...(args.length?args:[2026,9,25,12,0,0]));}
 static now(){return +new RealDate(2026,9,25,12,0,0);}
}
const original={
 points:274,lifetimeXp:975,challengeStreak:4,lastChallengeDate:'2026-10-24',
 challengeBonusDate:'2026-10-24',daily:{'2026-10-25':{reviews:5,newCards:2,flashCorrect:3,examMarks:7}},
 shopOwned:{characters:['lelouch','anime-a'],outfits:['lelouch-default','anime-a-school'],locations:['london','tbilisi','cape_town']},
 equippedCharacter:'anime-a',equippedOutfit:'anime-a-school',equippedLocation:'cape_town',
 examResults:{sample:{mark:12}},errorLog:[{id:'q1'}],dailyChallenges:{}
};
const baseline=JSON.parse(JSON.stringify(original.shopOwned));
let saved=0,rerendered=0;
const toasts=[],writes=[];
const context={
 profile:JSON.parse(JSON.stringify(original)),Date:MockDate,
 progress:{card1:{due:111}},settings:{},activeSession:null,
 currentCardId:'old',currentEvaluation:{},currentFlashAwarded:true,currentExamScore:3,
 save:()=>{saved++;writes.push(JSON.stringify(context.profile));},
 showToast:s=>toasts.push(s),renderAll:()=>rerendered++
};
vm.createContext(context);
vm.runInContext(cut('function now(){','function clamp(')+
 cut('function award(','function levelInfo(')+
 cut('function advanceSession(){','function diagram('),context);
function complete(key){
 context.profile.dailyChallenges[key]={items:[{id:'a'}],index:0,done:false};
 context.activeSession={kind:'daily',key,index:0,items:[{id:'a'}]};
 vm.runInContext('advanceSession()',context);
 assert.equal(context.activeSession,null,'Challenge did not finish');
 assert.equal(context.profile.dailyChallenges[key].done,true);
}
complete('day5');
assert.equal(context.profile.points,278,'Fifth-day streak should give exactly 4 points');
assert.equal(context.profile.lifetimeXp,975,'Streak improperly changed lifetime XP');
assert.equal(context.profile.daily['2026-10-25'].examMarks,7,'Streak altered exam score');
assert.equal(context.profile.challengeStreak,5);
assert.equal(context.profile.lastChallengeDate,'2026-10-25');
assert.equal(context.profile.challengeBonusDate,'2026-10-25');
assert(toasts.at(-1).includes('4 bonus points')&&!toasts.at(-1).includes('XP'),'Wrong points-only toast');
const afterDay5=context.profile.points;
complete('second-attempt-same-day');
assert.equal(context.profile.points,afterDay5,'Repeated daily completion claimed bonus twice');
assert.equal(context.profile.lifetimeXp,975);
assert.equal(context.profile.challengeStreak,5,'Same-day completion incremented streak');
assert.equal(context.profile.lastChallengeDate,'2026-10-25');
assert.equal(context.profile.challengeBonusDate,'2026-10-25');
// Test day one, missed-day reset and existing lifetime XP.
context.profile.points=afterDay5;
context.profile.lastChallengeDate='2026-10-22';context.profile.challengeStreak=99;context.profile.challengeBonusDate='2026-10-22';
complete('broken-chain');
assert.equal(context.profile.challengeStreak,1,'Missed yesterday must reset streak');
assert.equal(context.profile.points,afterDay5,'First-day streak must award zero extra points');
assert.equal(context.profile.lifetimeXp,975);
assert.deepEqual(JSON.parse(JSON.stringify(context.profile.shopOwned)),baseline,'Owned shop items changed');
assert.equal(context.profile.equippedOutfit,original.equippedOutfit);
assert.equal(context.profile.equippedLocation,original.equippedLocation);
assert.equal(context.profile.examResults.sample.mark,12);
assert.equal(context.profile.errorLog.length,1);
assert.equal(context.progress.card1.due,111,'Card progress changed');
assert(saved>=3,'Changes not saved');
// Ordinary revision/exam awarding must continue awarding points AND XP.
context.profile.points=278;
context.profile.lifetimeXp=975;
vm.runInContext("award(6,'exam')",context);
assert.equal(context.profile.points,284,'Ordinary exam points changed');
assert.equal(context.profile.lifetimeXp,981,'Ordinary exam XP changed');
assert.equal(context.profile.daily['2026-10-25'].examMarks,13,'Exam marks credit changed');
assert(toasts.at(-1).includes('XP'),'Ordinary award toast should still show XP');
assert(saved>=4&&rerendered>=3);
console.log('PASS v94: completed streak grants points only; 5-day +4, no double claim, missed day resets, owned IDs and card progress retained, normal exam XP unchanged');
