"use client";

import { CheckCircle2, Copy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import gsap from "gsap";

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const intervalRef = useRef(null);
  const [count, setCount] = useState(30);
  const iconRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const orderIdRef = useRef(null);
  const contactRef = useRef(null);
  const redirectRef = useRef(null);
  const buttonRef = useRef(null);

  const orderIdParam = searchParams.get("orderId");
  const orderId =
    typeof orderIdParam === "string" && orderIdParam.trim()
      ? orderIdParam.trim()
      : "";
  const displayedOrderId = orderId || "—";

  function clearCountdown() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  useEffect(() => {
    const elements = [
      iconRef.current,
      titleRef.current,
      descRef.current,
      orderIdRef.current,
      contactRef.current,
      redirectRef.current,
      buttonRef.current,
    ].filter(Boolean);

    gsap.fromTo(
      elements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
      }
    );

    intervalRef.current = setInterval(() => {
      setCount((currentCount) => {
        if (currentCount <= 1) {
          clearCountdown();
          router.push("/");
          return 0;
        }

        return currentCount - 1;
      });
    }, 1000);

    return () => {
      clearCountdown();
    };
  }, [router]);

  async function handleCopyOrderId() {
    if (!orderId) {
      return;
    }

    try {
      await navigator.clipboard.writeText(orderId);
      toast.success("Order ID copied!");
    } catch {
      toast.error("Could not copy order ID.");
    }
  }

  function handleGoHome() {
    clearCountdown();
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] px-4 py-10">
      <div className="w-full max-w-2xl text-center">
        <div ref={iconRef} className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#2f3810] bg-[rgba(222,252,62,0.1)] opacity-0">
          <CheckCircle2 className="h-11 w-11 text-[#DEFC3E]" strokeWidth={1.8} />
        </div>

        <h1 ref={titleRef} className="mt-8 text-3xl font-bold text-[#e9e9e9] sm:text-4xl opacity-0">
          Thank You for Your Order!
        </h1>

        <p ref={descRef} className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6b6b6b] sm:text-base opacity-0">
          Your order has been successfully placed. We will contact you
          shortly to confirm your order.
        </p>

        <div ref={orderIdRef} className="mt-8 opacity-0">
          <p className="text-[10px] uppercase tracking-[3px] text-[#6b6b6b]">
            Your Order ID
          </p>

          <div className="mx-auto mt-3 flex w-full max-w-108 items-center justify-center gap-3 rounded-full border border-[#314006] bg-[rgba(222,252,62,0.08)] px-4 py-4">
            <span className="font-mono text-lg text-[#DEFC3E] sm:text-xl">
              {displayedOrderId}
            </span>

            <button
              type="button"
              onClick={handleCopyOrderId}
              disabled={!orderId}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#42540b] bg-[rgba(222,252,62,0.1)] text-[#DEFC3E] transition-colors hover:bg-[rgba(222,252,62,0.16)] disabled:cursor-not-allowed disabled:opacity-45"
              aria-label="Copy order ID"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p ref={contactRef} className="mx-auto mt-8 max-w-xl text-sm leading-7 text-[#6b6b6b] opacity-0">
          Have questions? Reach us at{" "}
          <a
            href="mailto:help@surteez.com"
            className="text-[#DEFC3E] transition-opacity hover:opacity-80"
          >
            help@surteez.com
          </a>{" "}
          or WhatsApp us at{" "}
          <a
            href="https://wa.me/923190328248"
            target="_blank"
            rel="noreferrer"
            className="text-[#DEFC3E] transition-opacity hover:opacity-80"
          >
            0319-0328248
          </a>
          .
        </p>

        <p ref={redirectRef} className="mt-8 text-sm text-[#ffffff] opacity-0">
          Redirecting you to home in {count} seconds...
        </p>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleGoHome}
          className="mx-auto mt-6 block w-full max-w-100 rounded-sm bg-[#DEFC3E] px-5 py-4 text-sm font-semibold uppercase tracking-[2px] text-black transition-all duration-300 hover:translate-y-[-10px] hover:shadow-[0_25px_50px_-12px_rgba(222,252,62,0.5)] active:scale-90 opacity-0"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

function ThankYouFallback() {
  return <div className="min-h-screen bg-[#000000]" />;
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<ThankYouFallback />}>
      <ThankYouContent />
    </Suspense>
  );
}
