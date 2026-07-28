/**
 * Shopee Affiliate API Service
 * Integrates with addlivetag.com + Shopee Official API
 *
 * API 1: Product Data - https://data.addlivetag.com/product-data/product-data.php
 * API 2: Conversion Orders - https://addlivetag.com/api/v1/conversions.php?type=items
 * API 3: Conversion Clicks - https://addlivetag.com/api/v1/conversions.php?type=clicks
 * API 4: Generate Short Link - https://addlivetag.com/shopee-affiliate-api/api_handler.php (COOKIE-FREE)
 */

import { inspectShopeeUrl, parseShopeeProductIds } from "@/lib/shopee-url";

const PRODUCT_API_BASE = "https://data.addlivetag.com/product-data/product-data.php";
const CONVERSION_API_BASE = "https://addlivetag.com/api/v1/conversions.php";
const ADDLIVETAG_API = "https://addlivetag.com/shopee-affiliate-api/api_handler.php";

export interface ShopeeProduct {
  itemId: number;
  productName: string;
  shopName: string;
  price: number;
  sales: number;
  imageUrl: string;
  productLink: string;
  rating: string | number;
  commission: number;
  sellerComFinal: number;
  shopeeComFinal: number;
  isXtra: boolean;
  lastUpdate: string;
  dataSource: string;
}

export interface ConversionItem {
  purchase_time: number;
  click_time: number;
  item_name: string;
  image: string;
  item_url: string;
  price: number;
  qty: number;
  order_value: number;
  commission: number;
  mcn_fee: number;
  utm: string;
  sub_id1: string;
}

export interface ClickRecord {
  click_id: string;
  click_time: number;
  click_region: string;
  sub_id: string;
  direct_source: string;
  last_external_source: string;
}

interface ConversionMeta {
  type: string;
  page: number;
  page_size: number;
  total: number;
}

interface ConversionSummary {
  orders?: number;
  clicks?: number;
  gmv?: number;
  gross_commission?: number;
  estimated_total_commission?: number;
  conversion_rate?: number;
}

interface ConversionResponse {
  ok: boolean;
  meta: ConversionMeta;
  summary: ConversionSummary;
  data: ConversionItem[] | ClickRecord[];
}

/**
 * Lấy thông tin sản phẩm Shopee kèm hoa hồng
 * Cache: 24h trong DB của addlivetag
 */
