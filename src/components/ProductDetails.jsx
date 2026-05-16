"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from "sonner";
import PriceDisplay from "@/components/PriceDisplay";
import { useCartStore } from "@/store/cartStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SIZE_PRIORITY = ["XS", "S", "M", "L", "XL", "XXL"];

function getSizeStock(sizeEntry) {
  const stock = Number(sizeEntry?.stock);
  return Number.isFinite(stock) ? stock : 0;
}

function getInitialSelectedSize(sizes) {
  for (const size of SIZE_PRIORITY) {
    const sizeEntry = (sizes ?? []).find((entry) => entry?.size === size);

    if (getSizeStock(sizeEntry) > 0) {
      return size;
    }
  }

  return null;
}

export default function ProductDetails({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [activeImage, setActiveImage] = useState(0);
  const [liveProduct, setLiveProduct] = useState(product);
  const [selectedSize, setSelectedSize] = useState(() =>
    getInitialSelectedSize(product?.sizes ?? []),
  );
  const [quantity, setQuantity] = useState(1);
  const [isQuantityLoading, setIsQuantityLoading] = useState(false);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [isReturnsOpen, setIsReturnsOpen] = useState(false);
  const shippingContentRef = useRef(null);
  const returnsContentRef = useRef(null);
  const imageGalleryRef = useRef(null);
  const productInfoRef = useRef(null);

  const currentProduct = liveProduct ?? product;
  const sortedImages = [...(currentProduct?.images ?? [])].sort(
    (firstImage, secondImage) =>
      Number(firstImage?.order ?? 0) - Number(secondImage?.order ?? 0),
  );
  const sizes = currentProduct?.sizes ?? [];
  const isOutOfStock = sizes.every(
    (sizeEntry) => getSizeStock(sizeEntry) === 0,
  );
  const categoryName =
    typeof currentProduct?.category === "object" ? (currentProduct.category?.name ?? "") : "";
  const categorySlug =
    typeof currentProduct?.category === "object"
      ? String(currentProduct.category?.slug ?? "")
      : "";
  const displayedImage = sortedImages[activeImage] ?? sortedImages[0] ?? null;
  const selectedSizeEntry =
    sizes.find((sizeEntry) => sizeEntry.size === selectedSize) ?? null;

  useGSAP(
    () => {
      if (!shippingContentRef.current) return;

      if (isShippingOpen) {
        gsap.fromTo(
          shippingContentRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      } else {
        gsap.to(shippingContentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        });
      }
    },
    { dependencies: [isShippingOpen] }
  );

  useGSAP(
    () => {
      if (!returnsContentRef.current) return;

      if (isReturnsOpen) {
        gsap.fromTo(
          returnsContentRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      } else {
        gsap.to(returnsContentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        });
      }
    },
    { dependencies: [isReturnsOpen] }
  );

  useGSAP(() => {
    const imageElements = imageGalleryRef.current?.children;
    const infoElements = productInfoRef.current?.children;
    const sharedEntryFrom = { opacity: 0, y: 20 };
    const sharedEntryTo = {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: "power2.out",
    };

    if (imageElements) {
      gsap.fromTo(
        Array.from(imageElements),
        sharedEntryFrom,
        {
          ...sharedEntryTo,
          scrollTrigger: {
            trigger: imageGalleryRef.current,
            start: "top 80%",
          },
        },
      );
    }

    if (infoElements) {
      gsap.fromTo(
        Array.from(infoElements),
        sharedEntryFrom,
        {
          ...sharedEntryTo,
          scrollTrigger: {
            trigger: productInfoRef.current,
            start: "top 80%",
          },
        },
      );
    }
  });

  const handleQuantityChange = async (direction) => {
    if (!currentProduct?._id || !selectedSize || isQuantityLoading) {
      return;
    }

    const requestedQuantity = quantity + direction;

    if (requestedQuantity < 1) {
      return;
    }

    setIsQuantityLoading(true);

    try {
      const response = await fetch(`/api/products/${currentProduct._id}`, {
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

      if (!verifiedSizeEntry || getSizeStock(verifiedSizeEntry) === 0) {
        const fallbackSize = getInitialSelectedSize(verifiedProduct.sizes ?? []);

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

  const handleAddToCart = () => {
    if (!selectedSize || isOutOfStock) {
      return;
    }

    addToCart({
      productId: currentProduct._id,
      slug: currentProduct.slug,
      sku: selectedSizeEntry?.sku ?? currentProduct.sku ?? "",
      name: currentProduct.name,
      image: sortedImages[0]?.url ?? "",
      color: currentProduct.color,
      colorHex: currentProduct.colorHex,
      size: selectedSize,
      quantity,
      price: currentProduct.basePrice,
      originalPrice: currentProduct.originalPrice,
      stock: getSizeStock(selectedSizeEntry),
    });
    toast.success("Item added to cart.");
  };

  return (
    <div className="min-h-screen bg-[#000000] px-4 pt-8 pb-8 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div ref={imageGalleryRef} className="flex flex-row gap-3">
          <div className="w-18 shrink-0">
            <div className="flex flex-col gap-2">
              {sortedImages.map((image, index) => {
                const isActive = index === activeImage;

                return (
                  <button
                    key={`${image.url}-${image.order}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-3/4 w-full cursor-pointer overflow-hidden rounded-[10px] border ${
                      isActive ? "border-[#defc3e]" : "border-[#3a3a3a]"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${currentProduct.name} thumbnail ${index + 1}`}
                      fill
                      unoptimized
                      sizes="72px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative aspect-3/4 flex-1 overflow-hidden rounded-[20px]">
            {displayedImage?.url ? (
              <Image
                src={displayedImage.url}
                alt={currentProduct.name ?? "Product image"}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover ${isOutOfStock ? "grayscale" : ""}`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#282828] text-[10px] uppercase tracking-[3px] text-[#6b6b6b]">
                No Image
              </div>
            )}
          </div>
        </div>

        <div ref={productInfoRef} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-[2px] text-[#6b6b6b]">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link
              href={categorySlug ? `/products/${categorySlug}` : "/products"}
            >
              {categoryName || "Products"}
            </Link>
            <span>/</span>
            <span>{currentProduct.name}</span>
          </div>

          <h1 className="font-heading text-[42px] uppercase leading-none tracking-[1px] text-[#e9e9e9]">
            {currentProduct.name}
          </h1>

          <PriceDisplay
            price={currentProduct.basePrice}
            originalPrice={currentProduct.originalPrice}
            size="lg"
          />

          <p
            className={`text-[11px] font-semibold uppercase tracking-[2px] ${
              isOutOfStock ? "text-red-400" : "text-[#defc3e]"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </p>

          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full border border-[#3a3a3a]"
              style={{ backgroundColor: currentProduct.colorHex }}
            />
            <span className="text-[11px] uppercase tracking-[2px] text-[#6b6b6b]">
              {currentProduct.color}
            </span>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[3px] text-[#6b6b6b]">
                Select Size
              </p>

              <button
                type="button"
                className="cursor-pointer text-[10px] uppercase tracking-[2px] text-[#defc3e] underline"
              >
                Size Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {sizes.map((sizeEntry) => {
                const stock = getSizeStock(sizeEntry);
                const isSelected = selectedSize === sizeEntry.size;
                const isAvailable = stock > 0;

                let className =
                  "rounded-full border px-4 py-2 text-[12px] font-bold uppercase transition-colors";

                if (!isAvailable) {
                  className +=
                    " cursor-not-allowed border-[#3a3a3a] bg-transparent text-[#3a3a3a] line-through";
                } else if (isSelected) {
                  className += " cursor-pointer border-[#defc3e] bg-[#defc3e] text-black";
                } else {
                  className +=
                    " cursor-pointer border-[#3a3a3a] bg-transparent text-[#e9e9e9] hover:border-[#defc3e]";
                }

                return (
                  <button
                    key={sizeEntry.size}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => {
                      setSelectedSize(sizeEntry.size);
                      setQuantity(1);
                    }}
                    className={className}
                  >
                    {sizeEntry.size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-[10px] uppercase tracking-[3px] text-[#6b6b6b]">
              Quantity
            </p>

            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1 || isQuantityLoading || !selectedSize}
              onClick={() => handleQuantityChange(-1)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#282828] transition-colors ${
                quantity <= 1 || isQuantityLoading || !selectedSize
                  ? "cursor-not-allowed opacity-40"
                  : "cursor-pointer hover:border-[#defc3e]"
              }`}
            >
              <span aria-hidden="true" className="text-[#e9e9e9]">
                -
              </span>
            </button>

            <span className="w-8 text-center text-[16px] font-semibold text-[#e9e9e9]">
              {quantity}
            </span>

            <button
              type="button"
              aria-label="Increase quantity"
              disabled={isQuantityLoading || !selectedSize}
              onClick={() => handleQuantityChange(1)}
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#282828] transition-colors ${
                isQuantityLoading || !selectedSize
                  ? "cursor-not-allowed opacity-40"
                  : "cursor-pointer hover:border-[#defc3e]"
              }`}
            >
              <span aria-hidden="true" className="text-[#e9e9e9]">
                +
              </span>
            </button>
          </div>

          <button
            type="button"
            disabled={selectedSize === null || isOutOfStock || isQuantityLoading}
            onClick={handleAddToCart}
            className={`w-full rounded-full py-4 text-[13px] font-bold uppercase tracking-[3px] transition-all duration-300 active:scale-90 ${
              selectedSize === null || isOutOfStock || isQuantityLoading
                ? "cursor-not-allowed bg-[#defc3e] text-black opacity-40"
                : "cursor-pointer bg-[#defc3e] text-black hover:translate-y-[-10px] hover:shadow-[0_25px_50px_-12px_rgba(222,252,62,0.5)]"
            }`}
          >
            Add to Cart
          </button>

          {currentProduct.description ? (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[3px] text-[#6b6b6b]">
                Product Description
              </p>
              <p className="text-[13px] leading-relaxed text-[#9a9a9a]">
                {currentProduct.description}
              </p>
            </div>
          ) : null}

          {Array.isArray(currentProduct.tags) && currentProduct.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentProduct.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#3a3a3a] px-3 py-1 text-[10px] uppercase tracking-[2px] text-[#6b6b6b]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div>
            <div className={`rounded-[22px] border bg-[#1e1e1e] transition-colors ${isShippingOpen ? 'border-[#defc3e]' : 'border-[#3a3a3a] hover:border-[#DEFC3E]'}`}>
              <button
                type="button"
                onClick={() => setIsShippingOpen((isOpen) => !isOpen)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-4"
              >
                <span className="text-sm font-medium text-[#E9E9E9]">
                  Shipping
                </span>
                <span className="text-lg text-[#E9E9E9]">
                  {isShippingOpen ? "−" : "+"}
                </span>
              </button>

              <div
                ref={shippingContentRef}
                style={{ height: 0, opacity: 0, overflow: "hidden" }}
              >
                <div className="px-4 pb-4 text-sm leading-relaxed text-[#aaa]">
                  All orders with available inventory are dispatched within 48
                  hours.
                </div>
              </div>
            </div>

            <div className={`mt-3 rounded-[22px] border bg-[#1e1e1e] transition-colors ${isReturnsOpen ? 'border-[#defc3e]' : 'border-[#3a3a3a] hover:border-[#DEFC3E]'}`}>
              <button
                type="button"
                onClick={() => setIsReturnsOpen((isOpen) => !isOpen)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-4"
              >
                <span className="text-sm font-medium text-[#E9E9E9]">
                  Returns & Exchange
                </span>
                <span className="text-lg text-[#E9E9E9]">
                  {isReturnsOpen ? "−" : "+"}
                </span>
              </button>

              <div
                ref={returnsContentRef}
                style={{ height: 0, opacity: 0, overflow: "hidden" }}
              >
                <div className="px-4 pb-4 text-sm leading-relaxed text-[#aaa]">
                  We provide hassle-free returns if the products are either
                  damaged or tampered with.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
