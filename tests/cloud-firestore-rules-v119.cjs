'use strict';
// Run against the local Firestore emulator only. Never a live Firebase project.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {initializeTestEnvironment, assertFails, assertSucceeds} = require('@firebase/rules-unit-testing');
const {doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp} = require('firebase/firestore');

async function run(){
  const testEnv=await initializeTestEnvironment({
    projectId:'demo-revision-loop',
    firestore:{rules:fs.readFileSync('firestore.rules','utf8'),host:'127.0.0.1',port:8080}
  });
  try{
    const alice=testEnv.authenticatedContext('alice').firestore();
    const bob=testEnv.authenticatedContext('bob').firestore();
    const publicDb=testEnv.unauthenticatedContext().firestore();
    const ownerRecord=doc(alice,'users','alice','state','bundle');
    const stolenRecord=doc(bob,'users','alice','state','bundle');
    const strangerRecord=doc(publicDb,'users','alice','state','bundle');
    const initial={payload:'{"app":"revision-loop","schemaVersion":1,"values":{}}',revision:1,updatedAt:serverTimestamp()};
    await assertFails(getDoc(strangerRecord));
    await assertFails(setDoc(strangerRecord,initial));
    await assertFails(setDoc(stolenRecord,initial));
    await assertSucceeds(setDoc(ownerRecord,initial));
    await assertSucceeds(getDoc(ownerRecord));
    await assertFails(getDoc(stolenRecord));
    await assertFails(updateDoc(stolenRecord,{revision:2,updatedAt:serverTimestamp()}));
    await assertFails(updateDoc(ownerRecord,{revision:3,updatedAt:serverTimestamp()}));
    await assertSucceeds(updateDoc(ownerRecord,{revision:2,updatedAt:serverTimestamp()}));
    await assertFails(deleteDoc(ownerRecord));
    await assertFails(setDoc(doc(alice,'users','alice','state','profile'),initial));
    const h=doc(alice,'users','alice','history','2026-10-26');
    await assertSucceeds(setDoc(h,{
      segment:'bundle',payload:initial.payload,baseRevision:1,createdAt:serverTimestamp()
    }));
    await assertFails(updateDoc(h,{baseRevision:2}));
    await assertFails(deleteDoc(h));
    await assertFails(getDoc(doc(bob,'users','alice','history','2026-10-26')));
    assert.ok(true);
    console.log('Firestore rules emulator checks passed: identity isolation, revision guard and immutable backup history.');
  }finally{
    await testEnv.cleanup();
  }
}
run().catch(error=>{console.error(error);process.exitCode=1;});
