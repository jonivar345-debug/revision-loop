/* v442 browser check: actual app Earth texture path, both CORS-success and offline-fallback. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {chromium} from 'playwright';

const root=process.cwd();
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try{
  const u=new URL(req.url||'/','http://localhost');
  const p=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':decodeURIComponent(u.pathname)));
  if(!p.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  res.setHeader('Content-Type',mime[path.extname(p)]||'application/octet-stream');
  res.setHeader('Cache-Control','no-store');
  res.end(await fs.readFile(p));
 }catch{res.writeHead(404);res.end('Missing asset')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const fixture=await fs.readFile('assets/world/accra/01-cover.webp');
const browser=await chromium.launch({headless:true});
try{
 for(const mode of ['satellite','offline']){
  const context=await browser.newContext({viewport:{width:390,height:820}});
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',error=>pageErrors.push(error.message));
  await page.route('**/*',route=>
   route.request().url().startsWith(origin)?route.continue():route.abort());
  if(mode==='satellite'){
   // Same cross-origin image path, but a fixed local image ensures the test
   // checks sizing and CORS behaviour without depending on Wikimedia uptime.
   await page.route('**/Blue_Marble_2002.jpg**',route=>route.fulfill({
    status:200,contentType:'image/webp',
    headers:{'access-control-allow-origin':'*'},body:fixture
   }));
  }
  await page.addInitScript(()=>{
   localStorage.setItem('rl_auth','1');
   localStorage.setItem('revisionLoopProfile11',JSON.stringify({
    economyVersion:2,points:104,lifetimeXp:407,reviews:10,
    shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},
    equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',
    daily:{},dailyChallenges:{},examResults:{},topicStats:{}
   }));
   localStorage.setItem('revisionLoopProgress5',JSON.stringify({oldReview:{stage:4,good:5}}));
  });
  await page.goto(origin+'/',{waitUntil:'domcontentloaded'});
  if(mode==='satellite'){
   await page.waitForFunction(()=>typeof satelliteReady!=='undefined'&&satelliteReady===true,{timeout:45000});
   const state=await page.evaluate(()=>({
    loaded:earthTextureReady&&satelliteReady,width:earthW,height:earthH,
    pixelCount:earthPixels?.length,
    points:profile.points,xp:profile.lifetimeXp,
    progress:JSON.parse(localStorage.getItem('revisionLoopProgress5'))?.oldReview?.stage
   }));
   assert.equal(state.loaded,true);
   assert.equal(state.width,2048);assert.equal(state.height,1024);
   assert.equal(state.pixelCount,2048*1024*4);
   assert.equal(state.points,104);assert.equal(state.xp,407);
   assert.equal(state.progress,4);
  }else{
   await page.waitForFunction(()=>typeof earthTextureReady!=='undefined'&&earthTextureReady===true,{timeout:45000});
   const state=await page.evaluate(()=>({
    local:earthTextureReady&&!satelliteReady,width:earthW,height:earthH,
    points:profile.points,xp:profile.lifetimeXp,
    progress:JSON.parse(localStorage.getItem('revisionLoopProgress5'))?.oldReview?.stage
   }));
   assert.equal(state.local,true,'Natural Earth fallback remains visible without satellite image');
   assert(state.width>100&&state.height>100,'Fallback has real pixel dimensions');
   assert.equal(state.points,104);assert.equal(state.xp,407);
   assert.equal(state.progress,4);
  }
  assert.deepEqual(pageErrors,[],'No uncaught browser errors');
  console.log('PASS v442 '+mode+': Earth map loads and owned profile + revision progress are unchanged');
  await context.close();
 }
}finally{
 await browser.close();await new Promise(resolve=>server.close(resolve));
}
