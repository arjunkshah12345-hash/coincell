from __future__ import annotations

import io
import time
from contextlib import asynccontextmanager
from functools import lru_cache
from pathlib import Path

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image

from coincell.evaluate import evaluate_on_synthetic
from coincell.inference import get_engine
from coincell.report import generate_html_report
from coincell.synthetic import generate_sample

STATIC = Path(__file__).resolve().parent.parent / "static"

_metrics_cache: dict | None = None
_metrics_cache_time: float = 0
METRICS_TTL = 3600  # 1 hour


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm up model on startup so first user request is fast
    get_engine()
    yield


app = FastAPI(title="CoinCell API", version="2.1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


def _read_upload(f: UploadFile | None) -> np.ndarray | None:
    if f is None:
        return None
    data = f.file.read()
    if len(data) > 20 * 1024 * 1024:
        raise HTTPException(413, "Image too large (max 20 MB)")
    img = Image.open(io.BytesIO(data)).convert("RGB")
    return np.array(img)


def _run_demo(case: str):
    mapping = {
        "battery": (0, True),
        "coin": (1, False),
        "stacked": (2, False),
        "normal": (3, False),
    }
    if case not in mapping:
        raise HTTPException(404, f"Unknown case: {case}. Try: battery, coin, stacked, normal")
    label, with_lat = mapping[case]
    ap = generate_sample(label, seed=42)
    ap_rgb = cv2.cvtColor((ap * 255).astype(np.uint8), cv2.COLOR_GRAY2RGB)
    lat_rgb = None
    if with_lat and label == 0:
        lat = generate_sample(0, lateral=True, seed=43)
        lat_rgb = cv2.cvtColor((lat * 255).astype(np.uint8), cv2.COLOR_GRAY2RGB)
    return get_engine().analyze(ap_rgb, lat_rgb)


@app.get("/judge")
async def judge_guide():
    judge = STATIC / "judge.html"
    if judge.exists():
        return FileResponse(judge)
    raise HTTPException(404)


@app.get("/")
async def root():
    index = STATIC / "index.html"
    if index.exists():
        return FileResponse(index)
    return JSONResponse({"service": "CoinCell API", "docs": "/docs"})


@app.post("/api/analyze")
async def analyze(
    ap: UploadFile = File(...),
    lateral: UploadFile | None = File(None),
):
    ap_img = _read_upload(ap)
    if ap_img is None:
        raise HTTPException(400, "AP image required")
    lat_img = _read_upload(lateral)
    result = get_engine().analyze(ap_img, lat_img)
    return result.to_dict()


@app.post("/api/report")
async def report(
    ap: UploadFile = File(...),
    lateral: UploadFile | None = File(None),
):
    ap_img = _read_upload(ap)
    if ap_img is None:
        raise HTTPException(400, "AP image required")
    lat_img = _read_upload(lateral)
    result = get_engine().analyze(ap_img, lat_img)
    html = generate_html_report(result)
    return HTMLResponse(html, headers={"Content-Disposition": "attachment; filename=coincell-report.html"})


@app.get("/api/demo/{case}")
async def demo(case: str):
    result = _run_demo(case)
    return result.to_dict()


@app.get("/api/demo/{case}/report")
async def demo_report(case: str):
    result = _run_demo(case)
    return HTMLResponse(
        generate_html_report(result),
        headers={"Content-Disposition": f"attachment; filename=coincell-{case}-report.html"},
    )


@app.get("/api/cases")
async def cases():
    return [
        {"id": "battery", "title": "Button battery (AP + lateral)", "description": "Classic double halo + step-off"},
        {"id": "coin", "title": "Single coin", "description": "Homogeneous disc density"},
        {"id": "stacked", "title": "Stacked coins", "description": "False halo mimic — should trigger emergency"},
        {"id": "normal", "title": "Normal study", "description": "No foreign body"},
    ]


@app.get("/api/metrics")
async def metrics(refresh: bool = False):
    global _metrics_cache, _metrics_cache_time
    now = time.time()
    if not refresh and _metrics_cache and (now - _metrics_cache_time) < METRICS_TTL:
        return _metrics_cache
    _metrics_cache = evaluate_on_synthetic(n=40)
    _metrics_cache_time = now
    return _metrics_cache


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "2.1.0", "model": "loaded"}


if STATIC.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC)), name="static")
