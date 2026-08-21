#!/usr/bin/env python3
"""CPU training script — same logic as Kaggle notebook, runs locally or on Kaggle."""
from __future__ import annotations

import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from coincell import classifier
from coincell.classifier import save_models, train_models


def main():
    out_dir = Path(os.environ.get("COINCELL_OUT", "/tmp/coincell"))
    out_dir.mkdir(parents=True, exist_ok=True)
    weights = out_dir / "coincell.pt"
    metrics_path = out_dir / "metrics.json"

    n = int(os.environ.get("COINCELL_N_PER_CLASS", "100"))
    epochs = int(os.environ.get("COINCELL_EPOCHS", "6"))
    batch = int(os.environ.get("COINCELL_BATCH", "32"))

    orig = classifier.build_dataset
    classifier.build_dataset = lambda n_per_class=n, size=224, dual=True: orig(
        n_per_class=n_per_class, size=224, dual=True
    )

    print(f"CPU training: n_per_class={n}, epochs={epochs}, batch={batch}")
    single, dual = train_models(epochs=epochs, batch_size=batch, device="cpu")
    save_models(single, dual, weights)
    print(f"Saved {weights} ({weights.stat().st_size / 1024:.0f} KB)")

    os.environ["COINCELL_WEIGHTS"] = str(weights)
    import coincell.inference as inf

    inf._engine = None
    from coincell.evaluate import evaluate_on_synthetic

    metrics = evaluate_on_synthetic(n=30)
    metrics_path.write_text(json.dumps(metrics, indent=2))
    print(json.dumps(metrics, indent=2))

    # Upload to HF if token available
    token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN")
    if token:
        from huggingface_hub import HfApi, create_repo

        repo = os.environ.get("COINCELL_HF_REPO", "arjunkshah12345-hash/coincell-weights")
        api = HfApi(token=token)
        create_repo(repo, repo_type="model", exist_ok=True)
        api.upload_file(str(weights), "coincell.pt", repo_id=repo, repo_type="model")
        api.upload_file(str(metrics_path), "metrics.json", repo_id=repo, repo_type="model")
        print(f"Uploaded → https://huggingface.co/{repo}")
    else:
        print("HF_TOKEN not set — weights local only:", weights)


if __name__ == "__main__":
    main()
