/* Chromium phone/desktop and progress transfer test.
   Isolated local HTTP server. All account/API traffic blocked, synthetic data only. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';

const root=process.cwd();
const mime={'.js':'text/javascript','.css':'text/css','.html':'text/html','.json':'application/json',
 '.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png',
 '.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url||'/','http://localhost');
  const pathname=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
  const target=path.resolve(root,'.'+pathname);
  if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  const data=await fs.readFile(target);
  res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream',
    'Cache-Control':'no-store'});res.end(data);
 }catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin='http://127.0.0.1:'+server.address().port;
const seed={
 revisionLoopProgress5:JSON.stringify({saved_card_one:{stage:4,due:1840000000000,
  history:[{t:1794200000000,rating:'good',answer:'correct',stability:10}],good:3}}),
 revisionLoopProfile11:JSON.stringify({economyVersion:2,points:246,lifetimeXp:830,reviews:14,
  daily:{'2026-11-09':{reviews:1,newCards:0,flashCorrect:1,examMarks:2}},
  shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london','busan']},
  equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',
  examResults:{test_question:{last:{marks:4,max:5,date:1794200000000}}},
  errorLog:[{id:'test_question',type:'exam'}],topicStats:{},topicWeakness:{}}),
 revisionLoopSettings11:JSON.stringify({dailyNew:18,focusSubject:'Chemistry'})
};
const browser=await chromium.launch({headless:true});
async function newDevice({width,height,mobile=false,initial={}}){
 const ctx=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile,acceptDownloads:true});
 const page=await ctx.newPage();
 await page.route('**/*',route=>{
  if(route.request().url().startsWith(origin+'/'))return route.continue();
  return route.abort(); // No Firebase sign-in, remote API or external photos
 });
 await page.addInitScript(payload=>{
  for(const [key,value] of Object.entries(payload))localStorage.setItem(key,value);
  localStorage.setItem('rl_auth','1');
 },initial);
 await page.goto(origin+'/',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>
  document.getElementById('syncState')?.textContent?.includes('flashcards'),
  null,{timeout:60000});
 return {ctx,page};
}
async function overflow(page,label){
 const dims=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,
  doc:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
 assert(dims.doc<=dims.viewport+3,label+': horizontal overflow '+JSON.stringify(dims));
 console.log('PASS '+label+' viewport '+dims.viewport+' document '+dims.doc);
}
try{
 const desktop=await newDevice({width:1280,height:850,initial:seed});
 const pc=desktop.page;
 await overflow(pc,'desktop auto');
 assert.equal(await pc.evaluate(()=>JSON.parse(localStorage.getItem('revisionLoopProfile11')).lifetimeXp),830);
 await pc.locator('.top-layout-switch [data-layout-choice="phone"]').click();
 assert.equal(await pc.locator('html').getAttribute('data-layout-mode'),'phone');
 const box=await pc.locator('#app').boundingBox();
 assert(box&&box.width<=462,'Phone layout should not exceed 460px on desktop');
 await pc.locator('.top-layout-switch [data-layout-choice="pc"]').click();
 assert.equal(await pc.locator('html').getAttribute('data-layout-mode'),'pc');
 await pc.reload({waitUntil:'domcontentloaded'});
 await pc.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:60000});
 assert.equal(await pc.locator('html').getAttribute('data-layout-mode'),'pc');
 await overflow(pc,'desktop forced-PC');
 await pc.locator('button.tab[data-panel="progress"]').click();
 const before=await pc.evaluate(()=>({
  xp:JSON.parse(localStorage.getItem('revisionLoopProfile11')).lifetimeXp,
  saved:JSON.parse(localStorage.getItem('revisionLoopProgress5')).saved_card_one.history.length,
  exam:JSON.parse(localStorage.getItem('revisionLoopProfile11')).examResults.test_question.last.marks
 }));
 assert.deepEqual(before,{xp:830,saved:1,exam:4});

 // The genuine download button must serialize the original 3 independent storage keys.
 const downloadReady=pc.waitForEvent('download');
 await pc.locator('#downloadRevisionBackup').click();
 const download=await downloadReady, buffer=await fs.readFile(await download.path());
 const archive=JSON.parse(buffer.toString('utf8'));
 assert.deepEqual(Object.keys(archive.values).sort(),Object.keys(seed).sort());
 for(const key of Object.keys(seed))assert.equal(archive.values[key],seed[key],key+' not preserved');

 const phone=await newDevice({width:390,height:800,mobile:true,
  initial:{revisionLoopLayoutModeV1:'phone'}});
 const mp=phone.page;
 await overflow(mp,'390px mobile auto');
 await mp.locator('.top-layout-switch [data-layout-choice="pc"]').click();
 await overflow(mp,'390px forced-PC');
 assert.equal(await mp.locator('html').getAttribute('data-layout-mode'),'pc');
 await mp.locator('.top-layout-switch [data-layout-choice="phone"]').click();
 await mp.locator('button.tab[data-panel="progress"]').click();
 mp.on('dialog',dialog=>dialog.accept());
 await mp.locator('#restoreRevisionBackup').setInputFiles({
  name:'offline-revision-backup.json',mimeType:'application/json',buffer
 });
 await mp.waitForFunction(()=>
  JSON.parse(localStorage.getItem('revisionLoopProfile11')||'{}').lifetimeXp===830,
  null,{timeout:20000});
 // Progress must be identical but device preferences and PIN state must remain local.
 const restored=await mp.evaluate(()=>({
  progress:localStorage.getItem('revisionLoopProgress5'),
  profile:localStorage.getItem('revisionLoopProfile11'),
  settings:localStorage.getItem('revisionLoopSettings11'),
  mode:localStorage.getItem('revisionLoopLayoutModeV1'),
  cloudRestoreFlag:localStorage.getItem('revisionLoopCloudManualRestorePending'),
  remembered:localStorage.getItem('rl_auth')
 }));
 assert.equal(restored.progress,seed.revisionLoopProgress5);
 assert.equal(restored.profile,seed.revisionLoopProfile11);
 assert.equal(restored.settings,seed.revisionLoopSettings11);
 assert.equal(restored.mode,'phone');
 assert.equal(restored.remembered,'1');
 assert.equal(restored.cloudRestoreFlag,'1','Manual import must not silently replace cloud progress');
 await overflow(mp,'390px after progress restore');

 // Browser-only offline saves should work with an open page and survive reconnect/reload.
 await phone.ctx.setOffline(true);
 await mp.evaluate(()=>{award(2,'exam')});
 const offline=await mp.evaluate(()=>JSON.parse(localStorage.getItem('revisionLoopProfile11')));
 assert.equal(offline.lifetimeXp,832);
 assert.equal(offline.points,248);
 await phone.ctx.setOffline(false);
 await mp.reload({waitUntil:'domcontentloaded'});
 await mp.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:60000});
 assert.equal(await mp.evaluate(()=>JSON.parse(localStorage.getItem('revisionLoopProfile11')).lifetimeXp),832);
 await overflow(mp,'390px after offline/reconnect');
 await phone.ctx.close();

 const small=await newDevice({width:360,height:760,mobile:true});
 await overflow(small.page,'360px mobile auto');
 await small.page.locator('.top-layout-switch [data-layout-choice="pc"]').click();
 await overflow(small.page,'360px forced-PC');
 await small.ctx.close();
 await desktop.ctx.close();
 console.log('PASS v428 genuine Chromium: phone/desktop layouts, download/import, full progress, local-only offline award and reconnect.');
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
