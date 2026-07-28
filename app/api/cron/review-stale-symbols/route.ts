import { NextResponse, connection } from "next/server";
import { headers } from "next/headers";

import { runSymbolReview } from "@/server/symbol-review/worker";

// A few sequential web-search research calls, bounded per call and per loop by
// the worker itself. Matches fetch-quotes, the other long-running cron, and the
// 300s ceiling of Vercel's Hobby plan. `MAX_SYMBOLS_PER_RUN` in the worker is
// sized against this budget — change both together.
export const maxDuration = 300;

export async function GET() {
  // Wait for the incoming request so this route is never prerendered.
  await connection();

  try {
    const cronSecret = process.env.CRON_SECRET?.trim();
    if (!cronSecret) {
      console.error("CRON_SECRET is not configured for symbol review cron");

      return new Response("Server misconfigured", {
        status: 500,
      });
    }

    const authHeader = (await headers()).get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    console.log("Starting symbol review cron job...");

    const result = await runSymbolReview();

    console.log(
      "Symbol review cron job finished:",
      result.skipped ?? result.stats,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Symbol review cron job failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
