from __future__ import annotations

import os
from pathlib import Path

import torch

from coincell.classifier import load_models


WEIGHTS_ENV = "COINCELL_WEIGHTS"
HF_MODEL_REPO = os.environ.get("COINCELL_HF_REPO", "arjunkshah12345-hash/coincell-weights")
DEFAULT_WEIGHTS = Path("/tmp/coincell/coincell.pt")


class WeightsNotFoundError(RuntimeError):
    pass


def load_trained_models(device: str | None = None):
    """Load Kaggle-trained weights from local path or Hugging Face Hub. Never trains."""
    device = device or ("cuda" if torch.cuda.is_available() else "cpu")
    env_path = os.environ.get(WEIGHTS_ENV)
    if env_path and Path(env_path).exists():
        return load_models(env_path, device)

    path = DEFAULT_WEIGHTS
    if path.exists():
        return load_models(path, device)

    try:
        from huggingface_hub import hf_hub_download

        hub_path = hf_hub_download(
            repo_id=HF_MODEL_REPO,
            filename="coincell.pt",
            local_dir=str(path.parent),
        )
        return load_models(hub_path, device)
    except Exception as e:
        raise WeightsNotFoundError(
            f"Could not load Kaggle-trained weights from {HF_MODEL_REPO}. "
            "Run kaggle/coincell_train.ipynb on Kaggle (GPU), or set COINCELL_WEIGHTS. "
            f"Original error: {e}"
        ) from e
