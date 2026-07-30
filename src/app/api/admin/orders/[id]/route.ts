import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  const { status } = await req.json();
  await prisma.order.update({ where: { id }, data: { status } });
  return NextResponse.json({ success: true });
}
