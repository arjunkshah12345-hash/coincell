from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np

from coincell.synthetic import generate_sample


def _get_engine():
    from coincell.inference import get_engine
    return get_engine()


BASELINE = {
    "source": "Emory SPR 2020 (Rostad et al.)",
    "battery_sensitivity": 0.81,
    "battery_specificity": 0.92,
    "coin_sensitivity": 0.83,
    "overall_accuracy": 0.88,
}


def evaluate_on_synthetic(n: int = 100) -> dict:
    engine = _get_engine()

    tp_bat = fp_bat = fn_bat = tn_bat = 0
    tp_coin = fp_coin = fn_coin = tn_coin = 0
    ambiguous_correct = 0
    ambiguous_total = 0

    for i in range(n):
        # battery
        ap = generate_sample(0, seed=i)
        rgb = cv2.cvtColor((ap * 255).astype(np.uint8), cv2.COLOR_GRAY2RGB)
        lat = cv2.cvtColor((generate_sample(0, lateral=True, seed=i + 1000) * 255).astype(np.uint8), cv2.COLOR_GRAY2RGB)
        r = engine.analyze(rgb, lat)
        is_bat = r.battery_probability >= 0.5 or r.emergency
        if is_bat:
            tp_bat += 1
        else:
            fn_bat += 1

        # coin
        ap = generate_sample(1, seed=i + 2000)
        rgb = cv2.cvtColor((ap * 255).astype(np.uint8), cv2.COLOR_GRAY2RGB)
        r = engine.analyze(rgb)
        is_coin = "COIN" in r.prediction and not r.emergency
        if is_coin:
            tp_coin += 1
        else:
            fn_coin += 1

        # stacked coins — should trigger ambiguous/emergency
        ap = generate_sample(2, seed=i + 3000)
        rgb = cv2.cvtColor((ap * 255).astype(np.uint8), cv2.COLOR_GRAY2RGB)
        r = engine.analyze(rgb)
        ambiguous_total += 1
        if r.ambiguous or r.emergency:
            ambiguous_correct += 1

    bat_sens = tp_bat / max(1, tp_bat + fn_bat)
    coin_sens = tp_coin / max(1, tp_coin + fn_coin)
    amb_rate = ambiguous_correct / max(1, ambiguous_total)

    return {
        "coincell": {
            "battery_sensitivity": round(bat_sens, 3),
            "coin_sensitivity": round(coin_sens, 3),
            "stacked_coin_emergency_rate": round(amb_rate, 3),
            "n_per_class": n,
        },
        "baseline_emory_2020": BASELINE,
        "beats_baseline_battery_sensitivity": bat_sens >= BASELINE["battery_sensitivity"],
    }


def main():
    import argparse

    p = argparse.ArgumentParser()
    p.add_argument("--out", default="/tmp/coincell/metrics.json")
    p.add_argument("--n", type=int, default=80)
    args = p.parse_args()
    metrics = evaluate_on_synthetic(n=args.n)
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(json.dumps(metrics, indent=2))
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
