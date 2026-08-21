from __future__ import annotations

import base64
import io

import cv2
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np


def radial_profile_chart(profile: list[float], halo_score: float) -> str:
    """Return base64 PNG data URI for radial intensity profile."""
    if not profile:
        fig, ax = plt.subplots(figsize=(4, 2.5), dpi=100)
        ax.text(0.5, 0.5, "No disc detected", ha="center", va="center")
        ax.axis("off")
    else:
        fig, ax = plt.subplots(figsize=(4, 2.5), dpi=100)
        x = np.arange(len(profile))
        ax.plot(x, profile, color="#2563eb", linewidth=2, marker="o", markersize=4)
        ax.fill_between(x, profile, alpha=0.15, color="#2563eb")
        ax.axhline(halo_score, color="#dc2626", linestyle="--", linewidth=1, label=f"Halo score {halo_score:.2f}")
        ax.set_xlabel("Radius (center → edge)")
        ax.set_ylabel("Normalized intensity")
        ax.set_title("Radial Halo Profile")
        ax.legend(fontsize=7)
        ax.grid(True, alpha=0.3)
        ax.set_ylim(0, 1.05)

    buf = io.BytesIO()
    fig.tight_layout()
    fig.savefig(buf, format="png", facecolor="white", bbox_inches="tight")
    plt.close(fig)
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f"data:image/png;base64,{b64}"


def numpy_to_b64(img: np.ndarray, fmt: str = "png") -> str:
    if img.dtype != np.uint8:
        if img.max() <= 1.0:
            img = (img * 255).astype(np.uint8)
        else:
            img = img.astype(np.uint8)
    if img.ndim == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
    elif img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    ok, buf = cv2.imencode(f".{fmt}", cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
    if not ok:
        return ""
    return f"data:image/{fmt};base64,{base64.b64encode(buf).decode()}"
