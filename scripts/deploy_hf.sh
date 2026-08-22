#!/usr/bin/env bash
# Deploy Haloscan to Hugging Face Spaces (runs from repo root)
# Usage: HF_TOKEN=hf_xxx ./scripts/deploy_hf.sh your-username
set -euo pipefail
USER="${1:?Usage: ./scripts/deploy_hf.sh HF_USERNAME}"
SPACE="${USER}/haloscan"
echo "Creating/updating Space: $SPACE"
python3 -m pip install -q huggingface_hub
python3 <<PY
from huggingface_hub import HfApi, create_repo
api = HfApi()
create_repo("$SPACE", repo_type="space", space_sdk="gradio", exist_ok=True)
api.upload_folder(
    folder_path=".",
    repo_id="$SPACE",
    repo_type="space",
    ignore_patterns=[".venv/**", "__pycache__/**", ".git/**", "*.pt"],
)
print("Uploaded. Enable Space at: https://huggingface.co/spaces/$SPACE")
PY
