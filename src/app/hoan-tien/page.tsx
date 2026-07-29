import { Suspense } from "react";
import HoanTienClient from "@/components/hoantien/HoanTienClient";

export const metadata = {
  title: "Mua sắm hoàn tiền Shopee | HoanTien",
  description: "Dán link sản phẩm Shopee để nhận hoàn tiền ngay.",
};

export default function HoanTienPage() {
  return (
    <div className="bg-slate-50 min-h-[calc(100vh-56px)]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-xl font-extrabold text-foreground">
            Dán link <span className="text-primary">Shopee</span> để nhận hoàn tiền
          </h1>
        </div>

        <Suspense fallback={<div className="text-center py-8 text-muted text-sm">Đang tải...</div>}>
          <HoanTienClient />
        </Suspense>

        <div className="mt-8 bg-white rounded-2xl border border-zinc-200 p-4">
          <p className="text-xs text-muted leading-relaxed">
            Sau khi mua hàng, hệ thống sẽ ghi nhận đơn và hoàn tiền về ví của bạn.
          </p>
        </div>
      </div>
    </div>
  );
}
