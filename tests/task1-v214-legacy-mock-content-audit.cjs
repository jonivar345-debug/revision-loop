'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const old=JSON.parse(fs.readFileSync('editorial/task1-v166-legacy-mock-card-map.json','utf8'));
const audit=JSON.parse(fs.readFileSync('editorial/task1-v214-legacy-mock-content-audit.json','utf8'));
assert.equal(deck.cards.length,3345);
assert.equal(old.records.length,971);
const byId=new Map(deck.cards.map(c=>[c.id,c]));
assert.equal(byId.size,deck.cards.length,'Core deck must retain unique card IDs');
const seen=new Map(),classes={Physics:0,Chemistry:0},a2=0;
const normal=x=>String(x||'').trim().toLowerCase().replace(/\s+/g,' ').replace(/[.!?]+$/,'');
let blank=0,missing=0,inactive=0,duplicate=0,tooLong=0;
for(const rec of old.records){
 const c=byId.get(rec.id);
 if(!c){missing++;continue}
 if(c.active===false||c.mock!==true)inactive++;
 if(!String(c.front||'').trim()||!String(c.back||'').trim())blank++;
 if(c.back.length>185)tooLong++;
 assert.equal(c.subject,rec.subject,'Subject changed on '+rec.id);
 assert.equal(c.stage,rec.stage,'Mock stage changed on '+rec.id);
 assert(['AS','A2'].includes(c.stage),'Unexpected school mock stage on '+rec.id);
 assert(rec.candidateSpecSection,'Missing provisional section on '+rec.id);
 classes[c.subject]=(classes[c.subject]||0)+1;
 if(c.subject==='Chemistry'&&c.stage==='A2')a2++;
 const key=c.subject+'|'+normal(c.front);
 if(seen.has(key))duplicate++;else seen.set(key,rec.id);
}
assert.equal(missing,0,'Legacy mock card removed');
assert.equal(inactive,0,'Legacy mock card disabled or removed from mock');
assert.equal(blank,0,'Blank prompt/answer');
assert.equal(tooLong,0,'Overlong answer requires review');
assert.equal(duplicate,0,'Exact same mock prompt duplicated');
assert.equal(classes.Physics,311);assert.equal(classes.Chemistry,660);
assert.equal(a2,194,'Chemistry A2 cards need scope review if school teaching changes');
// The old v166 audit flagged this back as too long, but deck v172 has already
// corrected the flashcard; do not propagate the obsolete warning into new work.
const oldFlag=old.reviewQueue.find(x=>x.id==='phy_spectra_photo_v32_below_threshold_graph');
assert(oldFlag,'Historical audit entry unexpectedly missing');
const photo=byId.get(oldFlag.id);
assert.equal(photo.back,'No photoelectrons are emitted.');
assert(photo.back.length<50);
const reviewed=[
 ['phy_vectors_001','resolving a force','F cos'],
 ['phy_motion_d','gradient','Velocity'],
 ['phy_motion_v','velocity–time','displacement'],
 ['phy_motion_a','acceleration–time','Change in velocity'],
 ['phy_newton3','third-law','different objects'],
 ['phy_rp6','gradient','−r'],
 ['chem_lattice_diss','lattice dissociation','gaseous ions'],
 ['chem_bondenthalpy','mean bond enthalpies','bonds broken'],
 ['chem_bh_defs_20261024_latt_formation_eq','NaCl','Na⁺(g)'],
 ['chem_atomic_v43_44','Al first IE','3p'],
 ['chem_atomic_v43_45','S first IE','paired 3p'],
 ['chem_config_weak_v45_01','chromium','3d⁵4s¹'],
 ['chem_config_weak_v45_02','copper','3d¹⁰4s¹'],
 ['chem_rp4','precipitate colours','AgCl white'],
 ['chem_rp2','calorimetry','q = mcΔT']
];
for(const [id,front,back] of reviewed){
 const c=byId.get(id);assert(c,'Missing reviewed card '+id);
 assert(c.front.includes(front),'Prompt changed on '+id);
 assert(c.back.includes(back),'Answer changed on '+id);
}
// Check structure and mock preset, not claim that all 971 were examiner-reviewed
// for factual correctness or that the entire AQA specification is covered.
assert.equal(audit.counts.matchedLegacyCards,971);
assert.equal(audit.counts.blankAnswers,0);
assert.equal(audit.counts.duplicatePrompts,0);
assert.equal(audit.counts.overlongAnswersAtAudit,0);
assert.equal(audit.contentSpotChecks.length,reviewed.length);
assert.equal(audit.completeSpecificationCertified,false);
assert.equal(audit.allLegacyAnswersHumanReviewed,false);
assert.equal(audit.task1Complete,false);
assert(fs.readFileSync('app.js','utf8').includes("PROGRESS_KEY='revisionLoopProgress5'"));
console.log('PASS v214: all 971 historical mock cards present and usable (311 Physics/660 Chemistry); no blanks/duplicate prompts/overlong backs; 15 exact content spot checks; historical stale flag resolved; no changes to student progress');
