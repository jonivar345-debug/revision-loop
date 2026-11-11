/* Real browser check for the endless mock option, safe finish and local progress. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';

const root=process.cwd();
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json',
 '.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{
 try{
  const u=new URL(req.url||'/','http://127.0.0.1');
  const p=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':decodeURIComponent(u.pathname)));
  if(!p.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(await fs.readFile(p));
 }catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
try{
 for(const width of [360,1280]){
  const ctx=await browser.newContext({viewport:{width,height:850},isMobile:width<500,hasTouch:width<500});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith(url)?route.continue():route.abort());
  await page.addInitScript(()=>{
   localStorage.setItem('rl_auth','1');
   localStorage.setItem('revisionLoopProgress5',JSON.stringify({historic_item:{stage:3,good:2,last:1730000000000}}));
   localStorage.setItem('revisionLoopProfile11',JSON.stringify({
    economyVersion:2,lifetimeXp:56,points:32,reviews:5,
    shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},
    equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',
    daily:{},examResults:{previous:{last:{marks:2,max:3}}}
   }));
  });
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:90000});
  await page.locator('#mockSubject').selectOption('Physics');
  await page.locator('#mockMode').selectOption('flash');
  await page.locator('#mockCount').selectOption('unlimited');
  await page.locator('#startMock').click();
  assert(await page.locator('#sessionBanner').innerText().then(t=>t.includes('Unlimited')));
  assert(await page.locator('#endUnlimitedMock').isVisible());
  const first=await page.evaluate(()=>({n:activeSession.items.length,unique:new Set(activeSession.items.map(x=>x.id)).size,xp:profile.lifetimeXp}));
  assert.equal(first.n,15);
  assert.equal(first.unique,15);
  await page.evaluate(()=>{activeSession.index=activeSession.items.length-1;renderAll()});
  await page.locator('#skipCard').click();
  const more=await page.evaluate(()=>({index:activeSession.index,len:activeSession.items.length,done:activeSession.done,
    unique:new Set(activeSession.items.map(x=>x.id)).size,xp:profile.lifetimeXp}));
  assert.equal(more.index,15);
  assert(more.len>15&&!more.done);
  assert.equal(more.unique,more.len,'Do not repeat until pool is exhausted');
  assert.equal(more.xp,first.xp,'Skip awards no XP');
  await page.locator('#answerInput').fill('An answer I have not saved');
  page.once('dialog',async d=>{assert.match(d.message(),/unfinished answer/);await d.dismiss()});
  await page.locator('#endUnlimitedMock').click();
  assert.equal(await page.evaluate(()=>!!activeSession.done),false,'Dismiss leaves session active');
  page.once('dialog',async d=>{assert.match(d.message(),/already saved/);await d.accept()});
  await page.locator('#endUnlimitedMock').click();
  assert.equal(await page.locator('#studyHost h3').innerText(),'Session ended');
  const after=await page.evaluate(()=>({xp:profile.lifetimeXp,reviews:profile.reviews,
    history:progress.historic_item?.good,original:profile.examResults.previous?.last?.marks}));
  assert.equal(after.xp,56);assert.equal(after.reviews,5);
  assert.equal(after.history,2);assert.equal(after.original,2);
  await page.locator('#endSession').click();
  assert.equal(await page.evaluate(()=>activeSession),null);
  await page.locator('#mockCount').selectOption('10');
  await page.locator('#startMock').click();
  assert.equal(await page.evaluate(()=>activeSession.unlimited),undefined,'Fixed lengths stay finite');
  const unexpected=errors.filter(e=>!/firebase/i.test(e));
  assert.deepEqual(unexpected,[]);
  console.log('PASS v438 '+width+'px unlimited mock, refill, stop warning, progress preservation and finite length.');
  await ctx.close();
 }
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
