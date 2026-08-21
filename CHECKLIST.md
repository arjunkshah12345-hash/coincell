# CoinCell — Pre-Submit Checklist

**Deadline: October 26, 2026 · 12:00 PM Eastern**

---

## Done ✅

- [x] Full app built (dual-view ML + clinical UI + reports)
- [x] GitHub public: https://github.com/arjunkshah12345-hash/coincell
- [x] Submission copy ready: `SUBMISSION_FORM.md`
- [x] Video shot list: `VIDEO.md`
- [x] Win strategy: `WIN.md`
- [x] Judge page: `/judge` on live demo

---

## You must do (blocks winning)

### 1. Deploy live demo (~15 min)

**If `hf auth login` crashes with `No module named huggingface_hub'`** — Homebrew's `hf` uses broken Python 3.14. Use either:

```bash
# Option A: project wrapper (recommended)
export PATH="$HOME/Downloads/congressionalappchallenge/bin:$PATH"
hf auth login

# Option B: direct Python module
python3 -m huggingface_hub.cli.hf auth login
```

Then deploy:
```bash
cd ~/Downloads/congressionalappchallenge
python3 scripts/deploy_space.py
```

### 2. Record 2-minute video (~30 min)
Follow `VIDEO.md` shot-by-shot. Upload to YouTube (public or unlisted).

### 3. Submit at congressionalappchallenge.us (~10 min)
Paste answers from `SUBMISSION_FORM.md`. Attach demo URL + GitHub + YouTube.

### 4. Verify district
https://www.congressionalappchallenge.us/participants/find-your-district/

---

## Test before submit

Open live URL on your phone → click **Battery** → **Stacked coins** → **Download report**

```bash
python3 tests/smoke_test.py   # all ✓ locally
```

---

## If you win

- District winner announced ~December 2026
- App displayed in US Capitol for one year
- House of Code in DC (Spring 2027)
