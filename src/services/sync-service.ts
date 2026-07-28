/**
 * Cron Sync Service - Đồng bộ dữ liệu từ Shopee Affiliate API
 *
 * Chạy định kỳ (VD: Vercel Cron Jobs, GitHub Actions, hoặc setInterval)
 * để lấy dữ liệu mới nhất về sản phẩm, đơn hàng, click
 */

import { getConversionData, getClickData, ConversionItem } from "./shopee-api";

const API_KEY = process.env.SHOPEE_AFFILIATE_API_KEY || "";

/**
 * Sync đơn hàng mới nhất từ Shopee Affiliate
 * Gọi mỗi 5-15 phút để cập nhật đơn mới
 */
export async function syncRecentOrders(): Promise<{
  success: boolean;
  newOrders: number;
  error?: string;
}> {
  if (!API_KEY) {
    return { success: false, newOrders: 0, error: "Missing API Key" };
  }

  try {
    const today = new Date().toISOString().split("T")[0];
    const result = await getConversionData(API_KEY, {
      type: "items",
      source: "shopee",
      from: today,
      page: 1,
      pageSize: 100,
    });

    if (!result.success || !result.data) {
      return { success: false, newOrders: 0, error: result.error };
    }

    const orders = result.data.data as ConversionItem[];

    // TODO: Lưu vào database (Prisma)
    // await prisma.order.createMany({ ... })

    return { success: true, newOrders: orders.length };
  } catch (error) {
    return { success: false, newOrders: 0, error: String(error) };
  }
}

/**
 * Sync click data
 */
export async function syncRecentClicks(): Promise<{
  success: boolean;
  newClicks: number;
  error?: string;
}> {
  if (!API_KEY) {
    return { success: false, newClicks: 0, error: "Missing API Key" };
  }

  try {
    const today = new Date().toISOString().split("T")[0];
    const result = await getClickData(API_KEY, {
      from: today,
      page: 1,
      pageSize: 100,
    });

    if (!result.success || !result.data) {
      return { success: false, newClicks: 0, error: result.error };
    }

    const clicks = result.data.data;

    return { success: true, newClicks: clicks.length };
  } catch (error) {
    return { success: false, newClicks: 0, error: String(error) };
  }
}

/**
 * API endpoint để gọi sync thủ công hoặc qua cron
 */
export async function fullSync(): Promise<{
  orders: number;
  clicks: number;
  errors: string[];
}> {
  const errors: string[] = [];

  const orderResult = await syncRecentOrders();
  if (!orderResult.success) {
    errors.push(`Orders: ${orderResult.error}`);
  }

  const clickResult = await syncRecentClicks();
  if (!clickResult.success) {
    errors.push(`Clicks: ${clickResult.error}`);
  }

  return {
    orders: orderResult.newOrders,
    clicks: clickResult.newClicks,
    errors,
  };
}