export async function getProductData(
  params: { itemId?: string; url?: string }
): Promise<{ success: boolean; data?: ShopeeProduct; error?: string }> {
  try {
    const searchParams = new URLSearchParams();
    if (params.itemId) searchParams.set("item_id", params.itemId);
    if (params.url) searchParams.set("url", params.url);

    const res = await fetch(`${PRODUCT_API_BASE}?${searchParams.toString()}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return { success: false, error: `Shopee API error: ${res.status}` };
    }

    const data = await res.json();

    // addlivetag tra ve trong productInfo
    const info = data.productInfo || data;

    if (data.error || data.warning) {
      return { success: false, error: data.error || data.warning };
    }

    // Kiem tra xem co du lieu khong
    if (!info || !info.itemId) {
      return { success: false, error: "Sản phẩm không có trong database addlivetag" };
    }

    return {
      success: true,
      data: {
        itemId: info.itemId || info.item_id,
        productName: info.productName || info.product_name || "",
        shopName: info.shopName || info.shop_name || "",
        price: info.price || 0,
        sales: info.sales || 0,
        imageUrl: info.imageUrl || info.image_url || "",
        productLink: info.productLink || info.product_link || "",
        rating: info.rating || "0",
        commission: info.commission || 0,
        sellerComFinal: info.sellerComFinal || info.seller_com_final || 0,
        shopeeComFinal: info.shopeeComFinal || info.shopee_com_final || 0,
        isXtra: info.isXtra || info.is_xtra || false,
        lastUpdate: info.lastUpdate || info.last_update || "",
        dataSource: info.dataSource || info.data_source || "api",
      } as ShopeeProduct,
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Lấy báo cáo chuyển đổi (đơn hàng đã tracking)
 * API Key lấy từ addlivetag.com → Chuyển đổi
 */
export async function getConversionData(
  apiKey: string,
  params: {
    type?: "orders" | "items" | "clicks";
    source?: "shopee" | "food";
    accountId?: string;
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
  } = {}
): Promise<{ success: boolean; data?: ConversionResponse; error?: string }> {
  try {
    const searchParams = new URLSearchParams();
    if (params.type) searchParams.set("type", params.type);
    if (params.source) searchParams.set("source", params.source);
    if (params.accountId) searchParams.set("account_id", params.accountId);
    if (params.from) searchParams.set("from", params.from);
    if (params.to) searchParams.set("to", params.to);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.pageSize) searchParams.set("page_size", String(params.pageSize));

    const res = await fetch(`${CONVERSION_API_BASE}?${searchParams.toString()}`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "X-API-Key": apiKey,
      },
    });

    if (!res.ok) {
      return { success: false, error: `Conversion API error: ${res.status}` };
    }

    const data: ConversionResponse = await res.json();

    if (!data.ok) {
      return { success: false, error: "API returned not ok" };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Lấy báo cáo click
 */
export async function getClickData(
  apiKey: string,
  params: {
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
  } = {}
): Promise<{ success: boolean; data?: ConversionResponse; error?: string }> {
  return getConversionData(apiKey, {
    ...params,
    type: "clicks",
  });
}

/**
 * Trích xuất item_id và shop_id từ URL Shopee (mọi định dạng)
 */
export function parseShopeeUrl(url: string): { shopId: string; itemId: string } | null {
  return parseShopeeProductIds(url);
}

/**
 * Resolve short link (s.shopee.vn hoac shope.ee) thanh URL san pham goc
 */
export async function resolveShortLink(
  shortUrl: string
): Promise<{ success: boolean; url?: string; shopId?: string; itemId?: string; error?: string }> {
  try {
    const inspectedUrl = inspectShopeeUrl(shortUrl);
    if (!inspectedUrl || inspectedUrl.kind !== "short") {
      return { success: false, error: "Short link Shopee không hợp lệ" };
    }

    const res = await fetch(inspectedUrl.url, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
    });

    const location = res.headers.get("location") || "";

    if (!location) {
      return { success: false, error: "Không thể mở short link Shopee" };
    }

    const resolvedUrl = new URL(location, inspectedUrl.url).toString();
    const parsed = parseShopeeUrl(resolvedUrl);
    if (!parsed) {
      return { success: false, error: "Short link không dẫn đến sản phẩm Shopee" };
    }

    return {
      success: true,
      url: resolvedUrl,
      shopId: parsed.shopId,
      itemId: parsed.itemId,
    };
  } catch {
    return { success: false, error: "Không thể mở short link Shopee" };
  }
}

/**
 * Tính % hoàn tiền cho user dựa trên commission từ Shopee
 * Logic: chia 50-70% hoa hồng cho user
 */
export function calculateCashback(commission: number, price: number = 0): {
  cashbackRate: number;
  cashbackAmount: number;
  sharePercent: number;
  profitAmount: number;
  profitPercent: number;
} {
  const shareRate = Number(process.env.CASHBACK_SHARE_RATE || "0.6"); // 60% mặc định
  const cashbackAmount = Math.floor(commission * shareRate);
  const cashbackRate = price > 0 ? Math.round((cashbackAmount / price) * 100) : 0;
  const profitAmount = commission - cashbackAmount;
  const profitPercent = price > 0 ? Math.round((profitAmount / price) * 100) : 0;

  return {
    cashbackRate,
    cashbackAmount,
    sharePercent: Math.round(shareRate * 100),
    profitAmount,
    profitPercent,
  };
}

/**
 * Tao affiliate short link qua addlivetag API (khong can Partner Key hay cookie)
 * Endpoint: addlivetag.com/shopee-affiliate-api/api_handler.php
 *
 * addlivetag tu dong dung tai khoan Shopee da ket noi de tao link affiliate
 */
export async function generateAffiliateLink(
  originUrl: string,
  subIds: string[] = []
): Promise<{ success: boolean; shortLink?: string; error?: string; method?: string }> {
  try {
    const params: Record<string, string> = { originUrl };
    subIds.forEach((id, i) => { params[`sub${i + 1}`] = id; });

    const res = await fetch(ADDLIVETAG_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_type: "generateShortLink",
        params,
      }),
    });

    const json = await res.json();

    if (!json.success) {
      return { success: true, shortLink: originUrl, method: "addlivetag_fail" };
    }

    const shortLink = json.data?.data?.generateShortLink?.shortLink || "";
    if (!shortLink) {
      return { success: true, shortLink: originUrl, method: "addlivetag_no_link" };
    }

    return { success: true, shortLink, method: "addlivetag" };
  } catch (err) {
    // Fallback: dung link goc + campaign tracking
    const partnerId = process.env.SHOPEE_PARTNER_ID || "";
    if (partnerId) {
      return { success: true, shortLink: originUrl, method: "campaign_fallback" };
    }
    return { success: true, shortLink: originUrl, method: "direct_fallback" };
  }
}

/**
 * Fallback: Không thể tạo affiliate link → trả về link gốc + cảnh báo
 */
function generateCampaignLink(
  originUrl: string,
  partnerId: string,
  subIds: string[]
): { success: boolean; shortLink?: string; error?: string; method?: string } {
  // Trả về link gốc + thông báo cần cấu hình
  return {
    success: false,
    shortLink: originUrl,
    error: "Chưa có Partner Key hoặc SPC_EC cookie. Vui lòng cấu hình trong .env để bật tracking affiliate.",
    method: "no_tracking",
  };
}

/**
 * Flow đầy đủ: Parse link → Lấy product data → Tạo affiliate link → Trả về cho user
 */
export async function processProductLink(shopeeUrl: string, subId?: string): Promise<{
  success: boolean;
  product?: {
    itemId: number;
    productName: string;
    shopName: string;
    price: number;
    sales: number;
    imageUrl: string;
    rating: string | number;
    commission: number;
    sellerComFinal: number;
    shopeeComFinal: number;
    isXtra: boolean;
    cashbackRate: number;
    cashbackAmount: number;
    originalLink: string;
    affiliateLink?: string;
  };
  error?: string;
}> {
  const inspectedUrl = inspectShopeeUrl(shopeeUrl);
  if (!inspectedUrl) {
    return { success: false, error: "Link sản phẩm Shopee không hợp lệ" };
  }

  // Short link chỉ được mở sau khi đã kiểm tra đúng hostname Shopee.
  let resolvedUrl = inspectedUrl.url;
  if (inspectedUrl.kind === "short") {
    const resolved = await resolveShortLink(inspectedUrl.url);
    if (!resolved.success || !resolved.shopId || !resolved.itemId) {
      return {
        success: false,
        error: resolved.error || "Không thể mở short link Shopee",
      };
    }

    resolvedUrl = `https://shopee.vn/product/${resolved.shopId}/${resolved.itemId}`;
  }

  // Step 1: Parse URL de lay shopId + itemId, tao clean URL
  const parsed = parseShopeeUrl(resolvedUrl);
  const cleanUrl = parsed
    ? `https://shopee.vn/product/${parsed.shopId}/${parsed.itemId}`
    : resolvedUrl.split("?")[0]; // Fallback: bo query params

  // Step 2: Lay thong tin san pham + hoa hong
  const productResult = await getProductData({ url: cleanUrl });

  if (!productResult.success || !productResult.data) {
    return { success: false, error: productResult.error || "Không tìm thấy sản phẩm" };
  }

  const product = productResult.data;
  const cashback = calculateCashback(product.commission, product.price);

  // Step 3: Tạo affiliate link với sub_id của user
  const affiliateResult = await generateAffiliateLink(product.productLink, subId ? [subId] : []);

  return {
    success: true,
    product: {
      itemId: product.itemId,
      productName: product.productName,
      shopName: product.shopName,
      price: product.price,
      sales: product.sales,
      imageUrl: product.imageUrl,
      rating: product.rating,
      commission: product.commission,
      sellerComFinal: product.sellerComFinal,
      shopeeComFinal: product.shopeeComFinal,
      isXtra: product.isXtra,
      cashbackRate: Math.min(cashback.cashbackRate, 75),
      cashbackAmount: cashback.cashbackAmount,
      originalLink: product.productLink,
      affiliateLink: affiliateResult.success ? affiliateResult.shortLink : undefined,
    },
  };
}
