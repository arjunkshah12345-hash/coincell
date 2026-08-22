"""
Training is done on Kaggle GPU — not locally.

See kaggle/haloscan_train.ipynb and kaggle/README.md
"""
from __future__ import annotations

import sys


def main():
    print("Haloscan training runs on Kaggle (GPU).")
    print()
    print("1. Upload kaggle/haloscan_train.ipynb as a NEW Kaggle notebook")
    print("2. Settings → GPU ON, add HF_TOKEN secret")
    print("3. Run All → weights upload to Hugging Face Hub")
    print()
    print("Guide: kaggle/README.md")
    sys.exit(0)


if __name__ == "__main__":
    main()
