#!/usr/bin/env bash
# Push Haloscan to GitHub (arjunkshah12345-hash per account routing)
set -euo pipefail
REPO="${1:-haloscan}"
USER="arjunkshah12345-hash"

gh auth switch --user "$USER" 2>/dev/null || true

if ! gh repo view "$USER/$REPO" &>/dev/null; then
  gh repo create "$USER/$REPO" --public --source=. --remote=origin \
    --description "Haloscan — pediatric battery vs coin X-ray AI (Congressional App Challenge)"
else
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/$USER/$REPO.git"
fi

echo "Remote: $(git remote get-url origin 2>/dev/null || echo 'none')"
echo "Run: git add -A && git commit -m '...' && git push -u origin main"
