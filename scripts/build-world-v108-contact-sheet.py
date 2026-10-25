#!/usr/bin/env python3
"""Create visual comparison of the v108 local image pixels and shop-style crops.

A contact sheet is evidence for a human to review, NOT a certificate of
human visual approval. The image sources and licences stay in ATTRIBUTION.json.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
import json
import math

ROOT=Path(__file__).resolve().parents[1]
BATCH=json.loads((ROOT/'editorial/world-v108-batch-targets.json').read_text(encoding='utf-8'))
MAN=json.loads((ROOT/'editorial/world-local-photo-pilot.json').read_text(encoding='utf-8'))['locations']
IDS=[key for key in BATCH['targets'] if key in MAN]
WIDTH=1160
PAD=18
CELL_W=266
THUMB_H=150
LABEL_H=32
CELL_H=2*THUMB_H+LABEL_H+16
ROW_H=CELL_H+62
OUTPUT=ROOT/'editorial/reviews/world-v108-cover-contact-sheet.jpg'
OUTPUT.parent.mkdir(parents=True,exist_ok=True)
sheet=Image.new('RGB',(WIDTH,max(180,65+len(IDS)*ROW_H)),(243,245,248))
draw=ImageDraw.Draw(sheet)
draw.text((PAD,12),'WORLD V108 — ACTUAL LOCAL PHOTOS AND SIMULATED SHOP-COVER CROPS',fill=(20,28,38))
draw.text((PAD,35),'Top: full photograph (letterboxed). Bottom: 266×150 object-fit: cover centre crop. Human review pending.',fill=(95,105,115))
review=[]
for row,id in enumerate(IDS):
    y=65+row*ROW_H
    draw.text((PAD,y),id+' — four gallery views / four shop crops',fill=(20,28,38))
    items=[]
    for col,source in enumerate(MAN[id]):
        x=PAD+col*(CELL_W+15)
        n=f'{col+1:02d}'
        original=ROOT/'assets/world'/id/f'{n}-gallery.webp'
        cover=ROOT/'assets/world'/id/f'{n}-cover.webp'
        with Image.open(original) as photo:
            gallery=photo.convert('RGB')
        with Image.open(cover) as photo:
            tile=photo.convert('RGB')
        full=ImageOps.contain(gallery,(CELL_W,THUMB_H),Image.Resampling.LANCZOS)
        baseline=(255,255,255)
        sheet.paste(Image.new('RGB',(CELL_W,THUMB_H),baseline),(x,y+24))
        sheet.paste(full,(x+(CELL_W-full.width)//2,y+24+(THUMB_H-full.height)//2))
        crop=ImageOps.fit(tile,(CELL_W,THUMB_H),Image.Resampling.LANCZOS,centering=(0.5,0.5))
        sheet.paste(crop,(x,y+24+THUMB_H+6))
        draw.text((x,y+6),n+' '+source[:32],fill=(37,50,64))
        orig_aspect=tile.width/tile.height
        cover_aspect=CELL_W/THUMB_H
        visible=min(orig_aspect/cover_aspect,cover_aspect/orig_aspect)
        items.append({'file':source,'galleryDimensions':list(gallery.size),
                      'coverDimensions':list(tile.size),
                      'coverCropFractionOfArea':round(visible,3),
                      'needsHumanCompositionApproval':True})
    review.append({'destination':id,'photos':items,'visualApproval':'Pending'})
data={'release':'v108','status':'Contact sheet generated from real committed gallery and cover WebPs. This is not human sign-off.',
      'shopCardCropModel':'266x150 centre object-fit cover, preserving the website 150px card height',
      'destinations':review}
ROOT.joinpath('editorial/world-v108-visual-review.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
sheet.save(OUTPUT,'JPEG',quality=77,optimize=True)
if OUTPUT.stat().st_size<20000:raise ValueError('Contact sheet too small or missing')
print('Rendered '+str(len(IDS))+' visual-review gallery rows to '+str(OUTPUT)+
      ' ('+str(round(OUTPUT.stat().st_size/1024))+' KiB)')
