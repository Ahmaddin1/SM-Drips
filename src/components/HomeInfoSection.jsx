"use client";

import { useRef, useState, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomeInfoSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const answersRef = useRef([]);
  const leftColumnRef = useRef(null);
  const rightColumnItemsRef = useRef([]);
  const promoBoxesRef = useRef([]);

  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Delivery takes 2-4 working days nationwide.",
    },
    {
      q: "Do you offer returns or exchanges?",
      a: "Yes. Easy 7-day exchange policy on unworn items with tags intact.",
    },
    {
      q: "Is Cash on Delivery available?",
      a: "Yes — Cash on Delivery available all over Pakistan.",
    },
    {
      q: "Which courier services do you use?",
      a: "We ship via trusted courier partners for fast & secure delivery.",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    rightColumnItemsRef.current = rightColumnItemsRef.current.slice(
      0,
      faqs.length,
    );
    promoBoxesRef.current = promoBoxesRef.current.slice(0, 2);

    const ctx = gsap.context(() => {
      if (leftColumnRef.current) {
        gsap.set(leftColumnRef.current, {
          x: -window.innerWidth,
          autoAlpha: 0,
        });
      }

      const validRightItems = rightColumnItemsRef.current.filter(Boolean);
      if (validRightItems.length > 0) {
        gsap.set(validRightItems, { x: window.innerWidth, autoAlpha: 0 });
      }

      const validPromoBoxes = promoBoxesRef.current.filter(Boolean);
      if (validPromoBoxes.length > 0) {
        gsap.set(validPromoBoxes, { y: 30, autoAlpha: 0 });
      }

      const mm = gsap.matchMedia();

      mm.add("(max-width: 1023px)", () => {
        // Mobile: separate animations with top 90% start
        if (leftColumnRef.current) {
          gsap.to(leftColumnRef.current, {
            x: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: leftColumnRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          });
        }

        if (validRightItems.length > 0) {
          validRightItems.forEach((item) => {
            gsap.to(item, {
              x: 0,
              autoAlpha: 1,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            });
          });
        }

        if (validPromoBoxes.length > 0) {
          gsap.to(validPromoBoxes, {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: validPromoBoxes[0],
              start: "top 90%",
              toggleActions: "play none none none",
            },
          });
        }
      });

      mm.add("(min-width: 1024px)", () => {
        // Desktop: simultaneous animations with top 80% start
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: leftColumnRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        if (leftColumnRef.current) {
          tl.to(leftColumnRef.current, {
            x: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power2.out",
          });
        }

        if (validRightItems.length > 0) {
          tl.to(
            validRightItems,
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: "power2.out",
            },
            "<",
          );
        }

        if (validPromoBoxes.length > 0) {
          tl.to(
            validPromoBoxes,
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.9,
              stagger: 0.15,
              ease: "power2.out",
            },
            "-=0.2",
          );
        }
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [isMounted, faqs.length]);

  useLayoutEffect(() => {
    answersRef.current.forEach((el, index) => {
      if (el) {
        if (openIndex === index) {
          gsap.fromTo(
            el,
            { height: 0, opacity: 0 },
            { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" },
          );
        } else {
          gsap.to(el, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          });
        }
      }
    });
  }, [openIndex]);

  return (
    <section className="w-full bg-[#000000] text-[#E9E9E9] overflow-hidden">
      <div className="grid grid-cols-1 gap-16 px-6 py-20 lg:grid-cols-2 lg:px-16">
        <div ref={leftColumnRef}>
          <p className="mb-4 text-xs uppercase tracking-widest text-[#888]">
            BUILT FOR EVERYDAY WEAR — DESIGNED TO STAND OUT
          </p>
          <h2 className="mb-6 font-heading text-5xl leading-tight text-[#E9E9E9] lg:text-6xl">
            Everyday Style. Premium Comfort.
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-[#aaa]">
            Premium fabrics. Trend-driven designs. Fast dispatch & reliable
            delivery across Pakistan.
          </p>
          <p className="text-sm leading-relaxed text-[#aaa]">
            Need help?{" "}
            <a
              href="https://wa.me/923396049590"
              className="font-bold text-[#E9E9E9]"
            >
              WhatsApp us anytime.
            </a>
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              ref={(el) => {
                rightColumnItemsRef.current[index] = el;
              }}
              className={`rounded-[22px] border bg-[#1e1e1e] transition-colors hover:border-[#DEFC3E] ${
                openIndex === index ? "border-[#DEFC3E]" : "border-[#3a3a3a]"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-4 py-4 text-left"
              >
                <span className="text-sm font-medium text-[#E9E9E9]">
                  {faq.q}
                </span>
                <span className="text-lg text-[#E9E9E9]">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              <div
                ref={(el) => (answersRef.current[index] = el)}
                className="overflow-hidden"
                style={{ height: 0, opacity: 0 }}
              >
                <div className="px-4 pb-4 text-sm leading-relaxed text-[#aaa]">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-15">
          <div
            ref={(el) => {
              promoBoxesRef.current[0] = el;
            }}
            className="flex flex-col items-center justify-center text-center py-14 px-8 border border-[#282828] rounded-lg"
          >
            <p className="text-sm font-bold text-[#E9E9E9]">
              New customers get 10% off
            </p>
            <p className="text-xs text-[#888]">on their first purchase</p>
          </div>
          <div
            ref={(el) => {
              promoBoxesRef.current[1] = el;
            }}
            className="flex flex-col items-center justify-center text-center py-14 px-8 border border-[#282828] rounded-lg"
          >
            <p className="text-sm font-bold text-[#E9E9E9]">Free shipping</p>
            <p className="text-xs text-[#888]">on orders over PKR 2,999</p>
          </div>
        </div>
      </div>
    </section>
  );
}
