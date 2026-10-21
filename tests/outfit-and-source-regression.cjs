'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
function cut(a,b){
 const i=app.indexOf(a),j=app.indexOf(b,i+1);
 assert(i>=0&&j>i,'Missing source boundary '+a);
 return app.slice(i,j);
}
const definitions=cut('const CHARACTERS=[','// Read-only official character-profile previews.');
const art=cut('function outfitPalette(c,o){','function compressOutfitPhoto(file){');
const model=new Function(definitions+
 'function esc(value){return String(value).replace(/&/g,"&amp;").replace(/"/g,"&quot;")};'+art+
 'return {CHARACTERS,OUTFITS,illustratedCostume,outfitPalette}')();
const {CHARACTERS,OUTFITS,illustratedCostume,outfitPalette}=model;
let checks=0;
assert.equal(CHARACTERS.length,116);checks++;
assert.equal(OUTFITS.length,928);checks++;
const ids=new Set();
for(const c of CHARACTERS){
 const costumes=OUTFITS.filter(o=>o.character===c.id);
 assert.equal(costumes.length,8);checks++;
 const previews=new Set();
 for(const [i,o] of costumes.entries()){
  assert(!ids.has(o.id));ids.add(o.id);checks++;
  assert.equal(o.cost,i===0?0:15);checks++;
  const svg=illustratedCostume(c,o);
  assert(svg.includes('costume-silhouette')&&svg.includes('aria-hidden'));checks++;
  assert(svg.includes('costume-'+o.styleId));checks++;
  const p=outfitPalette(c,o);
  assert(/^#[\da-f]{6}$/i.test(p.coat)&&/^#[\da-f]{6}$/i.test(p.trim));checks++;
  previews.add(svg);
 }
 assert.equal(previews.size,8);checks++;
}
const localCode=cut('const outfitImageCache=new Map();','function outfitPalette(c,o){');
assert(localCode.includes('indexedDB.open('));checks++;
assert(localCode.includes("transaction('art','readwrite')"));checks++;
assert(!/\bfetch\s*\(/.test(localCode),'Custom images must not be uploaded');checks++;
for(const str of ['data-outfit-upload=','data-outfit-clear=','savedOutfitImage(outfitId)','compressOutfitPhoto(file)','limit(savedOutfitImage(outfitId),1500)']){
 assert(app.includes(str),'Missing '+str);checks++;
}
const inventory=JSON.parse(fs.readFileSync(path.join(root,'original_mark_audit_2026_10_21.json'),'utf8'));
const bank=JSON.parse(fs.readFileSync(path.join(root,'exam_questions.json'),'utf8')).questions;
const supplement=JSON.parse(fs.readFileSync(path.join(root,'paper_supplement_2016_2017.json'),'utf8')).questions;
const linked=[...bank,...supplement].filter(q=>q.sourceVerified===true);
assert.equal(inventory.entries.length,linked.length);checks++;
const known=new Map(inventory.entries.map(x=>[x.id,x]));
for(const q of linked){
 const v=known.get(q.id);
 assert(v,'Untracked '+q.id);checks++;
 assert.equal(v.marksInApp,q.marks);checks++;
 assert.equal(v.originalMarkVerified,!!q.originalMarkVerified);checks++;
 if(q.originalMarkVerified){assert(q.originalMarkVerifiedSource);checks++}
}
assert.equal(inventory.counts.independentlyOriginalMarkChecked,63);checks++;
for(const id of ['aqa_phy_as23_p1_q1_5','aqa_phy_as23_p1_q2_1','aqa_phy_as23_p1_q3']){
 const q=bank.find(x=>x.id===id);
 assert(q?.originalMarkVerified);checks++;
 assert.equal(q.originalMarkVerifiedSource,'AQA-74071-MS-JUN23.PDF');checks++;
}
const polar=bank.find(x=>x.id==='aqa_phy_as23_p1_q3');
assert.equal(polar.answerType,'levels');checks++;
assert.equal(polar.markSchemeType,'level-of-response');checks++;
console.log('PASS '+checks+' outfit, local art and AQA verification checks');
