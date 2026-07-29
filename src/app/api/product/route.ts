import { NextRequest, NextResponse } from "next/server";
import { inspectShopeeUrl } from "@/lib/shopee-url";
import { processProductLink } from "@/services/shopee-api";
import { getUserSubId } from "@/services/tracking";
import { prisma } from "@/lib/prisma";

function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

/**
 * GET /api/product?url=https://shopee.vn/product/123/456
 * GET /api/product?itemId=123456
 *
 * Flow: Parse link → Lấy product data + commission → Tạo affiliate link → Trả về
 * Cần SHOPEE_PARTNER_ID + SHOPEE_PARTNER_KEY để tạo affiliate link có tracking
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const itemId = searchParams.get("itemId");

    if (!url && !itemId) {
      return NextResponse.json(
        { success: false, error: "Thiếu URL hoặc mã sản phẩm" },
        { status: 400 }
      );
    }

    const inspectedUrl = url ? inspectShopeeUrl(url) : null;
    if (url && !inspectedUrl) {
      return NextResponse.json(
        { success: false, error: "Link sản phẩm Shopee không hợp lệ" },
        { status: 400 }
      );
    }

    if (itemId && !/^\d{1,20}$/.test(itemId)) {
      return NextResponse.json(
        { success: false, error: "Mã sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    // Ưu tiên URL để lấy thông tin và tạo link affiliate.
    if (inspectedUrl) {
      const subId = await getUserSubId();
      const result = await processProductLink(inspectedUrl.url, subId || undefined);
      if (!result.success || !result.product) {
        return NextResponse.json(
          { success: false, error: result.error || "Không tìm thấy sản phẩm" },
          { status: 404 }
        );
      }

      // Chỉ tạo short link khi đã login (có subId)
      const affiliateLink = result.product.affiliateLink || null;
      let shortUrl: string | null = null;

      if (subId) {
        const targetUrl = affiliateLink || result.product.originalLink;
        const slug = generateSlug();
        await prisma.shortLink.create({
          data: { slug, targetUrl, userId: null, subId },
        });
        const host = req.headers.get("host") || "localhost:3000";
        const protocol = host.includes("localhost") ? "http" : "https";
        shortUrl = `${protocol}://${host}/r/${slug}`;
      }

      return NextResponse.json({
        success: true,
        data: {
          id: String(result.product.itemId),
          title: result.product.productName,
          shopName: result.product.shopName,
          price: result.product.price,
          image: result.product.imageUrl,
          productLink: result.product.originalLink,
          affiliateLink: shortUrl,
          rating: Number(result.product.rating) || 0,
          sales: result.product.sales,
          commission: result.product.commission,
          sellerComFinal: result.product.sellerComFinal,
          shopeeComFinal: result.product.shopeeComFinal,
          isXtra: result.product.isXtra,
          cashbackRate: result.product.cashbackRate,
          cashbackAmount: result.product.cashbackAmount,
          subId: subId || null,
        },
      });
    }

    // Fallback: chỉ có itemId
    const { getProductData, calculateCashback } = await import("@/services/shopee-api");
    const result = await getProductData({ itemId: itemId! });

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    const product = result.data;
    const cashback = calculateCashback(product.commission, product.price);

    return NextResponse.json({
      success: true,
      data: {
        id: String(product.itemId),
        title: product.productName,
        shopName: product.shopName,
        price: product.price,
        image: product.imageUrl,
        productLink: product.productLink,
        affiliateLink: null,
        rating: Number(product.rating) || 0,
        sales: product.sales,
        commission: product.commission,
        sellerComFinal: product.sellerComFinal,
        shopeeComFinal: product.shopeeComFinal,
        isXtra: product.isXtra,
        cashbackRate: Math.min(cashback.cashbackRate, 75),
        cashbackAmount: cashback.cashbackAmount,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Không thể xử lý yêu cầu lúc này" },
      { status: 500 }
    );
  }
}
