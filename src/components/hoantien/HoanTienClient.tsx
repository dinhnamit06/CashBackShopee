"use client";

import { Suspense } from "react";
import ProductLookupResult from "./ProductLookupResult";
import PasteLink from "@/components/home/PasteLink";

export default function HoanTienClient() {
  return (
    <>
      <PasteLink />
      <div className="mt-8">
        <Suspense fallback={null}>
          <ProductLookupResult />
        </Suspense>
      </div>
    </>
  );
}
