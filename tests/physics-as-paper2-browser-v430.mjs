/* Actual 360/390px Chromium verification; no real Google accounts or saved data. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';
const root=process.cwd(),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css',
 '.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer(async(req,res)=>{
 try{
  const u=new URL(req.url||'/','http://127.0.0.1');
  const name=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':decodeURIComponent(u.pathname)));
  if(!name.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  const content=await fs.readFile(name);
  res.writeHead(200,{'Content-Type':mime[path.extname(name)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(content);
 }catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const host='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
const fixture={
 revisionLoopProgress5:JSON.stringify({prior_card:{stage:2,last:1730000000000,good:3}}),
 revisionLoopProfile11:JSON.stringify({economyVersion:2,points:220,lifetimeXp:740,reviews:18,
  shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},
  equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',
  examResults:{prior_exam:{last:{marks:4,max:5}}},daily:{}}),
 revisionLoopSettings11:JSON.stringify({dailyNew:18,recallMustKnowOnly:true,recallMustKnowFirst:true})
};
try{
 for(const width of [390,360]){
  const ctx=await browser.newContext({viewport:{width,height:800},isMobile:true,hasTouch:true});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith(host)?route.continue():route.abort());
  await page.addInitScript(obj=>{
   for(const [k,v] of Object.entries(obj))if(localStorage.getItem(k)===null)localStorage.setItem(k,v);
   localStorage.setItem('rl_auth','1');
  },fixture);
  await page.goto(host,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent.includes('flashcards'),null,{timeout:90000});
  await page.locator('.study-type-btn[data-study="flashcards"]').click();
  let test=await page.evaluate(()=>({
   extra:cards.filter(c=>c.paper2Training===true).length,
   leaked:cards.some(c=>c.paper2Training===true&&mockEligibleCard(c)),
   ordinary:selectedFlashCards().some(c=>c.paper2Training===true)
  }));
  assert.equal(test.extra,148,'All Paper 2 cards must load from four banks');
  assert(!test.leaked,'Coaching cards leaked into the mock exam!');
  assert(!test.ordinary,'Coaching cards leaked into ordinary revision!');
  for(const [section,count] of [['A',40],['B',32],['C',76],['all',148]]){
   await page.locator('[data-paper2-section="'+section+'"]').click();
   const chosen=await page.evaluate(()=>({
    sub:document.getElementById('flashSubject').value,
    size:selectedFlashCards().length,
    only:selectedFlashCards().every(c=>c.paper2Training===true),
    scope:flashScopeFilter
   }));
   assert.equal(chosen.sub,'Physics');
   assert.equal(chosen.size,count,section+' topic count');
   assert(chosen.only&&chosen.scope==='paper2');
   assert.equal(await page.locator('[data-paper2-section="'+section+'"]').getAttribute('aria-pressed'),'true');
   assert(await page.locator('.recall-priority-options').isHidden(),'Memorisation controls should hide during Paper 2 coaching');
   assert.equal(await page.locator('#startFlashcards').textContent(),'Start Paper 2 guided flashcards');
  }
  await page.locator('[data-paper2-section="C"]').click();
  await page.locator('#startFlashcards').click();
  const session=await page.evaluate(()=>({
   kind:activeSession?.kind,
   title:activeSession?.title,
   size:activeSession?.items.length,
   all:activeSession?.items.every(i=>{
    const c=cards.find(c=>c.id===i.id);
    return c?.paper2Training&&c.paper2Section==='C';
   })
  }));
  assert.equal(session.kind,'flash');
  assert(session.all&&session.size>0,'Paper2 C session must contain only MCQ-style coaching');
  const mcqId='as_p2_v430_m01';
  await page.evaluate(id=>renderCard(cards.find(c=>c.id===id)),mcqId);
  assert.equal(await page.locator('[data-paper2-option]').count(),4);
  assert(await page.locator('.paper2-hint').count()>0);
  assert.equal(await page.locator('.paper2-reason').count(),1);
  assert.equal(await page.locator('.paper2-reason').isVisible(),false,'Solution should initially be hidden');
  await page.locator('[data-paper2-option="A"]').click();
  assert.equal(await page.locator('#answerInput').inputValue(),'A');
  await page.locator('#checkCard').click();
  assert((await page.locator('#feedback').getAttribute('class')).includes('wrong'),'Wrong option must be rejected');
  await page.locator('[data-paper2-option="B"]').click();
  assert.equal(await page.locator('#answerInput').inputValue(),'B');
  await page.locator('#checkCard').click();
  assert((await page.locator('#feedback').getAttribute('class')).includes('correct'),'Correct option must be credited');
  assert(await page.locator('.paper2-reason').isVisible(),'Worked method shown after checking');
  await page.locator('[data-rating="good"]').click();
  const saved=await page.evaluate(()=>({
   progress:JSON.parse(localStorage.getItem('revisionLoopProgress5')),
   profile:JSON.parse(localStorage.getItem('revisionLoopProfile11'))
  }));
  assert.deepEqual(saved.progress.prior_card,{stage:2,last:1730000000000,good:3});
  assert(saved.progress[mcqId],'Paper2 question should save to ordinary spaced review');
  assert.equal(saved.profile.lifetimeXp,741,'One correct MCQ should award 1 XP');
  assert.equal(saved.profile.points,221);
  assert.equal(saved.profile.examResults.prior_exam.last.marks,4);
  const geometry=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
  assert(geometry.scroll<=geometry.width+3,'Paper 2 UI overflows '+width+'px phone');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent.includes('flashcards'),null,{timeout:90000});
  const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('revisionLoopProgress5')));
  assert(persisted[mcqId]&&persisted.prior_card.good===3,'Saved Paper 2 and prior progress should survive reload');
  assert.equal(errors.length,0,'Browser errors: '+errors.join(' | '));
  console.log('PASS v430 '+width+'px: all 148 cards, A/B/C filtering, strict four-choice marking, hint, method, preserved history, saved spaced review and no horizontal overflow.');
  await ctx.close();
 }
}finally{
 await browser.close();
 await new Promise(ok=>server.close(ok));
}
