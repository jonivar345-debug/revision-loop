/* v455: Shop/collection browser regression at mobile and desktop widths. */
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
const url='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
try{
 for(const width of [360,390,1280]){
  const ctx=await browser.newContext({viewport:{width,height:860},isMobile:width<500,hasTouch:width<500,reducedMotion:'reduce'});
  const page=await ctx.newPage(),errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  await page.route('**/*',route=>route.request().url().startsWith(url)?route.continue():route.abort());
  await page.addInitScript(()=>{
   localStorage.setItem('rl_auth','1');
   localStorage.setItem('revisionLoopProgress5',JSON.stringify({shopFixture:{stage:3,good:7}}));
   localStorage.setItem('revisionLoopProfile11',JSON.stringify({
     economyVersion:2,lifetimeXp:144,points:85,reviews:12,
     shopOwned:{characters:['lelouch'],outfits:['lelouch-default'],locations:['london']},
     equippedCharacter:'lelouch',equippedOutfit:'lelouch-default',equippedLocation:'london',
     daily:{},examResults:{}
   }));
  });
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:120000});
  assert.equal(await page.locator('.tab').count(),4);
  assert.equal(await page.locator('.quick-nav').count(),0);
  await page.locator('.tab[data-panel="shop"]').click();
  await page.locator('#characterShop .shop-item').first().waitFor({state:'attached',timeout:60000});
  assert(await page.locator('#shop').isVisible());
  assert.equal(await page.locator('#shopTitle').textContent(),'Shop & collection');
  assert.equal(await page.locator('.shop-category').count(),3);
  assert(await page.locator('#shopCharactersSection').isVisible());
  assert(!(await page.locator('#shopOutfitsSection').isVisible()));
  assert(!(await page.locator('#shopLocationsSection').isVisible()));
  assert.equal(await page.locator('#shopPoints').textContent(),'85');
  assert(await page.locator('#characterShop .shop-item').count()>0);
  assert.equal(await page.locator('[data-shop-view="characters"]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-shop-view="outfits"]').click();
  assert(await page.locator('#shopOutfitsSection').isVisible());
  assert(!(await page.locator('#shopCharactersSection').isVisible()));
  assert(await page.locator('#outfitShop .shop-item').count()>0,'Outfit cards remain functional');
  assert.equal(await page.locator('[data-shop-view="outfits"]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-shop-view="places"]').click();
  assert(await page.locator('#shopLocationsSection').isVisible(),'Places selection reveals globe and location shop');
  assert(await page.locator('#globe').isVisible(),'Interactive globe preserved');
  assert(await page.locator('#globeFindPlace').isVisible(),'Location search preserved');
  assert(await page.locator('#locationShop .shop-item').count()>0,'Location cards preserved');
  assert(!(await page.locator('#shopOutfitsSection').isVisible()));
  assert.equal(await page.evaluate(()=>localStorage.getItem('revisionLoopShopViewV1')),'places');
  await page.locator('#themeToggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('syncState')?.textContent?.includes('flashcards'),null,{timeout:120000});
  await page.locator('.tab[data-panel="shop"]').click();
  assert(await page.locator('#shopLocationsSection').isVisible(),'Chosen Shop category persists on this browser');
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark','Dark mode persists');
  await page.locator('#shopViewOutfits').click();
  assert(await page.locator('#shopOutfitsSection').isVisible(),'Equipped character can jump directly to outfits');
  const remaining=await page.evaluate(()=>({
   xp:profile.lifetimeXp,points:profile.points,good:progress.shopFixture?.good,
   hasOverflow:document.documentElement.scrollWidth>window.innerWidth+1
  }));
  assert.equal(remaining.xp,144);
  assert.equal(remaining.points,85);
  assert.equal(remaining.good,7);
  assert.equal(remaining.hasOverflow,false,'Shop must fit viewport width');
  assert.deepEqual(errors.filter(e=>!/firebase|network|Failed to fetch|dynamically imported module/i.test(e)),[]);
  console.log('PASS Shop v455 '+width+'px: categories, globe, outfits, hero shortcut, night mode, persistence and existing XP/progress');
  await ctx.close();
 }
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
