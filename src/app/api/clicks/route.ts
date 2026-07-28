import { NextRequest, NextResponse } from "next/server";
import { getClickData } from "@/services/shopee-api";

/**
 * GET /api/clicks?from=2026-07-01&to=2026-07-31
 *
 * Lấy báo cáo click từ Shopee Affiliate
 * Cần API_KEY trong env SHOPEE_AFFILIATE_API_KEY
 */
export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.SHOPEE_AFFILIATE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Chưa cấu hình API Key (SHOPEE_AFFILIATE_API_KEY)" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 50;

    const result = await getClickData(apiKey, { from, to, page, pageSize });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      meta: result.data?.meta,
      summary: result.data?.summary,
      data: result.data?.data || [],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
