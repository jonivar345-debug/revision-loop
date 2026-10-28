'use strict';
// Historical audit evidence is immutable. Only the explicitly recorded v154
// AQA terminology corrections are permitted to differ from release snapshots.
// The v154 regression separately verifies the complete exact before/after list.
const ledger=require('../editorial/task1-v154-mock-aqa-terminology-audit.json');
const edited=new Map(ledger.changes.editedCards.map(row=>[row.id,row]));
module.exports=function expectedAfterV154(id,field,historical){
 const e=edited.get(id);
 return e&&Object.prototype.hasOwnProperty.call(e,field)?e[field]:historical;
};
