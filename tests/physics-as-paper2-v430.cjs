'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const helper=require('../flashcard-priority-v429.js');
const files=[
 ['physics_as_paper2_section_a_v430.json','A',40],
 ['physics_as_paper2_section_b_v430.json','B',32],
 ['physics_as_paper2_section_c_v430.json','C',56],
 ['physics_as_paper2_mcq_v430.json','C',20]
];
const all=[];
for(const [path,section,n] of files){
 const bank=JSON.parse(fs.readFileSync(path,'utf8'));
 assert.equal(bank.count,n);
 assert.equal(bank.cards.length,n);
 assert.equal(bank.paperSection,section);
 assert(bank.contentPolicy.includes('Original'));
 for(const c of bank.cards){
  assert(/^as_p2_v430_[abcm]\d{2}$/.test(c.id),'Card id '+c.id);
  assert.equal(c.subject,'Physics');assert.equal(c.stage,'AS');
  assert.equal(c.paper2Training,true);assert.equal(c.paper2Section,section);
  assert.equal(c.scope,'paper2-training');assert.equal(c.mock,false);
  assert.equal(c.taught,true);assert.equal(c.active,true);
  assert.equal(c.courseTopic,'AS Paper 2 (7407/2)');
  assert(c.revisionTopic.startsWith('AS Paper 2 · '+section));
  assert(c.front.length>=18&&c.front.length<=170,c.id+' concise front');
  assert(c.back.length>=3&&c.back.length<=180,c.id+' concise answer');
  assert(c.paper2Hint.length>=15&&c.paper2Hint.length<=200,c.id+' useful hint');
  assert(c.paper2Method.length>=18&&c.paper2Method.length<=230,c.id+' method');
  assert(c.paper2Pitfall.length>=15&&c.paper2Pitfall.length<=190,c.id+' trap');
  assert(c.paper2Method!==c.back,'Method should add guidance: '+c.id);
  assert(!/^(?:question|q)\s*\d+[a-d]?\s*[:.)]/i.test(c.front),'Looks copied from a past paper');
  assert.equal(helper.isMustKnow(c),false,'Coaching must not override formula recall scheduling');
  assert(Array.isArray(c.accept)&&Array.isArray(c.reject));
  if(c.paper2Options){
   assert.equal(c.paper2Options.length,4);
   assert.equal(new Set(c.paper2Options).size,4);
   assert(/^[ABCD]$/.test(c.paper2CorrectOption));
   assert.equal(c.format,'mcq');
  }
  all.push(c);
 }
}
assert.equal(all.length,148);
assert.equal(new Set(all.map(c=>c.id)).size,148);
assert.equal(new Set(all.map(c=>c.front.toLowerCase().trim())).size,148);
assert.deepEqual(all.reduce((o,c)=>(o[c.paper2Section]++,o),{A:0,B:0,C:0}),{A:40,B:32,C:76});
assert.equal(all.filter(c=>c.paper2Options).length,20);
for(const c of all.filter(c=>c.paper2Options))assert.equal(c.back.includes('?'),false,c.id);
const base=JSON.parse(fs.readFileSync('deck.json','utf8')).cards;
const oldIds=new Set(base.map(c=>c.id));
for(const c of all)assert(!oldIds.has(c.id),'Original deck ID changed');
for(const f of files)assert(app.includes("./"+f[0]),'Bank missing from app loader: '+f[0]);
assert(app.includes("c.paper2Training!==true")&&app.includes("c.mock!==false"));
assert(app.includes("function selectPaper2Section(section='all')"));
assert(app.includes("if(c.paper2Training===true)return flashScopeFilter==='paper2'"));
assert(app.includes("if(flashScopeFilter==='paper2')return false"));
assert(app.includes("activeSession=null;")&&app.includes("flashScopeFilter='paper2'"));
assert(app.includes("c.paper2Training!==true&&(!sub||c.subject===sub)"),'Daily challenge must not include Paper 2 coaching');
assert(app.includes("cards.filter(c=>c.active!==false&&c.paper2Training!==true)"),'General weak-card queue must not include Paper 2 coaching');
assert(app.includes("priorityOptions.classList.toggle('hidden',paper2Active)"));
assert(app.includes('paper2Choices')&&app.includes('paper2Reason')&&app.includes('paper2Hint'));
assert(app.includes('answer===c.paper2CorrectOption'));
for(const section of ['all','A','B','C'])assert(html.includes('data-paper2-section="'+section+'"'));
assert(html.includes('id="paper2Status"'));
assert(html.includes('app.js?v=430'));
assert(css.includes('.paper2-choices')&&css.includes('[aria-pressed="true"]'));
assert(sw.includes('v430-as-paper2-guided-flashcards'));
for(const [path] of files)assert(sw.includes("'./"+path+"'"),'Offline manifest missing: '+path);
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
new Function(app);
console.log('PASS v430: 148 unique short AQA AS Physics Paper 2 cards (40 A, 32 B, 76 C), 20 MCQ, 4 banks, separate scope, guidance, offline and old data keys.');
