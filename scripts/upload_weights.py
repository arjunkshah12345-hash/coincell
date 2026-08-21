#!/usr/bin/env python3
"""Upload trained weights to Hugging Face Hub (keeps heavy files off local disk)."""
from __future__ import annotations

import argparse
from pathlib import Path

from huggingface_hub import HfApi, create_repo


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--weights", default="/tmp/coincell/coincell.pt")
    p.add_argument("--repo", default="arjunkshah12345-hash/coincell-weights")
    args = p.parse_args()
    weights = Path(args.weights)
    if not weights.exists():
        raise SystemExit(f"Weights not found: {weights}. Run: python train.py")

    create_repo(args.repo, repo_type="model", exist_ok=True)
    api = HfApi()
    api.upload_file(
        path_or_fileobj=str(weights),
        path_in_repo="coincell.pt",
        repo_id=args.repo,
        repo_type="model",
        commit_message="CoinCell ensemble weights",
    )
    print(f"Uploaded → https://huggingface.co/{args.repo}")


if __name__ == "__main__":
    main()
