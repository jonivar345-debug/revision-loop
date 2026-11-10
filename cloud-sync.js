/* Revision Loop Cloud v436 — opt-in Google account synchronisation.
   No personal browser data is uploaded until the user explicitly links the device.
   Offline local saves continue to use the original app.js/localStorage mechanism. */
import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import {getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, deleteUser} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import {getFirestore, doc, getDocFromServer, onSnapshot, runTransaction, serverTimestamp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';

const CONFIG=Object.freeze({
  apiKey:'AIzaSyDE4sxy81d4JSBLGJlBPdt8UfprpePeym8',
  authDomain:'revision-loop-cloud.firebaseapp.com',
  projectId:'revision-loop-cloud',
  storageBucket:'revision-loop-cloud.firebasestorage.app',
  messagingSenderId:'548072628013',
  appId:'1:548072628013:web:e4a476d78431749f5a7da4'
});
const auth=getAuth(initializeApp(CONFIG));
const db=getFirestore();
const backup=window.RevisionLoopBackup;
const core=window.RevisionLoopCloudCore;
const BOUND_KEY='revisionLoopCloudBoundUidV1';
const CHECKPOINT_KEY='revisionLoopCloudCheckpointV1';
const MANUAL_RESTORE_KEY='revisionLoopCloudManualRestorePending';
const el=id=>document.getElementById(id);
let user=null,latestRemote=null,active=false,working=false,saveTimer=0,phase='idle';
let stopRemoteListener=null,queuedServerCheck=false,migrationInProgress=false;

function message(text){if(el('cloudSyncStatus'))el('cloudSyncStatus').textContent=text;if(el('cloudQuickStatus'))el('cloudQuickStatus').textContent=text;}
function visible(id,show){if(el(id))el(id).hidden=!show;}
function buttons(){
  visible('cloudGoogleSignIn',!user);
  visible('cloudQuickSignIn',!user);
  visible('cloudGoogleSignOut',!!user);
  visible('cloudUploadDevice',!!user&&phase==='first-upload');
  visible('cloudUseRemote',!!user&&(phase==='first-restore'||phase==='conflict'||phase==='review'));
  visible('cloudDownloadRemote',!!user&&!!latestRemote);
  visible('cloudSaveNow',!!user&&phase!=='loading'&&phase!=='resetting'&&phase!=='blocked');
  visible('cloudResetAll',!!user&&phase!=='loading'&&phase!=='resetting'&&phase!=='blocked');
  if(el('cloudAccountLabel'))el('cloudAccountLabel').textContent=user?
    'Connected progress account: '+(user.email?.endsWith('@example.com')?'private key':(user.email||'signed in')):'Not signed in. Browser saving remains available.';
}
function changePhase(next,text){phase=next;message(text);buttons();}
function checkpoint(){
  try{const c=JSON.parse(localStorage.getItem(CHECKPOINT_KEY)||'null');
    return c&&typeof c.uid==='string'&&Number.isSafeInteger(c.revision)&&typeof c.fingerprint==='string'?c:null
  }catch{return null}
}
function saveCheckpoint(uid,revision,fingerprint){
  localStorage.setItem(BOUND_KEY,uid);
  localStorage.setItem(CHECKPOINT_KEY,JSON.stringify({uid,revision,fingerprint}));
}
function current(){return backup.snapshot(localStorage);}
function encoded(values){return JSON.stringify(core.KEYS.map(key=>values[key]));}
async function fingerprint(values){
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(encoded(values)));
  return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function remoteRef(){return doc(db,'users',user.uid,'state','bundle');}
function remoteBackup(record){
  if(!record||typeof record.payload!=='string')throw new Error('Cloud data is unavailable.');
  return backup.validate(JSON.parse(record.payload));
}
function download(data,name){
  backup.validate(data);
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),15000);
}
async function retrieve(){
  const result=await getDocFromServer(remoteRef());
  latestRemote=result.exists()?result.data():null;
  if(latestRemote)remoteBackup(latestRemote);
  buttons();
  return latestRemote;
}
// A phone can update Firestore while a PC tab is open. Never interrupt an
// unfinished answer: let the learner finish before restoring remote progress.
function hasUnsavedAnswer(){
  // A remote change must not reload a phone or PC while an exam answer,
  // flashcard answer or handwritten sketch is still being worked on.
  const typed=['answerInput','examAnswer'].some(id=>{
    const input=el(id);
    // A learner may switch tabs without submitting a draft; keep it safe even then.
    return !!(input&&typeof input.value==='string'&&input.value.trim());
  });
  // A live session is held in memory, even before the learner types.
  // Never discard the session position by automatically reloading mid-review.
  const banner=el('sessionBanner');
  const inSession=!!(banner&&!banner.classList.contains('hidden'));
  return typed||window.RevisionSketch?.hasPendingInk?.()===true||inSession;
}
function requestCloudCheck(){
  if(!user)return;
  if(working){queuedServerCheck=true;return}
  void inspect();
}
function watchRemote(){
  if(stopRemoteListener){stopRemoteListener();stopRemoteListener=null}
  if(!user)return;
  const uid=user.uid;
  stopRemoteListener=onSnapshot(remoteRef(),snap=>{
    if(!user||user.uid!==uid||snap.metadata.fromCache||!snap.exists())return;
    const cp=checkpoint(),remoteRevision=Number(snap.data().revision)||0;
    if(cp&&cp.uid===uid&&remoteRevision>cp.revision)requestCloudCheck();
  },error=>{
    // Keep local saves available if a listener cannot connect.
    if(user?.uid===uid)message('Live cloud updates unavailable: '+error.message+'. You can still check progress manually.');
  });
}
async function applyRemote(record,automatic=false){
  const incoming=remoteBackup(record);
  if(automatic&&hasUnsavedAnswer()){
    active=false;
    changePhase('remote-ready','Newer cloud progress is available. Finish the current revision session or draft, then press Check cloud now. Cloud saving is paused to protect both versions.');
    return;
  }
  if(!automatic){
    const ok=confirm('Use your cloud progress on this device? This will replace the current browser progress. A local JSON backup will download first. Continue?');
    if(!ok)return;
    download(current(),'revision-loop-before-cloud-restore.json');
  }
  backup.restore(localStorage,incoming);
  const hash=await fingerprint(incoming.values);
  saveCheckpoint(user.uid,record.revision,hash);
  localStorage.removeItem(MANUAL_RESTORE_KEY);
  window.location.reload();
}
async function inspect(){
  if(!user||working)return;
  working=true;
  try{
    const bound=localStorage.getItem(BOUND_KEY);
    if(bound&&bound!==user.uid){
      changePhase('blocked','This browser has progress linked to a different Google account. Sign out and use the original account or another browser profile. No data has been changed.');
      await signOut(auth);return;
    }
    const remote=await retrieve(),local=current(),hash=await fingerprint(local.values),cp=checkpoint();
    const action=core.assess({
      remoteRevision:remote?.revision||0,checkpoint:cp,
      localFingerprint:hash,remoteFingerprint:remote?await fingerprint(remoteBackup(remote).values):null,
      uid:user.uid,manualRestore:!!cp&&localStorage.getItem(MANUAL_RESTORE_KEY)==='1'
    });
    if(action==='first-upload'){
      active=false;changePhase('first-upload','No online backup yet. Select Upload this device to start cloud saving; nothing has been uploaded.');
    }else if(action==='first-restore'){
      if(core.isFreshDevice(local.values)&&!hasUnsavedAnswer()){
        active=false;changePhase('loading','Fresh computer detected. Loading your existing cloud progress automatically…');
        await applyRemote(remote,true);
      }else{
        active=false;changePhase('first-restore','Existing device data detected. Choose Use cloud progress after reviewing the local backup; nothing has been overwritten.');
      }
    }else if(action==='current'){
      active=true;saveCheckpoint(user.uid,remote.revision,hash);
      changePhase('active','Cloud backup is current. Changes will save automatically.');
    }else if(action==='local-ahead'){
      active=true;changePhase('active','This device has unsynchronised changes. Uploading safely…');
      scheduleSave();
    }else if(action==='remote-ahead'){
      active=false;changePhase('loading','Newer cloud progress found; restoring this device.');
      await applyRemote(remote,true);
    }else {
      active=false;changePhase('conflict',
        'Cloud sync is paused: this device and the cloud contain different progress. Download both copies before choosing which to use. Nothing has been overwritten.');
    }
  }catch(error){
    active=false;changePhase('error','Cloud unavailable: '+(error?.message||'Please check your internet connection and Firebase setup')+'. Browser saves continue.');
  }finally{
    working=false;
    if(queuedServerCheck&&user){
      queuedServerCheck=false;
      queueMicrotask(()=>requestCloudCheck());
    }
  }
}
async function firstUpload(){
  if(!user||working||phase!=='first-upload')return;
  if(!confirm('Create your private online backup from this device? Keep your downloaded JSON backup too.'))return;
  working=true;changePhase('loading','Creating your online backup…');
  try{
    const data=current(),payload=JSON.stringify(data),hash=await fingerprint(data.values);
    if(new TextEncoder().encode(payload).byteLength>800000)throw new Error('Saved progress is too large for a single cloud document.');
    await runTransaction(db,async tx=>{
      const ref=remoteRef(),existing=await tx.get(ref);
      if(existing.exists())throw new Error('Cloud progress appeared on another device. Nothing was uploaded; review first.');
      tx.set(ref,{payload,revision:1,updatedAt:serverTimestamp()});
    });
    latestRemote={payload,revision:1};
    saveCheckpoint(user.uid,1,hash);
    localStorage.removeItem(MANUAL_RESTORE_KEY);
    active=true;changePhase('active','Cloud backup created. Future progress will synchronise automatically.');
  }catch(err){
    changePhase('error','Cloud backup not created: '+err.message+'. Your local progress is safe.');
  }finally{working=false}
}
function scheduleSave(){
  if(!active||!user)return;
  clearTimeout(saveTimer);
  saveTimer=setTimeout(()=>void push(),1800);
  message('Progress saved on this device. Cloud synchronisation pending…');
}
async function push(){
  if(!active||!user||working){if(active)scheduleSave();return}
  working=true;
  try{
    const data=current(),hash=await fingerprint(data.values),cp=checkpoint();
    if(!cp||cp.uid!==user.uid){active=false;throw new Error('Cloud account checkpoint is missing. Please reconnect.')}
    if(hash===cp.fingerprint){message('Progress saved here and in the cloud.');return}
    const payload=JSON.stringify(data);
    if(new TextEncoder().encode(payload).byteLength>800000){
      active=false;throw new Error('Progress exceeds the current cloud limit. Download a JSON backup.');
    }
    const oldRevision=cp.revision;
    const nextRevision=await runTransaction(db,async tx=>{
      const ref=remoteRef(),before=await tx.get(ref);
      if(!before.exists()||before.data().revision!==oldRevision)
        throw new Error('Another device updated the cloud. Automatic saving paused to protect both copies.');
      // Keep the previous full state once per UTC day for recovery.
      const date=new Date().toISOString().slice(0,10);
      const history=doc(db,'users',user.uid,'history',date);
      const prior=await tx.get(history);
      if(!prior.exists()){
        tx.set(history,{
          payload:before.data().payload,segment:'bundle',
          baseRevision:oldRevision,createdAt:serverTimestamp()
        });
      }
      tx.update(ref,{payload,revision:oldRevision+1,updatedAt:serverTimestamp()});
      return oldRevision+1;
    });
    latestRemote={payload,revision:nextRevision};
    saveCheckpoint(user.uid,nextRevision,hash);
    message('Progress saved automatically in your private cloud account.');
  }catch(error){
    // Network errors retain unsynced local work and can be retried; conflicting
    // revisions must never overwrite remote data without the user deciding.
    if(/Another device|checkpoint/i.test(error.message)){
      active=false;changePhase('conflict','Cloud sync paused: '+error.message+' Download your local backup and compare with the cloud copy.');
    }else message('Saved locally; cloud upload pending: '+error.message);
  }finally{
    working=false;
    if(queuedServerCheck&&user){
      queuedServerCheck=false;
      queueMicrotask(()=>requestCloudCheck());
    }
    if(active){
      const cp=checkpoint();
      const hash=await fingerprint(current().values);
      if(cp&&hash!==cp.fingerprint)clearTimeout(saveTimer),saveTimer=setTimeout(()=>void push(),6000);
    }
  }
}
/* A fresh start deliberately supersedes the existing cloud version. Both the
   local and remote copies are exported to one recovery archive before writing.
   Unlike routine sync, this flow explicitly authorises a reset after a typed
   confirmation, and checks that the remote hasn't changed since the preview. */
