"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Halo = {
  halo_score: number;
  stepoff_score: number;
  battery_score: number;
  coin_score: number;
};

type Protocol = {
  urgency: string;
  color: string;
  time_window: string;
  actions: string[];
  contacts: string[];
  reese_law_note: string;
};

type Result = {
  prediction: string;
  confidence: number;
  battery_probability: number;
  coin_probability: number;
  emergency: boolean;
  ambiguous: boolean;
  explanation: string;
  inference_ms: number;
  ap_halo: Halo;
  lat_halo: Halo | null;
  dual_view_used: boolean;
  model_probs: Record<string, number>;
  cv_probs: Record<string, number>;
  protocol: Protocol;
  overlay_b64: string;
  gradcam_b64: string;
  radial_chart_b64: string;
};

const CASES = [
  { id: "battery", title: "Button battery", sub: "AP + lateral · Case 1", key: "1", fig: "/figures/battery/ap.png" },
  { id: "coin", title: "Single coin", sub: "AP only · Case 2", key: "2", fig: "/figures/coin/ap.png" },
  { id: "stacked", title: "Stacked coins", sub: "False halo · Case 3", key: "3", fig: "/figures/stacked/ap.png" },
  { id: "normal", title: "Normal study", sub: "No foreign body · Case 4", key: "4", fig: "/figures/normal/ap.png" },
];

