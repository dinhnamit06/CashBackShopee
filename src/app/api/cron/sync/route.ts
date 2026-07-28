import { NextRequest, NextResponse } from "next/server";
import { syncOrders, releaseOrders } from "@/services/tracking";

/**
 * POST /api/cron/sync
 * Goi dinh ky de dong bo don hang + credit user
 * Rate limit: 1 req/5 min (qua Vercel Cron hoac goi thu cong)
 */
export async function POST(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const auth = req.headers.get("authorization");
      if (auth !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const syncResult = await syncOrders();
    const releaseResult = await releaseOrders();

    return NextResponse.json({
      success: true,
      sync: syncResult,
      release: releaseResult,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
