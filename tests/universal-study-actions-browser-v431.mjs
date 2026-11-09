/* Browser acceptance for shared Skip / I know this on every study renderer. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';
const root=process.cwd(),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp'};
const server=http.createServer(async(req,res)=>{
 try{
  const u=new URL(req.url||'/','http://127.0.0.1');
  const file=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':decodeURIComponent(u.pathname)));
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
  const context=await browser.newContext({viewport:{width,height:820},isMobile:width<500,hasTouch:width<500});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith(url)?route.continue():route.abort());
  await page.addInitScript(()=>{
   localStorage.setItem('rl_auth','1');
   if(!localStorage.getItem('revisionLoopProgress5'))localStorage.setItem('revisionLoopProgress5',JSON.stringify({historic_card:{stage:2,last:1730000000000,good:3}}));
   if(!localStorage.getItem('revisionLoopProfile11'))localStorage.setItem('revisionLoopProfile11',JSON.stringify({
     economyVersion:2,points:50,lifetimeXp:90,reviews:4,examResults:{historic_exam:{last:{marks:3,max:4}}},
     shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},
     equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',daily:{}
   }));
  });
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent.includes('flashcards'),null,{timeout:90000});
  await page.locator('.study-type-btn[data-study="flashcards"]').click();
  const ids=await page.evaluate(()=>{
   const ordinary=cards.filter(c=>c.subject==='Physics'&&c.active!==false&&c.paper2Training!==true);
   const list=[ordinary[0].id,ordinary[1].id];
   activeSession={kind:'flash',items:list.map(id=>({type:'card',id})),index:0,title:'v431 test flashcards'};
   renderAll();return list;
  });
  assert.equal(await page.locator('#skipCard').count(),1);
  assert.equal(await page.locator('#knowCard').count(),1);
  const before=await page.evaluate(()=>({
   xp:profile.lifetimeXp,points:profile.points,reviews:profile.reviews,
   progress:JSON.stringify(progress),errors:profile.errorLog.length
  }));
  await page.locator('#skipCard').click();
  const skipped=await page.evaluate(()=>({
   idx:activeSession.index,xp:profile.lifetimeXp,points:profile.points,
   reviews:profile.reviews,progress:JSON.stringify(progress),errors:profile.errorLog.length
  }));
  assert.equal(skipped.idx,1);
  assert.equal(skipped.xp,before.xp);assert.equal(skipped.points,before.points);
  assert.equal(skipped.reviews,before.reviews);assert.equal(skipped.progress,before.progress);
  assert.equal(skipped.errors,before.errors);
  assert.equal(await page.locator('#knowCard').count(),1);
  await page.locator('#knowCard').click();
  const known=await page.evaluate(id=>({
   done:activeSession.done,xp:profile.lifetimeXp,points:profile.points,
   review:progress[id],original:progress.historic_card,
   history:(progress[id]?.history||[]).at(-1)
  }),ids[1]);
  assert.equal(known.done,true);
  assert.equal(known.xp,before.xp);assert.equal(known.points,before.points);
  assert(known.review.stage>=0&&known.history.rating==='good');
  assert(known.history.answer.startsWith('[I know this · self-rated]'));
  assert.equal(known.original.good,3);
  // New guided Paper 2 MCQ cards also use the same shared flashcard buttons.
  await page.evaluate(()=>{
   activeSession={kind:'flash',items:[{type:'card',id:'as_p2_v430_m01'}],index:0,title:'Paper 2 MCQ'};
   renderAll();
  });
  assert.equal(await page.locator('#skipCard').count(),1);
  assert.equal(await page.locator('#knowCard').count(),1);
  await page.locator('#skipCard').click();
  assert.equal(await page.evaluate(()=>activeSession.done),true);
  assert.equal(await page.evaluate(()=>profile.lifetimeXp),before.xp);
  const examId=await page.evaluate(()=>examQuestions.find(q=>q.standalone!==false&&q.marks>=2&&Array.isArray(q.markPoints)&&q.markPoints.length>=2)?.id);
  assert(examId,'An exam question with reviewable points is needed');
  await page.evaluate(id=>{
   activeSession={kind:'exam',items:[{type:'exam',id},{type:'exam',id}],index:0,title:'v431 test exam'};
   renderAll();
  },examId);
  assert.equal(await page.locator('#skipExam').count(),1);
  assert.equal(await page.locator('#knowExam').count(),1);
  await page.locator('#knowExam').click();
  assert(await page.locator('#scoreEditor').isVisible(),'I know this must open manual self-marking');
  assert.equal(await page.locator('[data-mp]:checked').count(),0,'Self-assessment must start at zero');
  assert.equal(await page.evaluate(()=>profile.lifetimeXp),before.xp);
  await page.locator('#skipExam').click();
  assert.equal(await page.evaluate(()=>activeSession.index),1);
  assert.equal(await page.evaluate(id=>profile.examResults[id]?.attempts?.length||0,examId),0);
  await page.locator('#examAnswer').fill('Partially written answer');
  page.once('dialog',d=>d.dismiss());
  await page.locator('#skipExam').click();
  assert.equal(await page.evaluate(()=>activeSession.index),1,'Cancel should preserve the draft');
  assert.equal(await page.locator('#examAnswer').inputValue(),'Partially written answer');
  page.once('dialog',d=>d.accept());
  await page.locator('#skipExam').click();
  assert.equal(await page.evaluate(()=>activeSession.done),true);
  assert.equal(await page.evaluate(()=>profile.lifetimeXp),before.xp);
  assert.equal(await page.evaluate(id=>profile.examResults[id]?.attempts?.length||0,examId),0);
  // Skipped daily challenges never award a completion streak/bonus.
  await page.evaluate(id=>{
   const key='v431-test';
   profile.dailyChallenges[key]={items:[{type:'card',id}],index:0,done:false,skipped:0};
   activeSession={kind:'daily',key,items:[{type:'card',id}],index:0,title:'v431 daily'};
   renderAll();
  },ids[0]);
  const streak=await page.evaluate(()=>({streak:profile.challengeStreak,points:profile.points}));
  await page.locator('#skipCard').click();
  const result=await page.evaluate(()=>({day:profile.dailyChallenges['v431-test'],streak:profile.challengeStreak,points:profile.points}));
  assert.equal(result.day.done,true);assert.equal(result.day.skipped,1);
  assert.equal(result.streak,streak.streak);assert.equal(result.points,streak.points);
  // Once a correctly checked card earns XP, Skip must not leave it due for XP farming.
  await page.evaluate(()=>{
   activeSession={kind:'flash',items:[{type:'card',id:'as_p2_v430_m01'},{type:'card',id:'as_p2_v430_m02'}],index:0,title:'v431 scored-card guard'};
   renderAll();
  });
  await page.locator('[data-paper2-option="B"]').click();
  await page.locator('#checkCard').click();
  assert(await page.locator('#skipCard').isDisabled(),'Scored card must require a saved review rating');
  assert.equal(await page.evaluate(()=>activeSession.index),0);
  assert.equal(await page.evaluate(()=>profile.lifetimeXp),before.xp+1);
  await page.locator('#knowCard').click();
  assert.equal(await page.evaluate(()=>activeSession.index),1,'Known after a checked answer should record Good');
  assert.equal(await page.evaluate(()=>profile.lifetimeXp),before.xp+1,'Known must not award duplicate XP');
  const dims=await page.evaluate(()=>({w:document.documentElement.clientWidth,s:document.documentElement.scrollWidth}));
  assert(dims.s<=dims.w+3,'Study controls overflow '+width+'px viewport');
  assert.deepEqual(errors,[],'Browser errors: '+errors.join(' | '));
  console.log('PASS v431 '+width+'px: shared skip, self-rate, Paper2 MCQ, manual exam self-mark, draft warning, unearned XP, daily streak and saved progress.');
  await context.close();
 }
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
