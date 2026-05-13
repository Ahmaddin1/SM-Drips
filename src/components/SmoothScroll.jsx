"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      smoothTouch: !isMobile,
      touchMultiplier: 0.8,
      touchInertiaMultiplier: isMobile ? 20 : 35,
      infinite: false,
      syncTouch: true,
    });
    lenisRef.current = lenis;

    // Sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Hook Lenis into GSAP's ticker so both run on the same RAF loop
    const ticker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(ticker);

    // Prevent GSAP from adding its own lag smoothing on top of Lenis
    gsap.ticker.lagSmoothing(0);

    // Listen for cart modal open/close to stop/start Lenis
    const handleCartModal = (e) => {
      if (e.detail?.isOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    window.addEventListener("cartModalChange", handleCartModal);

    // Force Lenis to recalculate on route changes
    const handleRouteChange = () => {
      setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 100);
    };

    // Listen for Next.js route changes
    window.addEventListener("popstate", handleRouteChange);

    // Also listen for any dynamic content changes
    const observer = new MutationObserver(() => {
      lenis.resize();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      lenis.destroy();
      window.removeEventListener("cartModalChange", handleCartModal);
      window.removeEventListener("popstate", handleRouteChange);
      observer.disconnect();
      gsap.ticker.remove(ticker);
    };
  }, []);

  return <>{children}</>;
}
