/* One optional acknowledgement panel instead of credit badges over every shop cover. */
(function(){
  'use strict';
  const button=document.getElementById('worldPhotoCreditsButton');
  const dialog=document.getElementById('worldPhotoCreditsDialog');
  const close=document.getElementById('worldPhotoCreditsClose');
  const list=document.getElementById('worldPhotoCreditsList');
  if(!button||!dialog||!close||!list)return;
  function refresh(){
    list.replaceChildren();
    const seen=new Set();
    // Cards and expanded galleries already retain up-to-date, file-specific
    // attributions in the DOM, including after fallback to another image.
    for(const gallery of document.querySelectorAll('.destination-photo-credits')){
      for(const li of gallery.querySelectorAll('li')){
        const original=li.querySelector('a[href*="commons.wikimedia.org/wiki/File:"]');
        const licence=li.querySelector('a[href*="creativecommons.org/"]');
        const key=original?.href;
        if(!key||!licence||seen.has(key))continue;
        seen.add(key);
        list.append(li.cloneNode(true));
      }
    }
    if(!seen.size){
      const empty=document.createElement('li');
      empty.textContent='Open a World location to see its image licences here.';
      list.append(empty);
    }
  }
  button.addEventListener('click',()=>{
    refresh();
    if(typeof dialog.showModal==='function')dialog.showModal();
    else dialog.setAttribute('open','');
  });
  close.addEventListener('click',()=>typeof dialog.close==='function'?dialog.close():dialog.removeAttribute('open'));
  dialog.addEventListener('click',event=>{
    if(event.target===dialog&&typeof dialog.close==='function')dialog.close();
  });
})();