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
  // These four first-party photographs are more recognisable at full frame than
  // a replacement chosen purely to improve the shop-card crop-area statistic.
  const FULL_FRAME_CARD_IDS=new Set(['oaxaca','portlouis','sanfrancisco','sea-red']);
  // Actual WebP images inspected in the final v117 batch: keep the original
  // four-photo gallery sequence but show clearer slot-specific shop covers.
  const V117_SHOP_COVERS=Object.freeze({
    budapest:{slot:3,file:"Fisherman's Bastion, Budapest, Hungary.jpg"},
    victoriafalls:{slot:2,file:'Victoria Falls from Air.jpg'}
  });
  const cache=new Map();
  // Preserve deliberately ordered iconic landmark sets and the 8 original
  // visually reviewed London/Busan photographs. Remaining source candidates
  // are ranked for scenic coverage and recognisable location-specific covers.
  const fixedLeadPlaces=new Set([
    'london','busan','tokyo','seoul','tbilisi','singapore','paris','newyork',
    'hongkong','sydney','shanghai','beijing','kyoto','rome','istanbul',
    'barcelona','venice','dubrovnik','bangkok'
  ]);

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
  // First-party photographs are already archived with verified source rights;
  // do not make them wait for a live Commons API request.
  function local(location){
    const store=typeof window!=='undefined'?window.RevisionWorldLocalPhotos:null;
    return store?.get(location.id)||[];
  }
  function imageScore(item,location){
    const name=uniqueName(item.file+' '+(item.description||''));
    const main=uniqueName(properName(location));
    // Source-checked priority photos lead only after the normal Commons licence check.
    let score=(Number(item.width)>=3000?8:Number(item.width)>=1800?4:0);
    if(item.qualityPriority===1000&&item.source==='editorial-source')score+=1000;
    if(item.qualityPriority===900&&item.source==='editorial-source')score+=900;
    if(item.qualityPriority===950&&item.source==='editorial-source')score+=950;
    if(main.length>=4&&name.includes(main))score+=10;
    if(/panoram|skyline|aerial|scenic|view|waterfront|sunset|sunrise|cityscape|landscape|historic|bridge|harbour|harbor|mountain|cathedral|temple|beach|coast/.test(name))score+=8;
    if(/entrance|window|signboard|interior|construction|parking|carpark|person|people|advert|hotel room|museum object/.test(name))score-=14;
    return score;
  }
  async function assemble(location,api,target=MAX_PHOTOS){
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
    for(const image of local(location))add(image);
    if(collected.length>=target)return collected.slice(0,target);
    // Only the London/Busan gallery has pixel-reviewed selections. Records
    // from the editorial archives require a CURRENT Commons licence check;
    // metadata copied from a previous file page is not enough.
    for(const image of suggested.filter(p=>p.source==='curated'))add(image);
    if(collected.length>=target)return collected.slice(0,target);
    const safe=promise=>Promise.resolve(promise).catch(()=>[]);
    if(typeof api.verifyNamedFiles==='function'){
      const proposed=suggested.filter(p=>p.source==='editorial-source');
      if(!fixedLeadPlaces.has(location.id))
        proposed.sort((a,b)=>imageScore(b,location)-imageScore(a,location));
      if(proposed.length){
        const checked=await safe(api.verifyNamedFiles(proposed));
        for(const photo of checked||[])add(photo);
      }
    }
    if(collected.length>=target)return collected.slice(0,target);
    // Check the EXACT encyclopaedia page, not a keyword result.
    if(typeof api.searchPage==='function'){
      const lead=await safe(api.searchPage(location.wiki||properName(location)));
      for(const photo of lead||[])add(photo,{lead:true});
    }
    if(collected.length>=target)return collected.slice(0,target);
    // Associated with the exact Wikipedia article, then checked against the
    // named destination or landmark (article membership alone is insufficient).
    if(typeof api.searchArticleImages==='function'){
      const article=await safe(api.searchArticleImages(location.wiki||properName(location)));
      for(const photo of (article||[]).sort((a,b)=>imageScore(b,location)-imageScore(a,location)))add(photo);
    }
    if(collected.length>=target)return collected.slice(0,target);
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
      const slots=Math.max(0,Math.min(3,target)-collected.length);
      for(const photo of nearbyCandidates.slice(0,slots))add(photo,{geo:true});
    }
    if(collected.length>=target)return collected.slice(0,target);
    if(typeof api.verifyApproved==='function'){
      const item=await safe(api.verifyApproved(location.id));
      if(item&&!Array.isArray(item))add(item);
    }
    // Restrict un-geotagged search results to named places or landmarks.
    if(typeof api.search==='function'){
      for(const query of candidatesFor(location)){
        if(collected.length>=target)break;
        const result=await safe(api.search(query,{limit:24}));
        for(const photo of result||[])add(photo);
      }
    }
    // Geo coordinates remain a trustworthy fallback when search doesn't yield
    // enough directly identifiable features.
    if(collected.length<target){
      for(const photo of nearbyCandidates){
        if(collected.length>=target)break;
        add(photo,{geo:true});
      }
    }
    return collected.slice(0,target);
  }
  // The shop only displays small covers: request a real Commons derivative
  // rather than loading the 2048px gallery rendition for every shop card.
  // The original-resolution file remains linked in photo credits.
  function coverSizedUrl(photo){
    if(photo.localCoverUrl)return photo.localCoverUrl;
    if(!String(photo.filePage||'').startsWith('https://commons.wikimedia.org/wiki/File:'))return photo.url;
    const filename=String(photo.file||'').replace(/^File:/i,'').replace(/ /g,'_');
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(filename)+'?width=960';
  }
  function photosFor(location,{limit=MAX_PHOTOS,media}={}){
    const api=media||(typeof window!=='undefined'?window.RevisionWorldCommonsMedia:null);
    if(!api)return Promise.resolve(curated(location).filter(p=>p.source==='curated').slice(0,limit));
    const target=Math.max(1,Math.min(MAX_PHOTOS,Math.trunc(limit)||MAX_PHOTOS));
    // Shop cards only need one cover photograph: do not make every thumbnail
    // wait for the other three gallery requests. Both paths use the same
    // deterministic source order, so the cover remains gallery photo one.
    const key=keyOf(location)+'|'+target;
    if(media)return assemble(location,api,target);
    if(!cache.has(key)){
      // Failed Commons requests and empty transient searches should be retried
      // next time the user opens this place, not frozen as a blank card forever.
      const task=assemble(location,api,target)
        .then(photos=>{if(!photos.length)cache.delete(key);return photos})
        .catch(()=>{cache.delete(key);return curated(location).filter(p=>p.source==='curated').slice(0,target)});
      cache.set(key,task);
    }
    return cache.get(key);
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
    const pref=card&&typeof window!=='undefined' ? (window.RevisionWorldShopCoverPriorities?.get(location.id)||V117_SHOP_COVERS[location.id]) : null;
    const current=photosFor(location,{limit:pref?MAX_PHOTOS:card?1:MAX_PHOTOS,media});
    return current.then(photos=>{
      if(!el.isConnected||el.dataset.galleryVersion!==version)return photos;
      if(card&&pref){const choice=photos[pref.slot-1];photos=[choice?.localCoverUrl&&choice.file==='File:'+pref.file?choice:photos[0]].filter(Boolean)}
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
        const preserveEntireFrame=card&&Boolean(photo.localCoverUrl)&&FULL_FRAME_CARD_IDS.has(location.id);
        const backdrop=preserveEntireFrame?doc.createElement('img'):null;
        if(backdrop){
          figure.classList.add('full-frame-card-cover');
          backdrop.className='card-cover-backdrop';
          backdrop.alt='';
          backdrop.setAttribute('aria-hidden','true');
          backdrop.loading='lazy';
          backdrop.decoding='async';
          backdrop.referrerPolicy='no-referrer';
          figure.append(backdrop);
          image.classList.add('card-cover-full-image');
        }
        image.loading=card?'lazy':i===0?'eager':'lazy';
        image.decoding='async';image.referrerPolicy='no-referrer';
        const li=doc.createElement('li');
        let active=photo,stage=0,swapping=false;
        const tried=new Set([photo.filePage]);
        function updateCredit(p){
          li.replaceChildren();
          li.append(doc.createTextNode('Photo '+(i+1)+': '+p.author+' · '));
          for(const [url,label] of [[p.filePage,'Original full-quality file'],[p.licenseUrl,p.license]]){
            const link=doc.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';
            link.textContent=label;li.append(link,doc.createTextNode(' · '));
          }
          li.append(doc.createTextNode(p.localCoverUrl?'Locally hosted display-sized copy; original retained at source.':'Display-sized derivative; original retained at source.'));
        }
        function display(p){
          active=p;stage=0;
          image.alt=p.description||('Photograph of '+location.name+' ('+(i+1)+')');
          image.src=card?coverSizedUrl(p):p.url;
          if(backdrop)backdrop.src=image.src;
          updateCredit(p);
        }
        image.onerror=async()=>{
          if(!el.isConnected||el.dataset.galleryVersion!==version)return;
          // First retry a shop cover with the standard 2048px Commons image.
          if(stage===0&&image.src!==active.url){stage=1;image.src=active.url;return}
          // Some Commons thumbnail servers intermittently fail even though the
          // original is intact. Do not replace an image with a different place.
          if(stage<2&&active.originalUrl&&active.originalUrl!==image.src){
            stage=2;image.src=active.originalUrl;return;
          }
          if(card&&!swapping){
            swapping=true;
            // A failed leading cover may use the NEXT currently verified photo
            // from this destination's own gallery, with matching new credits.
            const alternatives=await photosFor(location,{limit:4,media}).catch(()=>[]);
            swapping=false;
            if(!el.isConnected||el.dataset.galleryVersion!==version)return;
            const next=alternatives.find(p=>p?.filePage&&!tried.has(p.filePage));
            if(next){tried.add(next.filePage);display(next);return}
          }
          figure.remove();li.remove();
          grid.className='destination-photo-grid photo-count-'+grid.querySelectorAll('figure').length;
          if(!grid.querySelector('img')){
            const empty=doc.createElement('span');empty.className='destination-photo-status';
            empty.textContent='Photographs unavailable';grid.append(empty);
          }
        };
        display(photo);
        figure.append(image);grid.append(figure);
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
