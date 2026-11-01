'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),j=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const app=fs.readFileSync('app.js','utf8');
const urls=[...app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/)[1].matchAll(/'\.\/([^']+\.json)'/g)].map(x=>x[1]);
const target=j('mock_short_recall_and_cloze_v298.json').cards;
const prev=[...j('deck.json').cards,...urls.filter(x=>x!=='mock_short_recall_and_cloze_v298.json').flatMap(x=>j(x).cards||[])];
const stop=new Set('a an and are as at be by can do does for from give gives has have how if in is it its of on or out the their this to what when where which why will with you your then these does into from whose same about one two three find calculate state shown'.split(' '));
const words=t=>new Set(String(t||'').toLowerCase().normalize('NFKD').replace(/[−–—]/g,'-').replace(/[^\p{L}\p{N}^+\-]+/gu,' ').split(/\s+/).filter(w=>w.length>1&&!stop.has(w)));
const index=new Map();
for(const p of prev){if(!['Physics','Chemistry','Maths'].includes(p.subject))continue;
 const arr=index.get(p.subject)||[];arr.push({id:p.id,front:p.front,topic:p.topic,words:words(p.front)});index.set(p.subject,arr);
}
const pairs=[];let repeated=0;
for(const c of target){const token=words(c.front),results=[];
 for(const p of index.get(c.subject)||[]){const i=[...token].filter(t=>p.words.has(t)).length,union=new Set([...token,...p.words]).size;
  const similarity=union?i/union:0;
  if(similarity>=.48)results.push({score:+similarity.toFixed(3),previousId:p.id,previousFront:p.front});
 }
 results.sort((a,b)=>b.score-a.score);
 if(results[0]?.score>=.55){pairs.push({newId:c.id,subject:c.subject,front:c.front,topic:c.topic,matches:results.slice(0,3)});if(results[0].score===1)repeated++;}
}
const report={newCount:target.length,oldCount:prev.length,possibleSimilar:pairs.length,exactTokenOverlap:repeated,examples:pairs.sort((a,b)=>b.matches[0].score-a.matches[0].score).slice(0,75)};
console.log('V299_SEMANTIC_OVERLAP_BEGIN');
console.log(JSON.stringify(report,null,2));
console.log('V299_SEMANTIC_OVERLAP_END');
assert.equal(prev.length,4216,'Prior flashcards preserved');
assert.equal(target.length,97,'New flashcards preserved');
console.log('PASS v299 informational near-repeat audit; matching topics require human judgement before removal or replacement');
