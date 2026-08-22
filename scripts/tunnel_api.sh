#!/usr/bin/env bash
# Start API + Cloudflare tunnel and print Vercel env command
set -euo pipefail
cd "$(dirname "$0")/.."
PORT="${PORT:-7862}"

if ! command -v cloudflared >/dev/null; then
  echo "Install cloudflared: brew install cloudflared"
  exit 1
fi

export HALOSCAN_WEIGHTS="$(pwd)/weights/haloscan.pt"
[[ -f "$HALOSCAN_WEIGHTS" ]] || export HALOSCAN_WEIGHTS="$(pwd)/weights/coincell.pt"

echo "Starting Haloscan API on :$PORT ..."
PORT=$PORT python3 app.py &
API_PID=$!
sleep 8

LOG=$(mktemp)
cloudflared tunnel --url "http://localhost:$PORT" 2>&1 | tee "$LOG" &
CF_PID=$!

for _ in $(seq 1 30); do
  URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG" | head -1 || true)
  [[ -n "$URL" ]] && break
  sleep 1
done

if [[ -z "${URL:-}" ]]; then
  echo "Tunnel URL not found — check cloudflared output"
  kill $API_PID $CF_PID 2>/dev/null || true
  exit 1
fi

echo ""
echo "✓ API:  http://localhost:$PORT"
echo "✓ Tunnel: $URL"
echo ""
echo "Set on Vercel:"
echo "  cd website && printf '%s' '$URL' | vercel env add HALOSCAN_API_URL production"
echo "  vercel --prod"
echo ""
echo "Press Ctrl+C to stop (pids: api=$API_PID cloudflared=$CF_PID)"
wait
