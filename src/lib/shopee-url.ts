export type ShopeeUrlKind = "product" | "short";

export interface InspectedShopeeUrl {
  kind: ShopeeUrlKind;
  url: string;
}

const MAX_URL_LENGTH = 2048;
const PRODUCT_HOSTS = new Set(["shopee.vn", "www.shopee.vn"]);
const SHORT_LINK_HOSTS = new Set(["s.shopee.vn", "shope.ee"]);

function parseUrl(rawValue: string): URL | null {
  const value = rawValue.trim();

  if (!value || value.length > MAX_URL_LENGTH) {
    return null;
  }

  try {
    const url = new URL(value);

    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port
    ) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

export function parseShopeeProductIds(
  rawValue: string
): { shopId: string; itemId: string } | null {
  const url = parseUrl(rawValue);

  if (!url || !PRODUCT_HOSTS.has(url.hostname.toLowerCase())) {
    return null;
  }

  const path = url.pathname;
  const patterns = [
    /\/product\/(\d+)\/(\d+)(?:\/|$)/,
    /-i\.(\d+)\.(\d+)(?:\/|$)/,
    /\/[^/?]+\/(\d+)\/(\d+)(?:\/|$)/,
  ];

  for (const pattern of patterns) {
    const match = path.match(pattern);
    if (match) {
      return { shopId: match[1], itemId: match[2] };
    }
  }

  return null;
}

export function inspectShopeeUrl(rawValue: string): InspectedShopeeUrl | null {
  const url = parseUrl(rawValue);
  if (!url) {
    return null;
  }

  const hostname = url.hostname.toLowerCase();

  if (SHORT_LINK_HOSTS.has(hostname) && url.pathname.length > 1) {
    return { kind: "short", url: url.toString() };
  }

  if (PRODUCT_HOSTS.has(hostname) && parseShopeeProductIds(url.toString())) {
    return { kind: "product", url: url.toString() };
  }

  return null;
}
