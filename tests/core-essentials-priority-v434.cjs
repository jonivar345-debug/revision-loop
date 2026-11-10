'use strict';
/* v434: selective, content-grounded Physics/Maths/Chemistry quick recall. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const helper=require('../flashcard-priority-v429.js');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const selected=deck.cards.filter(c=>['practical-fact','maths-fact','chemistry-fact'].includes(helper.classify(c)?.kind));
const counts={Physics:0,Maths:0,Chemistry:0};
for(const c of selected){
 assert.equal(c.active,true,'No inactive card promoted '+c.id);
 assert(c.front.length<=120&&c.back.length<=160,'Only short recall facts, not exam paragraphs: '+c.id);
 assert(!c.paper2Training,'Do not reinterpret the AQA AS Paper 2 coach');
 counts[c.subject]++;
}
assert.deepEqual(counts,{Physics:28,Maths:26,Chemistry:2});
assert.equal(new Set(selected.map(c=>c.id)).size,56);
const byId=new Map(selected.map(c=>[c.id,c]));
for(const id of ['phy_motion_d','phy_motion_v','phy_rp6','phy_uncert_products',
 'v33_card_physics_interference_16','task1_practical_011','task1_phy_105',
 'math_proof_exhaust','math_quad_discriminant','math_logs_product',
 'task1_v136_068','task1_v162_002','task1_v162_023','chem_atomic_v43_18','chem_atomic_v43_34']){
 assert(byId.has(id),'Essential prompt omitted: '+id);
 assert(helper.isMustKnow(byId.get(id)));
}
for(const [subject,front,back] of [
 ['Physics','A 3.2 m car stops in 2 seconds. Find its speed.','1.6 m/s'],
 ['Maths','If x=4 and y=7, calculate x+y.','11'],
 ['Chemistry','How do you calculate Kp from these equilibrium amounts?','Substitute partial pressures.']
]){
 assert.equal(helper.classify({id:'novel_application_2026',subject,front,back,active:true}),null,
 'Do not treat arbitrary applied work as memorisation: '+front);
}
assert.equal(helper.classify({id:'phy_motion_d',subject:'Chemistry',front:'Test',back:'Test',active:true}),null,
 'Named ID must match its intended subject');
const oldPhysics=deck.cards.find(c=>c.id==='phy_wave_speed');
const oldMaths=deck.cards.find(c=>c.id==='task1_v162_020');
assert(!helper.isMustKnow(oldPhysics),'Printed wave-speed equation remains ordinary');
if(oldMaths)assert(helper.classify(oldMaths)?.kind!=='maths-fact');
assert(html.includes('flashcard-priority-v429.js?v=429&chem=v433&core=v434'));
assert(sw.includes('v434-core-recall'));
assert(app.includes("settings.recallMustKnowOnly")&&app.includes("settings.recallMustKnowFirst"));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'")&&app.includes("PROFILE_KEY='revisionLoopProfile11'"));
console.log('PASS v434: 28 Physics graphs/practical and conceptual recall + 26 Maths results/identities + 2 Chemistry mass-spec facts; no formula-booklet mislabelling, application overreach or saved-data key changes.');
