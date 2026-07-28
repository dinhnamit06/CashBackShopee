import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

function generateSlug(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let slug = "";
  for (let i = 0; i < 8; i++) {
    slug += chars[Math.floor(Math.random() * chars.length)];
  }
  return slug;
}

export async function POST(req: NextRequest) {
  try {
    const { url, subId } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Thiếu URL" }, { status: 400 });
    }

    const user = await getAuthUser();
    const slug = generateSlug();

    const link = await prisma.shortLink.create({
      data: {
        slug,
        targetUrl: url,
        userId: user?.id || null,
        subId: subId || "",
      },
    });

    return NextResponse.json({ shortUrl: `/r/${slug}`, slug });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
