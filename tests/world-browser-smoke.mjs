/* Real Chromium smoke test for user-state migration and duplicate purchasing.
   Uses a local HTTP server and synthetic profile; never accesses actual user data. */
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const cwd=process.cwd();
const mime={'.webp':'image/webp','.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=http.createServer(async(req,res)=>{
 try{
  const uri=new URL(req.url||'/', 'http://localhost/');
  let pathname=decodeURIComponent(uri.pathname);
  if(pathname==='/')pathname='/index.html';
  const name=path.resolve(cwd,'.'+pathname);
  if(!name.startsWith(cwd+path.sep)){res.writeHead(403);res.end();return}
  const content=await fs.readFile(name);
  res.setHeader('Content-Type',mime[path.extname(name)]||'application/octet-stream');
  res.setHeader('Cache-Control','no-store');
  res.end(content);
 }catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const fixture={
 economyVersion:1,points:700,lifetimeXp:9412,reviews:102,
 shopOwned:{
  characters:['lelouch','cc','older_character'],
  outfits:['lelouch-default','cc-winter','older_character-special'],
  locations:['london','cape_town','addis_ababa','victoria_falls','archived_city']
 },
 equippedCharacter:'cc',equippedOutfit:'cc-winter',equippedLocation:'cape_town',
 errorLog:[{id:'saved_exam_mistake'}],examResults:{old_math:{marks:28}},
 daily:{"2026-10-20":{reviews:14}}
};
let browser;
try{
 browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1200,height:900}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/*',route=>{
  if(route.request().url().startsWith(origin+'/'))return route.continue();
  return route.abort();
 });
 await page.addInitScript(profile=>{
  localStorage.setItem('revisionLoopProfile11',JSON.stringify(profile));
  localStorage.setItem('rl_auth','1');
 },fixture);
 await page.goto(origin+'/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!localStorage.getItem('revisionLoopProfile-pre-world-v62'),{timeout:20000});
 try{
  await page.waitForFunction(()=>document.getElementById('locationCount')?.textContent?.includes('376'),null,{timeout:30000});
 }catch(error){
  const diag=await page.evaluate(()=>({
    shown:document.getElementById('locationCount')?.textContent,
    sync:document.getElementById('syncState')?.textContent,
    countryScript:!!window.RevisionWorldDestinations,
    countryCount:window.RevisionWorldDestinations?.length,
    oldProfile:typeof profile==='object'?{points:profile.points,locations:profile.shopOwned?.locations?.length}:null,
    appLoaded:typeof renderShop==='function'
  }));
  console.error('World browser startup diagnostics',diag,'Page errors:',errors);
  throw error;
 }
 const state=await page.evaluate(()=>({
  profile:profile,
  backup:JSON.parse(localStorage.getItem('revisionLoopProfile-pre-world-v62')),
  locationCount:document.getElementById('locationCount').textContent,
  gesture:typeof window.RevisionWorldGlobeGesture,
  media:typeof window.RevisionWorldCommonsMedia
 }));
 assert.equal(state.profile.points,700);
 assert.equal(state.profile.lifetimeXp,9412);
 assert.equal(state.profile.economyVersion,2);
 assert.deepEqual(state.backup,fixture);
 assert(state.profile.shopOwned.locations.includes('archived_city'),'Unknown owned location removed');
 assert(state.profile.shopOwned.characters.includes('older_character'),'Unknown bought character removed');
 assert(state.profile.shopOwned.outfits.includes('older_character-special'),'Unknown outfit removed');
 assert(state.locationCount.includes('/ 376'),'Duplicate destinations still count separately');
 assert.equal(state.gesture,'object');
 assert.equal(state.media,'object');
 const auditedPriority=await page.evaluate(async()=>{
   const expected={
     bali:'Tegalalang Rice Terraces.jpg',
     almaty:'Almaty Skyline from the Kök Töbe hill.jpg',
     dubai:'Dubai Burj Khalifa.jpg',
     marrakech:'Djemaa el Fna Marrakesch.jpg',
     vancouver:'Stanley Park - Vancouver BC - Canada.jpg',
     manila:'Jones Bridge, Manila.jpg'
   };
   const rows=[];
   for(const [id,filename] of Object.entries(expected)){
     const x=window.RevisionWorldLocalPhotos.get(id);
     if(x.length!==4||x[0].file!=='File:'+filename)throw Error('v105 editor lost place-specific source: '+id);
     if(new Set(x.map(p=>p.file)).size!==4)throw Error('Duplicate photo source for '+id);
     const lead=await window.RevisionWorldPhotoGallery.photosFor(LOCATIONS.find(p=>p.id===id),{limit:1});
     if(lead[0]?.file!==x[0].file)throw Error('Shop cover out of sync: '+id);
     rows.push(id);
   }
   return rows;
 });
 assert.equal(auditedPriority.length,6);

 const proof=await page.evaluate(async()=>{
   const pairs=[];
   for(const id of ['london','busan']){
     const place=LOCATIONS.find(location=>location.id===id);
     const pictures=await window.RevisionWorldPhotoGallery.photosFor(place,{limit:4});
     const first=await window.RevisionWorldPhotoGallery.photosFor(place,{limit:1});
     pairs.push({id,pictures:pictures.map(p=>({url:p.url,license:p.license,filePage:p.filePage,author:p.author})),
       first:first[0]?.filePage});
   }
   return pairs;
 });
 for(const p of proof){
   assert.equal(p.pictures.length,4,p.id+' must have four genuine featured images');
   assert(p.pictures.every(x=>x.url.startsWith('./assets/world/'+p.id+'/')&&x.author&&x.filePage.includes('commons.wikimedia.org')),
     p.id+' locally hosted photo or original Commons attribution missing');
   assert.equal(p.pictures[0].filePage,p.first,p.id+' shop thumbnail should match the unlocked gallery');
 }
 console.log('PASS London and Busan: four local real photos each, with original-source credits and matching shop/gallery lead.');

 // Check actual WebP decoding; a correct filename alone does not prove it loads.
 const decodedWorldImages=await page.evaluate(async()=>{
   const output=[];
   for(const id of ['london','busan','tokyo','rome','istanbul','bali','almaty','dubai','marrakech','vancouver','manila']){
     const images=window.RevisionWorldLocalPhotos.get(id);
     if(images.length!==4)throw Error('Missing four local photos for '+id);
     const first=images[0];
     for(const field of ['url','localCoverUrl']){
       const relative=first[field];
       if(!relative.endsWith('.webp')||!relative.startsWith('./assets/world/'))throw Error('Nonlocal or non-WebP '+id+' '+field);
       const element=new Image();
       element.src=relative;
       await element.decode();
       output.push({id,field,width:element.naturalWidth,height:element.naturalHeight});
     }
   }
   return output;
 });
 assert.equal(decodedWorldImages.length,22,'Failed local image decoding coverage');
 assert(decodedWorldImages.every(x=>x.width>=360&&x.height>=60),'Local gallery or cover decoded at invalid resolution');
 console.log('PASS WebP image decoding: 22 local files across 11 World destinations, both image sizes.');


 await page.waitForFunction(()=>earthTextureReady===true&&earthW>=700,null,{timeout:25000});
 const globeState=await page.evaluate(()=>{
  const color=(lat,lon)=>{
   const u=(lon+180)/360,v=(90-lat)/180;
   const x=Math.max(0,Math.min(earthW-1,Math.round(u*(earthW-1))));
   const y=Math.max(0,Math.min(earthH-1,Math.round(v*(earthH-1))));
   return Array.from(earthPixels.slice((y*earthW+x)*4,(y*earthW+x)*4+3));
  };
  return {
   texture:[earthW,earthH],
   africanLand:color(0,20),
   atlanticWater:color(0,-30),
   london:LOCATIONS.find(l=>l.id==='london'),
   pinCount:visibleGlobePins(700,360).length,
   londonPin:visibleGlobePins(700,360).find(item=>item.location.id==='london')?.owned,
   togglePresent:!!document.getElementById('showAllGlobePins')
  };
 });
 assert.deepEqual(globeState.texture,[2048,1024]);
 assert(globeState.africanLand.some((n,i)=>Math.abs(n-globeState.atlanticWater[i])>25),
   'Africa and the Atlantic still look like the same blue globe');
 assert(Math.abs(globeState.london.lat-51.507)<.05&&Math.abs(globeState.london.lon+0.128)<.05);
 assert(globeState.londonPin,'Owned London pin should remain visible on the real Earth');
 assert(globeState.pinCount<190,'Default map still has too many overlapping pins');
 assert(globeState.togglePresent,'Pin density toggle missing');
 const allPinState=await page.evaluate(()=>{
   document.getElementById('showAllGlobePins').checked=true;
   drawGlobe();
   return visibleGlobePins(700,360).length;
 });
 assert(allPinState>globeState.pinCount,'Show-all toggle should reveal accurate hidden markers');
 await page.locator('.tab[data-panel="shop"]').click();
 // Render a real local London shop cover for deterministic licence testing.
 // Lazy shop pagination may otherwise leave no covers mounted in this fixture.
 await page.evaluate(async()=>{
   const host=document.createElement('div');
   host.id='worldPhotoCreditsSmokeFixture';
   document.getElementById('locationShop').append(host);
   await window.RevisionWorldPhotoGallery.render(host,LOCATIONS.find(x=>x.id==='london'),{card:true});
 });
 assert((await page.locator('#worldPhotoCreditsSmokeFixture .destination-photo-credits li').count())>0,
    'Local shop image lost its accessible attribution data');
 await page.locator('#worldPhotoCreditsButton').click();
 assert.equal(await page.locator('#worldPhotoCreditsDialog').evaluate(node=>node.open),true,'Image licences dialog failed to open');
 const displayedCredits=await page.locator('#worldPhotoCreditsList li').count();
 assert(displayedCredits>0,'Photo credits disappeared from the shared licence dialog');
 const creditLinks=await page.locator('#worldPhotoCreditsList a').count();
 assert(creditLinks>=2,'Shared panel must retain original and licence links');
 await page.locator('#worldPhotoCreditsClose').click();
 assert.equal(await page.locator('#worldPhotoCreditsDialog').evaluate(node=>node.open),false,'Image licences dialog failed to close');
 await page.locator('#worldPhotoCreditsSmokeFixture').evaluate(node=>node.remove());

 const wardrobeDom=await page.evaluate(()=>{
   const card=document.querySelector('#characterShop .character-card .character-art');
   const costumes=[...document.querySelectorAll('#outfitShop .outfit-card .character-art')];
   return {
     characterCount:document.querySelectorAll('#characterShop .character-card').length,
     count:costumes.length,
     illustratedFace:!!card?.querySelector('.character-loading>svg[role="img"]'),
     garmentShapes:costumes.map(node=>node.querySelector('.costume-silhouette .outfit-garment-details')?.innerHTML||''),
     privateUploadsStillAvailable:document.querySelectorAll('[data-outfit-upload]').length,
     characterLookup:typeof matchName==='function'&&matchName(['C.C.'],'C.C.')&&!matchName(['C.C.'],'C. D.')
   };
 });
 assert(wardrobeDom.characterCount>0&&wardrobeDom.illustratedFace,'No recognisable offline character illustration in shop');
 assert.equal(wardrobeDom.count,8,'Selected character lost wardrobe slots');
 assert.equal(new Set(wardrobeDom.garmentShapes).size,8,'Outfits still render the same clothing silhouette');
 assert.equal(wardrobeDom.privateUploadsStillAvailable,8,'Personal artwork upload slots disappeared');
 assert(wardrobeDom.characterLookup,'Safer character identity matching regressed in real browser');
 console.log('PASS browser wardrobe: 8 distinct garments, character-specific illustrated fallback, private image controls and safer full-name matching.');

 await page.locator('#globePlaceSearch').fill('London');
 await page.locator('#globeFindPlace').click();
 await page.locator('#globeLocationInfo .globe-info-top h3').waitFor({timeout:10000});
 assert.equal((await page.locator('#globeLocationInfo .globe-info-top h3').textContent())?.trim(),'London');
 assert(await page.evaluate(()=>Math.abs(globeLon+0.1276)<0.05),'London camera is not at the real longitude');
 await page.locator('#detailPhotoOne.destination-photo-gallery').waitFor({timeout:15000});
 assert.equal(await page.locator('#detailPhotoOne .location-accurate-map').count(),0,'Maps must not appear as substitute photographs');
 await page.locator('#globeLocationInfo [data-world-long-story] .location-background').first().waitFor({timeout:15000});
 assert.equal(await page.locator('#globeLocationInfo [data-world-long-story] .location-background').count(),4,'London should have four London-specific sections');
 assert(!(await page.locator('#globeLocationInfo [data-world-long-story]').textContent()).includes('Jodrell Bank'),'Unrelated country text should not appear beneath London');
 assert.equal(await page.locator('#globeLocationInfo .detail-links').count(),0,'Unwanted source links still visible');
 // A genuine canvas click on the accurately projected owned pin opens the guide.
 await page.evaluate(()=>setLocationInfo('london'));
 const locationPixel=await page.evaluate(()=>{
   const l=LOCATIONS.find(x=>x.id==='london'),canvas=document.getElementById('globe'),p=project(l.lat,l.lon,canvas.width,canvas.height);
   const bounds=canvas.getBoundingClientRect();
   return {x:p.x*bounds.width/canvas.width,y:p.y*bounds.height/canvas.height};
 });
 await page.locator('#globe').click({position:locationPixel});
 await page.locator('#globeLocationInfo .globe-info-top h3').waitFor({timeout:10000});
 assert.equal((await page.locator('#globeLocationInfo h3').first().textContent())?.trim(),'London');
 console.log('PASS geographic interaction: London search centres the exact longitude, a photo gallery replaces maps, and clicking an owned pin opens the guide.');

 // Verify a new country pin loads its four research sections automatically.
 await page.evaluate(()=>buy('location','country-fr'));
 await page.evaluate(()=>setLocationInfo('country-fr'));
 await page.locator('#globeLocationInfo .location-full-story .location-background h4').first().waitFor({timeout:15000});
 assert.equal(await page.locator('#globeLocationInfo .location-full-story .location-background').count(),4);
 assert.equal(await page.locator('#globeLocationInfo a[href*="world-library-preview"]').count(),0);
 await page.evaluate(()=>{profile.points+=75;save()}); // Restore test-only point balance.
 await page.evaluate(()=>buy('location','capetown'));
 await page.evaluate(()=>buy('location','addis'));
 await page.evaluate(()=>buy('location','victoriafalls'));
 let result=await page.evaluate(()=>JSON.parse(localStorage.getItem('revisionLoopProfile11')));
 assert.equal(result.points,700,'Existing alias was charged');
 assert.equal(result.equippedLocation,'victoria_falls','Alias equipment changed');
 await page.evaluate(()=>buy('location','tbilisi'));
 const focussed=await page.evaluate(()=>{
   const p=LOCATIONS.find(x=>x.id==='tbilisi');
   const pins=visibleGlobePins(700,360);
   return {lon:globeLon,lat:globeLat,location:p,owned:pins.find(x=>x.location.id==='tbilisi')?.owned};
 });
 assert(Math.abs(focussed.lon-focussed.location.lon)<.001&&Math.abs(focussed.lat-focussed.location.lat)<.001,
   'Unlocking a location must turn the Earth to its real position');
 assert(focussed.owned===true,'Newly purchased Tbilisi pin did not become unlocked');
 result=await page.evaluate(()=>JSON.parse(localStorage.getItem('revisionLoopProfile11')));
 const actualCost=await page.evaluate(()=>LOCATIONS.find(x=>x.id==='tbilisi').cost);
 assert.equal(result.points,700-actualCost);
 await page.evaluate(()=>buy('location','tbilisi'));
 result=await page.evaluate(()=>JSON.parse(localStorage.getItem('revisionLoopProfile11')));
 assert.equal(result.points,700-actualCost,'Repeated purchase deducted twice');
 assert.equal(result.lifetimeXp,9412);
 await page.evaluate(()=>{locationVisibleLimit=500;renderLocationGallery()});
 const cards=await page.locator('#locationShop .location-card').count();
 assert.equal(cards,376,'Shop has duplicate destination cards');
 assert(!(await page.locator('[data-location="cape_town"]').count()));
 assert(await page.locator('[data-location="country-fr"]').count(),'France gateway pin not in shop');
 assert(await page.locator('[data-location="sea-mediterranean"]').count(),'Mediterranean pin not in shop');
 assert(await page.locator('[data-location="ocean-pacific"]').count(),'Pacific pin not in shop');
 assert(await page.locator('[data-location="capetown"]').count());
 assert(!errors.some(e=>/ReferenceError|SyntaxError|TypeError/.test(e)),'Client runtime error(s): '+errors.join(' | '));
 console.log('PASS browser: historical XP, points and purchases preserved; 376 unique country, marine and historic destination cards.');
 // The research archive is precached, but the retired standalone preview
 // must send visitors to the main app instead of exposing a public article list.
 await page.evaluate(()=>navigator.serviceWorker.ready);
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller,null,{timeout:30000});
 await page.unroute('**/*');
 await page.context().setOffline(true);
 await page.goto(origin+'/world-library-preview.html?country=GE',{waitUntil:'domcontentloaded',timeout:30000});
 await page.waitForURL('**/index.html#shop',{timeout:30000});
 await page.locator('#shop.active').waitFor({timeout:15000});
 assert.equal(await page.locator('#articlePanel').count(),0,'Standalone article browser still visible');
 // Unlocking a country now exposes the same article only under the owned pin.
 await page.evaluate(()=>buy('location','country-ge'));
 await page.evaluate(()=>setLocationInfo('country-ge'));
 await page.locator('#globeLocationInfo .location-full-story').waitFor({timeout:15000});
 await page.waitForFunction(()=>document.querySelector('#globeLocationInfo .location-full-story')?.textContent?.includes('Upper Svaneti'),null,{timeout:20000});
 assert.equal(await page.locator('#globeLocationInfo [data-world-long-story]').count(),1);
 await page.context().setOffline(false);
 console.log('PASS browser offline: old public preview redirects to the World shop; Georgia country research is readable only in the unlocked pin details.');
  const mobile=await browser.newPage({viewport:{width:390,height:780},isMobile:true,hasTouch:true});
 await mobile.route('**/*',route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
 await mobile.addInitScript(()=>localStorage.setItem('rl_auth','1'));
 await mobile.goto(origin+'/',{waitUntil:'domcontentloaded'});
 await mobile.waitForFunction(()=>document.getElementById('globeZoomValue')?.textContent==='100%',{timeout:30000});
 await mobile.locator('.tab[data-panel="shop"]').click();
 await mobile.locator('#globeZoomIn').click();
 await mobile.waitForFunction(()=>document.getElementById('globeZoomValue').textContent!=='100%',{timeout:10000});
 const zoom=await mobile.locator('#globeZoomValue').textContent();
 assert(Number.parseInt(zoom)>100,'Touch viewport zoom buttons failed');
 assert(!errors.length,'Desktop page errors: '+errors.join(' | '));
 console.log('PASS browser mobile: world zoom accessible in touch viewport; no profile interaction required.');
 // Real Chromium multi-touch events, not a zoom-button mock.
 // The pin globe should pinch without rotating, then resume one-finger drag.
 await mobile.locator('#globeZoomReset').click();
 assert.equal(await mobile.locator('#globeZoomValue').textContent(),'100%');
 await mobile.locator('#globe').scrollIntoViewIfNeeded();
 const rect=await mobile.locator('#globe').boundingBox();
 assert(rect&&rect.width>100&&rect.height>100,'Touch globe is not laid out');
 const centre={x:rect.x+rect.width/2,y:rect.y+rect.height/2};
 const point=(x,y,id)=>({x,y,id,radiusX:6,radiusY:6,force:1});
 const cdp=await mobile.context().newCDPSession(mobile);
 const left=point(centre.x-25,centre.y,1),right=point(centre.x+25,centre.y,2);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[left]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[left,right]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[
  point(centre.x-68,centre.y,1),point(centre.x+68,centre.y,2)]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const afterPinch=parseInt(await mobile.locator('#globeZoomValue').textContent(),10);
 assert(afterPinch>=125,'Two-finger pinch did not magnify globe: '+afterPinch+'%');
 assert(afterPinch<=220,'Globe zoom exceeded safe maximum');
 assert(await mobile.evaluate(()=>window.RevisionWorldGlobeGesture?.isPinching()===false),
  'Pinch capture failed to reset after touch release');
 const oldLongitude=await mobile.evaluate(()=>globeLon);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point(centre.x-44,centre.y+3,3)]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[point(centre.x+42,centre.y+3,3)]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const newLongitude=await mobile.evaluate(()=>globeLon);
 const longitudeDelta=Math.abs(((newLongitude-oldLongitude+540)%360)-180);
 assert(longitudeDelta>3,'One-finger rotation remained suppressed after pinch: '+longitudeDelta);
 assert(await mobile.evaluate(()=>window.RevisionWorldGlobeGesture?.isPinching()===false),
  'Touch rotation returned to pinch state');
 console.log('PASS browser mobile multi-touch: pinch zoom '+afterPinch+'%, drag-after-pinch moved globe '+longitudeDelta.toFixed(1)+' degrees without pointer capture leak.');

 // Review the actual local photo gallery index and shop-card crops in Chromium.
 const reviewData=JSON.parse(await fs.readFile(path.join(cwd,'editorial/reviews/world-local-photo-review-index.json'),'utf8'));
 const reviewPage=await browser.newPage({viewport:{width:980,height:780}});
 const reviewErrors=[];
 reviewPage.on('pageerror',error=>reviewErrors.push(error.message));
 await reviewPage.route('**/*',route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
 await reviewPage.goto(origin+'/editorial/reviews/world-photo-review.html',{waitUntil:'domcontentloaded'});
 await reviewPage.waitForFunction(count=>document.querySelector('#summary')?.textContent?.includes(count+' photographs'),reviewData.photoCount,{timeout:20000});
 assert.equal(await reviewPage.locator('.card').count(),12,'Review should paginate galleries for mobile performance');
 const firstReviewImage=reviewPage.locator('.card figure img').first();
 await firstReviewImage.evaluate(image=>image.decode());
 assert((await firstReviewImage.getAttribute('src')).includes('-cover.webp'),'Review must show real first-party shop-cover pixels');
 await reviewPage.locator('#view').selectOption('full');
 assert((await firstReviewImage.getAttribute('src')).includes('-gallery.webp'),'Full-frame review does not load local gallery image');
 assert.equal(await firstReviewImage.evaluate(image=>getComputedStyle(image).objectFit),'contain');
 await reviewPage.locator('#filter').selectOption('new');
 await reviewPage.waitForFunction(count=>document.querySelector('#summary')?.textContent?.startsWith(count+' matching destinations'),reviewData.destinations.filter(x=>x.newInV109).length);
 await reviewPage.locator('#search').fill('swakopmund');
 assert.equal(await reviewPage.locator('.card').count(),1,'Destination photo filtering failed');
 assert(!reviewErrors.length,'Photo review page JavaScript errors: '+reviewErrors.join(' | '));
 await reviewPage.close();
 console.log('PASS real browser visual review: paginated local images, cover/full-photo toggle, searchable v109 galleries and decoded WebP files.');

} finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
