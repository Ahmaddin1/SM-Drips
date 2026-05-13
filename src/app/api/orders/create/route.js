import { NextResponse } from "next/server";
import mongoose from "mongoose";
import sanitize from "mongo-sanitize";
import dbConnect from "@/lib/db";
import { MAX_TIP, MIN_TIP } from "@/lib/constants";
import Order from "@/models/Order";
import Product from "@/models/Product";

const VALID_PAYMENT_METHODS = new Set(["cod", "bank_deposit"]);
const VALID_SIZES = new Set(["XS", "S", "M", "L", "XL", "XXL"]);
const VALID_SHIPPING_COSTS = new Set([0, 200]);
const COLOR_HEX_PATTERN = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

function badRequest(message, extra = {}) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...extra,
    },
    { status: 400 },
  );
}

function getTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getNonNegativeNumber(value) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
}

function getPositiveInteger(value) {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return null;
  }

  return parsedValue;
}

function clampTip(value) {
  const parsedValue = Number.parseInt(value ?? 0, 10);

  if (Number.isNaN(parsedValue)) {
    return MIN_TIP;
  }

  return Math.max(MIN_TIP, Math.min(parsedValue, MAX_TIP));
}

function generateOrderId() {
  return `SRT-${Date.now().toString().slice(-6)}${Math.floor(
    Math.random() * 1000,
  )
    .toString()
    .padStart(3, "0")}`;
}

function getProductStock(sizeEntry) {
  const stock = Number(sizeEntry?.stock);
  return Number.isFinite(stock) && stock > 0 ? Math.floor(stock) : 0;
}

function getPrimaryImageUrl(images) {
  const primaryImage = Array.isArray(images) ? images[0] : null;

  if (typeof primaryImage === "string") {
    return primaryImage;
  }

  return primaryImage?.url ?? "";
}

function validateCustomer(customer) {
  if (!customer || typeof customer !== "object") {
    return { error: "Customer details are required." };
  }

  const safeFirstName = sanitize(customer.firstName);
  const safeLastName = sanitize(customer.lastName);
  const safeEmail = sanitize(customer.email);
  const safePhone = sanitize(customer.phone);
  const safeAddress = sanitize(customer.address);

  if (
    typeof safeFirstName !== "string" ||
    typeof safeLastName !== "string" ||
    typeof safeEmail !== "string" ||
    typeof safePhone !== "string" ||
    typeof safeAddress !== "object"
  ) {
    return { error: "Invalid input types." };
  }

  const firstName = getTrimmedString(safeFirstName);
  const lastName = getTrimmedString(safeLastName);
  const email = getTrimmedString(safeEmail);
  const phone = getTrimmedString(safePhone);
  const address = safeAddress;

  if (
    firstName.length > 100 ||
    lastName.length > 100 ||
    email.length > 150 ||
    phone.length > 20
  ) {
    return { error: "Input exceeds allowed length." };
  }

  if (!firstName) {
    return { error: "Customer first name is required." };
  }

  if (!lastName) {
    return { error: "Customer last name is required." };
  }

  if (!email) {
    return { error: "Customer email is required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Customer email is invalid." };
  }

  if (!phone) {
    return { error: "Customer phone is required." };
  }

  if (!address || typeof address !== "object") {
    return { error: "Customer address is required." };
  }

  const safeStreet = sanitize(address.street);
  const safeCity = sanitize(address.city);
  const safeProvince = sanitize(address.province);
  const safePostalCode = sanitize(address.postalCode);
  const safeCountry = sanitize(address.country);

  if (
    typeof safeStreet !== "string" ||
    typeof safeCity !== "string" ||
    typeof safeProvince !== "string" ||
    (safePostalCode != null && typeof safePostalCode !== "string") ||
    (safeCountry != null && typeof safeCountry !== "string")
  ) {
    return { error: "Invalid input types." };
  }

  const street = getTrimmedString(safeStreet);
  const city = getTrimmedString(safeCity);
  const province = getTrimmedString(safeProvince);
  const postalCode = getTrimmedString(safePostalCode);
  const country = getTrimmedString(safeCountry) || "Pakistan";

  if (
    street.length > 300 ||
    city.length > 100 ||
    province.length > 100 ||
    postalCode.length > 20 ||
    country.length > 100
  ) {
    return { error: "Input exceeds allowed length." };
  }

  if (!street) {
    return { error: "Customer street address is required." };
  }

  if (!city) {
    return { error: "Customer city is required." };
  }

  if (!province) {
    return { error: "Customer province is required." };
  }

  return {
    value: {
      firstName,
      lastName,
      email,
      phone,
      address: {
        street,
        city,
        province,
        postalCode,
        country,
      },
    },
  };
}

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return { error: "At least one order item is required." };
  }

  const normalizedItems = [];

  for (const [index, item] of items.entries()) {
    if (!item || typeof item !== "object") {
      return { error: `Item ${index + 1} is invalid.` };
    }

    const safeProductId = sanitize(item.productId);
    const safeProductName = sanitize(item.productName);
    const safeSku = sanitize(item.sku);
    const safeSlug = sanitize(item.slug);
    const safeColor = sanitize(item.color);
    const safeColorHex = sanitize(item.colorHex);
    const safeSize = sanitize(item.size);
    const safeImage = sanitize(item.image);

    if (
      typeof safeProductId !== "string" ||
      typeof safeProductName !== "string" ||
      (safeSku != null && typeof safeSku !== "string") ||
      (safeSlug != null && typeof safeSlug !== "string") ||
      typeof safeColor !== "string" ||
      typeof safeColorHex !== "string" ||
      typeof safeSize !== "string" ||
      typeof safeImage !== "string"
    ) {
      return { error: `Item ${index + 1} has invalid input types.` };
    }

    const productId = getTrimmedString(safeProductId);
    const productName = getTrimmedString(safeProductName);
    const sku = getTrimmedString(safeSku);
    const slug = getTrimmedString(safeSlug);
    const color = getTrimmedString(safeColor);
    const colorHex = getTrimmedString(safeColorHex);
    const size = getTrimmedString(safeSize);
    const image = getTrimmedString(safeImage);
    const price = getNonNegativeNumber(item.price);
    const originalPrice =
      item.originalPrice == null
        ? null
        : getNonNegativeNumber(item.originalPrice);
    const quantity = getPositiveInteger(item.quantity);

    if (
      productName.length > 200 ||
      sku.length > 100 ||
      slug.length > 200 ||
      color.length > 50 ||
      colorHex.length > 10 ||
      size.length > 10 ||
      image.length > 500
    ) {
      return { error: `Item ${index + 1} input exceeds allowed length.` };
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return { error: `Item ${index + 1} has an invalid productId.` };
    }

    if (!productName) {
      return { error: `Item ${index + 1} productName is required.` };
    }

    if (!color) {
      return { error: `Item ${index + 1} color is required.` };
    }

    if (!colorHex || !COLOR_HEX_PATTERN.test(colorHex)) {
      return { error: `Item ${index + 1} colorHex is invalid.` };
    }

    if (!size || !VALID_SIZES.has(size)) {
      return { error: `Item ${index + 1} size is invalid.` };
    }

    if (!image) {
      return { error: `Item ${index + 1} image is required.` };
    }

    if (price == null) {
      return { error: `Item ${index + 1} price is invalid.` };
    }

    if (item.originalPrice != null && originalPrice == null) {
      return { error: `Item ${index + 1} originalPrice is invalid.` };
    }

    if (quantity == null) {
      return { error: `Item ${index + 1} quantity is invalid.` };
    }

    normalizedItems.push({
      productId,
      productName,
      sku,
      slug,
      color,
      colorHex,
      size,
      image,
      price,
      ...(originalPrice != null ? { originalPrice } : {}),
      quantity,
    });
  }

  return { value: normalizedItems };
}

