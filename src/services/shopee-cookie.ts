/**
 * Cookie-based Affiliate Link Generator
 * Dùng Shopee session cookie thay vì Partner Key
 *
 * Cách lấy cookie:
 * 1. Đăng nhập https://banhang.shopee.vn/
 * 2. F12 → Application → Cookies → shopee.vn
 * 3. Copy giá trị SPC_EC
 * 4. Dán vào .env: SHOPEE_COOKIE_SPC_EC=...
 */

interface ShopeeCookies {
  SPC_F?: string;
  SPC_SI?: string;
  SPC_SEC_SI?: string;
  SPC_ST?: string;
  SPC_U?: string;
  SPC_IA?: string;
  SPC_EC?: string;
  csrftoken?: string;
  ds?: string;
}

/**
 * Tạo affiliate short link dùng cookie thay vì API key
 *
 * Flow: Dùng cookie session của Shopee Affiliate
 * gọi trực tiếp internal API endpoint
 */
export async function generateAffiliateLinkViaCookie(
  originUrl: string,
  cookies: ShopeeCookies
): Promise<{ success: boolean; shortLink?: string; error?: string }> {
  try {
    const cookieString = Object.entries(cookies)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");

    // Dùng addlivetag short link API (họ đã có sẵn cookie management)
    // Endpoint nội bộ của addlivetag để tạo link qua cookie
    const res = await fetch(
      "https://addlivetag.com/api/v1/generate-link.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieString,
        },
        body: JSON.stringify({ url: originUrl }),
      }
    );

    if (!res.ok) {
      // Fallback 2: Gọi trực tiếp Shopee internal API
      return await generateViaShopeeInternal(originUrl, cookies);
    }

    const json = await res.json();
    if (json.shortLink) {
      return { success: true, shortLink: json.shortLink };
    }

    return await generateViaShopeeInternal(originUrl, cookies);
  } catch {
    return {
      success: false,
      error: "Cookie hết hạn hoặc không hợp lệ. Vui lòng lấy cookie mới từ https://banhang.shopee.vn/",
    };
  }
}

/**
 * Gọi trực tiếp Shopee Affiliate internal API
 */
async function generateViaShopeeInternal(
  originUrl: string,
  cookies: ShopeeCookies
): Promise<{ success: boolean; shortLink?: string; error?: string }> {
  try {
    const cookieString = Object.entries(cookies)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");

    // Shopee Affiliate internal API để tạo short link
    const res = await fetch(
      "https://affiliate.shopee.vn/api/v1/link/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Cookie: cookieString,
          Referer: "https://banhang.shopee.vn/",
          Origin: "https://banhang.shopee.vn",
        },
        body: JSON.stringify({
          origin_url: originUrl,
          sub_ids: [],
        }),
      }
    );

    if (!res.ok) {
      return {
        success: false,
        error: `HTTP ${res.status}: Cookie có thể đã hết hạn`,
      };
    }

    const json = await res.json();

    if (json.short_link || json.data?.short_link) {
      return {
        success: true,
        shortLink: json.short_link || json.data.short_link,
      };
    }

    if (json.error || json.message) {
      return {
        success: false,
        error: json.error || json.message,
      };
    }

    return { success: false, error: "Không parse được response" };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Lấy cookie từ env
 */
export function getCookiesFromEnv(): ShopeeCookies | null {
  const spcF = process.env.SHOPEE_COOKIE_SPC_F;
  const spcSI = process.env.SHOPEE_COOKIE_SPC_SI;
  const spcST = process.env.SHOPEE_COOKIE_SPC_ST;
  const spcU = process.env.SHOPEE_COOKIE_SPC_U;

  if (!spcF && !spcSI && !spcST) return null;

  return {
    SPC_F: spcF || "",
    SPC_SI: spcSI || "",
    SPC_SEC_SI: process.env.SHOPEE_COOKIE_SPC_SEC_SI || "",
    SPC_ST: spcST || "",
    SPC_U: spcU || "",
    SPC_IA: process.env.SHOPEE_COOKIE_SPC_IA || "1",
    csrftoken: process.env.SHOPEE_COOKIE_CSRFTOKEN || "",
    ds: process.env.SHOPEE_COOKIE_DS || "",
  };
}
