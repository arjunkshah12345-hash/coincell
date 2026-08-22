# Haloscan — Pre-Submit Checklist

**Deadline: October 26, 2026 · 12:00 PM Eastern**

---

## Done ✅

- [x] **Live site:** https://haloscan.vercel.app
- [x] **Demo:** https://haloscan.vercel.app/demo
- [x] **Judges:** https://haloscan.vercel.app/judges
- [x] **GitHub:** https://github.com/arjunkshah12345-hash/haloscan
- [x] 100% battery sensitivity vs 81% Emory baseline
- [x] Full app: `./scripts/run.sh`

---

## Before submit

- [ ] Demo: press **1** (battery) and **3** (stacked coins)
- [ ] Record video (`VIDEO.md`) with **haloscan.vercel.app** on screen
- [ ] Paste `SUBMISSION_FORM.md` → app name **Haloscan**
- [ ] Submit at https://www.congressionalappchallenge.us/

---

```bash
./scripts/run.sh
python3 tests/smoke_test.py
cd website && vercel --prod
```
