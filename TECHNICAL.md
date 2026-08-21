# CoinCell — Technical Documentation

For Congressional App Challenge judges evaluating **coding depth**.

## Problem statement

After Reese's Law (P.L. 117-171), button battery packaging became child-resistant. The **diagnostic gap** remains: on pediatric chest X-rays, button batteries and coins appear as radiopaque discs. The "double halo sign" distinguishes batteries on AP view — but **stacked coins create false halos**. Esophageal battery impaction requires endoscopy within ~2 hours.

**Published baseline:** Rostad et al., Emory SPR 2020 — YOLOv2 on 228 images, 81% battery sensitivity, 88% overall accuracy. Never deployed clinically.

## Architecture

```
┌─────────────┐     ┌──────────────────┐
│  AP X-ray   │────►│ CLAHE + invert   │────► Radial halo profiler
└─────────────┘     └──────────────────┘              │
                                                        ├──► Ensemble ──► Verdict
┌─────────────┐     ┌──────────────────┐              │         │
│  Lateral    │────►│ Step-off analyzer│──────────────┘         ├──► Grad-CAM
└─────────────┘     └──────────────────┘                        │
                                                        DualViewNet ──► Protocol engine
```

### 1. Computer vision layer (`halo_analyzer.py`)

- **Disc localization:** Otsu thresholding → contour circularity scoring → Hough circle fallback → adaptive threshold fallback
- **Radial profile:** Sample intensity at increasing radii from disc center; normalize to [0,1]
- **Halo score:** Detect dip between inner peaks (lucent ring of battery rim)
- **Step-off score:** Vertical mass asymmetry on lateral view (battery pole geometry)

### 2. Neural network layer (`models.py`)

- **CoinCellNet:** Single-view 3-block CNN (32→64→128 channels)
- **DualViewNet:** Twin encoders + fusion MLP — lateral view reduces stacked-coin false positives
- **Battery-weighted loss:** `CrossEntropyLoss(weights=[3.0, 1.0, 0.5])` — missing a battery costs 3× more than missing a coin

### 3. Ensemble fusion (`inference.py`)

```
battery_prob = 0.50·CV + 0.40·CNN + 0.10·(1 - coin_CNN) + dual_bonus
```

Ambiguity rule: `halo > 0.40 AND stepoff < 0.38` → flag as emergency regardless of coin probability.

### 4. Explainability (`gradcam.py`)

Gradient-weighted Class Activation Mapping on the final conv block, target class = battery. Overlaid on original X-ray for clinician trust.

### 5. Clinical protocol (`clinical.py`)

Rule-based engine mapping probability + ambiguity → CRITICAL / URGENT / ROUTINE with action checklists and hotlines.

## Training data

Synthetic generator (`synthetic.py`) produces:
- Battery AP (double halo)
- Battery lateral (step-off rectangle)
- Single coin (homogeneous disc)
- **Stacked coins** (offset double disc — false halo mimic)
- Normal chest (ribs, spine, noise)

No PHI. No large downloads. Trains in `/tmp` on first boot (~2 min CPU).

## Evaluation (`evaluate.py`)

Synthetic holdout with fixed seeds. Metrics:
- Battery sensitivity (dual-view)
- Coin sensitivity
- Stacked-coin emergency catch rate
- Comparison vs Emory 2020 baseline

## API surface

| Route | Purpose |
|-------|---------|
| `POST /api/analyze` | Full inference pipeline |
| `POST /api/report` | Downloadable HTML clinical report |
| `GET /api/demo/{case}` | Synthetic test cases |
| `GET /api/metrics` | Cached benchmark (1hr TTL) |

## What we'd do with real data

1. Fine-tune on de-identified institutional foreign-body series (IRB)
2. External validation on Hopkins RFO Bench (144 critical RFO cases)
3. Prospective reader study: ML-assisted vs unassisted radiologist accuracy

## References

- Reese's Law: 15 U.S.C. § 2056e (P.L. 117-171)
- Rostad CA et al. Pediatric Radiol. 2020 — ML for battery/coin detection
- Litovitz T et al. — National Battery Ingestion Hotline data
