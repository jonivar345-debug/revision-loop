'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','cloud-sync.js'),'utf8');
const begin=source.indexOf('async function privateSignIn(){');
const end=source.indexOf('async function createPrivateAccount(){',begin);
assert.ok(begin>=0&&end>begin);
const method=source.slice(begin,end);
async function scenario(mode){
  const calls=[],input={value:'ABCDEFGH'};
  const context={
    migrationInProgress:mode==='busy',user:mode==='connected'?{uid:'one'}:null,
    auth:{currentUser:mode==='auth-pending'?{uid:'one'}:null},
    el:id=>id==='cloudPrivateKey'?input:null,
    privateCredentials:async()=>{calls.push('validate');if(mode==='invalid')throw Error('Invalid key');return {email:'internal@example.com',password:'derived'}},
    privateMessage:message=>calls.push('message:'+message),
    setPersistence:async()=>calls.push('session-persistence'),
    browserSessionPersistence:{},
    signInWithEmailAndPassword:async()=>{calls.push('sign-in');if(mode==='wrong')throw {code:'auth/invalid-credential'};return {user:{uid:'two'}}},
    explainPrivateError:error=>error.message||error.code
  };
  vm.runInNewContext(method+'\nthis.run=privateSignIn;',context);
  await context.run();
  return {calls,input,context};
}
(async()=>{
  let x=await scenario('success');
  assert.deepEqual(x.calls.filter(c=>!c.startsWith('message:')),['validate','session-persistence','sign-in']);
  assert.equal(x.input.value,'','successful login clears the key field');
  x=await scenario('wrong');
  assert.ok(x.calls.includes('sign-in'));
  assert.equal(x.input.value,'ABCDEFGH',"failed login must not silently clear the user's entry");
  x=await scenario('invalid');
  assert.ok(!x.calls.includes('sign-in'),'invalid key must fail locally');
  x=await scenario('connected');
  assert.ok(!x.calls.includes('sign-in'),'connected account must not be silently switched');
  x=await scenario('auth-pending');
  assert.ok(!x.calls.includes('sign-in'),'pending Firebase auth callback must not cause a switch');
  x=await scenario('busy');
  assert.ok(!x.calls.includes('sign-in'),'in-progress migration must block a second login');
  console.log('v436 private key login transitions passed: good/wrong/invalid/connected/auth pending/busy');
})().catch(error=>{console.error(error);process.exitCode=1});
