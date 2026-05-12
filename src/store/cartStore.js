import { create } from "zustand";

import {
  addToCart as addToCartUtil,
  clearCart as clearCartUtil,
  getCart as getCartFromStorage,
  removeFromCart as removeFromCartUtil,
  updateQuantity as updateQuantityUtil,
} from "@/lib/cart";

function emitCartUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event("cartUpdated"));
}

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  return typeof image === "string" ? image : (image.url ?? "");
}

function getSizeStock(sizeEntry) {
  const stock = Number(sizeEntry?.stock);

  if (Number.isFinite(stock) && stock > 0) {
    return stock;
  }

  if (sizeEntry?.inStock) {
    return Number.MAX_SAFE_INTEGER;
  }

  return 0;
}

function normalizeCartItem(item, modalProduct) {
  if (!item) {
    return null;
  }

  const productId = item.productId ?? modalProduct?._id ?? null;
  const size = item.size ?? null;
  const sizeEntry = modalProduct?.sizes?.find((entry) => entry.size === size);
  const image =
    getImageUrl(item.image) || getImageUrl(modalProduct?.images?.[0]);

  return {
    ...item,
    cartItemId:
      item.cartItemId ??
      (productId && size ? `${String(productId)}:${size}` : null),
    productId,
    productName: item.productName ?? item.name ?? modalProduct?.name ?? "",
    name: item.name ?? item.productName ?? modalProduct?.name ?? "",
    slug: item.slug ?? modalProduct?.slug ?? "",
    image,
    color: item.color ?? modalProduct?.color ?? "",
    colorHex: item.colorHex ?? modalProduct?.colorHex ?? "",
    size,
    quantity: Math.max(1, Number(item.quantity) || 1),
    price: item.price ?? modalProduct?.basePrice ?? 0,
    originalPrice: item.originalPrice ?? modalProduct?.originalPrice,
    sku: item.sku ?? sizeEntry?.sku ?? modalProduct?.sku ?? "",
    stock: item.stock ?? getSizeStock(sizeEntry),
  };
}

export const useCartStore = create((set, get) => ({
  cart: [],
  _hasHydrated: false,
  stockCapped: false,
  isCartModalOpen: false,
  modalProduct: null,

  initializeCart: () => {
    const cart = getCartFromStorage();

    set({
      cart,
      _hasHydrated: true,
    });
  },

  addToCart: (item) => {
    const normalizedItem = normalizeCartItem(item, get().modalProduct);

    if (!normalizedItem?.cartItemId || normalizedItem.stock < 1) {
      return;
    }

    const { cart, capped } = addToCartUtil(normalizedItem);

    set({
      cart,
      stockCapped: capped,
    });

    emitCartUpdated();
  },

  openCartModal: (product) => {
    set({
      isCartModalOpen: Boolean(product),
      modalProduct: product ?? null,
    });
  },

  closeCartModal: () => {
    set({
      isCartModalOpen: false,
      modalProduct: null,
    });
  },

  removeFromCart: (cartItemId) => {
    const cart = removeFromCartUtil(cartItemId);
    set({ cart });
    emitCartUpdated();
  },

  updateQuantity: (cartItemId, newQuantity) => {
    const cart = updateQuantityUtil(cartItemId, newQuantity);
    set({ cart });
    emitCartUpdated();
  },

  clearCart: () => {
    const cart = clearCartUtil();
    set({ cart });
    emitCartUpdated();
  },

  resetStockCapped: () => {
    set({ stockCapped: false });
  },

  getCartCount: () => {
    const { cart } = get();

    if (cart.length === 0) {
      return 0;
    }

    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  getCartTotal: () => {
    const { cart } = get();

    if (cart.length === 0) {
      return 0;
    }

    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getCartItem: (cartItemId) => {
    const { cart } = get();

    return cart.find((item) => item.cartItemId === cartItemId) ?? null;
  },
}));
