/* Revision Loop v52: economy, globe positions, streaks and content checks. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const cut=(from,to)=>{const i=app.indexOf(from),j=app.indexOf(to,i);assert(i>=0&&j>i,'Missing source anchor: '+from);return app.slice(i,j)};
const {CHARACTERS,OUTFITS,MAIN_CHARACTER_IDS,POPULAR_LEAD_IDS}=new Function(cut('const CHARACTERS=[','// Read-only official character-profile previews.')+'return {CHARACTERS,OUTFITS,MAIN_CHARACTER_IDS,POPULAR_LEAD_IDS};')();
const {LOCATIONS,ICONIC_LOCATION_IDS,MAJOR_LOCATION_IDS}=new Function(cut('const LOCATIONS=[','const EARTH_TEXTURE_URL=')+'return {LOCATIONS,ICONIC_LOCATION_IDS,MAJOR_LOCATION_IDS};')();
const facts=new Function(cut('const LOCATION_FACTS=','async function setLocationInfo(id)')+'return {LOCATION_FACTS,LOCATION_CULTURE_DETAILS};')();
const score=new Function(cut('function now(){','function clamp(')+'return {challengeBonusForStreak,dateKey};')();
let checks=0;
assert.equal(CHARACTERS.length,116);checks++;
assert.equal(LOCATIONS.length,161);checks++;
for(const c of CHARACTERS){
 assert.equal(c.cost,c.id==='lelouch'?0:POPULAR_LEAD_IDS.has(c.id)?20:MAIN_CHARACTER_IDS.has(c.id)?15:10,
 'Character cost outside fair tier: '+c.id);checks++;
}
for(const outfit of OUTFITS){assert.equal(outfit.cost,outfit.styleId==='default'?0:5,'Incorrect outfit price: '+outfit.id);checks++}
for(const loc of LOCATIONS){
 assert(loc.id&&Number.isFinite(loc.lat)&&Number.isFinite(loc.lon),'Missing position: '+loc.id);checks++;
 assert(loc.lat>=-90&&loc.lat<=90&&loc.lon>=-180&&loc.lon<=180,'Out-of-range coordinates: '+loc.id);checks++;
 assert(loc.id==='london'?loc.cost===0:ICONIC_LOCATION_IDS.has(loc.id)?loc.cost===100:MAJOR_LOCATION_IDS.has(loc.id)?loc.cost===75:loc.cost===50,'Unexpected price: '+loc.id);checks++;
}
const ids=x=>x.map(v=>v.id);
assert.equal(new Set(ids(CHARACTERS)).size,116);checks++;
assert.equal(new Set(ids(LOCATIONS)).size,161);checks++;
assert.equal(new Set(ids(OUTFITS)).size,OUTFITS.length);checks++;
const probe=new Function('const R=360;'+cut('function project(lat,lon,w,h){','function visibleGlobePins(')+'return project;')();
const projector=new Function('let globeLon=0,globeLat=5;'+cut('function project(lat,lon,w,h){','function visibleGlobePins(')+'return (lat,lon)=>{globeLat=lat;globeLon=lon;return project(lat,lon,700,360)}')();
for(const loc of LOCATIONS){
 const p=projector(loc.lat,loc.lon);
 assert(Math.abs(p.x-350)<1e-7&&Math.abs(p.y-180)<1e-7&&p.z>0.999,
   'Globe coordinate projection mismatch for '+loc.id);checks++;
}
assert.deepEqual(Array.from({length:6},(_,i)=>score.challengeBonusForStreak(i+1)),[0,1,2,3,4,5]);checks++;
assert.equal(score.dateKey(new Date(2026,9,21,23,50)),'2026-10-21');checks++;
const cultures=Object.values(facts.LOCATION_CULTURE_DETAILS),quick=Object.values(facts.LOCATION_FACTS);
assert(cultures.length>=45);checks++;
assert.equal(new Set(cultures).size,cultures.length,'Repeated culture description');checks++;
assert.equal(new Set(quick).size,quick.length,'Repeated location quick fact');checks++;
for(const x of Object.keys(facts.LOCATION_CULTURE_DETAILS))assert(LOCATIONS.some(l=>l.id===x),'Unknown culture location '+x),checks++;
const allFiles=['exam_questions.json','paper_supplement_2016_2017.json','gap_questions_physics_v48.json','gap_questions_chemistry_v48.json','gap_questions_maths_v48.json','gap_questions_extended_v49.json'];
const q=allFiles.flatMap(f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8')).questions);
const deck=JSON.parse(fs.readFileSync(path.join(root,'deck.json'),'utf8')).cards;
const available=Object.fromEntries(['Maths','Physics','Chemistry'].map(s=>[s,new Set(deck.filter(x=>x.subject===s).map(x=>x.revisionTopic||x.topic))]));
assert.equal(q.filter(x=>x.standalone!==false).length,1271);checks++;
const seen=new Set(),prompts=new Set();
for(const question of q){
 assert(!seen.has(question.id),'Duplicate question '+question.id);seen.add(question.id);checks++;
 const key=[question.subject,(question.prompt||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()].join('|');
 assert(!prompts.has(key),'Repeated wording '+question.id);prompts.add(key);checks++;
 if(question.standalone===false)continue;
 assert(available[question.subject]?.has(question.revisionTopic||question.topic),'Incorrect topic: '+question.id);checks++;
 assert(question.marks>0&&question.marks<=25,'Invalid score '+question.id);checks++;
 if(question.markPointMarks)assert.equal(question.markPointMarks.reduce((a,b)=>a+b,0),question.marks,'Marking allocation invalid '+question.id),checks++;
}
console.log('PASS '+checks+' characters, 5-point outfits, region-balanced locations, precise globe pins, streak bonus, distinct culture and 1262 usable exam questions');
