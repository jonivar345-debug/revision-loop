'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const core=require('../cloud-sync-core.js');
const values=(progress={},profile={},settings={})=>({
  revisionLoopProgress5:JSON.stringify(progress),
  revisionLoopProfile11:JSON.stringify(profile),
  revisionLoopSettings11:JSON.stringify(settings)
});
const starter={shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},lifetimeXp:0,points:0,reviews:0};
assert.equal(core.isFreshDevice(values()),true,'empty new browser should auto-restore');
assert.equal(core.isFreshDevice(values({},starter)),true,'default starter state is safe to restore');
assert.equal(core.isFreshDevice(values({card1:{stage:1}},starter)),false,'reviewed cards must not be replaced');
assert.equal(core.isFreshDevice(values({}, {...starter,lifetimeXp:10})),false,'XP must not be replaced');
assert.equal(core.isFreshDevice(values({}, {...starter,examResults:{q1:{marks:2}}})),false,'exam marks must not be replaced');
assert.equal(core.isFreshDevice(values({}, {...starter,shopOwned:{...starter.shopOwned,locations:['london','paris']}})),false,'purchases must not be replaced');
assert.equal(core.isFreshDevice(values({}, {...starter,daily:{'2026-11-10':{reviews:1}}})),false,'daily history must not be replaced');
assert.equal(core.isFreshDevice(values({},starter,{dailyNew:20})),false,'custom settings must be reviewed');
assert.equal(core.isFreshDevice(values({}, {...starter,unknownHistoricData:{review:'saved'}})),false,'unknown saved fields must be protected');
assert.equal(core.isFreshDevice({revisionLoopProgress5:'bad JSON'}),false,'corruption must never be auto-overwritten');
assert.equal(core.assess({remoteRevision:8,checkpoint:null,localFingerprint:'local',remoteFingerprint:'remote',uid:'account'}),'first-restore');
const cloud=fs.readFileSync(path.join(__dirname,'..','cloud-sync.js'),'utf8');
const page=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
assert.match(cloud,/core\.isFreshDevice\(local\.values\)&&!hasUnsavedAnswer\(\)/);
assert.match(cloud,/await applyRemote\(remote,true\)/);
assert.match(cloud,/if\(action==='first-restore'\)/);
assert.match(page,/id="cloudQuickSignIn"/);
assert.match(page,/cloud-sync-core\.js\?v=435/);
assert.match(page,/cloud-sync\.js\?v=435/);
console.log('v435 safe new-device auto-restore checks passed');
