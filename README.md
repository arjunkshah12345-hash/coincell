---
title: CoinCell
emoji: 🩻
colorFrom: red
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
license: mit
short_description: Button battery vs coin pediatric X-ray AI (Reese's Law)
---

# CoinCell 🩻

**Production-grade AI for the diagnostic gap Congress left after Reese's Law.**

When a child swallows a disc-shaped object, ER teams must distinguish a **button battery** from a **coin** on X-ray within ~**2 hours**. Stacked coins mimic the double halo sign. Emory's 2020 ML paper (88% accuracy) never became a product — CoinCell does.

## What makes this real (not a demo)

| Feature | Detail |
|---------|--------|
| **Dual-view fusion CNN** | Separate AP + lateral encoders with fusion head |
| **CV halo analyzer** | Radial intensity profiling for double-halo sign |
| **Grad-CAM explainability** | Shows what the model focuses on |
| **Clinical protocol engine** | 2-hour window, action checklist, hotlines |
| **Stacked-coin detection** | Flags ambiguous halos → treat as emergency |
| **Benchmark vs Emory 2020** | Live `/api/metrics` comparison |
| **Downloadable clinical report** | HTML report with overlays, protocol, hotlines |
| **Hough circle fallback** | Robust disc detection on low-contrast X-rays |
| **Cached benchmarks** | `/api/metrics` with 1hr TTL vs Emory 2020 |

## Architecture

```
AP X-ray ──► Halo analyzer ──┐
                             ├──► Ensemble ──► Verdict + Protocol
Lateral ───► Step-off CV ────┤
         ──► Dual-view CNN ──┘
                    └──► Grad-CAM overlay
```

## GitHub (live)

**https://github.com/arjunkshah12345-hash/coincell**

[![Tests](https://github.com/arjunkshah12345-hash/coincell/actions/workflows/test.yml/badge.svg)](https://github.com/arjunkshah12345-hash/coincell/actions)

## Deploy live demo (required for submission)

```bash
hf auth login
hf repo create coincell --type space --space_sdk docker
hf upload arjunkshah12345-hash/coincell . --repo-type space
```

## Local run

```bash
python3 -m venv /tmp/coincell-venv && source /tmp/coincell-venv/bin/activate
pip install -r requirements.txt
python train.py --out /tmp/coincell/coincell.pt
COINCELL_WEIGHTS=/tmp/coincell/coincell.pt python app.py
```

Open http://localhost:7860

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Clinical UI |
| `/api/analyze` | POST | AP + optional lateral upload |
| `/api/demo/{battery,coin,stacked}` | GET | Synthetic case |
| `/api/metrics` | GET | Benchmark vs Emory 2020 |

## Congressional App Challenge

| Field | Text |
|-------|------|
| **Purpose** | Close the Reese's Law diagnostic gap |
| **Inspired by** | P.L. 117-171 fixed packaging; ML research never shipped |
| **Technical depth** | Dual-view fusion, battery-weighted loss, Grad-CAM, clinical protocol |

## Disclaimer

Decision support only — **not a medical device.** MIT License.
