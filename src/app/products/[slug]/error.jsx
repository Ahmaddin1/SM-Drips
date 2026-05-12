"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="fixed inset-0 z-[9999] min-h-screen min-w-screen flex flex-col items-center justify-center gap-4 bg-[#000000] px-4">
      <h1 className="text-4xl text-[#E9E9E9] font-[family-name:var(--font-bebas)]">
        PRODUCT NOT FOUND
      </h1>
      <p className="text-sm text-[#E9E9E9] opacity-60 text-center max-w-sm font-[family-name:var(--font-dm-sans)]">
        We couldn't load this product. It may have been removed or there was a network issue.
      </p>
      <button
        onClick={reset}
        className="bg-[#defc3e] text-[#000000] font-semibold px-6 py-2 hover:opacity-80 transition-opacity"
      >
        TRY AGAIN
      </button>
      <Link
        href="/products"
        className="text-[#defc3e] text-sm underline font-sans mt-2"
      >
        BACK TO PRODUCTS
      </Link>
    </div>
  );
}
