# CoinCell — Pre-Submit Checklist (No Hugging Face)

**Deadline: October 26, 2026 · 12:00 PM Eastern**

---

## Done ✅

- [x] App built + weights in `weights/coincell.pt` (3.5 MB, CPU-trained)
- [x] GitHub: https://github.com/arjunkshah12345-hash/coincell
- [x] Kaggle training: https://www.kaggle.com/code/aks1321/coincell-train-cpu
- [x] 100% battery sensitivity vs 81% Emory baseline (`weights/metrics.json`)
- [x] `./scripts/run.sh` → local demo at http://localhost:7860

---

## Submit checklist

- [ ] `./scripts/run.sh` works on your machine
- [ ] Record demo video (`VIDEO.md`) showing live app
- [ ] Paste answers from `SUBMISSION_FORM.md`
- [ ] Submit at https://www.congressionalappchallenge.us/

**Demo URL for form:** GitHub repo + Kaggle training notebook links (CAC allows source + video)

---

## Commands

```bash
./scripts/run.sh                    # run app
python3 scripts/train_cpu.py        # re-train locally
kaggle kernels push -p kaggle       # re-train on Kaggle CPU
python3 tests/smoke_test.py         # verify code
```
