"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";

gsap.registerPlugin(useGSAP);

export default function HeroWithEntry({ brandName, tagline }) {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const brandRef = useRef(null);
  const taglineTextRef = useRef(null);
  const lineRef = useRef(null);
  const heroRef = useRef(null);
  const timelineRef = useRef(null);

  useGSAP(
    () => {
      // DEBUGGING — remove after fix
      console.log("✅ useGSAP fired");
      console.log("overlayRef:", overlayRef.current);
      console.log("heroRef:", heroRef.current);
      console.log("brandRef:", brandRef.current);
      console.log(
        "sessionStorage flag:",
        sessionStorage.getItem("entryAnimationPlayed"),
      );
      // END DEBUGGING

      const hasPlayed = sessionStorage.getItem("entryAnimationPlayed");

      if (hasPlayed) {
        gsap.set(overlayRef.current, { y: "-100%" });
        gsap.set(heroRef.current, { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("entryAnimationPlayed", "true");
          window.dispatchEvent(new CustomEvent("entryAnimationComplete"));
        },
      });
      timelineRef.current = tl;

      gsap.set(brandRef.current, { y: 40, opacity: 0 });
      gsap.set(taglineTextRef.current, { opacity: 0 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "center" });
      gsap.set(heroRef.current, { opacity: 0 });

      tl.to(
        brandRef.current,
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        0.3,
      )
        .to(
          taglineTextRef.current,
          { opacity: 1, duration: 0.7, ease: "power3.out" },
          0.7,
        )
        .to(
          lineRef.current,
          { scaleX: 1, duration: 0.6, ease: "power3.out" },
          1.2,
        )
        .to(
          overlayRef.current,
          { y: "-100%", duration: 0.6, ease: "power3.out" },
          2.8,
        )
        .to(
          heroRef.current,
          { opacity: 1, duration: 0.8, ease: "power3.out" },
          2.8,
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center md:py-12"
    >
      <div
        ref={overlayRef}
        style={{ backgroundColor: "red" }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3"
      >
        <h1
          ref={brandRef}
          className="font-heading text-center leading-none tracking-[0.08em] text-[#defc3e]"
          style={{ fontSize: "clamp(56px, 8vw, 96px)" }}
        >
          {brandName}
        </h1>
        <p
          ref={taglineTextRef}
          className="text-center text-[11px] uppercase tracking-[0.45em] text-white/70 sm:text-xs"
        >
          {tagline}
        </p>
        <div ref={lineRef} className="h-px w-[min(220px,48vw)] bg-[#defc3e]" />
      </div>

      <div
        ref={heroRef}
        className="relative mx-auto h-[80vh] w-[90vw] overflow-hidden rounded-3xl bg-[#1a1a1a]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2f2f2f_0%,#1a1a1a_55%,#111111_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
          <div className="max-w-2xl rounded-[28px] bg-black/45 p-6 backdrop-blur-sm">
            <p className="text-[11px] uppercase tracking-[3px] text-[#defc3e]">
              New Drop &mdash; SS26
            </p>
            <h1
              className="mt-4 font-heading uppercase leading-none text-[#e9e9e9]"
              style={{ fontSize: "clamp(38px, 7vw, 84px)" }}
            >
              Streetwear Built To Stand Out
            </h1>
            {/* <p className="mt-4 max-w-xl text-[13px] leading-relaxed tracking-[1px] text-[#9a9a9a]">
              Fresh silhouettes, elevated basics, and bold everyday pieces
              designed for the next rotation.
            </p> */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-[#defc3e] px-6 py-3 text-[11px] uppercase tracking-[2px] text-black transition-all duration-300 hover:translate-y-[-10px] hover:shadow-[0_25px_50px_-12px_rgba(222,252,62,0.5)] active:scale-90"
              >
                Shop Now
              </Link>
              <Link
                href="#categories"
                className="rounded-full border border-[#3a3a3a] bg-transparent px-6 py-3 text-[11px] uppercase tracking-[2px] text-[#e9e9e9] transition-colors duration-200 hover:border-[#defc3e] hover:text-[#defc3e]"
              >
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
