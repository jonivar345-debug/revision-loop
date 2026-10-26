'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const core=require('../cloud-sync-core.js');
const uid='firebase-test-uid', c={uid,revision:5,fingerprint:'local-v5'};
const cases=[
 [{remoteRevision:0,checkpoint:null,localFingerprint:'a',remoteFingerprint:null,uid},'first-upload'],
 [{remoteRevision:0,checkpoint:c,localFingerprint:'local-v5',remoteFingerprint:null,uid},'missing-remote'],
 [{remoteRevision:1,checkpoint:null,localFingerprint:'a',remoteFingerprint:'remote',uid},'first-restore'],
 [{remoteRevision:5,checkpoint:c,localFingerprint:'local-v5',remoteFingerprint:'local-v5',uid},'current'],
 [{remoteRevision:6,checkpoint:c,localFingerprint:'local-v5',remoteFingerprint:'new-v6',uid},'remote-ahead'],
 [{remoteRevision:5,checkpoint:c,localFingerprint:'new-local',remoteFingerprint:'local-v5',uid},'local-ahead'],
 [{remoteRevision:6,checkpoint:c,localFingerprint:'new-local',remoteFingerprint:'new-v6',uid},'conflict'],
 [{remoteRevision:5,checkpoint:{...c,uid:'another-account'},localFingerprint:'a',remoteFingerprint:'b',uid},'first-restore'],
 [{remoteRevision:5,checkpoint:c,localFingerprint:'new-local',remoteFingerprint:'local-v5',uid,manualRestore:true},'review']
];
for(const [input,want] of cases)assert.equal(core.assess(input),want,JSON.stringify(input));
const empty=Object.fromEntries(core.KEYS.map(k=>[k,'{}']));
assert.equal(core.hasData(empty),false);
assert.equal(core.hasData({...empty,revisionLoopProgress5:'{"learned":1}'}),true);
assert.equal(core.sameValues(empty,{...empty}),true);
assert.equal(core.sameValues(empty,{...empty,revisionLoopProfile11:'{"xp":4}'}),false);
const index=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const cloud=fs.readFileSync('cloud-sync.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const rules=fs.readFileSync('firestore.rules','utf8');
const backup=fs.readFileSync('progress-backup.js','utf8');
for(const id of ['cloudGoogleSignIn','cloudGoogleSignOut','cloudUploadDevice','cloudUseRemote','cloudDownloadRemote','cloudSaveNow','cloudSyncStatus']){
 assert.match(index,new RegExp('id="'+id+'"'));
 assert.ok(cloud.includes("'"+id+"'"));
}
assert.match(index,/cloud-sync-core\.js\?v=119/);
assert.match(index,/cloud-sync\.js\?v=119/);
assert.match(app,/RevisionLoopCloudSync\.onLocalSaved/);
assert.match(backup,/revisionLoopCloudManualRestorePending/);
assert.match(sw,/cloud-sync-core\.js/);
assert.match(sw,/cloud-sync\.js/);
assert.match(rules,/segment in \['bundle'\]/);
assert.match(rules,/request\.auth\.uid == userId/);
assert.match(rules,/revision == resource\.data\.revision \+ 1/);
assert.doesNotMatch(cloud,/serviceAccount|private_key|client_secret/);
console.log('Cloud sync decision and integration checks passed ('+cases.length+' state transitions).');
