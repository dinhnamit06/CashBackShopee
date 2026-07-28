import { prisma } from "@/lib/prisma";
import { getConversionData } from "@/services/shopee-api";
import { getAuthUser } from "@/lib/auth";

/**
 * Lay sub_id cua user hien tai de tracking
 */
export async function getUserSubId(): Promise<string | null> {
  const user = await getAuthUser();
  if (!user) return null;
  return user.subId || null;
}

/**
 * Sync don hang tu Shopee Affiliate API ve database
 * Match sub_id → userId de credit cashback
 */
export async function syncOrders() {
  const apiKey = process.env.SHOPEE_AFFILIATE_API_KEY;
  if (!apiKey) return { success: false, error: "Missing API key" };

  try {
    const today = new Date().toISOString().split("T")[0];
    const result = await getConversionData(apiKey, {
      type: "items",
      source: "shopee",
      from: today,
      page: 1,
      pageSize: 100,
    });

    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    const items = result.data.data as any[];
    let credited = 0;

    for (const item of items) {
      const subId = item.sub_id1 || item.sub_id || "";
      if (!subId) continue;

      const existing = await prisma.order.findFirst({
        where: { subId, shopeeOrderSn: item.order_sn || "" },
      });
      if (existing) continue;

      const user = await prisma.user.findFirst({
        where: { subId: { contains: subId.split("_")[0] || "" } },
      });
      if (!user) continue;

      const commission = Number(item.commission) || 0;
      const shareRate = Number(process.env.CASHBACK_SHARE_RATE || "0.6");
      const cashback = Math.floor(commission * shareRate);

      await prisma.order.create({
        data: {
          userId: user.id,
          shopeeOrderSn: item.order_sn || "",
          productName: item.item_name || "",
          productImage: item.image || "",
          price: Number(item.price) || 0,
          commission,
          cashbackAmount: cashback,
          cashbackRate: Math.round(shareRate * 100),
          status: "pending",
          subId,
          purchaseTime: item.purchase_time ? new Date(item.purchase_time * 1000) : undefined,
        },
      });

      credited++;
    }

    return { success: true, credited };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Complete orders past hold period → credit user
 */
export async function releaseOrders() {
  const holdDays = 7;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - holdDays);

  const readyOrders = await prisma.order.findMany({
    where: {
      status: "completed",
      purchaseTime: { lte: cutoff },
    },
  });

  for (const order of readyOrders) {
    await prisma.$transaction([
      prisma.order.update({ where: { id: order.id }, data: { status: "paid" } }),
      prisma.user.update({
        where: { id: order.userId },
        data: { balance: { increment: order.cashbackAmount }, totalEarned: { increment: order.cashbackAmount } },
      }),
      prisma.transaction.create({
        data: {
          userId: order.userId,
          type: "cashback",
          amount: order.cashbackAmount,
          orderId: order.id,
          desc: `Hoàn tiền đơn ${order.productName}`,
        },
      }),
    ]);

    // Referral reward
    const referral = await prisma.referral.findFirst({
      where: { referredId: order.userId },
    });
    if (referral) {
      const refRate = 0.2;
      const refReward = Math.floor(order.cashbackAmount * refRate);
      if (refReward > 0) {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: referral.referrerId },
            data: { balance: { increment: refReward }, totalEarned: { increment: refReward } },
          }),
          prisma.transaction.create({
            data: {
              userId: referral.referrerId,
              type: "referral",
              amount: refReward,
              orderId: order.id,
              desc: `Thưởng giới thiệu từ đơn ${order.productName}`,
            },
          }),
        ]);
      }
    }
  }

  return { success: true, released: readyOrders.length };
}
