'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','cloud-sync.js'),'utf8');
const begin=source.indexOf('async function createPrivateAccount(){');
const end=source.indexOf('async function connect(){',begin);
assert.ok(begin>=0&&end>begin,'find actual account creation function');
const fn=source.slice(begin,end);
async function scenario(mode){
  const events=[],input={value:'ABCDEFGH'},snapshot={
    app:'revision-loop',schemaVersion:1,values:{
      revisionLoopProgress5:'{}',revisionLoopProfile11:'{}',revisionLoopSettings11:'{}'
    }
  };
  const context={
    migrationInProgress:false,working:false,user:null,active:true,
    window:{confirm:()=>mode!=='cancel'},el:id=>id==='cloudPrivateKey'?input:null,
    privateCredentials:async()=>({email:'test@example.com',password:'test'}),
    privateMessage:msg=>events.push(['message',msg]),
    current:()=>snapshot,
    download:()=>events.push(['backup']),
    fingerprint:async()=> 'fingerprint',
    TextEncoder,clearTimeout:()=>{},saveTimer:0,
    stopRemoteListener:()=>events.push(['listener-stop']),
    setPersistence:async()=>events.push(['persistence']),
    auth:{},browserSessionPersistence:{},db:{},
    createUserWithEmailAndPassword:async()=>{events.push(['auth-create']);return {user:{uid:'new-user'}}},
    remoteRef:()=>({path:'new-user/state/bundle'}),
    runTransaction:async(_db,callback)=>{
      events.push(['transaction']);
      if(mode==='upload-fail')throw Error('server unavailable');
      return callback({
        get:async()=>({exists:()=>false}),
        set:()=>events.push(['cloud-commit'])
      });
    },
    serverTimestamp:()=>0,
    latestRemote:null,
    saveCheckpoint:()=>{events.push(['checkpoint']);if(mode==='checkpoint-fail')throw Error('browser storage full')},
    localStorage:{removeItem:()=>events.push(['remove-manual-restore'])},
    MANUAL_RESTORE_KEY:'revisionLoopCloudManualRestorePending',
    changePhase:(phase)=>events.push(['phase',phase]),
    watchRemote:()=>events.push(['watch-remote']),
    deleteUser:async()=>events.push(['delete-new-auth-user']),
    signOut:async()=>events.push(['signout']),
    explainPrivateError:err=>err.message
  };
  if(mode==='oversized'){
    context.current=()=>({...snapshot,values:{...snapshot.values,revisionLoopProgress5:'x'.repeat(801000)}});
  }
  vm.runInNewContext(fn+'\nthis.run=createPrivateAccount;',context);
  await context.run();
  return {events,context};
}
(async()=>{
  let x=await scenario('success');
  let events=x.events.map(x=>x[0]);
  assert.ok(events.indexOf('backup')<events.indexOf('auth-create'),'backup is prepared first');
  assert.ok(events.indexOf('auth-create')<events.indexOf('cloud-commit'),'auth created before upload');
  assert.ok(events.indexOf('cloud-commit')<events.indexOf('checkpoint'),'checkpoint follows uploaded data');
  assert.ok(!events.includes('delete-new-auth-user'),'successful upload must retain account');
  assert.equal(x.context.active,true);
  assert.equal(x.context.migrationInProgress,false);
  x=await scenario('upload-fail');events=x.events.map(x=>x[0]);
  assert.ok(!events.includes('delete-new-auth-user'),'uncertain upload outcome must retain the auth account');
  assert.ok(x.events.some(e=>e[0]==='phase'&&e[1]==='error'),'failed upload requires recovery with the same key');
  assert.ok(!events.includes('checkpoint'),'failed upload cannot checkpoint');
  assert.equal(x.context.active,false);
  x=await scenario('checkpoint-fail');events=x.events.map(x=>x[0]);
  assert.ok(events.includes('cloud-commit'),'cloud has been committed');
  assert.ok(!events.includes('delete-new-auth-user'),'local failure must never destroy uploaded cloud progress');
  assert.equal(x.context.active,false);
  x=await scenario('oversized');events=x.events.map(x=>x[0]);
  assert.ok(!events.includes('auth-create'),'oversized state rejected before registering user');
  x=await scenario('cancel');events=x.events.map(x=>x[0]);
  assert.ok(!events.includes('backup')&&!events.includes('auth-create'),'cancelled setup has no effects');
  console.log('v436 private-key enrollment state transitions passed: success, safe upload recovery, local error, size, cancel');
})().catch(error=>{console.error(error);process.exitCode=1});
