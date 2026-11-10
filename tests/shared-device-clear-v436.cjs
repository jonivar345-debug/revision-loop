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
  const context={
    user:{uid:'account-one'},working:kind==='working',migrationInProgress:false,
    phase:kind==='conflict'?'conflict':'active',active:true,
    checkpoint:()=>({uid:kind==='wrong-user'?'account-two':'account-one',fingerprint:'saved'}),
    current:()=>({values:{revisionLoopProgress5:'{}',revisionLoopProfile11:'{}',revisionLoopSettings11:'{}'}}),
    fingerprint:async()=>kind==='unsaved'?'newer':'saved',
    message:m=>events.push('message'),confirm:()=>kind!=='cancel',
    clearTimeout:()=>events.push('timer-cleared'),saveTimer:3,
    signOut:async()=>events.push('signed-out'),auth:{},
    core:{KEYS:keys},localStorage:{removeItem:key=>events.push('removed:'+key)},
    BOUND_KEY:'bound',CHECKPOINT_KEY:'checkpoint',MANUAL_RESTORE_KEY:'manual',
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
  for(const k of ['revisionLoopProgress5','revisionLoopProfile11','revisionLoopSettings11','bound','checkpoint','manual'])
    assert.ok(x.includes('removed:'+k),'erase local saved values and cloud linkage: '+k);
  for(const kind of ['working','conflict','wrong-user','unsaved','cancel']){
    x=await run(kind);
    assert.ok(!x.includes('signed-out')&&!x.some(s=>s.startsWith('removed:')),'do not erase unconfirmed or cancelled work: '+kind);
  }
  assert.match(cloud,/cloudEraseSharedDevice.*addEventListener\('click'/);
  console.log('Shared-computer clear passed: synced, working, conflict, account mismatch, pending changes, cancel');
})().catch(err=>{console.error(err);process.exitCode=1});
