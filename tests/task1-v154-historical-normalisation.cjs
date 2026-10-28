'use strict';
const patch=require('../editorial/task1-v154-mock-precision.json');
const normPairs=[
 ['C=O π bonding','electrons in the C=O bond'],
 ['C=O π electrons','electrons in the C=O bond'],
 ['C=O π bond','C=O bond'],
 ['C=C π electrons','electrons in the C=C bond'],
 ['C=C π bond','C=C bond'],
 ['delocalised π electron system','delocalised electron system'],
 ['delocalised π system','delocalised electron system'],
 ['aromatic π system','delocalised aromatic electron system'],
 ['ring π system',"ring's delocalised electron system"],
 ['six π electrons','six delocalised electrons'],
 ['Benzene π electrons',"Benzene's delocalised electrons"],
 ['π electrons in benzene','delocalised electrons in benzene'],
 ['π electrons','electrons in the double bond'],
 ['π bond','C=C double bond'],
 ['π bonding','double-bond electrons'],
 ['π-electron pair','bonding electron pair'],
 ['π system','delocalised electron system']
];
function expectedQuestionText(s){
 if(typeof s!=='string')return s;
 let t=s;
 for(const [oldText,newText] of normPairs)t=t.split(oldText).join(newText);
 return t.replaceAll('C=C is an electron-rich C=C double bond','C=C is an electron-rich double bond').replaceAll('delocalised delocalised','delocalised').replaceAll('C=C C=C double bond','C=C double bond');
}
function expectedQuestionPoints(points){return points.map(expectedQuestionText)}
function expectedCardField(id,field,oldValue){return patch.corrections.aqaBondWording[id]?.[field]??oldValue}
function expectedCardMock(id,oldValue){
 const scope=patch.corrections.mockScope;
 return [...scope.physicsYear2,...scope.chemistryBufferOutsideMock,...scope.mathsA2Pure].includes(id)?false:oldValue;
}
module.exports={expectedQuestionText,expectedQuestionPoints,expectedCardField,expectedCardMock};
