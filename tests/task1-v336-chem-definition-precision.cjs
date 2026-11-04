'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const cards=JSON.parse(read('deck.json')).cards;
const app=read('app.js');
const sw=read('sw.js');
const ids=[
 'task1_chem_017','task1_v125_121','task1_v127_074',
 'task1_v130_084','task1_v130_085'
];
const originalWeak={
 task1_chem_017:['known concentration'],
 task1_v125_121:['remove electron from gaseous atoms'],
 task1_v127_074:['dissolution enthalpy for one mole','Enthalpy change when one mole of solute dissolves to form solution.'],
 task1_v130_084:['one mole of water formed','enthalpy per mol water'],
 task1_v130_085:['one mole gaseous atoms','atomisation of 1 mol gaseous atoms']
};
const markerStart=app.indexOf('function normalise(');
const markerEnd=app.indexOf('function importantTokens(',markerStart);
assert(markerStart>=0&&markerEnd>markerStart,'Use production card-answer evaluator');
const evaluate=new Function('window',app.slice(markerStart,markerEnd)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
assert.equal(cards.length,3345,'Retain all original core cards');
assert.equal(new Set(cards.map(c=>c.id)).size,cards.length,'Preserve unique progress identifiers');
let passes=0,rejections=0;
for(const id of ids){
 const c=cards.find(x=>x.id===id);
 assert(c&&c.subject==='Chemistry'&&c.mock===true&&c.active!==false,id);
 assert(c.front.length<=240&&c.back.length<=180,'Short card, not disguised exam question: '+id);
 assert(c.back&&Array.isArray(c.accept)&&c.accept.length>=3,'Retain multiple well-formed answers: '+id);
 assert(Array.isArray(c.reject)&&c.reject.length>=3,'Retain misconception checks: '+id);
 for(const answer of [c.back,...c.accept]){
  const actual=evaluate(c,answer).status;
  assert.equal(actual,'correct',id+' rejected a valid authored answer: '+answer);passes++;
  assert.notEqual(evaluate(c,'not '+answer).status,'correct',id+' accepted denial: '+answer);
 }
 for(const answer of [...c.reject,...originalWeak[id],"I don't know","no idea"]){
  assert.equal(evaluate(c,answer).status,'wrong',id+' incorrectly credited '+answer);
  rejections++;
 }
}
// Missing the defining condition must never receive a full mark just
// because almost every other word matches the model.
const incomplete={
 task1_chem_017:['a solution with a known concentration'],
 task1_v125_121:['energy to remove electrons from atoms'],
 task1_v127_074:['the enthalpy change when one mole of solute dissolves in enough solvent to form a solution'],
 task1_v130_084:[
  'The enthalpy change when an acid and a base react in dilute aqueous solution to form one mole of water',
  'The enthalpy change when an acid and a base react to form one mole of water under standard conditions'
 ],
 task1_v130_085:[
  'The enthalpy change when one mole of gaseous atoms forms from an element in its standard state',
  'The enthalpy change when one mole of gaseous ions forms from an element in its standard state under standard conditions'
 ]
};
for(const [id,answers] of Object.entries(incomplete)){
 const c=cards.find(x=>x.id===id);
 for(const answer of answers)
  assert.notEqual(evaluate(c,answer).status,'correct',id+' gave a full mark despite an omitted definition requirement');
}
assert(app.includes('v336: require essential parts of five precise definitions'),'Keep the narrow semantic completeness guard');
const water=cards.find(x=>x.id==='task1_v130_084');
assert(/standard conditions/i.test(water.back)&&/one mole of water/i.test(water.back)&&/acid and a base/i.test(water.back));
const atom=cards.find(x=>x.id==='task1_v130_085');
assert(/standard conditions/i.test(atom.back)&&/gaseous atoms/i.test(atom.back));
const solution=cards.find(x=>x.id==='task1_v127_074');
assert(/infinitely dilute/i.test(solution.back));
const first=cards.find(x=>x.id==='task1_v125_121');
assert(/gaseous 1\+ ions/i.test(first.back));
assert(sw.includes('-v336-chem-definition-precision'),'Offline revision must load corrected answers');
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(k),'Preserve existing local/cloud progress keys');
console.log('PASS v336: '+ids.length+' existing Chemistry mock definitions repaired, '+passes+' valid production-marker answers and '+rejections+' explicit incorrect answers checked. No flashcard IDs or session data changed.');
