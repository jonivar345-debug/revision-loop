/* Device-local display preference. It never changes the signed-in account or revision data. */
(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.RevisionLayoutMode=api;
})(typeof window==='object'?window:null,function(){
  'use strict';
  const KEY='revisionLoopLayoutModeV1';
  const OPTIONS=Object.freeze(['auto','phone','pc']);
  const normalise=value=>OPTIONS.includes(value)?value:'auto';
  function getMode(storage){
    try{return normalise(storage.getItem(KEY))}catch{return 'auto'}
  }
  function applyMode(doc,storage,mode){
    mode=normalise(mode);
    doc.documentElement.dataset.layoutMode=mode;
    try{storage.setItem(KEY,mode)}catch{}
    doc.querySelectorAll('[data-layout-choice]').forEach(btn=>{
      btn.setAttribute('aria-pressed',String(btn.dataset.layoutChoice===mode));
    });
    return mode;
  }
  function boot(){
    applyMode(document,localStorage,getMode(localStorage));
    document.querySelectorAll('[data-layout-choice]').forEach(btn=>{
      btn.addEventListener('click',()=>applyMode(document,localStorage,btn.dataset.layoutChoice));
    });
  }
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
    else boot();
  }
  return Object.freeze({KEY,normalise,getMode,applyMode});
});
