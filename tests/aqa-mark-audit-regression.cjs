/* AQA published mark-total audits, October 2026:
   2016 AS Chemistry paper 7404/1, 2019 AS Physics paper 7407/1.
   This verifies original mark totals, not automatic equality of the whole
   in-app adaptation with the AQA paper or examiner standards. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const q=read('exam_questions.json').questions,registry=read('original_mark_audit_2026_10_21.json');
const map=new Map(q.map(x=>[x.id,x]));
const chemistry={
 '1_1':2,'1_2':1,'1_3':1,'2_1':2,'2_2':1,'3_1':3,'3_2':3,'3_3':2,
 '3_4':6,'4_1':5,'5_1':3,'5_2':3,'6_1':3,'6_2':1,'6_3':2,'6_4':2,'6_5':4
};
const physics={
 aqa_phy_as19_p1_q1_1:2,aqa_phy_as19_p1_q1_2:1,aqa_phy_as19_p1_q1_3:3,
 aqa_phy_as19_p1_q2_1:3,verified2019_P_2_2:2,verified2019_P_3_1:4,
 verified2019_P_3_2:2,verified2019_P_3_3:4,verified2019_P_4_1:2,
 verified2019_P_4_2:3,verified2019_P_4_3:1,verified2019_P_4_6:2,
 verified2019_P_5_2:2,verified2019_P_6_4:3
};
const chem2019={
 '1_1':2,'1_2':2,'1_3':2,'1_4':4,'2_1':3,'2_4':5,'3_4':1,'3_5':1,'3_6':1,
 '5_1':2,'5_2':1,'5_3':4,'6_2':1,'6_3':1,'6_4':1,'7_1':2,'7_2':4,'8_1':3
};
const expected=new Map([...Object.entries(chemistry).map(([suffix,n])=>['aqa_chem_as16_p1_q'+suffix,{n,source:'AQA-74041-W-MS-JUN16.PDF'}]),
 ...Object.entries(chem2019).map(([suffix,n])=>['verified2019_C_'+suffix,{n,source:'AQA-74041-W-MS-JUN19.PDF'}]),
 ...Object.entries(physics).map(([id,n])=>[id,{n,source:'AQA-74071-W-MS-JUN19.PDF'}])]);
let tests=0;
assert.equal(expected.size,49);tests++;
for(const [id,{n,source}] of expected){
 const v=map.get(id);
 assert(v,'Missing original paper question '+id);tests++;
 assert.equal(v.marks,n,'AQA original mark mismatch '+id);tests++;
 assert.equal(v.originalMarkVerified,true,'Unverified source '+id);tests++;
 assert.equal(v.originalMarkVerifiedSource,source,'Wrong official scheme '+id);tests++;
 assert(v.msUrl,'No original source link '+id);tests++;
}
assert.equal(registry.counts.independentlyOriginalMarkChecked,231);tests++;
assert.equal(registry.counts.awaitingOriginalMarkCheck,0);tests++;
const chemistry2018Titre=map.get('aqa_2018_C_2_3');
assert(chemistry2018Titre,'2018 AQA AS Chemistry titration missing');tests++;
assert.equal(chemistry2018Titre.markingMode,'concordantTitres2018');tests++;
assert(chemistry2018Titre.tolerance<=0.01,'Concordance tolerance is excessively broad');tests++;

assert.equal(registry.completedBatches[0].questionPartsChecked,17);tests++;
assert.equal(registry.completedBatches[1].questionPartsChecked,14);tests++;
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const scorer=new Function('function clamp(x,a,b){return Math.max(a,Math.min(b,x))};'+
 app.slice(app.indexOf('function normalise('),app.indexOf('function nextSchedule('))+
 app.slice(app.indexOf('function evidenceRuleScore('),app.indexOf('function renderExam(',app.indexOf('function evidenceRuleScore(')))+
 'return examSuggested')();
for(const [reply,expectedMarks] of [
 ['23.90 and 24.00; mean 23.95 cm3',2],
 ['23.90, 24.00',1],
 ['23.95',1],
 ['23.90, 23.70, 24.00; mean 23.86',1],
 ['23.86',0],
 ['23.80',0],
 ['23.70 and 24.00; mean 23.85',0]
]){
 assert.equal(scorer(chemistry2018Titre,reply).suggested,expectedMarks,
  'AS 2018 Chemistry Q2.3 invalid concordance/mean credit: '+reply);tests++;
}
for(const [id] of expected){
 const v=map.get(id),result=scorer(v,v.modelAnswer);
 assert.equal(result.suggested,v.marks,'Stored model answer under-credited '+id);tests++;
}
const mark=(id,response,expectedMark)=>{
 const v=map.get(id),result=scorer(v,response);
 assert.equal(result.suggested,expectedMark,id+' score '+result.suggested+' for '+response);tests++;
};
mark('aqa_chem_as16_p1_q3_3','Use more dilute HCl.',1);
mark('aqa_chem_as16_p1_q3_3','A bigger titre reduces percentage uncertainty.',0);
mark('aqa_chem_as16_p1_q3_3','Use more dilute HCl so the titre increases and uncertainty becomes a smaller percentage.',2);
mark('verified2019_P_2_2','0.91',1);
mark('verified2019_P_2_2','L=RA/rho; L=0.91 m and 0.85 m is too short to provide the required 3.7 ohm resistance.',2);
mark('verified2019_P_4_2','2.26e8',1);
mark('verified2019_P_4_2','n=c/v, so v=c/n=(3.00 × 10⁸)/1.33=2.26 × 10⁸ m/s',3);
mark('verified2019_P_4_2','n=c/v',1);
mark('verified2019_C_2_4','69',1);
mark('verified2019_C_8_1','No visible change with NaCl and a white precipitate with BaCl2.',0);
mark('verified2019_C_8_1','Aqueous sodium sulfate gives no visible change with NaCl but forms a white precipitate with BaCl2.',3);
assert.equal(map.get('verified2019_C_2_4').answerType,'points');tests++;
assert.equal(map.get('verified2019_C_2_4').requiresWorking,true);tests++;
assert.equal(map.get('aqa_chem_as16_p1_q3_4').markSchemeType,'level-of-response');tests++;
assert.equal(map.get('aqa_chem_as16_p1_q6_5').requiresWorking,true);tests++;
assert.equal(map.get('verified2019_P_2_2').requiresWorking,true);tests++;
assert.equal(map.get('verified2019_P_4_2').requiresWorking,true);tests++;
assert(app.includes("enforceMarkDependencies(q,res.preds.map"),'Photo markings bypass conditional credit');tests++;
console.log('PASS '+tests+' source-verified AQA marks, calculation methods, dependencies and alternate phrasings');
