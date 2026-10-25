/* v96: verify real wardrobe SVGs and strict identity matching, without
   fetching/redistributing third-party artwork or touching user image storage. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
const cut=(first,next)=>{const a=app.indexOf(first),b=app.indexOf(next,a+1);assert(a>=0&&b>a,'Missing function '+first);return app.slice(a,b)};
const setup=cut('const CHARACTERS=[','// Read-only official character-profile previews.');
const silhouette=cut('const SERIES_COSTUME_TONES=','function compressOutfitPhoto(file){');
const matchCode=cut('function matchName(name,target){','async function findAniListArt(query){');
const {CHARACTERS,OUTFITS,SERIES_COSTUME_TONES,outfitPalette,costumeStyleDetails,illustratedCostume,matchName}=new Function(
 setup+silhouette+matchCode+
 'function esc(value){return String(value).replace(/&/g,"&amp;").replace(/"/g,"&quot;")};'+
 'return {CHARACTERS,OUTFITS,SERIES_COSTUME_TONES,outfitPalette,costumeStyleDetails,illustratedCostume,matchName};'
)();
assert.equal(CHARACTERS.length,116);
assert.equal(OUTFITS.length,928);
const series=new Set(CHARACTERS.map(c=>c.series));
assert.equal(series.size,24);
assert.equal(Object.keys(SERIES_COSTUME_TONES).length,24);
for(const show of series)assert(SERIES_COSTUME_TONES[show],'Missing themed palette: '+show);
let outfitsChecked=0;
for(const c of CHARACTERS){
 const items=OUTFITS.filter(o=>o.character===c.id);
 assert.equal(items.length,8,'Lost outfit for '+c.id);
 const visuals=new Set();
 for(const outfit of items){
  const art=illustratedCostume(c,outfit);
  const p=outfitPalette(c,outfit);
  assert(art.startsWith('<svg class="costume-silhouette costume-'+outfit.styleId+'"'),c.id+' lost SVG art');
  assert(art.includes('aria-hidden="true"'),'Do not announce decorative garments as official portrait');
  assert(art.includes('outfit-garment-'+outfit.styleId),'Outfit cut did not change: '+outfit.id);
  assert(art.includes('var(--')===false,'SVG should provide its own styled colours');
  assert(art.includes('style="--coat:'),'Missing clothing palette '+outfit.id);
  assert(p.coat&&p.trim&&/^#[a-f0-9]{6}$/i.test(p.coat)&&/^#[a-f0-9]{6}$/i.test(p.trim));
  assert.equal(outfit.cost,outfit.styleId==='default'?0:5,'Wardrobe cost changed');
  assert(!visuals.has(art),'Same outfit SVG repeated for '+c.id);visuals.add(art);
  outfitsChecked++;
 }
 assert.equal(visuals.size,8);
}
// The 5 lead-character bespoke palettes should not flatten to show defaults.
for(const id of ['lelouch','light','eren','gojo','kaneki']){
 const char=CHARACTERS.find(c=>c.id===id);
 const def=OUTFITS.find(x=>x.id===id+'-default');
 assert(char&&def);
 assert(illustratedCostume(char,def).includes('outfit-garment-default'));
}
for(const [names,wanted,expected] of [
 [['L Lawliet'],'L Lawliet',true],
 [['Lawliet L'],'L Lawliet',true],
 [['C.C.'],'C.C.',true],
 [['L'],'L Lawliet',false],
 [['L Lawliet From Another Show'],'L Lawliet',false],
 [['Satoru Gojou'],'Gojo',false],
 [['Satoru Gojou','Gojo Satoru'],'Satoru Gojou',true],
 [['Eren Jaeger'],'Eren Yeager',false],
 [['Light Yagami'],'Light Yagami',true],
 [['Light Novel Hero'],'Light Yagami',false],
 [['Erwin Smith'],'Erwin',false],
 [['Sung Jinwoo'],'Sung Jinwoo',true],
 [['Ken Kaneki'],'Kaneki Ken',true],
 [['','Bad Candidate'],'',false]
])assert.equal(matchName(names,wanted),expected,'Unsafe or missing portrait identity for '+wanted);
const personal=cut('const outfitImageCache=new Map();','const SERIES_COSTUME_TONES=');
for(const essential of ["indexedDB.open('revision-loop-personal-outfit-art',1)","transaction('art','readonly')","transaction('art','readwrite')","outfitImageCache.set(id,data||null)"])
 assert(personal.includes(essential),'Personal outfit image persistence lost '+essential);
assert(!/fetch\s*\(/.test(personal),'Personal artwork must not be uploaded');
assert(app.includes('if(outfitId){const custom=await limit(savedOutfitImage(outfitId),1500);if(custom&&await tryImage(custom))return}'),'Uploaded image must take precedence over public portrait');
assert(app.includes("'<div class=\"character-loading\" style=\"background:'+gradient+'\">'+avatarSVG(c,o)"),'Offline art must use original character illustration, not generic monograms');
assert(app.includes("if(note)note.textContent='Illustrated preview · portrait unavailable'"),'Offline illustrated fallback must be labelled accurately');
assert(app.includes("validPortraitUrl(url)"),'Portrait URL host checks removed');
console.log('PASS v96: 24 series palettes, '+outfitsChecked+' distinct character-outfit SVGs, full-name matching, and private image precedence without data migration');
