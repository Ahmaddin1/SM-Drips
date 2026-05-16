"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";

gsap.registerPlugin(useGSAP);

export default function Hero4() {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const brandRef = useRef(null);

  useGSAP(
    () => {
      const handleVisibility = () => {
        if (document.hidden) gsap.globalTimeline.pause();
        else gsap.globalTimeline.resume();
      };
      document.addEventListener("visibilitychange", handleVisibility);
      const cleanupVisibility = () => {
        document.removeEventListener("visibilitychange", handleVisibility);
      };

      function startGlitch(accent) {
        if (!accent) return;

        function fireGlitch() {
          const glitchTl = gsap.timeline({
            onComplete: () => {
              gsap.delayedCall(2.5 + Math.random() * 3.5, fireGlitch);
            },
          });

          glitchTl
            .to(accent, {
              skewX: -8,
              x: -4,
              color: "#00ffcc",
              textShadow: "4px 0 #ff0040, -4px 0 #0040ff",
              duration: 0.05,
              ease: "none",
            })
            .to(accent, {
              skewX: 6,
              x: 3,
              color: "#ff6ef0",
              textShadow: "-3px 0 #00ffcc, 3px 0 #ffe600",
              duration: 0.05,
              ease: "none",
            })
            .to(accent, {
              skewX: 0,
              x: 0,
              color: "#ffffff",
              textShadow: "none",
              duration: 0.04,
              ease: "none",
            })
            .to(accent, {
              skewX: -12,
              x: -6,
              color: "#ff0040",
              textShadow: "6px 0 #00ffcc, -6px 0 #ffe600",
              duration: 0.05,
              ease: "none",
            })
            .to(accent, {
              skewX: 4,
              x: 2,
              scale: 1.04,
              color: "#defc3e",
              textShadow: "none",
              duration: 0.05,
              ease: "none",
            })
            .to(accent, {
              skewX: 0,
              x: 0,
              scale: 1,
              color: "#defc3e",
              textShadow: "none",
              duration: 0.15,
              ease: "power3.out",
            });
        }

        gsap.delayedCall(1.2, fireGlitch);
      }

      function startIdleLoop() {
        const words = containerRef.current.querySelectorAll(
          ".hero-word:not(.hero-accent)",
        );
        const accent = containerRef.current.querySelector(".hero-accent");

        words.forEach((word, i) => {
          gsap.to(word, {
            scale: 1.04,
            opacity: 1,
            duration: 2.2,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.7,
            transformOrigin: "50% 100%",
          });
        });

        startGlitch(accent);
      }

      function runHeroEntry() {
        const entryTl = gsap.timeline({
          delay: 0.2,
          onComplete: startIdleLoop,
        });

        entryTl
          .set(containerRef.current, { opacity: 1 })
          .fromTo(
            containerRef.current.querySelectorAll(".hero-word"),
            { yPercent: 110, opacity: 0, scale: 1.08 },
            {
              yPercent: 0,
              opacity: 1,
              scale: 1,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.12,
            },
          )
          .fromTo(
            containerRef.current.querySelector(".hero-bg-word"),
            { opacity: 0 },
            { opacity: 1, duration: 1.8, ease: "power2.out" },
            "<0.3",
          )
          .fromTo(
            containerRef.current.querySelectorAll(
              ".hero-season, .hero-cta-row",
            ),
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.1,
            },
            "-=0.5",
          );
      }

      // First visit — full sequence
      gsap
        .timeline()
        .fromTo(
          brandRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" },
          0.3,
        )
        .to(brandRef.current, { duration: 0.9 })
        .to(brandRef.current, {
          opacity: 0,
          y: -40,
          duration: 0.4,
          ease: "power2.in",
        })
        .to(overlayRef.current, {
          yPercent: -100,
          duration: 1.3,
          ease: "expo.inOut",
        })
        .add(runHeroEntry, "-=0.5")
        .call(() => {
          overlayRef.current.style.display = "none";
        });

      return () => {
        cleanupVisibility();
      };
    },
    { scope: containerRef },
  );

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-100 flex items-center justify-center bg-[#1e1e1e]"
      >
        <span
          ref={brandRef}
          className="font-heading text-6xl uppercase  text-[#e9e9e9]"
          style={{ opacity: 0 }}
        >
          <div className="overflow-y-clip">
            <span className="overflow-clip">SM</span>{" "}
            <span className="overflow-clip">DRIPS</span>
          </div>
        </span>
      </div>

      <section
        ref={containerRef}
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black py-20"
        style={{ opacity: 0 }}
      >
        <div className="hero-bg-word pointer-events-none absolute inset-0 flex items-center justify-center font-heading text-[clamp(120px,25vw,320px)] font-bold uppercase leading-none tracking-tight opacity-0 text-white/10">
          DRIP
        </div>

        <div className="relative z-10 flex flex-col items-center gap-12 px-6 text-center">
          <div
            className="hero-main flex flex-col items-center gap-2"
            aria-label="NO RULES. JUST DRIP."
          >
            <div className="overflow-hidden">
              <span
                className="hero-word block font-heading text-[clamp(54px,10vw,110px)] leading-[0.9] text-[#e9e9e9]"
                style={{
                  transformOrigin: "50% 100%",
                  willChange: "transform, opacity",
                }}
              >
                NO
              </span>
            </div>

            <div className="overflow-hidden">
              <span
                className="hero-word hero-accent block font-heading text-[clamp(54px,10vw,110px)] leading-[0.9] text-[#defc3e]"
                style={{
                  transformOrigin: "50% 100%",
                  willChange: "transform, opacity",
                }}
              >
                RULES.
              </span>
            </div>

            <div className="overflow-hidden">
              <span
                className="hero-word block font-heading text-[clamp(54px,10vw,110px)] leading-[0.9] text-[#e9e9e9]"
                style={{
                  transformOrigin: "50% 100%",
                  willChange: "transform, opacity",
                }}
              >
                JUST DRIP.
              </span>
            </div>
          </div>

          <div className="hero-cta-row flex flex-wrap justify-center gap-3 opacity-0">
            <Link
              href="/products"
              className="rounded-full bg-[#defc3e] px-6 py-3 text-[11px] uppercase tracking-[2px] text-black transition-all duration-300 hover:-translate-y-[10px] hover:shadow-[0_25px_50px_-12px_rgba(222,252,62,0.5)] active:scale-90"
            >
              Shop Now
            </Link>
            <Link
              href="/collections"
              className="rounded-full border border-[#3a3a3a] bg-transparent px-6 py-3 text-[11px] uppercase tracking-[2px] text-[#e9e9e9] transition-colors duration-200 hover:border-[#defc3e] hover:text-[#defc3e]"
            >
              Explore Categories
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
