/* v453: phone/desktop UI navigation, theme and connected-key-panel browser QA. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {chromium} from 'playwright';

const root=process.cwd();
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer(async(req,res)=>{
 try{
  const uri=new URL(req.url||'/','http://127.0.0.1').pathname;
  const file=path.resolve(root,'.'+(uri==='/'?'/index.html':decodeURIComponent(uri)));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(await fs.readFile(file));
 }catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
try{
 for(const width of [360,390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:850},isMobile:width<500,hasTouch:width<500,reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith(url)?route.continue():route.abort());
  await page.addInitScript(()=>{
   localStorage.setItem('rl_auth','1');
   if(!localStorage.getItem('revisionLoopProgress5'))localStorage.setItem('revisionLoopProgress5',JSON.stringify({uiTestProgress:{good:3,stage:2}}));
   if(!localStorage.getItem('revisionLoopProfile11'))localStorage.setItem('revisionLoopProfile11',JSON.stringify({economyVersion:2,lifetimeXp:94,points:31,reviews:5,shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},equippedCharacter:'lelouch',equippedLocation:'london',daily:{},examResults:{}}));
  });
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:120000});
  assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  assert.equal(await page.locator('.quick-nav-btn').count(),6);
  assert(await page.locator('#cloudQuickDetails').isVisible(),'New browser must show private-key setup');
  const initial=await page.evaluate(()=>({
   overflow:document.documentElement.scrollWidth>innerWidth+1,
   xp:profile.lifetimeXp,
   oldGood:progress.uiTestProgress?.good,
   theme:document.documentElement.dataset.theme
  }));
  assert.deepEqual(initial,{overflow:false,xp:94,oldGood:3,theme:'light'});
  await page.locator('#themeToggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  assert.equal(await page.locator('#themeToggle').getAttribute('aria-label'),'Switch to light mode');
  const background=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
  assert.notEqual(background,'rgb(243, 246, 252)');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:120000});
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark','Dark mode should persist on device');
  await page.locator('[data-jump="exam"]').click();
  assert(await page.locator('#study').evaluate(el=>el.classList.contains('active')));
  assert(await page.locator('#examControls').isVisible());
  assert.equal(await page.locator('[data-jump="exam"]').getAttribute('aria-current'),'page');
  const examPosition=await page.locator('#study').evaluate(el=>Math.round(el.getBoundingClientRect().top));
  assert(examPosition>=0&&examPosition<200,'Exam jump must scroll to study section, got '+examPosition);
  await page.locator('[data-jump="progress"]').click();
  assert(await page.locator('#progress').isVisible());
  const pos=await page.locator('#progress').evaluate(el=>Math.round(el.getBoundingClientRect().top));
  assert(pos>=0&&pos<190,'Progress jump should reveal panel, got '+pos);
  await page.locator('.tab[data-panel="weaknesses"]').click();
  assert(await page.locator('#weaknesses').isVisible());
  const weak=await page.locator('#weaknesses').evaluate(el=>Math.round(el.getBoundingClientRect().top));
  assert(weak>=0&&weak<190,'Tab click should scroll to actual content, got '+weak);
  await page.locator('[data-jump="mock"]').click();
  assert(await page.locator('#mockControls').isVisible());
  await page.locator('#startMock').click();
  assert(await page.locator('#studyHost').locator('.review-card,.exam-card').first().isVisible());
  const study=await page.locator('#studyHost').evaluate(el=>Math.round(el.getBoundingClientRect().top));
  assert(study>=0&&study<500,'Start mock should bring the question visibly into the viewport, got '+study);
  // Synthetic view-state checks only: no cloud sign-in, key storage or remote data changed.
  await page.evaluate(()=>{
   const quick=document.getElementById('cloudQuickAccess');
   quick.dataset.connected='true';
   const manage=document.getElementById('cloudManageToggle');
   manage.hidden=false;
  });
  const hidden=await page.locator('#cloudQuickDetails').evaluate(el=>getComputedStyle(el).display==='none');
  assert(hidden,'Connected key instructions should collapse');
  await page.locator('#cloudManageToggle').click();
  assert(await page.locator('#cloudQuickDetails').isVisible(),'Manage sync should reopen settings');
  await page.locator('#cloudManageToggle').click();
  assert(await page.locator('#cloudQuickDetails').evaluate(el=>getComputedStyle(el).display==='none'));
  await page.evaluate(()=>{document.getElementById('cloudQuickAccess').dataset.connected='false'});
  assert(await page.locator('#cloudQuickDetails').isVisible(),'Disconnected or setup state must expose key controls');
  const after=await page.evaluate(()=>({
   xp:profile.lifetimeXp,oldGood:progress.uiTestProgress?.good,
   width:document.documentElement.scrollWidth,
   viewWidth:innerWidth
  }));
  assert.equal(after.xp,94);
  assert.equal(after.oldGood,3);
  assert(after.width<=after.viewWidth+1,'No mobile horizontal page overflow');
  assert.deepEqual(errors.filter(e=>!/firebase|dynamically imported module|Failed to fetch|network/i.test(e)),[]);
  console.log('PASS v453 '+width+'px: quick navigation, in-view panels and questions, dark persistence, connected-only key collapse, saved progress, no overflow');
  await ctx.close();
 }
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
