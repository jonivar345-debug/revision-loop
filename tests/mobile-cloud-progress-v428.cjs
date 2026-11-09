'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const backup=require('../progress-backup.js');
const sync=require('../cloud-sync-core.js');
const layout=require('../layout-mode.js');
const cloud=fs.readFileSync('cloud-sync.js','utf8');
const sketch=fs.readFileSync('exam-sketch-v173.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const worker=fs.readFileSync('sw.js','utf8');

const match=cloud.match(/function hasUnsavedAnswer\(\)\{[\s\S]*?\n\}/);
assert.ok(match,'Read the real cloud reload guard rather than a hand-written imitation.');
let elements={},ink=false;
const hasUnsavedAnswer=vm.runInNewContext('('+match[0]+')',{
  el:id=>elements[id]||null,
  window:{RevisionSketch:{hasPendingInk:()=>ink}}
});
const field=(value,visible=true)=>({value,offsetParent:visible?{}:null});
function check(flash,exam,pending,want,label){
 elements={answerInput:flash,examAnswer:exam};
 ink=pending;
 assert.equal(hasUnsavedAnswer(),want,label);
}
check(null,null,false,false,'Blank page permits safe remote refresh');
check(field('A=12 N'),null,false,true,'Typed flashcard answer blocks remote reload');
check(null,field('Show differentiation working'),false,true,'Typed exam answer blocks remote reload');
check(field(''),field('  '),false,false,'Whitespace alone does not block refresh');
check(null,field('hidden',false),false,true,'A typed draft remains protected after switching tabs');
check(null,null,true,true,'An in-progress pen sketch blocks remote reload');
check(field('full model',false),field('working'),false,true,'Visible exam answer wins over hidden card');
assert.match(cloud,/if\(automatic&&hasUnsavedAnswer\(\)\)/);
assert.match(cloud,/phase==='remote-ready'/);
assert.match(sketch,/function hasPendingInk\(\)/);
assert.match(sketch,/window\.RevisionSketch=\{mount,hasPendingInk\}/);
assert.match(sketch,/el\('examSketchCanvas'\)===activeCanvas/);
assert.match(sketch,/strokes\.some\(s=>s\.tool==='pen'\)/);

// Exercise a local backup with the actual progress/profile/settings keys.
const seed={
 revisionLoopProgress5:JSON.stringify({'card-A':{stage:2,due:1800000000000,good:3,history:[{rating:'good'}]}}),
 revisionLoopProfile11:JSON.stringify({lifetimeXp:531,points:245,examResults:{q1:{last:{marks:4,max:5}}},shopOwned:{locations:['london','busan']},errorLog:[{id:'q1'}]}),
 revisionLoopSettings11:JSON.stringify({dailyNew:18,focusSubject:'Physics'})
};
function store(data={}){
 const values={...data};
 return {values,getItem:k=>Object.hasOwn(values,k)?values[k]:null,
   setItem:(k,v)=>{values[k]=String(v)},removeItem:k=>{delete values[k]}};
}
const pc=store({...seed,rl_auth:'1',revisionLoopLayoutModeV1:'pc'});
const snap=backup.snapshot(pc,'2026-11-09T10:00:00Z');
const phone=store({rl_auth:'0',revisionLoopLayoutModeV1:'phone'});
backup.restore(phone,snap);
for(const key of backup.KEYS)assert.equal(phone.getItem(key),seed[key]);
assert.equal(phone.getItem('revisionLoopLayoutModeV1'),'phone','Phone layout stays device-local');
assert.equal(phone.getItem('rl_auth'),'0','PIN unlock state stays device-local');
const onPhone=backup.summary(backup.snapshot(phone));
const fromPc=backup.summary(snap);
assert.deepEqual([onPhone.xp,onPhone.points,onPhone.ownedLocations],
 [fromPc.xp,fromPc.points,fromPc.ownedLocations]);
const modeButtons=['auto','phone','pc'].map(value=>({dataset:{layoutChoice:value},setAttribute(k,v){this[k]=v}}));
const modeDoc={documentElement:{dataset:{}},querySelectorAll:()=>modeButtons};
assert.equal(layout.applyMode(modeDoc,phone,'phone'),'phone');
assert.equal(layout.getMode(pc),'pc');
assert.equal(layout.getMode(phone),'phone');

// Cross-device change detection must not overwrite either copy silently.
const cp={uid:'account-A',revision:8,fingerprint:'saved-local'};
assert.equal(sync.assess({uid:'account-A',checkpoint:cp,remoteRevision:9,
  localFingerprint:'saved-local',remoteFingerprint:'new-phone'}),'remote-ahead');
assert.equal(sync.assess({uid:'account-A',checkpoint:cp,remoteRevision:9,
  localFingerprint:'new-pc',remoteFingerprint:'new-phone'}),'conflict');
assert.equal(sync.assess({uid:'account-A',checkpoint:cp,remoteRevision:8,
  localFingerprint:'new-pc',remoteFingerprint:'saved-local'}),'local-ahead');
assert.equal(sync.assess({uid:'account-A',checkpoint:cp,remoteRevision:8,
  localFingerprint:'restored-backup',remoteFingerprint:'saved-local',manualRestore:true}),'review');
assert.match(cloud,/bound&&bound!==user\.uid/);
assert.match(cloud,/before\.data\(\)\.revision!==oldRevision/);
assert.match(cloud,/backup\.restore\(localStorage,incoming\)/);
assert.match(cloud,/window\.location\.reload\(\)/);

// Responsive, offline and Google UI wiring smoke guards.
assert.match(html,/name="viewport"/);
for(const id of ['cloudGoogleSignIn','cloudGoogleSignOut','cloudUseRemote',
 'cloudDownloadRemote','downloadRevisionBackup','restoreRevisionBackup','cloudSyncStatus']){
 assert.ok(html.includes('id="'+id+'"'),id);
}
assert.match(css,/html\[data-layout-mode="pc"\] \.app-shell\{width:100%\}/);
assert.match(css,/html\[data-layout-mode="phone"\] \.app-shell/);
for(const asset of ['./cloud-sync.js','./cloud-sync-core.js','./exam-sketch-v173.js','./layout-mode.js','./progress-backup.js']){
 assert.ok(worker.includes("'"+asset+"'"),'Offline shell should include '+asset);
}
assert.match(worker,/v428-mobile-cloud-progress-safety/);
console.log('PASS v428: 7 real cloud reload guard probes, phone/PC layout isolation, full progress backup/restore, 4 revision decisions, responsive/offline assets.');
