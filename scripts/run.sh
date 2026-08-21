#!/usr/bin/env bash
# Run CoinCell locally — no Hugging Face required
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f weights/coincell.pt ]]; then
  echo "Missing weights/coincell.pt — run: python3 scripts/train_cpu.py"
  exit 1
fi

export COINCELL_WEIGHTS="$(pwd)/weights/coincell.pt"
echo "CoinCell → http://localhost:7860"
echo "Weights: $COINCELL_WEIGHTS"
python3 app.py
