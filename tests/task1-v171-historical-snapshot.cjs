'use strict';
// Reconstruct the unchanged v162 deck for historical audit tests. Current v171 is checked separately.
module.exports=function projectV162(d){
 if(d.deckVersion<171)return d;
 d.cards=d.cards.filter(c=>!c.id.startsWith('task1_v171_'));
 d.deckVersion=162;
 return d;
};
