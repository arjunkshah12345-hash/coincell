# CoinCell — Pre-Submit Checklist

**Deadline: October 26, 2026 · 12:00 PM Eastern**

---

## Done ✅

- [x] **Live website:** https://coincell.vercel.app
- [x] **Interactive demo:** https://coincell.vercel.app/demo
- [x] **Judge guide:** https://coincell.vercel.app/judges
- [x] GitHub: https://github.com/arjunkshah12345-hash/coincell
- [x] Kaggle training: https://www.kaggle.com/code/aks1321/coincell-train-cpu
- [x] Weights in repo · 100% battery sensitivity vs 81% Emory baseline
- [x] Full app: `./scripts/run.sh` → localhost:7860

---

## Submit checklist

- [ ] Open https://coincell.vercel.app/demo — press 1 and 3
- [ ] Record demo video (`VIDEO.md`) showing live site + stacked coins case
- [ ] Paste answers from `SUBMISSION_FORM.md`
- [ ] Submit at https://www.congressionalappchallenge.us/

---

## Commands

```bash
./scripts/run.sh                    # full local app
python3 tests/smoke_test.py         # verify code
cd website && npm run dev           # local marketing site
python3 scripts/export_demo_assets.py  # refresh vercel demo
vercel --prod --cwd website         # redeploy site
```
