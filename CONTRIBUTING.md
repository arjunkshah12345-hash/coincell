# Contributing to Haloscan

Thanks for your interest! Haloscan is an open-source Congressional App Challenge project.

## Quick contributions

- **Bug reports** — open an issue with steps to reproduce
- **Documentation** — fix typos, clarify clinical disclaimers
- **Tests** — extend `tests/smoke_test.py` with edge cases

## Development setup

```bash
git clone https://github.com/arjunkshah12345-hash/haloscan.git
cd haloscan
pip install -r requirements.txt
python3 tests/smoke_test.py
./scripts/run.sh
```

## Pull requests

1. Fork the repo
2. Create a branch (`fix/…` or `feat/…`)
3. Run smoke tests before submitting
4. Keep PRs focused — one concern per PR

## What we won't merge

- Changes that remove clinical disclaimers
- Code that stores or transmits patient data
- Dependencies that require paid API keys for core functionality

## Clinical note

Haloscan is decision support research software, not a medical device. Contributors must not claim FDA clearance or clinical validation beyond synthetic benchmarks.
