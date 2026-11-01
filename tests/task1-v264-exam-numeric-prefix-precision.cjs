'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const source=fs.readFileSync('app.js','utf8');
const start=source.indexOf('function parseNumber('),end=source.indexOf('function ',source.indexOf('function numericMatch(q,answer)')+23);
assert(start>0&&end>start);
const mark=new Function(source.slice(start,end)+'\nreturn numericMatch;')();
const q=(number,unit)=>({answerType:'numeric',numericAnswer:number,unit});
const positives=[
 [q(8,'m'),'8 m.'],[q(8,'m'),'8 metres'],[q(8,'m'),'800 cm.'],
 [q(.008,'J'),'8 mJ'],[q(.008,'J'),'8 mJ.'],[q(.008,'J'),'8 mJ (3 s.f.)'],
 [q(.008,'J'),'0.000000008 MJ'],[q(8e6,'J'),'8 MJ'],
 [q(8,'mJ'),'8 mJ'],[q(8,'MJ'),'8 MJ'],
 [q(.008,'W'),'8 mW'],[q(.008,'W'),'8 mW.'],
 [q(.008,'W'),'0.000000008 MW'],[q(8e6,'W'),'8 MW'],
 [q(8,'mW'),'8 mW'],[q(8,'MW'),'8 MW'],
 [q(8,'kg'),'8000 g'],[q(8,'m'),'8.0 m'],
 [q(40,'Hz'),'40 Hz'],[q(120,'J'),'0.12 kJ'],
 [q(4,'m'),'4'],[q(0,'m'),'0 m']
];
const negatives=[
 [q(8,'m'),'8 cm.'],[q(8,'m'),'8 mm!'],[q(8,'m'),'8 cm'],
 [q(8,'m'),'8 s.'],[q(8,'m'),'8 kg'],[q(8,'m'),'800 mJ'],
 [q(.008,'J'),'8 MJ'],[q(.008,'J'),'8 MJ.'],
 [q(.008,'J'),'8 J'],[q(.008,'J'),'8 mW'],
 [q(8e6,'J'),'8 mJ'],[q(8,'mJ'),'8 MJ'],
 [q(8,'MJ'),'8 mJ'],[q(8,'MJ'),'8 J'],
 [q(.008,'W'),'8 MW'],[q(.008,'W'),'8 MW.'],
 [q(.008,'W'),'8 W'],[q(8e6,'W'),'8 mW'],
 [q(8,'mW'),'8 MW'],[q(8,'MW'),'8 mW'],
 [q(8,'kg'),'8 g'],[q(8,'kg'),'8000 mg'],
 [q(120,'J'),'0.12 mJ'],[q(0,'m'),'0.001 m']
];
for(const [question,input] of positives)assert.equal(mark(question,input),true,'Correct unit equivalence rejected: '+JSON.stringify({question,input}));
for(const [question,input] of negatives)assert.equal(mark(question,input),false,'Incorrect unit equivalence credited: '+JSON.stringify({question,input}));
// Keep the existing flashcard and saved-progress logic unmodified.
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(source.includes(key));
assert.equal(JSON.parse(fs.readFileSync('deck.json','utf8')).cards.length,3345);
console.log('PASS v264: '+positives.length+' correct exam-number unit cases, '+negatives.length+' incorrect cases; SI mega/milli and terminal punctuation guarded.');
