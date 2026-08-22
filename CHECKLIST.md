# Haloscan — Pre-Submit Checklist

**Deadline: October 26, 2026 · 12:00 PM Eastern**

---

## Done ✅

- [x] **Live scanner:** https://haloscan.ideatr.dev/scan
- [x] **API (Render):** https://haloscan.onrender.com — always-on, no laptop tunnel
- [x] **Architecture:** https://haloscan.ideatr.dev/architecture
- [x] **Validation:** https://haloscan.ideatr.dev/validation
- [x] **Use cases:** https://haloscan.ideatr.dev/use-cases
- [x] **GitHub:** https://github.com/arjunkshah12345-hash/haloscan
- [x] 100% battery sensitivity vs 81% Emory baseline
- [x] Render keepalive cron (GitHub Actions)

---

## Before submit

- [ ] Open `/scan` → press **1** (battery) and **3** (stacked coins) — watch inference time
- [ ] Upload a test image → real analyze (not static JSON)
- [ ] Record video with live scanner on screen
- [ ] Submit as **Haloscan** using `SUBMISSION_FORM.md`

---

```bash
curl https://haloscan.onrender.com/api/health
curl https://haloscan.ideatr.dev/api/demo/stacked
./scripts/run.sh              # local full stack
cd website && vercel --prod   # redeploy frontend
```
