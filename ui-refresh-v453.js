/* Revision Loop v454: device-local appearance and one hierarchical navigation.
   Does not touch cloud credentials, saved revision progress or study IDs. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.RevisionLoopUI=api;
})(typeof window==='object'?window:null,function(){
 'use strict';
 const THEME_KEY='revisionLoopThemeV1';
 const SHOP_VIEW_KEY='revisionLoopShopViewV1';
 const SHOP_VIEWS=Object.freeze(['characters','outfits','places']);
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
 function refreshNavigation(doc){
  doc.querySelectorAll('.tab').forEach(button=>{
   if(button.classList.contains('active'))button.setAttribute('aria-current','page');
   else button.removeAttribute('aria-current');
  });
  doc.querySelectorAll('.study-type-btn').forEach(button=>{
   if(button.classList.contains('active'))button.setAttribute('aria-current','page');
   else button.removeAttribute('aria-current');
  });
 }
 function jumpTo(doc,destination){
  // One visible navigation system: four main tabs, with three study modes.
  const modes={mock:'mock',flashcards:'flashcards',exam:'exam'};
  if(Object.prototype.hasOwnProperty.call(modes,destination)){
   doc.querySelector('.tab[data-panel="study"]')?.click();
   doc.querySelector('.study-type-btn[data-study="'+modes[destination]+'"]')?.click();
  }else{
   const tab=doc.querySelector('.tab[data-panel="'+destination+'"]');
   if(!tab)return false;
   tab.click();
  }
  refreshNavigation(doc);
  scrollToSection(doc,Object.prototype.hasOwnProperty.call(modes,destination)?'studyModes':destination);
  return true;
 }
 function normaliseShopView(value){return SHOP_VIEWS.includes(value)?value:'characters'}
 function getShopView(storage){
  try{return normaliseShopView(storage.getItem(SHOP_VIEW_KEY))}catch{return 'characters'}
 }
 function applyShopView(doc,storage,view){
  view=normaliseShopView(view);
  const sections={characters:'shopCharactersSection',outfits:'shopOutfitsSection',places:'shopLocationsSection'};
  for(const [key,id] of Object.entries(sections)){
   const section=doc.getElementById(id);
   if(section)section.hidden=key!==view;
  }
  doc.querySelectorAll('[data-shop-view]').forEach(button=>{
   const selected=button.dataset.shopView===view;
   button.classList.toggle('active',selected);
   button.setAttribute('aria-pressed',String(selected));
  });
  try{storage.setItem(SHOP_VIEW_KEY,view)}catch{}
  return view;
 }
 function boot(){
  const doc=document,storage=window.localStorage;
  applyTheme(doc,storage,getTheme(storage));
  const toggle=doc.getElementById('themeToggle');
  toggle?.addEventListener('click',()=>applyTheme(doc,storage,doc.documentElement.dataset.theme==='dark'?'light':'dark'));
  applyShopView(doc,storage,getShopView(storage));
  doc.querySelectorAll('[data-shop-view]').forEach(button=>button.addEventListener('click',()=>{
   applyShopView(doc,storage,button.dataset.shopView);
   scrollToSection(doc,'shopTitle');
  }));
  doc.getElementById('shopViewOutfits')?.addEventListener('click',()=>{
   applyShopView(doc,storage,'outfits');
   scrollToSection(doc,'shopTitle');
  });
  doc.querySelectorAll('.tab').forEach(button=>button.addEventListener('click',()=>{
   refreshNavigation(doc);
   scrollToSection(doc,button.dataset.panel==='study'?'studyModes':button.dataset.panel);
  }));
  doc.querySelectorAll('.study-type-btn').forEach(button=>button.addEventListener('click',()=>{
   refreshNavigation(doc);
   scrollToSection(doc,'studyModes');
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
  refreshNavigation(doc);
 }
 if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
 }
 return Object.freeze({THEME_KEY,SHOP_VIEW_KEY,normaliseTheme,getTheme,applyTheme,normaliseShopView,getShopView,applyShopView,scrollToSection,jumpTo,refreshNavigation});
});
