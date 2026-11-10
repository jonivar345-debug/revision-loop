'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const core=require('../cloud-sync-core.js');
const source=fs.readFileSync(path.join(__dirname,'..','cloud-sync.js'),'utf8');
const begin=source.indexOf('async function applyRemote(');
const end=source.indexOf('async function firstUpload(',begin);
assert.ok(begin>=0&&end>begin,'read real restore and cloud inspection functions');
const functions=source.slice(begin,end);
const values=(xp=0)=>({
  revisionLoopProgress5:'{}',
  revisionLoopProfile11:xp?JSON.stringify({lifetimeXp:xp}):'{}',
  revisionLoopSettings11:'{}'
});
async function scenario(type){
  const events=[],local={app:'revision-loop',schemaVersion:1,values:values(type==='nonempty'?3:0)};
  const remote={revision:type==='remote-ahead'?2:1,snapshot:{
    app:'revision-loop',schemaVersion:1,values:values(75)
  }};
  const cp=type==='remote-ahead'?{uid:'my-user',revision:1,fingerprint:JSON.stringify(local.values)}:null;
  const storage={
    getItem:key=>key==='bound'?type==='different-account'?'another-user':null:
      key==='manual'?type==='manual-review'?'1':null
  };
  const context={
    core,user:{uid:'my-user'},working:false,active:false,queuedServerCheck:false,
    localStorage:storage,BOUND_KEY:'bound',MANUAL_RESTORE_KEY:'manual',
    auth:{},signOut:async()=>events.push('signout'),
    retrieve:async()=>remote,remoteBackup:r=>r.snapshot,
    current:()=>local,
    fingerprint:async v=>JSON.stringify(v),
    checkpoint:()=>type==='manual-review'?{uid:'my-user',revision:1,fingerprint:'old'}:cp,
    changePhase:p=>events.push('phase:'+p),
    hasUnsavedAnswer:()=>type==='draft',
    applyRemote:null,
    backup:{restore:(_storage,record)=>events.push('restore:'+record.values.revisionLoopProfile11)},
    saveCheckpoint:()=>events.push('checkpoint'),
    window:{location:{reload:()=>events.push('reload')}},
    confirm:()=>true,download:()=>events.push('download'),
    requestCloudCheck:()=>events.push('request-check'),
    queueMicrotask:()=>{}
  };
  vm.runInNewContext(functions+'\nthis.runInspect=inspect;',context);
  await context.runInspect();
  return {events,context};
}
(async()=>{
  let x=await scenario('fresh');
  assert.ok(x.events.some(e=>e.startsWith('restore:')),'fresh second browser restores cloud');
  assert.ok(x.events.includes('checkpoint')&&x.events.includes('reload'));
  x=await scenario('nonempty');
  assert.ok(!x.events.some(e=>e.startsWith('restore:')),'existing work is never overwritten');
  assert.ok(x.events.includes('phase:first-restore'));
  x=await scenario('draft');
  assert.ok(!x.events.includes('reload'),'unfinished answer protected');
  x=await scenario('different-account');
  assert.ok(x.events.includes('signout')&&!x.events.includes('reload'),'wrong local binding rejected');
  x=await scenario('manual-review');
  assert.ok(!x.events.includes('reload'),'manual backup restoration cannot silently overwrite cloud');
  x=await scenario('remote-ahead');
  assert.ok(x.events.some(e=>e.startsWith('restore:')),'unchanged local device fast-forwards to newer cloud');
  console.log('v436 cloud restore state transitions passed: fresh, existing, draft, different account, manual review, remote ahead');
})().catch(err=>{console.error(err);process.exitCode=1});
