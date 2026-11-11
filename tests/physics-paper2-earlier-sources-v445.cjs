'use strict';
/* v445: selected original AS Physics 7407/2 skills from 2018–2021.
   Checks historic identities, evidence links, limitations and safe marking. */
const fs=require('node:fs');
const assert=require('node:assert/strict');
const crypto=require('node:crypto');
const bank=JSON.parse(fs.readFileSync('physics_as_paper2_guided_v430.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/physics-as-paper2-early-source-crosswalk-v445.json','utf8'));
const app=fs.readFileSync('app.js','utf8'),html=fs.readFileSync('index.html','utf8'),sw=fs.readFileSync('sw.js','utf8');
const all=bank.cards;
assert.equal(all.length,170);
const original=all.slice(0,150),prior=crypto.createHash('sha256').update(JSON.stringify(original)).digest('hex');
assert.equal(prior,'bb051b27487012f5e1435703b4cd2bee2b6df3a9761a9a5f1ded320a3749148c','Every pre-v445 card, including all prior answers and IDs, must remain unchanged');
const added=all.filter(c=>/^as_p2_v445_\d{3}$/.test(c.id));
assert.equal(added.length,20);
assert.deepEqual(added.map(c=>c.id),Array.from({length:20},(_,i)=>'as_p2_v445_'+String(i+1).padStart(3,'0')));
assert.equal(new Set(all.map(c=>c.id)).size,170);
assert.equal(audit.version,'v445');assert.equal(audit.afterCards,170);
assert.equal(audit.archiveStatus.includes('NO complete papers'),true);
assert.equal(audit.mappings.length,20);
for(const year of [2018,2019,2020,2021]){
 const paper=audit.officialSources.find(p=>p.year===year);
 assert(paper,'Official paper must be recorded');
 assert.equal(paper.selectedParts.length,5);
 assert.equal(paper.sitting,year>=2020?'November':'June');
 assert(paper.questionPaper.startsWith('https://filestore.aqa.org.uk/'));
 assert(paper.markScheme.startsWith('https://filestore.aqa.org.uk/'));
 assert(paper.questionPaper.includes('74072-QP-'));
 assert(paper.markScheme.includes('74072-')&&paper.markScheme.includes('-MS-'));
 assert.equal(added.filter(c=>c.sourceStyle.year===year).length,5);
}
for(const entry of audit.mappings){
 const c=added.find(c=>c.id===entry.id);
 assert(c,'All source-mapped ID must exist: '+entry.id);
 assert.equal(c.sourceStyle.year,entry.year);
 assert.equal(c.sourceStyle.question,entry.question);
 assert.equal(c.paper2Section,entry.section);
 assert.equal(c.specRef,entry.topicCode);
 assert(c.sourceStyle.status.includes('original coaching adaptation'),'No original AQA text reproduction claim');
 assert(c.mock===false&&c.scope==='full','Do not put new Paper 2 cards in school mock');
 assert(c.active===true&&c.taught===true&&c.strictRecall===true);
 assert(c.front.length<=175&&c.back.length<=165);
 assert(c.paper2Hint.length>=15&&c.paper2Hint.length<=145);
 assert(c.paper2Trap.length>=15&&c.paper2Trap.length<=145);
 assert(c.accept.length>=1);
 if(c.paper2Section==='C'){
  assert.equal(c.paper2Mode,'mcq');
  assert.equal(c.paper2Choices.length,4);
  assert.equal(c.paper2Choices[0],c.back);
  assert.equal(new Set(c.paper2Choices.map(s=>s.toLowerCase())).size,4);
 }
}
const selected={
 'as_p2_v445_001':'0.25 m s⁻²',
 'as_p2_v445_003':'1.01 × 10⁻⁴ m³',
 'as_p2_v445_004':'1.0 × 10⁷ electrons',
 'as_p2_v445_006':'0.57%',
 'as_p2_v445_007':'20 Ω',
 'as_p2_v445_008':'3.2 × 10⁻²² N s',
 'as_p2_v445_010':'2.1%',
 'as_p2_v445_012':'0.94 V',
 'as_p2_v445_013':'1.25%',
 'as_p2_v445_014':'2.5 × 10⁹ Hz',
 'as_p2_v445_015':'9.6 mm.',
 'as_p2_v445_018':'Stress and Young modulus.',
 'as_p2_v445_020':'−9.6 × 10⁶ C kg⁻¹.'
};
for(const [id,answer] of Object.entries(selected))assert.equal(added.find(c=>c.id===id).back,answer);
const counts=Object.fromEntries(['A','B','C'].map(section=>[section,all.filter(c=>c.paper2Section===section).length]));
assert.deepEqual(counts,{A:60,B:37,C:73});
assert.equal(added.filter(c=>c.paper2Section==='C').length,4);
assert(app.includes('(?:430|443|444|445)'));
assert(html.includes('paper2=v445'));
assert(sw.includes('v445-paper2-early-sources'));
for(const save of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(save));
console.log('PASS v445: 20 mapped 2018–2021 Paper 2 skills, five per sitting; previous 150 immutable, all model answers and MCQs typed, 60/37/73, saved progress and offline intact');
