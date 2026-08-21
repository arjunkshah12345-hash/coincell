# CoinCell — 3-Minute Demo Video Script (v2)

**Record the live HF Space UI** — dark clinical interface, not a basic form.

---

## 0:00–0:25 — Hook + Congress

> "Congress passed Reese's Law unanimously — 409 to 2 in the House. It made battery compartments child-proof. But when a kid **already swallowed** something, ER doctors still can't tell a battery from a coin on X-ray. They have **two hours** before esophageal necrosis. Stacked coins fake the halo sign. Emory proved ML works in 2020 — **nobody built it.** Until now."

## 0:25–0:55 — Live app walkthrough

- Open CoinCell URL
- Click **Battery** demo → show verdict, probability bars, Grad-CAM heatmap, radial halo chart
- Point to **CRITICAL protocol** panel: 2-hour window, endoscopy checklist, Poison Control number

## 0:55–1:30 — Technical depth (this wins coding points)

- Click **Stacked coins** → ambiguous halo flagged, still triggers emergency protocol
- Upload lateral view on battery case → "Dual-view: Yes" — step-off score updates
- Brief code flash: `halo_analyzer.py` radial profile + `models.py` dual-view fusion

> "Three layers: physics-based halo analysis, a dual-view neural network with battery-weighted loss, and a clinical protocol engine. Grad-CAM shows *why* the model decided."

## 1:30–2:00 — Benchmark

- Scroll to metrics panel: CoinCell vs Emory 2020 baseline
> "We beat the published 81% battery sensitivity on our validation suite — and we catch stacked-coin false halos the paper didn't address."

## 2:00–2:30 — Impact

> "Reese's Law fixed prevention. CoinCell fixes diagnosis — for rural ERs, tele-radiology, 2 AM when the pediatric radiologist isn't there."

## 2:30–3:00 — Close

> "CoinCell. Decision support for pediatrics' highest-stakes window. GitHub, live demo, Congressional App Challenge 2026."

---

**Recording tips:** Show Grad-CAM + radial chart (unique). Mention P.L. 117-171 by name. End with live URL on screen.
