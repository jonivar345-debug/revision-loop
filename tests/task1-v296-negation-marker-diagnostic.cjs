'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const banks=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
const a=app.indexOf(' const knownFlashIds=new Set(cards.map(c=>c.id));');
const b=app.indexOf(' const added=[',a);assert(a>=0 && b>a);
const cards=new Function('cards','extraFlashBanks',app.slice(a,b)+'\nreturn cards;')([...j('deck.json').cards],banks.map(j));
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);
const evaluate=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const u=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS='),v=app.indexOf('function startMockSession(){',u);
const mockEligibleCard=new Function(app.slice(u,v)+'\nreturn mockEligibleCard;')();
const selected=cards.filter(mockEligibleCard);
const result={version:'v296',loaded:cards.length,eligible:selected.length,sampled:0,markedCorrect:0,markedPartial:0,markedWrong:0,bySubject:{},examples:[]};
for(const card of selected){
 const back=String(card.back||'').trim();
 if(back.length<5||back.length>120 || /^(?:no\b|not\b|never\b|none\b|false\b|0\b|does\s+not\b|cannot\b)/i.test(back))continue;
 const altered='Not '+back.replace(/[.!?]+$/,'');
 const out=evaluate(card,altered);
 result.sampled++;
 const sub=result.bySubject[card.subject]||(result.bySubject[card.subject]={sampled:0,correct:0,partial:0,wrong:0});
 sub.sampled++;
 if(out.status==='correct'){result.markedCorrect++;sub.correct++;}
 else if(out.status==='partial'){result.markedPartial++;sub.partial++;}
 else {result.markedWrong++;sub.wrong++;}
 if(result.examples.length<45 && out.status==='correct')result.examples.push({id:card.id,subject:card.subject,front:card.front,model:back,response:altered});
}
console.log('AUDIT_V296_JSON_BEGIN');
console.log(JSON.stringify(result,null,2));
console.log('AUDIT_V296_JSON_END');
assert(result.sampled>2000,'Expected large coverage of mock responses');
console.log('PASS v296 read-only mock explicit-negation grading diagnostic (does not assert that every response is equivalent to a real student answer)');
