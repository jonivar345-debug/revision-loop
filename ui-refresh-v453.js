/* Revision Loop v453: device-local appearance and direct section navigation.
   Does not touch cloud credentials, saved revision progress or study IDs. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.RevisionLoopUI=api;
})(typeof window==='object'?window:null,function(){
 'use strict';
 const THEME_KEY='revisionLoopThemeV1';
 const THEMES=['light','dark'];
 function normaliseTheme(value){return THEMES.includes(value)?value:'light'}
 function getTheme(storage){
  try{return normaliseTheme(storage.getItem(THEME_KEY))}catch{return 'light'}
 }
 function applyTheme(doc,storage,mode){
  mode=normaliseTheme(mode);
  doc.documentElement.dataset.theme=mode;
  try{storage.setItem(THEME_KEY,mode)}catch{}
  const button=doc.getElementById('themeToggle');
  if(button){
   const dark=mode==='dark';
   button.textContent=dark?'☀':'☾';
   button.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
   button.setAttribute('title',dark?'Light mode':'Dark mode');
   button.setAttribute('aria-pressed',String(dark));
  }
  const meta=doc.querySelector('meta[name="theme-color"]');
  if(meta)meta.setAttribute('content',mode==='dark'?'#0b1223':'#f3f6fc');
  return mode;
 }
 function scrollToSection(doc,id,animated=true){
  const target=doc.getElementById(id),view=doc.defaultView;
  if(!target||!view||target.closest('.panel:not(.active)'))return false;
  const tabs=doc.querySelector('.tabs');
  const offset=(tabs?.getBoundingClientRect().height||0)+18;
  const top=Math.max(0,target.getBoundingClientRect().top+view.scrollY-offset);
  const reduced=typeof view.matchMedia==='function'&&view.matchMedia('(prefers-reduced-motion: reduce)').matches;
  view.scrollTo({top,behavior:animated&&!reduced?'smooth':'instant'});
  return true;
 }
 function refreshQuickActive(doc){
  const selected=doc.querySelector('.tab.active')?.dataset.panel||'study';
  const type=doc.querySelector('.study-type-btn.active')?.dataset.study||'mock';
  const destination=selected==='study'?(type==='flashcards'?'flashcards':type==='exam'?'exam':'mock'):selected;
  doc.querySelectorAll('[data-jump]').forEach(button=>{
   if(button.dataset.jump===destination)button.setAttribute('aria-current','page');
   else button.removeAttribute('aria-current');
  });
 }
 function jumpTo(doc,destination){
  const modes={mock:'mock',flashcards:'flashcards',exam:'exam'};
  let panel=destination;
  if(Object.prototype.hasOwnProperty.call(modes,destination)){
   panel='study';
   doc.querySelector('.tab[data-panel="study"]')?.click();
   doc.querySelector('.study-type-btn[data-study="'+modes[destination]+'"]')?.click();
  }else{
   const tab=doc.querySelector('.tab[data-panel="'+destination+'"]');
   if(!tab)return false;
   tab.click();
  }
  refreshQuickActive(doc);
  scrollToSection(doc,panel);
  return true;
 }
 function boot(){
  const doc=document,storage=window.localStorage;
  applyTheme(doc,storage,getTheme(storage));
  const toggle=doc.getElementById('themeToggle');
  toggle?.addEventListener('click',()=>applyTheme(doc,storage,doc.documentElement.dataset.theme==='dark'?'light':'dark'));
  doc.querySelectorAll('[data-jump]').forEach(button=>button.addEventListener('click',()=>jumpTo(doc,button.dataset.jump)));
  doc.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',()=>{
   refreshQuickActive(doc);
   scrollToSection(doc,button.dataset.panel);
  }));
  doc.querySelectorAll('.study-type-btn').forEach(button=>button.addEventListener('click',()=>{
   refreshQuickActive(doc);
   scrollToSection(doc,'study');
  }));
  for(const id of ['startMock','startFlashcards','startExam','startPaper2Coach','startChallenge','reviewWeakBtn','redoMistakesBtn']){
   doc.getElementById(id)?.addEventListener('click',()=>{
    const host=doc.getElementById('studyHost');
    if(host?.children.length&&doc.getElementById('study')?.classList.contains('active'))scrollToSection(doc,'studyHost');
   });
  }
  const manage=doc.getElementById('cloudManageToggle'),quick=doc.getElementById('cloudQuickAccess');
  manage?.addEventListener('click',()=>{
   if(!quick||quick.dataset.connected!=='true')return;
   const expanded=quick.classList.toggle('expanded');
   manage.setAttribute('aria-expanded',String(expanded));
   manage.textContent=expanded?'Hide sync settings':'Manage sync';
  });
  refreshQuickActive(doc);
 }
 if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
 }
 return Object.freeze({THEME_KEY,normaliseTheme,getTheme,applyTheme,scrollToSection,jumpTo,refreshQuickActive});
});
