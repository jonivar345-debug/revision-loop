'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const deck=j('deck.json'),cards=deck.cards.filter(c=>c.subject==='Physics'&&!String(c.specRef||'').trim()&&c.stage==='AS'&&c.mock===true);
const key=c=>[String(c.courseTopic||''),String(c.topic||'')].join(' / ');
const matches=c=>/electricity|electric current|potential dividers?|internal resistance|\bemf\b|resistivity|circuit|ohm.?s law|thermistor|charge and current|current.?voltage|voltage|p.?d\b/i.test(key(c));
const selected=cards.filter(matches),groups=new Map();
for(const c of selected){const t=String(c.topic||'untagged');if(!groups.has(t))groups.set(t,[]);groups.get(t).push(c)}
const sorted=[...groups.entries()].sort((a,b)=>b[1].length-a[1].length).map(([topic,rows])=>({topic,count:rows.length,cards:rows.map(c=>({id:c.id,front:c.front,back:c.back,courseTopic:c.courseTopic,stage:c.stage,mock:c.mock,taught:c.taught,existingSpecRef:c.specRef||null}))}));
const report={version:'v290',date:'2026-11-01',totalUntypedPhysicsASMockCards:cards.length,selectedElectricityCards:selected.length,groups:sorted,officialAQA:'https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content/electricity',subsections:['3.5.1.1','3.5.1.2','3.5.1.3','3.5.1.4','3.5.1.5','3.5.1.6'],note:'Candidate matching includes topic and courseTopic; individual cards must be reviewed before exact AQA subsection mapping'};
assert.equal(deck.cards.length,3345);
console.log('AUDIT_V290_JSON_BEGIN');console.log(JSON.stringify(report,null,2));console.log('AUDIT_V290_JSON_END');
console.log('PASS v290: reviewed candidate Physics AS Electricity mock core cards enumerated, no content or progress mutations.');
