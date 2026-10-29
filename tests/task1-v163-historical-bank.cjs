'use strict';
module.exports=function projectV162ExamBank(bank) {
 if(bank.bankVersion<69)return bank;
 // The v188 correction must not rewrite historical v161/v162 audit snapshots.
 if(bank.bankVersion>=70){
  const old=bank.questions.find(q=>q.id==='orig_v31_maths_proof_2');
  if(old){old.level='AS';old.mock=true;}
 }
 bank.questions=bank.questions.filter(q=>!q.id.startsWith('mock_v163_'));
 bank.bankVersion=68;
 return bank;
};
