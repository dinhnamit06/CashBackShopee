export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export function parseShopeeLink(link: string) {
  try {
    const url = new URL(link);
    const match = url.pathname.match(/i\.(\d+)\.(\d+)/);
    if (match) {
      return { shopId: match[1], itemId: match[2] };
    }
    return null;
  } catch {
    return null;
  }
}
