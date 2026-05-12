"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ChevronDown,
  ChevronRight,
  Info,
  LoaderCircle,
  Minus,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// export const metadata = {
//   title: "Checkout",
//   description: "Complete your SM Drips order securely.",
//   robots: {
//     index: false,
//     follow: false,
//   },
// };

const CART_STORAGE_KEY = "cart";
const LEGACY_CART_STORAGE_KEY = "smDrips_cart";

const COUNTRIES = ["Pakistan"];
const PROVINCES = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "AJK",
  "Gilgit Baltistan",
];

const BASE_INPUT_CLASS =
  "w-full rounded-sm border bg-[#282828] px-4 py-3 text-[14px] text-[#e9e9e9] outline-none transition-colors placeholder:text-[#6b6b6b] focus:border-[#DEFC3E] scroll-mt-24";
const LABEL_CLASS =
  "mb-1 block text-[10px] uppercase tracking-[2px] text-[#6b6b6b]";
const SECTION_TITLE_CLASS = "mb-4 text-[16px] font-semibold text-[#e9e9e9]";
const SELECTED_CARD_STYLE = {
  backgroundColor: "rgba(222, 252, 62, 0.12)",
};

function joinClasses(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatPrice(value) {
  return Number(value ?? 0).toLocaleString("en-PK");
}

function getImageSrc(image) {
  if (!image) {
    return "";
  }

  return typeof image === "string" ? image : (image.url ?? "");
}

function buildVariantLabel(item) {
  const parts = [item.size, item.color].filter(Boolean);
  return parts.length > 0 ? parts.join(" / ") : "Standard";
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

function writeStoredCart(cartItems) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
  } catch {}
}

function emitCartUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event("cartUpdated"));
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error = false,
  helperText,
  fieldRef,
  autoComplete,
  min,
  step,
}) {
  return (
    <div>
      <label htmlFor={name} className={LABEL_CLASS}>
        {label}
      </label>
      <input
        ref={fieldRef}
        id={name}
        name={name}
        type={type}
        value={value}
        min={min}
        step={step}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error}
        onChange={(event) => onChange(name, event.target.value)}
        className={joinClasses(
          BASE_INPUT_CLASS,
          error ? "border-red-500" : "border-[#3a3a3a]",
        )}
      />
      {helperText ? (
        <p className="mt-2 text-xs leading-5 text-[#6b6b6b]">{helperText}</p>
      ) : null}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error = false,
  fieldRef,
}) {
  return (
    <div>
      <label htmlFor={name} className={LABEL_CLASS}>
        {label}
      </label>
      <select
        ref={fieldRef}
        id={name}
        name={name}
        value={value}
        aria-invalid={error}
        onChange={(event) => onChange(name, event.target.value)}
        className={joinClasses(
          BASE_INPUT_CLASS,
          error ? "border-red-500" : "border-[#3a3a3a]",
        )}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function OptionCard({
  label,
  description,
  selected,
  onClick,
  rightSlot,
  error = false,
  nonInteractive = false,
  showIndicator = true,
  cardRef,
  children,
}) {
  const classes = joinClasses(
    "w-full rounded-[22px] border px-4 py-4 text-left transition-colors",
    selected
      ? "border-[#DEFC3E]"
      : error
        ? "border-red-500"
        : "border-[#3a3a3a]",
    selected ? "" : "bg-[#1e1e1e]",
    !nonInteractive ? "hover:border-[#5b5b5b]" : "",
  );

  const content = (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {showIndicator ? (
            <span
              className={joinClasses(
                "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                selected
                  ? "border-[#DEFC3E] bg-[#DEFC3E]"
                  : error
                    ? "border-red-500"
                    : "border-[#6b6b6b]",
              )}
            >
              {selected ? (
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
              ) : null}
            </span>
          ) : null}

          <div>
            <p className="text-sm font-medium text-[#e9e9e9]">{label}</p>
            {description ? (
              <p className="mt-1 text-xs leading-5 text-[#6b6b6b]">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>

      {children}
    </div>
  );

  if (nonInteractive) {
    return (
      <div ref={cardRef} className={classes} style={SELECTED_CARD_STYLE}>
        {content}
      </div>
    );
  }

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onClick}
      className={classes}
      style={selected ? SELECTED_CARD_STYLE : undefined}
    >
      {content}
    </button>
  );
}

function TipOptionButton({ label, amountLabel, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={joinClasses(
        "rounded-[20px] border px-3 py-3 text-center transition-colors",
        selected ? "border-[#DEFC3E]" : "border-[#3a3a3a] bg-[#1e1e1e]",
      )}
      style={selected ? SELECTED_CARD_STYLE : undefined}
    >
      <p className="text-sm font-semibold text-[#e9e9e9]">{label}</p>
      <p className="mt-1 text-xs text-[#6b6b6b]">{amountLabel}</p>
    </button>
  );
}

function SummaryItem({ item }) {
  const imageSrc = getImageSrc(item.image);

  return (
    <div className="flex items-start gap-3 rounded-[20px] border border-[#2b2b2b] bg-[#181818] p-3">
      <div className="relative h-18 w-14 shrink-0 overflow-hidden rounded-xl bg-[#282828] sm:h-20 sm:w-16">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={item.productName ?? item.name ?? "Cart item"}
            fill
            sizes="64px"
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[9px] uppercase tracking-[2px] text-[#6b6b6b]">
            No Image
          </div>
        )}

        <span className="absolute top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#DEFC3E] px-1 text-[10px] font-semibold text-black">
          {item.quantity}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[#e9e9e9]">
          {item.productName ?? item.name}
        </p>
        <p className="mt-1 text-xs text-[#6b6b6b]">{buildVariantLabel(item)}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-medium text-[#e9e9e9]">
          Rs {formatPrice(Number(item.price ?? 0) * Number(item.quantity ?? 1))}
        </p>
      </div>
    </div>
  );
}

function DiscountCodeRow({ value, onChange }) {
  return (
    <div className="rounded-[20px] border border-[#2b2b2b] bg-[#181818] p-3">
      <label htmlFor="discountCode" className={LABEL_CLASS}>
        Discount Code
      </label>
      <div className="flex gap-2">
        <input
          id="discountCode"
          name="discountCode"
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Discount code"
          autoComplete="off"
          className="w-full rounded-sm border border-[#3a3a3a] bg-[#282828] px-4 py-3 text-[14px] text-[#e9e9e9] outline-none transition-colors placeholder:text-[#6b6b6b] focus:border-[#DEFC3E]"
        />
        <button
          type="button"
          disabled
          className="rounded-sm border border-[#3a3a3a] bg-[#202020] px-4 py-3 text-[11px] font-semibold uppercase tracking-[2px] text-[#6b6b6b] disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

function SummaryRows({
  subtotal,
  shippingCost,
  tipAmount,
  total,
  totalQuantity,
}) {
  return (
    <div className="space-y-3 border-t border-[#2b2b2b] pt-4">
      <div className="flex items-center justify-between gap-3 text-sm text-[#e9e9e9]">
        <p className="text-[#6b6b6b]">Subtotal · {totalQuantity} items</p>
        <p>Rs {formatPrice(subtotal)}</p>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-[#e9e9e9]">
        <p className="flex items-center gap-1 text-[#6b6b6b]">
          <span>Shipping</span>
          <Info className="h-3.5 w-3.5" />
        </p>
        <p className={shippingCost === 0 ? "text-[#DEFC3E]" : ""}>
          {shippingCost === 0 ? "Free" : `Rs ${formatPrice(shippingCost)}`}
        </p>
      </div>

      {tipAmount > 0 ? (
        <div className="flex items-center justify-between gap-3 text-sm text-[#e9e9e9]">
          <p className="text-[#6b6b6b]">Tip</p>
          <p>Rs {formatPrice(tipAmount)}</p>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-[#2b2b2b] pt-4">
        <p className="text-base font-semibold text-[#e9e9e9]">Total</p>
        <p className="text-lg font-semibold text-[#e9e9e9]">
          PKR Rs {formatPrice(total)}
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const hasInitializedRef = useRef(false);
  const fieldRefs = useRef({});
  const bankDetailsWrapperRef = useRef(null);
  const bankDetailsContentRef = useRef(null);
  const billingAddressWrapperRef = useRef(null);
  const billingAddressContentRef = useRef(null);
  const desktopListRef = useRef(null);
  const sectionRefs = useRef([]);

  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDesktopScrollIndicator, setShowDesktopScrollIndicator] =
    useState(false);
  const cartItems = useCartStore((state) => state.cart);
  const initializeCart = useCartStore((state) => state.initializeCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [billingAddressMode, setBillingAddressMode] = useState("same");
  const [discountCode, setDiscountCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [tipEnabled, setTipEnabled] = useState(true);
  const [selectedTipOption, setSelectedTipOption] = useState("none");
  const [customTipValue, setCustomTipValue] = useState("");
  const [tipConfirmed, setTipConfirmed] = useState(false);
  const [tipConfirmedAmount, setTipConfirmedAmount] = useState(0);
  const [formValues, setFormValues] = useState({
    email: "",
    emailOffers: false,
    country: "Pakistan",
    firstName: "",
    lastName: "",
    streetAddress: "",
    apartment: "",
    city: "",
    postalCode: "",
    province: "Punjab",
    phoneNumber: "",
    saveInfo: false,
  });
  const [billingValues, setBillingValues] = useState({
    country: "Pakistan",
    streetAddress: "",
    apartment: "",
    city: "",
    postalCode: "",
    province: "Punjab",
  });

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price ?? 0) * Number(item.quantity ?? 1),
    0,
  );
  const shippingCost = subtotal > 3000 ? 0 : 200;
  const totalQuantity = cartItems.reduce(
    (total, item) => total + Number(item.quantity ?? 1),
    0,
  );

  let liveTipAmount = 0;

  if (tipEnabled) {
    if (selectedTipOption === "10") {
      liveTipAmount = Math.round(subtotal * 0.1);
    } else if (selectedTipOption === "15") {
      liveTipAmount = Math.round(subtotal * 0.15);
    } else if (selectedTipOption === "20") {
      liveTipAmount = Math.round(subtotal * 0.2);
    } else if (selectedTipOption === "custom") {
      const parsedCustomTip = Number(customTipValue);
      liveTipAmount =
        Number.isFinite(parsedCustomTip) && parsedCustomTip > 0
          ? Math.floor(parsedCustomTip)
          : 0;
    }
  }

  const tipAmount = tipConfirmed ? tipConfirmedAmount : liveTipAmount;
  const total = subtotal + shippingCost + tipAmount;
  const previewItem = cartItems[0] ?? null;

  function setFieldRef(fieldName) {
    return (node) => {
      if (node) {
        fieldRefs.current[fieldName] = node;
      }
    };
  }

  function clearFieldError(fieldName) {
    if (!fieldErrors[fieldName]) {
      return;
    }

    setFieldErrors((current) => ({
      ...current,
      [fieldName]: false,
    }));
  }

  function updateFormValue(name, value) {
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));

    clearFieldError(name);
  }

  function updateFormCheckbox(name, checked) {
    setFormValues((current) => ({
      ...current,
      [name]: checked,
    }));
  }

  function updateBillingValue(name, value) {
    const fieldName = name.replace('billing', '').replace(/^(.)/, (m) => m.toLowerCase());
    setBillingValues((current) => ({
      ...current,
      [fieldName]: value,
    }));
  }

  function selectTipOption(option) {
    setSelectedTipOption(option);

    if (option !== "custom") {
      clearFieldError("customTip");
    }
  }

  function updateCustomTip(nextValue) {
    if (nextValue === "") {
      setCustomTipValue("");

      if (selectedTipOption === "custom") {
        setSelectedTipOption("none");
      }

      return;
    }

    const parsedValue = Number(nextValue);
    const safeValue =
      Number.isFinite(parsedValue) && parsedValue > 0
        ? Math.floor(parsedValue)
        : 0;

    setCustomTipValue(String(safeValue));

    if (safeValue > 0) {
      setSelectedTipOption("custom");
    } else if (selectedTipOption === "custom") {
      setSelectedTipOption("none");
    }
  }

  function adjustCustomTip(amount) {
    const currentValue = Number(customTipValue || 0);
    const nextValue = Math.max(0, currentValue + amount);

    setCustomTipValue(nextValue > 0 ? String(nextValue) : "");
    setSelectedTipOption(nextValue > 0 ? "custom" : "none");
  }

  useEffect(() => {
    if (tipConfirmed) {
      setTipConfirmed(false);
    }
  }, [customTipValue, selectedTipOption, subtotal, tipConfirmed, tipEnabled]);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;

    initializeCart();

    if (cartItems.length === 0) {
      toast.error("Could not checkout. Your cart is empty.");
      router.replace("/cart");
      return;
    }

    setIsReady(true);

    gsap.registerPlugin(ScrollTrigger);

    sectionRefs.current.forEach((section, index) => {
      if (section) {
        gsap.fromTo(
          section,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    const cartValue = cartItems.reduce(
      (totalPrice, item) =>
        totalPrice + Number(item.price ?? 0) * Number(item.quantity ?? 1),
      0,
    );
    const itemCount = cartItems.reduce(
      (count, item) => count + Number(item.quantity ?? 1),
      0,
    );

    try {
      if (typeof gtag === "function") {
        gtag("event", "begin_checkout", {
          currency: "PKR",
          value: cartValue,
          items: cartItems.map((item) => ({
            item_id: item.productId,
            item_name: item.productName ?? item.name,
            item_variant: buildVariantLabel(item),
            price: Number(item.price ?? 0),
            quantity: Number(item.quantity ?? 1),
          })),
        });
      }

      if (typeof fbq === "function") {
        fbq("track", "InitiateCheckout", {
          value: cartValue,
          currency: "PKR",
          num_items: itemCount,
        });
      }
    } catch {}
  }, [router]);

  useEffect(() => {
    const wrapper = bankDetailsWrapperRef.current;
    const content = bankDetailsContentRef.current;

    if (!wrapper || !content) {
      return;
    }

    const isOpen = paymentMethod === "bank_deposit";

    gsap.killTweensOf(wrapper);

    if (isOpen) {
      const nextHeight = content.getBoundingClientRect().height;

      gsap.to(wrapper, {
        height: nextHeight,
        opacity: 1,
        duration: 0.35,
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
      duration: 0.28,
      ease: "power2.inOut",
      onComplete: () => {
        wrapper.style.pointerEvents = "none";
      },
    });
  }, [paymentMethod]);

  useEffect(() => {
    const wrapper = billingAddressWrapperRef.current;
    const content = billingAddressContentRef.current;

    if (!wrapper || !content) {
      return;
    }

    const isOpen = billingAddressMode === "different";

    gsap.killTweensOf(wrapper);

    if (isOpen) {
      const nextHeight = content.getBoundingClientRect().height;

      gsap.to(wrapper, {
        height: nextHeight,
        opacity: 1,
        duration: 0.35,
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
      duration: 0.28,
      ease: "power2.inOut",
      onComplete: () => {
        wrapper.style.pointerEvents = "none";
      },
    });
  }, [billingAddressMode]);

  useEffect(() => {
    const scroller = desktopListRef.current;

    if (!scroller) {
      return;
    }

    const updateScrollIndicator = () => {
      const hasOverflow = scroller.scrollHeight > scroller.clientHeight + 4;
      const hasMoreContent =
        scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 4;

      setShowDesktopScrollIndicator(hasOverflow && hasMoreContent);
    };

    updateScrollIndicator();
    scroller.addEventListener("scroll", updateScrollIndicator);
    window.addEventListener("resize", updateScrollIndicator);

    return () => {
      scroller.removeEventListener("scroll", updateScrollIndicator);
      window.removeEventListener("resize", updateScrollIndicator);
    };
  }, [cartItems]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Could not checkout. Your cart is empty.");
      router.replace("/cart");
      return;
    }

    const nextErrors = {};
    const requiredFields = [
      ["email", formValues.email.trim()],
      ["firstName", formValues.firstName.trim()],
      ["lastName", formValues.lastName.trim()],
      ["streetAddress", formValues.streetAddress.trim()],
      ["city", formValues.city.trim()],
      ["province", formValues.province.trim()],
      ["phoneNumber", formValues.phoneNumber.trim()],
      ["paymentMethod", paymentMethod.trim()],
    ];

    let firstInvalidField = null;

    requiredFields.forEach(([fieldName, fieldValue]) => {
      if (!fieldValue) {
        nextErrors[fieldName] = true;

        if (!firstInvalidField) {
          firstInvalidField = fieldName;
        }
      }
    });

    setFieldErrors(nextErrors);

    if (firstInvalidField) {
      toast.error(
        "Please fill out all required fields before placing your order.",
      );

      const firstField = fieldRefs.current[firstInvalidField];

      if (firstField) {
        firstField.scrollIntoView({ behavior: "smooth", block: "center" });
        firstField.focus?.();
      }

      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: {
          firstName: formValues.firstName.trim(),
          lastName: formValues.lastName.trim(),
          name: `${formValues.firstName.trim()} ${formValues.lastName.trim()}`.trim(),
          email: formValues.email.trim(),
          phone: formValues.phoneNumber.trim(),
          address: {
            street: formValues.streetAddress.trim(),
            city: formValues.city.trim(),
            province: formValues.province.trim(),
            postalCode: formValues.postalCode.trim(),
            country: formValues.country,
          },
        },
        items: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName ?? item.name ?? "",
          sku: item.sku ?? "",
          slug: item.slug ?? "",
          color: item.color ?? "",
          colorHex: item.colorHex ?? "",
          size: item.size ?? "",
          image: getImageSrc(item.image),
          price: Number(item.price ?? 0),
          originalPrice:
            item.originalPrice == null ? undefined : Number(item.originalPrice),
          quantity: Number(item.quantity ?? 1),
        })),
        subtotal,
        shippingCost,
        tip: tipAmount,
        totalAmount: total,
        paymentMethod,
      };

      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        const outOfStockSummary =
          Array.isArray(data?.outOfStockItems) && data.outOfStockItems.length > 0
            ? ` ${data.outOfStockItems
                .map((item) =>
                  [item?.productName, item?.color, item?.size]
                    .filter(Boolean)
                    .join(" / "),
                )
                .join(", ")}`
            : "";

        throw new Error(
          `${data?.message ?? "Order creation failed."}${outOfStockSummary}`.trim(),
        );
      }

      const nextOrderId =
        typeof data?.orderId === "string" && data.orderId.trim()
          ? data.orderId.trim()
          : "";

      writeStoredCart([]);
      emitCartUpdated();
      clearCart();
      router.push(
        nextOrderId
          ? `/thank-you?orderId=${encodeURIComponent(nextOrderId)}`
          : "/thank-you",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
      setIsSubmitting(false);
    }
  }

  if (!isReady) {
    return <div className="min-h-screen bg-[#000000]" />;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#e9e9e9] overflow-y-auto">
      <form onSubmit={handleSubmit} noValidate>
        <div className="mx-auto max-w-7xl px-4 pb-28 md:px-6 md:pb-0">
          <div className="md:grid md:grid-cols-[minmax(0,1.38fr)_minmax(360px,1fr)] md:gap-8">
            <div className="pb-10 pt-4 md:pb-12 md:pt-8">
              <div className="sticky top-0 z-20 -mx-4 border-b border-[#202020] bg-[#000000]/95 px-4 py-3 backdrop-blur md:hidden">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {previewItem ? (
                      <div className="relative h-12 w-10 overflow-hidden rounded-lg bg-[#282828]">
                        {getImageSrc(previewItem.image) ? (
                          <Image
                            src={getImageSrc(previewItem.image)}
                            alt={
                              previewItem.productName ??
                              previewItem.name ??
                              "Cart item"
                            }
                            fill
                            sizes="40px"
                            unoptimized
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                    ) : null}

                    {cartItems.length > 1 ? (
                      <div className="flex items-center gap-1 text-[10px] uppercase tracking-[2px] text-[#6b6b6b]">
                        <span>{cartItems.length - 1} more</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[2px] text-[#6b6b6b]">
                        Total
                      </p>
                      <p className="text-sm font-semibold text-[#e9e9e9]">
                        PKR Rs {formatPrice(total)}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-[#6b6b6b]" />
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 md:pt-0">
                <section ref={(el) => (sectionRefs.current[0] = el)} className="rounded-[30px] border border-[#1f1f1f] bg-[#0f0f0f] p-5 sm:p-6">
                  <h2 className={SECTION_TITLE_CLASS}>Contact</h2>

                  <div className="space-y-4">
                    <InputField
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Email or mobile phone number"
                      value={formValues.email}
                      onChange={updateFormValue}
                      error={fieldErrors.email}
                      fieldRef={setFieldRef("email")}
                      autoComplete="email"
                    />

                    <label className="flex items-center gap-3 text-sm text-[#e9e9e9]">
                      <input
                        type="checkbox"
                        checked={formValues.emailOffers}
                        onChange={(event) =>
                          updateFormCheckbox(
                            "emailOffers",
                            event.target.checked,
                          )
                        }
                        className="h-4 w-4 rounded border border-[#3a3a3a] bg-[#282828] accent-[#DEFC3E]"
                      />
                      <span>Email me with news and offers</span>
                    </label>
                  </div>
                </section>

                <section ref={(el) => (sectionRefs.current[1] = el)} className="rounded-[30px] border border-[#1f1f1f] bg-[#0f0f0f] p-5 sm:p-6">
                  <h2 className={SECTION_TITLE_CLASS}>Delivery</h2>

                  <div className="space-y-4">
                    <SelectField
                      label="Country / Region"
                      name="country"
                      value={formValues.country}
                      onChange={updateFormValue}
                      options={COUNTRIES}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputField
                        label="First Name"
                        name="firstName"
                        value={formValues.firstName}
                        onChange={updateFormValue}
                        error={fieldErrors.firstName}
                        fieldRef={setFieldRef("firstName")}
                        autoComplete="given-name"
                      />
                      <InputField
                        label="Last Name"
                        name="lastName"
                        value={formValues.lastName}
                        onChange={updateFormValue}
                        error={fieldErrors.lastName}
                        fieldRef={setFieldRef("lastName")}
                        autoComplete="family-name"
                      />
                    </div>

                    <InputField
                      label="Street Address"
                      name="streetAddress"
                      value={formValues.streetAddress}
                      onChange={updateFormValue}
                      error={fieldErrors.streetAddress}
                      fieldRef={setFieldRef("streetAddress")}
                      autoComplete="street-address"
                    />

                    <InputField
                      label="Apartment, Suite, Etc."
                      name="apartment"
                      value={formValues.apartment}
                      onChange={updateFormValue}
                      autoComplete="address-line2"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputField
                        label="City"
                        name="city"
                        value={formValues.city}
                        onChange={updateFormValue}
                        error={fieldErrors.city}
                        fieldRef={setFieldRef("city")}
                        autoComplete="address-level2"
                      />
                      <InputField
                        label="Postal Code"
                        name="postalCode"
                        value={formValues.postalCode}
                        onChange={updateFormValue}
                        autoComplete="postal-code"
                      />
                    </div>

                    <SelectField
                      label="Province"
                      name="province"
                      value={formValues.province}
                      onChange={updateFormValue}
                      options={PROVINCES}
                      error={fieldErrors.province}
                      fieldRef={setFieldRef("province")}
                    />

                    <InputField
                      label="Delivery Contact Number"
                      name="phoneNumber"
                      type="tel"
                      value={formValues.phoneNumber}
                      onChange={updateFormValue}
                      error={fieldErrors.phoneNumber}
                      fieldRef={setFieldRef("phoneNumber")}
                      helperText="The courier will use this number for delivery."
                      autoComplete="tel"
                    />

                    <label className="flex items-center gap-3 text-sm text-[#e9e9e9]">
                      <input
                        type="checkbox"
                        checked={formValues.saveInfo}
                        onChange={(event) =>
                          updateFormCheckbox("saveInfo", event.target.checked)
                        }
                        className="h-4 w-4 rounded border border-[#3a3a3a] bg-[#282828] accent-[#DEFC3E]"
                      />
                      <span>Save this information for next time</span>
                    </label>
                  </div>
                </section>

                <section ref={(el) => (sectionRefs.current[2] = el)} className="rounded-[30px] border border-[#1f1f1f] bg-[#0f0f0f] p-5 sm:p-6">
                  <h2 className={SECTION_TITLE_CLASS}>Shipping method</h2>

                  <OptionCard
                    label="Standard Shipping"
                    selected
                    nonInteractive
                    showIndicator={false}
                    rightSlot={
                      <span
                        className={joinClasses(
                          "text-sm font-semibold",
                          shippingCost === 0
                            ? "text-[#DEFC3E]"
                            : "text-[#e9e9e9]",
                        )}
                      >
                        {shippingCost === 0 ? "Free" : "Rs 200"}
                      </span>
                    }
                  />
                </section>

                <section ref={(el) => (sectionRefs.current[3] = el)} className="rounded-[30px] border border-[#1f1f1f] bg-[#0f0f0f] p-5 sm:p-6">
                  <h2 className={SECTION_TITLE_CLASS}>Payment</h2>
                  <p className="mb-4 text-sm text-[#6b6b6b]">
                    All transactions are secure and encrypted.
                  </p>

                  <div ref={setFieldRef("paymentMethod")} className="space-y-3">
                    <OptionCard
                      label="Cash on Delivery (COD)"
                      selected={paymentMethod === "cod"}
                      error={fieldErrors.paymentMethod}
                      onClick={() => {
                        setPaymentMethod("cod");
                        clearFieldError("paymentMethod");
                      }}
                    />

                    <OptionCard
                      label="Bank Deposit"
                      selected={paymentMethod === "bank_deposit"}
                      error={fieldErrors.paymentMethod}
                      onClick={() => {
                        setPaymentMethod("bank_deposit");
                        clearFieldError("paymentMethod");
                      }}
                    />
                  </div>

                  <div
                    ref={bankDetailsWrapperRef}
                    style={{
                      height: 0,
                      opacity: 0,
                      overflow: "hidden",
                      pointerEvents: "none",
                    }}
                  >
                    <div
                      ref={bankDetailsContentRef}
                      className="mt-3 rounded-[22px] border border-[#3a3a3a] bg-[#1e1e1e] p-5"
                    >
                      <div className="space-y-3 text-sm leading-6 text-[#e9e9e9]">
                        <p>
                          <span className="text-[#6b6b6b]">Bank Name:</span>{" "}
                          Meezan Bank LTD
                        </p>
                        <p>
                          <span className="text-[#6b6b6b]">Account No:</span>{" "}
                          01250107720102
                        </p>
                        <p>
                          <span className="text-[#6b6b6b]">IBAN No:</span>{" "}
                          PK68MEZN0001250107720102
                        </p>
                        <p>
                          <span className="text-[#6b6b6b]">Account Title:</span>{" "}
                          SURTEEZ
                        </p>
                        <p className="text-[#6b6b6b]">
                          After completing the transfer, please share a
                          screenshot of the payment along with your ORDER ID at{" "}
                          help@surteez.com or WhatsApp us at 0319-0328248.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section ref={(el) => (sectionRefs.current[4] = el)} className="rounded-[30px] border border-[#1f1f1f] bg-[#0f0f0f] p-5 sm:p-6">
                  <h2 className={SECTION_TITLE_CLASS}>Billing address</h2>

                  <div className="space-y-3">
                    <OptionCard
                      label="Same as shipping address"
                      selected={billingAddressMode === "same"}
                      onClick={() => setBillingAddressMode("same")}
                    />

                    <OptionCard
                      label="Use a different billing address"
                      selected={billingAddressMode === "different"}
                      onClick={() => setBillingAddressMode("different")}
                    />
                  </div>

                  <div
                    ref={billingAddressWrapperRef}
                    style={{
                      height: 0,
                      opacity: 0,
                      overflow: "hidden",
                      pointerEvents: "none",
                    }}
                  >
                    <div
                      ref={billingAddressContentRef}
                      className="mt-4 space-y-4 rounded-[22px] border border-[#2b2b2b] bg-[#181818] p-4"
                    >
                      <SelectField
                        label="Country / Region"
                        name="billingCountry"
                        value={billingValues.country}
                        onChange={updateBillingValue}
                        options={COUNTRIES}
                      />

                      <InputField
                        label="Street Address"
                        name="billingStreetAddress"
                        value={billingValues.streetAddress}
                        onChange={updateBillingValue}
                        autoComplete="billing street-address"
                      />

                      <InputField
                        label="Apartment, Suite, Etc."
                        name="billingApartment"
                        value={billingValues.apartment}
                        onChange={updateBillingValue}
                        autoComplete="billing address-line2"
                      />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <InputField
                          label="City"
                          name="billingCity"
                          value={billingValues.city}
                          onChange={updateBillingValue}
                          autoComplete="billing address-level2"
                        />
                        <InputField
                          label="Postal Code"
                          name="billingPostalCode"
                          value={billingValues.postalCode}
                          onChange={updateBillingValue}
                          autoComplete="billing postal-code"
                        />
                      </div>

                      <SelectField
                        label="Province"
                        name="billingProvince"
                        value={billingValues.province}
                        onChange={updateBillingValue}
                        options={PROVINCES}
                      />
                    </div>
                  </div>
                </section>

                <section ref={(el) => (sectionRefs.current[5] = el)} className="rounded-[30px] border border-[#1f1f1f] bg-[#0f0f0f] p-5 sm:p-6">
                  <h2 className={SECTION_TITLE_CLASS}>Add tip</h2>

                  <div className="rounded-[24px] border border-[#3a3a3a] bg-[#1e1e1e] p-4">
                    <label className="flex items-start gap-3 text-sm text-[#e9e9e9]">
                      <input
                        type="checkbox"
                        checked={tipEnabled}
                        onChange={(event) => {
                          setTipEnabled(event.target.checked);

                          if (!event.target.checked) {
                            setTipConfirmed(false);
                          }
                        }}
                        className="mt-0.5 h-4 w-4 rounded border border-[#3a3a3a] bg-[#282828] accent-[#DEFC3E]"
                      />
                      <span>Show your support for the team at Surteez</span>
                    </label>

                    {tipEnabled ? (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <TipOptionButton
                            label="10%"
                            amountLabel={`Rs ${formatPrice(Math.round(subtotal * 0.1))}`}
                            selected={selectedTipOption === "10"}
                            onClick={() => selectTipOption("10")}
                          />
                          <TipOptionButton
                            label="15%"
                            amountLabel={`Rs ${formatPrice(Math.round(subtotal * 0.15))}`}
                            selected={selectedTipOption === "15"}
                            onClick={() => selectTipOption("15")}
                          />
                          <TipOptionButton
                            label="20%"
                            amountLabel={`Rs ${formatPrice(Math.round(subtotal * 0.2))}`}
                            selected={selectedTipOption === "20"}
                            onClick={() => selectTipOption("20")}
                          />
                          <TipOptionButton
                            label="None"
                            amountLabel="Rs 0"
                            selected={selectedTipOption === "none"}
                            onClick={() => selectTipOption("none")}
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                          <InputField
                            label="Custom tip"
                            name="customTip"
                            type="number"
                            min="0"
                            step="50"
                            value={customTipValue}
                            onChange={(_, value) => updateCustomTip(value)}
                            error={fieldErrors.customTip}
                          />

                          <div className="grid grid-cols-2 gap-3 self-end">
                            <button
                              type="button"
                              onClick={() => adjustCustomTip(-50)}
                              className="flex h-[50px] w-[58px] items-center justify-center rounded-sm border border-[#3a3a3a] bg-[#282828] text-[#e9e9e9] transition-colors hover:border-[#DEFC3E]"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => adjustCustomTip(50)}
                              className="flex h-[50px] w-[58px] items-center justify-center rounded-sm border border-[#3a3a3a] bg-[#282828] text-[#e9e9e9] transition-colors hover:border-[#DEFC3E]"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={liveTipAmount === 0}
                          onClick={() => {
                            setTipConfirmedAmount(liveTipAmount);
                            setTipConfirmed(true);
                          }}
                          className={joinClasses(
                            "w-full rounded-sm px-4 py-3 text-sm font-semibold uppercase tracking-[2px] transition-colors",
                            liveTipAmount === 0
                              ? "cursor-not-allowed bg-[#303030] text-[#6b6b6b]"
                              : "bg-[#DEFC3E] text-black hover:opacity-90",
                          )}
                        >
                          Add tip
                        </button>
                      </div>
                    ) : null}

                    <p className="mt-4 text-sm text-[#6b6b6b]">
                      Thank you, we appreciate it.
                    </p>
                  </div>
                </section>

                <section className="space-y-4 md:hidden">
                  <div className="rounded-[30px] border border-[#252525] bg-[#1e1e1e] p-5">
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <SummaryItem
                          key={
                            item.cartItemId ?? `${item.productId}-${item.size}`
                          }
                          item={item}
                        />
                      ))}
                    </div>

                    <div className="mt-4 space-y-4">
                      <DiscountCodeRow
                        value={discountCode}
                        onChange={setDiscountCode}
                      />
                      <SummaryRows
                        subtotal={subtotal}
                        shippingCost={shippingCost}
                        tipAmount={tipAmount}
                        total={total}
                        totalQuantity={totalQuantity}
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <aside className="hidden md:block md:sticky md:top-8 md:self-start">
              <div className="flex flex-col overflow-hidden rounded-[30px] border border-[#1f1f1f] bg-[#0f0f0f]">
                <div className="border-b border-[#1f1f1f] px-6 py-6">
                  <p className="text-[10px] uppercase tracking-[3px] text-[#6b6b6b]">
                    Order Summary
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-[#e9e9e9]">
                    PKR Rs {formatPrice(total)}
                  </p>
                </div>

                <div className="relative overflow-hidden">
                  <div
                    ref={desktopListRef}
                    className="max-h-[400px] space-y-3 overflow-y-auto px-6 py-6"
                  >
                    {cartItems.map((item) => (
                      <SummaryItem
                        key={
                          item.cartItemId ?? `${item.productId}-${item.size}`
                        }
                        item={item}
                      />
                    ))}
                  </div>

                  {showDesktopScrollIndicator ? (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/95 to-transparent px-4 pt-10 pb-3">
                      <p className="rounded-full border border-[#2b2b2b] bg-[#181818] px-3 py-1 text-[10px] uppercase tracking-[2px] text-[#6b6b6b]">
                        Scroll for more items ↓
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-4 border-t border-[#1f1f1f] px-6 py-6">
                  <DiscountCodeRow
                    value={discountCode}
                    onChange={setDiscountCode}
                  />

                  <SummaryRows
                    subtotal={subtotal}
                    shippingCost={shippingCost}
                    tipAmount={tipAmount}
                    total={total}
                    totalQuantity={totalQuantity}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={joinClasses(
                      "mt-2 flex w-full items-center justify-center gap-2 rounded-[22px] px-4 py-4 text-sm font-semibold uppercase tracking-[2px] transition-all duration-300 active:scale-90",
                      isSubmitting
                        ? "cursor-not-allowed bg-[#DEFC3E] text-black opacity-70"
                        : "bg-[#DEFC3E] text-black hover:translate-y-[-10px] hover:shadow-[0_25px_50px_-12px_rgba(222,252,62,0.5)]",
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        <span>Processing</span>
                      </>
                    ) : (
                      <span>Complete order</span>
                    )}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="fixed right-0 bottom-0 left-0 z-30 border-t border-[#2b2b2b] bg-[#000000]/95 px-4 py-4 backdrop-blur md:hidden">
          <button
            type="submit"
            disabled={isSubmitting}
            className={joinClasses(
              "flex w-full items-center justify-center gap-2 rounded-[22px] px-4 py-4 text-sm font-semibold uppercase tracking-[2px] transition-all duration-300 active:scale-90",
              isSubmitting
                ? "cursor-not-allowed bg-[#DEFC3E] text-black opacity-70"
                : "bg-[#DEFC3E] text-black hover:translate-y-[-10px] hover:shadow-[0_25px_50px_-12px_rgba(222,252,62,0.5)]",
            )}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span>Processing</span>
              </>
            ) : (
              <span>Complete order</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
