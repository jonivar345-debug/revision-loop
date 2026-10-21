/* Paper archive regression. Does not reproduce AQA question-paper text. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const home=path.join(__dirname,'..');
const script=fs.readFileSync(path.join(home,'app.js'),'utf8');
const main=JSON.parse(fs.readFileSync(path.join(home,'exam_questions.json'),'utf8')).questions;
const add=JSON.parse(fs.readFileSync(path.join(home,'paper_supplement_2016_2017.json'),'utf8')).questions;
const start=script.indexOf('function renderPaperArchive(){');
const end=script.indexOf('\nfunction refreshExamFilters(',start);
assert(start>=0&&end>start,'Archive render function is available');
let subject='Physics';
const out={paperArchiveLinks:{innerHTML:'',insertAdjacentHTML(where,html){this.innerHTML+=html},querySelectorAll(){return[]}},topicOutsideResources:{innerHTML:''}};
const document={getElementById(id){return id==='examSubject'?{value:subject}:out[id]||null}};
const papers={
 Physics:{'AS Paper 1':'https://www.physicsandmathstutor.com/past-papers/a-level-physics/aqa-paper-1-as/'},
 Chemistry:{'AS Paper 1':'https://www.physicsandmathstutor.com/past-papers/a-level-chemistry/aqa-paper-1-as/'},
 Maths:{'AS Papers 1 & 2':'https://www.physicsandmathstutor.com/maths-revision/a-level-aqa/papers-as/','A-level Papers 1, 2 & 3':'https://www.physicsandmathstutor.com/maths-revision/a-level-aqa/papers/'}
};
const app=new Function('examQuestions','document','PMT_PAPER_INDEX','PMT_BY_TOPIC','revisionTopicIndex','esc',
 script.slice(start,end)+'\nreturn renderPaperArchive;')(
 [...main,...add],document,papers,{Physics:'https://www.physicsandmathstutor.com/physics-revision/a-level-aqa/',
 Chemistry:'https://www.physicsandmathstutor.com/chemistry-revision/a-level-aqa/',
 Maths:'https://www.physicsandmathstutor.com/maths-revision/a-level-aqa/'},
 ()=>[],s=>String(s).replace(/[&<>"']/g,''));
let checks=0;
for(subject of ['Physics','Chemistry','Maths']){
 app();
 const html=out.paperArchiveLinks.innerHTML;
 assert.match(html,/2025/);checks++;
 assert.match(html,/2015/);checks++;
 assert.match(html,/Official AQA paper and mark-scheme finder/);checks++;
 assert.equal((html.match(/<tr><th scope="row">/g)||[]).length,11,'All 11 years shown '+subject);checks++;
 assert.match(html,/0 indexed parts/,'Never imply all paper parts have been indexed');checks++;
 if(subject==='Maths'){assert.match(html,/source-first/,'Source-dependent Maths questions are accessible separately');checks++;}
 if(subject==='Maths'){
  assert.match(html,/7356\/1/);checks++;
  assert.match(html,/7357\/3/);checks++;
  assert.match(html,/maths-revision\/a-level-aqa\/papers\//);checks++;
  assert.match(html,/Current syllabus not examined/);checks++;
  assert.match(html,/Older AQA specification papers/);checks++;
 }
 if(subject==='Chemistry'){
  assert.match(html,/7404\/1/);checks++;
  assert.match(html,/7405\/1/);checks++;
  assert.match(html,/2017/);checks++;
 }
 if(subject==='Physics'){
  assert.match(html,/7407\/1/);checks++;
  assert.match(html,/7408\/3/);checks++;
  assert.match(html,/2016/);checks++;
 }
}
console.log('PASS '+checks+' complete timeline, paper-code and source-count archive checks');
