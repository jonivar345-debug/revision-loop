#!/usr/bin/env python3
"""Convert verified Commons JPEG display derivatives to quality-controlled WebP.
Produces first-party URLs without exposing the source host in shop imagery.
The original Commons artist/source/CC licence fields remain unchanged.
"""
from pathlib import Path
import json
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "world"
records_path = ASSETS / "ATTRIBUTION.json"
records = json.loads(records_path.read_text(encoding="utf-8"))
out_size = 0
converted = 0
for item in records:
    for role, suffix, quality in (("gallery", "gallery", 86), ("cover", "cover", 81)):
        location = item["destination"]
        entries = [x for x in records if x["destination"] == location]
        number = entries.index(item) + 1
        prefix = f"{number:02d}-{suffix}"
        target = ASSETS / location / f"{prefix}.webp"
        source = ASSETS / location / f"{prefix}.jpg"
        if source.exists():
            with Image.open(source) as original:
                picture = ImageOps.exif_transpose(original).convert("RGB")
                if picture.width < 360 or picture.height < 60:
                    # A legitimate 880px-wide panorama can be only ~100px tall.
                    # Original Commons size and rights are checked by the builder.
                    raise ValueError(f"Undersized source {source}")
                picture.save(target, "WEBP", quality=quality, method=5)
            converted += 1
        if not target.exists():
            raise FileNotFoundError(f"Missing local photo asset {target}")
        with Image.open(target) as checked:
            checked.load()
            if checked.format != "WEBP" or checked.width < 360 or checked.height < 60:
                raise ValueError(f"Invalid WebP file {target}")
        size = target.stat().st_size
        if size < 6000 or size > 7 * 1024 * 1024:
            raise ValueError(f"Unexpected WebP size {target} ({size})")
        item[role + "Bytes"] = size
        item["displayed" + ("Gallery" if role == "gallery" else "Cover")] = \
            "./assets/world/" + location + "/" + prefix + ".webp"
        out_size += size
        source.unlink(missing_ok=True)
    item["changes"] = "Display-sized Commons derivative locally converted to WebP; original kept at source"
    item["format"] = "image/webp"
records_path.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(f"Optimized {len(records)} photos in two resolutions; {converted} new WebP files; {out_size/1048576:.1f} MiB")
