import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const [users, orders, withdraws] = await Promise.all([
    prisma.user.count(),
    prisma.order.count(),
    prisma.withdraw.count({ where: { status: "pending" } }),
  ]);
  const agg = await prisma.order.aggregate({
    _sum: { commission: true, cashbackAmount: true },
  });
  const commission = agg._sum.commission || 0;
  const commissionAfterTax = Math.floor(commission * 0.9); // Shopee thuế 10%
  const cashback = agg._sum.cashbackAmount || 0;
  return NextResponse.json({ users, orders, commission, commissionAfterTax, cashback, profit: commission - cashback, profitAfterTax: commissionAfterTax - cashback, withdraws });
}
