/* Focused AQA photoelectric-effect marking for the threshold-frequency graph.
   No catch-all synonym expansion: irrelevant "zero energy" must not gain XP. */
(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.RevisionPhotoelectricCardMarking=api;
})(typeof window==='object'?window:null,function(){
  'use strict';
  const TARGET_ID='phy_spectra_photo_v32_below_threshold_graph';
  function evaluate(raw){
    const a=String(raw||'').trim().toLowerCase().replace(/[‐‑–—]/g,'-');
    if(!a)return {status:'neutral',score:0,text:'Model answer shown. Compare it honestly.',missing:[]};
    const noEmission=
      /\b(?:no|zero|without)\s+(?:(?:photo)?electrons?|emissions?|electrons?\s+(?:are\s+)?emitted)\b/.test(a)||
      /\b(?:(?:photo)?electrons?|emissions?)\b.{0,35}\b(?:not|never|cannot|can't|don'?t|doesn'?t|won'?t|aren'?t|isn'?t|none)\b/.test(a)||
      /\b(?:not|never|cannot|can't|don'?t|doesn'?t|won'?t|aren'?t|isn'?t)\b.{0,35}\b(?:emitted|emission|released|ejected|escape)\b/.test(a)||
      /\bno\s+(?:electron|photoelectron)\s+emission\b/.test(a);
    const insufficientPhotonEnergy=
      /\b(?:photons?|light|incident\s+light|hf)\b.{0,75}\b(?:not\s+enough|too\s+little|insufficient|less\s+than|below|lower\s+than)\b.{0,45}\b(?:energy|work\s+function|threshold)\b/.test(a)||
      /\b(?:energy|hf)\b.{0,35}\b(?:less\s+than|below|lower\s+than|<)\b.{0,30}\b(?:work\s+function|threshold|phi|φ)\b/.test(a)||
      /\b(?:frequency|f)\b.{0,25}\b(?:below|less\s+than|<)\b.{0,30}\b(?:threshold|f0|f₀)\b/.test(a)&&/\b(?:not\s+enough|insufficient|energy|work\s+function)\b/.test(a);
    const noGraphData=
      /\b(?:no|not|undefined|unmeasurable|cannot|can't)\b.{0,55}\b(?:kinetic\s+energy|ke\b|graph|data\s+point|electron\s+energy|stopping\s+potential)\b/.test(a)||
      /\b(?:no|not)\s+(?:photoelectron\s+)?(?:kinetic\s+energy|energy)\s+(?:value|measurement|data)\b/.test(a);
    const zeroKineticEnergy=
      /\b(?:kinetic\s+energy|ke\b|energy\s+of\s+(?:the\s+)?(?:photo)?electrons?)\b.{0,24}\b(?:zero|0\b|nil)\b/.test(a)||
      /\b(?:zero|0\b|nil)\b.{0,25}\b(?:kinetic\s+energy|ke\b)\b/.test(a);
    const negativeKineticEnergy=
      /\b(?:kinetic\s+energy|ke\b)\b.{0,25}\bnegative\b/.test(a)||
      /\bnegative\b.{0,20}\b(?:kinetic\s+energy|ke\b)\b/.test(a);
    const unphysicalNegative=negativeKineticEnergy&&/\b(?:not|isn'?t|cannot|can't|unphysical|impossible|extrapolat)\b/.test(a);
    const claimsEmission=/\b(?:photo)?electrons?\s+(?:are\s+|will\s+|do\s+)?(?:emitted|released|ejected)\b/.test(a)&&!noEmission;
    if(claimsEmission)return {status:'wrong',score:0,text:'Below threshold there is no photoelectric emission. No emitted electron has a measurable kinetic energy.',missing:['No photoelectrons are emitted below the threshold frequency.']};
    if(noEmission&&zeroKineticEnergy)return {status:'partial',score:.5,
      text:'Partly correct: you recognised that no electrons are emitted. However, their kinetic energy is not zero; no emitted electron exists to measure, so the graph has no data below threshold.',
      missing:['There is no measurable photoelectron kinetic energy, rather than an energy of zero.']};
    if(noEmission&&negativeKineticEnergy&&!unphysicalNegative)return {status:'partial',score:.5,
      text:'Partly correct: no photoelectrons are emitted. A negative kinetic energy from extrapolating the line is not a physical measurement.',
      missing:['No kinetic-energy data exist below threshold.']};
    if(noEmission||(insufficientPhotonEnergy&&noGraphData)||unphysicalNegative&&insufficientPhotonEnergy)
      return {status:'correct',score:1,text:'Correct. Below the threshold frequency there is no photoelectron emission and therefore no measured kinetic-energy value.',missing:[]};
    if(insufficientPhotonEnergy||noGraphData||unphysicalNegative)
      return {status:'partial',score:.5,text:'Partly correct: connect your explanation to the fact that no photoelectrons are emitted below threshold.',missing:['No photoelectrons are emitted.']};
    return {status:'wrong',score:0,text:'Explain what happens to photoelectron emission below threshold frequency; there is no measured kinetic energy.',missing:['No photoelectrons are emitted.']};
  }
  return Object.freeze({TARGET_ID,evaluate});
});
