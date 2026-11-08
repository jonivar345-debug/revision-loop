'use strict';
// Project configuration only. Minimise Vercel Hobby preview builds for
// source-only branches while retaining all normal learner-facing deployments.
// See https://vercel.com/docs/project-configuration/git-configuration
const assert=require('node:assert/strict');
const fs=require('node:fs');
const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));
assert.deepEqual(config.headers,[{
 source:'/deck.json',headers:[{key:'Cache-Control',value:'no-store, max-age=0'}]
}],'Existing no-store deck header must stay unchanged');
assert.deepEqual(config.git?.deploymentEnabled,{
 'qa/**':false,'audit/**':false,'editorial/**':false
},'Only explicitly source-only branch families may be auto-deploy-disabled');
assert.deepEqual(Object.keys(config).sort(),['git','headers']);
const branchRules=config.git.deploymentEnabled;
const ruleFor=branch=>{
 const family=branch.split('/')[0]+'/**';
 return Object.hasOwn(branchRules,family)?branchRules[family]:true;
};
for(const branch of [
 'qa/v423-full-short-exam-marker-inventory-20261108',
 'qa/v424-vercel-qa-branch-build-filter-20261108',
 'audit/v417-chem-legacy-70-syllabus-map-20261108',
 'editorial/v413-physics-waves-electricity-gate-map-20261108'
 ])assert.equal(ruleFor(branch),false,'Read-only QA branch unexpectedly auto-deploys '+branch);
for(const branch of [
 'main','release/v418-mock-marking-and-specrefs-20261108',
 'fix/v422-chem-bond-diagram-denials-20261108',
 'fix/v420-chem-legacy-question-specrefs-20261108',
 'task1-v409-short-denial-language-20261108'
 ])assert.equal(ruleFor(branch),true,'Learner-facing or production release branch excluded '+branch);
const app=fs.readFileSync('app.js','utf8');
for(const key of ["PROGRESS_KEY='revisionLoopProgress5'",
 "PROFILE_KEY='revisionLoopProfile11'","SETTINGS_KEY='revisionLoopSettings11'"])
 assert(app.includes(key));
console.log('PASS v424: Git auto-preview disabled for QA/audit/editorial-only branches, enabled by default for production and release/fix branches, no-store headers and saved keys unchanged.');
