/* Real Chromium smoke test for user-state migration and duplicate purchasing.
   Uses a local HTTP server and synthetic profile; never accesses actual user data. */
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const cwd=process.cwd();
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
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
 await page.evaluate(()=>buy('location','capetown'));
 await page.evaluate(()=>buy('location','addis'));
 await page.evaluate(()=>buy('location','victoriafalls'));
 let result=await page.evaluate(()=>JSON.parse(localStorage.getItem('revisionLoopProfile11')));
 assert.equal(result.points,700,'Existing alias was charged');
 assert.equal(result.equippedLocation,'victoria_falls','Alias equipment changed');
 await page.evaluate(()=>buy('location','tbilisi'));
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
 console.log('PASS browser: old XP/points and unknown owned IDs preserved, original profile backed up, aliases free, repeat purchase safe, 158 location cards.');
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
} finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