async function createOrderWithUniqueId(orderPayload) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      return await Order.create({
        ...orderPayload,
        orderId: generateOrderId(),
      });
    } catch (error) {
      if (error?.code === 11000 && error?.keyPattern?.orderId) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Could not generate a unique order ID.");
}

async function syncProductInStock(productIds) {
  const uniqueProductIds = [...new Set(productIds)];

  await Promise.all(
    uniqueProductIds.map((productId) =>
      Product.updateOne(
        { _id: new mongoose.Types.ObjectId(productId) },
        [
          {
            $set: {
              inStock: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$sizes",
                        as: "sizeEntry",
                        cond: { $gt: ["$$sizeEntry.stock", 0] },
                      },
                    },
                  },
                  0,
                ],
              },
            },
          },
        ],
        { updatePipeline: true },
      ),
    ),
  );
}

export async function POST(request) {
  try {
    await dbConnect();

    let body;

    try {
      body = await request.json();
    } catch {
      return badRequest("Invalid request body.");
    }

    const customerValidation = validateCustomer(body?.customer);

    if (customerValidation.error) {
      return badRequest(customerValidation.error);
    }

    const itemsValidation = validateItems(body?.items);

    if (itemsValidation.error) {
      return badRequest(itemsValidation.error);
    }

    const paymentMethod = getTrimmedString(body?.paymentMethod);

    if (!VALID_PAYMENT_METHODS.has(paymentMethod)) {
      return badRequest("Invalid payment method.");
    }

    const shippingCost = getNonNegativeNumber(body?.shippingCost);
    const tip = clampTip(body?.tip);

    if (shippingCost == null || !VALID_SHIPPING_COSTS.has(shippingCost)) {
      return badRequest("Shipping cost is invalid.");
    }

    const customer = customerValidation.value;
    const requestItems = itemsValidation.value;
    const aggregatedItems = new Map();

    requestItems.forEach((item) => {
      const key = `${item.productId}:${item.color}:${item.size}`;
      const existingItem = aggregatedItems.get(key);

      if (existingItem) {
        existingItem.quantity += item.quantity;
        return;
      }

      aggregatedItems.set(key, {
        productId: item.productId,
        productName: item.productName,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      });
    });

    const productObjectIds = [
      ...new Set(requestItems.map((item) => item.productId)),
    ].map((productId) => new mongoose.Types.ObjectId(productId));

    const products = await Product.find({
      _id: { $in: productObjectIds },
      isActive: true,
    })
      .select(
        "name slug basePrice originalPrice color colorHex images sizes inStock isActive",
      )
      .lean();

    const productMap = new Map(
      products.map((product) => [String(product._id), product]),
    );
    const outOfStockItems = [];

    for (const aggregatedItem of aggregatedItems.values()) {
      const product = productMap.get(aggregatedItem.productId);
      const normalizedProductColor = getTrimmedString(
        product?.color,
      ).toLowerCase();
      const normalizedItemColor = aggregatedItem.color.toLowerCase();
      const sizeEntry =
        product?.sizes?.find((entry) => entry?.size === aggregatedItem.size) ??
        null;

      if (
        !product ||
        normalizedProductColor !== normalizedItemColor ||
        !sizeEntry ||
        getProductStock(sizeEntry) < aggregatedItem.quantity
      ) {
        outOfStockItems.push({
          productName: aggregatedItem.productName,
          size: aggregatedItem.size,
          color: aggregatedItem.color,
        });
      }
    }

    if (outOfStockItems.length > 0) {
      return badRequest("Some items are out of stock.", { outOfStockItems });
    }

    const serverItems = requestItems.map((item) => {
      const product = productMap.get(item.productId);
      const sizeEntry =
        product?.sizes?.find((entry) => entry?.size === item.size) ?? null;
      const serverPrice = Number(product.basePrice);
      const serverOriginalPrice =
        product.originalPrice != null ? Number(product.originalPrice) : null;

      return {
        productId: new mongoose.Types.ObjectId(item.productId),
        productName: getTrimmedString(product.name) || item.productName,
        sku: getTrimmedString(sizeEntry?.sku) || item.sku,
        slug: getTrimmedString(product.slug) || item.slug,
        color: getTrimmedString(product.color) || item.color,
        colorHex: getTrimmedString(product.colorHex) || item.colorHex,
        image: item.image || getPrimaryImageUrl(product?.images),
        size: item.size,
        price: serverPrice,
        ...(serverOriginalPrice != null
          ? { originalPrice: Number(serverOriginalPrice) }
          : {}),
        quantity: item.quantity,
      };
    });

    const serverSubtotal = serverItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const serverTotal = serverSubtotal + shippingCost + tip;

    const order = await createOrderWithUniqueId({
      customer: {
        name: `${customer.firstName} ${customer.lastName}`.trim(),
        email: customer.email,
        phone: customer.phone,
        whatsappNumber: customer.phone,
        address: customer.address,
      },
      items: serverItems,
      paymentMethod,
      subtotal: serverSubtotal,
      shippingCost,
      tip,
      totalAmount: serverTotal,
      orderStatus: "pending_confirmation",
      paymentStatus: "pending",
    });

    const decrementedItems = [];

    for (const aggregatedItem of aggregatedItems.values()) {
      const product = productMap.get(aggregatedItem.productId);

      const result = await Product.updateOne(
        {
          _id: new mongoose.Types.ObjectId(aggregatedItem.productId),
          color: getTrimmedString(product?.color) || aggregatedItem.color,
          isActive: true,
        },
        {
          $inc: {
            "sizes.$[sizeEntry].stock": -aggregatedItem.quantity,
          },
        },
        {
          arrayFilters: [
            {
              "sizeEntry.size": aggregatedItem.size,
              "sizeEntry.stock": { $gte: aggregatedItem.quantity },
            },
          ],
        },
      );

      if (result.modifiedCount !== 1) {
        await Promise.allSettled(
          decrementedItems.map((decrementedItem) =>
            Product.updateOne(
              {
                _id: new mongoose.Types.ObjectId(decrementedItem.productId),
                color: decrementedItem.color,
              },
              {
                $inc: {
                  "sizes.$[sizeEntry].stock": decrementedItem.quantity,
                },
              },
              {
                arrayFilters: [
                  {
                    "sizeEntry.size": decrementedItem.size,
                  },
                ],
              },
            ),
          ),
        );

        await Order.deleteOne({ _id: order._id });

        return badRequest("Some items are out of stock.", {
          outOfStockItems: [
            {
              productName: aggregatedItem.productName,
              size: aggregatedItem.size,
              color: aggregatedItem.color,
            },
          ],
        });
      }

      decrementedItems.push({
        productId: aggregatedItem.productId,
        color: getTrimmedString(product?.color) || aggregatedItem.color,
        size: aggregatedItem.size,
        quantity: aggregatedItem.quantity,
      });
    }

    await syncProductInStock(
      decrementedItems.map((decrementedItem) => decrementedItem.productId),
    );

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
      },
      { status: 500 },
    );
  }
}
