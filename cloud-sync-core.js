/* Revision Loop Cloud v119: pure synchronisation decisions, no Firebase imports. */
(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.RevisionLoopCloudCore=api;
})(typeof window==='object'?window:null,function(){
  'use strict';
  const KEYS=Object.freeze(['revisionLoopProgress5','revisionLoopProfile11','revisionLoopSettings11']);
  function sameValues(a,b){return KEYS.every(k=>a?.[k]===b?.[k]);}
  function hasData(values){
    return KEYS.some(k=>{
      try{return Object.keys(JSON.parse(values?.[k]||'{}')).length>0}catch{return true}
    });
  }
  // A checkpoint binds a cloud revision to the browser's last acknowledged data.
  // Same local fingerprint + newer remote means safe fast-forward.
  function assess({remoteRevision,checkpoint,localFingerprint,remoteFingerprint,uid,manualRestore=false}){
    if(manualRestore)return 'review';
    if(!remoteRevision)return checkpoint?'missing-remote':'first-upload';
    if(!checkpoint||checkpoint.uid!==uid)return 'first-restore';
    if(localFingerprint===remoteFingerprint)return 'current';
    if(checkpoint.fingerprint===localFingerprint){
      return remoteRevision>=checkpoint.revision?'remote-ahead':'review';
    }
    if(remoteRevision===checkpoint.revision)return 'local-ahead';
    return 'conflict';
  }
  // Only a genuinely untouched browser may restore automatically. Any evidence
  // of learner activity or non-default purchases requires explicit review.
  function isFreshDevice(values){
    try{
      const progress=JSON.parse(values?.revisionLoopProgress5||'{}');
      const profile=JSON.parse(values?.revisionLoopProfile11||'{}');
      if(!progress||!profile||Array.isArray(progress)||Array.isArray(profile))return false;
      if(Object.keys(progress).length>0)return false;
      if(Number(profile.lifetimeXp||0)!==0||Number(profile.points||0)!==0||
         Number(profile.reviews||0)!==0||Number(profile.challengeStreak||0)!==0)return false;
      for(const key of ['examResults','topicStats','topicWeakness','dailyChallenges','errorLog']){
        const x=profile[key];
        if(Array.isArray(x)?x.length>0:x&&typeof x==='object'?Object.keys(x).length>0:!!x)return false;
      }
      if(profile.lastChallengeDate)return false;
      if(profile.shopOwned){
        const starters={characters:['lelouch'],outfits:['lelouch-default'],locations:['london']};
        for(const kind of Object.keys(starters)){
          const owned=profile.shopOwned[kind]||[];
          if(!Array.isArray(owned)||owned.some(x=>!starters[kind].includes(x)))return false;
        }
      }
      return true;
    }catch{return false}
  }
  // Fresh learning state: free starter characters/locations are restored by
  // app.js ensureProfile() on reload, but no earned XP or reviews remain.
  function freshStartSnapshot(at){
    return {
      app:'revision-loop',schemaVersion:1,
      createdAt:new Date(at||Date.now()).toISOString(),
      values:Object.fromEntries(KEYS.map(key=>[key,'{}']))
    };
  }
  return Object.freeze({KEYS,sameValues,hasData,assess,isFreshDevice,freshStartSnapshot});
});
