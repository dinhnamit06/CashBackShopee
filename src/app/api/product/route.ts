import { NextRequest, NextResponse } from "next/server";
import { inspectShopeeUrl } from "@/lib/shopee-url";
import { processProductLink } from "@/services/shopee-api";

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
      const result = await processProductLink(inspectedUrl.url);
      if (!result.success || !result.product) {
        return NextResponse.json(
          { success: false, error: result.error || "Không tìm thấy sản phẩm" },
          { status: 404 }
        );
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
          affiliateLink: result.product.affiliateLink || null,
          rating: Number(result.product.rating) || 0,
          sales: result.product.sales,
          commission: result.product.commission,
          sellerComFinal: result.product.sellerComFinal,
          shopeeComFinal: result.product.shopeeComFinal,
          isXtra: result.product.isXtra,
          cashbackRate: result.product.cashbackRate,
          cashbackAmount: result.product.cashbackAmount,
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
    const cashback = calculateCashback(product.commission);
    const cashbackRate = product.price > 0
      ? Math.round((cashback.cashbackAmount / product.price) * 100)
      : 0;

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
        cashbackRate: Math.min(cashbackRate, 75),
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
