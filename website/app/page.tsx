import Link from "next/link";
import { Nav } from "@/components/Nav";

const METRICS = {
  battery: "100%",
  stacked: "65%",
  baseline: "81%",
};

export default function HomePage() {
  return (
    <div className="page">
      <Nav current="home" />

      <header className="hero">
        <div className="badge-row">
          <span className="badge">congressional app challenge 2026</span>
          <span className="badge">p.l. 117-171</span>
          <span className="badge">mit · open source</span>
        </div>
        <h1>coincell</h1>
        <p className="hero-lead">
          ai decision support that distinguishes button batteries from coins on pediatric x-rays —
          closing the diagnostic gap reese&apos;s law left open. stacked coins mimic the double halo sign;
          coincell fuses computer vision with dual-view deep learning and ships a clinical protocol engine.
        </p>
        <div className="cta-row">
          <Link href="/demo" className="btn">
            try live demo →
          </Link>
          <a
            href="https://github.com/arjunkshah12345-hash/coincell"
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            view source ↗
          </a>
        </div>
      </header>

      <section>
        <p className="label">benchmark</p>
        <div className="stats">
          <div className="stat">
            <strong>{METRICS.battery}</strong>
            <span>battery sensitivity</span>
          </div>
          <div className="stat">
            <strong>{METRICS.stacked}</strong>
            <span>stacked-coin catch rate</span>
          </div>
          <div className="stat">
            <strong>{METRICS.baseline}</strong>
            <span>emory 2020 baseline</span>
          </div>
        </div>
        <p className="muted">
          trained on kaggle cpu · weights bundled in repo · runs fully offline · no patient data stored
        </p>
      </section>

      <section>
        <p className="label">the problem</p>
        <div className="timeline">
          <div className="timeline-item">
            <h3>2022</h3>
            <div>
              <p>
                congress passes reese&apos;s law (409–2). child-proof battery packaging mandated after
                pediatric deaths.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <h3>er</h3>
            <div>
              <p>
                when a disc appears on x-ray, clinicians have ~2 hours if it&apos;s a battery in the esophagus.
                batteries and coins look identical. stacked coins fake the halo sign.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <h3>2020</h3>
            <div>
              <p>
                emory university ml achieved 88% accuracy — never became a clinical tool. coincell ships
                what research couldn&apos;t deploy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <p className="label">how it works</p>
        <pre>{`AP X-ray  → CLAHE → radial halo profiler (OpenCV)
Lateral   → step-off morphology detector
Both      → DualViewNet fusion (PyTorch, battery-weighted loss 3×)
Ensemble  → CV (55%) + CNN (40%) + dual-view bonus
Output    → verdict + Grad-CAM + clinical protocol + html report`}</pre>
      </section>

      <section>
        <p className="label">links</p>
        <ul className="list">
          <li>
            <a href="/demo" className="row-link">
              <span>interactive demo</span>
              <span>→</span>
            </a>
          </li>
          <li>
            <a href="/judges" className="row-link">
              <span>judge verification guide</span>
              <span>→</span>
            </a>
          </li>
          <li>
            <a
              href="https://github.com/arjunkshah12345-hash/coincell"
              className="row-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>github — full source + weights</span>
              <span>↗</span>
            </a>
          </li>
          <li>
            <a
              href="https://www.kaggle.com/code/aks1321/coincell-train-cpu"
              className="row-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>kaggle — cpu training notebook</span>
              <span>↗</span>
            </a>
          </li>
        </ul>
      </section>

      <section>
        <p className="label">run locally</p>
        <pre>{`git clone https://github.com/arjunkshah12345-hash/coincell
cd coincell && pip install -r requirements.txt
./scripts/run.sh
# → http://localhost:7860`}</pre>
      </section>

      <footer>
        <span>decision support only — not a medical device</span>
        <span>built by arjun shah</span>
      </footer>
    </div>
  );
}
