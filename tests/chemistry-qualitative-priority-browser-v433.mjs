/* v433: browser QA of priority classification, non-destructive progress and mock scope. */
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
 for(const width of [360,390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:850},isMobile:width<500,hasTouch:width<500});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
  await page.addInitScript(()=>{
   localStorage.setItem('rl_auth','1');
   if(!localStorage.getItem('revisionLoopProgress5'))localStorage.setItem('revisionLoopProgress5',JSON.stringify({
     historic_chem:{stage:2,last:1730000000000,good:3}
   }));
   if(!localStorage.getItem('revisionLoopProfile11'))localStorage.setItem('revisionLoopProfile11',JSON.stringify({
     economyVersion:2,lifetimeXp:240,points:80,reviews:9,
     shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},
     equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',
     daily:{},examResults:{prior_exam:{last:{marks:3,max:4}}}
   }));
  });
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:90000});
  const initial=await page.evaluate(()=>{
   const a=cards.filter(c=>/^chem_test_v433_/.test(c.id));
   const chem=cards.filter(c=>c.subject==='Chemistry'&&c.active!==false);
   return {extra:a.length,as:a.filter(c=>c.stage==='AS').length,a2:a.filter(c=>c.stage==='A2').length,
    wrongScope:a.filter(c=>c.stage==='A2'&&mockEligibleCard(c)).length,
    other:new Set(a.map(c=>c.id)).size,
    promoted:chem.filter(c=>window.RevisionFlashPriority?.classify(c)?.kind==='chemical-test').length,
    priorityAll:a.every(c=>window.RevisionFlashPriority?.isMustKnow(c)),
    mockAS:a.filter(c=>c.stage==='AS').every(c=>mockEligibleCard(c)),
    p2:cards.filter(c=>c.paper2Section&&/^as_p2_v430_\d{3}$/.test(c.id)).length};
  });
  assert.equal(initial.extra,11);
  assert.equal(initial.as,6);assert.equal(initial.a2,5);
  assert.equal(initial.other,11);
  assert.equal(initial.wrongScope,0);assert(initial.mockAS);
  assert(initial.promoted>=105&&initial.priorityAll);
  assert.equal(initial.p2,132,'Existing AS Physics Paper 2 bank must be unchanged');

  await page.locator('.study-type-btn[data-study="flashcards"]').click();
  await page.locator('#flashSubject').selectOption('Chemistry');
  await page.locator('[data-flash-preset="all"]').click();
  if(!await page.locator('#flashMustKnowOnly').isChecked())await page.locator('#flashMustKnowOnly').check();
  const chosen=await page.evaluate(()=>{
   const selected=selectedFlashCards();
   return {count:selected.length,all:selected.every(c=>window.RevisionFlashPriority?.isMustKnow(c)),
    added:selected.filter(c=>/^chem_test_v433_/.test(c.id)).length};
  });
  assert(chosen.count>100&&chosen.all,'Only must-memorise must retain Chemistry tests');
  assert.equal(chosen.added,11,'All new Chemistry tests must be eligible in full revision');

  await page.evaluate(()=>{
   activeSession={kind:'flash',items:[{type:'card',id:'chem_test_v433_01'},{type:'card',id:'chem_test_v433_02'}],index:0,title:'v433 qualitative recall'};
   renderAll();
  });
  assert.equal(await page.locator('#skipCard').count(),1);
  assert.equal(await page.locator('#knowCard').count(),1);
  assert.equal(await page.locator('.recall-priority-pill').count(),1);
  await page.locator('#skipCard').click();
  assert.equal(await page.evaluate(()=>activeSession.index),1);
  assert.equal(await page.evaluate(()=>profile.lifetimeXp),240);
  await page.locator('#knowCard').click();
  const after=await page.evaluate(()=>({
   done:activeSession.done,xp:profile.lifetimeXp,points:profile.points,
   added:progress.chem_test_v433_02,skipped:progress.chem_test_v433_01,
   old:progress.historic_chem,originalExam:profile.examResults.prior_exam.last
  }));
  assert(after.done);assert.equal(after.xp,240);assert.equal(after.points,80);
  assert(after.added?.history?.at(-1)?.answer?.startsWith('[I know this · self-rated]'));
  assert.equal(after.skipped,undefined);
  assert.equal(after.old.good,3);
  assert.equal(after.originalExam.marks,3);

  await page.evaluate(()=>{
   activeSession={kind:'flash',items:[{type:'card',id:'chem_test_v433_01'}],index:0,title:'v433 answer verification'};
   renderAll();
  });
  await page.locator('#answerInput').fill('White Mg(OH)₂.');
  await page.locator('#checkCard').click();
  assert(await page.locator('#feedback').evaluate(e=>e.classList.contains('correct')),'Correct supplied answer should be accepted');
  assert(await page.locator('#skipCard').isDisabled(),'No repeated XP by skipping an awarded correct card');
  await page.locator('[data-rating="good"]').click();
  assert.equal(await page.evaluate(()=>profile.lifetimeXp),241);
  const dim=await page.evaluate(()=>({w:document.documentElement.clientWidth,s:document.documentElement.scrollWidth}));
  assert(dim.s<=dim.w+3,'No horizontal overflow '+width+'px');
  const bad=errors.filter(e=>!/firebase/i.test(e));
  assert.deepEqual(bad,[]);
  console.log('PASS v433 '+width+'px: 113+ Chemistry tests prioritised, eleven extra cards, no A2 mock leak, correct-mark/skip integrity, saved history and responsive UI.');
  await ctx.close();
 }
}finally{
 await browser.close();await new Promise(resolve=>server.close(resolve));
}
