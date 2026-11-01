'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const app=read('app.js'),waves=json('physics_waves_applications_v253.json').cards,chem=json('chemistry_atomic_tof_applications_v254.json').cards;
const start=app.indexOf('function normalise('),end=app.indexOf('function importantTokens(',start);assert(start>=0&&end>start);
const judge=new Function('window',app.slice(start,end)+'\nreturn evaluateCard;')({RevisionPhotoelectricCardMarking:null});
const byId=new Map([...waves,...chem].map(c=>[c.id,c]));
const cases=[
 {
  "id": "task1_v253_physics_waves_01",
  "valid": [
   "30.000 m/s",
   "3e1 m/s"
  ],
  "wrong": [
   "300 m/s",
   "30 Hz"
  ]
 },
 {
  "id": "task1_v253_physics_waves_02",
  "valid": [
   "40.00 Hz",
   "0.040 kHz"
  ],
  "wrong": [
   "4 Hz",
   "40 m/s"
  ]
 },
 {
  "id": "task1_v253_physics_waves_12",
  "valid": [
   "40.0 Hz",
   "0.04 kHz"
  ],
  "wrong": [
   "80 Hz",
   "40 m/s"
  ]
 },
 {
  "id": "task1_v253_physics_waves_13",
  "valid": [
   "120.0 Hz",
   "0.12 kHz"
  ],
  "wrong": [
   "40 Hz",
   "120 m/s"
  ]
 },
 {
  "id": "task1_v253_physics_waves_16",
  "valid": [
   "2.00 mm",
   "0.002000 m"
  ],
  "wrong": [
   "0.20 mm",
   "2.00 s"
  ]
 },
 {
  "id": "task1_v253_physics_waves_22",
  "valid": [
   "0.002000 mm",
   "2000 nm"
  ],
  "wrong": [
   "0.020 mm",
   "2e-6 Hz"
  ]
 },
 {
  "id": "task1_v253_physics_waves_23",
  "valid": [
   "17.50°",
   "17.46 degrees"
  ],
  "wrong": [
   "30°",
   "17.5 Hz"
  ]
 },
 {
  "id": "task1_v253_physics_waves_24",
  "valid": [
   "4.0",
   "4e0"
  ],
  "wrong": [
   "5",
   "4 Hz"
  ]
 },
 {
  "id": "task1_v253_physics_waves_25",
  "valid": [
   "19.50°",
   "19.47 degrees"
  ],
  "wrong": [
   "30°",
   "19.5 Hz"
  ]
 },
 {
  "id": "task1_v253_physics_waves_26",
  "valid": [
   "2.00e8 m/s",
   "200000000 m/s"
  ],
  "wrong": [
   "2.00e7 m/s",
   "2.00e8 Hz"
  ]
 },
 {
  "id": "task1_v253_physics_waves_27",
  "valid": [
   "400.0 nm",
   "4.000e-7 m"
  ],
  "wrong": [
   "400 m",
   "400 Hz"
  ]
 },
 {
  "id": "task1_v253_physics_waves_28",
  "valid": [
   "41.80°",
   "41.81 degrees"
  ],
  "wrong": [
   "48.2°",
   "41.8 Hz"
  ]
 },
 {
  "id": "task1_v253_physics_waves_29",
  "valid": [
   "75.20°",
   "75.16 degrees"
  ],
  "wrong": [
   "14.8°",
   "75.2 Hz"
  ]
 },
 {
  "id": "task1_v254_chem_atomic_tof_01",
  "valid": [
   "63.620",
   "6.362e1"
  ],
  "wrong": [
   "63.2",
   "63.62 Hz"
  ]
 },
 {
  "id": "task1_v254_chem_atomic_tof_02",
  "valid": [
   "35.500",
   "3.55e1"
  ],
  "wrong": [
   "35.25",
   "35.5 J"
  ]
 },
 {
  "id": "task1_v254_chem_atomic_tof_03",
  "valid": [
   "24.32000",
   "2.432e1"
  ],
  "wrong": [
   "24.23",
   "24.32 m"
  ]
 },
 {
  "id": "task1_v254_chem_atomic_tof_04",
  "valid": [
   "53.00",
   "5.3e1"
  ],
  "wrong": [
   "52",
   "53 m"
  ]
 },
 {
  "id": "task1_v254_chem_atomic_tof_05",
  "valid": [
   "10.0",
   "1e1"
  ],
  "wrong": [
   "13",
   "10 Hz"
  ]
 },
 {
  "id": "task1_v254_chem_atomic_tof_10",
  "valid": [
   "24.000",
   "2.4e1"
  ],
  "wrong": [
   "12",
   "24 V"
  ]
 },
 {
  "id": "task1_v254_chem_atomic_tof_11",
  "valid": [
   "12.00",
   "1.2e1"
  ],
  "wrong": [
   "24",
   "12 V"
  ]
 },
 {
  "id": "task1_v254_chem_atomic_tof_14",
  "valid": [
   "2.00e5 m/s",
   "200000 m/s"
  ],
  "wrong": [
   "2.00e4 m/s",
   "2.00e5 Hz"
  ]
 },
 {
  "id": "task1_v254_chem_atomic_tof_15",
  "valid": [
   "8.00e-16 J",
   "8e-19 kJ"
  ],
  "wrong": [
   "8e-14 J",
   "8e-16 Hz"
  ]
 },
 {
  "id": "task1_v254_chem_atomic_tof_16",
  "valid": [
   "4.00e-5 s",
   "0.040 ms"
  ],
  "wrong": [
   "4e-3 s",
   "4e-5 Hz"
  ]
 },
 {
  "id": "task1_v254_chem_atomic_tof_29",
  "valid": [
   "88.00",
   "8.8e1"
  ],
  "wrong": [
   "44",
   "88 Hz"
  ]
 }
];
let accepted=0,rejected=0;
for(const row of cases){
 const c=byId.get(row.id);assert(c,'card missing '+row.id);
 assert(c.numericRecall,'unit configuration missing '+row.id);
 for(const a of row.valid){assert.equal(judge(c,a).status,'correct','Valid numeric answer rejected '+c.id+': '+a);accepted++;}
 for(const a of row.wrong){assert.equal(judge(c,a).status,'wrong','Incorrect value/unit credited '+c.id+': '+a);rejected++;}
 // Preserve the curated model and every existing valid and deliberately invalid example.
 for(const a of c.accept){assert.equal(judge(c,a).status,'correct','Old accepted answer regressed '+c.id+': '+a);}
 for(const a of c.reject){assert.equal(judge(c,a).status,'wrong','Old rejected answer now credited '+c.id+': '+a);}
}
assert.equal(cases.length,24);assert.equal(accepted,48);assert.equal(rejected,48);
assert.equal(judge(byId.get('task1_v254_chem_atomic_tof_15'),'8e-14 J').status,'wrong');
assert.equal(judge(byId.get('task1_v254_chem_atomic_tof_15'),'8e-19 kJ').status,'correct');
assert.equal(judge(byId.get('task1_v253_physics_waves_22'),'0.020 mm').status,'wrong');
assert.equal(judge(byId.get('task1_v253_physics_waves_22'),'0.002 mm').status,'correct');
assert.equal(judge(byId.get('task1_v253_physics_waves_23'),'17.5 Hz').status,'wrong');
assert.equal(judge(byId.get('task1_v253_physics_waves_23'),'17.46 degrees').status,'correct');
const unconfigured=waves.find(c=>!c.numericRecall);assert(unconfigured);
assert.equal(judge(unconfigured,unconfigured.back).status,'correct');
assert.equal(judge(unconfigured,'123 Hz').status,'wrong');
for(const k of ["PROGRESS_KEY='revisionLoopProgress5'","PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])assert(app.includes(k));
console.log('PASS v255: 24 configured Chemistry/Physics numericals, 48 new correct and 48 wrong examples, powers of 10/units protected, old answers preserved.');
