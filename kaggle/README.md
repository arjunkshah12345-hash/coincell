# Haloscan Training on Kaggle

**All model training happens on Kaggle GPU.** Nothing else in your Kaggle account is touched — you only create one new notebook.

---

## Step 1 — Create a NEW notebook (don't edit existing ones)

1. Go to https://www.kaggle.com/code → **New Notebook**
2. Name it: `haloscan-train` (or anything)
3. **Settings** (right panel):
   - **Accelerator → GPU T4 x2** (or P100)
   - **Internet → ON**
4. **Add-ons → Secrets** → add:
   - Name: `HF_TOKEN` · Value: your Hugging Face write token

---

## Step 2 — Upload the training notebook

**Option A — Upload file**
- Download/upload `kaggle/haloscan_train.ipynb` from this repo
- File → Upload notebook

**Option B — Copy from GitHub**
- In the notebook first cell, it clones this repo into `/kaggle/working/` only

---

## Step 3 — Run All

The notebook will:
1. Clone Haloscan source into `/kaggle/working/haloscan-src` (isolated)
2. Train DualViewNet + HaloscanNet on synthetic X-rays (GPU)
3. Evaluate vs Emory 2020 baseline
4. Save `haloscan.pt` + `metrics.json` to `/kaggle/working/`
5. Upload weights to **Hugging Face Hub** → `arjunkshah12345-hash/haloscan-weights`

**Output:** https://huggingface.co/arjunkshah12345-hash/haloscan-weights

---

## Step 4 — Deploy inference (HF Spaces)

After Kaggle upload completes:

```bash
python3 -m huggingface_hub.cli.hf auth login
python3 scripts/deploy_space.py
```

The live app downloads Kaggle-trained weights automatically — no training on your Mac.

---

## What stays on Kaggle

| Path | Contents |
|------|----------|
| `/kaggle/working/haloscan-src/` | Cloned repo (temporary) |
| `/kaggle/working/haloscan.pt` | Trained weights |
| `/kaggle/working/metrics.json` | Benchmark results |

Nothing is added to your existing Kaggle datasets, models, or notebooks.

---

## Re-train

Re-run the notebook anytime (e.g. more epochs). It overwrites the HF Hub weights. The live app picks up new weights on next cold start.

---

## For CAC submission

Mention in your technical answer:
> "Models trained on Kaggle GPU (DualViewNet, 400 samples/class, battery-weighted loss), weights hosted on Hugging Face Hub, inference on HF Spaces."
