#!/usr/bin/env python3
"""Resize source-verified Wikimedia photos into efficiently sized local WebPs.

Never recompress previously accepted WebPs; preserve sharp existing pictures.
All new images are subject to size budgets (gallery <= 720 KiB, cover <= 170 KiB)
and minimum dimensions/format checks. Their creator/source/licence metadata
is retained in ATTRIBUTION.json, available from the World image-licence UI.
"""
from pathlib import Path
import json
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "world"
records_path = ASSETS / "ATTRIBUTION.json"
records = json.loads(records_path.read_text(encoding="utf-8"))

policies = {
    "gallery": dict(long_edge=1600, quality=83, min_quality=68, budget=720 * 1024),
    "cover": dict(long_edge=760, quality=79, min_quality=65, budget=170 * 1024),
}

def save_budgeted(source, target, policy):
    with Image.open(source) as original:
        original.load()
        picture = ImageOps.exif_transpose(original).convert("RGB")
        if picture.width < 360 or picture.height < 60:
            raise ValueError(f"Too small to archive: {source}")
        start_width, start_height = picture.size
        limit = policy["long_edge"]
        if max(picture.size) > limit:
            picture.thumbnail((limit, limit), Image.Resampling.LANCZOS)
        # Gradually adjust compression, then dimensions as a last resort.
        for iteration in range(6):
            quality = max(policy["min_quality"], policy["quality"] - iteration * 4)
            picture.save(target, "WEBP", quality=quality, method=6)
            if target.stat().st_size <= policy["budget"]:
                break
            if iteration >= 3:
                picture.thumbnail((round(picture.width * .9), round(picture.height * .9)), Image.Resampling.LANCZOS)
        if target.stat().st_size > policy["budget"]:
            raise ValueError(f"Could not meet photo size budget: {target}")
        if picture.width > start_width or picture.height > start_height:
            raise ValueError(f"Unexpected upscaling: {target}")

out_size = 0
converted = 0
for item in records:
    location = item["destination"]
    entries = [p for p in records if p["destination"] == location]
    number = entries.index(item) + 1
    for role, policy in policies.items():
        prefix = f"{number:02d}-{role}"
        target = ASSETS / location / f"{prefix}.webp"
        source = ASSETS / location / f"{prefix}.jpg"
        if source.exists():
            save_budgeted(source, target, policy)
            converted += 1
            item["newSizeBudgeted"] = True
        if not target.exists():
            raise FileNotFoundError(f"Missing locally hosted photo {target}")
        with Image.open(target) as checked:
            checked.load()
            if checked.format != "WEBP" or checked.width < 180 or checked.height < 50:
                raise ValueError(f"Corrupt or undersized image {target}")
            item[role + "Width"], item[role + "Height"] = checked.size
        size = target.stat().st_size
        if size < 4000 or size > 7 * 1024 * 1024:
            raise ValueError(f"Unexpected WebP size {target}: {size}")
        if item.get("newSizeBudgeted") and size > policy["budget"]:
            raise ValueError(f"New asset exceeds budget: {target}")
        item[role + "Bytes"] = size
        item["displayed" + ("Gallery" if role == "gallery" else "Cover")] = \
            "./assets/world/" + location + "/" + prefix + ".webp"
        out_size += size
        source.unlink(missing_ok=True)
    item["changes"] = "Locally resized WebP display copy; original Commons photographer, original file and licence retained"
    item["format"] = "image/webp"
records_path.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Archive: {len(records)} source photos × 2 copies; {converted} new optimized files; "
      f"{out_size / 1048576:.1f} MiB combined WebP assets")
