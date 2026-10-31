'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const data=JSON.parse(fs.readFileSync('editorial/task1-v228-mock-review-ledger.json','utf8'));
assert.equal(data.completionGates.task1Complete,false);
console.log('PASS initial review ledger gate');
