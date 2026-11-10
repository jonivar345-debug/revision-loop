'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const cloud=fs.readFileSync(path.join(__dirname,'..','cloud-sync.js'),'utf8');
const begin=cloud.indexOf('async function clearSharedDevice(){');
const end=cloud.indexOf('async function useRemote(){',begin);
assert.ok(begin>=0&&end>begin,'shared-computer clearing must exist');
const source=cloud.slice(begin,end);
async function run(kind){
  const events=[];
  const keys=['revisionLoopProgress5','revisionLoopProfile11','revisionLoopSettings11'];
  const first={revisionLoopProgress5:'{}',revisionLoopProfile11:'{}',revisionLoopSettings11:'{}'};
  let values=first;
  const context={
    user:{uid:'account-one'},working:kind==='working',migrationInProgress:false,
    phase:kind==='conflict'?'conflict':'active',active:true,
    checkpoint:()=>({uid:kind==='wrong-user'?'account-two':'account-one',fingerprint:'saved'}),
    current:()=>({values}),
    hasUnsavedAnswer:()=>kind==='draft',
    fingerprint:async()=>kind==='unsaved'?'newer':'saved',
    message:m=>events.push('message'),confirm:()=>kind!=='cancel',
    clearTimeout:()=>events.push('timer-cleared'),saveTimer:3,
    signOut:async()=>{
      events.push('signed-out');
      if(kind==='changed-on-signout')values={...first,revisionLoopProfile11:'{"points":1}'};
    },auth:{},
    core:{KEYS:keys,sameValues:(a,b)=>keys.every(key=>a[key]===b[key])},localStorage:{removeItem:key=>events.push('removed:'+key)},
    BOUND_KEY:'bound',CHECKPOINT_KEY:'checkpoint',MANUAL_RESTORE_KEY:'manual',PRIVATE_MIGRATION_KEY:'private-migration',
    latestRemote:null,window:{location:{reload:()=>events.push('reload')}},
    changePhase:()=>events.push('error')
  };
  vm.runInNewContext(source+'\nthis.run=clearSharedDevice;',context);
  await context.run();
  return events;
}
(async()=>{
  let x=await run('success');
  assert.ok(x.includes('signed-out')&&x.includes('reload'));
  for(const k of ['revisionLoopProgress5','revisionLoopProfile11','revisionLoopSettings11','bound','checkpoint','manual','private-migration','rl_auth'])
    assert.ok(x.includes('removed:'+k),'erase local saved values and cloud linkage: '+k);
  x=await run('changed-on-signout');
  assert.ok(x.includes('signed-out')&&!x.some(s=>s.startsWith('removed:')),'a save during sign-out must be kept');
  for(const kind of ['working','conflict','wrong-user','unsaved','draft','cancel']){
    x=await run(kind);
    assert.ok(!x.includes('signed-out')&&!x.some(s=>s.startsWith('removed:')),'do not erase unconfirmed or cancelled work: '+kind);
  }
  assert.match(cloud,/cloudEraseSharedDevice.*addEventListener\('click'/);
  console.log('Shared-computer clear passed: synced, working, conflict, account mismatch, pending changes, cancel');
})().catch(err=>{console.error(err);process.exitCode=1});
