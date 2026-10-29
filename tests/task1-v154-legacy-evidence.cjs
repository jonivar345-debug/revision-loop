'use strict';
// Keep historical evidence immutable. Apply only explicitly reviewed corrections
// from v154, v172, v176, v177 and v178 when comparing old snapshots with current cards.
const v154=require('../editorial/task1-v154-mock-aqa-terminology-audit.json');
const v172=require('../editorial/task1-v172-science-mock-review.json');
const v176=require('../editorial/task1-v176-mechanics-manual-spec-audit.json');
const v177=require('../editorial/task1-v177-chemistry-legacy-tests-definitions.json');
const v178=require('../editorial/task1-v178-chemistry-core-definitions.json');
const corrections=new Map(v154.changes.editedCards.map(row=>[row.id,row]));
const shortCards=new Map(v172.edited.map(row=>[row.id,row]));
const preciseMechanics=new Map(v176.corrections.map(row=>[row.id,row]));
const preciseChemistry=new Map(v177.corrections.map(row=>[row.id,row]));
const refinedChemistry=new Map(v178.corrections.map(row=>[row.id,row]));
module.exports=function expectedAfterReviewedEdits(id,field,historical){
 const latestChem=refinedChemistry.get(id);
 if(latestChem&&field==='front')return latestChem.newFront;
 if(latestChem&&field==='back')return latestChem.newBack;
 const chemistry=preciseChemistry.get(id);
 if(chemistry&&field==='front')return chemistry.newFront;
 if(chemistry&&field==='back')return chemistry.newBack;
 const revised=preciseMechanics.get(id);
 if(revised&&field==='back')return revised.after;
 const latest=shortCards.get(id);
 if(latest&&field==='front')return latest.newFront;
 if(latest&&field==='back')return latest.newBack;
 const prior=corrections.get(id);
 return prior&&Object.prototype.hasOwnProperty.call(prior,field)?prior[field]:historical;
};
