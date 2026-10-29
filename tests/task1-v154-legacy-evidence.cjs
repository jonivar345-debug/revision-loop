'use strict';
// Keep historical evidence immutable. Apply only explicitly reviewed corrections
// from v154, v172 and v176 when comparing old snapshots with current cards.
const v154=require('../editorial/task1-v154-mock-aqa-terminology-audit.json');
const v172=require('../editorial/task1-v172-science-mock-review.json');
const v176=require('../editorial/task1-v176-mechanics-manual-spec-audit.json');
const corrections=new Map(v154.changes.editedCards.map(row=>[row.id,row]));
const shortCards=new Map(v172.edited.map(row=>[row.id,row]));
const preciseMechanics=new Map(v176.corrections.map(row=>[row.id,row]));
module.exports=function expectedAfterReviewedEdits(id,field,historical){
 const revised=preciseMechanics.get(id);
 if(revised&&field==='back')return revised.after;
 const latest=shortCards.get(id);
 if(latest&&field==='front')return latest.newFront;
 if(latest&&field==='back')return latest.newBack;
 const prior=corrections.get(id);
 return prior&&Object.prototype.hasOwnProperty.call(prior,field)?prior[field]:historical;
};
