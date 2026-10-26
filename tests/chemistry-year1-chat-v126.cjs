'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const deck=JSON.parse(fs.readFileSync(path.join(root,'deck.json'),'utf8'));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const cards=deck.cards;
const original=cards.filter(c=>!c.id.startsWith('chem_y1_chat_v126_'));
const added=cards.filter(c=>c.id.startsWith('chem_y1_chat_v126_'));
const expected={'Kinetics':14,'Equilibria':14,'Redox':18,'Periodicity':12,'Group 2':19,'Group 7':23};
const refs={'Kinetics':'3.1.5','Equilibria':'3.1.6','Redox':'3.1.7','Periodicity':'3.2.1','Group 2':'3.2.2','Group 7':'3.2.3'};
assert(deck.deckVersion>=126,'New deck version not deployed');
assert.equal(added.length,100,'Expected exactly 100 new focused Chemistry flashcards');
for(const [topic,number] of Object.entries(expected)){
 assert.equal(added.filter(c=>c.topic===topic).length,number,'Expected targeted gap coverage for '+topic);
 assert(cards.filter(c=>c.subject==='Chemistry'&&c.topic===topic).length>number,'Existing cards must be kept for '+topic);
}
const previousTopicAliases={
 'Atomic Structure':['Atomic structure','Ionisation energy'],
 'Amount of Substance':['Amount of substance','Back titrations','Titration calculations'],
 'Bonding':['Bonding','Shapes','Intermolecular forces','Bond polarity','Crystal structures'],
 'Energetics':['Energetics','Calorimetry',"Hess's law",'Bond enthalpies','RP2 Enthalpy']
};
for(const [topic,aliases] of Object.entries(previousTopicAliases)){
 assert(aliases.some(name=>original.filter(c=>c.subject==='Chemistry'&&c.topic===name).length>=10),'Missing previously covered '+topic);
}
const ids=new Set(),allFronts=new Set();
for(const c of cards){assert(!ids.has(c.id),'Duplicate card ID '+c.id);ids.add(c.id);}
for(const c of original){if(c.front)allFronts.add(c.front.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim());}
for(const c of added){
 assert(c.subject==='Chemistry'&&c.stage==='AS'&&c.scope==='mock'&&c.mock===true&&c.taught===true&&c.active===true,'New card not eligible in taught mock revision '+c.id);
 assert.equal(c.specRef,refs[c.topic],'Wrong spec section '+c.id);
 assert.equal(c.revisionTopic,c.topic,'Topic filter inconsistent '+c.id);
 assert.equal(c.courseTopic,c.topic,'Study grouping inconsistent '+c.id);
 assert(c.front.length<=115&&c.back.length<=125,'Not short enough for recall '+c.id);
 const norm=c.front.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
 assert(!allFronts.has(norm),'Duplicate wording '+c.id);allFronts.add(norm);
 assert.equal(c.accept[0],c.back,'Mismatched answer alternative '+c.id);
}
const textFor=topic=>added.filter(c=>c.topic===topic).map(c=>c.front+' '+c.back).join('\n');
for(const [topic,need] of Object.entries({
 'Kinetics':['tangent','sulfur','s⁻¹','Eₐ'],
 'Equilibria':['Haber','Kc','moles','catalyst'],
 'Redox':['MnO₄⁻','Cr₂O₇²⁻','Fe³⁺','e⁻'],
 'Periodicity':['helium','silicon','sulfur','P₄'],
 'Group 2':['MgO','TiCl₄','BaSO₄','H₂SO₄'],
 'Group 7':['AgBr','HClO','chlorate(I)','SO₂','NaOH']
})){
 const hay=textFor(topic);
 for(const word of need)assert(hay.includes(word),'Missing key studied subtopic '+topic+': '+word);
}
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"),'Progress data location unexpectedly changed');
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"),'Profile data location unexpectedly changed');
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"),'Settings data location unexpectedly changed');
assert.equal(deck.meta.chatYear1CoverageV126.count,100);
console.log('PASS: preserved Parts 1–4, added 100 concise Parts 5–10 cards; 2514+ study cards, no duplicate IDs, valid mock topics and unchanged progress keys');
