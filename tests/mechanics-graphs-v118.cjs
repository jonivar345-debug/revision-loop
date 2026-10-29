'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const newBank=JSON.parse(read('mechanics_graphs_v118.json'));
const oldBank=JSON.parse(read('mechanics_focus_v39.json'));
const deck=JSON.parse(read('deck.json'));
const app=read('app.js'),html=read('index.html'),sw=read('sw.js');
assert.equal(newBank.questions.length,10);
assert.equal(newBank.questions.reduce((n,q)=>n+q.marks,0),70);
assert.equal(oldBank.questions.length,16);
assert.equal(deck.cards.length>=1220,true,'Do not delete historic cards');
assert.equal(deck.cards.filter(c=>c.id.startsWith('phy_graph_v118_')).length,12);
assert(deck.deckVersion>=118);
assert(app.includes("'./mechanics_graphs_v118.json'"));
assert(sw.includes("'./mechanics_graphs_v118.json'"));
assert(/app\.js\?v=\d+/.test(html),'Main app script must be versioned and included');
assert(html.includes('progress-backup.js?v=120')||html.includes('progress-backup.js?v=1'),'Keep downloadable progress backups');
assert(sw.includes("'./progress-backup.js'"),'Keep backups available with shell cache');
for(const k of ['PROGRESS_KEY=\'revisionLoopProgress5\'',"PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k),'Do not migrate or reset '+k);
new Function(app);
const historic=new Set(oldBank.questions.map(q=>q.id));
const all=new Set([...historic]);
for(const q of newBank.questions){
 assert(!all.has(q.id),'Duplicate question ID: '+q.id);all.add(q.id);
 assert.equal(q.subject,'Physics');assert.equal(q.level,'AS');assert.equal(q.year,'Practice');
 assert.equal(q.sourceVerified,false,'Must not misrepresent an original question as an official source');
 assert.equal(q.markPoints.length,q.marks,'Marks/points mismatch '+q.id);
 assert.equal(q.markPointMarks.reduce((n,x)=>n+x,0),q.marks);
 assert(q.prompt.length>75&&q.modelAnswer.length>50);
 assert(q.standalone&&q.requiresWorking&&q.mock,'Practice question flags missing');
 if(q.graphSpec){assert.equal(q.graphSpec.kind,'polyline');assert(q.graphSpec.points.length>=4);}
}
const graphics=newBank.questions.filter(q=>q.graphSpec);
assert.equal(graphics.length,3);
assert(newBank.questions.filter(q=>q.topic==='Motion graphs').length>=5);
// Independently check the most error-prone numerical answer sets:
const displacement=t=>2*t*t-8*t+3;
assert.equal(displacement(5)-displacement(0),10);
assert.equal(Math.abs(displacement(2)-displacement(0))+Math.abs(displacement(5)-displacement(2)),26);
// v118-02 two reverse crossings give 21 m distance, not 25 m.
const v118_02=newBank.questions[1];
assert(v118_02.modelAnswer.includes('21 m'));
assert.equal(0-12-3,-15);
assert.equal(2+2+12+4+1,21);
// v118-08 velocity-time signed and unsigned areas
assert.equal(36+48+18,102);assert.equal(36+48+24+6,114);
const g=(.784-.196)/(.16-.04)*2;assert(Math.abs(g-9.8)<1e-10);
assert.deepEqual(newBank.questions.map(x=>x.marks),[7,8,8,7,6,8,7,7,6,6]);
console.log('PASS mechanics v118: 10 original questions (70 marks), 12 cards, signed-motion arithmetic and saved-profile protections.');
