/* Regression: AQA method and accuracy marks can have transitive prerequisites. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const app = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const start = app.indexOf('function enforceMarkDependencies(');
const end = app.indexOf('function totalMarkingPoints(', start);
assert(start >= 0 && end > start, 'Dependency helper must exist');
const context = {};
vm.runInNewContext(app.slice(start, end) + '\nthis.check = enforceMarkDependencies;', context);
let cases = 0;
const check = (dependencies, flags, expected) => {
  const original = flags.slice();
  const result = context.check({ markPointDependencies: dependencies }, flags);
  assert.deepEqual(Array.from(result), expected);
  assert.deepEqual(flags, original, 'Do not mutate original mark predictions');
  cases++;
};
check({ 1: [2], 2: [0] }, [false, true, true], [false, false, false]);
check({ 2: [0], 1: [2] }, [false, true, true], [false, false, false]);
check({ 1: [2], 2: [0] }, [true, true, true], [true, true, true]);
check({ 1: [2], 2: [0] }, [true, true, false], [true, false, false]);
check({ 3: [1], 1: [2], 2: [0] }, [false, true, true, true], [false, false, false, false]);
check({ 1: [2], 2: [1] }, [true, true, true], [true, true, true]);
check({ 1: [2], 2: [1] }, [true, true, false], [true, false, false]);
check({}, [true, false, true], [true, false, true]);
console.log('PASS ' + cases + ' transitive, reversed and cyclic dependency checks');
