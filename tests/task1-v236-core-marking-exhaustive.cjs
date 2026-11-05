'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const audit=json('editorial/task1-v236-core-marking-exhaustive-audit.json'),deck=json('deck.json'),app=read('app.js'),sw=read('sw.js');
assert.equal(audit.version,'v236');assert.equal(deck.cards.length,3345);
assert(sw.includes('v236-full-core-marking-audit'));
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
for(const completed of Object.values(audit.limits))assert.equal(completed,true);
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
assert(start>0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
let models=0,accepted=0,rejected=0;
for(const c of deck.cards){
 assert.equal(judge(c,c.back).status,'correct','Core model response incorrect '+c.id);models++;
 for(const x of (c.accept||[])){assert.equal(judge(c,x).status,'correct','Stored accept incorrectly marked '+c.id+': '+x);accepted++;}
 for(const x of (c.reject||[])){assert.equal(judge(c,x).status,'wrong','Stored reject credited '+c.id+': '+x);rejected++;}
}
// v236's original 4,942 accepted and 90 rejected core examples stay as a
// baseline. The five independently reviewed v336 Chemistry definitions add
// exactly one net accepted wording and 16 rejected incomplete responses.
const v336DefinitionIds=['task1_chem_017','task1_v125_121','task1_v127_074','task1_v130_084','task1_v130_085'];
assert.deepEqual(v336DefinitionIds.map(id=>{
 const c=deck.cards.find(c=>c.id===id);
 assert(c&&c.mock&&c.subject==='Chemistry','Missing reviewed definition '+id);
 return [c.accept?.length,c.reject?.length];
}),[[4,3],[3,3],[3,3],[3,4],[3,3]]);
assert.equal(models,3345);
assert.equal(accepted,4942+1,'Historical accepted responses plus one new valid definition wording');
assert.equal(rejected,90+16,'Historical rejected responses plus 16 specified incomplete definitions');
assert.equal(judge(deck.cards.find(c=>c.id==='maths_transform_003'),'1 over a').status,'correct');
assert.equal(judge(deck.cards.find(c=>c.id==='maths_transform_003'),'scale factor a').status,'wrong');
assert.equal(audit.results.unexpectedResults,0);
const urls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
assert(urls.length>=27,'Historical first 27 supplement banks missing');
const supplements=urls.slice(0,27).flatMap(path=>json(path).cards||[]);
assert.equal(supplements.length,262);
let supplementModels=0,supplementAccepts=0,supplementRejects=0;
for(const c of supplements){
 assert.equal(judge(c,c.back).status,'correct','Supplement model: '+c.id);supplementModels++;
 for(const x of (c.accept||[])){assert.equal(judge(c,x).status,'correct','Supplement accept: '+c.id+': '+x);supplementAccepts++;}
 for(const x of (c.reject||[])){assert.equal(judge(c,x).status,'wrong','Supplement reject: '+c.id+': '+x);supplementRejects++;}
}
assert.equal(supplementModels,262);assert(supplementAccepts>=992,'All original 992 accepted examples and later approved additions tested');assert(supplementRejects>=584,'All original 584 rejected examples and later additions tested');
assert.equal(models+supplementModels,3607);
assert(accepted+supplementAccepts>=5934,'Historical core and supplemental correct-answer coverage retained');
assert(rejected+supplementRejects>=674,'Historical wrong-answer rejection coverage retained');
console.log('PASS v236: '+(models+supplementModels)+' model answers, '+(accepted+supplementAccepts)+' declared accepted and '+(rejected+supplementRejects)+' declared rejected variants tested using the real marker; historical minimums retained. Complete AQA coverage NOT certified.');
