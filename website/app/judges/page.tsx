import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function JudgesPage() {
  return (
    <div className="page">
      <Nav current="judges" />

      <header className="hero">
        <h1>judge guide</h1>
        <p className="hero-lead">
          90-second verification for congressional app challenge 2026. haloscan addresses the diagnostic
          gap reese&apos;s law (p.l. 117-171) did not cover.
        </p>
      </header>

      <section>
        <p className="label">verify in 90 seconds</p>
        <ol className="muted" style={{ paddingLeft: 18 }}>
          <li style={{ marginBottom: 8 }}>
            open <Link href="/scan">/scan</Link> → press <strong>1</strong> (battery) → CRITICAL protocol
          </li>
          <li style={{ marginBottom: 8 }}>
            press <strong>3</strong> (stacked coins) → emergency flag despite coin mimic
          </li>
          <li style={{ marginBottom: 8 }}>scroll to grad-cam + radial profile explainability</li>
          <li style={{ marginBottom: 8 }}>
            clone repo → <code>python3 tests/smoke_test.py</code> passes
          </li>
          <li>read architecture in github README + TECHNICAL.md</li>
        </ol>
      </section>

      <section>
        <p className="label">rubric mapping</p>
        <div className="timeline">
          <div className="timeline-item">
            <h3>idea</h3>
            <div>
              <p>
                reese&apos;s law fixed prevention; haloscan fixes diagnosis. named clinical failure mode
                (stacked coins / false halo). 2-hour esophageal emergency window.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <h3>implementation</h3>
            <div>
              <p>
                live demo, dual-view upload in full app, ensemble breakdown, grad-cam, clinical protocol,
                html reports, responsive ui, vercel site + offline-capable backend.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <h3>coding</h3>
            <div>
              <p>
                opencv halo physics + dualviewnet pytorch ensemble. kaggle cpu training. smoke tests.
                open source mit. beats emory 2020 baseline on battery sensitivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <p className="label">key files</p>
        <ul className="list">
          {[
            ["haloscan/halo_analyzer.py", "radial halo profiling"],
            ["haloscan/models.py", "DualViewNet fusion"],
            ["haloscan/inference.py", "ensemble + grad-cam"],
            ["haloscan/clinical.py", "protocol engine"],
            ["weights/haloscan.pt", "bundled model weights"],
            ["tests/smoke_test.py", "automated verification"],
          ].map(([file, desc]) => (
            <li key={file}>
              <a
                href={`https://github.com/arjunkshah12345-hash/haloscan/blob/main/${file}`}
                className="row-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <code>{file}</code> — {desc}
                </span>
                <span>↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer>
        <span>not a medical device · no patient data</span>
        <Link href="/">← home</Link>
      </footer>
    </div>
  );
}
