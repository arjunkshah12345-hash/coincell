#!/usr/bin/env bash
# Run Haloscan locally — no Hugging Face required
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ ! -f weights/haloscan.pt ]] && [[ ! -f weights/coincell.pt ]]; then
  echo "Missing weights/haloscan.pt — run: python3 scripts/train_cpu.py"
  exit 1
fi

export HALOSCAN_WEIGHTS="$(pwd)/weights/haloscan.pt"
[[ -f "$HALOSCAN_WEIGHTS" ]] || export HALOSCAN_WEIGHTS="$(pwd)/weights/coincell.pt"
echo "Haloscan → http://localhost:7860"
echo "Website → https://haloscan.ideatr.dev"
echo "Weights: $HALOSCAN_WEIGHTS"
python3 app.py
