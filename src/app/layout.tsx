import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const rawHost =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "";
  const host = /^[a-z0-9.-]+(?::\d{2,5})?$/i.test(rawHost)
    ? rawHost
    : "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol =
    forwardedProtocol === "https" || !host.startsWith("localhost")
      ? "https"
      : "http";
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "HoanTien - Hoàn tiền Shopee về ví",
      template: "%s | HoanTien",
    },
    description:
      "Dán link sản phẩm Shopee, mua qua link hoàn tiền và nhận cashback về ví sau khi đơn được đối soát.",
    keywords:
      "hoàn tiền Shopee, cashback Shopee, link hoàn tiền Shopee, mua sắm hoàn tiền",
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: "HoanTien",
      title: "HoanTien - Hoàn tiền Shopee về ví",
      description: "Mua sắm như thường. Nhận lại tiền thật.",
      images: [
        {
          url: "/og.png",
          width: 1728,
          height: 906,
          alt: "HoanTien - Mua sắm như thường. Nhận lại tiền thật.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "HoanTien - Hoàn tiền Shopee về ví",
      description: "Mua sắm như thường. Nhận lại tiền thật.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
