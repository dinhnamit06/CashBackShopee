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
      // addlivetag API: sub_id1 chinh la sub_id cua chung ta
      const subId = item.sub_id1 || "";
      if (!subId) continue;

      // Dung purchase_time + subId lam unique key
      const purchaseTime = item.purchase_time
        ? new Date(Number(item.purchase_time) * 1000)
        : new Date();
      const orderKey = `${subId}_${purchaseTime.getTime()}`;

      const existing = await prisma.order.findFirst({
        where: { subId, purchaseTime },
      });
      if (existing) continue;

      // Match user: subId format = U{userId prefix}{linkCode}
      const match = subId.match(/^U([a-zA-Z0-9]{4})/);
      if (!match) continue;

      const user = await prisma.user.findFirst({
        where: { subId: { startsWith: `U${match[1]}` } },
      });
      if (!user) continue;

      const commission = Number(item.commission) || 0;
      const mcnFee = Number(item.mcn_fee) || 0;
      const netCommission = commission - mcnFee; // Commission sau phi MCN
      const shareRate = Number(process.env.CASHBACK_SHARE_RATE || "0.6");
      const cashback = Math.floor(netCommission * shareRate);

      await prisma.order.create({
        data: {
          userId: user.id,
          shopeeOrderSn: item.order_id || item.order_sn || orderKey,
          productName: item.item_name || "San pham Shopee",
          productImage: item.image || "",
          shopName: item.shop_name || "",
          price: Number(item.price) || 0,
          commission: netCommission,
          cashbackAmount: cashback,
          cashbackRate: Math.round(shareRate * 100),
          status: "completed",
          subId,
          purchaseTime,
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
 * Chi credit nhung don co status "completed" va chua bi huy/hoan
 */
export async function releaseOrders() {
  // Cau hinh so ngay hold qua env, mac dinh 0 = credit ngay
  const holdDays = Number(process.env.HOLD_DAYS || "0");
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - holdDays);

  const readyOrders = await prisma.order.findMany({
    where: {
      status: "completed",
      purchaseTime: { lte: cutoff },
    },
  });

  let released = 0;

  for (const order of readyOrders) {
    // Kiem tra lai: don co con trong conversion report khong?
    // Neu bi huy/hoan → status se la "rejected" → khong credit
    if (order.status !== "completed") continue;

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
          desc: `Hoan tien don ${order.productName}`,
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
              desc: `Thuong gioi thieu tu don ${order.productName}`,
            },
          }),
        ]);
      }
    }

    released++;
  }

  return { success: true, released };
}
