"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import PriceDisplay from "@/components/PriceDisplay";
import { useCartStore } from "@/store/cartStore";

const TWO_WEEKS_IN_MS = 14 * 24 * 60 * 60 * 1000;

const ProductCard = forwardRef(function ProductCard({ product }, ref) {
  const router = useRouter();
  const openCartModal = useCartStore(({ openCartModal: modalOpener }) => modalOpener);

  if (!product) {
    return null;
  }

  const {
    name,
    slug,
    category,
    basePrice,
    originalPrice,
    colorHex,
    images,
    createdAt,
    isOutOfStock,
  } = product;

  const primaryImage = Array.isArray(images) ? images[0] : null;
  const imageSrc =
    typeof primaryImage === "string" ? primaryImage : primaryImage?.url;
  const categoryName =
    typeof category === "object" ? category?.name ?? "" : category ?? "";
  const categorySlug = typeof category === "object" ? category?.slug ?? "" : "";
  const normalizedPrice = Number(basePrice);
  const normalizedOriginalPrice = Number(originalPrice);
  const hasDiscount =
    Number.isFinite(normalizedOriginalPrice) &&
    normalizedOriginalPrice > normalizedPrice;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((normalizedOriginalPrice - normalizedPrice) / normalizedOriginalPrice) *
          100,
      )
    : null;

  const handleNavigate = () => {
    if (slug && categorySlug) {
      router.push(`/products/${categorySlug}/${slug}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  const handleCartButtonClick = (event) => {
    event.stopPropagation();
    openCartModal?.(product);
  };

  return (
    <article
      ref={ref}
      role="link"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      className="product-card group cursor-pointer rounded-3xl border border-[#3a3a3a] bg-[#282828] p-2 transition-all duration-300 hover:-translate-y-1 hover:border-[#defc3e]"
    >
      <div className="relative aspect-3/4 overflow-hidden rounded-[16px]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={name ?? "Product image"}
            fill
            unoptimized
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? "grayscale" : ""
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#1f1f1f] text-[10px] uppercase tracking-[3px] text-[#6b6b6b]">
            No Image
          </div>
        )}

        {hasDiscount && !isOutOfStock ? (
          <span className="absolute top-2 left-2 rounded-sm bg-[#defc3e] px-2 py-1 text-[10px] font-bold uppercase tracking-[2px] text-black">
            -{discountPercentage}%
          </span>
        ) : null}

        {isOutOfStock ? (
          <span className="absolute top-2 right-2 rounded-sm border border-[#3a3a3a] bg-[#282828] px-2 py-1 text-[8px] font-bold uppercase tracking-[2px] text-[#e9e9e9]">
            Out of Stock
          </span>
        ) : null}

        {!isOutOfStock ? (
          <>
            <button
              type="button"
              aria-label={`Open cart options for ${name}`}
              onClick={handleCartButtonClick}
              className="absolute right-2 bottom-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#defc3e] md:hidden"
            >
              <ShoppingBag
                className="h-4 w-4 text-black"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>

            <div className="pointer-events-none absolute inset-0 hidden bg-black/40 opacity-0 transition-opacity duration-300 md:block md:group-hover:pointer-events-auto md:group-hover:opacity-100">
              <button
                type="button"
                aria-label={`Open cart options for ${name}`}
                onClick={handleCartButtonClick}
                className="pointer-events-auto absolute right-2 bottom-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#defc3e]"
              >
                <ShoppingBag
                  className="h-4 w-4 text-black"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </button>
            </div>
          </>
        ) : null}
      </div>

      <div className="px-2 pb-2 pt-3">
        <p className="mb-1 text-[9px] md:text-[11px] uppercase tracking-[3px] text-[#6b6b6b]">
          {categoryName}
        </p>

        <h3 className="mb-2 font-heading text-[17px] md:text-[22px] uppercase tracking-[1px] text-[#e9e9e9]">
          {name}
        </h3>

        <div className="flex items-center justify-between">
          <PriceDisplay
            price={basePrice}
            originalPrice={originalPrice}
            size="md"
            hideBadge
          />

          <span
            aria-label={product.color ?? "Product color"}
            title={product.color ?? "Product color"}
            className="h-2.5 w-2.5 rounded-full border border-[#3a3a3a]"
            style={{ backgroundColor: colorHex || "#000000" }}
          />
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
