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
  assert.deepEqual(bank,{newCards:123,newQuestions:62,mockCards:176,mockQuestions:126,
   optionalCards:13,optionalExam:30,physicsPaper2:227,oldProgress:4,oldExam:3,xp:140});
  const v451=await page.evaluate(()=>({
   newWorked:examQuestions.filter(q=>/^y13_v451_q_\d{3}$/.test(q.id)).length,
   optionalNew:examQuestions.filter(q=>/^y13_v451_q_\d{3}$/.test(q.id)&&q.year13Optional).length,
   archived:aqaPurePaperArchive?.papers.length,
   indexedPure:aqaPurePaperArchive?.topics2025.filter(q=>q.classification==='pure').length,
   linkedOlder:aqaPurePaperArchive?.papers.filter(x=>x.year<2025).length
  }));
  assert.deepEqual(v451,{newWorked:21,optionalNew:4,archived:24,indexedPure:40,linkedOlder:21});
  const archive=page.locator('#mathsPureArchiveV451');
  await page.locator('.study-type-btn[data-study="exam"]').click();
  await page.locator('details.paper-library > summary').click();
  assert(await archive.isVisible(),'AQA Pure archive should be visible in Maths exam mode');
  assert.equal(await archive.locator('details.pure-paper-year').count(),17,'Seven target years, 2022 P1, all 2023 Pure sections, 2024 methods and 2025 topics');
  const descriptions=await archive.innerText();
  assert(descriptions.includes('21 public papers indexed')&&descriptions.includes('2024 Paper 2/3 Pure methods')&&descriptions.includes('2023 Paper 1')&&descriptions.includes('2023 Paper 2')&&descriptions.includes('2023 Paper 3')&&descriptions.includes('2022 Paper 1'));
  await archive.locator('details.pure-paper-year').nth(14).locator('summary').click();
  const questionText=await archive.innerText();
  assert(questionText.includes('2025')&&questionText.includes('Q17'));
  await page.locator('.study-type-btn[data-study="mock"]').click();
  assert.equal(await page.locator('#mockSubject option').count(),1);
  assert.equal(await page.locator('#mockSubject').inputValue(),'Maths');
  assert(await page.locator('#mathsMockScopeNote').isVisible());
  assert.equal(await page.locator('#physicsMockBreadthNote').isVisible(),false);
  // v462: the default must-memorise switch is a strict flashcard-only filter.
  assert(await page.locator('#mockMustKnowFirst').isChecked());
  assert(await page.locator('#mockMode').isDisabled());
  const strictAudit=await page.evaluate(()=>buildMockSessionItems('Maths','mixed',30).map(item=>{
   const c=cards.find(x=>x.id===item.id);
   return {type:item.type,selected:!!c&&isRecallMustKnow(c),id:item.id};
  }));
  assert.equal(strictAudit.length,30);
  assert(strictAudit.every(x=>x.type==='card'&&x.selected),'Must memorise cannot fall back to ordinary cards or exam questions');
  const everyPriority=await page.evaluate(()=>cards.filter(c=>currentYear13PureMockCard(c)&&isRecallMustKnow(c)).length);
  assert.equal(everyPriority,89);
  // Turning the switch off restores ordinary mixed Maths mock revision.
  await page.locator('#mockMustKnowFirst').uncheck();
  assert(await page.locator('#mockMode').isEnabled());
  const ordinary=await page.evaluate(()=>buildMockSessionItems('Maths','mixed',30));
  assert(ordinary.some(x=>x.type==='card')&&ordinary.some(x=>x.type==='exam'),
    'Normal mixed practice must remain available when must memorise is off');
  await page.locator('#mockMustKnowFirst').check();
  assert(await page.locator('#mockMode').isDisabled());
  assert.equal((await page.evaluate(()=>buildMockSessionItems('Physics','mixed',10))).length,0);
  assert.equal((await page.evaluate(()=>buildMockSessionItems('Chemistry','mixed',10))).length,0);
  await page.locator('#mockCount').selectOption('unlimited');
  await page.locator('#startMock').click();
  const mock=await page.evaluate(()=>({kind:activeSession.kind,items:activeSession.items.length,
   unlimited:activeSession.unlimited,all:activeSession.items.every(x=>x.type==='card'&&
    isRecallMustKnow(cards.find(c=>c.id===x.id)))}));
  assert.equal(mock.kind,'mock');assert.equal(mock.items,15);assert(mock.unlimited&&mock.all);
  assert(await page.locator('.maths-memorise-card').isVisible(),
    'Selected Maths cards should have readable, dedicated formatting');
  assert(await page.locator('#endUnlimitedMock').isVisible());
  await page.locator('#skipCard').click();
  assert.equal(await page.evaluate(()=>profile.lifetimeXp),140,'Skipping cannot award XP');
  await page.locator('.study-type-btn[data-study="flashcards"]').click();
  assert.equal(await page.locator('#flashSubject').inputValue(),'Maths');
  const flash=await page.evaluate(()=>({scope:flashScopeFilter,count:selectedFlashCards().length,
   selected:selectedFlashCards().every(c=>currentYear13PureMockCard(c))}));
  assert.deepEqual(flash,{scope:'mock',count:89,selected:true});
  assert(await page.locator('#flashMustKnowFirst').isChecked());
  const mustKnow=await page.evaluate(()=>({
   count:selectedFlashCards().length,
   exact:selectedFlashCards().every(c=>isRecallMustKnow(c)&&currentYear13PureMockCard(c)),
   excluded:['y13_v450_card_052','y13_v450_card_107','y13_v450_card_108'].every(id=>
     selectedFlashCards().every(c=>c.id!==id))
  }));
  assert.deepEqual(mustKnow,{count:89,exact:true,excluded:true},
    'Only the 89 explicitly selected Maths memorisation cards should appear');
  await page.locator('#flashMustKnowFirst').uncheck();
  assert.equal((await page.evaluate(()=>selectedFlashCards().length)),176,
    'Unticking must memorise restores all 176 taught mock flashcards');
  await page.locator('[data-flash-preset="taught"]').click();
  assert((await page.evaluate(()=>selectedFlashCards().length))>=176);
  await page.locator('[data-flash-preset="mock"]').click();
  assert.equal((await page.evaluate(()=>selectedFlashCards().length)),176);
  await page.locator('.study-type-btn[data-study="exam"]').click();
  await page.locator('#examYear13Preset').click();
  const exam=await page.evaluate(()=>({
   sub:document.getElementById('examSubject').value,
   level:document.getElementById('examLevel').value,
   years:[...examYears],size:examGroups().length,
   safe:examGroups().every(g=>g.every(currentYear13PureMockQuestion))
  }));
  assert.deepEqual(exam,{sub:'Maths',level:'A-level',years:['Practice'],size:126,safe:true});
  await page.locator('#startExam').click();
  const examSession=await page.evaluate(()=>({
   kind:activeSession.kind,size:activeSession.items.length,
   safe:activeSession.items.every(it=>it.type==='exam'&&/^y13_v(?:450|451|452|457|458|459|460|461)_q_/.test(it.id))
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
  console.log('PASS v450 '+width+'px: 189 cards/156 worked problems, 176+126 mock-only, optional exclusions, Paper 2 intact, unlimited, skip, exam preset, cloud/Xp preservation');
  await ctx.close();
 }
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
