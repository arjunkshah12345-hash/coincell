# Deploy CoinCell v2 to Hugging Face Spaces

Your disk is tight — **all compute runs on HF**, not your Mac.

## One-time setup

```bash
pip install huggingface_hub   # on any machine with disk, or Colab
hf auth login
```

## Push Space (Docker — full clinical UI)

```bash
cd ~/Downloads/congressionalappchallenge
hf repo create coincell --type space --space_sdk docker --exist_ok
hf upload arjunkshah12345-hash/coincell . --repo-type space \
  --exclude ".venv/*" "__pycache__/*" "*.pt"
```

Space URL: `https://huggingface.co/spaces/arjunkshah12345-hash/coincell`

First boot auto-trains models in `/tmp` (~2 min CPU). Optional: upload weights for instant cold start:

```bash
python train.py --out /tmp/coincell/coincell.pt   # run on Colab/HF
python scripts/upload_weights.py --repo arjunkshah12345-hash/coincell-weights
```

## What judges see

- Professional dark clinical UI at `/`
- Upload AP + lateral X-rays
- Grad-CAM + radial halo chart + detection overlay
- Clinical protocol with 2-hour window + hotlines
- Live benchmark vs Emory 2020 at `/api/metrics`

## CAC deadline: October 26, 2026

See `SUBMISSION.md` for the 3-minute video script.
