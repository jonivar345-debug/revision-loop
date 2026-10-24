/* Four-image destination galleries. A real photo must be verified for its CC licence
   and matched to the destination; a failed search never substitutes a map for a photograph.
   Attribution is retained behind an unobtrusive disclosure, not over the photos. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.RevisionWorldPhotoGallery=Object.freeze(api);
})(typeof window==='object'?window:null,function(){
 'use strict';
 const cache=new Map();
 const keywords=Object.freeze({
  busan:['busan','haeundae','gwangalli','gwangan','gamcheon'],
  london:['london','tower bridge','westminster','big ben','st pauls'],
  tokyo:['tokyo','shinjuku','shibuya','skytree'],
  seoul:['seoul','namsan','gyeongbokgung','han river'],
  sydney:['sydney','opera house','harbour bridge'],
  singapore:['singapore','marina bay','gardens by the bay'],
  newyork:['new york','manhattan','brooklyn bridge','times square'],
  reykjavik:['reykjavik','hallgrimskirkja'],
  capetown:['cape town','table mountain'],
  cape_town:['cape town','table mountain'],
  paris:['paris','eiffel tower','notre dame'],
  tbilisi:['tbilisi','narikala','metekhi'],
  rome:['rome','colosseum','pantheon'],
  istanbul:['istanbul','hagia sophia','galata'],
  kyoto:['kyoto','fushimi inari','kiyomizu']
 });
 const rejected=/\b(?:collage|montage|photomontage|flag|poster|map|drawing|diagram|logo|seal|coats? of arms|illustration|infographic|screenshot|portrait of|selfie|food menu|shop sign)\b/i;
 function clean(v){return String(v||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
 const keyOf=location=>location.id+'|'+(location.wiki||location.name);
 function allowed(item,location,lead=false){
  if(!item?.url||!item.file||!item.author||!item.licenseUrl)return false;
  const name=clean(item.file.replace(/^File:/i,'').replace(/[_-]/g,' '));
  if(rejected.test(name)||!(/\.(?:jpg|jpeg|png|webp)$/i.test(name)))return false;
  if(item.checked)return true;
  const terms=keywords[location.id]||[clean(location.name).replace(/^country:\s*/,'').trim()];
  return lead||terms.some(term=>term.length>=4&&name.includes(clean(term)));
 }
 async function photosFor(location,{limit=4,media}={}){
  const api=media||(typeof window!=='undefined'?window.RevisionWorldCommonsMedia:null);
  if(!api)return [];
  const key=keyOf(location)+'|'+limit;
  if(!cache.has(key)){
   const job=(async()=>{
    const candidates=[];
    // Exact place and its Wikipedia page take priority over generic search.
    const approved=await api.verifyApproved?.(location.id).catch(()=>null);
    if(approved&&location.id!=='busan')candidates.push(approved);
    const lead=await api.searchPage?.(location.wiki||location.name).catch(()=>[]);
    for(const item of lead||[])if(allowed(item,location,true))candidates.push(item);
    // Search filenames for the named destination or a named landmark. The match
    // criterion rejects unrelated pictures even if Commons search ranks them highly.
    const name=location.name.replace(/^Country:\s*/,'').trim();
    const landmarks={
      busan:['Busan Gwangan Bridge','Busan Haeundae Beach','Busan Gamcheon Culture Village'],
      london:['London Tower Bridge','London Westminster','London Thames'],
      tokyo:['Tokyo Shinjuku','Tokyo Shibuya crossing','Tokyo Skytree'],
      seoul:['Seoul Gyeongbokgung','Seoul Namsan tower'],
      sydney:['Sydney Opera House','Sydney Harbour Bridge']
    };
    const phrases=landmarks[location.id]||[name+' cityscape',name+' landscape'];
    for(const query of phrases){
      if(candidates.length>=Math.min(limit,4))break;
      const results=await api.search(query,{limit:10}).catch(()=>[]);
      for(const item of results)if(allowed(item,location))candidates.push(item);
    }
    const seen=new Set();
    return candidates.filter(item=>{
      const key=clean(item.file);
      if(seen.has(key))return false;
      seen.add(key);return true;
    }).slice(0,Math.min(limit,4));
   })();
   cache.set(key,job);
  }
  return (await cache.get(key)).slice(0,limit);
 }
 function render(el,location,{card=false,media}={}){
  if(!el)return Promise.resolve([]);
  const doc=el.ownerDocument||(typeof document!=='undefined'?document:null);
  if(!doc)return Promise.resolve([]);
  const version=String((Number(el.dataset.galleryVersion)||0)+1);
  el.dataset.galleryVersion=version;
  el.classList.remove('location-image-map-fallback');
  el.classList.add(card?'destination-card-photo':'destination-photo-gallery');
  el.replaceChildren();
  const loading=doc.createElement('span');loading.className='destination-photo-status';loading.textContent='Loading photographs…';el.append(loading);
  return photosFor(location,{limit:card?1:4,media}).then(photos=>{
   if(!el.isConnected||el.dataset.galleryVersion!==version)return photos;
   el.replaceChildren();
   if(!photos.length){
     const msg=doc.createElement('span');msg.className='destination-photo-status';
     msg.textContent='Photographs unavailable';
     el.append(msg);return [];
   }
   const grid=doc.createElement('div');grid.className='destination-photo-grid';
   const credits=doc.createElement('details');credits.className='destination-photo-credits';
   const summary=doc.createElement('summary');summary.textContent='Photo credits';credits.append(summary);
   const list=doc.createElement('ul');
   photos.forEach((photo,i)=>{
    const figure=doc.createElement('figure');figure.className='destination-photo-tile';
    const img=doc.createElement('img');img.alt='Photograph of '+location.name+(photos.length>1?' ('+(i+1)+')':'');
    img.loading=card?'lazy':i===0?'eager':'lazy';img.decoding='async';img.referrerPolicy='no-referrer';
    img.src=photo.url;
    img.onerror=()=>{
      figure.remove();
      if(!grid.querySelector('img')){
        const empty=doc.createElement('span');empty.className='destination-photo-status';empty.textContent='Photographs unavailable';grid.append(empty);
      }
    };
    figure.append(img);grid.append(figure);
    const li=doc.createElement('li');li.append(doc.createTextNode('Photo '+(i+1)+': '+photo.author+' · '));
    for(const [url,label] of [[photo.filePage,'Original file'],[photo.licenseUrl,photo.license]]){
     const link=doc.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=label;
     li.append(link,doc.createTextNode(' · '));
    }
    li.append(doc.createTextNode('Resized for display.'));list.append(li);
   });
   el.append(grid);
   if(!card){credits.append(list);el.append(credits)}
   return photos;
  }).catch(()=>{
   if(el.isConnected&&el.dataset.galleryVersion===version)el.textContent='Photographs unavailable';
   return [];
  });
 }
 return Object.freeze({photosFor,render,allowed,keywords});
});
