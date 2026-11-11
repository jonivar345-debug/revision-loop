/* v440: real phone and desktop focus-mode integration against local app. */
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
  const url=new URL(req.url||'/','http://127.0.0.1');
  const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(await fs.readFile(file));
 }catch{res.writeHead(404);res.end('Missing')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
try{
 for(const width of [360,390,1280]){
  const context=await browser.newContext({viewport:{width,height:820},isMobile:width<500,hasTouch:width<500});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
  await page.addInitScript(()=>{
   localStorage.setItem('rl_auth','1');
   localStorage.setItem('revisionLoopProgress5',JSON.stringify({previous_review:{stage:2,good:3,last:1730000000000}}));
  });
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:90000});
  assert(!(await page.locator('#studyFocusToggle').isVisible()),'Focus button hidden until a study session exists');

  await page.locator('#mockSubject').selectOption('Physics');
  await page.locator('#mockMode').selectOption('flash');
  await page.locator('#startMock').click();
  await page.locator('#studyHost .review-card').waitFor();
  assert(await page.locator('#studyFocusToggle').isVisible(),'Focus toggle appears for a mock flashcard');
  const before=await page.evaluate(()=>({
   id:activeSession.items[activeSession.index].id,
   xp:profile.lifetimeXp,
   stored:localStorage.getItem('revisionLoopProgress5')
  }));
  await page.locator('#studyFocusToggle').click();
  let state=await page.evaluate(()=>({
   active:RevisionStudyFocus.isActive(),
   position:getComputedStyle(document.getElementById('study')).position,
   hidden:getComputedStyle(document.getElementById('mockControls')).display==='none',
   width:document.getElementById('study').getBoundingClientRect().width,
   scrollWidth:document.getElementById('study').scrollWidth,
   clientWidth:document.getElementById('study').clientWidth
  }));
  assert(state.active && state.position==='fixed' && state.hidden);
  assert(state.width>=width-2,'Study panel spans viewport');
  assert(state.scrollWidth<=state.clientWidth+2,'No horizontal overflow');
  await page.locator('#answerInput').fill('working draft to keep');
  await page.locator('#studyFocusToggle').click();
  assert.equal(await page.locator('#answerInput').inputValue(),'working draft to keep');
  assert.equal(await page.evaluate(()=>RevisionStudyFocus.isActive()),false);
  await page.locator('#studyFocusToggle').click();
  assert.equal(await page.locator('#answerInput').inputValue(),'working draft to keep');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>RevisionStudyFocus.isActive()),false,'Esc exits the overlay');
  const after=await page.evaluate(()=>({
    id:activeSession.items[activeSession.index].id,
    xp:profile.lifetimeXp,
    stored:localStorage.getItem('revisionLoopProgress5')
  }));
  assert.deepEqual(after,before,'Toggling focus must not change progress or question');

  // The same optional focus button must work on the full exam marking interface.
  await page.evaluate(()=>{
    const q=examQuestions.find(q=>q.subject==='Physics'&&q.level==='AS'&&q.mock===true);
    if(!q)throw new Error('No AS Physics exam question');
    activeSession={kind:'exam',items:[{type:'exam',id:q.id,groupId:q.groupId}],index:0,title:'Exam QA'};
    renderAll();
  });
  await page.locator('#studyHost .exam-card').waitFor();
  await page.locator('#studyFocusToggle').click();
  assert(await page.locator('#studyHost .exam-card').isVisible(),'Exam question visible in focus mode');
  await page.locator('#examAnswer').fill('An exam working draft that must survive.');
  await page.locator('#studyFocusToggle').click();
  assert.equal(await page.locator('#examAnswer').inputValue(),'An exam working draft that must survive.');

  // Completion has an exit route, and Finish returns to the normal study chooser.
  await page.evaluate(()=>{activeSession={...activeSession,done:true};renderAll()});
  assert(!(await page.locator('#studyFocusToggle').isVisible()),'No focus entry for finished sessions');
  await page.locator('#endSession').click();
  assert.equal(await page.evaluate(()=>RevisionStudyFocus.isActive()),false);
  assert.equal(await page.evaluate(()=>document.body.classList.contains('rl-study-focus')),false);
  assert.deepEqual(errors.filter(e=>!/firebase/i.test(e)),[]);
  console.log('PASS v440 '+width+'px: optional full-screen mock and exam, draft and XP unchanged, Esc and completion');
  await context.close();
 }
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
