let apFile = null;
let latFile = null;
let lastDemoCase = null;
let lastResult = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ── Toasts ──────────────────────────────────────────────────────────────────
function toast(msg, type = "info") {
  const el = document.createElement("div");
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  $("#toasts").appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 3200);
}

// ── Dropzones ───────────────────────────────────────────────────────────────
function setupDropzone(zoneId, inputId, previewId, onFile) {
  const zone = $(zoneId);
  const input = $(inputId);
  const preview = $(previewId);

  zone.addEventListener("click", () => input.click());
  zone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.click(); }
  });
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
  if (!file.type.startsWith("image/")) {
    toast("Please upload an image file", "error");
    return;
  }
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

function setPreviewFromB64(previewId, zoneId, b64) {
  const preview = $(previewId);
  const zone = $(zoneId);
  preview.src = b64;
  preview.classList.remove("hidden");
  const content = zone.querySelector(".dropzone-content");
  if (content) content.classList.add("hidden");
}

function clearPreviews() {
  ["#ap-preview", "#lat-preview"].forEach((sel) => {
    const img = $(sel);
    img.src = "";
    img.classList.add("hidden");
    const content = img.parentElement.querySelector(".dropzone-content");
    if (content) content.classList.remove("hidden");
  });
  apFile = null;
  latFile = null;
  $("#ap-input").value = "";
  $("#lat-input").value = "";
  $("#analyze-btn").disabled = true;
}

setupDropzone("#drop-ap", "#ap-input", "#ap-preview", (f) => { apFile = f; });
setupDropzone("#drop-lat", "#lat-input", "#lat-preview", (f) => { latFile = f; });

document.addEventListener("paste", (e) => {
  const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
  if (!item) return;
  const file = item.getAsFile();
  const target = latFile ? "ap" : "ap";
  if (target === "ap") {
    handleFile(file, $("#ap-preview"), (f) => { apFile = f; });
    toast("Pasted into AP view");
  }
});

// ── Case library ────────────────────────────────────────────────────────────
async function loadCases() {
  try {
    const cases = await fetch("/api/cases").then((r) => r.json());
    $("#case-grid").innerHTML = cases.map((c) => `
      <button class="case-card case-${c.urgency}" data-demo="${c.id}" title="Shortcut: ${c.shortcut}">
        <span class="case-key">${c.shortcut}</span>
        <strong>${c.title}</strong>
        <em>${c.subtitle}</em>
        <span>${c.description}</span>
      </button>
    `).join("");
    $$(".case-card").forEach((btn) => {
      btn.addEventListener("click", () => runDemo(btn.dataset.demo));
    });
  } catch {
    $("#case-grid").innerHTML = `<p class="demo-fallback">Demo cases unavailable offline</p>`;
  }
}

// ── Analysis ────────────────────────────────────────────────────────────────
$("#analyze-btn").addEventListener("click", () => runAnalysis());
$("#refresh-metrics").addEventListener("click", () => loadMetrics(true));
$("#download-report").addEventListener("click", downloadReport);
$("#share-verdict").addEventListener("click", copySummary);
$("#reset-analysis").addEventListener("click", resetResults);

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea")) return;
  if (e.key === "Enter" && apFile && !$("#loading").classList.contains("hidden") === false) {
    if (!$("#analyze-btn").disabled) runAnalysis();
  }
  const demos = { "1": "battery", "2": "coin", "3": "stacked", "4": "normal" };
  if (demos[e.key]) runDemo(demos[e.key]);
});

