#!/usr/bin/env python3
"""Export publication figures for the Haloscan marketing site."""
from __future__ import annotations

import base64
import json
import sys
from io import BytesIO
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "website" / "public" / "figures"
sys.path.insert(0, str(ROOT))

from haloscan.inference import get_engine  # noqa: E402
from haloscan.synthetic import generate_sample  # noqa: E402

CASES = {
    "battery": (0, True, "Button battery (AP + lateral)"),
    "coin": (1, False, "Single coin (AP)"),
    "stacked": (2, False, "Stacked coins — false halo case"),
    "normal": (3, False, "Normal study (no foreign body)"),
}


def b64_to_png(data_uri: str, path: Path) -> None:
    if not data_uri or not data_uri.startswith("data:"):
        return
    _, b64 = data_uri.split(",", 1)
    raw = base64.b64decode(b64)
    Image.open(BytesIO(raw)).save(path, format="PNG", optimize=True)


def gray_to_png(gray: np.ndarray, path: Path) -> None:
    u8 = (np.clip(gray, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(u8, mode="L").save(path, format="PNG", optimize=True)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    engine = get_engine()
    manifest: list[dict] = []

    for case_id, (label, with_lat, caption) in CASES.items():
        case_dir = OUT / case_id
        case_dir.mkdir(exist_ok=True)

        ap = generate_sample(label, seed=42)
        ap_rgb = cv2.cvtColor((ap * 255).astype(np.uint8), cv2.COLOR_GRAY2RGB)
        lat_rgb = None
        if with_lat and label == 0:
            lat = generate_sample(0, lateral=True, seed=43)
            lat_rgb = cv2.cvtColor((lat * 255).astype(np.uint8), cv2.COLOR_GRAY2RGB)

        gray_to_png(ap, case_dir / "ap.png")
        if lat_rgb is not None:
            gray_to_png(generate_sample(0, lateral=True, seed=43), case_dir / "lateral.png")

        result = engine.analyze(ap_rgb, lat_rgb)
        d = result.to_dict()

        b64_to_png(d["overlay_b64"], case_dir / "overlay.png")
        b64_to_png(d["gradcam_b64"], case_dir / "gradcam.png")
        b64_to_png(d["radial_chart_b64"], case_dir / "radial.png")

        meta = {
            "id": case_id,
            "caption": caption,
            "prediction": d["prediction"],
            "battery_probability": round(d["battery_probability"], 3),
            "coin_probability": round(d["coin_probability"], 3),
            "emergency": d["emergency"],
            "urgency": d["protocol"]["urgency"],
            "inference_ms": round(d["inference_ms"], 1),
        }
        (case_dir / "meta.json").write_text(json.dumps(meta, indent=2))
        manifest.append(meta)
        print(f"✓ {case_id}: {d['prediction']} ({d['protocol']['urgency']})")

    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2))
    print(f"Done → {OUT}")


if __name__ == "__main__":
    main()
