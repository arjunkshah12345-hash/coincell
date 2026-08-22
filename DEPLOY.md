# Haloscan — Production Deployment

**Status: LIVE** (Aug 2026)

| Layer | URL | Host |
|-------|-----|------|
| **Frontend** | https://website-two-iota-91.vercel.app/scan | Vercel |
| **API** | https://haloscan.onrender.com | Render (Docker, free tier) |
| **Source** | https://github.com/arjunkshah12345-hash/haloscan | GitHub |

Vercel proxies `/api/*` → Render via `HALOSCAN_API_URL`.

---

## Architecture

```
website-two-iota-91.vercel.app/scan
        │
        ▼  (HALOSCAN_API_URL)
https://haloscan.onrender.com/api/*
        │
        ▼
FastAPI + PyTorch + OpenCV (weights/haloscan.pt)
```

---

## Render service

- **Dashboard:** https://dashboard.render.com/web/srv-da4tc1jm8hqs73anthk0
- **Service ID:** `srv-da4tc1jm8hqs73anthk0`
- **Auto-deploy:** pushes to `main` trigger rebuild
- **Keepalive:** GitHub Actions pings `/api/health` every 14 min (`.github/workflows/render-keepalive.yml`)

### Redeploy API

```bash
render deploys create srv-da4tc1jm8hqs73anthk0 --wait --confirm
```

### Recreate from CLI

```bash
render services create \
  --name haloscan \
  --type web_service \
  --runtime docker \
  --repo https://github.com/arjunkshah12345-hash/haloscan \
  --branch main \
  --region oregon \
  --plan free \
  --health-check-path /api/health \
  --env-var HALOSCAN_WEIGHTS=/app/weights/haloscan.pt \
  --env-var PORT=7860 \
  --confirm
```

---

## Vercel frontend

```bash
cd website
vercel env ls                    # HALOSCAN_API_URL → haloscan.onrender.com
vercel --prod --yes
```

---

## Custom domain (optional)

`haloscan.arjunshah.xyz` is added on Vercel. DNS lives at **topdns** (not Vercel nameservers). Add at your registrar:

```
A    haloscan    76.76.21.21
```

Or switch `arjunshah.xyz` nameservers to Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`).

---

## Verify

```bash
curl https://haloscan.onrender.com/api/health
curl https://website-two-iota-91.vercel.app/api/health
curl https://website-two-iota-91.vercel.app/api/demo/battery
open https://website-two-iota-91.vercel.app/scan
```

---

## Local dev (no cloud)

```bash
./scripts/run.sh          # http://localhost:7860
cd website && npm run dev # http://localhost:3000
```

For temporary Vercel ↔ local API testing: `./scripts/tunnel_api.sh`
