import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {chromium} from 'playwright';
// Real page, real card data, synthetic browser-only progress; external Firebase blocked.
const cwd=process.cwd();
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json',
 '.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
const server=http.createServer(async(req,res)=>{
 try{
  const p=new URL(req.url||'/','http://localhost').pathname;
  const file=path.resolve(cwd,'.'+(p==='/'?'/index.html':decodeURIComponent(p)));
  if(!file.startsWith(cwd+path.sep)){res.writeHead(403);res.end();return}
  const bytes=await fs.readFile(file);
  res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found')}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
const fixture={
 revisionLoopProgress5:JSON.stringify({original_card:{stage:2,last:1730000000000,good:3}}),
 revisionLoopProfile11:JSON.stringify({economyVersion:2,lifetimeXp:740,points:250,reviews:18,
  shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},
  equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',
  examResults:{historic:{last:{marks:4,max:5}}},daily:{}}),
 revisionLoopSettings11:JSON.stringify({dailyNew:18,recallMustKnowFirst:true,recallMustKnowOnly:true})
};
try{
 for(const width of [360,390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:850},isMobile:width<500,hasTouch:width<500});
  const page=await ctx.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/*',route=>route.request().url().startsWith(url)?route.continue():route.abort());
  await page.addInitScript(values=>{
   for(const [key,value] of Object.entries(values))if(localStorage.getItem(key)===null)localStorage.setItem(key,value);
   localStorage.setItem('rl_auth','1');
  },fixture);
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:65000});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:90000});
  await page.locator('.study-type-btn[data-study="flashcards"]').click();
  let bank=await page.evaluate(()=>({
   count:paper2CoachCards('all').length,a:paper2CoachCards('A').length,
   b:paper2CoachCards('B').length,c:paper2CoachCards('C').length
  }));
  assert.deepEqual(bank,{count:227,a:71,b:44,c:112},'Paper 2 trainer must retain 198 original cards and load twenty v448 MCQs.');
  const supplemental=await page.evaluate(()=>{
   const list=cards.filter(c=>/^as_p2_v443_\d{3}$/.test(c.id));
   return list.map(c=>({id:c.id,ref:c.specRef,section:c.paper2Section,
     model:evaluateCard(c,c.back).status,
     wrongChoice:c.paper2Section==='C'?evaluateCard(c,c.paper2Choices[1]).status:null}));
  });
  assert.equal(supplemental.length,8,'All eight new AS Paper 2 cards must load');
  for(const check of supplemental){
   assert.equal(check.model,'correct','New card model answer rejected: '+check.id);
   if(check.section==='C')assert.equal(check.wrongChoice,'wrong','New MCQ distractor falsely accepted: '+check.id);
  }
  const historical=await page.evaluate(()=>{
   const list=cards.filter(c=>/^as_p2_v444_\d{3}$/.test(c.id));
   return list.map(c=>({id:c.id,year:c.sourceStyle?.year,section:c.paper2Section,
      model:evaluateCard(c,c.back).status,
      wrongChoice:c.paper2Section==='C'?evaluateCard(c,c.paper2Choices[1]).status:null}));
  });
  assert.equal(historical.length,10,'All ten paper-style cards must load');
  for(const check of historical){
   assert([2022,2023].includes(check.year));
   assert.equal(check.model,'correct','Paper-style model answer rejected: '+check.id);
   if(check.section==='C')assert.equal(check.wrongChoice,'wrong','Paper-style distractor falsely accepted: '+check.id);
  }
  const earlier=await page.evaluate(()=>{
   const list=cards.filter(c=>/^as_p2_v445_\d{3}$/.test(c.id));
   return list.map(c=>({id:c.id,year:c.sourceStyle?.year,section:c.paper2Section,
    model:evaluateCard(c,c.back).status,
    alternate:c.paper2Section!=='C'?evaluateCard(c,c.accept[0]).status:null,
    wrongChoice:c.paper2Section==='C'?evaluateCard(c,c.paper2Choices[1]).status:null}));
  });
  assert.equal(earlier.length,20,'All twenty source-mapped early Paper 2 cards must load');
  for(const check of earlier){
   assert([2018,2019,2020,2021].includes(check.year),'Unexpected historical source year: '+check.id);
   assert.equal(check.model,'correct','New model answer rejected by real marker: '+check.id);
   if(check.section==='C')assert.equal(check.wrongChoice,'wrong','New MCQ distractor falsely credited: '+check.id);
   else assert.equal(check.alternate,'correct','Valid alternative rejected by real marker: '+check.id);
  }
  const recent=await page.evaluate(()=>{
    const list=cards.filter(c=>/^as_p2_v446_\d{3}$/.test(c.id));
    return list.map(c=>({id:c.id,year:c.sourceStyle?.year,section:c.paper2Section,
      source:c.sourceStyle?.verification,model:evaluateCard(c,c.back).status,
      alternate:c.paper2Section==='C'?null:evaluateCard(c,c.accept[0]).status,
      wrongChoice:c.paper2Section==='C'?evaluateCard(c,c.paper2Choices[1]).status:null}));
  });
  assert.equal(recent.length,20,'All 20 new 2024/2025 guided-card examples must load');
  for(const check of recent){
    assert([2024,2025].includes(check.year));
    assert.equal(check.model,'correct','New model answer rejected by real marker: '+check.id);
    if(check.section==='C')assert.equal(check.wrongChoice,'wrong','New MCQ distractor falsely credited: '+check.id);
    else assert.equal(check.alternate,'correct','Allowed equivalent rejected: '+check.id);
    if(check.year===2025)assert(check.source.includes('mark_scheme_unverified'),'2025 must not claim mark-scheme sign-off');
  }
  const visualAudit=await page.evaluate(()=>{
   const list=cards.filter(c=>/^as_p2_v447_\d{3}$/.test(c.id));
   return list.map(c=>({id:c.id,section:c.paper2Section,visual:c.visual,
     svg:window.RevisionPaper2Visuals?.render(c.visual)||'',
     model:evaluateCard(c,c.back).status,
     wrong:evaluateCard(c,c.paper2Choices[1]).status}));
  });
  assert.equal(visualAudit.length,8,'All eight visual MCQs must load with stable new IDs');
  for(const check of visualAudit){
   assert.equal(check.section,'C');
   assert(check.svg.includes('role="img"')&&check.svg.includes('<title>'),'Visual asset missing or inaccessible: '+check.id);
   assert.equal(check.model,'correct','Visual model answer rejected: '+check.id);
   assert.equal(check.wrong,'wrong','Visual MCQ distractor wrongly awarded: '+check.id);
   await page.evaluate(id=>{
    activeSession={kind:'flash',items:[{type:'card',id}],index:0,title:'AS Physics visual Paper 2 QA'};
    currentCardId=null;
    renderAll();
   },check.id);
   assert.equal(await page.locator('.diagram svg[role="img"]').count(),1,check.id+' diagram not mounted');
   assert(await page.locator('.paper2-diagram-caption').isVisible(),check.id+' visual description missing');
   assert.equal(await page.locator('.paper2-mcq-option').count(),4,check.id+' four-choice MCQ missing');
   const view=await page.locator('.diagram svg').evaluate(node=>({
    aria:node.getAttribute('aria-label'),
    bounds:node.getBoundingClientRect().width,
    viewport:document.documentElement.clientWidth,
    html:node.outerHTML
   }));
   assert(view.aria?.length>=20,'Description absent from visual '+check.id);
   assert(view.bounds<=view.viewport+1,'Diagram causes horizontal overflow '+check.id);
   assert(!view.html.includes('aria-hidden="true"'),'Accessible visual must not be hidden '+check.id);
  }
  const indexed2025=await page.evaluate(()=>{
    const items=cards.filter(c=>/^as_p2_v448_\d{3}$/.test(c.id));
    return items.map(c=>({id:c.id,provenance:c.sourceStyle?.verification,
      model:evaluateCard(c,c.back).status,
      wrong:c.paper2Choices.slice(1).map(choice=>evaluateCard(c,choice).status)}));
  });
  assert.equal(indexed2025.length,20,'All 20 original 2025-style items load');
  for(const result of indexed2025){
    assert(result.provenance.includes('official_mark_scheme_unreviewed'),'Do not claim unchecked 2025 scheme equivalence');
    assert.equal(result.model,'correct','Model solution rejected: '+result.id);
    assert(result.wrong.every(status=>status==='wrong'),'Incorrect MCQ option incorrectly credited: '+result.id);
  }
  await page.locator('#paper2Section').selectOption('C');
  assert.match(await page.locator('#paper2CoachSummary').textContent(),/103 guided cards/);
  await page.locator('#paper2SessionCount').selectOption('10');
  await page.locator('#startPaper2Coach').click();
  let session=await page.evaluate(()=>({
   kind:activeSession?.kind,length:activeSession?.items?.length,
   sections:activeSession?.items?.map(it=>cards.find(c=>c.id===it.id)?.paper2Section),
   id:activeSession?.items?.[0]?.id
  }));
  assert.equal(session.kind,'flash');assert.equal(session.length,10);
  assert(session.sections.every(x=>x==='C'));
  assert.equal(await page.locator('.paper2-mcq-option').count(),4,'Actual A-D choices must appear');
  assert.equal(await page.locator('textarea#answerInput').count(),0,'MCQ should not masquerade as a typing card');
  assert.equal(await page.locator('.paper2-card-badge').count(),1);
  await page.locator('#paper2HintBtn').click();
  assert.equal(await page.locator('#paper2HintText').isVisible(),true);
  const choice=await page.evaluate(()=>{
   const card=cards.find(c=>c.id===activeSession.items[activeSession.index].id);
   const displayed=[...document.querySelectorAll('[data-paper2-choice]')];
   const correct=displayed.findIndex(b=>b.textContent?.trim().slice(1).trim()===card.back);
   return {correct,answer:card.back};
  });
  assert(choice.correct>=0,'Correct answer missing from A-D options');
  await page.locator('[data-paper2-choice="'+((choice.correct+1)%4)+'"]').click();
  await page.locator('#checkCard').click();
  assert(await page.locator('#feedback').evaluate(x=>x.classList.contains('wrong')),'Incorrect MCQ distractor must not earn full marks');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('revisionLoopProfile11')).lifetimeXp),740);
  assert(await page.locator('.paper2-card-explain').isVisible(),'Trap text must show after checking');
  await page.locator('[data-rating="again"]').click();
  assert.equal(await page.locator('.paper2-mcq-option').count(),4);
  const second=await page.evaluate(()=>{
   const c=cards.find(c=>c.id===activeSession.items[activeSession.index].id);
   return [...document.querySelectorAll('[data-paper2-choice]')].findIndex(b=>b.textContent?.trim().slice(1).trim()===c.back);
  });
  assert(second>=0,'Second correct option absent');
  await page.locator('[data-paper2-choice="'+second+'"]').click();
  await page.locator('#checkCard').click();
  assert(await page.locator('#feedback').evaluate(x=>x.classList.contains('correct')),'Correct selected option should earn correct mark');
  await page.locator('[data-rating="good"]').click();
  const saved=await page.evaluate(()=>({
   progress:JSON.parse(localStorage.getItem('revisionLoopProgress5')),
   profile:JSON.parse(localStorage.getItem('revisionLoopProfile11')),
   settings:JSON.parse(localStorage.getItem('revisionLoopSettings11'))
  }));
  assert.deepEqual(saved.progress.original_card,{stage:2,last:1730000000000,good:3});
  assert.equal(saved.profile.lifetimeXp,741);
  assert.equal(saved.profile.examResults.historic.last.marks,4);
  assert.equal(saved.settings.recallMustKnowOnly,true,'Paper 2 separate session must not change must-know preference');

  await page.locator('.study-type-btn[data-study="flashcards"]').click();
  await page.locator('#paper2Section').selectOption('A');
  await page.locator('#startPaper2Coach').click();
  const a=await page.evaluate(()=>activeSession.items.every(it=>cards.find(c=>c.id===it.id)?.paper2Section==='A'));
  assert(a,'Section A must contain only practical/data skills cards');
  assert.equal(await page.locator('textarea#answerInput').count(),1);
  assert.equal(await page.locator('.paper2-mcq-option').count(),0);
  await page.locator('.study-type-btn[data-study="flashcards"]').click();
  await page.locator('#paper2Section').selectOption('B');
  await page.locator('#startPaper2Coach').click();
  const b=await page.evaluate(()=>activeSession.items.every(it=>cards.find(c=>c.id===it.id)?.paper2Section==='B'));
  assert(b,'Section B must contain only linked-application cards');

  const geometry=await page.evaluate(()=>({width:document.documentElement.clientWidth,
   scroll:document.documentElement.scrollWidth}));
  assert(geometry.scroll<=geometry.width+3,width+'px horizontal page overflow');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:90000});
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('revisionLoopProfile11')).lifetimeXp),741);
  const severe=errors.filter(e=>!/firebase/i.test(e));
  assert.equal(severe.length,0,'Browser errors: '+severe.join(' / '));
  console.log('PASS v430 '+width+'px live Chromium: A/B/C coaching, real four-option marking, hint, progress, XP, no overflow');
  await ctx.close();
 }
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
