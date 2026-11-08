'use strict';
// Probe the REAL evaluateCard implementation on all 61 supplementary source
// banks, rather than trusting metadata alone. Read-only source candidate audit.
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=f=>fs.readFileSync(f,'utf8'),json=f=>JSON.parse(read(f));
const app=read('app.js');
const start=app.indexOf('function normalise('),end=app.indexOf('function rateCard(',start);
assert(start>0&&end>start,'Live flashcard evaluator moved; update harness explicitly');
const source=app.slice(start,end);
assert(source.includes('function evaluateCard(c,input){'));
const evaluator=new Function('window',source+'\nreturn evaluateCard;')({
 RevisionPhotoelectricCardMarking:{TARGET_ID:'not-a-supplemental-target',evaluate:()=>null}
});
const manifest=app.match(/const EXTRA_FLASHCARD_URLS=\[([^\]]+)\];/);
assert(manifest,'Missing 56-bank flashcard source list');
const historical=[...manifest[1].matchAll(/'\.\/([^']+\.json)'/g)].map(m=>m[1]);
assert.equal(historical.length,56);
const focused=[
 'maths_first_mock_micro_recall_v348.json',
 'chemistry_cracking_pressure_recall_v354.json',
 'chemistry_alkane_trend_recall_v367.json',
 'physics_light_history_recall_v370.json',
 'chemistry_kp_catalyst_recall_v375.json'
];
const paths=[...focused,...historical];
const raw=paths.flatMap(path=>{
 assert(fs.existsSync(path),'Source missing '+path);
 return (json(path).cards||[]).map(c=>({...c,__auditSource:path}));
});
assert.equal(raw.length,1018,'Supplementary source inventory has changed');
const seen=new Set(),eligible=raw.filter(c=>{
 if(!c||c.mock!==true||c.active===false||c.taught===false)return false;
 if(seen.has(c.id))return false;
 seen.add(c.id);
 return true;
});
const results={raw:raw.length,candidates:eligible.length,totalProbes:0,
 backCorrect:0,acceptCorrect:0,acceptAttempted:0,denialCredited:[],
 rejectCredited:[],echoCredited:[],blankCredited:[],nonanswerCredited:[],
 modelNotCorrect:[],acceptNotCorrect:[],evaluatorErrors:[],
 bySubject:{Physics:{count:0,probes:0},Chemistry:{count:0,probes:0},Maths:{count:0,probes:0}},
 limitations:[
 'This checks first-mock raw supplementary source candidates and the current evaluateCard function, not each loader-index acceptance rule.',
 'A denied model-answer sentence should not earn full credit, but a partial score can still require examiner review for complex examples.',
 'Correct answers or accepted variants may use alternate valid notation outside curated examples; this is a regression probe, not a claim of a complete formal proof of marking.',
 'No handwritten answers, graphs or practical methods are marked.'
 ]};
const check=(card,kind,input)=> {
 results.totalProbes++;
 results.bySubject[card.subject].probes++;
 try{
  const r=evaluator(card,input);
  if(!r||!['correct','partial','wrong','neutral'].includes(r.status))
   throw Error('Unexpected flashcard evaluator result');
  if(kind==='model'){
   if(r.status==='correct')results.backCorrect++;
   else results.modelNotCorrect.push({id:card.id,source:card.__auditSource,front:card.front,
     back:card.back,result:r.status,score:r.score});
  }else if(kind==='accepted'){
   results.acceptAttempted++;
   if(r.status==='correct')results.acceptCorrect++;
   else results.acceptNotCorrect.push({id:card.id,source:card.__auditSource,input,
     status:r.status,score:r.score});
  }else if(kind==='denial'||kind==='reject'||kind==='echo'||kind==='blank'||kind==='nonanswer'){
   if(r.status==='correct'){
    const prop={
     denial:'denialCredited',reject:'rejectCredited',echo:'echoCredited',
     blank:'blankCredited',nonanswer:'nonanswerCredited'
    }[kind];
    results[prop].push({id:card.id,source:card.__auditSource,input,
      status:r.status,score:r.score});
   }
  }
 }catch(e){results.evaluatorErrors.push({id:card.id,source:card.__auditSource,kind,error:String(e).slice(0,190)})}
};
for(const c of eligible){
 if(!['Physics','Chemistry','Maths'].includes(c.subject))continue;
 results.bySubject[c.subject].count++;
 check(c,'model',c.back);
 check(c,'blank','');
 check(c,'nonanswer','I do not know');
 check(c,'echo',c.front);
 const clean=String(c.back||'').trim();
 if(clean){
  check(c,'denial','not '+clean);
  check(c,'denial','The correct answer is not '+clean);
  check(c,'denial','The statement "'+clean+'" is wrong.');
 }
 const rejects=Array.isArray(c.reject)?c.reject.slice(0,3):[];
 for(const bad of rejects)if(String(bad||'').trim())check(c,'reject',bad);
 const accepts=Array.isArray(c.accept)?c.accept.slice(0,3):[];
 for(const good of accepts)if(String(good||'').trim())check(c,'accepted',good);
}
assert.equal(results.candidates,1018);
assert.equal(Object.values(results.bySubject).reduce((s,x)=>s+x.count,0),1018);
const summary={
 run:'v421',readOnly:true,
 rawSources:paths.length,rawCards:results.raw,candidates:results.candidates,
 probes:results.totalProbes,
 modelAccepted:results.backCorrect,modelNonaccepted:results.modelNotCorrect.length,
 curatedAcceptedCorrect:results.acceptCorrect,
 curatedAcceptedAttempted:results.acceptAttempted,
 curatedAcceptedNoncorrect:results.acceptNotCorrect.length,
 deniedModelFullCredit:results.denialCredited.length,
 rejectedVariantFullCredit:results.rejectCredited.length,
 repeatedQuestionFullCredit:results.echoCredited.length,
 blankFullCredit:results.blankCredited.length,
 nonanswerFullCredit:results.nonanswerCredited.length,
 evaluatorErrors:results.evaluatorErrors.length,
 bySubject:results.bySubject,
 examples:Object.fromEntries([
  'modelNotCorrect','acceptNotCorrect','denialCredited','rejectCredited',
  'echoCredited','blankCredited','nonanswerCredited','evaluatorErrors'
 ].map(key=>[key,results[key].slice(0,80)])),
 limitations:results.limitations
};
assert.equal(results.backCorrect,1018,'A sourced model answer failed the live flashcard checker');
assert.equal(results.acceptNotCorrect.length,0,'A curated valid flashcard answer lost full credit');
assert.equal(results.rejectCredited.length,0,'An explicitly rejected flashcard variant was credited');
assert.equal(results.echoCredited.length,0,'A repeated question received full credit');
assert.equal(results.denialCredited.length,0,'An explicitly denied model answer received full credit');
assert.equal(results.evaluatorErrors.length,0,'Real flashcard evaluator threw an error');
assert.equal(results.blankCredited.length,0,'A blank answer receives full credit');
assert.equal(results.nonanswerCredited.length,0,'I do not know receives full credit');
console.log('PASS v421: full supplementary candidate evaluator executed; no blank/IDK full credit. Risk findings below require triage before claiming marker sign-off.');
console.log('V421_EVALUATOR_REPORT_START');
console.log(JSON.stringify(summary,null,2));
console.log('V421_EVALUATOR_REPORT_END');
