/* AQA 7408 / 7405 / 7356-7357 school revision: conservative first-pass
   flashcard recall prioritisation. Booklet distinction is NOT inferred from
   a card merely containing "=": many Physics and Maths equations are printed.
   This pure helper changes no saved IDs, review data, answers or grades.
   Source references: AQA-7408-SDB, AQA-AS-A-MATHS-FORMULAE,
   AQA 7357 Appendix B, AQA 7405 Periodic Table/Data Booklet. */
(function(root,factory){
 'use strict';
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.RevisionFlashPriority=api;
})(typeof window==='object'?window:null,function(){
 'use strict';
 const subjects=new Set(['Physics','Chemistry','Maths']);
 const DEFINITION=Object.freeze({kind:'definition',label:'Key definition'});
 const EQUATION=Object.freeze({kind:'equation',label:'Equation to memorise'});
 function isDefinitionPrompt(front){
  if(/^(?:define|give (?:a |the )?definition of|state (?:the )?(?:complete )?definition of|what (?:is|are) meant by|what (?:does|do) .{2,85} mean\b)/i.test(front))return true;
  if(/^state (?:newton'?s |hess'?s |le chatelier'?s |the )?.{0,65}\b(?:law|principle|postulate)\b/i.test(front))return true;
  if(/^what is the meaning of (?:the )?(?:decay constant|mass defect|back emf)\b/i.test(front))return true;
  if(/^state the first.principles definition of f[′']\(x\)/i.test(front))return true;
  // "What is a lepton?" is a definition; "What is the gradient of..." is not.
  if(/^what (?:is|are) an? [^?]{2,80}\?$/i.test(front)
    && !/\b(?:if|when|where|given|after|before|with|from|on a graph|used to|looking for|safety|precaution|reliable way|best way|resistance|value|amount|key)\b/i.test(front)
    && !/[’']s\b/.test(front))return true;
  return false;
 }
 function hasSymbolicAnswer(back){
  return /[=∝⇌→]|(?:^|\s)(?:d\/dx|dy\/dx|∫|log|ln)\b|(?:e\^|x\^|eˣ|xⁿ|√|π|\b(?:sin|cos|tan)\b|\bproportional to\b)/i.test(back);
 }
 function equationPrompt(front){
  // Asking about a method *using* an equation does not make that answer a
  // memorised equation. Keep 'What is the route to an empirical formula?'
  // and 'If 2 mol react per equation...' in ordinary practice.
  const direct=/^what (?:formula|equation|expression|relationship)\b/i.test(front);
  const explicit=/^(?:what is|what's|write|state|give|show|which|express|provide|recall)\b.{0,135}\b(?:formula|equation|expression|relationship)\b/i.test(front);
  return (direct||explicit)&&
   !/\b(?:route from|route to|if the formula is forgotten|checking a formula)\b/i.test(front);
 }
 // These Physics relationships do not appear as stated in the AQA 7408
 // booklet. In contrast F=ma, P=VI, v=fλ, SUVAT, pV=nRT,
 // Young fringe spacing and SHM equations ARE printed.
 const PHYSICS_MISSING=/\b(?:percent(?:age)? (?:absolute )?uncertaint(?:y|ies)|fractional uncertainty|phase difference (?:from|for|in terms of|between)|path difference (?:in terms of|and phase)|(?:potential|voltage) divider (?:formula|equation|ratio|expression)|(?:output|input) potential divider|intensity (?:and|to|versus|vs\.?|with) (?:wave )?amplitude|amplitude (?:and|to|versus|vs\.?|with) intensity)\b/i;
 // AQA Mathematics MFB8 prints arithmetic/geometric sums, binomial
 // series, addition formulae, and selected Year-13 derivatives/rules.
 // Do not label those as missing, even when they're important to use.
 const MATHS_MISSING=/\b(?:quadratic formula|sine rule|cosine rule|(?:area of (?:a )?triangle|triangle area) (?:formula|using sine)|circle (?:equation|formula)|equation of (?:a |the )?circle|(?:midpoint|gradient|slope) (?:formula|of (?:a )?(?:straight )?line)|point[- ]slope (?:equation|formula)|vector equation of (?:a |the )?line|(?:area )?formula using two sides|(?:the )?(?:power|index) (?:rule for|rule of) (?:differentiation|integration)|(?:differentiat(?:e|ion)|derivative|integrat(?:e|ion)|integral) (?:of )?(?:a?x\^?[n0-9]|xⁿ|e\^|eˣ|ln ?x|sin ?x|cos ?x)|(?:trigonometric|pythagorean) identit(?:y|ies))\b/i;
 const MATHS_PRINTED=/\b(?:arithmetic (?:series|sum)|geometric (?:series|sum)|binomial (?:series|expansion)|small.angle|(?:sin|cos|tan)\s*\(\s*[a-z]\s*[+−-]|(?:derivative|differentiat(?:e|ion)) of (?:tan|sec|cosec|cot)|quotient rule|integration by parts|newton.raphson|trapezium rule)\b/i;
 function classify(card){
  if(!card||card.paper2Training===true||card.active===false||!subjects.has(card.subject))return null;
  const front=String(card.front||'').trim(),back=String(card.back||'').trim();
  if(!front||!back)return null;
  if(card.subject==='Maths'&&/\bfirst.principles (?:definition|formula) of f[′']\(x\)|\bfirst.principles definition of f[′']\(x\)/i.test(front))return null;
  if(card.memoryPriority==='definition')return DEFINITION;
  if(card.subject==='Maths'&&/^(?:state|give|write) (?:the )?(?:index|logarithm|log)(?: (?:product|quotient|power|change.of.base))? law\b/i.test(front)&&/[=^]|\blog\b/i.test(back))return EQUATION;
  if(isDefinitionPrompt(front))return DEFINITION;
  // Even if a sheet provides an equation, a definition using quantities
  // may still be key; only suppress equation tagging for provided entries.
  if(card.formulaBooklet==='provided'||card.memoryPriority==='provided')return null;
  if(card.memoryPriority==='unprovided-equation')return EQUATION;
  if(!hasSymbolicAnswer(back))return null;
  if(card.subject==='Chemistry'){
   // AQA Chemistry's Periodic Table/Data Booklet does not list equations.
   // Be specific: card must directly ask for an equation/formula.
   return equationPrompt(front)?EQUATION:null;
  }
  if(card.subject==='Physics'){
   return PHYSICS_MISSING.test(front)?EQUATION:null;
  }
  if(MATHS_PRINTED.test(front))return null;
  // Memorised standard derivatives/integrals are required by AQA Appendix B
  // but are not printed in MFB8. Example: derivative of e^(kx).
  const baseCalculus=/^(?:what is|state|give) (?:the )?(?:derivative|integral|differentiation rule|integration rule) (?:of|for) .{0,50}(?:e\^|eˣ|x\^|xⁿ|\bsin\b|\bcos\b|\bln\b)/i.test(front);
  // The first-principles formula is printed in MFB8; do not call it missing.
  return MATHS_MISSING.test(front)||baseCalculus?EQUATION:null;
 }
 function isMustKnow(card){return !!classify(card);}
 function group(cards,needsAttention){
  const first=[],later=[];
  for(const card of cards){
   if(isMustKnow(card)&&(!needsAttention||needsAttention(card)))first.push(card);
   else later.push(card);
  }
  return {first,later};
 }
 return Object.freeze({classify,isMustKnow,group});
});
