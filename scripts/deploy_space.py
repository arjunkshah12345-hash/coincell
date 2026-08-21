#!/usr/bin/env python3
"""One-command Hugging Face Space deploy for CoinCell."""
from __future__ import annotations

import subprocess
import sys


def main():
    repo = "arjunkshah12345-hash/coincell"
    cmds = [
        [sys.executable, "-m", "huggingface_hub.cli.hf", "auth", "whoami"],
        [sys.executable, "-m", "huggingface_hub.cli.hf", "repo", "create", repo, "--type", "space", "--space-sdk", "docker", "--exist-ok"],
        [sys.executable, "-m", "huggingface_hub.cli.hf", "upload", repo, ".", "--repo-type", "space",
         "--exclude", ".git/*", ".venv/*", "__pycache__/*", "*.pt"],
    ]
    print("CoinCell → Hugging Face Spaces\n")
    r = subprocess.run(cmds[0], capture_output=True, text=True)
    if r.returncode != 0:
        print("Not logged in. Run first:")
        print(f"  {sys.executable} -m huggingface_hub.cli.hf auth login")
        sys.exit(1)
    print(f"Logged in as: {r.stdout.strip()}")
    for c in cmds[1:]:
        print(f"\n→ {' '.join(c)}")
        subprocess.run(c, check=True)
    print(f"\n✓ Live at: https://huggingface.co/spaces/{repo}")
    print("  First boot trains model in /tmp (~2 min). Refresh if needed.")


if __name__ == "__main__":
    main()
