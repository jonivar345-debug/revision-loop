'use strict';
// Historical release evidence remains immutable. The ledger-approved wording
// corrections from v154 and single-recall rewrites from v172 are the only
// differences allowed when comparing earlier audit snapshots with live cards.
const v154=require('../editorial/task1-v154-mock-aqa-terminology-audit.json');
const v172=require('../editorial/task1-v172-science-mock-review.json');
const corrections=new Map(v154.changes.editedCards.map(row=>[row.id,row]));
const shortCards=new Map(v172.edited.map(row=>[row.id,row]));
module.exports=function expectedAfterReviewedEdits(id,field,historical){
 const latest=shortCards.get(id);
 if(latest&&field==='front')return latest.newFront;
 if(latest&&field==='back')return latest.newBack;
 const prior=corrections.get(id);
 return prior&&Object.prototype.hasOwnProperty.call(prior,field)?prior[field]:historical;
};
