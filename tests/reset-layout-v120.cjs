'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const layout=require('../layout-mode.js');
const cloud=require('../cloud-sync-core.js');
const backup=require('../progress-backup.js');

const store=new Map();
const storage={
  getItem:k=>store.has(k)?store.get(k):null,
  setItem:(k,v)=>store.set(k,v),
};
const buttons=['auto','phone','pc'].map(mode=>({
  dataset:{layoutChoice:mode},
  attrs:{},
  setAttribute(k,v){this.attrs[k]=v}
}));
const documentStub={
  documentElement:{dataset:{}},
  querySelectorAll:()=>buttons
};
assert.equal(layout.getMode(storage),'auto');
for(const mode of ['phone','pc','auto']){
  assert.equal(layout.applyMode(documentStub,storage,mode),mode);
  assert.equal(layout.getMode(storage),mode);
  assert.equal(documentStub.documentElement.dataset.layoutMode,mode);
  assert.deepEqual(buttons.map(x=>x.attrs['aria-pressed']),['auto','phone','pc'].map(x=>String(x===mode)));
}
assert.equal(layout.normalise('not-valid'),'auto');
const empty=cloud.freshStartSnapshot(new Date('2026-10-26T15:00:00Z'));
backup.validate(empty);
assert.equal(Object.keys(empty.values).length,3);
for(const key of cloud.KEYS)assert.deepEqual(JSON.parse(empty.values[key]),{});
assert.equal(backup.summary(empty).xp,0);
assert.equal(backup.summary(empty).points,0);
assert.equal(backup.summary(empty).ownedLocations,0);
const old={app:'revision-loop',schemaVersion:1,values:{
  revisionLoopProgress5:'{"card":{"stage":4,"good":9}}',
  revisionLoopProfile11:'{"lifetimeXp":750,"points":400,"shopOwned":{"locations":["london","seoul"]}}',
  revisionLoopSettings11:'{"dailyNew":22}'
},createdAt:'2026-10-26T13:00:00Z'};
const archive={format:'revision-loop-pre-reset-archive-v120',createdAt:new Date().toISOString(),local:old,cloud:empty};
assert.equal(backup.summary(backup.fromResetArchive(archive,'local')).xp,750);
assert.equal(backup.summary(backup.fromResetArchive(archive,'cloud')).xp,0);
assert.throws(()=>backup.fromResetArchive(archive,'invalid'),/Choose LOCAL or CLOUD/);
backup.restore(storage,old);
const fresh=cloud.freshStartSnapshot();
backup.restore(storage,fresh);
assert.equal(backup.summary(backup.snapshot(storage)).xp,0);
assert.equal(backup.summary(backup.snapshot(storage)).points,0);
assert.deepEqual(JSON.parse(storage.getItem('revisionLoopProgress5')),{});
const html=fs.readFileSync('index.html','utf8'),css=fs.readFileSync('styles.css','utf8');
const code=fs.readFileSync('cloud-sync.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert.equal((html.match(/data-layout-choice="phone"/g)||[]).length,2);
assert.equal((html.match(/data-layout-choice="pc"/g)||[]).length,2);
assert.match(html,/cloudResetAll/);
assert.match(html,/layout-mode\.js\?v=120/);
assert.match(html,/cloud-sync\.js\?v=120/);
assert.match(html,/progress-backup\.js\?v=120/);
assert.match(css,/data-layout-mode="phone"/);
assert.match(css,/data-layout-mode="pc"/);
assert.match(code,/function resetAllProgress\(/);
assert.match(code,/savePreResetArchive\(local,original\)/);
assert.match(code,/if\(typed!=='RESET'\)/);
assert.ok(code.indexOf('await runTransaction(db,async tx=>',code.indexOf('async function resetAllProgress()')) <
          code.indexOf('backup.restore(localStorage,fresh)',code.indexOf('async function resetAllProgress()')),
 'Cloud reset must commit before local data is replaced.');
assert.match(sw,/cloud-sync\.js/);
console.log('Layout choice + fresh-start progress reset tests passed.');
