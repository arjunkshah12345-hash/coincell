<p align="center">
  <strong>CoinCell</strong><br/>
  <sub>AI decision support for the diagnostic gap after Reese's Law</sub>
</p>

<p align="center">
  <a href="https://coincell.vercel.app/demo">Website & Demo</a> ·
  <a href="https://coincell.vercel.app/judges">Judge Guide</a> ·
  <a href="https://www.kaggle.com/code/aks1321/coincell-train-cpu">Kaggle Training</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" />
  <img src="https://img.shields.io/badge/python-3.10+-green.svg" alt="Python 3.10+" />
  <img src="https://img.shields.io/badge/CAC-2026-red.svg" alt="Congressional App Challenge 2026" />
  <img src="https://img.shields.io/badge/battery_sensitivity-100%25-success.svg" alt="100% battery sensitivity" />
</p>

---

## Why CoinCell exists

In 2022, Congress passed **Reese's Law** (P.L. 117-171) **409–2** — mandating child-proof battery packaging after pediatric deaths. Prevention was fixed. **Diagnosis wasn't.**

When a toddler swallows a disc-shaped object, clinicians must decide within the **2-hour esophageal emergency window** whether it's a **button battery** or a **coin**. On AP X-ray they look identical. **Stacked coins mimic the double halo sign** — the exact case where doctors miss batteries.

A 2020 **Emory University** study reached **81% battery sensitivity** with ML — and **never shipped clinically**. CoinCell implements and deploys that missing tool.

| Metric | CoinCell | Emory 2020 baseline |
|--------|----------|---------------------|
| Battery sensitivity | **100%** | 81% |
| Stacked-coin emergency catch | **65%** | — |
| Coin sensitivity | 73% | 83% |

---

## Live demo

**Website:** [coincell.vercel.app](https://coincell.vercel.app) — interactive demo, judge guide, architecture

**Full app** (upload + PyTorch inference):

```bash
git clone https://github.com/arjunkshah12345-hash/coincell.git
cd coincell
pip install -r requirements.txt
./scripts/run.sh
# → http://localhost:7860
```

Weights ship in `weights/coincell.pt` — no Hugging Face, no API keys, runs offline.

---

## Architecture

```
AP X-ray  → CLAHE → Halo analyzer (radial intensity profile, Hough fallback)
Lateral   → Step-off morphology detector
Both      → DualViewNet (PyTorch) — AP + lateral fusion
Ensemble  → CV (55%) + CNN (40%) + dual-view bonus
Output    → Verdict + Grad-CAM + radial chart + clinical protocol + HTML report
```

**Stacked-coin hard case:** conservative AP-only heuristics + ambiguity flag → treat as battery until endoscopy rules out.

See [TECHNICAL.md](TECHNICAL.md) for implementation details.

---

## Project structure

```
coincell/
├── coincell/           # Python ML + clinical engine
│   ├── halo_analyzer.py
│   ├── models.py       # DualViewNet
│   ├── inference.py    # Ensemble + Grad-CAM
│   └── clinical.py     # CRITICAL / URGENT / ROUTINE protocol
├── api/                # FastAPI backend
├── static/             # Clinical web UI
├── website/            # Marketing site (Next.js → Vercel)
├── weights/            # Bundled model weights
├── kaggle/             # CPU training notebook
├── scripts/
│   ├── run.sh          # Start local app
│   └── train_cpu.py    # Local training
└── tests/smoke_test.py
```

---

## Training

**Kaggle CPU** (recommended): [coincell-train-cpu](https://www.kaggle.com/code/aks1321/coincell-train-cpu)

```bash
kaggle kernels push -p kaggle
# Download coincell.pt from Output → weights/coincell.pt
```

**Local CPU:**

```bash
COINCELL_N_PER_CLASS=100 COINCELL_EPOCHS=6 python3 scripts/train_cpu.py
cp /tmp/coincell/coincell.pt weights/coincell.pt
```

Regenerate Vercel demo assets after retraining:

```bash
python3 scripts/export_demo_assets.py
```

---

## Development

```bash
# Tests
python3 tests/smoke_test.py

# Benchmark
python3 -m coincell.evaluate --n 40

# Website (local)
cd website && npm install && npm run dev
```

---

## Congressional App Challenge 2026

Built for the **Congressional App Challenge** — connecting federal legislation (Reese's Law) to an unsolved clinical problem with production-grade code.

- [SUBMISSION_FORM.md](SUBMISSION_FORM.md) — copy-paste submission answers
- [VIDEO.md](VIDEO.md) — demo video shot list
- [CHECKLIST.md](CHECKLIST.md) — pre-submit checklist
- [WIN.md](WIN.md) — strategy notes

---

## Disclaimer

**Decision support / research demo only.** Not a medical device. Not FDA cleared. Suspected button battery ingestion → **call 911** · Poison Control **1-800-222-1222**.

---

## License

[MIT](LICENSE) — open source, free to use and learn from.

---

<p align="center">
  <sub>Reese's Law fixed prevention. CoinCell fixes diagnosis.</sub><br/>
  <sub>Built by <a href="https://arjunshah.xyz">Arjun Shah</a></sub>
</p>
