from __future__ import annotations

import os
from pathlib import Path

import torch

from coincell.classifier import load_models

WEIGHTS_ENV = "COINCELL_WEIGHTS"
# Bundled weights (shipped with repo — trained on Kaggle CPU)
BUNDLED = Path(__file__).resolve().parent.parent / "weights" / "coincell.pt"
FALLBACK = Path("/tmp/coincell/coincell.pt")


class WeightsNotFoundError(RuntimeError):
    pass


def load_trained_models(device: str | None = None):
    """Load trained weights from bundled file or COINCELL_WEIGHTS. No Hugging Face."""
    device = device or ("cuda" if torch.cuda.is_available() else "cpu")

    candidates = []
    if os.environ.get(WEIGHTS_ENV):
        candidates.append(Path(WEIGHTS_ENV))
    candidates.extend([BUNDLED, FALLBACK])

    for path in candidates:
        if path.exists():
            return load_models(path, device)

    raise WeightsNotFoundError(
        "No model weights found. Expected weights/coincell.pt in repo, or run:\n"
        "  python3 scripts/train_cpu.py\n"
        "  # or kaggle/coincell_train.ipynb on Kaggle CPU"
    )