export function ScanApp() {
  const [apFile, setApFile] = useState<File | null>(null);
  const [latFile, setLatFile] = useState<File | null>(null);
  const [apPreview, setApPreview] = useState<string | null>(null);
  const [latPreview, setLatPreview] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [apiLive, setApiLive] = useState<boolean | null>(null);
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const lastDemo = useRef<string | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.ok && r.json())
      .then((d) => setApiLive(!!d?.model))
      .catch(() => setApiLive(false));
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const onFile = (file: File, kind: "ap" | "lat") => {
    if (!file.type.startsWith("image/")) {
      notify("Upload an image file");
      return;
    }
    const url = URL.createObjectURL(file);
    if (kind === "ap") {
      setApFile(file);
      setApPreview(url);
    } else {
      setLatFile(file);
      setLatPreview(url);
    }
    lastDemo.current = null;
    setActiveCase(null);
  };

  const runDemo = useCallback(async (id: string) => {
    setLoading(true);
    setActiveCase(id);
    lastDemo.current = id;
    try {
      const [res, prev] = await Promise.all([
        fetch(`/api/demo/${id}`),
        fetch(`/api/demo/${id}/previews`).catch(() => null),
      ]);
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
      if (prev?.ok) {
        const p = await prev.json();
        if (p.ap_b64) setApPreview(p.ap_b64);
        if (p.lateral_b64) setLatPreview(p.lateral_b64);
        else setLatPreview(null);
      }
      notify(`Loaded ${id} case — live inference`);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Demo failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const analyze = async () => {
    if (!apFile) return;
    setLoading(true);
    lastDemo.current = null;
    const form = new FormData();
    form.append("ap", apFile);
    if (latFile) form.append("lateral", latFile);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
      notify("Analysis complete");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    setLoading(true);
    try {
      let res: Response;
      if (lastDemo.current) {
        res = await fetch(`/api/demo/${lastDemo.current}/report`);
      } else if (apFile) {
        const form = new FormData();
        form.append("ap", apFile);
        if (latFile) form.append("lateral", latFile);
        res = await fetch("/api/report", { method: "POST", body: form });
      } else return;
      const html = await res.text();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      a.download = `haloscan-report-${Date.now()}.html`;
      a.click();
    } catch {
      notify("Report failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, string> = { "1": "battery", "2": "coin", "3": "stacked", "4": "normal" };
      if (map[e.key]) runDemo(map[e.key]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [runDemo]);

  const r = result;
  const verdictClass = r?.emergency ? "critical" : r?.prediction.includes("COIN") ? "routine" : "";

  return (
    <div className="scan-root">
      <header className="scan-header">
        <div className="scan-brand">
          <div>
            <h1>Haloscan Clinical Scanner</h1>
            <span>Live ensemble inference · PyTorch + OpenCV</span>
          </div>
        </div>
        <div className="scan-nav">
          <span className={`status-pill ${apiLive ? "live" : ""}`}>
            {apiLive === null ? "Connecting…" : apiLive ? "API online" : "API offline"}
          </span>
          <Link href="/">Home</Link>
          <Link href="/judges">Judge Guide</Link>
          <a href="https://github.com/arjunkshah12345-hash/haloscan" target="_blank" rel="noopener noreferrer">
            Source
          </a>
        </div>
      </header>

      <div className="example-strip">
        <h2>Reference cases — select to run live inference (keys 1–4)</h2>
        <div className="example-grid">
          {CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`example-card ${activeCase === c.id ? "active" : ""}`}
              onClick={() => runDemo(c.id)}
            >
              <img src={c.fig} alt={c.title} />
              <div className="example-card-body">
                <strong>
                  {c.key}. {c.title}
                </strong>
                <span>{c.sub}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="scan-layout">
        <section className="scan-panel">
          <h2>1. Upload Radiographs</h2>
          <p className="scan-lead">
            Upload an AP (anteroposterior) view, required. Add a lateral view when available. Analysis runs on
            the server using the full Haloscan ensemble—not pre-recorded results.
          </p>

          <label
            className="dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0], "ap");
            }}
          >
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0], "ap")} />
            {!apPreview ? (
              <>
                <strong>AP (frontal) radiograph</strong>
                <span style={{ color: "var(--muted)", fontSize: "15px" }}>Click or drag to upload</span>
              </>
            ) : (
              <img src={apPreview} alt="AP" />
            )}
          </label>

          <label
            className="dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0], "lat");
            }}
          >
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0], "lat")} />
            {!latPreview ? (
              <>
                <strong>Lateral radiograph</strong>
                <span style={{ color: "var(--muted)", fontSize: "15px" }}>Optional</span>
              </>
            ) : (
              <img src={latPreview} alt="Lateral" />
            )}
          </label>

          <button className="btn-analyze" disabled={!apFile || loading} onClick={analyze}>
            Run Analysis
          </button>

          <p className="scan-lead" style={{ marginTop: "1.25rem", marginBottom: "0.5rem" }}>
            Reference cases (keyboard shortcuts 1–4)
          </p>
          <div className="case-grid">
            {CASES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`case-btn ${activeCase === c.id ? "on" : ""}`}
                onClick={() => runDemo(c.id)}
              >
                <strong>
                  {c.key}. {c.title}
                </strong>
                <em>{c.sub}</em>
              </button>
            ))}
          </div>
        </section>

        <section className={`scan-panel ${r ? "" : "hidden"}`}>
          {!r ? null : (
            <>
              <div className={`verdict ${verdictClass}`}>
                <div className="verdict-title">{r.prediction}</div>
                <div className="verdict-meta">
                  {(r.confidence * 100).toFixed(1)}% confidence · {r.inference_ms.toFixed(0)} ms · {r.protocol.urgency}
                </div>
              </div>
              {r.emergency && (
                <div className="emergency-strip">
                  Treat as battery emergency until endoscopy excludes esophageal lodgement
                </div>
              )}

              <div className="prob-row">
                <span>Battery</span>
                <div className="bar-track">
                  <div className="bar-fill bar-bat" style={{ width: `${r.battery_probability * 100}%` }} />
                </div>
                <span>{(r.battery_probability * 100).toFixed(0)}%</span>
              </div>
              <div className="prob-row">
                <span>Coin</span>
                <div className="bar-track">
                  <div className="bar-fill bar-coin" style={{ width: `${r.coin_probability * 100}%` }} />
                </div>
                <span>{(r.coin_probability * 100).toFixed(0)}%</span>
              </div>

              <div className="ensemble">
                <strong>Ensemble breakdown</strong>
                <div className="ensemble-grid">
                  <div>
                    CV {(r.cv_probs.battery * 100).toFixed(0)}%
                    <div className="mini-bar">
                      <div className="bar-fill bar-bat" style={{ width: `${r.cv_probs.battery * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    CNN {(r.model_probs.battery * 100).toFixed(0)}%
                    <div className="mini-bar">
                      <div className="bar-fill bar-bat" style={{ width: `${(r.model_probs.battery ?? 0) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    Fused {(r.battery_probability * 100).toFixed(0)}%
                    <div className="mini-bar">
                      <div className="bar-fill bar-bat" style={{ width: `${r.battery_probability * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ color: "var(--secondary)", fontSize: "16px", lineHeight: 1.65 }}>{r.explanation}</p>

              <div className="img-grid">
                <figure>
                  <figcaption>Overlay</figcaption>
                  <img src={r.overlay_b64} alt="Overlay" />
                </figure>
                <figure>
                  <figcaption>Grad-CAM</figcaption>
                  <img src={r.gradcam_b64} alt="Grad-CAM" />
                </figure>
                <figure>
                  <figcaption>Radial profile</figcaption>
                  <img src={r.radial_chart_b64} alt="Radial" />
                </figure>
              </div>

              <div className="protocol">
                <h3 style={{ color: r.protocol.color }}>{r.protocol.urgency} — Clinical Protocol</h3>
                <p style={{ color: "var(--critical)", fontSize: "16px", fontWeight: 700 }}>{r.protocol.time_window}</p>
                <ul>
                  {r.protocol.actions.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                {r.protocol.contacts.map((c) => (
                  <p key={c} style={{ color: "var(--muted)", fontSize: "15px" }}>
                    {c}
                  </p>
                ))}
                <p style={{ color: "var(--muted)", fontSize: "15px", fontStyle: "italic", marginTop: "12px" }}>
                  {r.protocol.reese_law_note}
                </p>
              </div>

              <div className="actions">
                <button type="button" className="btn-sec" onClick={downloadReport}>
                  Download report
                </button>
                <button
                  type="button"
                  className="btn-sec"
                  onClick={() => {
                    if (!r) return;
                    navigator.clipboard.writeText(
                      `Haloscan: ${r.prediction}\nBattery ${(r.battery_probability * 100).toFixed(0)}%\n${r.explanation}`,
                    );
                    notify("Copied");
                  }}
                >
                  Copy summary
                </button>
              </div>
            </>
          )}
        </section>

        <aside className="scan-panel">
          <h2>Analysis Pipeline</h2>
          <p className="scan-lead">
            Each request executes the full Haloscan engine on the server: OpenCV halo profiling, DualViewNet
            fusion, Grad-CAM explainability, and clinical protocol generation.
          </p>
          <ul className="scan-sidebar-list">
            <li>100% battery sensitivity vs. 81% Emory 2020 baseline</li>
            <li>Conservative handling of stacked-coin false halos</li>
            <li>No patient data stored or transmitted beyond analysis</li>
            <li>Context: Reese&apos;s Law (P.L. 117-171)</li>
          </ul>
          <p className="scan-lead" style={{ marginTop: "16px", fontSize: "14px" }}>
            Decision support only — not a medical device.
          </p>
        </aside>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          Running ensemble inference…
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
