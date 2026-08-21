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
```bash
python3 -m pip install huggingface_hub
python3 -m huggingface_hub.cli.hf auth login
cd ~/Downloads/congressionalappchallenge
python3 -m huggingface_hub.cli.hf repo create arjunkshah12345-hash/coincell --type space --space_sdk docker --exist-ok
python3 -m huggingface_hub.cli.hf upload arjunkshah12345-hash/coincell . --repo-type space
```
Or: HF website → New Space → Docker → connect GitHub repo `arjunkshah12345-hash/coincell`

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
