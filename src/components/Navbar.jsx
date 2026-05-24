"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCartCount } from "@/lib/cart";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop All" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
];

export default function Navbar({ brandName }) {
  const [cartCount, setCartCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const syncCartCount = () => {
      setCartCount(getCartCount());
    };

    syncCartCount();
    window.addEventListener("cartUpdated", syncCartCount);

    return () => {
      window.removeEventListener("cartUpdated", syncCartCount);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none sticky top-4 z-50 flex w-full justify-center md:hidden">
        <div className="pointer-events-auto flex w-[90%] items-center justify-between rounded-full border border-[#3a3a3a] bg-black/60 backdrop-blur-md px-5 py-3">
          <Link href="/" aria-label={brandName} className="shrink-0">
            <Image
              src="/icon.png"
              alt={brandName}
              width={36}
              height={36}
              className="rounded-sm"
            />
          </Link>

          <div className="flex items-center gap-2 ">
            <Link
              href="/cart"
              aria-label="Open cart"
              className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#defc3e] text-black"
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
              {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e9e9e9] text-[9px] font-bold text-black">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3a3a3a] text-[#e9e9e9]"
            >
              <Menu className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none sticky top-4 z-50 hidden w-full justify-center md:flex">
        <div className="pointer-events-auto relative flex w-[90%] items-center rounded-full border border-[#3a3a3a] bg-black/60 backdrop-blur-md px-5 py-3">
          <Link href="/" aria-label={brandName} className="shrink-0">
            <Image
              src="/icon.png"
              alt={brandName}
              width={40}
              height={40}
              className="rounded-sm"
            />
          </Link>

          <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] uppercase tracking-[2px] text-[#e9e9e9] transition-colors duration-200 hover:text-[#defc3e]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/cart"
            aria-label="Open cart"
            className="relative ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#defc3e] text-black"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e9e9e9] text-[9px] font-bold text-black">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {drawerOpen ? (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-9997 bg-black/60 md:hidden"
        />
      ) : null}

      <div
        className={`fixed top-0 right-0 z-9998 flex h-screen w-72 flex-col bg-[#000000] transition-transform duration-300 ease-in-out md:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end px-5 py-4">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3a3a3a] text-[#e9e9e9]"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>

        <nav className="flex flex-col gap-6 px-6 pt-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              className="text-[13px] uppercase tracking-[2px] text-[#e9e9e9] transition-colors duration-200 hover:text-[#defc3e]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
