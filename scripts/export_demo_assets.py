#!/usr/bin/env python3
"""Export demo case assets for static Vercel demo (no Python backend)."""
from __future__ import annotations

import json
import sys
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "website" / "public" / "demos"
sys.path.insert(0, str(ROOT))

from coincell.inference import get_engine  # noqa: E402
from coincell.synthetic import generate_sample  # noqa: E402
from coincell.visualize import numpy_to_b64  # noqa: E402


CASES = {
    "battery": (0, True),
    "coin": (1, False),
    "stacked": (2, False),
    "normal": (3, False),
}


def gray_preview(gray: np.ndarray) -> str:
    rgb = cv2.cvtColor((gray * 255).astype(np.uint8), cv2.COLOR_GRAY2RGB)
    return numpy_to_b64(rgb)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    engine = get_engine()

    for case, (label, with_lat) in CASES.items():
        ap = generate_sample(label, seed=42)
        ap_rgb = cv2.cvtColor((ap * 255).astype(np.uint8), cv2.COLOR_GRAY2RGB)
        lat_rgb = None
        lat_preview = None
        if with_lat and label == 0:
            lat = generate_sample(0, lateral=True, seed=43)
            lat_rgb = cv2.cvtColor((lat * 255).astype(np.uint8), cv2.COLOR_GRAY2RGB)
            lat_preview = gray_preview(lat)

        result = engine.analyze(ap_rgb, lat_rgb)
        payload = result.to_dict()
        payload["ap_preview"] = gray_preview(ap)
        payload["lateral_preview"] = lat_preview
        path = OUT / f"{case}.json"
        path.write_text(json.dumps(payload, indent=2))
        print(f"✓ {path.name} ({path.stat().st_size // 1024} KB)")

    meta = {
        "cases": [
            {"id": k, "title": k.replace("_", " ").title()} for k in CASES
        ],
        "version": "2.2.0",
    }
    (OUT / "index.json").write_text(json.dumps(meta, indent=2))
    print(f"Done → {OUT}")


if __name__ == "__main__":
    main()
