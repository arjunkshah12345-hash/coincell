# Deploy Haloscan API (production)

The **marketing site** lives on Vercel. **Live inference** requires the Python FastAPI backend.

## Option A — Render (recommended, free tier)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint → connect `haloscan` repo
3. Render reads `render.yaml` and deploys the Docker service
4. Copy the service URL (e.g. `https://haloscan.onrender.com`)
5. In Vercel → Project Settings → Environment Variables:
   - `HALOSCAN_API_URL` = `https://haloscan.onrender.com`
6. Redeploy Vercel: `cd website && vercel --prod`

## Option B — Local + Cloudflare tunnel (dev / demo)

```bash
./scripts/run.sh                    # port 7860
# or PORT=7862 python3 app.py

cloudflared tunnel --url http://localhost:7862
# paste trycloudflare.com URL into Vercel HALOSCAN_API_URL
cd website && vercel --prod
```

## Option C — Fly.io (1GB VM)

Requires billing on Fly. Then:

```bash
flyctl launch --copy-config
flyctl deploy
```

Set `HALOSCAN_API_URL=https://haloscan.fly.dev` on Vercel.

---

## Verify

```bash
curl https://haloscan.vercel.app/api/health
# → {"status":"ok","model":"loaded",...}

open https://haloscan.vercel.app/scan
# Press 1 → live BATTERY inference
```
