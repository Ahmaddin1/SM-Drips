function getSafeInteger(value, fallback = 0) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(0, Math.floor(parsed));
}

function getSafePrice(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  return typeof image === "string" ? image : image.url ?? "";
}

export function serializeProductForCart(product) {
  if (!product) {
    return null;
  }

  return {
    _id: String(product._id),
    name: product.name ?? "",
    slug: product.slug ?? "",
    basePrice: getSafePrice(product.basePrice),
    ...(product.originalPrice != null
      ? { originalPrice: getSafePrice(product.originalPrice) }
      : {}),
    color: product.color ?? "",
    colorHex: product.colorHex ?? "",
    images: Array.isArray(product.images)
      ? product.images.map((image) => ({
          url: getImageUrl(image),
          order: getSafeInteger(image?.order),
        }))
      : [],
    sizes: Array.isArray(product.sizes)
      ? product.sizes.map((sizeEntry) => ({
          size: sizeEntry?.size ?? "",
          stock: getSafeInteger(sizeEntry?.stock),
          sku: sizeEntry?.sku ?? "",
        }))
      : [],
    isActive: product.isActive !== false,
  };
}

export function validateCartItem(item, product) {
  const safeProduct = serializeProductForCart(product);
  const size = item?.size ?? "";
  const requestedQuantity = getSafeInteger(item?.quantity, 1);
  const sizeEntry = safeProduct?.sizes?.find((entry) => entry.size === size) ?? null;
  const stock = getSafeInteger(sizeEntry?.stock);
  const quantity = stock > 0 ? Math.min(Math.max(1, requestedQuantity), stock) : 0;
  const basePrice = safeProduct ? getSafePrice(safeProduct.basePrice) : getSafePrice(item?.price);
  const originalPrice =
    safeProduct?.originalPrice != null
      ? getSafePrice(safeProduct.originalPrice)
      : item?.originalPrice;

  const correctedItem = {
    ...item,
    cartItemId:
      item?.cartItemId ??
      (item?.productId && size ? `${String(item.productId)}:${size}` : null),
    productId: item?.productId ? String(item.productId) : "",
    productName: item?.productName ?? item?.name ?? safeProduct?.name ?? "",
    name: item?.name ?? item?.productName ?? safeProduct?.name ?? "",
    slug: safeProduct?.slug ?? item?.slug ?? "",
    image: getImageUrl(item?.image) || getImageUrl(safeProduct?.images?.[0]),
    color: safeProduct?.color ?? item?.color ?? "",
    colorHex: safeProduct?.colorHex ?? item?.colorHex ?? "",
    size,
    quantity,
    price: basePrice,
    originalPrice: originalPrice ?? null,
    sku: sizeEntry?.sku ?? item?.sku ?? "",
    stock,
  };

  const isMissingProduct = !safeProduct || safeProduct.isActive === false;
  const isMissingSize = !sizeEntry;
  const isPriceMismatch = getSafePrice(item?.price) !== basePrice;
  const currentOriginalPrice =
    item?.originalPrice != null ? getSafePrice(item.originalPrice) : null;
  const nextOriginalPrice = originalPrice != null ? getSafePrice(originalPrice) : null;
  const isOriginalPriceMismatch = currentOriginalPrice !== nextOriginalPrice;
  const isQuantityMismatch = requestedQuantity !== quantity;
  const isSkuMismatch = (item?.sku ?? "") !== (sizeEntry?.sku ?? "");

  return {
    isValid:
      !isMissingProduct &&
      !isMissingSize &&
      !isSkuMismatch &&
      !isPriceMismatch &&
      !isOriginalPriceMismatch &&
      !isQuantityMismatch,
    item: correctedItem,
  };
}