async function runDemo(caseName) {
  lastDemoCase = caseName;
  showLoading(true, `Running ${caseName} case…`);
  try {
    const [result, previews] = await Promise.all([
      fetch(`/api/demo/${caseName}`).then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); }),
      fetch(`/api/demo/${caseName}/previews`).then((r) => r.json()).catch(() => null),
    ]);
    if (previews?.ap_b64) setPreviewFromB64("#ap-preview", "#drop-ap", previews.ap_b64);
    if (previews?.lateral_b64) setPreviewFromB64("#lat-preview", "#drop-lat", previews.lateral_b64);
    renderResults(result);
    toast(`Loaded ${caseName} demo case`, "success");
  } catch (e) {
    toast("Demo failed: " + e.message, "error");
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
    toast("Analysis complete", "success");
  } catch (e) {
    toast("Analysis failed: " + e.message, "error");
  } finally {
    showLoading(false);
  }
}

async function downloadReport() {
  showLoading(true, "Generating report…");
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
    toast("Report downloaded", "success");
  } catch (e) {
    toast("Report failed: " + e.message, "error");
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
    "Poison Control: 1-800-222-1222",
  ].filter(Boolean).join("\n");
  navigator.clipboard.writeText(text).then(() => {
    toast("Summary copied to clipboard", "success");
  }).catch(() => toast("Could not copy", "error"));
}

function resetResults() {
  $("#results").classList.add("hidden");
  clearPreviews();
  lastDemoCase = null;
  lastResult = null;
}

function renderResults(d) {
  lastResult = d;
  $("#results").classList.remove("hidden");
  $("#download-report").classList.remove("hidden");
  $("#share-verdict").classList.remove("hidden");
  $("#reset-analysis").classList.remove("hidden");

  const verdict = $("#verdict");
  verdict.className = "verdict";
  if (d.emergency) verdict.classList.add("critical");
  else if (d.prediction.includes("COIN")) verdict.classList.add("routine");

  $("#verdict-text").textContent = d.prediction;
  $("#verdict-conf").textContent = `${(d.confidence * 100).toFixed(1)}% confidence`;
  $("#inference-time").textContent = d.inference_ms ? `${d.inference_ms.toFixed(0)} ms` : "";

  $("#emergency-banner").classList.toggle("hidden", !d.emergency);

  requestAnimationFrame(() => {
    $("#bar-battery").style.width = `${d.battery_probability * 100}%`;
    $("#bar-coin").style.width = `${d.coin_probability * 100}%`;
  });
  $("#pct-battery").textContent = `${(d.battery_probability * 100).toFixed(0)}%`;
  $("#pct-coin").textContent = `${(d.coin_probability * 100).toFixed(0)}%`;

  const cvBat = d.cv_probs?.battery ?? 0;
  const cnnBat = d.model_probs?.battery ?? 0;
  const fused = d.battery_probability;
  setMiniBar("#cv-battery-bar", "#cv-battery-pct", cvBat);
  setMiniBar("#cnn-battery-bar", "#cnn-battery-pct", cnnBat);
  setMiniBar("#fused-battery-bar", "#fused-battery-pct", fused);

  $("#halo-score").textContent = d.ap_halo.halo_score.toFixed(2);
  $("#stepoff-score").textContent = (d.lat_halo?.stepoff_score ?? d.ap_halo.stepoff_score).toFixed(2);
  $("#dual-used").textContent = d.dual_view_used ? "Yes" : "No";
  $("#ambiguous-chip").classList.toggle("hidden", !d.ambiguous);

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
  $("#reese-note").textContent = p.reese_law_note || "";

  $("#results").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function setMiniBar(barSel, pctSel, val) {
  $(barSel).style.width = `${val * 100}%`;
  $(pctSel).textContent = `${(val * 100).toFixed(0)}%`;
}

function showLoading(on, text) {
  $("#loading").classList.toggle("hidden", !on);
  if (text) $("#loading-text").textContent = text;
  else if (!on) $("#loading-text").textContent = "Running ensemble inference…";
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
    $("#stat-battery").textContent = `${(c.battery_sensitivity * 100).toFixed(0)}%`;
    $("#stat-stacked").textContent = `${(c.stacked_coin_emergency_rate * 100).toFixed(0)}%`;
  } catch {
    $("#metrics-content").textContent = "Benchmark unavailable offline";
  }
}

loadCases();
loadMetrics();
