'use strict';
module.exports=function projectV162ExamBank(bank) {
 if(bank.bankVersion<69)return bank;
 bank.questions=bank.questions.filter(q=>!q.id.startsWith('mock_v163_'));
 bank.bankVersion=68;
 return bank;
};
