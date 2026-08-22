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
          <span className="badge">reese&apos;s law · p.l. 117-171</span>
          <span className="badge">open source · mit</span>
        </div>
        <div className="hero-title-row">
          <div className="hero-logo" aria-hidden="true">
            <span className="halo-ring r1" />
            <span className="halo-ring r2" />
            <span className="halo-ring r3" />
          </div>
          <h1>haloscan</h1>
        </div>
        <p className="hero-tag">the double halo, decoded.</p>
        <p className="hero-lead">
          when a toddler swallows something round, ER teams have two hours if it&apos;s a battery in the
          esophagus. on x-ray, coins and batteries look identical — stacked coins fake the halo sign that
          doctors rely on. haloscan fuses radial halo physics with dual-view deep learning and ships a
          clinical protocol engine that errs toward never missing a battery.
        </p>
        <div className="cta-row">
          <Link href="/demo" className="btn">
            try live demo →
          </Link>
          <a
            href="https://github.com/arjunkshah12345-hash/haloscan"
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            view source ↗
          </a>
        </div>
      </header>

      <section>
        <p className="label">benchmark · synthetic holdout</p>
        <div className="stats">
          <div className="stat">
            <strong>{METRICS.battery}</strong>
            <span>battery sensitivity</span>
          </div>
          <div className="stat">
            <strong>{METRICS.stacked}</strong>
            <span>stacked-coin catch</span>
          </div>
          <div className="stat">
            <strong>{METRICS.baseline}</strong>
            <span>emory 2020 baseline</span>
          </div>
        </div>
        <p className="muted">
          kaggle cpu training · weights in repo · runs offline · grad-cam explainability · no patient data
        </p>
      </section>

      <section>
        <p className="label">why the name</p>
        <p className="prose muted">
          the <strong className="text">double halo sign</strong> is how radiologists spot button batteries on
          AP films — a bright outer rim and inner ring. stacked coins create a false halo. haloscan measures
          that signature from first principles, then fuses it with a neural network trained to never miss the
          two-hour window case.
        </p>
      </section>

      <section>
        <p className="label">the problem</p>
        <div className="timeline">
          <div className="timeline-item">
            <h3>409–2</h3>
            <div>
              <p>
                congress passes reese&apos;s law. child-proof batteries mandated. prevention fixed.
                diagnosis didn&apos;t.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <h3>2 hr</h3>
            <div>
              <p>
                esophageal battery → emergent endoscopy. rural hospitals without 24/7 pediatric radiology
                need decision support that works offline.
              </p>
            </div>
          </div>
          <div className="timeline-item">
            <h3>2020</h3>
            <div>
              <p>
                emory ML hit 88% accuracy. never shipped. haloscan is the deployable version — web app,
                clinical reports, open weights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <p className="label">stack</p>
        <pre>{`AP film   → CLAHE → radial halo profiler (OpenCV + Hough)
Lateral   → step-off morphology
Fusion    → DualViewNet (PyTorch, 3× battery-weighted loss)
Ensemble  → CV 55% + CNN 40% + dual-view bonus
Output    → verdict · grad-cam · protocol · printable report`}</pre>
      </section>

      <section>
        <p className="label">links</p>
        <ul className="list">
          <li>
            <Link href="/demo" className="row-link">
              <span>interactive demo</span>
              <span>→</span>
            </Link>
          </li>
          <li>
            <Link href="/judges" className="row-link">
              <span>judge verification (90 sec)</span>
              <span>→</span>
            </Link>
          </li>
          <li>
            <a
              href="https://github.com/arjunkshah12345-hash/haloscan"
              className="row-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>github — source + weights</span>
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
              <span>kaggle training notebook</span>
              <span>↗</span>
            </a>
          </li>
        </ul>
      </section>

      <section>
        <p className="label">run full app locally</p>
        <pre>{`git clone https://github.com/arjunkshah12345-hash/haloscan
cd haloscan && pip install -r requirements.txt
./scripts/run.sh
# upload x-rays → http://localhost:7860`}</pre>
      </section>

      <footer>
        <span>decision support only — not a medical device</span>
        <a href="https://arjunshah.xyz">arjun shah</a>
      </footer>
    </div>
  );
}
