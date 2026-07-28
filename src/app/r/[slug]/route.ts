import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const link = await prisma.shortLink.findUnique({ where: { slug } });
  if (!link) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  await prisma.shortLink.update({
    where: { slug },
    data: { clicks: { increment: 1 } },
  });

  return NextResponse.redirect(new URL(link.targetUrl));
}
