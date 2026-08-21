from __future__ import annotations

from datetime import datetime, timezone

from coincell.result import CoinCellResult


def generate_html_report(result: CoinCellResult) -> str:
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    p = result.protocol
    actions = "".join(f"<li>{a}</li>" for a in p.actions)
    contacts = "".join(f"<li>{c}</li>" for c in p.contacts)
    urgency_color = p.color

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>CoinCell Report — {result.prediction}</title>
  <style>
    body {{ font-family: Georgia, serif; max-width: 720px; margin: 2rem auto; color: #1a1a1a; line-height: 1.6; }}
    h1 {{ font-size: 1.5rem; border-bottom: 2px solid #dc2626; padding-bottom: 0.5rem; }}
    .verdict {{ background: #fef2f2; border-left: 4px solid {urgency_color}; padding: 1rem; margin: 1rem 0; }}
    .meta {{ color: #666; font-size: 0.85rem; }}
    .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0; }}
    img {{ max-width: 100%; border: 1px solid #ddd; border-radius: 4px; }}
    .protocol {{ background: #f8fafc; padding: 1rem; border-radius: 8px; }}
    .disclaimer {{ font-size: 0.8rem; color: #888; margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem; }}
    table {{ width: 100%; border-collapse: collapse; margin: 1rem 0; }}
    td, th {{ border: 1px solid #ddd; padding: 0.5rem; text-align: left; }}
    th {{ background: #f1f5f9; }}
  </style>
</head>
<body>
  <h1>CoinCell Analysis Report</h1>
  <p class="meta">Generated {ts} · Decision support only — not a medical device</p>

  <div class="verdict">
    <strong style="font-size:1.25rem">{result.prediction}</strong><br/>
    Confidence: {result.confidence:.1%} · Battery: {result.battery_probability:.1%} · Coin: {result.coin_probability:.1%}
    {" · ⚠️ AMBIGUOUS HALO" if result.ambiguous else ""}
  </div>

  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Halo score (AP)</td><td>{result.ap_halo.halo_score:.3f}</td></tr>
    <tr><td>Step-off score</td><td>{(result.lat_halo.stepoff_score if result.lat_halo else result.ap_halo.stepoff_score):.3f}</td></tr>
    <tr><td>Dual-view fusion</td><td>{"Yes" if result.dual_view_used else "No"}</td></tr>
    <tr><td>CNN battery prob</td><td>{result.model_probs.get("battery", 0):.1%}</td></tr>
    <tr><td>CV battery prob</td><td>{result.cv_probs.get("battery", 0):.1%}</td></tr>
  </table>

  <p><strong>Interpretation:</strong> {result.explanation}</p>

  <div class="grid">
    <div><p><strong>Detection overlay</strong></p><img src="{result.overlay_b64}" alt="Overlay"/></div>
    <div><p><strong>Grad-CAM</strong></p><img src="{result.gradcam_b64}" alt="Grad-CAM"/></div>
  </div>
  <p><strong>Radial halo profile</strong></p>
  <img src="{result.radial_chart_b64}" alt="Radial profile" style="max-width:480px"/>

  <div class="protocol">
    <h2 style="color:{urgency_color}">{p.urgency} — Clinical Protocol</h2>
    <p><em>{p.time_window}</em></p>
    <ul>{actions}</ul>
    <p><strong>Contacts:</strong></p>
    <ul>{contacts}</ul>
    <p style="font-size:0.9rem">{p.reese_law_note}</p>
  </div>

  <p class="disclaimer">
    CoinCell is research decision support tied to Reese's Law (P.L. 117-171) diagnostic gap analysis.
    This report does not constitute medical advice. Suspected button battery ingestion requires immediate emergency care.
    Poison Control: 1-800-222-1222 · National Battery Ingestion Hotline: 202-625-3333
  </p>
</body>
</html>"""
