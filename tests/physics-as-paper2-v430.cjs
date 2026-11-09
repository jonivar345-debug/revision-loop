'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const data=JSON.parse(fs.readFileSync('physics_as_paper2_skills_v430.json','utf8'));
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const cards=data.cards;
assert.equal(data.version,'v430');
assert.equal(cards.length,107,'Preserve 107 reviewed, self-contained AQA paper-method cards.');
const counts={A:0,B:0,C:0},topics=new Set(),ids=new Set(),skills=new Set();
for(const c of cards){
 assert(/^as_paper2_v430_\d{3}$/.test(c.id),'Invalid stable card ID '+c.id);
 assert(!ids.has(c.id),'Duplicate card ID '+c.id);ids.add(c.id);
 assert.equal(c.subject,'Physics');
 assert.equal(c.stage,'AS');
 assert.equal(c.paper2,true);
 assert.equal(c.mock,false,'Never put the AS paper-method bank into the school mock');
 assert.equal(c.scope,'paper2');
 assert.equal(c.taught,true);
 assert.equal(c.active,true);
 assert(['A','B','C'].includes(c.paper2Section));
 assert(/^3\.[1-5]$/.test(c.specRef),'Outside AS Physics core');
 assert(c.front.length>=15&&c.front.length<=145,'Not a brief single-skill prompt: '+c.id);
 assert(c.back.length>=2&&c.back.length<=140,'Long form or incomplete answer: '+c.id);
 assert(c.paper2Hint.length>=20&&c.paper2Hint.length<=230,'Missing useful starting hint');
 assert(c.paper2Method.length>=18&&c.paper2Method.length<=220,'Missing method');
 assert(c.paper2Pitfall.length>=18&&c.paper2Pitfall.length<=220,'Missing common pitfall');
 assert(c.paper2Method!==c.paper2Pitfall,'Method and pitfall duplicated');
 assert(Array.isArray(c.accept)&&c.accept.includes(c.back),'Official answer must pass');
 assert(!/<script|<iframe/i.test(JSON.stringify(c)),'Markup injection');
 counts[c.paper2Section]++;topics.add(c.topic);skills.add(c.paper2Skill);
}
assert.deepEqual(counts,{A:40,B:37,C:30});
assert(topics.size>=7,'Practical, mechanics, waves, particles, electricity and strategy must appear');
assert(skills.size>=80,'Different styles should not repeat one vague question');
assert.equal(new Set(cards.map(c=>c.front)).size,cards.length,'Avoid repeated prompts.');
assert(!data.sourceAuditStatus.toLowerCase().includes('complete year-by-year item-to-skill map'),'Do not claim exhaustive past-paper mapping');
for(const id of ['as_paper2_v430_001','as_paper2_v430_034','as_paper2_v430_035','as_paper2_v430_064','as_paper2_v430_065','as_paper2_v430_087','as_paper2_v430_107']){
 assert(ids.has(id),'Missing key coverage '+id);
}
const bankIds=new Set(JSON.parse(fs.readFileSync('deck.json','utf8')).cards.map(c=>c.id));
assert(cards.every(c=>!bankIds.has(c.id)),'New cards must never overwrite a learner\'s old progress identity.');
for(const id of ['flashSubject','flashCount','paper2Progress','startFlashcards','flashTopics']){
 assert(html.includes('id="'+id+'"'),'Missing control '+id);
}
for(const section of ['A','B','C','all']){
 assert(html.includes('data-paper2-section="'+section+'"'),'Missing section selector '+section);
}
assert(html.includes('AQA AS Physics Paper 2 (7407/2)'));
assert(html.includes('original')||html.includes('Original'));
assert(html.includes('2018–2025'),'Source boundary disclosure must be visible');
assert(html.includes('www.aqa.org.uk/past-papers-and-mark-schemes-finder'));
assert(html.includes('app.js?v=430')&&html.includes('styles.css?v=430'));
assert(sw.includes("'./physics_as_paper2_skills_v430.json'"));
assert(sw.includes('v430-paper2-skills'));
assert(css.includes('.paper2-training')&&css.includes('.paper2-actions')&&css.includes('.paper2-hint')&&css.includes('.paper2-support'));
assert(app.includes("const AS_PAPER2_SKILLS_URL='./physics_as_paper2_skills_v430.json'"));
assert(app.includes("c.mock!==false"),'Paper 2 cards must have an explicit mock:false guard.');
assert(app.indexOf(' // Separate AS 7407/2 method practice:')>app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),'Legacy 56 supplement bank card order must be retained.');
assert(app.includes("function startPaper2Session(section='all')"));
assert(app.includes("activeSession={kind:'flash'"));
assert(app.includes("items:picked.map(c=>({type:'card',id:c.id}))"));
assert(app.includes("paper2Section===section"));
assert(app.includes("c.paper2!==true&&window.RevisionFlashPriority"));
assert(app.includes("const paper2Hint=c.paper2===true"));
assert(app.includes("const paper2Support=c.paper2===true"));
assert(app.includes('paper2.length')&&app.includes('state(c.id).stage>=0'),'Saved reviews count toward progress');
assert(!app.includes('revisionLoopProgress6'),'Existing saved progress storage key must remain unchanged.');
console.log('PASS v430 '+cards.length+' original AS Physics 7407/2 guided cards: A='+counts.A+', B='+counts.B+', C='+counts.C+'; unique short prompts, safe mock boundary, browser UI hooks, offline assets and saved ID protections.');
