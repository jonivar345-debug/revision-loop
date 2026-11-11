import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';
const root=process.cwd();
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
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
 for(const width of [390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:850},isMobile:width<500,hasTouch:width<500});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.request().url().startsWith(url)?r.continue():r.abort());
  await page.addInitScript(()=>{localStorage.setItem('rl_auth','1')});
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:90000});
  const evidence=await page.evaluate(()=>{
   const extra=cards.filter(c=>/^v439_phy_(?:rp[1-6]|data)_\d\d$/.test(c.id));
   const exam=examQuestions.filter(q=>/^v439_phy_exam_(?:rp[1-6]|data0[1-6])$/.test(q.id));
   return {flash:extra.length,exam:exam.length,wrongCards:extra.filter(c=>!mockEligibleCard(c)||c.subject!=='Physics').length,
     wrongExam:exam.filter(q=>!mockEligibleQuestion(q)||q.subject!=='Physics').length,
     flashUnique:new Set(extra.map(c=>c.id)).size,examUnique:new Set(exam.map(q=>q.id)).size};
  });
  assert.deepEqual(evidence,{flash:26,exam:12,wrongCards:0,wrongExam:0,flashUnique:26,examUnique:12});
  await page.locator('#mockSubject').selectOption('Physics');
  await page.locator('#mockMode').selectOption('flash');
  await page.locator('#mockCount').selectOption('10');
  await page.locator('#startMock').click();
  assert(await page.locator('#studyHost .review-card').count()===1,'Physics mock produces normal flashcard UI');
  await page.evaluate(()=>{
   activeSession={kind:'mock',items:[{type:'card',id:'v439_phy_rp5_02'}],index:0,title:'Physics mock QA'};
   renderAll();
  });
  assert.match(await page.locator('#studyHost .question').innerText(),/diameter/i);
  const checks=await page.evaluate(()=>{
   const card=cards.find(c=>c.id==='v439_phy_rp5_02');
   return {correct:evaluateCard(card,'6%').status,wrong:evaluateCard(card,'2%').status};
  });
  assert.equal(checks.correct,'correct');
  assert.notEqual(checks.wrong,'correct');
  await page.locator('#skipCard').click();
  // Applied AS Paper 2 questions must be fully available in ordinary Mock sessions.
  await page.evaluate(()=>{activeSession={kind:'mock',items:[{type:'exam',id:'v439_phy_exam_data04',groupId:'v439_phy_exam_data04'}],index:0,title:'Paper 2 data QA'};renderAll()});
  assert.match(await page.locator('#studyHost .question').innerText(),/stopping potential/i);
  assert.equal(await page.evaluate(()=>examQuestions.find(q=>q.id==='v439_phy_exam_data04').marks),6);
  await page.evaluate(()=>{activeSession={kind:'mock',items:[{type:'exam',id:'v439_phy_exam_rp6',groupId:'v439_phy_exam_rp6'}],index:0,title:'Physics mock QA'};renderAll()});
  assert.match(await page.locator('#studyHost .question').innerText(),/1\.45/);
  assert.equal(await page.evaluate(()=>examQuestions.find(q=>q.id==='v439_phy_exam_rp6').marks),6);
  assert.equal(await page.locator('#skipExam').count(),1,'Existing exam skip stays available');
  const errorsUnexpected=errors.filter(x=>!/firebase/i.test(x));
  assert.deepEqual(errorsUnexpected,[]);
  console.log('PASS v439 '+width+'px Physics Mock: 26 short cards, twelve 6-mark worked questions, marking, skip and responsive rendering.');
  await ctx.close();
 }
}finally{await browser.close();await new Promise(resolve=>server.close(resolve))}
