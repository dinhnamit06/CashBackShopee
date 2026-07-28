import HomeClient from "@/components/home/HomeClient";

export const metadata = {
  title: "Hoàn tiền Shopee về ví",
  description:
    "Dán link sản phẩm Shopee, nhận link hoàn tiền riêng và theo dõi cashback minh bạch trong ví HoanTien.",
  keywords:
    "hoàn tiền Shopee, cashback Shopee, link hoàn tiền Shopee, nhận tiền về ví",
};

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <HomeClient />
    </div>
  );
}
