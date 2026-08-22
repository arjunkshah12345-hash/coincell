# Haloscan — Pre-Submit Checklist

**Deadline: October 26, 2026 · 12:00 PM Eastern**

---

## Done ✅

- [x] **Live scanner:** https://haloscan.vercel.app/scan (real PyTorch inference via API proxy)
- [x] **Fallback URL:** https://website-two-iota-91.vercel.app/scan
- [x] **Judges:** https://haloscan.vercel.app/judges
- [x] **GitHub:** https://github.com/arjunkshah12345-hash/haloscan
- [x] 100% battery sensitivity vs 81% Emory baseline

---

## Before submit

- [ ] Open `/scan` → press **1** (battery) and **3** (stacked coins) — watch inference time (~1–2s)
- [ ] Upload a test image → real analyze (not static JSON)
- [ ] Record video with live scanner on screen
- [ ] Submit as **Haloscan** using `SUBMISSION_FORM.md`

---

```bash
./scripts/run.sh              # local full stack
./scripts/tunnel_api.sh       # expose API for Vercel
cd website && vercel --prod   # redeploy frontend
```
