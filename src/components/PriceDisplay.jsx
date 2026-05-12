const SIZE_VARIANTS = {
  s: {
    currentPriceClassName: "text-[13px]",
    originalPriceClassName: "text-[11px]",
    badgeClassName: "text-[9px]",
  },
  md: {
    currentPriceClassName: "text-[14px] md:text-[16px]",
    originalPriceClassName: "text-[12px] md:text-[13px]",
    badgeClassName: "text-[10px]",
  },
  lg: {
    currentPriceClassName: "text-[22px]",
    originalPriceClassName: "text-[16px]",
    badgeClassName: "text-[11px]",
  },
};

const PRICE_FORMATTER = new Intl.NumberFormat("en-PK");

export function formatPriceValue(amount) {
  const numericAmount = Number(amount);
  const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;

  return `Rs. ${PRICE_FORMATTER.format(safeAmount)}`;
}

export default function PriceDisplay({
  price,
  originalPrice = null,
  size = "s",
  hideBadge = false,
}) {
  const normalizedSize = Object.hasOwn(SIZE_VARIANTS, size) ? size : "s";
  const sizeVariant = SIZE_VARIANTS[normalizedSize];
  const normalizedPrice = Number(price);
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

  return (
    <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
      <span
        className={`${sizeVariant.currentPriceClassName} font-semibold tracking-[0.08em] text-[#defc3e]`}
      >
        {formatPriceValue(normalizedPrice)}
      </span>

      {hasDiscount ? (
        <>
          <span
            className={`${sizeVariant.originalPriceClassName} text-[#b8b8b8] line-through`}
          >
            {formatPriceValue(normalizedOriginalPrice)}
          </span>
          {!hideBadge ? (
            <span
              className={`${sizeVariant.badgeClassName} rounded-sm bg-[#defc3e] px-2 py-1 font-bold text-black`}
            >
              -{discountPercentage}%
            </span>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
