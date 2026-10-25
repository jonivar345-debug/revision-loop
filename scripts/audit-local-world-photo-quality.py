#!/usr/bin/env python3
"""Audit first-party World photos; source/size checks are NOT visual acceptance."""
from pathlib import Path
from collections import defaultdict
import hashlib
import json
from PIL import Image

root=Path(__file__).resolve().parents[1]
photos=json.loads((root/'assets/world/ATTRIBUTION.json').read_text(encoding='utf-8'))
groups=defaultdict(list)
for photo in photos:
    groups[photo['destination']].append(photo)

def difference_hash(path):
    with Image.open(path) as pic:
        im=pic.convert('L').resize((9,8),Image.Resampling.LANCZOS)
        p=list(im.getdata())
        value=0
        for row in range(8):
            for col in range(8):
                value=(value<<1)|(p[row*9+col]>p[row*9+col+1])
        return value

identical=[];similar=[];unusual=[];bytes_total=0
for id,items in groups.items():
    seen_sha={};hashes=[]
    for photo in items:
        path=root/photo['displayedGallery']
        content=path.read_bytes()
        bytes_total+=photo['galleryBytes']+photo['coverBytes']
        digest=hashlib.sha256(content).hexdigest()
        if digest in seen_sha:
            identical.append({'id':id,'files':[seen_sha[digest],photo['originalFile']]})
        seen_sha[digest]=photo['originalFile']
        with Image.open(path) as im:
            w,h=im.size
            if max(w/h,h/w)>3.8:
                unusual.append({'id':id,'source':photo['originalFile'],'aspectRatio':round(w/h,2)})
        hashes.append((photo['originalFile'],difference_hash(path)))
    for a in range(len(hashes)):
        for b in range(a+1,len(hashes)):
            d=(hashes[a][1]^hashes[b][1]).bit_count()
            if d<=5:
                similar.append({'id':id,'files':[hashes[a][0],hashes[b][0]],'dHashDistance':d})
manual=[
  {'id':id,'issue':'Replacement source selected, but detailed visual inspection and crop approval remain outstanding'}
  for id in ['manila','adelaide','country-tm','country-sm','country-ni','country-ro','coron']
]
addressed=['manila','adelaide','country-tm','country-sm','country-ni','country-ro','coron','florence','porto','gyeongju','krakow','stockholm','bergen','shenzhen','bohol','petra','angkor']
assert not identical,'Exact duplicate files inside one destination: '+repr(identical)
budgeted=[p for p in photos if p.get('newSizeBudgeted')]
assert all(p['galleryBytes']<=720*1024 and p['coverBytes']<=170*1024 for p in budgeted)
report={
  'release':'v108','localDestinations':len(groups),'localPhotographs':len(photos),
  'fourPhotoLocalGalleries':sum(len(x)==4 for x in groups.values()),
  'combinedImageBytes':bytes_total,
  'newBudgetedPhotographs':len(budgeted),
  'suspectedVisualDuplicates':similar,
  'extremeAspectRatioCandidates':unusual,
  'prioritizedEditorialReview':manual,
  'selectionIssuesAddressed':addressed,
  'excludedCrossPlaceSourceCandidates':20,
  'correctedSixSourceGalleries':['cartagena','country-is','country-li','country-lu','country-pt','country-qa'],
  'visualReviewStatus':'Unreviewed; metadata verification, checksum checks and perceptual similarity checks are not human inspection'
}
dest=root/'editorial/world-local-photo-audit-v108.json'
dest.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f"Photo audit: {report['localPhotographs']} sources across {report['localDestinations']} destinations;"
      f" {report['fourPhotoLocalGalleries']} four-photo galleries; "
      f" {len(similar)} visually similar pairs flagged; "
      f" {bytes_total/1048576:.1f} MiB total.")
