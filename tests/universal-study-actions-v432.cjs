'use strict';
/* v432 cross-mode, data-integrity and legacy compatibility checks. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const app=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('styles.css','utf8');
const sw=fs.readFileSync('sw.js','utf8');
new Function(app);
for(const id of ['skipCard','knowCard','skipExam','knowExam']){
 assert(app.includes('id="'+id+'"'),id+' missing in study renderer');
 assert(app.includes("getElementById('"+id+"').onclick"),id+' handler missing');
}
for(const id of ['flash','mock','exam','daily','mistakes']){
 assert(app.includes("kind:'"+id+"'"),'Session mode missing: '+id);
}
assert(app.includes('function skipStudyItem(){'));
assert(app.includes('function selfRateKnownCard(c){'));
assert(app.includes('function selfRateExamKnown(q){'));
assert(app.includes('function beginManualExamReview(q){'));
assert(app.includes('rateCard(c,\'good\',\'[I know this · self-rated] \''));
assert(app.includes("status:'self-rated'"));
assert(app.includes("ts.selfRatedKnown=(ts.selfRatedKnown||0)+1"));
assert(app.includes("if((s.skipped||0)===0&&profile.lastChallengeDate!==today)"));
assert(app.includes("stored.skipped=0"),'Daily challenge must be retryable after skipping');
assert(app.includes("window.RevisionSketch?.hasPendingInk?.()===true"),'Unsaved ink must trigger warning');
assert(app.includes("window.RevisionScan?.countFor?.(item.id)"),'Unsaved photo scans must trigger warning');
const skip=app.slice(app.indexOf('function skipStudyItem(){'),app.indexOf('function advanceSession(){'));
assert(skip.includes('advanceSession();'));
assert(skip.includes("item.type==='card'&&currentFlashAwarded"),'Skip cannot bypass a scored flashcard review');
assert(app.includes('skip.disabled=true'),'Skip must be disabled after a scored flashcard');
for(const forbidden of ['award(','awardExam(','rateCard(','setState(','addError('])assert(!skip.includes(forbidden),'Skip must not affect progress: '+forbidden);
assert(app.includes("PROGRESS_KEY='revisionLoopProgress5'"));
assert(app.includes("PROFILE_KEY='revisionLoopProfile11'"));
assert(app.includes("SETTINGS_KEY='revisionLoopSettings11'"));
assert(css.includes('.quick-review-actions')&&css.includes('.quick-review-btn:focus-visible'));
assert(sw.includes('v432-study-skip-self-rate'));
assert(sw.includes("'./physics_as_paper2_guided_v430.json'"));
console.log('PASS v432: all shared study routes, unscored skip, distinct self-rating, manual exam override, draft safety, daily streak integrity, offline and stable saved-data keys.');
