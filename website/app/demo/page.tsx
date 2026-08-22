"use client";

import { useCallback, useEffect, useState } from "react";
import { Nav } from "@/components/Nav";

type DemoResult = {
  prediction: string;
  confidence: number;
  battery_probability: number;
  coin_probability: number;
  emergency: boolean;
  ambiguous: boolean;
  explanation: string;
  inference_ms: number;
  ap_preview: string;
  lateral_preview: string | null;
  overlay_b64: string;
  gradcam_b64: string;
  radial_chart_b64: string;
  ap_halo: { halo_score: number; stepoff_score: number };
  lat_halo: { stepoff_score: number } | null;
  dual_view_used: boolean;
  cv_probs: { battery: number };
  model_probs: { battery: number };
  protocol: {
    urgency: string;
    time_window: string;
    actions: string[];
    contacts: string[];
    reese_law_note: string;
  };
};

const CASES = [
  { id: "battery", title: "button battery", sub: "ap + lateral · classic halo" },
  { id: "coin", title: "single coin", sub: "ap only · homogeneous disc" },
  { id: "stacked", title: "stacked coins", sub: "hard case · false halo" },
  { id: "normal", title: "normal study", sub: "no foreign body" },
];

export default function DemoPage() {
  const [active, setActive] = useState("battery");
  const [data, setData] = useState<DemoResult | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (id: string) => {
    setLoading(true);
    const res = await fetch(`/demos/${id}.json`);
    setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load(active);
  }, [active, load]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const map: Record<string, string> = { "1": "battery", "2": "coin", "3": "stacked", "4": "normal" };
      if (map[e.key]) setActive(map[e.key]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const d = data;
  const verdictClass =
    d?.emergency ? "critical" : d?.prediction.includes("COIN") ? "routine" : "";

  return (
    <div className="page-wide">
      <Nav current="demo" />

      <header className="hero">
        <h1>live demo</h1>
        <p className="hero-lead">
          pre-computed ensemble inference on synthetic pediatric x-rays — same pipeline as the full
          fastapi app. keys 1–4 switch cases.
        </p>
      </header>

      <div className="demo-layout">
        <aside>
          <p className="label">case library</p>
          <div className="case-btns">
            {CASES.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className={`case-btn${active === c.id ? " active" : ""}`}
                onClick={() => setActive(c.id)}
              >
                <strong>
                  {i + 1}. {c.title}
                </strong>
                <span>{c.sub}</span>
              </button>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 16, fontSize: 12 }}>
            for upload + full pytorch inference, clone the repo and run ./scripts/run.sh
          </p>
        </aside>

        <div className="demo-panel">
          {loading || !d ? (
            <p className="loading">running ensemble inference…</p>
          ) : (
            <>
              <div className={`verdict-box ${verdictClass}`}>
                <div className="verdict-title">{d.prediction}</div>
                <span className="muted">
                  {(d.confidence * 100).toFixed(1)}% confidence · {d.inference_ms.toFixed(0)} ms ·{" "}
                  {d.protocol.urgency}
                </span>
              </div>

              <div className="preview-row">
                <figure>
                  <figcaption className="muted">AP</figcaption>
                  <img src={d.ap_preview} alt="AP X-ray" />
                </figure>
                {d.lateral_preview && (
                  <figure>
                    <figcaption className="muted">Lateral</figcaption>
                    <img src={d.lateral_preview} alt="Lateral X-ray" />
                  </figure>
                )}
              </div>

              <div className="prob-row">
                <span>battery</span>
                <div className="bar-track">
                  <div className="bar-fill bar-battery" style={{ width: `${d.battery_probability * 100}%` }} />
                </div>
                <span>{(d.battery_probability * 100).toFixed(0)}%</span>
              </div>
              <div className="prob-row">
                <span>coin</span>
                <div className="bar-track">
                  <div className="bar-fill bar-coin" style={{ width: `${d.coin_probability * 100}%` }} />
                </div>
                <span>{(d.coin_probability * 100).toFixed(0)}%</span>
              </div>

              <p className="muted" style={{ margin: "12px 0", fontSize: 12 }}>
                cv {(d.cv_probs.battery * 100).toFixed(0)}% · cnn {(d.model_probs.battery * 100).toFixed(0)}% ·
                halo {d.ap_halo.halo_score.toFixed(2)} · dual-view {d.dual_view_used ? "yes" : "no"}
                {d.ambiguous ? " · ambiguous halo" : ""}
              </p>

              <p className="muted">{d.explanation}</p>

              <div className="demo-images">
                <figure>
                  <figcaption>overlay</figcaption>
                  <img src={d.overlay_b64} alt="Detection overlay" />
                </figure>
                <figure>
                  <figcaption>grad-cam</figcaption>
                  <img src={d.gradcam_b64} alt="Grad-CAM" />
                </figure>
                <figure>
                  <figcaption>radial profile</figcaption>
                  <img src={d.radial_chart_b64} alt="Radial profile" />
                </figure>
              </div>

              <div className="protocol-box">
                <h3>{d.protocol.urgency} — clinical protocol</h3>
                <p className="muted">{d.protocol.time_window}</p>
                <ul>
                  {d.protocol.actions.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                {d.protocol.contacts.map((c) => (
                  <p key={c} className="muted" style={{ fontSize: 12 }}>
                    {c}
                  </p>
                ))}
                <p className="muted" style={{ marginTop: 12, fontStyle: "italic" }}>
                  {d.protocol.reese_law_note}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <footer>
        <span>⚠ decision support only</span>
        <a href="https://github.com/arjunkshah12345-hash/coincell">full app on github ↗</a>
      </footer>
    </div>
  );
}
