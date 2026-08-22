from __future__ import annotations

import os
from pathlib import Path

import torch

from haloscan.classifier import load_models

WEIGHTS_ENV = "HALOSCAN_WEIGHTS"
LEGACY_WEIGHTS_ENV = "COINCELL_WEIGHTS"
# Bundled weights (shipped with repo — trained on Kaggle CPU)
BUNDLED = Path(__file__).resolve().parent.parent / "weights" / "haloscan.pt"
LEGACY_BUNDLED = Path(__file__).resolve().parent.parent / "weights" / "coincell.pt"
FALLBACK = Path("/tmp/haloscan/haloscan.pt")


class WeightsNotFoundError(RuntimeError):
    pass


def load_trained_models(device: str | None = None):
    """Load trained weights from bundled file or COINCELL_WEIGHTS. No Hugging Face."""
    device = device or ("cuda" if torch.cuda.is_available() else "cpu")

    candidates = []
    for env_key in (WEIGHTS_ENV, LEGACY_WEIGHTS_ENV):
        if os.environ.get(env_key):
            candidates.append(Path(os.environ[env_key]))
    candidates.extend([BUNDLED, LEGACY_BUNDLED, FALLBACK])

    for path in candidates:
        if path.exists():
            return load_models(path, device)

    raise WeightsNotFoundError(
        "No model weights found. Expected weights/haloscan.pt in repo, or run:\n"
        "  python3 scripts/train_cpu.py\n"
        "  # or kaggle/haloscan_train.ipynb on Kaggle CPU"
    )
