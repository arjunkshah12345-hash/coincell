let apFile = null;
let latFile = null;
let lastDemoCase = null;
let lastResult = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function setupDropzone(zoneId, inputId, previewId, onFile) {
  const zone = $(zoneId);
  const input = $(inputId);
  const preview = $(previewId);

  zone.addEventListener("click", () => input.click());
  zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("dragover"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("dragover");
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0], preview, onFile);
  });
  input.addEventListener("change", () => {
    if (input.files[0]) handleFile(input.files[0], preview, onFile);
  });
}

function handleFile(file, preview, onFile) {
  onFile(file);
  preview.src = URL.createObjectURL(file);
  preview.classList.remove("hidden");
  zoneContentHide(preview);
  $("#analyze-btn").disabled = !apFile;
  lastDemoCase = null;
}

function zoneContentHide(preview) {
  const content = preview.parentElement.querySelector(".dropzone-content");
  if (content) content.classList.add("hidden");
}

setupDropzone("#drop-ap", "#ap-input", "#ap-preview", (f) => { apFile = f; });
setupDropzone("#drop-lat", "#lat-input", "#lat-preview", (f) => { latFile = f; });

$("#analyze-btn").addEventListener("click", () => runAnalysis());

$$("[data-demo]").forEach((btn) => {
  btn.addEventListener("click", () => runDemo(btn.dataset.demo));
});

$("#refresh-metrics").addEventListener("click", () => loadMetrics(true));
$("#download-report").addEventListener("click", downloadReport);
$("#share-verdict").addEventListener("click", copySummary);

async function runDemo(caseName) {
  lastDemoCase = caseName;
  showLoading(true);
  try {
    const res = await fetch(`/api/demo/${caseName}`);
    if (!res.ok) throw new Error(await res.text());
    renderResults(await res.json());
  } catch (e) {
    alert("Demo failed: " + e.message);
  } finally {
    showLoading(false);
  }
}

async function runAnalysis() {
  if (!apFile) return;
  lastDemoCase = null;
  showLoading(true);
  const form = new FormData();
  form.append("ap", apFile);
  if (latFile) form.append("lateral", latFile);
  try {
    const res = await fetch("/api/analyze", { method: "POST", body: form });
    if (!res.ok) throw new Error(await res.text());
    renderResults(await res.json());
  } catch (e) {
    alert("Analysis failed: " + e.message);
  } finally {
    showLoading(false);
  }
}

async function downloadReport() {
  showLoading(true);
  try {
    let res;
    if (lastDemoCase) {
      res = await fetch(`/api/demo/${lastDemoCase}/report`);
    } else if (apFile) {
      const form = new FormData();
      form.append("ap", apFile);
      if (latFile) form.append("lateral", latFile);
      res = await fetch("/api/report", { method: "POST", body: form });
    } else return;
    const html = await res.text();
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `coincell-report-${Date.now()}.html`;
    a.click();
  } catch (e) {
    alert("Report failed: " + e.message);
  } finally {
    showLoading(false);
  }
}

function copySummary() {
  if (!lastResult) return;
  const text = [
    `CoinCell: ${lastResult.prediction}`,
    `Battery ${(lastResult.battery_probability * 100).toFixed(0)}% / Coin ${(lastResult.coin_probability * 100).toFixed(0)}%`,
    lastResult.explanation,
    lastResult.emergency ? "TREAT AS EMERGENCY — 2hr endoscopy window" : "",
  ].filter(Boolean).join("\n");
  navigator.clipboard.writeText(text).then(() => {
    $("#share-verdict").textContent = "Copied!";
    setTimeout(() => { $("#share-verdict").textContent = "Copy summary"; }, 2000);
  });
}

function renderResults(d) {
  lastResult = d;
  $("#results").classList.remove("hidden");
  $("#download-report").classList.remove("hidden");
  $("#share-verdict").classList.remove("hidden");

  const verdict = $("#verdict");
  verdict.className = "verdict";
  if (d.emergency) verdict.classList.add("critical");
  else if (d.prediction.includes("COIN")) verdict.classList.add("routine");

  $("#verdict-text").textContent = d.prediction;
  $("#verdict-conf").textContent = `${(d.confidence * 100).toFixed(1)}% confidence`;

  $("#bar-battery").style.width = `${d.battery_probability * 100}%`;
  $("#bar-coin").style.width = `${d.coin_probability * 100}%`;
  $("#pct-battery").textContent = `${(d.battery_probability * 100).toFixed(0)}%`;
  $("#pct-coin").textContent = `${(d.coin_probability * 100).toFixed(0)}%`;

  $("#halo-score").textContent = d.ap_halo.halo_score.toFixed(2);
  $("#stepoff-score").textContent = (d.lat_halo?.stepoff_score ?? d.ap_halo.stepoff_score).toFixed(2);
  $("#dual-used").textContent = d.dual_view_used ? "Yes" : "No";

  $("#explanation").textContent = d.explanation;

  $("#img-overlay").src = d.overlay_b64;
  $("#img-gradcam").src = d.gradcam_b64;
  $("#img-radial").src = d.radial_chart_b64;

  const p = d.protocol;
  $("#protocol-urgency").textContent = `${p.urgency} — Clinical protocol`;
  $("#protocol-urgency").style.color = p.color;
  $("#protocol-window").textContent = p.time_window;
  $("#protocol-actions").innerHTML = p.actions.map((a) => `<li>${a}</li>`).join("");
  $("#protocol-contacts").innerHTML = p.contacts.map((c) => `<span>${c}</span>`).join("");

  $("#results").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showLoading(on) {
  $("#loading").classList.toggle("hidden", !on);
}

async function loadMetrics(refresh = false) {
  $("#metrics-content").textContent = refresh ? "Re-running benchmark…" : "Loading…";
  try {
    const url = refresh ? "/api/metrics?refresh=true" : "/api/metrics";
    const m = await fetch(url).then((r) => r.json());
    const c = m.coincell;
    const b = m.baseline_emory_2020;
    $("#metrics-content").innerHTML = `
      <div class="metric-row"><span>CoinCell battery sens.</span><strong>${(c.battery_sensitivity * 100).toFixed(0)}%</strong></div>
      <div class="metric-row"><span>Emory 2020 baseline</span><strong>${(b.battery_sensitivity * 100).toFixed(0)}%</strong></div>
      <div class="metric-row"><span>Stacked-coin catch rate</span><strong>${(c.stacked_coin_emergency_rate * 100).toFixed(0)}%</strong></div>
      <div class="metric-row"><span>Beats baseline</span><strong>${m.beats_baseline_battery_sensitivity ? "✓ Yes" : "—"}</strong></div>
    `;
  } catch {
    $("#metrics-content").textContent = "Benchmark unavailable offline";
  }
}

loadMetrics();
