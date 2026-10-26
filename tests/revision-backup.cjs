'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const api=require('../progress-backup.js');
const copy=x=>JSON.parse(JSON.stringify(x));
const seed={
 revisionLoopProgress5:JSON.stringify({cardA:{repetitions:4,nextReview:999999999}}),
 revisionLoopProfile11:JSON.stringify({lifetimeXp:4123,points:288,shopOwned:{locations:['busan','london'],characters:['eren'],outfits:['eren-default']},examResults:{testA:{score:14}}}),
 revisionLoopSettings11:JSON.stringify({focusSubject:'Chemistry',dailyGoal:20})
};
const make=(values)=>({
  map:{...values},
  getItem(k){return Object.prototype.hasOwnProperty.call(this.map,k)?this.map[k]:null;},
  setItem(k,v){this.map[k]=String(v);},
  removeItem(k){delete this.map[k];}
});
const base=make(seed);
const snapshot=api.snapshot(base,'2026-10-26T12:00:00.000Z');
assert.equal(snapshot.app,'revision-loop');
assert.deepEqual(Object.keys(snapshot.values).sort(),Object.keys(seed).sort());
assert.equal(api.summary(snapshot).xp,4123);
assert.equal(api.summary(snapshot).points,288);
assert.equal(api.summary(snapshot).ownedLocations,2);
const newStore=make({revisionLoopProfile11:'{"points":0}',rl_auth:'1'});
api.restore(newStore,snapshot);
for(const k of api.KEYS)assert.equal(newStore.getItem(k),seed[k],'The backup must restore every saved field: '+k);
assert.equal(newStore.getItem('rl_auth'),'1','Never touch authentication state');
let bad=copy(snapshot);
bad.values.revisionLoopProfile11='[]';
assert.throws(()=>api.validate(bad),/Invalid saved data/);
bad=copy(snapshot);bad.values.revisionLoopProgress5='not-json';
assert.throws(()=>api.restore(newStore,bad),/Invalid JSON/);
for(const k of api.KEYS)assert.equal(newStore.getItem(k),seed[k],'Invalid backups must not change progress');
const failing=make(seed);
const previous={...failing.map};
let count=0;
const original=failing.setItem.bind(failing);
failing.setItem=function(k,v){if(++count===2)throw Error('quota');original(k,v)};
assert.throws(()=>api.restore(failing,snapshot),/storage is full/);
assert.deepEqual(failing.map,previous,'Failure must roll back after first write');
const html=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const sw=fs.readFileSync(path.resolve(__dirname,'../sw.js'),'utf8');
for(const marker of ['downloadRevisionBackup','restoreRevisionBackup','revisionBackupStatus','progress-backup.js?v=1'])assert(html.includes(marker),marker);
assert(sw.includes("'./progress-backup.js'"));
assert(sw.includes('progress-backup-v1'));
console.log('PASS backup: export, full XP/purchases/settings restore, malformed-file rejection, rollback, same-browser offline controls.');
