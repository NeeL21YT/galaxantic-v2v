/**
 * app/api/herlens/refresh/route.ts
 *
 * Scheduler-ready HerLens refresh endpoint.
 * Designed for Vercel Cron, GitHub Actions, or any external scheduler.
 */

import { NextResponse, type NextRequest } from "next/server";
import { refreshHerLensNews } from "@/lib/herlens/refresh";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function getRefreshSecret(): string | null {
  return process.env.CRON_SECRET ?? process.env.HERLENS_REFRESH_SECRET ?? null;
}

function isAuthorized(request: NextRequest): boolean {
  const secret = getRefreshSecret();
  if (!secret) return process.env.NODE_ENV !== "production";

  const authorization = request.headers.get("authorization");
  const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const headerSecret = request.headers.get("x-herlens-refresh-secret");

  return bearer === secret || headerSecret === secret;
}

async function handleRefresh(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized.", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  const result = await refreshHerLensNews();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

export async function GET(request: NextRequest) {
  return handleRefresh(request);
}

export async function POST(request: NextRequest) {
  return handleRefresh(request);
}
