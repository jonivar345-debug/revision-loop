'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const stories=require('../world-city-offline-guides.js');
const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
assert(Object.keys(stories).length>=25,'Expected 25+ locally authored city and region guides');
for(const [id,guide] of Object.entries(stories)){
  for(const key of ['overview','culture','fact'])
    assert(typeof guide[key]==='string'&&guide[key].length>=45,id+' incomplete '+key);
  assert(!/https?:\/\//.test(JSON.stringify(guide)),id+' unexpectedly requires a live source');
}
assert(html.includes('world-city-offline-guides.js?v=103'),'City stories script missing');
assert(sw.includes("'./world-city-offline-guides.js'"),'City stories must be in offline shell');
assert(app.includes('if(!LOCATION_LOCAL_OVERVIEWS[id]&&!offlineGuide?.overview)try{'),'Local city guides must bypass Wikipedia fetch');
console.log('PASS '+Object.keys(stories).length+' offline city guides, three sections each and no live Wikipedia requirement for these IDs');
