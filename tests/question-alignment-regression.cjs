/* Numeric and provenance checks for Revision Loop questions. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const home=path.join(__dirname,'..'),read=p=>JSON.parse(fs.readFileSync(path.join(home,p),'utf8'));
const all=[...read('exam_questions.json').questions,...read('paper_supplement_2016_2017.json').questions];
const patch=read('exam_answer_corrections.json');
for(const q of all){if(patch.modelAnswers?.[q.id])q.modelAnswer=patch.modelAnswers[q.id];if(patch.questionCorrections?.[q.id])Object.assign(q,patch.questionCorrections[q.id]);}
let checks=0;const seen=new Set();
for(const q of all){
 assert(q.id&&!seen.has(q.id),'Duplicate or absent ID '+q.id);seen.add(q.id);checks++;
 assert(['Maths','Physics','Chemistry'].includes(q.subject),'Unknown subject '+q.id);checks++;
 assert(['AS','A-level'].includes(q.level),'Wrong level '+q.id);checks++;
 assert(q.prompt?.trim().length>=12,'Missing task '+q.id);checks++;
 assert(q.revisionTopic,'Missing topic '+q.id);checks++;
 assert(Array.isArray(q.markPoints)&&q.markPoints.every(x=>x.trim()),'Missing mark points '+q.id);checks++;
 assert(Array.isArray(q.markPointMarks)&&q.markPointMarks.length===q.markPoints.length,'Invalid weighting length '+q.id);checks++;
 assert.equal(q.markPointMarks.reduce((a,b)=>a+b,0),q.marks,'Wrong total '+q.id);checks++;
 if(q.answerType==='numeric'){assert(Number.isFinite(q.numericAnswer),'Missing numerical answer '+q.id);checks++;}
 if(q.year!=='Practice'){
  assert(Number.isInteger(q.year)&&q.year>=2015&&q.year<=2025,'Invalid year '+q.id);checks++;
  assert(q.qpUrl?.startsWith('https://')&&q.msUrl?.startsWith('https://'),'Unlinked paper '+q.id);checks++;
 }
 if(q.standalone===false){assert(q.sourceFirst===true,'Missing source-first gating '+q.id);checks++;}
}
const get=id=>{const q=all.find(x=>x.id===id);assert(q,'Missing '+id);return q;};
function near(x,y,tol,id){assert(Math.abs(x-y)<=tol,id+' gives '+x+' vs '+y);checks++;}
near((.040*.200-.02925*.100)/2*58.3/.200*100,get('aqa_chem_as23_p1_q2_6').numericAnswer,.06,'2023 back-titration');
near(.320/((101000*.000225)/(8.31*(450+273))*2/5),211.9,.8,'2023 Group 2 nitrate');
near(14.5-4**1.5,get('aqa_math_as23_p1_q5b').numericAnswer,1e-7,'2023 tangent');
near(Math.atan(Math.sqrt(5)/2)*180/Math.PI,48.2,.05,'2023 trig root');
near(1100**2/(120*150**3),get('aqa_2018_chemA_2_3').numericAnswer,1e-6,'2018 Kp');
near(4*211+6*189-4*193-5*205,get('aqa_2018_chemA_3_1').numericAnswer,1e-8,'2018 entropy');
near(-905-873*.181,get('aqa_2018_chemA_3_2').numericAnswer,.1,'2018 Gibbs');
near(210*570,get('aqa_phys_2016_74071_1_3_v45').numericAnswer,1,'2016 aircraft thrust');
near(190000/70000,get('aqa_phys_2016_74071_1_5_v45').numericAnswer,.02,'2016 aircraft deceleration');
near(68**2/(2*190000/70000),get('aqa_phys_2016_74071_1_6_v45').numericAnswer,5,'2016 aircraft stopping');
near(25/(2*.33*370)**2,get('aqa_2018_phyA_03_2').numericAnswer,.000001,'2018 violin string');
near((.02395*.05/3)*10*192000,get('aqa_2018_C_2_5').numericAnswer,2,'2018 citric acid');
const chem=get('aqa_chem_as23_p1_q3_1'),math=get('aqa_math_as24_p1_q4ai_src');
assert.equal(chem.markingMode,'anyN');checks++;
assert.equal(chem.markPoints.length,4);checks++;
assert.equal(math.markPoints.length,math.marks);checks++;
console.log('PASS '+checks+' question integrity and numerical-alignment checks across '+all.length+' entries');
