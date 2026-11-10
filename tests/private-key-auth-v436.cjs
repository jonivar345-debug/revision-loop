'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');
const cloud=fs.readFileSync(path.join(__dirname,'..','cloud-sync.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const begin=cloud.indexOf('const PRIVATE_ALPHABET=');
const end=cloud.indexOf('function privateMessage(',begin);
assert.ok(begin>=0&&end>begin,'private key helpers must exist');
const sandbox={crypto:webcrypto,TextEncoder};
vm.runInNewContext(cloud.slice(begin,end)+'\nthis.helpers={newPrivateKey,cleanPrivateKey,privateCredentials};',sandbox);
const {newPrivateKey,cleanPrivateKey,privateCredentials}=sandbox.helpers;
(async()=>{
  const key=newPrivateKey();
  assert.equal(key.length,8);
  assert.equal(cleanPrivateKey(key),key);
  assert.equal(cleanPrivateKey('  '+key.slice(0,4)+'-'+key.slice(4)+' '),key);
  for(const invalid of ['0481','048154','123456','a'.repeat(8),'']){
    assert.throws(()=>cleanPrivateKey(invalid),'weak/invalid keys must be rejected');
  }
  const legacy='ABCDEFGHJKLMNPQRSTUVWXYZ';
  assert.equal(cleanPrivateKey(legacy),legacy,'previous longer keys must remain usable');
  const credentials=await privateCredentials(key);
  assert.match(credentials.email,/^rl-[a-f0-9]{64}@revision-loop\.invalid$/);
  assert.match(credentials.password,/^rl-private-v436:[A-Z2-9]{8}$/);
  assert.deepEqual(await privateCredentials(key),credentials,'same key must find same account on another computer');
  assert.match(cloud,/createUserWithEmailAndPassword\(auth,credentials\.email,credentials\.password\)/);
  assert.match(cloud,/signInWithEmailAndPassword\(auth,credentials\.email,credentials\.password\)/);
  assert.match(cloud,/tx\.set\(ref,\{payload,revision:1,updatedAt:serverTimestamp\(\)\}\)/);
  assert.match(cloud,/saveCheckpoint\(user\.uid,1,hash\)/);
  assert.match(html,/id="cloudPrivateSignIn"/);
  assert.match(html,/id="cloudCreatePrivateKey"/);
  assert.match(html,/cloud-sync\.js\?v=436/);
  console.log('v436 key generation, authentication derivation, migration and UI checks passed');
})().catch(error=>{console.error(error);process.exitCode=1});
