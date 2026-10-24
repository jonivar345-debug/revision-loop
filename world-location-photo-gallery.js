/* Four genuinely place-matched photographs per destination when Commons has them.
   Curated photos load without search API access. Other photographs come from the
   exact Wikipedia page, location-tagged Commons media, then strict place searches.
   Source pixels are not transcoded or compressed in-browser: Commons serves a
   2048px derivative and credits link to the original full-resolution photograph.
   Never substitute a map/diagram or an unrelated city merely to fill a slot. */
(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.RevisionWorldPhotoGallery=Object.freeze(api);
})(typeof window==='object'?window:null,function(){
  'use strict';
  const MAX_PHOTOS=4;
  const cache=new Map();
  const keywords=Object.freeze({
    london:['london','tower bridge','westminster','millennium bridge','st paul'],
    busan:['busan','haeundae','gwangalli','gwangan','gamcheon','yonggungsa','jagalchi'],
    tokyo:['tokyo','shinjuku','shibuya','skytree','asakusa'],
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
    kyoto:['kyoto','fushimi inari','kiyomizu'],
    tbilisi:['tbilisi','narikala','metekhi','sameba'],
    hongkong:['hong kong','victoria harbour','victoria peak','tsim sha tsui'],
    shanghai:['shanghai','bund','pudong','oriental pearl'],
    shenzhen:['shenzhen','ping an finance','futian'],
    beijing:['beijing','forbidden city','temple of heaven','tiananmen'],
    bohol:['bohol','chocolate hills','panglao'],
    coron:['coron','kayangan lake','twin lagoon','palawan'],
    bali:['bali','uluwatu','tanah lot','ubud'],
    hanoi:['hanoi','hoan kiem','old quarter'],
    hochiminh:['ho chi minh','saigon','ben thanh'],
    bangkok:['bangkok','wat arun','grand palace'],
    kualalumpur:['kuala lumpur','petronas towers','batu caves'],
    almaty:['almaty','kok tobe','medeau'],
    samarkand:['samarkand','registan','shah i zinda'],
    machupicchu:['machu picchu','machupicchu'],
    angkor:['angkor wat','bayon','ta prohm'],
    venice:['venice','rialto','grand canal','san marco'],
    dublin:['dublin','ha penny bridge','trinity college'],
    edinburgh:['edinburgh','calton hill','royal mile'],
    athens:['athens','acropolis','parthenon'],
    rio:['rio de janeiro','christ the redeemer','sugarloaf'],
    dubai:['dubai','burj khalifa','palm jumeirah'],
    banff:['banff','lake louise','moraine lake'],
    victoriafalls:['victoria falls','mosi oa tunya'],
    sossusvlei:['sossusvlei','deadvlei'],
    petra:['petra','al khazneh','treasury jordan']
  });
  const rejected=/\b(?:collage|montage|photomontage|flag|poster|map|locator|drawing|diagram|logo|seal|coats? of arms|illustration|infographic|screenshot|portrait of|selfie|food menu|shop sign|chart|atlas)\b/i;
  const clean=v=>String(v||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const uniqueName=v=>clean(v).replace(/[^a-z0-9]+/g,' ');
  const keyOf=location=>location.id+'|'+(location.wiki||location.name);
  const properName=location=>String(location.name||'').replace(/^Country:\s*/,'').trim();
  const geoNearby=location=>Number.isFinite(location.lat)&&Number.isFinite(location.lon)
    &&!['ocean','sea','country'].includes(location.worldKind);
  const validMedia=item=>!!(item?.url&&item?.file&&item?.author&&item?.licenseUrl&&item?.filePage);
  function allowed(item,location,lead=false){
    if(!validMedia(item))return false;
    const filename=clean(item.file.replace(/^File:/i,'').replace(/[_-]/g,' '));
    if(rejected.test(filename)||!/\.(?:jpg|jpeg|png|webp)$/i.test(filename))return false;
    if(Number.isFinite(item.width)&&item.width>0&&item.width<900)return false;
    if(Number.isFinite(item.height)&&item.height>0&&item.height<500)return false;
    if(item.checked||lead||item.locationVerified)return true;
    const terms=keywords[location.id]||[properName(location)];
    return terms.some(term=>uniqueName(term).length>=4&&uniqueName(filename).includes(uniqueName(term)));
  }
  function candidatesFor(location){
    const title=properName(location);
    const landmark={
      london:['London Tower Bridge','London Westminster','London Millennium Bridge'],
      busan:['Busan Haeundae','Busan Gwangalli Bridge','Busan Gamcheon Culture Village'],
      tokyo:['Tokyo Shinjuku skyline','Tokyo Senso-ji temple','Tokyo skyline'],
      seoul:['Seoul Gyeongbokgung','Seoul Namsan','Seoul skyline'],
      sydney:['Sydney Opera House','Sydney Harbour Bridge','Sydney waterfront'],
      singapore:['Singapore Marina Bay','Singapore Gardens by the Bay','Singapore skyline'],
      paris:['Paris Eiffel Tower','Paris Seine','Paris Sacre Coeur'],
      capetown:['Cape Town Table Mountain','Cape Town waterfront'],
      newyork:['New York Manhattan skyline','New York Brooklyn Bridge'],
      hongkong:['Hong Kong Victoria Harbour','Hong Kong skyline','Victoria Peak Hong Kong'],
      tbilisi:['Tbilisi Narikala fortress','Tbilisi Old Town','Tbilisi Sameba Cathedral'],
      beijing:['Beijing Forbidden City','Beijing Temple of Heaven','Beijing skyline'],
      shanghai:['Shanghai Bund skyline','Shanghai Pudong skyline','Shanghai historic streets'],
      seoul:['Seoul Gyeongbokgung Palace','Seoul Namsan tower','Seoul Han River'],
      kyoto:['Kyoto Fushimi Inari','Kyoto Kiyomizu-dera','Kyoto Gion'],
      paris:['Paris Eiffel Tower','Paris Seine','Paris Montmartre'],
      singapore:['Singapore Marina Bay','Singapore Gardens by the Bay','Singapore Botanic Gardens']
    };
    if(landmark[location.id])return landmark[location.id];
    if(location.worldKind==='ocean'||location.worldKind==='sea')
      return [title+' ocean coast photograph',title+' sea aerial photograph',title+' coastline'];
    if(location.worldKind==='country')
      return [title+' landscape',title+' national park',title+' architecture'];
    return [title+' skyline',title+' landmark',title+' city panorama'];
  }
  function curated(location){
    const store=typeof window!=='undefined'?window.RevisionWorldCuratedPhotos:null;
    return store?.get(location.id)||[];
  }
  function imageScore(item,location){
    const name=uniqueName(item.file+' '+(item.description||''));
    const main=uniqueName(properName(location));
    let score=(Number(item.width)>=3000?8:Number(item.width)>=1800?4:0);
    if(main.length>=4&&name.includes(main))score+=10;
    if(/panoram|skyline|aerial|scenic|view|waterfront|sunset|sunrise|cityscape|landscape|historic|bridge|harbour|harbor|mountain|cathedral|temple|beach|coast/.test(name))score+=8;
    if(/entrance|window|signboard|interior|construction|parking|carpark|person|people|advert|hotel room|museum object/.test(name))score-=14;
    return score;
  }
  async function assemble(location,api){
    const collected=[],seen=new Set();
    function add(photo,{lead=false,geo=false}={}){
      if(!photo)return;
      const item=geo?{...photo,locationVerified:true}:photo;
      if(!allowed(item,location,lead))return;
      const key=uniqueName(item.file);
      if(seen.has(key))return;
      seen.add(key);
      collected.push(item);
    }
    const suggested=curated(location);
    // Only the London/Busan gallery has pixel-reviewed selections. Records
    // from the editorial archives require a CURRENT Commons licence check;
    // metadata copied from a previous file page is not enough.
    for(const image of suggested.filter(p=>p.source==='curated'))add(image);
    if(collected.length>=MAX_PHOTOS)return collected.slice(0,MAX_PHOTOS);
    const safe=promise=>Promise.resolve(promise).catch(()=>[]);
    if(typeof api.verifyNamedFiles==='function'){
      const proposed=suggested.filter(p=>p.source==='editorial-source');
      if(proposed.length){
        const checked=await safe(api.verifyNamedFiles(proposed));
        for(const photo of checked||[])add(photo);
      }
    }
    if(collected.length>=MAX_PHOTOS)return collected.slice(0,MAX_PHOTOS);
    // Check the EXACT encyclopaedia page, not a keyword result.
    if(typeof api.searchPage==='function'){
      const lead=await safe(api.searchPage(location.wiki||properName(location)));
      for(const photo of lead||[])add(photo,{lead:true});
    }
    if(collected.length>=MAX_PHOTOS)return collected.slice(0,MAX_PHOTOS);
    // Associated with the exact Wikipedia article, then checked against the
    // named destination or landmark (article membership alone is insufficient).
    if(typeof api.searchArticleImages==='function'){
      const article=await safe(api.searchArticleImages(location.wiki||properName(location)));
      for(const photo of (article||[]).sort((a,b)=>imageScore(b,location)-imageScore(a,location)))add(photo);
    }
    if(collected.length>=MAX_PHOTOS)return collected.slice(0,MAX_PHOTOS);
    // Commons coordinates verify the photograph was taken near this city; this
    // catches excellent images whose filename doesn't contain the place name.
    let nearbyCandidates=[];
    if(geoNearby(location)&&typeof api.searchNearby==='function'){
      const nearby=await safe(api.searchNearby(location.lat,location.lon,{radius:7000,limit:24}));
      // Geotag alone does not make a feature photo: reject generic interiors,
      // portraits and filenames lacking a descriptive scenic/landmark cue.
      const scenic=/panoram|skyline|aerial|scenic|view|waterfront|sunset|sunrise|cityscape|landscape|historic|bridge|harbour|harbor|mountain|cathedral|temple|beach|coast|park|garden|square|old town|palace|castle|street|river|lake|fortress|waterfall/i;
      nearbyCandidates=(nearby||[]).filter(item=>scenic.test(item.file+' '+(item.description||'')))
        .sort((a,b)=>imageScore(b,location)-imageScore(a,location));
      // Leave room for pictures of the destination's recognisable landmarks.
      const slots=Math.max(0,3-collected.length);
      for(const photo of nearbyCandidates.slice(0,slots))add(photo,{geo:true});
    }
    if(collected.length>=MAX_PHOTOS)return collected.slice(0,MAX_PHOTOS);
    if(typeof api.verifyApproved==='function'){
      const item=await safe(api.verifyApproved(location.id));
      if(item&&!Array.isArray(item))add(item);
    }
    // Restrict un-geotagged search results to named places or landmarks.
    if(typeof api.search==='function'){
      for(const query of candidatesFor(location)){
        if(collected.length>=MAX_PHOTOS)break;
        const result=await safe(api.search(query,{limit:24}));
        for(const photo of result||[])add(photo);
      }
    }
    // Geo coordinates remain a trustworthy fallback when search doesn't yield
    // enough directly identifiable features.
    if(collected.length<MAX_PHOTOS){
      for(const photo of nearbyCandidates){
        if(collected.length>=MAX_PHOTOS)break;
        add(photo,{geo:true});
      }
    }
    return collected.slice(0,MAX_PHOTOS);
  }
  function photosFor(location,{limit=MAX_PHOTOS,media}={}){
    const api=media||(typeof window!=='undefined'?window.RevisionWorldCommonsMedia:null);
    if(!api)return Promise.resolve(curated(location).filter(p=>p.source==='curated').slice(0,limit));
    const key=keyOf(location);
    // Injected clients are not cached across test runs. The real website reuses
    // its chosen set between shop thumbnails and unlocked galleries.
    if(media)return assemble(location,api).then(items=>items.slice(0,limit));
    if(!cache.has(key)){
      const task=assemble(location,api).catch(()=>curated(location).filter(p=>p.source==='curated'));
      cache.set(key,task);
    }
    return cache.get(key).then(items=>items.slice(0,limit));
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
    const loading=doc.createElement('span');loading.className='destination-photo-status';
    loading.textContent='Loading photographs…';el.append(loading);
    const current=photosFor(location,{limit:card?1:MAX_PHOTOS,media});
    return current.then(photos=>{
      if(!el.isConnected||el.dataset.galleryVersion!==version)return photos;
      el.replaceChildren();
      if(!photos.length){
        const msg=doc.createElement('span');msg.className='destination-photo-status';
        msg.textContent='Photographs unavailable';el.append(msg);return [];
      }
      const grid=doc.createElement('div');
      grid.className='destination-photo-grid photo-count-'+photos.length;
      const credits=doc.createElement('details');credits.className='destination-photo-credits';
      const summary=doc.createElement('summary');
      summary.textContent='Photo credits';credits.append(summary);
      const list=doc.createElement('ul');
      photos.forEach((photo,i)=>{
        const figure=doc.createElement('figure');figure.className='destination-photo-tile';
        const image=doc.createElement('img');
        image.alt=photo.description||('Photograph of '+location.name+' ('+(i+1)+')');
        image.loading=card?'lazy':i===0?'eager':'lazy';
        image.decoding='async';
        image.referrerPolicy='no-referrer';
        image.src=photo.url;
        let usedFallback=false;
        image.onerror=()=>{
          // If Wikimedia thumbnail delivery fails, try the full source file
          // rather than silently removing a perfectly suitable photograph.
          const original=photo.originalUrl;
          if(!usedFallback&&original&&original!==image.src){
            usedFallback=true;image.src=original;return;
          }
          figure.remove();
          grid.className='destination-photo-grid photo-count-'+grid.querySelectorAll('figure').length;
          if(!grid.querySelector('img')){
            const empty=doc.createElement('span');empty.className='destination-photo-status';
            empty.textContent='Photographs unavailable';grid.append(empty);
          }
        };
        figure.append(image);grid.append(figure);
        const li=doc.createElement('li');
        li.append(doc.createTextNode('Photo '+(i+1)+': '+photo.author+' · '));
        for(const [url,label] of [[photo.filePage,'Original full-quality file'],[photo.licenseUrl,photo.license]]){
          const link=doc.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';
          link.textContent=label;li.append(link,doc.createTextNode(' · '));
        }
        li.append(doc.createTextNode('Display-sized derivative; original retained at source.'));
        list.append(li);
      });
      el.append(grid);
      credits.append(list);
      if(card){
        credits.classList.add('card-photo-credit');
        summary.textContent='ⓘ';
        summary.setAttribute('aria-label','Photo credits and licence');
      }
      el.append(credits);
      return photos;
    }).catch(()=>{
      if(el.isConnected&&el.dataset.galleryVersion===version)el.textContent='Photographs unavailable';
      return [];
    });
  }
  return Object.freeze({photosFor,render,allowed,keywords,candidatesFor});
});
