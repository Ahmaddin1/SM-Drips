"use client";
import { useState, useEffect, useRef } from "react";
import { Phone, Mail, Headphones, RotateCcw, Ruler } from "lucide-react";
import { FaInstagram, FaTiktok, FaFacebook } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "sonner";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const waNumber = rawNumber.startsWith("0")
    ? "92" + rawNumber.slice(1)
    : rawNumber;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const topSectionRef = useRef(null);
  const cardsRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const topElements = topSectionRef.current?.children;
    if (topElements) {
      gsap.fromTo(
        Array.from(topElements),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          clearProps: "transform",
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: topSectionRef.current,
            start: "top 80%",
          },
        },
      );
    }

    const cards = cardsRef.current?.children;
    if (cards) {
      gsap.fromTo(
        Array.from(cards),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          clearProps: "transform",
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
          },
        },
      );
    }

    const formElements = formRef.current?.children;
    if (formElements) {
      gsap.fromTo(
        Array.from(formElements),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          clearProps: "transform",
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
          },
        },
      );
    }
  }, []);

  const handleSubmit = () => {
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in your name and message before sending.", {
        position: "bottom-right",
      });
      return;
    }

    const text = `New Contact Form Message\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${waNumber}?text=${encoded}`, "_blank");
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="min-h-screen bg-[#000000] text-[#E9E9E9]">
      <div ref={topSectionRef} className="py-20 px-6 text-center">
        <p className="text-xs tracking-[4px] uppercase text-[#aaa] mb-4 opacity-0">
          CONTACT US
        </p>
        <h1 className="text-4xl lg:text-5xl font-normal text-[#E9E9E9] mb-6 opacity-0">
          How can we help you?
        </h1>
        <p className="text-sm text-[#aaa] max-w-xl mx-auto leading-relaxed opacity-0">
          Need to get in touch? Reach out using the contact form below or send
          us a WhatsApp message directly. We're available Monday – Saturday, 10
          AM – 8 PM PKT.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="flex flex-col items-center justify-center text-center py-14 px-8 gap-4 border border-[#282828] rounded-lg opacity-0">
            <Headphones
              size={28}
              strokeWidth={1.5}
              className="text-[#E9E9E9]"
            />
            <h2 className="text-base font-medium text-[#E9E9E9]">
              Order Status
            </h2>
            <a
              href={`https://wa.me/${waNumber}`}
              className="text-sm text-[#aaa] flex items-center gap-2"
            >
              <Phone size={13} />
              {rawNumber}
            </a>
            <a
              href="mailto:contact@smdrips.com"
              className="text-sm text-[#aaa] flex items-center gap-2"
            >
              <Mail size={13} />
              contact@smdrips.com
            </a>
          </div>

          <div className="flex flex-col items-center justify-center text-center py-14 px-8 gap-4 border border-[#282828] rounded-lg opacity-0">
            <RotateCcw size={28} strokeWidth={1.5} className="text-[#E9E9E9]" />
            <h2 className="text-base font-medium text-[#E9E9E9]">
              Start a Return
            </h2>
            <a
              href={`https://wa.me/${waNumber}`}
              className="text-sm text-[#aaa] flex items-center gap-2"
            >
              <Phone size={13} />
              {rawNumber}
            </a>
            <a
              href="mailto:contact@smdrips.com"
              className="text-sm text-[#aaa] flex items-center gap-2"
            >
              <Mail size={13} />
              contact@smdrips.com
            </a>
          </div>

          <div className="flex flex-col items-center justify-center text-center py-14 px-8 gap-4 border border-[#282828] rounded-lg opacity-0">
            <Ruler size={28} strokeWidth={1.5} className="text-[#E9E9E9]" />
            <h2 className="text-base font-medium text-[#E9E9E9]">
              Sizing & Product Info
            </h2>
            <a
              href={`https://wa.me/${waNumber}`}
              className="text-sm text-[#aaa] flex items-center gap-2"
            >
              <Phone size={13} />
              {rawNumber}
            </a>
            <a
              href="mailto:contact@smdrips.com"
              className="text-sm text-[#aaa] flex items-center gap-2"
            >
              <Mail size={13} />
              contact@smdrips.com
            </a>
          </div>
        </div>
      </div>

      <div
        ref={formRef}
        className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="What's your name?"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent border border-[#282828] text-[#E9E9E9] text-sm px-5 py-4 outline-none placeholder:text-[#555] focus:border-[#DEFC3E] transition-colors rounded-lg opacity-0"
        />
        <input
          type="email"
          placeholder="What's your email?"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border border-[#282828] text-[#E9E9E9] text-sm px-5 py-4 outline-none placeholder:text-[#555] focus:border-[#DEFC3E] transition-colors rounded-lg opacity-0"
        />
        <textarea
          placeholder="Your message..."
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-transparent border border-[#282828] text-[#E9E9E9] text-sm px-5 py-4 outline-none placeholder:text-[#555] focus:border-[#DEFC3E] transition-colors resize-none rounded-lg opacity-0"
        />
        <button
          onClick={handleSubmit}
          className="bg-[#defc3e] text-[#000000] text-sm font-semibold px-8 py-4 tracking-wide self-start rounded-xl hover:-translate-y-[10px] hover:shadow-2xl hover:shadow-[#DEFC3E] active:scale-90 transition-all duration-200 opacity-0"
        >
          Send via WhatsApp
        </button>
        {sent && (
          <p className="text-sm text-[#defc3e] mt-2">
            Message opened in WhatsApp. We'll get back to you shortly.
          </p>
        )}
      </div>

      <div className="border-t border-[#282828] py-10 flex flex-col items-center gap-5">
        <p className="text-[10px] tracking-[3px] uppercase text-[#555]">
          FOLLOW US
        </p>
        <div className="flex gap-5">
          <a
            href="https://instagram.com/smdrips"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#888] hover:text-[#E9E9E9] transition-colors"
          >
            <FaInstagram size={18} />
          </a>
          <a
            href="https://tiktok.com/@smdrips"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#888] hover:text-[#E9E9E9] transition-colors"
          >
            <FaTiktok size={18} />
          </a>
          <a
            href="https://facebook.com/smdrips"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#888] hover:text-[#E9E9E9] transition-colors"
          >
            <FaFacebook size={18} />
          </a>
        </div>
      </div>
    </main>
  );
}
