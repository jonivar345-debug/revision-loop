'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const deck=JSON.parse(fs.readFileSync('deck.json','utf8'));
const card=deck.cards.find(c=>c.id==='phy_spectra_photo_v32_below_threshold_graph');
const marker=require('../photoelectric-flashcard-marking.js');
assert(card,'Target photoelectric card must exist');
assert.equal(marker.TARGET_ID,card.id);
assert.match(card.front,/photoelectric.effect.*photoelectron.*frequency/i);
assert.match(card.back,/No photoelectrons are emitted/i);
assert.match(card.back,/work function/i);
assert.match(card.back,/negative energy/i);

for(const answer of [
 'No photoelectrons are emitted below threshold frequency.',
 'No electrons escape.',
 'There is no emission of electrons.',
 'No photoelectrons are emitted, so there are no kinetic energy readings.',
 'No photoelectrons are emitted since the photon energy is below the work function.',
 'Below threshold frequency no photoelectrons are emitted; negative kinetic energy on extending the line is not physical.'
])assert.equal(marker.evaluate(answer).status,'correct',answer);
for(const answer of [
 'The kinetic energy will be zero with no emissions',
 'No photoelectrons are emitted and their kinetic energy is zero',
 'The photons have insufficient energy to escape the metal'
])assert.equal(marker.evaluate(answer).status,'partial',answer);
for(const answer of [
 'All photons produce electrons',
 'Electrons are emitted with zero kinetic energy'
])assert.equal(marker.evaluate(answer).status,'wrong',answer);
assert.equal(marker.evaluate('   ').status,'neutral');

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const cloud=fs.readFileSync('cloud-sync.js','utf8');
assert.match(html,/photoelectric-flashcard-marking\.js\?v=121/);
assert.match(html,/app\.js\?v=121/);
assert.match(html,/cloud-sync\.js\?v=121/);
assert.ok(html.indexOf('photoelectric-flashcard-marking.js')<html.indexOf('app.js?v=121'));
assert.match(sw,/photoelectric-flashcard-marking\.js/);
assert.match(app,/c\.id===window\.RevisionPhotoelectricCardMarking\?\.TARGET_ID/);
assert.match(app,/Choose a rating to (?:record|save) (?:the|your) review/);
assert.match(cloud,/onSnapshot\(remoteRef\(\)/);
assert.match(cloud,/requestCloudCheck\(\)/);
assert.match(cloud,/function hasUnsavedAnswer\(\)/);
assert.match(cloud,/queuedServerCheck/);
assert.match(cloud,/phase==='remote-ready'/);
assert.match(cloud,/remoteRevision>cp\.revision/);
assert.match(app,/profile\.reviews\+\+;daily\(\)\.reviews\+\+;save\(\);advanceSession\(\)/);
console.log('PASS v121: clearer photoelectric card, correct/partial feedback, recorded reviews and live cross-device sync listener.');
