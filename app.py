"""CoinCell entrypoint — FastAPI clinical UI on port 7860 (HF Spaces compatible)."""

import os

import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "7860"))
    uvicorn.run("api.main:app", host="0.0.0.0", port=port, log_level="info")
