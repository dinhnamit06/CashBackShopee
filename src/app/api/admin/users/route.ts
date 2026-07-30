import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const sp = req.nextUrl.searchParams;
  const page = parseInt(sp.get("page") || "1");
  const pageSize = parseInt(sp.get("pageSize") || "20");
  const search = sp.get("search") || "";

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: { id: true, email: true, name: true, phone: true, balance: true, totalEarned: true, role: true, linkCode: true, subId: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function PUT(req: NextRequest) {
  const admin = await getAuthUser();
  if (!admin || admin.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { userId, role } = await req.json();
  if (!["user", "admin"].includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  // Khong cho phep tu ha cap ban than
  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.role === "admin" && role !== "admin") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) return NextResponse.json({ error: "Không thể xóa admin cuối cùng" }, { status: 400 });
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  return NextResponse.json({ success: true });
}
