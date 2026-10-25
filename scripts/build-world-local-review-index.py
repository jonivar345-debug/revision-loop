#!/usr/bin/env python3
"""Generate an independent and reusable review index of ACTUAL local WebP pixels.

Shows photograph/original title, author, license, original source link, 16:9
shop-cover crops and four full gallery files. No human quality endorsement.
"""
import json
from pathlib import Path
from collections import defaultdict
from PIL import Image, ImageOps, ImageDraw
from datetime import datetime, timezone

ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'assets/world'
REVIEWS=ROOT/'editorial/reviews'
REVIEWS.mkdir(parents=True,exist_ok=True)
PHOTO_RECORDS=json.loads((ASSETS/'ATTRIBUTION.json').read_text(encoding='utf-8'))
GROUPS=defaultdict(list)
for photo in PHOTO_RECORDS:
    GROUPS[photo['destination']].append(photo)
AUDIT=json.loads((ROOT/'editorial/world-local-photo-audit-v111.json').read_text(encoding='utf-8'))
NEW_IDS=set(json.loads((ROOT/'editorial/world-v111-batch-targets.json').read_text(encoding='utf-8'))['targets'])
V110_IDS=set(json.loads((ROOT/'editorial/world-v110-batch-targets.json').read_text(encoding='utf-8'))['targets'])
OLD_IDS=set(json.loads((ROOT/'editorial/world-v109-batch-targets.json').read_text(encoding='utf-8'))['targets'])-{'ocean-arctic'}
DUPLICATES={p['id'] for p in AUDIT.get('suspectedVisualDuplicates',[])}
STRETCHED={p['id'] for p in AUDIT.get('extremeAspectRatioCandidates',[])}
def dimensions(relative):
    with Image.open(ROOT/relative) as img:
        img.load()
        if img.format!='WEBP':raise ValueError('Expected WebP '+str(relative))
        return [img.width,img.height]
destinations=[]
for id,records in sorted(GROUPS.items()):
    reviews=[]
    for number,p in enumerate(records,1):
        gp=p['displayedGallery']
        cp=p['displayedCover']
        gd=dimensions(gp)
        cd=dimensions(cp)
        # Approximate the 16:9 shop's object-fit:cover crop from actual cover pixels.
        image_ratio=cd[0]/cd[1]
        crop_ratio=16/9
        crop_area=min(image_ratio/crop_ratio,crop_ratio/image_ratio)
        reviews.append({
            'slot':number,
            'originalFile':p['originalFile'],
            'gallery':gp.replace('./','../../',1),
            'cover':cp.replace('./','../../',1),
            'galleryDimensions':gd,
            'coverDimensions':cd,
            'cropRetained':round(crop_area,3),
            'author':p['author'],
            'license':p['license'],
            'licenseUrl':p['licenseUrl'],
            'sourcePage':p['sourcePage']
        })
    reasons=[]
    if len(reviews)!=4:reasons.append('incomplete-four-photo-gallery')
    if reviews[0]['cropRetained']<0.67:reasons.append('lead-cover-aggressive-centre-crop')
    if id in DUPLICATES:reasons.append('possible-similar-views')
    if id in STRETCHED:reasons.append('extreme-aspect-gallery-image')
    destinations.append({'id':id,'newInV109':id in OLD_IDS,'newInV110':id in V110_IDS,'newInV111':id in NEW_IDS,'lead':reviews[0]['originalFile'],
                         'reasons':reasons,'reviewStatus':'needs-human-visual-approval',
                         'images':reviews})
result={
    'release':'v111',
    'description':'Real locally hosted gallery and shop-cover image index. Nothing in this audit implies individual human pixel approval.',
    'galleryCount':len(destinations),
    'photoCount':len(PHOTO_RECORDS),
    'fullyLocal':sum(len(x['images'])==4 for x in destinations),
    'destinations':destinations}
out=REVIEWS/'world-local-photo-review-index.json'
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Review index: '+str(len(destinations))+' destinations, '+str(len(PHOTO_RECORDS))+' true WebP originals; '+
      str(sum(bool(x['reasons']) for x in destinations))+' destinations with automated flags.')
