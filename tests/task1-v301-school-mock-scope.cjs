'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const urls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
const begin=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));'),end=app.indexOf(' const added=[',begin);
assert(begin>=0&&end>begin);
const all=new Function('cards','extraFlashBanks',app.slice(begin,end)+'\nreturn cards;')([...j('deck.json').cards],urls.map(j));
const a=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),b=app.indexOf('function startMockSession(){',a);
const mockEligibleCard=new Function(app.slice(a,b)+'\nreturn mockEligibleCard;')();
const eligible=all.filter(mockEligibleCard);
assert.equal(all.length,4313);assert.equal(eligible.length,3341);
const physics=eligible.filter(c=>c.subject==='Physics'),chem=eligible.filter(c=>c.subject==='Chemistry'),maths=eligible.filter(c=>c.subject==='Maths');
assert.equal(physics.length,1100);assert.equal(chem.length,1910);assert.equal(maths.length,331);
const survey=[
 ['Physics A2 stage leaks',physics.filter(c=>c.stage==='A2')],
 ['Maths non-AS leaks',maths.filter(c=>c.stage!=='AS')],
 ['Maths applied topic labels',maths.filter(c=>/^(statistics|mechanics)$/i.test(String(c.topic||'')))],
 ['Maths radi[a]ns mentioned in card',maths.filter(c=>/radians?|\bπ\b/i.test(c.front+' '+c.back+' '+c.topic))],
 ['Maths Year2-only composite or inverse',maths.filter(c=>/composite function|inverse function|f\s*\(\s*g\s*\(/i.test(c.front+' '+c.topic))],
 ['Chemistry buffers (school excluded)',chem.filter(c=>/\bbuffers?\b/i.test(c.front+' '+c.back+' '+c.topic+' '+c.revisionTopic))],
 ['Chemistry A2 without taught flag',chem.filter(c=>c.stage==='A2'&&c.taught!==true)],
 ['Physics missing AS stage',physics.filter(c=>c.stage!=='AS')]
];
const result={version:'v301',scope:'Mock selection boundary diagnostic for user school mocks',all:all.length,eligible:eligible.length,subjectCounts:{Physics:physics.length,Chemistry:chem.length,Maths:maths.length},potentialLeaks:survey.map(([test,cards])=>({test,count:cards.length,examples:cards.slice(0,30).map(c=>({id:c.id,topic:c.topic,stage:c.stage,front:c.front}))})),notes:['Manual review required: a card can mention excluded terminology in a comparison without actually teaching that topic.','Maths first mock is Year 1 Pure, not Mechanics, Statistics, radians or Year 2; Chemistry buffers are outside the stated mock; Physics is AS mock.','The audit uses exactly the website mockEligibleCard and actual supplemental loader, not just source bank flags.']};
console.log('V301_SCOPE_JSON_BEGIN');
console.log(JSON.stringify(result,null,2));
console.log('V301_SCOPE_JSON_END');
assert.equal(survey[0][1].length,0,'Do not leak Physics A2 into AS mock');
assert.equal(survey[1][1].length,0,'Only Maths AS in first mock');
assert.equal(survey[2][1].length,0,'Do not leak Maths applied topics');
console.log('PASS v301 scope boundary survey, manual follow-up indicated by report');
