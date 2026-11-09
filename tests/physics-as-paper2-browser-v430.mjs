'use strict';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';
const root=process.cwd(),types={'.html':'text/html','.js':'text/javascript','.json':'application/json',
 '.css':'text/css','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.webp':'image/webp',
 '.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer(async(req,res)=>{
 try{
  const u=new URL(req.url||'/','http://localhost');
  const name=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':decodeURIComponent(u.pathname)));
  if(!name.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  const bytes=await fs.readFile(name);
  res.writeHead(200,{'Content-Type':types[path.extname(name)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
const seed={
 revisionLoopProgress5:JSON.stringify({historic_card:{stage:2,last:1730000000000,good:3}}),
 revisionLoopProfile11:JSON.stringify({economyVersion:2,points:250,lifetimeXp:740,reviews:18,
  shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},
  equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',
  examResults:{prior_exam:{last:{marks:4,max:5}}},daily:{}}),
 revisionLoopSettings11:JSON.stringify({dailyNew:18,recallMustKnowFirst:true,recallMustKnowOnly:false})
};
try{
 for(const width of [360,390]){
  const context=await browser.newContext({viewport:{width,height:820},isMobile:true,hasTouch:true});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
  await page.addInitScript(data=>{
   for(const [k,v] of Object.entries(data))if(localStorage.getItem(k)===null)localStorage.setItem(k,v);
   localStorage.setItem('rl_auth','1');
  },seed);
  await page.goto(base,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:90000});
  await page.locator('.study-type-btn[data-study="flashcards"]').click();
  assert((await page.locator('#paper2Progress').textContent()).includes('107 original method cards'),
   'The complete source-backed Paper 2 bank should load.');
  // Paper 2 training runs even when the separate must-memorise-only mode is on.
  await page.locator('#flashMustKnowOnly').check();
  const sections=['A','B','C','all'],attempted=[];
  for(const section of sections){
   await page.locator('[data-paper2-section="'+section+'"]').click();
   const session=await page.evaluate(()=>({
    kind:activeSession?.kind,
    ids:(activeSession?.items||[]).map(x=>x.id),
    types:(activeSession?.items||[]).map(x=>cards.find(c=>c.id===x.id)?.paper2Section),
    subject:document.getElementById('flashSubject').value,
    first:cards.find(c=>c.id===activeSession?.items?.[0]?.id)?.id
   }));
   assert.equal(session.kind,'flash');
   assert.equal(session.ids.length,20,'Use selected 20-card session length');
   assert.equal(session.subject,'Physics','Always open correct subject');
   assert(session.ids.every(id=>/^as_paper2_v430_\d{3}$/.test(id)),'Ordinary cards leaked into Paper 2');
   if(section!=='all')assert(session.types.every(type=>type===section),'Wrong Paper 2 section');
   assert.equal(await page.locator('.paper2-hint').count(),1,'One optional hint on each card');
   assert.equal(await page.locator('.paper2-support').count(),1,'Support note must exist on each card');
   assert.equal(await page.locator('.paper2-support').isVisible(),false,'Full method must be hidden before reveal');
   await page.locator('.paper2-hint summary').click();
   assert.equal(await page.locator('.paper2-hint p').isVisible(),true,'Starting hint should open');
   await page.locator('#revealCard').click();
   assert.equal(await page.locator('.paper2-support').isVisible(),true,'Full method and pitfall should appear after reveal');
   assert((await page.locator('.paper2-support').innerText()).includes('Avoid this mistake'));
   await page.locator('[data-rating="good"]').click();
   const state=await page.evaluate(id=>({
    progress:JSON.parse(localStorage.getItem('revisionLoopProgress5'))[id],
    points:JSON.parse(localStorage.getItem('revisionLoopProfile11')).points,
    xp:JSON.parse(localStorage.getItem('revisionLoopProfile11')).lifetimeXp,
    historic:JSON.parse(localStorage.getItem('revisionLoopProgress5')).historic_card,
    history:JSON.parse(localStorage.getItem('revisionLoopProfile11')).examResults.prior_exam
   }),session.first);
   assert(state.progress?.stage>=0,'Paper 2 rating should save review');
   assert.equal(state.points,250,'Just revealing an answer does not award points');
   assert.equal(state.xp,740,'Just revealing an answer does not award XP');
   assert.equal(state.historic.good,3,'Old flashcard history must be unchanged');
   assert.equal(state.history.last.marks,4,'Saved exam results must be unchanged');
   attempted.push(session.first);
  }
  const measure=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,
   viewport:document.documentElement.clientWidth}));
  assert(measure.actual<=measure.viewport+3,'Paper 2 cards cause horizontal overflow at '+width+'px');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:90000});
  await page.locator('.study-type-btn[data-study="flashcards"]').click();
  const after=await page.evaluate(()=>({
   length:paper2Cards().length,
   progressText:document.getElementById('paper2Progress').textContent,
   only:document.getElementById('flashMustKnowOnly').checked,
   old:JSON.parse(localStorage.getItem('revisionLoopProgress5')).historic_card.good
  }));
  assert.equal(after.length,107);
  assert(after.progressText.includes('practised'),'Practice count survives reload');
  assert(after.only,'Other revision filters should remain saved');
  assert.equal(after.old,3);
  const severe=errors.filter(x=>!x.includes('Firebase')&&!x.includes('firebase'));
  assert.equal(severe.length,0,'Browser errors: '+severe.join(' | '));
  console.log('PASS v430 Chromium '+width+'px: 4 guided sessions, optional hints, hidden method, spaced reviews, full 107-card bank and previous saved progress.');
  await context.close();
 }
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
