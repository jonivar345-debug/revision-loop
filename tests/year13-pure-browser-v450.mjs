/* v450: real browser mock/flash/exam/Paper 2 isolation on phones and desktop. */
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
  const p=new URL(req.url||'/','http://127.0.0.1').pathname;
  const file=path.resolve(root,'.'+(p==='/'?'/index.html':decodeURIComponent(p)));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(await fs.readFile(file));
 }catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
const fixture={
 revisionLoopProgress5:JSON.stringify({historic_math:{stage:3,good:4,last:1730000000000}}),
 revisionLoopProfile11:JSON.stringify({
  economyVersion:2,lifetimeXp:140,points:71,reviews:11,
  shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},
  equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',
  daily:{},examResults:{oldExam:{last:{marks:3,max:5}}}
 }),
 revisionLoopSettings11:JSON.stringify({recallMustKnowFirst:true,recallMustKnowOnly:false})
};
try{
 for(const width of [360,390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:850},isMobile:width<500,hasTouch:width<500});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.route('**/*',route=>route.request().url().startsWith(url)?route.continue():route.abort());
  await page.addInitScript(values=>{
   for(const [key,value] of Object.entries(values))if(localStorage.getItem(key)===null)localStorage.setItem(key,value);
   localStorage.setItem('rl_auth','1');
  },fixture);
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:70000});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:100000});
  const bank=await page.evaluate(()=>({
   newCards:cards.filter(c=>/^y13_v450_card_\d{3}$/.test(c.id)).length,
   newQuestions:examQuestions.filter(q=>/^y13_v450_q_\d{3}$/.test(q.id)).length,
   mockCards:cards.filter(currentYear13PureMockCard).length,
   mockQuestions:examQuestions.filter(currentYear13PureMockQuestion).length,
   optionalCards:cards.filter(c=>c.year13Optional===true).length,
   optionalExam:examQuestions.filter(q=>q.year13Optional===true).length,
   physicsPaper2:paper2CoachCards('all').length,
   oldProgress:progress.historic_math?.good,oldExam:profile.examResults.oldExam?.last?.marks,
   xp:profile.lifetimeXp
  }));
  assert.deepEqual(bank,{newCards:123,newQuestions:62,mockCards:110,mockQuestions:56,
   optionalCards:13,optionalExam:6,physicsPaper2:227,oldProgress:4,oldExam:3,xp:140});
  assert.equal(await page.locator('#mockSubject option').count(),1);
  assert.equal(await page.locator('#mockSubject').inputValue(),'Maths');
  assert(await page.locator('#mathsMockScopeNote').isVisible());
  assert.equal(await page.locator('#physicsMockBreadthNote').isVisible(),false);
  const all=await page.evaluate(()=>buildMockSessionItems('Maths','mixed',30));
  assert(all.length>=10,'Mixed school mock must contain cards and worked questions');
  const audit=await page.evaluate(()=>buildMockSessionItems('Maths','mixed',30).map(item=>{
   const obj=item.type==='card'?cards.find(x=>x.id===item.id):examQuestions.find(x=>x.id===item.id);
   return {id:item.id,type:item.type,subject:obj.subject,flag:obj.year13PureMock,level:obj.stage||obj.level};
  }));
  assert(audit.every(x=>x.subject==='Maths'&&x.flag===true&&/^y13_v450_/.test(x.id)));
  assert(audit.some(x=>x.type==='card')&&audit.some(x=>x.type==='exam'));
  assert.equal((await page.evaluate(()=>buildMockSessionItems('Physics','mixed',10))).length,0);
  assert.equal((await page.evaluate(()=>buildMockSessionItems('Chemistry','mixed',10))).length,0);
  await page.locator('#mockMode').selectOption('flash');
  await page.locator('#mockCount').selectOption('unlimited');
  await page.locator('#startMock').click();
  const mock=await page.evaluate(()=>({kind:activeSession.kind,items:activeSession.items.length,
   unlimited:activeSession.unlimited,all:activeSession.items.every(x=>x.type==='card'&&x.id.startsWith('y13_v450_card_'))}));
  assert.equal(mock.kind,'mock');assert.equal(mock.items,15);assert(mock.unlimited&&mock.all);
  assert(await page.locator('#endUnlimitedMock').isVisible());
  await page.locator('#skipCard').click();
  assert.equal(await page.evaluate(()=>profile.lifetimeXp),140,'Skipping cannot award XP');
  await page.locator('.study-type-btn[data-study="flashcards"]').click();
  assert.equal(await page.locator('#flashSubject').inputValue(),'Maths');
  const flash=await page.evaluate(()=>({scope:flashScopeFilter,count:selectedFlashCards().length,
   selected:selectedFlashCards().every(c=>currentYear13PureMockCard(c))}));
  assert.deepEqual(flash,{scope:'mock',count:110,selected:true});
  await page.locator('[data-flash-preset="taught"]').click();
  assert((await page.evaluate(()=>selectedFlashCards().length))>=110);
  await page.locator('[data-flash-preset="mock"]').click();
  assert.equal((await page.evaluate(()=>selectedFlashCards().length)),110);
  await page.locator('.study-type-btn[data-study="exam"]').click();
  await page.locator('#examYear13Preset').click();
  const exam=await page.evaluate(()=>({
   sub:document.getElementById('examSubject').value,
   level:document.getElementById('examLevel').value,
   years:[...examYears],size:examGroups().length,
   safe:examGroups().every(g=>g.every(currentYear13PureMockQuestion))
  }));
  assert.deepEqual(exam,{sub:'Maths',level:'A-level',years:['Practice'],size:56,safe:true});
  await page.locator('#startExam').click();
  const examSession=await page.evaluate(()=>({
   kind:activeSession.kind,size:activeSession.items.length,
   safe:activeSession.items.every(it=>it.type==='exam'&&it.id.startsWith('y13_v450_q_'))
  }));
  assert.equal(examSession.kind,'exam');assert.equal(examSession.size,10);assert(examSession.safe);
  assert(await page.locator('#examAnswer').isVisible());
  const before=await page.evaluate(()=>({xp:profile.lifetimeXp,m:profile.examResults.oldExam?.last?.marks}));
  assert.deepEqual(before,{xp:140,m:3});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:100000});
  assert.equal(await page.evaluate(()=>progress.historic_math?.good),4);
  assert.equal(await page.evaluate(()=>profile.lifetimeXp),140);
  assert.equal(await page.evaluate(()=>profile.examResults.oldExam?.last?.marks),3);
  const geometry=await page.evaluate(()=>({
   screen:document.documentElement.clientWidth,
   scroll:document.documentElement.scrollWidth
  }));
  assert(geometry.scroll<=geometry.screen+3, 'Horizontal page overflow at '+width+'px');
  const severe=errors.filter(e=>!/firebase/i.test(e));
  assert.deepEqual(severe,[]);
  console.log('PASS v450 '+width+'px: 123 cards/62 worked problems, 110+56 mock-only, optional exclusions, Paper 2 intact, unlimited, skip, exam preset, cloud/Xp preservation');
  await ctx.close();
 }
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
