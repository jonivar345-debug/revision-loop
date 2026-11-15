/* v456: real phone/desktop flow through Shop, search, unlock, outfit picker and lazy globe. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {chromium} from 'playwright';

const root=process.cwd();
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp'};
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
const browser=await chromium.launch({headless:true});
const url='http://127.0.0.1:'+server.address().port+'/';
try{
 for(const width of [360,390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:860},isMobile:width<500,hasTouch:width<500,reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',route=>route.request().url().startsWith(url)?route.continue():route.abort());
  await page.addInitScript(()=>{
   localStorage.setItem('rl_auth','1');
   if(!localStorage.getItem('revisionLoopProgress5'))localStorage.setItem('revisionLoopProgress5',JSON.stringify({fixtureV456:{stage:3,good:8}}));
   if(!localStorage.getItem('revisionLoopProfile11'))localStorage.setItem('revisionLoopProfile11',JSON.stringify({
    economyVersion:2,lifetimeXp:210,points:85,reviews:20,
    shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},
    equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',
    daily:{},examResults:{}
   }));
  });
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:120000});
  await page.locator('.tab[data-panel="shop"]').click();
  await page.locator('#characterShop [data-character="cc"]').waitFor({state:'attached'});
  assert.equal(await page.locator('.tab').count(),4);
  assert.equal(await page.locator('.shop-category').count(),3);
  assert.equal(await page.locator('#globe').getAttribute('width'),'700','Hidden globe should not do expensive canvas reallocation');
  await page.locator('#shopCharacterSearch').fill('C.C.');
  assert.equal(await page.locator('#characterShop [data-character]').count(),1,'Search should filter to C.C.');
  assert.equal(await page.locator('#characterShop [data-character]').first().getAttribute('data-character'),'cc');
  await page.locator('#shopCharacterSearch').fill('wordthatdoesnotexist');
  assert(await page.locator('#shopCharacterEmpty').isVisible(),'No results must show helpful message');
  assert.equal(await page.locator('#characterShop [data-character]').count(),0);
  await page.locator('#shopCharacterSearch').fill('C.C.');
  const priceText=await page.locator('#characterShop [data-character="cc"]').textContent();
  const cost=Number(priceText.match(/Unlock · (\d+) points/)?.[1]);
  assert(Number.isFinite(cost)&&cost>0&&cost<=85,'Character must have a valid affordable price: '+priceText);
  const expectedPoints=85-cost;
  await page.locator('#characterShop [data-character="cc"]').click();
  assert(await page.locator('#shopOutfitsSection').isVisible(),'Selecting a character must open outfits');
  assert.equal(await page.locator('#outfitCharacterSelect').inputValue(),'cc');
  assert(await page.locator('#outfitShop .outfit-card').count()>0);
  assert.equal(await page.locator('#shopPoints').textContent(),String(expectedPoints),'Correct point deduction only once');
  assert.equal(await page.evaluate(()=>profile.shopOwned.characters.includes('cc')),true,'New character unlocked');
  assert.equal(await page.evaluate(()=>profile.shopOwned.outfits.includes('cc-default')),true,'Default outfit unlocked');
  await page.locator('#outfitCharacterSelect').selectOption('lelouch');
  assert.equal(await page.locator('#outfitCharacterSelect').inputValue(),'lelouch');
  assert.equal(await page.locator('#equippedName').textContent(),'Lelouch');
  assert.equal(await page.locator('#shopPoints').textContent(),String(expectedPoints),'Switching between owned characters must not charge again');
  await page.locator('[data-shop-view="characters"]').click();
  await page.locator('#shopCharacterSearch').fill('C.C.');
  assert.equal(await page.locator('#characterShop [data-character="cc"]').textContent(),'Select & view outfits');
  await page.locator('#characterShop [data-character="cc"]').click();
  assert(await page.locator('#shopOutfitsSection').isVisible());
  assert.equal(await page.locator('#shopPoints').textContent(),String(expectedPoints));
  await page.locator('[data-shop-view="places"]').click();
  assert(await page.locator('#shopLocationsSection').isVisible());
  await page.waitForFunction(()=>document.getElementById('globe').width===1400,null,{timeout:15000});
  assert(await page.locator('#globe').isVisible());
  await page.locator('[data-shop-view="characters"]').click();
  assert(await page.locator('#shopCharactersSection').isVisible());
  assert.equal(await page.locator('#globe').getAttribute('width'),'1400');
  const before=await page.evaluate(()=>({
   points:profile.points,xp:profile.lifetimeXp,good:progress.fixtureV456?.good,
   owned:profile.shopOwned.characters.slice()
  }));
  assert.equal(before.points,expectedPoints);
  assert.equal(before.xp,210);
  assert.equal(before.good,8);
  assert(before.owned.includes('cc'));
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'No sideways overflow');
  assert.deepEqual(errors.filter(e=>!/firebase|network|Failed to fetch|dynamically imported module/i.test(e)),[]);
  console.log('PASS v456 '+width+'px: character search, zero-result state, unlock to outfits, owned character switching, single charge, lazy globe and saved XP');
  await ctx.close();
 }
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
