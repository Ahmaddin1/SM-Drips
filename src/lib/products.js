import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

function serializeDate(value) {
  if (!value) {
    return "";
  }

  const parsedDate = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? "" : parsedDate.toISOString();
}

function serializeCategory(category) {
  if (!category || typeof category !== "object") {
    return {
      name: "",
      slug: "",
    };
  }

  return {
    name: category.name ?? "",
    slug: category.slug ?? "",
  };
}

function serializeProduct(product) {
  const images = Array.isArray(product.images)
    ? product.images.map((image) => ({
        url: image?.url ?? "",
        order: Number(image?.order ?? 0),
      }))
    : [];
  const sizes = Array.isArray(product.sizes)
    ? product.sizes.map((sizeEntry) => ({
        size: sizeEntry?.size ?? "",
        stock: Number(sizeEntry?.stock ?? 0),
        sku: sizeEntry?.sku ?? "",
      }))
    : [];
  const isOutOfStock =
    sizes.length === 0 || sizes.every((sizeEntry) => sizeEntry.stock <= 0);

  return {
    _id: String(product._id),
    name: product.name ?? "",
    slug: product.slug ?? "",
    category: serializeCategory(product.category),
    basePrice: Number(product.basePrice ?? 0),
    ...(product.originalPrice != null
      ? { originalPrice: Number(product.originalPrice) }
      : {}),
    color: product.color ?? "",
    colorHex: product.colorHex ?? "",
    images,
    sizes,
    createdAt: serializeDate(product.createdAt),
    isOutOfStock,
  };
}

export async function getProducts({
  filter = {},
  limit = 16,
  sort = { createdAt: -1 },
  skip,
} = {}) {
  if (typeof skip !== "number") {
    throw new Error("getProducts requires a numeric skip value.");
  }

  await dbConnect();

  let query = Product.find(filter)
    .select(
      "name slug category basePrice originalPrice color colorHex images sizes createdAt",
    )
    .populate({
      path: "category",
      select: "name slug -_id",
    })
    .sort(sort)
    .skip(skip)
    .lean();

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const products = await query;
  return products.map(serializeProduct);
}

export async function getCategories() {
  await dbConnect();

  const categories = await Category.find({})
    .select("name slug image")
    .sort({ order: 1 })
    .lean();

  return categories.map((category) => ({
    _id: String(category._id),
    name: category.name ?? "",
    slug: category.slug ?? "",
    image: category.image ?? null,
  }));
}

export async function countProducts(filter = {}) {
  await dbConnect();
  return Product.countDocuments(filter);
}
