"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import PriceDisplay from "@/components/PriceDisplay";
import { useCartStore } from "@/store/cartStore";

gsap.registerPlugin(useGSAP);

const SIZE_PRIORITY = ["S", "M", "L", "XL", "XXL"];

function getImageSrc(image) {
  if (!image) {
    return "";
  }

  return typeof image === "string" ? image : image.url ?? "";
}

function isSizeAvailable(sizeEntry) {
  if (!sizeEntry) {
    return false;
  }

  if (typeof sizeEntry.inStock === "boolean") {
    return sizeEntry.inStock;
  }

  return getSizeStock(sizeEntry) > 0;
}

function getSizeStock(sizeEntry) {
  const stock = Number(sizeEntry?.stock);
  return Number.isFinite(stock) && stock > 0 ? Math.floor(stock) : 0;
}

function getPreferredSize(sizes) {
  const availableSizeMap = new Map((sizes ?? []).map((entry) => [entry.size, entry]));
  const prioritizedSize = SIZE_PRIORITY.find((size) =>
    isSizeAvailable(availableSizeMap.get(size)),
  );
  const fallbackSize = (sizes ?? []).find(isSizeAvailable)?.size ?? null;

  return prioritizedSize ?? fallbackSize;
}

export default function CartModal() {
  const isCartModalOpen = useCartStore((state) => state.isCartModalOpen);
  const storeProduct = useCartStore((state) => state.modalProduct);
  const closeCartModal = useCartStore((state) => state.closeCartModal);
  const addToCart = useCartStore((state) => state.addToCart);

  const [liveProduct, setLiveProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isQuantityLoading, setIsQuantityLoading] = useState(false);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const isClosingRef = useRef(false);
  const modalProduct = liveProduct ?? storeProduct;
  const selectedSizeEntry =
    modalProduct?.sizes?.find((entry) => entry.size === selectedSize) ?? null;
  const isSelectedSizeAvailable = isSizeAvailable(selectedSizeEntry);

  const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
  const quantityAdjustedBasePrice =
    Number(modalProduct?.basePrice ?? 0) * safeQuantity;
  const quantityAdjustedOriginalPrice = Number.isFinite(
    Number(modalProduct?.originalPrice),
  )
    ? Number(modalProduct.originalPrice) * safeQuantity
    : null;

  useEffect(() => {
    if (!storeProduct) {
      setLiveProduct(null);
      setSelectedSize(null);
      setQuantity(1);
      setIsQuantityLoading(false);
      return;
    }

    setLiveProduct(storeProduct);
    setSelectedSize(getPreferredSize(storeProduct.sizes ?? []));
    setQuantity(1);
    setIsQuantityLoading(false);
  }, [storeProduct]);

  useGSAP(
    () => {
      if (!isCartModalOpen || !overlayRef.current || !modalRef.current) {
        return;
      }

      isClosingRef.current = false;

      // Dispatch event to stop Lenis scrolling
      window.dispatchEvent(
        new CustomEvent("cartModalChange", { detail: { isOpen: true } })
      );

      gsap.killTweensOf([overlayRef.current, modalRef.current]);
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(modalRef.current, { y: "100%", opacity: 0 });

      const openTimeline = gsap.timeline();

      openTimeline
        .to(overlayRef.current, { opacity: 1, duration: 0.3 }, 0)
        .to(
          modalRef.current,
          { y: "0%", opacity: 1, duration: 0.45, ease: "power3.out" },
          0,
        );

      return () => {
        openTimeline.kill();
      };
    },
    { dependencies: [isCartModalOpen, storeProduct] },
  );

  const handleQuantityChange = async (direction) => {
    if (!modalProduct?._id || !selectedSize || isQuantityLoading) {
      return;
    }

    const requestedQuantity = safeQuantity + direction;

    if (requestedQuantity < 1) {
      return;
    }

    setIsQuantityLoading(true);

    try {
      const response = await fetch(`/api/products/${modalProduct._id}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        toast.error("Could not verify stock. Please try again.");
        return;
      }

      const data = await response.json();
      const verifiedProduct = data?.product ?? null;

      if (!verifiedProduct) {
        toast.error("Could not verify stock. Please try again.");
        return;
      }

      setLiveProduct(verifiedProduct);

      const verifiedSizeEntry =
        verifiedProduct.sizes?.find((entry) => entry.size === selectedSize) ?? null;

      if (!isSizeAvailable(verifiedSizeEntry)) {
        const fallbackSize = getPreferredSize(verifiedProduct.sizes ?? []);

        setSelectedSize(fallbackSize);
        setQuantity(1);

        toast.error(
          fallbackSize
            ? "Selected size is no longer available. Please review your selection."
            : "This product is currently out of stock.",
        );
        return;
      }

      const actualStock = getSizeStock(verifiedSizeEntry);
      const nextQuantity = Math.min(requestedQuantity, actualStock);

      setQuantity(nextQuantity);

      if (requestedQuantity > actualStock) {
        toast.error(`Only ${actualStock} left in stock for this size.`);
      }
    } catch {
      toast.error("Could not verify stock. Please try again.");
    } finally {
      setIsQuantityLoading(false);
    }
  };

  const handleClose = () => {
    if (
      isClosingRef.current ||
      !overlayRef.current ||
      !modalRef.current
    ) {
      return;
    }

    isClosingRef.current = true;

    gsap.killTweensOf([overlayRef.current, modalRef.current]);

    const closeTimeline = gsap.timeline({
      onComplete: () => {
        isClosingRef.current = false;
        closeCartModal();
        // Dispatch event to restart Lenis scrolling
        window.dispatchEvent(
          new CustomEvent("cartModalChange", { detail: { isOpen: false } })
        );
      },
    });

    closeTimeline
      .to(
        modalRef.current,
        { y: "100%", opacity: 0, duration: 0.35, ease: "power3.in" },
        0,
      )
      .to(overlayRef.current, { opacity: 0, duration: 0.3 }, 0);
  };

  const handleAddToCart = () => {
    if (!modalProduct || !selectedSize || !isSelectedSizeAvailable) {
      return;
    }

    addToCart({
      productId: modalProduct._id,
      slug: modalProduct.slug,
      name: modalProduct.name,
      image: modalProduct.images?.[0],
      color: modalProduct.color,
      colorHex: modalProduct.colorHex,
      size: selectedSize,
      quantity: safeQuantity,
      price: modalProduct.basePrice,
      originalPrice: modalProduct.originalPrice,
      sku: selectedSizeEntry?.sku ?? modalProduct.sku ?? "",
      stock: getSizeStock(selectedSizeEntry),
    });

    toast.success("Item added to cart");
    handleClose();
  };

  if (!isCartModalOpen || !modalProduct) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      style={{ opacity: 0 }}
    >
      <div
        ref={modalRef}
        onClick={(event) => event.stopPropagation()}
        data-lenis-prevent
        className="modal-scroll z-50 max-h-[90vh] w-[90vw] max-w-[420px] overflow-y-auto rounded-3xl border border-[#3a3a3a] bg-[#282828] p-5"
        style={{ opacity: 0 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-[22px] uppercase tracking-[1px] text-[#e9e9e9]">
            {modalProduct.name}
          </h2>

          <button
            type="button"
            aria-label="Close cart modal"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3a3a3a]"
          >
            <X size={14} color="#e9e9e9" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden rounded-[16px]">
          {getImageSrc(modalProduct.images?.[0]) ? (
            <Image
              src={getImageSrc(modalProduct.images?.[0])}
              alt={modalProduct.name ?? "Product image"}
              fill
              unoptimized
              sizes="(max-width: 768px) 90vw, 420px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#1f1f1f] text-[10px] uppercase tracking-[3px] text-[#6b6b6b]">
              No Image
            </div>
          )}
        </div>

        <div className="mb-4">
          <PriceDisplay
            price={quantityAdjustedBasePrice}
            originalPrice={quantityAdjustedOriginalPrice}
            size="md"
          />
        </div>

        <div className="mb-4">
          <p className="mb-2 text-[9px] uppercase tracking-[3px] text-[#6b6b6b]">
            Select Size
          </p>

          <div className="flex flex-wrap gap-2">
            {(modalProduct.sizes ?? []).map((sizeEntry) => {
              const available = isSizeAvailable(sizeEntry);
              const isSelected = selectedSize === sizeEntry.size;

              let pillClassName =
                "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase transition-colors";

              if (!available) {
                pillClassName +=
                  " cursor-not-allowed border-[#3a3a3a] bg-transparent text-[#3a3a3a] line-through";
              } else if (isSelected) {
                pillClassName +=
                  " cursor-pointer border-[#defc3e] bg-[#defc3e] text-black";
              } else {
                pillClassName +=
                  " cursor-pointer border-[#3a3a3a] bg-transparent text-[#e9e9e9] hover:border-[#defc3e]";
              }

              return (
                <button
                  key={sizeEntry.size}
                  type="button"
                  disabled={!available}
                  onClick={() => setSelectedSize(sizeEntry.size)}
                  className={pillClassName}
                >
                  {sizeEntry.size}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <p className="text-[9px] uppercase tracking-[3px] text-[#6b6b6b]">
            Quantity
          </p>

          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={safeQuantity <= 1 || isQuantityLoading || !selectedSize}
            onClick={() => handleQuantityChange(-1)}
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#3a3a3a] text-[#e9e9e9] transition-colors ${
              safeQuantity <= 1 || isQuantityLoading || !selectedSize
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer hover:bg-[#defc3e] hover:text-black"
            }`}
          >
            <Minus
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>

            <span className="w-6 text-center text-[15px] font-semibold text-[#e9e9e9]">
              {safeQuantity}
            </span>

          <button
            type="button"
            aria-label="Increase quantity"
            disabled={isQuantityLoading || !selectedSize || !isSelectedSizeAvailable}
            onClick={() => handleQuantityChange(1)}
            className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#3a3a3a] text-[#e9e9e9] transition-colors ${
              isQuantityLoading || !selectedSize || !isSelectedSizeAvailable
                ? "cursor-not-allowed opacity-40"
                : "cursor-pointer hover:bg-[#defc3e] hover:text-black"
            }`}
          >
            <Plus size={14} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          disabled={!selectedSize || !isSelectedSizeAvailable || isQuantityLoading}
          onClick={handleAddToCart}
          className={`w-full rounded-full py-3 text-[12px] font-bold uppercase tracking-[2px] ${
            selectedSize && isSelectedSizeAvailable && !isQuantityLoading
              ? "cursor-pointer bg-[#defc3e] text-black"
              : "cursor-not-allowed bg-[#defc3e] text-black opacity-40"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
