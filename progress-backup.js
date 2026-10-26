/* Revision Loop: browser-only, opt-in backup/restore of all saved learning progress.
   Never sends data over the network or reads the site's access PIN. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.RevisionLoopBackup=api;
})(typeof window==='object'?window:null,function(){
 'use strict';
 const KEYS=Object.freeze(['revisionLoopProgress5','revisionLoopProfile11','revisionLoopSettings11']);
 const IS_OBJECT=x=>!!x&&typeof x==='object'&&!Array.isArray(x);
 function validate(data){
   if(!IS_OBJECT(data)||data.app!=='revision-loop'||data.schemaVersion!==1||!IS_OBJECT(data.values))
     throw new Error('This is not a Revision Loop progress backup.');
   for(const key of KEYS){
     if(typeof data.values[key]!=='string'||data.values[key].length>4*1024*1024)
       throw new Error('Backup is missing or has an invalid saved item: '+key);
     let parsed;
     try{parsed=JSON.parse(data.values[key])}catch{throw new Error('Invalid JSON in '+key)}
     if(!IS_OBJECT(parsed))throw new Error('Invalid saved data in '+key);
   }
   return data;
 }
 function snapshot(storage,at){
   const values={};
   for(const key of KEYS)values[key]=storage.getItem(key)||'{}';
   const data={app:'revision-loop',schemaVersion:1,createdAt:new Date(at||Date.now()).toISOString(),values};
   return validate(data);
 }
 function restore(storage,data){
   validate(data);
   const previous={};
   for(const key of KEYS)previous[key]=storage.getItem(key);
   try{
     for(const key of KEYS)storage.setItem(key,data.values[key]);
   }catch(error){
     for(const key of KEYS){
       try{if(previous[key]===null)storage.removeItem(key);else storage.setItem(key,previous[key])}catch{}
     }
     throw new Error('Browser storage is full or unavailable. Existing data was restored where possible.');
   }
 }
 function summary(data){
   validate(data);
   const p=JSON.parse(data.values.revisionLoopProfile11);
   return {xp:Number(p.lifetimeXp)||0,points:Number(p.points)||0,
     ownedLocations:Array.isArray(p.shopOwned?.locations)?p.shopOwned.locations.length:0,
     importedAt:String(data.createdAt||'unknown')};
 }
 function boot(){
   const download=document.getElementById('downloadRevisionBackup');
   const upload=document.getElementById('restoreRevisionBackup');
   const notice=document.getElementById('revisionBackupStatus');
   if(!download||!upload||!notice)return;
   const message=(s)=>{notice.textContent=s};
   download.addEventListener('click',()=>{
     try{
       const data=snapshot(localStorage);
       const date=new Date().toISOString().slice(0,10);
       const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
       const url=URL.createObjectURL(blob);
       const a=document.createElement('a');a.href=url;a.download='revision-loop-progress-'+date+'.json';
       document.body.append(a);a.click();a.remove();
       setTimeout(()=>URL.revokeObjectURL(url),15000);
       message('Backup prepared. Save the JSON file somewhere safe; no data was uploaded.');
     }catch(error){message('Backup failed: '+error.message)}
   });
   upload.addEventListener('change',async()=>{
     const file=upload.files?.[0];upload.value='';
     if(!file)return;
     try{
       if(file.size>8*1024*1024)throw new Error('Backup file is too large.');
       const incoming=validate(JSON.parse(await file.text()));
       const info=summary(incoming);
       const words='Restore the backup dated '+info.importedAt+'? It contains '+info.xp+
         ' lifetime XP and '+info.ownedLocations+' unlocked locations. This replaces saved progress, purchases and settings on this browser. Download your current backup first.';
       if(!window.confirm(words)){message('Restore cancelled. Current progress is unchanged.');return}
       restore(localStorage,incoming);
       message('Backup restored successfully. Reloading saved progress.');
       window.location.reload();
     }catch(error){message('Restore not completed: '+error.message)}
   });
 }
 if(typeof document!=='undefined'){
   if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
   else boot();
 }
 return Object.freeze({KEYS,validate,snapshot,restore,summary});
});
