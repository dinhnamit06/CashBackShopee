import { NextRequest, NextResponse } from "next/server";
import { fullSync } from "@/services/sync-service";

/**
 * POST /api/sync
 * Gọi thủ công hoặc qua Vercel Cron Jobs để đồng bộ dữ liệu
 *
 * Cần CRON_SECRET trong Authorization header để bảo vệ endpoint
 */
export async function POST(req: NextRequest) {
  try {
    // Bảo vệ endpoint với secret
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = req.headers.get("authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    const result = await fullSync();

    return NextResponse.json({
      success: true,
      orders: result.orders,
      clicks: result.clicks,
      errors: result.errors.length > 0 ? result.errors : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/sync - Health check
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "POST to sync data from Shopee Affiliate",
    cronJob:
      "Configure Vercel Cron: POST /api/sync every 5 minutes with Bearer CRON_SECRET",
  });
}
