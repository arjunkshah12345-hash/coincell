# Haloscan — No Hugging Face Setup

Everything runs from **GitHub + Kaggle + local**. Weights ship in `weights/haloscan.pt`.

---

## Run the app (local)

```bash
cd ~/Downloads/congressionalappchallenge
pip install -r requirements.txt
chmod +x scripts/run.sh
./scripts/run.sh
```

Open **http://localhost:7860**

---

## Train on Kaggle (CPU)

1. Push notebook: `kaggle kernels push -p kaggle`
2. Or open: https://www.kaggle.com/code/aks1321/haloscan-train-cpu
3. Run All → download `haloscan.pt` from **Output** tab
4. Copy to `weights/haloscan.pt` in this repo

Or train locally:

```bash
python3 scripts/train_cpu.py
cp /tmp/haloscan/haloscan.pt weights/haloscan.pt
```

---

## CAC submission links

| Field | Value |
|-------|--------|
| **Source code** | https://github.com/arjunkshah12345-hash/haloscan |
| **Training** | https://www.kaggle.com/code/aks1321/haloscan-train-cpu |
| **Live demo** | Record `./scripts/run.sh` for video; judges can clone + run |

For a public URL during judging, use GitHub Codespaces or share screen in your demo video.

---

## Metrics (current weights)

See `weights/metrics.json` — 100% battery sensitivity vs 81% Emory 2020 baseline.
