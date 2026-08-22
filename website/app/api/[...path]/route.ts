import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.HALOSCAN_API_URL?.replace(/\/$/, "");

async function proxy(req: NextRequest, path: string) {
  if (!BACKEND) {
    return NextResponse.json(
      {
        error: "Haloscan inference API is starting up. Set HALOSCAN_API_URL or retry in a moment.",
        hint: "https://github.com/arjunkshah12345-hash/haloscan",
      },
      { status: 503 },
    );
  }

  const url = new URL(`${BACKEND}/api/${path}${req.nextUrl.search}`);
  const headers = new Headers();
  const ct = req.headers.get("content-type");
  if (ct) headers.set("content-type", ct);

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  const res = await fetch(url, init);
  const outHeaders = new Headers();
  const resCt = res.headers.get("content-type");
  if (resCt) outHeaders.set("content-type", resCt);
  const disp = res.headers.get("content-disposition");
  if (disp) outHeaders.set("content-disposition", disp);

  return new NextResponse(res.body, { status: res.status, headers: outHeaders });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path.join("/"));
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path.join("/"));
}

export const runtime = "nodejs";
export const maxDuration = 60;
