/* v211: independently checked concise answer aliases/negative examples for three
  original Year 1 Physics graph/circuit applications. For other responses
  fall back to the site's existing human-reviewable marker. */
(function(root){
'use strict';
function normal(input){
 return String(input||'').toLowerCase()
  .replace(/[−–—]/g,'-').replace(/⁻/g,'-').replace(/¹/g,'1')
  .replace(/²/g,'2').replace(/ω/g,'ohm').replace(/Ω/g,'ohm')
  .replace(/\bvolts?\b/g,'v').replace(/\bohms?\b/g,'ohm')
  .replace(/\s+/g,'').replace(/(\d)\.0+(?=\D|$)/g,'$1')
  .replace(/[.!?]+$/,'');
}
const accepted={
  "task1_v203_phy_01": {
    "0": [
      "Displacement at 2 s is 6 m",
      "The displacement at 2s is 6m"
    ],
    "1": [
      "Displacement at 4 s is 20 m",
      "The displacement at 4s is 20m"
    ],
    "2": [
      "The average velocity is 5 m/s",
      "Average velocity = 5 m/s"
    ],
    "3": [
      "The tangent gradient is 5 m/s",
      "Tangent slope is 5 m/s"
    ],
    "4": [
      "The instantaneous velocity at 2s is 5 m/s",
      "The instantaneous velocity is 5 m/s"
    ],
    "5": [
      "The acceleration is 2 m/s^2",
      "Acceleration is 2 m/s^2"
    ]
  },
  "task1_v203_phy_03": {
    "1": [
      "The velocity at 3s is 8 m/s"
    ],
    "3": [
      "The velocity at 5s is 2 m/s"
    ],
    "5": [
      "Overall change in velocity is 0 m/s"
    ],
    "6": [
      "The total displacement is 27 m",
      "Displacement is 27 m"
    ],
    "7": [
      "Area under an acceleration-time graph gives change in velocity, not displacement",
      "Acceleration-time graph area is the change in velocity"
    ]
  },
  "task1_v203_phy_08": {
    "0": [
      "The gradient is -0.5 V/A"
    ],
    "1": [
      "The internal resistance is 0.5 ohm",
      "Internal resistance is 0.5 Ω"
    ],
    "2": [
      "The emf is 1.5 V",
      "The cell emf is 1.5 volts"
    ],
    "3": [
      "The circuit current is 0.6 A"
    ],
    "4": [
      "Terminal voltage is 1.2 V"
    ],
    "5": [
      "The lost volts are 0.3 V",
      "The lost voltage is 0.3 V"
    ],
    "6": [
      "External power is 0.72 W"
    ],
    "7": [
      "Internal heating power is 0.18 W"
    ],
    "8": [
      "Total chemical power is 0.9 W"
    ]
  }
};
const rejected={
  "task1_v203_phy_01": [
    "Acceleration is -2 m/s^2",
    "The acceleration is -2 m/s^2",
    "The acceleration is 2 m/s",
    "The tangent gradient is 5 m/s^2",
    "The instantaneous velocity is 5 m/s^2",
    "The average velocity is not 5 m/s"
  ],
  "task1_v203_phy_03": [
    "Area under acceleration time is displacement",
    "Area under acceleration-time graph is displacement",
    "Acceleration-time graph area is displacement",
    "The total displacement is -27 m",
    "The velocity at 3s is -8 m/s",
    "The velocity at 5s is -2 m/s"
  ],
  "task1_v203_phy_08": [
    "The lost volts are 2.0 J",
    "The lost volts are 0.3 J",
    "The internal resistance is -0.5 ohm",
    "The emf is 6 V",
    "Internal heating power is 0.18 J",
    "The gradient is +0.5 V/A"
  ]
};
function evaluate(q,answer){
 const id=String(q&&q.id||'');
 const byIndex=accepted[id];
 if(!byIndex)return null;
 const original=String(answer||'').trim();
 // Whole independent short claims only: multi-step work retains the normal
 // grading path and can receive several independent method marks.
 if(!original||original.length>130||/[;\n]/.test(original))return null;
 const key=normal(original);
 if((rejected[id]||[]).some(x=>normal(x)===key)){
  const marks=(q.markPoints||[]).map(()=>false);
  return {preds:marks,scores:marks.map(()=>0),suggested:0,finalCorrect:false,confidence:'high'};
 }
 for(const [index,variants] of Object.entries(byIndex)){
  if(variants.some(x=>normal(x)===key)){
   const marks=(q.markPoints||[]).map((_,i)=>i===Number(index));
   return {preds:marks,scores:marks.map(v=>v?1:0),suggested:1,finalCorrect:false,confidence:'high'};
  }
 }
 return null;
}
root.RevisionPhysicsConciseV211={evaluate};
})(typeof window!=='undefined'?window:globalThis);
