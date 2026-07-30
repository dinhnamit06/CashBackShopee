import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const status = req.nextUrl.searchParams.get("status") || undefined;
  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ orders });
}