function savePreResetArchive(local,remote){
  const archive={
    format:'revision-loop-pre-reset-archive-v120',
    createdAt:new Date().toISOString(),
    local:backup.validate(local),
    cloud:remote?remoteBackup(remote):null
  };
  const blob=new Blob([JSON.stringify(archive,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;
  a.download='revision-loop-before-reset-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),15000);
}
async function resetAllProgress(){
  if(!user||working)return;
  // Prevent an account switch from resetting a different user's progress.
  const bound=localStorage.getItem(BOUND_KEY);
  if(bound&&bound!==user.uid){
    message('This device belongs to another Google login. No progress changed.');
    return;
  }
  working=true;
  const wasActive=active;
  active=false;
  clearTimeout(saveTimer);
  try{
    // Read fresh data from the server, not its offline cache.
    const original=await retrieve();
    const local=current(),fresh=backup.validate(core.freshStartSnapshot());
    const account=user.email||'this Google account';
    const typed=window.prompt(
      'Reset ALL Revision Loop progress for '+account+
      '? This resets reviews, XP, points, exam results, achievements and purchased items on your linked devices. A recovery archive will be downloaded. Type RESET to confirm:'
    );
    if(typed!=='RESET'){
      active=wasActive;
      changePhase(wasActive?'active':phase,'Reset cancelled. Your existing progress has not been changed.');
      return;
    }
    // Keep an independent recovery file; downloading is a user action, not a
    // permanent server-side deletion of backups/history.
    savePreResetArchive(local,original);
    changePhase('resetting','Resetting your private cloud progress; local data has not changed yet…');
    const payload=JSON.stringify(fresh),hash=await fingerprint(fresh.values);
    if(new TextEncoder().encode(payload).byteLength>800000)
      throw new Error('Unexpectedly large fresh-start snapshot.');
    const nextRevision=await runTransaction(db,async tx=>{
      const stateRef=remoteRef(),latest=await tx.get(stateRef);
      const exists=latest.exists();
      if(exists!==!!original || (exists&&latest.data().revision!==original.revision))
        throw new Error('Cloud data changed on another device. Reset cancelled to protect that newer version.');
      let historyRef=null,historyExists=false;
      if(exists){
        historyRef=doc(db,'users',user.uid,'history',new Date().toISOString().slice(0,10));
        historyExists=(await tx.get(historyRef)).exists();
      }
      const revision=exists?original.revision+1:1;
      if(exists&&!historyExists){
        tx.set(historyRef,{
          segment:'bundle',payload:latest.data().payload,
          baseRevision:latest.data().revision,createdAt:serverTimestamp()
        });
      }
      const data={payload,revision,updatedAt:serverTimestamp()};
      if(exists)tx.update(stateRef,data);
      else tx.set(stateRef,data);
      return revision;
    });
    // Only clear the local browser AFTER the cloud transaction has committed.
    backup.restore(localStorage,fresh);
    saveCheckpoint(user.uid,nextRevision,hash);
    localStorage.removeItem(MANUAL_RESTORE_KEY);
    changePhase('active','Progress reset to zero locally and online. Reloading…');
    window.location.reload();
  }catch(error){
    active=false;
    changePhase('error','Reset did not complete: '+error.message+
      '. Check your saved recovery archive and cloud status before retrying. Do not clear browser storage.');
  }finally{working=false}
}

/* The private key is a randomly generated bearer credential, not the four-digit
   public website PIN. A deterministic pseudonymous email enables Firebase
   email/password auth without needing to type or disclose a real email address.
   Eight random base32 characters provide 40 bits, weaker than 24 characters;
   provider-side abuse limits and rate limits must be verified before release.
   The reserved example.com domain is used only as an internal identifier;
   there is no mailbox, email recovery or ability to reset a lost private key.
   Firebase Email/Password provider must be enabled before this feature can work.
   Firestore writes remain protected by existing per-UID security rules. */
const PRIVATE_ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newPrivateKey(){
  const random=new Uint8Array(8);
  crypto.getRandomValues(random);
  return Array.from(random,n=>PRIVATE_ALPHABET[n%PRIVATE_ALPHABET.length]).join('');
}
function cleanPrivateKey(raw){
  const key=String(raw||'').trim().toUpperCase().replace(/[\s-]/g,'');
  if(![8,24].includes(key.length)||![...key].every(ch=>PRIVATE_ALPHABET.includes(ch)))
    throw new Error('Use a generated 8-character private key (or an existing 24-character key). A four- or six-digit PIN is not secure enough for cloud progress.');
  return key;
}
async function privateCredentials(raw){
  const key=cleanPrivateKey(raw);
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('revision-loop-private-v436|'+key));
  const hash=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
  return {email:'rl-'+hash.slice(0,48)+'@example.com',password:'rl-private-v436:'+key};
}
function privateMessage(messageText){const target=el('cloudPrivateStatus');if(target)target.textContent=messageText;}
function explainPrivateError(error){
  const code=String(error?.code||'');
  if(code.includes('operation-not-allowed'))return 'The Firebase Email/Password sign-in provider has not been enabled yet; no progress was changed.';
  if(code.includes('email-already-in-use'))return 'This key already has a cloud account. Select Load progress using key instead.';
  if(code.includes('invalid-credential')||code.includes('wrong-password')||code.includes('user-not-found'))return 'This key was not recognised. Check every character or use the original device.';
  return error?.message||'Connection failed. Your local progress remains saved.';
}
async function privateSignIn(){
  if(migrationInProgress)return;
  try{
    const credentials=await privateCredentials(el('cloudPrivateKey')?.value);
    privateMessage('Checking private cloud key…');
    // On public or school computers, close the browser to end key-based access.
    await setPersistence(auth,browserSessionPersistence);
    await signInWithEmailAndPassword(auth,credentials.email,credentials.password);
    if(el('cloudPrivateKey'))el('cloudPrivateKey').value='';
    privateMessage('Private key accepted. Loading cloud progress… For safety, this private-key session ends when this browser session closes.');
  }catch(error){privateMessage(explainPrivateError(error))}
}
async function createPrivateAccount(){
  if(migrationInProgress||working)return;
  let credentials;
  try{credentials=await privateCredentials(el('cloudPrivateKey')?.value)}
  catch(error){privateMessage(error.message);return}
  if(!window.confirm('Create a NEW private-key cloud account using all progress currently saved in THIS browser? This keeps the existing Google cloud copy unchanged. Download a recovery backup before switching accounts. You MUST save your private key; it cannot be recovered if lost. Continue?'))return;
  const snapshot=current();
  // Download the whole original snapshot so migration cannot strand local work.
  try{download(snapshot,'revision-loop-before-private-key-migration.json')}
  catch(error){privateMessage('Backup could not be prepared: '+error.message);return}
  migrationInProgress=true;
  active=false;
  clearTimeout(saveTimer);
  if(stopRemoteListener){stopRemoteListener();stopRemoteListener=null}
  privateMessage('Creating a separate private-key cloud account…');
  let createdUser=null,cloudCreated=false;
  try{
    await setPersistence(auth,browserSessionPersistence);
    const credential=await createUserWithEmailAndPassword(auth,credentials.email,credentials.password);
    createdUser=credential.user;
    user=credential.user;
    const payload=JSON.stringify(snapshot),hash=await fingerprint(snapshot.values);
    if(new TextEncoder().encode(payload).byteLength>800000)
      throw new Error('Progress is too large for a single cloud document. Your local and downloaded backups are safe.');
    await runTransaction(db,async tx=>{
      const ref=remoteRef();
      const existing=await tx.get(ref);
      if(existing.exists())throw new Error('Private key account already has progress; nothing has been overwritten.');
      tx.set(ref,{payload,revision:1,updatedAt:serverTimestamp()});
    });
    cloudCreated=true;
    latestRemote={payload,revision:1};
    saveCheckpoint(user.uid,1,hash);
    localStorage.removeItem(MANUAL_RESTORE_KEY);
    active=true;
    changePhase('active','Private-key cloud account connected. Your progress will synchronise automatically.');
    if(el('cloudPrivateKey'))el('cloudPrivateKey').value='';
    privateMessage('Setup complete. Keep your copied key safe. Enter it on any other computer to retrieve this progress without Google.');
    watchRemote();
  }catch(error){
    active=false;
    // An account may have been created even if its first Firestore upload failed.
    // Remove only that newly created empty account; never touch the old Google
    // account or any cloud backup. Local progress and downloaded JSON remain.
    if(createdUser&&!cloudCreated){
      try{
        await deleteUser(createdUser);
        user=null;
      }catch(cleanupError){
        await signOut(auth).catch(()=>{});
        user=null;
        privateMessage('Setup failed and the empty account could not be removed automatically. Save your key and JSON backup; contact the site administrator before retrying. '+explainPrivateError(error));
        changePhase('error','Private-key setup incomplete. Your local progress is unchanged.');
        return;
      }
    }
    changePhase('error',cloudCreated?'Cloud progress was created but local setup could not finish. Do not create a second account; keep your key and backup.':'Private-key setup was not completed. Existing browser progress is unchanged.');
    privateMessage(explainPrivateError(error));
  }finally{migrationInProgress=false}
}
async function connect(){
  try{
    message('Opening Google sign-in…');
    const provider=new GoogleAuthProvider();
    await signInWithPopup(auth,provider);
  }catch(error){message('Google sign-in could not finish: '+(error?.message||'Please retry'))}
}
async function disconnect(){
  clearTimeout(saveTimer);active=false;
  await signOut(auth);
  user=null;latestRemote=null;
  changePhase('idle','Signed out of cloud saving. Local progress remains in this browser.');
}
async function useRemote(){
  if(!user||!latestRemote)return;
  try{await applyRemote(latestRemote,false)}catch(error){message('Could not restore cloud progress: '+error.message)}
}
function boot(){
  if(!backup||!core){message('Cloud sync helper did not load; local progress is unaffected.');return}
  el('cloudGoogleSignIn')?.addEventListener('click',()=>void connect());
  el('cloudQuickSignIn')?.addEventListener('click',()=>void connect());
  el('cloudGeneratePrivateKey')?.addEventListener('click',()=>{
    if(el('cloudPrivateKey'))el('cloudPrivateKey').value=newPrivateKey();
    privateMessage('New private key generated. Copy and save it before connecting; it will not be shown again after setup.');
  });
  el('cloudCopyPrivateKey')?.addEventListener('click',async()=>{
    try{
      const key=cleanPrivateKey(el('cloudPrivateKey')?.value);
      await navigator.clipboard.writeText(key);
      privateMessage('Key copied. Store it in a private password manager; clear the clipboard on shared computers.');
    }catch(error){privateMessage(error.message)}
  });
  el('cloudCreatePrivateKey')?.addEventListener('click',()=>void createPrivateAccount());
  el('cloudPrivateSignIn')?.addEventListener('click',()=>void privateSignIn());
  el('cloudResetAll')?.addEventListener('click',()=>void resetAllProgress());
  el('cloudGoogleSignOut')?.addEventListener('click',()=>void disconnect());
  el('cloudUploadDevice')?.addEventListener('click',()=>void firstUpload());
  el('cloudUseRemote')?.addEventListener('click',()=>void useRemote());
  el('cloudDownloadRemote')?.addEventListener('click',()=>{
    if(latestRemote)download(remoteBackup(latestRemote),'revision-loop-cloud-progress.json');
  });
  el('cloudSaveNow')?.addEventListener('click',()=>requestCloudCheck());
  buttons();
  onAuthStateChanged(auth,async account=>{
    if(migrationInProgress)return;
    if(stopRemoteListener){stopRemoteListener();stopRemoteListener=null}
    user=account||null;active=false;queuedServerCheck=false;
    if(!user){changePhase('idle','Cloud connection is optional. Revision Loop continues saving locally.');return}
    changePhase('loading','Checking your private cloud progress…');
    await inspect();
    if(user)watchRemote();
  },error=>changePhase('error','Google sign-in unavailable: '+error.message));
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden&&user){
      if(active||phase==='error'||phase==='remote-ready')requestCloudCheck();
    }
  });
  window.addEventListener('online',()=>requestCloudCheck());
}
window.RevisionLoopCloudSync=Object.freeze({onLocalSaved:scheduleSave});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else boot();
