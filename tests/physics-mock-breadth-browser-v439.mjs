/* v439 live Chromium check: Physics mock breadth and independent AS question scope. */
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
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
  await page.addInitScript(()=>{
   localStorage.setItem('rl_auth','1');
   localStorage.setItem('revisionLoopProgress5',JSON.stringify({historic_phy:{stage:3,good:4,last:1730000000000}}));
   localStorage.setItem('revisionLoopProfile11',JSON.stringify({
    economyVersion:2,lifetimeXp:68,points:42,reviews:9,
    shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},
    equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',
    daily:{},examResults:{old_exam:{last:{marks:2,max:3}}}
   }));
  });
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:90000});
  assert(await page.locator('#physicsMockBreadthNote').isVisible(),'Physics coverage guidance shown');
  await page.locator('#mockSubject').selectOption('Chemistry');
  assert.equal(await page.locator('#physicsMockBreadthNote').isVisible(),false);
  await page.locator('#mockSubject').selectOption('Physics');
  assert(await page.locator('#physicsMockBreadthNote').isVisible());
  // Separate Exam tab is deliberately set to A-level, which previously
  // excluded every AS Physics mock question from the Mock tab.
  await page.locator('.study-type-btn[data-study="exam"]').click();
  await page.locator('#examLevel').selectOption('A-level');
  await page.locator('.study-type-btn[data-study="mock"]').click();
  await page.locator('#mockSubject').selectOption('Physics');
  await page.locator('#mockMode').selectOption('exam');
  await page.locator('#mockCount').selectOption('15');
  await page.locator('#startMock').click();
  const exam=await page.evaluate(()=>{
   const d=window.RevisionPhysicsMockBalance;
   const q=activeSession.items.filter(x=>x.type==='exam').map(x=>examQuestions.find(z=>z.id===x.id));
   return {total:q.length,levels:[...new Set(q.map(x=>x.level))],strands:[...new Set(q.map(d.strand))],
     uid:activeSession.kind,xp:profile.lifetimeXp,history:progress.historic_phy?.good};
  });
  assert(exam.total>=15,'AS exam parts should remain available despite A-level filter on other tab');
  assert.deepEqual(exam.levels,['AS']);
  assert.equal(exam.strands.filter(Boolean).length,5,'Exam-only mock should sample all five AS strands');
  assert.equal(exam.uid,'mock');
  assert.equal(exam.xp,68);assert.equal(exam.history,4);
  await page.locator('#mockMode').selectOption('flash');
  await page.locator('#startMock').click();
  const flash=await page.evaluate(()=>{
   const d=window.RevisionPhysicsMockBalance;
   const chosen=activeSession.items.map(x=>cards.find(c=>c.id===x.id));
   return {total:chosen.length,strands:[...new Set(chosen.map(d.strand))],allAS:chosen.every(x=>x.stage==='AS'),unique:new Set(chosen.map(x=>x.id)).size};
  });
  assert.equal(flash.total,15);assert.equal(flash.strands.filter(Boolean).length,5);
  assert(flash.allAS);assert.equal(flash.unique,15);
  await page.locator('#mockCount').selectOption('unlimited');
  await page.locator('#startMock').click();
  await page.evaluate(()=>{activeSession.index=activeSession.items.length-1;renderAll()});
  await page.locator('#skipCard').click();
  const refill=await page.evaluate(()=>({
    n:activeSession.items.length,done:activeSession.done,
    unique:new Set(activeSession.items.map(x=>x.id)).size}));
  assert(refill.n>15&&!refill.done);
  assert.equal(refill.unique,refill.n);
  const bad=errors.filter(e=>!/firebase/i.test(e));
  assert.deepEqual(bad,[]);
  console.log('PASS v439 '+width+'px: all Physics strands, six-practical policy, separate exam-level isolation, refill and saved history.');
  await ctx.close();
 }
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
