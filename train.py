#!/usr/bin/env python3
"""Train CoinCell v2 models → /tmp (keeps user disk clean)."""
from __future__ import annotations

import argparse
from pathlib import Path

from coincell.classifier import save_models, train_models


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--out", default="/tmp/coincell/coincell.pt")
    p.add_argument("--epochs", type=int, default=10)
    args = p.parse_args()
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    print(f"Training dual-view ensemble → {out}")
    single, dual = train_models(epochs=args.epochs)
    save_models(single, dual, out)
    print("Done.")


if __name__ == "__main__":
    main()
