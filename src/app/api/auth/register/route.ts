import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie, generateLinkCode, generateSubId } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone, referralCode } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Thiếu email hoặc mật khẩu" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email đã được sử dụng" }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    const linkCode = generateLinkCode();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || "",
        phone: phone || "",
        linkCode,
        subId: "",
        referralCode: linkCode,
        referredBy: referralCode || null,
      },
    });

    const subId = generateSubId(user.id, linkCode);
    await prisma.user.update({ where: { id: user.id }, data: { subId } });

    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode } });
      if (referrer && referrer.id !== user.id) {
        await prisma.referral.create({
          data: { referrerId: referrer.id, referredId: user.id },
        });
      }
    }

    await setAuthCookie(user.id);

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, balance: user.balance, linkCode: user.linkCode, subId },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
