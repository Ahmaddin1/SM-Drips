"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { LoaderCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { gsap } from "gsap";

const CART_STORAGE_KEY = "cart";
const LEGACY_CART_STORAGE_KEY = "smDrips_cart";

function getImageSrc(image) {
  if (!image) {
    return "";
  }

  return typeof image === "string" ? image : (image.url ?? "");
}

function formatPrice(value) {
  return Number(value ?? 0).toLocaleString();
}

function readStoredCart() {
  try {
    const currentCart = localStorage.getItem(CART_STORAGE_KEY);

    if (currentCart) {
      const parsedCurrentCart = JSON.parse(currentCart);
      return Array.isArray(parsedCurrentCart) ? parsedCurrentCart : [];
    }

    const legacyCart = localStorage.getItem(LEGACY_CART_STORAGE_KEY);

    if (!legacyCart) {
      return [];
    }

    const parsedLegacyCart = JSON.parse(legacyCart);

    if (!Array.isArray(parsedLegacyCart)) {
      return [];
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(parsedLegacyCart));
    localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    return parsedLegacyCart;
  } catch {
    return [];
  }
}

function NoteAccordion({
  label,
  value,
  onChange,
  isOpen,
  onToggle,
  wrapperRef,
  contentRef,
}) {
  return (
    <div
      className={`rounded-[22px] border bg-[#1e1e1e] transition-colors hover:border-[#DEFC3E] ${
        isOpen ? "border-[#DEFC3E]" : "border-[#3a3a3a]"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-4 text-left"
      >
        <span className="text-sm text-[#e9e9e9]">{label}</span>
        <span className="text-lg leading-none text-[#e9e9e9]">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div
        ref={wrapperRef}
        style={{
          height: 0,
          opacity: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div ref={contentRef}>
          <textarea
            rows={3}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="mx-4 mb-4 w-[calc(100%-2rem)] resize-none rounded-lg border border-[#3a3a3a] bg-[#282828] p-3 text-sm text-[#e9e9e9] outline-none placeholder:text-[#6b6b6b]"
            placeholder="Type your note here..."
          />
        </div>
      </div>
    </div>
  );
}

function CartItemRow({ item, loadingItemId, onQuantityChange, onRemove }) {
  const imageSrc = getImageSrc(item.image);
  const isRowLoading = loadingItemId === item.cartItemId;
  const disableMinus = item.quantity <= 1 || isRowLoading;
  const disablePlus = item.quantity >= item.stock || isRowLoading;

  return (
    <div className="rounded-[22px] border border-[#3a3a3a] bg-[#1e1e1e] p-6 transition-colors hover:border-[#DEFC3E]">
      <div className="flex items-start gap-4">
        <div
          className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-[#282828]"
          style={{ aspectRatio: "3 / 4" }}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={item.productName ?? item.name ?? "Cart product"}
              fill
              unoptimized
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[2px] text-[#6b6b6b]">
              No Image
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3 lg:block">
              <h2 className="text-sm font-semibold leading-tight text-[#e9e9e9]">
                {item.productName ?? item.name}
              </h2>

              <div className="shrink-0 text-right lg:hidden">
                <p className="text-sm font-medium text-[#e9e9e9]">
                  Rs.{formatPrice(item.price)}
                </p>
                {item.originalPrice ? (
                  <p className="text-xs text-[#6b6b6b] line-through">
                    Rs.{formatPrice(item.originalPrice)}
                  </p>
                ) : null}
              </div>
            </div>

            <p className="mt-1 text-xs text-[#6b6b6b]">Size: {item.size}</p>

            {item.color ? (
              <p className="text-xs text-[#6b6b6b]">Color: {item.color}</p>
            ) : null}

            {item.stock === 0 ? (
              <p className="mt-2 text-xs uppercase tracking-[2px] text-red-400">
                Out of stock
              </p>
            ) : item.quantity > item.stock ? (
              <p className="mt-2 text-xs uppercase tracking-[2px] text-red-400">
                Stock updated: only {item.stock} left
              </p>
            ) : null}
          </div>

          <div className="hidden w-28 shrink-0 text-right lg:block">
            <p className="text-sm font-medium text-[#e9e9e9]">
              Rs.{formatPrice(item.price)}
            </p>
            {item.originalPrice ? (
              <p className="text-xs text-[#6b6b6b] line-through">
                Rs.{formatPrice(item.originalPrice)}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease quantity for ${item.productName ?? item.name}`}
                onClick={() => onQuantityChange(item, -1)}
                disabled={disableMinus}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#282828] ${
                  disableMinus ? "cursor-not-allowed opacity-40" : ""
                }`}
              >
                <span aria-hidden="true" className="text-[#e9e9e9]">
                  -
                </span>
              </button>

              <span className="w-8 text-center text-[16px] font-semibold text-[#e9e9e9]">
                {item.quantity}
              </span>

              <button
                type="button"
                aria-label={`Increase quantity for ${item.productName ?? item.name}`}
                onClick={() => onQuantityChange(item, 1)}
                disabled={disablePlus}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#282828] ${
                  disablePlus ? "cursor-not-allowed opacity-40" : ""
                }`}
              >
                <span aria-hidden="true" className="text-[#e9e9e9]">
                  +
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => onRemove(item.cartItemId)}
              className="bg-transparent text-xs uppercase tracking-widest text-[#6b6b6b] underline transition-colors hover:text-red-400"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const orderNoteWrapperRef = useRef(null);
  const orderNoteContentRef = useRef(null);
  const giftNoteWrapperRef = useRef(null);
  const giftNoteContentRef = useRef(null);
  const orderNoteWrapperRefMobile = useRef(null);
  const orderNoteContentRefMobile = useRef(null);
  const giftNoteWrapperRefMobile = useRef(null);
  const giftNoteContentRefMobile = useRef(null);
  const headingH1Ref = useRef(null);
  const headingCountRef = useRef(null);
  const headingLinkRef = useRef(null);
  const cartItemRefs = useRef([]);
  const rightSubtotalRef = useRef(null);
  const rightNotesRef = useRef(null);
  const desktopCheckoutBtnRef = useRef(null);
  const mobileCheckoutBtnRef = useRef(null);
  const emptyStateRef = useRef(null);
  const emptyCartIconRef = useRef(null);
  const mobileNotesRefs = useRef([]);
  const desktopShippingTextRef = useRef(null);
  const mobileShippingTextRef = useRef(null);
  const [cartItems, setCartItems] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [giftNote, setGiftNote] = useState("");
  const [isOrderNoteOpen, setIsOrderNoteOpen] = useState(false);
  const [isGiftNoteOpen, setIsGiftNoteOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCartItems(readStoredCart());
  }, []);

  useEffect(() => {
    const wrapper = orderNoteWrapperRef.current;
    const content = orderNoteContentRef.current;

    if (!wrapper || !content) {
      return;
    }

    gsap.killTweensOf(wrapper);

    if (isOrderNoteOpen) {
      const nextHeight = content.getBoundingClientRect().height;

      gsap.to(wrapper, {
        height: nextHeight,
        opacity: 1,
        duration: 0.525,
        ease: "power2.out",
        onStart: () => {
          wrapper.style.pointerEvents = "auto";
        },
        onComplete: () => {
          wrapper.style.height = "auto";
        },
      });

      return;
    }

    const currentHeight =
      wrapper.getBoundingClientRect().height ||
      content.getBoundingClientRect().height;

    gsap.set(wrapper, { height: currentHeight });
    gsap.to(wrapper, {
      height: 0,
      opacity: 0,
      duration: 0.42,
      ease: "power2.out",
      onComplete: () => {
        wrapper.style.pointerEvents = "none";
      },
    });
  }, [isOrderNoteOpen]);

  useEffect(() => {
    const wrapper = giftNoteWrapperRef.current;
    const content = giftNoteContentRef.current;

    if (!wrapper || !content) {
      return;
    }

    gsap.killTweensOf(wrapper);

    if (isGiftNoteOpen) {
      const nextHeight = content.getBoundingClientRect().height;

      gsap.to(wrapper, {
        height: nextHeight,
        opacity: 1,
        duration: 0.525,
        ease: "power2.out",
        onStart: () => {
          wrapper.style.pointerEvents = "auto";
        },
        onComplete: () => {
          wrapper.style.height = "auto";
        },
      });

      return;
    }

    const currentHeight =
      wrapper.getBoundingClientRect().height ||
      content.getBoundingClientRect().height;

    gsap.set(wrapper, { height: currentHeight });
    gsap.to(wrapper, {
      height: 0,
      opacity: 0,
      duration: 0.42,
      ease: "power2.out",
      onComplete: () => {
        wrapper.style.pointerEvents = "none";
      },
    });
  }, [isGiftNoteOpen]);

  useEffect(() => {
    const wrapper = orderNoteWrapperRefMobile.current;
    const content = orderNoteContentRefMobile.current;

    if (!wrapper || !content) {
      return;
    }

    gsap.killTweensOf(wrapper);

    if (isOrderNoteOpen) {
      const nextHeight = content.getBoundingClientRect().height;

      gsap.to(wrapper, {
        height: nextHeight,
        opacity: 1,
        duration: 0.525,
        ease: "power2.out",
        onStart: () => {
          wrapper.style.pointerEvents = "auto";
        },
        onComplete: () => {
          wrapper.style.height = "auto";
        },
      });

      return;
    }

    const currentHeight =
      wrapper.getBoundingClientRect().height ||
      content.getBoundingClientRect().height;

    gsap.set(wrapper, { height: currentHeight });
    gsap.to(wrapper, {
      height: 0,
      opacity: 0,
      duration: 0.42,
      ease: "power2.out",
      onComplete: () => {
        wrapper.style.pointerEvents = "none";
      },
    });
  }, [isOrderNoteOpen]);

  useEffect(() => {
    const wrapper = giftNoteWrapperRefMobile.current;
    const content = giftNoteContentRefMobile.current;

    if (!wrapper || !content) {
      return;
    }

    gsap.killTweensOf(wrapper);

    if (isGiftNoteOpen) {
      const nextHeight = content.getBoundingClientRect().height;

      gsap.to(wrapper, {
        height: nextHeight,
        opacity: 1,
        duration: 0.525,
        ease: "power2.out",
        onStart: () => {
          wrapper.style.pointerEvents = "auto";
        },
        onComplete: () => {
          wrapper.style.height = "auto";
        },
      });

      return;
    }

    const currentHeight =
      wrapper.getBoundingClientRect().height ||
      content.getBoundingClientRect().height;

    gsap.set(wrapper, { height: currentHeight });
    gsap.to(wrapper, {
      height: 0,
      opacity: 0,
      duration: 0.42,
      ease: "power2.out",
      onComplete: () => {
        wrapper.style.pointerEvents = "none";
      },
    });
  }, [isGiftNoteOpen]);

  useEffect(() => {
    if (!isMounted) return;

    cartItemRefs.current = cartItemRefs.current.slice(0, cartItems.length);
    mobileNotesRefs.current = mobileNotesRefs.current.slice(0, 2);

    if (cartItems.length === 0) {
      if (emptyStateRef.current) {
        const children = Array.from(emptyStateRef.current.children);
        gsap.fromTo(
          children,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.225, ease: "power2.out" },
        );
      }
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Phase 1: Heading — y:30 → 0, staggered
    const headingEls = [
      headingH1Ref.current,
      headingCountRef.current,
      headingLinkRef.current,
    ].filter(Boolean);

    tl.fromTo(
      headingEls,
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.825, stagger: 0.15 },
    );

    // Phase 2: Left items (from left) + Right column (from right) — simultaneous
    const validItemRefs = cartItemRefs.current.filter(Boolean);

    tl.fromTo(
      validItemRefs,
      { x: () => -window.innerWidth, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.9, stagger: 0.18 },
      "+=0.075",
    );

    const rightEls = [rightSubtotalRef.current, rightNotesRef.current].filter(
      Boolean,
    );
    tl.fromTo(
      rightEls,
      { x: () => window.innerWidth, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.9, stagger: 0.18 },
      "<", // "<" means: start at the same time as left items above
    );

    // Phase 2.5: Mobile notes (from left, staggered)
    const validMobileNotes = mobileNotesRefs.current.filter(Boolean);
    if (validMobileNotes.length > 0) {
      tl.fromTo(
        validMobileNotes,
        { x: () => -window.innerWidth, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.75, stagger: 0.15 },
        "<", // start at same time as right column
      );
    }

    // Phase 3: Checkout buttons — opacity only, no translate
    const checkoutBtns = [
      desktopCheckoutBtnRef.current,
      mobileCheckoutBtnRef.current,
    ].filter(Boolean);

    tl.fromTo(
      checkoutBtns,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.6 },
      "-=0.3",
    );

    // Phase 4: Shipping text — y:10 → 0
    const shippingTexts = [
      desktopShippingTextRef.current,
      mobileShippingTextRef.current,
    ].filter(Boolean);

    tl.fromTo(
      shippingTexts,
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.45 },
      "-=0.15",
    );
  }, [isMounted]);

  const syncCart = (updatedItems) => {
    setCartItems(updatedItems);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
    localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price ?? 0) * Number(item.quantity ?? 0),
    0,
  );
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity ?? 0),
    0,
  );

  const handleRemove = (cartItemId) => {
    const itemIndex = cartItems.findIndex(
      (item) => item.cartItemId === cartItemId,
    );
    if (itemIndex === -1) return;

    const itemElement = cartItemRefs.current[itemIndex];
    if (!itemElement) {
      syncCart(cartItems.filter((item) => item.cartItemId !== cartItemId));
      return;
    }

    // Get positions of all items below the removed item
    const itemsBelow = cartItemRefs.current
      .slice(itemIndex + 1)
      .filter(Boolean);
    const beforePositions = itemsBelow.map(
      (el) => el.getBoundingClientRect().top,
    );

    gsap.to(itemElement, {
      x: -window.innerWidth,
      autoAlpha: 0,
      duration: 1,
      ease: "power2.out",
      onComplete: () => {
        syncCart(cartItems.filter((item) => item.cartItemId !== cartItemId));

        // Animate items moving up after removal
        requestAnimationFrame(() => {
          const afterPositions = itemsBelow.map(
            (el) => el.getBoundingClientRect().top,
          );

          itemsBelow.forEach((el, i) => {
            const delta = beforePositions[i] - afterPositions[i];
            if (delta !== 0) {
              gsap.fromTo(
                el,
                { y: delta },
                { y: 0, duration: 0.6, ease: "power2.out" },
              );
            }
          });
        });
      },
    });
  };

  const handleQuantityChange = async (item, direction) => {
    const requestedQuantity = Number(item.quantity ?? 0) + direction;

    if (requestedQuantity < 0 || loadingItemId === item.cartItemId) {
      return;
    }

    setLoadingItemId(item.cartItemId);

    try {
      const response = await fetch(`/api/products/${item.productId}`);

      if (!response.ok) {
        toast.error("Could not verify stock. Please try again.");
        return;
      }

      const data = await response.json();
      const sizeEntry = data?.product?.sizes?.find(
        (sizeOption) => sizeOption.size === item.size,
      );

      if (!data?.product || !sizeEntry) {
        const correctedItems = cartItems.map((cartItem) =>
          cartItem.cartItemId === item.cartItemId
            ? { ...cartItem, stock: 0, quantity: 0 }
            : cartItem,
        );

        syncCart(correctedItems);
        toast.error("Could not verify stock. Please try again.");
        return;
      }

      const actualStock = Number(sizeEntry.stock ?? 0);

      if (requestedQuantity > actualStock) {
        const correctedItems = cartItems.map((cartItem) =>
          cartItem.cartItemId === item.cartItemId
            ? {
                ...cartItem,
                price: Number(data.product.basePrice ?? cartItem.price),
                originalPrice:
                  data.product.originalPrice != null
                    ? Number(data.product.originalPrice)
                    : null,
                stock: actualStock,
              }
            : cartItem,
        );

        syncCart(correctedItems);
        toast.error(`Only ${actualStock} left in stock for this size.`);
        return;
      }

      const updatedItems = cartItems.map((cartItem) =>
        cartItem.cartItemId === item.cartItemId
          ? {
              ...cartItem,
              quantity: requestedQuantity,
              price: Number(data.product.basePrice ?? cartItem.price),
              originalPrice:
                data.product.originalPrice != null
                  ? Number(data.product.originalPrice)
                  : null,
              stock: actualStock,
              sku: sizeEntry.sku ?? cartItem.sku,
            }
          : cartItem,
      );

      syncCart(updatedItems);
    } catch {
      toast.error("Could not verify stock. Please try again.");
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Could not checkout. Your cart is empty.");
      return;
    }

    setIsCheckingOut(true);
    let shouldResetCheckout = true;

    try {
      const response = await fetch("/api/cart/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cartItems }),
      });

      if (!response.ok) {
        throw new Error("Cart validation failed");
      }

      const data = await response.json();

      if (!data?.valid) {
        toast.error(
          "Some items in your cart are no longer available or have changed. Please review your cart.",
        );

        if (Array.isArray(data?.items)) {
          syncCart(data.items);
        }

        return;
      }

      try {
        if (typeof gtag !== "undefined") {
          gtag("event", "begin_checkout", {
            currency: "PKR",
            value: subtotal,
            items: cartItems.map((item) => ({
              item_id: item.productId,
              item_name: item.productName ?? item.name,
              item_variant: item.size,
              price: item.price,
              quantity: item.quantity,
            })),
          });
        }

        if (typeof fbq !== "undefined") {
          fbq("track", "InitiateCheckout", {
            value: subtotal,
            currency: "PKR",
            num_items: totalQuantity,
          });
        }
      } catch {}

      try {
        sessionStorage.setItem(
          "checkoutNotes",
          JSON.stringify({
            orderNote,
            giftNote,
          }),
        );
      } catch {}

      shouldResetCheckout = false;
      router.push("/checkout");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      if (shouldResetCheckout) {
        setIsCheckingOut(false);
      }
    }
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-black" />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black overflow-y-auto overflow-x-hidden">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 pt-8 pb-28 text-center sm:px-6 lg:px-8 lg:pb-0">
          <div ref={emptyStateRef} className="flex flex-col items-center gap-4">
            <ShoppingCart ref={emptyCartIconRef} size={48} className="text-[#3a3a3a]" />
            <h1 className="font-heading text-2xl text-[#e9e9e9]">
              Your cart is empty
            </h1>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-[#DEFC3E] px-6 py-3 text-sm font-bold uppercase tracking-widest text-black transition-all duration-300 hover:translate-y-[-10px] hover:shadow-[0_25px_50px_-12px_rgba(222,252,62,0.5)] active:scale-90"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-y-auto overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-28 sm:px-6 lg:px-8 lg:pb-0">
        <div className="flex items-baseline justify-between pb-4">
          <div className="flex items-baseline gap-2">
            <div className="overflow-hidden">
              <h1
                ref={headingH1Ref}
                className="font-heading text-5xl text-[#e9e9e9]"
              >
                Cart
              </h1>
            </div>
            <div className="overflow-hidden">
              <span ref={headingCountRef} className="text-xl text-[#e9e9e9]">
                ({totalQuantity} items)
              </span>
            </div>
          </div>
          <div className="overflow-hidden">
            <Link
              ref={headingLinkRef}
              href="/products"
              className="text-sm uppercase tracking-widest text-[#e9e9e9] transition-colors hover:text-[#defc3e]"
            >
              Shop All
            </Link>
          </div>
        </div>

        <div className="border-b-2 border-[#e9e9e9]" />

        <div className="pt-6 lg:grid lg:grid-cols-[1fr_380px] lg:gap-12">
          <div>
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div
                  key={item.cartItemId}
                  ref={(el) => {
                    cartItemRefs.current[index] = el;
                  }}
                >
                  <CartItemRow
                    item={item}
                    loadingItemId={loadingItemId}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-3 lg:hidden">
              <div
                ref={(el) => {
                  mobileNotesRefs.current[0] = el;
                }}
              >
                <NoteAccordion
                  label="Add order notes"
                  value={orderNote}
                  onChange={setOrderNote}
                  isOpen={isOrderNoteOpen}
                  onToggle={() => setIsOrderNoteOpen((current) => !current)}
                  wrapperRef={orderNoteWrapperRefMobile}
                  contentRef={orderNoteContentRefMobile}
                />
              </div>
              <div
                ref={(el) => {
                  mobileNotesRefs.current[1] = el;
                }}
              >
                <NoteAccordion
                  label="Is this a gift? Add a note."
                  value={giftNote}
                  onChange={setGiftNote}
                  isOpen={isGiftNoteOpen}
                  onToggle={() => setIsGiftNoteOpen((current) => !current)}
                  wrapperRef={giftNoteWrapperRefMobile}
                  contentRef={giftNoteContentRefMobile}
                />
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div
              ref={rightSubtotalRef}
              className="mb-4 rounded-[22px] border border-[#3a3a3a] bg-[#1e1e1e] px-4 py-4 transition-colors hover:border-[#DEFC3E]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-[#e9e9e9]">
                  Subtotal
                </span>
                <span className="text-lg font-bold text-[#e9e9e9]">
                  RS.{formatPrice(subtotal)} PKR
                </span>
              </div>
            </div>

            <div ref={rightNotesRef} className="space-y-3">
              <NoteAccordion
                label="Add order notes"
                value={orderNote}
                onChange={setOrderNote}
                isOpen={isOrderNoteOpen}
                onToggle={() => setIsOrderNoteOpen((current) => !current)}
                wrapperRef={orderNoteWrapperRef}
                contentRef={orderNoteContentRef}
              />

              <NoteAccordion
                label="Is this a gift? Add a note."
                value={giftNote}
                onChange={setGiftNote}
                isOpen={isGiftNoteOpen}
                onToggle={() => setIsGiftNoteOpen((current) => !current)}
                wrapperRef={giftNoteWrapperRef}
                contentRef={giftNoteContentRef}
              />
            </div>

            <button
              ref={desktopCheckoutBtnRef}
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-[22px] py-4 text-sm font-bold uppercase tracking-widest text-black transition-all duration-300 active:scale-90 ${
                isCheckingOut
                  ? "cursor-not-allowed bg-[#DEFC3E] opacity-60"
                  : "bg-[#DEFC3E] hover:translate-y-[-10px] hover:shadow-[0_25px_50px_-12px_rgba(222,252,62,0.5)]"
              }`}
            >
              {isCheckingOut ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span>Processing</span>
                </>
              ) : (
                <span>CHECKOUT &bull; RS. {formatPrice(subtotal)}</span>
              )}
            </button>

            <div className="overflow-hidden">
              <p
                ref={desktopShippingTextRef}
                className="mt-2 text-center text-xs text-[#6b6b6b]"
              >
                Shipping & taxes calculated at checkout
              </p>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-[#3a3a3a] bg-black px-4 py-4 lg:hidden">
        <button
          ref={mobileCheckoutBtnRef}
          type="button"
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className={`flex w-full items-center justify-center gap-2 rounded-[22px] py-4 font-bold uppercase tracking-widest text-black transition-all duration-300 active:scale-90 ${
            isCheckingOut
              ? "cursor-not-allowed bg-[#DEFC3E] opacity-60"
              : "bg-[#DEFC3E] hover:translate-y-[-10px] hover:shadow-[0_25px_50px_-12px_rgba(222,252,62,0.5)]"
          }`}
        >
          {isCheckingOut ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              <span>Processing</span>
            </>
          ) : (
            <span>CHECKOUT &bull; RS. {formatPrice(subtotal)}</span>
          )}
        </button>
        <div className="overflow-hidden">
          <p
            ref={mobileShippingTextRef}
            className="mt-2 text-center text-xs text-[#6b6b6b]"
          >
            Shipping & taxes calculated at checkout
          </p>
        </div>
      </div>
    </div>
  );
}
