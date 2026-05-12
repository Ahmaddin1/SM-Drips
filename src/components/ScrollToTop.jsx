"use client";

import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-md bg-[#DEFC3E] transition-transform hover:scale-110 active:scale-90"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-6 w-6 text-black" strokeWidth={2} />
    </button>
  );
}
