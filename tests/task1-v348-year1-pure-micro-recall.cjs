'use strict';
// v348: short Year 1 Pure Maths mock recall from difficult Paper B/C topics.
// Uses the actual production flashcard evaluator; no invented pass criteria.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
const bank=JSON.parse(read('maths_first_mock_micro_recall_v348.json'));
const deck=JSON.parse(read('deck.json')).cards;
const app=read('app.js'),sw=read('sw.js');
assert.equal(bank.version,'v348');
assert.equal(deck.length,3345,'Original core cards and progress identities must remain untouched');
assert.equal(bank.cards.length,14);
assert.equal(new Set(bank.cards.map(c=>c.id)).size,14);
assert(bank.cards.every(c=>!deck.some(old=>old.id===c.id)),'New card IDs must not replace original cards');
const index=app.indexOf('const EXTRA_FLASHCARD_URLS=');
const tail=app.indexOf('// v287: exact-ID AQA',index);
assert(index>=0&&tail>index);
const urls=[...app.slice(index,tail).matchAll(/'\.\/([^']+)'/g)].map(m=>m[1]);
assert.equal(urls.length,57,'Append-only flashcard supplement ordering changed');
assert.equal(urls[56],'maths_first_mock_micro_recall_v348.json','New bank must be last');
assert(app.includes('}else if(index===56){'),'v348 first-mock loader guard missing');
assert(app.includes("c.courseTopic!=='Year 1 Pure'"),'Strict Year 1 mock-only guard missing');
assert(sw.includes('v348-maths-first-mock-short-recall'),'New service worker cache version missing');
assert(sw.includes("'./maths_first_mock_micro_recall_v348.json'"),'New bank must be available offline');
const begin=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',begin);
assert(begin>0&&end>begin);
const evaluate=new Function('window',app.slice(begin,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const mockFirst=app.indexOf('const MOCK_MATHS_YEAR2_EXCLUDED_IDS=');
const mockEnd=app.indexOf('function startMockSession(){',mockFirst);
assert(mockFirst>0&&mockEnd>mockFirst);
const eligible=new Function(app.slice(mockFirst,mockEnd)+'\nreturn mockEligibleCard;')();
let good=0,wrong=0;
for(const [i,c] of bank.cards.entries()){
 assert.equal(c.id,'task1_v348_math_'+String(i+1).padStart(2,'0'));
 assert(c.subject==='Maths'&&c.stage==='AS'&&c.courseTopic==='Year 1 Pure');
 assert(c.mock===true&&c.taught===true&&c.scope==='mock'&&c.active===true);
 assert(c.kind==='short'&&c.strictRecall===true);
 assert(['3.2','3.3','3.6','3.7','3.8','3.11'].includes(c.specRef));
 assert(c.front.length<=145&&c.back.length<=130,'No lengthy exam questions disguised as flashcards');
 assert(eligible(c),'First school mock must select this card');
 assert(Array.isArray(c.accept)&&c.accept.length>=3);
 assert(Array.isArray(c.reject)&&c.reject.length>=3);
 assert.equal(evaluate(c,c.back).status,'correct','Model rejected: '+c.id);
 for(const answer of c.accept){
  assert.equal(evaluate(c,answer).status,'correct','Correct paraphrase rejected: '+c.id+' / '+answer);
  good++;
 }
 for(const answer of c.reject){
  const result=evaluate(c,answer);
  assert.equal(result.status,'wrong','Incorrect answer credited: '+c.id+' / '+answer);
  assert.equal(result.score,0,'Incorrect answer gained marks: '+c.id+' / '+answer);
  wrong++;
 }
}
assert(good>=42&&wrong>=42);
console.log('PASS v348: 14 short first-mock Year 1 Pure cards, '+good+
 ' accepted alternatives, '+wrong+' wrong answers rejected, all original 3345 IDs intact.');
