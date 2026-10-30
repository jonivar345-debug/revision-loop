/* v213: reviewed isolated answers on four existing AS Physics materials and divider questions.
   Unknown and multi-step responses retain the existing reviewable marking system. */
(function(root){
'use strict';
function normalize(input){
 return String(input||'').toLowerCase().replace(/[−–—]/g,'-')
  .replace(/⁻/g,'-').replace(/¹/g,'1').replace(/²/g,'2').replace(/³/g,'3')
  .replace(/×/g,'x').replace(/ω/g,'ohm').replace(/Ω/g,'ohm')
  .replace(/\bohms?\b/g,'ohm').replace(/\bvolts?\b/g,'v')
  .replace(/\s+/g,'').replace(/(\d)\.0+(?=\D|$)/g,'$1')
  .replace(/[.!?]+$/,'');
}
const cases={
  "task1_v203_phy_04": {
    "accept": {
      "0": [
        "The initial stiffness is 2000 N/m",
        "Initial spring constant is 2000 N m^-1"
      ],
      "1": [
        "The limit of proportionality is 0.020 m"
      ],
      "2": [
        "Area from 0 to 0.020 m is 0.400 J"
      ],
      "3": [
        "Area from 0.020 to 0.030 m is 0.450 J"
      ],
      "4": [
        "Area from 0.030 to 0.040 m is 0.500 J"
      ],
      "5": [
        "Total work done is 1.35 J",
        "The work done is 1.350 J"
      ],
      "6": [
        "Area under a force-extension graph gives work done"
      ],
      "7": [
        "One triangular area cannot represent the entire nonlinear graph"
      ],
      "8": [
        "An unloading curve is needed to know the recoverable elastic energy"
      ]
    },
    "reject": [
      "Total work done is 1.35 N",
      "Initial stiffness is 2000 J/m",
      "Area from 0.030 to 0.040 m is 0.500 W",
      "The limit of proportionality is 0.030 m",
      "Total work done is 1.0 J",
      "All the work must be recoverable elastic energy"
    ]
  },
  "task1_v203_phy_05": {
    "accept": {
      "1": [
        "Young modulus is 2.00 x 10^11 Pa",
        "E = 2.00 × 10^11 Pa"
      ],
      "2": [
        "The stress is 2.00 x 10^8 Pa"
      ],
      "3": [
        "The force is 300 N"
      ],
      "4": [
        "The extension is 1.40 mm",
        "Extension is 0.00140 m"
      ],
      "5": [
        "Energy density is 1.00 x 10^5 J/m^3"
      ],
      "6": [
        "Volume is 2.10×10^-6 m^3"
      ],
      "7": [
        "The stored elastic energy is 0.210 J"
      ],
      "8": [
        "The curved section has a different Young modulus gradient"
      ]
    },
    "reject": [
      "Young modulus is 2.00 x 10^11 J",
      "Force is 300 J",
      "The stored energy is 0.210 W",
      "The volume is 2.10×10^-6 m",
      "Energy density is 1.00 x 10^5 J/m",
      "Young modulus is 2.00 x 10^8 Pa"
    ]
  },
  "task1_v203_phy_06": {
    "accept": {
      "0": [
        "Unloaded output = 8.0 V",
        "The unloaded output voltage is 8 V"
      ],
      "1": [
        "Equivalent lower resistance is 3 kΩ"
      ],
      "2": [
        "Loaded total resistance is 6 kΩ"
      ],
      "3": [
        "Loaded output = 6.0 V",
        "The loaded output voltage is 6 V"
      ],
      "4": [
        "Total loaded current is 2.00 mA",
        "Total current is 0.002 A"
      ],
      "5": [
        "Load current = 1.00 mA"
      ],
      "6": [
        "Loading reduces lower resistance, so output voltage decreases"
      ],
      "7": [
        "A high-resistance voltmeter draws negligible current"
      ]
    },
    "reject": [
      "Unloaded output = 8.0 A",
      "Loaded output = 6.0 A",
      "Total current is 2.00 V",
      "Load current = 1.00 V",
      "Equivalent lower resistance is 3 V",
      "The loaded output is 8.0 V",
      "The unloaded output is 6.0 V"
    ]
  },
  "task1_v203_phy_07": {
    "accept": {
      "0": [
        "Cool NTC output is 5.0 V"
      ],
      "1": [
        "Hot NTC output is 2.0 V"
      ],
      "2": [
        "NTC resistance decreases as temperature increases"
      ],
      "3": [
        "When the NTC is in the lower branch, heating reduces output voltage"
      ],
      "4": [
        "LDR output in darkness is 6.67 V"
      ],
      "5": [
        "LDR output in bright light is 2.86 V"
      ],
      "6": [
        "LDR resistance decreases as light intensity increases"
      ],
      "7": [
        "Putting the sensor in the upper branch makes output increase when sensor resistance falls"
      ]
    },
    "reject": [
      "Cool NTC output is 5.0 A",
      "Hot NTC output is 2.0 A",
      "LDR output in darkness is 6.67 A",
      "LDR output in bright light is 2.86 A",
      "NTC resistance increases as temperature increases",
      "LDR resistance increases as light intensity increases",
      "Upper-branch output decreases when sensor resistance falls"
    ]
  }
};
function evaluate(q,answer){
 const data=cases[String(q&&q.id||'')];if(!data)return null;
 const raw=String(answer||'').trim();
 if(!raw||raw.length>150||/[;\n]/.test(raw))return null;
 const key=normalize(raw);
 if(data.reject.some(item=>normalize(item)===key))return response(q,null);
 for(const [n,variants] of Object.entries(data.accept)){
  if(variants.some(item=>normalize(item)===key))return response(q,Number(n));
 }
 return null;
}
function response(q,index){
 const flags=(q.markPoints||[]).map((_,i)=>i===index);
 const suggested=flags.filter(Boolean).length;
 return {preds:flags,scores:flags.map(v=>v?1:0),suggested,finalCorrect:false,confidence:'high'};
}
root.RevisionPhysicsMaterialsV213={evaluate};
})(typeof window!=='undefined'?window:globalThis);
