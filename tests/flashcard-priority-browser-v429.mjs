/* End-to-end Chromium smoke of must-memorise priority on real loaded bank.
   All external requests blocked. Fake browser-only progress; never a user account. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';
const cwd=process.cwd();
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json',
 '.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png',
 '.webp':'image/webp','.jpg':'image/jpeg'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url||'/','http://localhost');
  const filename=path.resolve(cwd,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
  if(!filename.startsWith(cwd+path.sep)){res.writeHead(403);res.end();return}
  const bytes=await fs.readFile(filename);
  res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream',
   'Cache-Control':'no-store'});res.end(bytes);
 }catch{res.writeHead(404);res.end('Missing file')}
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const url='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
const synthetic={
 revisionLoopProgress5:JSON.stringify({previous_card:{stage:2,last:1730000000000,good:3}}),
 revisionLoopProfile11:JSON.stringify({economyVersion:2,points:250,lifetimeXp:740,reviews:18,
  shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},
  equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',
  examResults:{prior_exam:{last:{marks:4,max:5}}},daily:{}}),
 revisionLoopSettings11:JSON.stringify({dailyNew:18,recallMustKnowFirst:false,recallMustKnowOnly:false})
};
try{
 for(const width of [390,360]){
  const ctx=await browser.newContext({viewport:{width,height:780},isMobile:true,hasTouch:true});
  const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith(url)?route.continue():route.abort());
  await page.addInitScript(data=>{
    for(const [k,v] of Object.entries(data))localStorage.setItem(k,v);
    localStorage.setItem('rl_auth','1');
  },synthetic);
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent.includes('flashcards'),null,{timeout:90000});
  await page.locator('.study-type-btn[data-study="flashcards"]').click();
  assert.equal(await page.locator('#flashMustKnowFirst').isChecked(),false,
   'Saved user preference must be respected.');
  await page.locator('#flashMustKnowFirst').check();
  assert.equal(await page.locator('#mockMustKnowFirst').isChecked(),true,
   'Mock and flash controls must share the same priority preference.');
  await page.locator('#flashSubject').selectOption('Chemistry');
  await page.locator('#flashMustKnowOnly').check();
  const count=await page.evaluate(()=>({
   eligible:selectedFlashCards().length,
   all:subjectCards('Chemistry').filter(c=>flashTopics.has(flashTopicLabel(c))&&flashEligible(c)).length,
   must:selectedFlashCards().filter(c=>window.RevisionFlashPriority.isMustKnow(c)).length
  }));
  assert(count.eligible>0,'Expected actual Chemistry essential cards');
  assert.equal(count.must,count.eligible,'Only mode included an ordinary card.');
  assert(count.eligible<=count.all,'Priority filter increased the pool.');
  await page.locator('#startFlashcards').click();
  const session=await page.evaluate(()=>{
   const items=activeSession?.items||[];
   return {type:activeSession?.kind,valid:items.every(i=>
     window.RevisionFlashPriority.isMustKnow(cards.find(c=>c.id===i.id))),items:items.length};
  });
  assert.equal(session.type,'flash');
  assert(session.valid&&session.items>0,'Live session contained untagged cards');
  assert(await page.locator('.recall-priority-pill').count()>0,'Must-know badge missing');

  // Exit without grading: neither old history nor XP should change.
  const saved=await page.evaluate(()=>({
   progress:JSON.parse(localStorage.getItem('revisionLoopProgress5')),
   profile:JSON.parse(localStorage.getItem('revisionLoopProfile11')),
   settings:JSON.parse(localStorage.getItem('revisionLoopSettings11'))
  }));
  assert.deepEqual(saved.progress.previous_card,{stage:2,last:1730000000000,good:3});
  assert.equal(saved.profile.lifetimeXp,740);
  assert.equal(saved.profile.points,250);
  assert.equal(saved.profile.examResults.prior_exam.last.marks,4);
  assert.equal(saved.settings.recallMustKnowFirst,true);
  assert.equal(saved.settings.recallMustKnowOnly,true);
  const geometry=await page.evaluate(()=>({
   width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth
  }));
  assert(geometry.scroll<=geometry.width+3,'Flashcards overflow mobile '+width+'px viewport');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent.includes('flashcards'),null,{timeout:90000});
  await page.locator('.study-type-btn[data-study="flashcards"]').click();
  assert.equal(await page.locator('#flashMustKnowOnly').isChecked(),true,'Only-mode setting did not survive reload');
  assert.equal(await page.locator('#flashMustKnowFirst').isChecked(),true,'Priority setting did not survive reload');
  const severe=errors.filter(x=>!x.includes('Firebase')&&!x.includes('firebase'));
  assert.equal(severe.length,0,'Browser JS errors: '+severe.join(' | '));
  console.log('PASS v429 live-loaded '+width+'px Chromium: essential-only cards '+session.items+
   ', priority preference, badge and original progress preserved.');
  await ctx.close();
 }
}finally{
 await browser.close();
 await new Promise(ok=>server.close(ok));
}
