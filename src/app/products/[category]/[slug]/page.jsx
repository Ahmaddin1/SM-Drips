import { notFound, unstable_rethrow } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

const ALLOWED_SIZES = new Set(["XS", "S", "M", "L", "XL", "XXL"]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidImage(image) {
  return (
    image &&
    typeof image === "object" &&
    isNonEmptyString(image.url) &&
    Number.isFinite(image.order)
  );
}

function isValidSize(sizeEntry) {
  return (
    sizeEntry &&
    typeof sizeEntry === "object" &&
    ALLOWED_SIZES.has(sizeEntry.size) &&
    Number.isFinite(sizeEntry.stock) &&
    isNonEmptyString(sizeEntry.sku)
  );
}

function normalizeProduct(product) {
  if (!product || typeof product !== "object") {
    return null;
  }

  const {
    _id,
    name,
    slug,
    sku,
    basePrice,
    originalPrice,
    description,
    color,
    colorHex,
    images,
    sizes,
    tags,
    category,
  } = product;

  if (
    _id == null ||
    !isNonEmptyString(name) ||
    !isNonEmptyString(slug) ||
    !isNonEmptyString(sku) ||
    !Number.isFinite(basePrice) ||
    !isNonEmptyString(color) ||
    !isNonEmptyString(colorHex) ||
    !Array.isArray(images) ||
    !images.every(isValidImage) ||
    !Array.isArray(sizes) ||
    !sizes.every(isValidSize) ||
    !category ||
    typeof category !== "object" ||
    category._id == null ||
    !isNonEmptyString(category.name) ||
    !isNonEmptyString(category.slug)
  ) {
    return null;
  }

  if (originalPrice != null && !Number.isFinite(originalPrice)) {
    return null;
  }

  if (description != null && typeof description !== "string") {
    return null;
  }

  if (
    tags != null &&
    (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string"))
  ) {
    return null;
  }

  return {
    _id: String(_id),
    name,
    slug,
    sku,
    basePrice,
    ...(originalPrice != null ? { originalPrice } : {}),
    ...(description ? { description } : {}),
    color,
    colorHex,
    images: images.map(({ url, order }) => ({
      url,
      order,
    })),
    sizes: sizes.map(({ size, stock, sku }) => ({
      size,
      stock,
      sku,
    })),
    ...(tags ? { tags } : {}),
    category: {
      _id: String(category._id),
      name: category.name,
      slug: category.slug,
    },
  };
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const categorySlug =
    typeof resolvedParams?.category === "string"
      ? resolvedParams.category.trim()
      : "";
  const slug =
    typeof resolvedParams?.slug === "string" ? resolvedParams.slug.trim() : "";

  if (!categorySlug || !slug) {
    return {
      title: "Product Not Found",
      description: "This product is unavailable or no longer exists.",
    };
  }

  try {
    await dbConnect();

    const categoryDoc = await Category.findOne({ slug: categorySlug })
      .select("_id")
      .lean();

    if (!categoryDoc) {
      return {
        title: "Product Not Found",
        description: "This product is unavailable or no longer exists.",
      };
    }

    const product = await Product.findOne({ slug, category: categoryDoc._id })
      .select("name description images")
      .lean();

    if (!product) {
      return {
        title: "Product Not Found",
        description: "This product is unavailable or no longer exists.",
      };
    }

    const truncatedDescription =
      product.description && product.description.length > 155
        ? product.description.slice(0, 155) + "..."
        : product.description || "Shop this product at SM Drips.";

    const imageUrl = product.images?.[0]?.url;

    return {
      title: product.name,
      description: truncatedDescription,
      openGraph: {
        title: product.name,
        description: truncatedDescription,
        ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: truncatedDescription,
      },
    };
  } catch (error) {
    return {
      title: "Product Not Found",
      description: "This product is unavailable or no longer exists.",
    };
  }
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const categorySlug =
    typeof resolvedParams?.category === "string"
      ? resolvedParams.category.trim()
      : "";
  const slug =
    typeof resolvedParams?.slug === "string" ? resolvedParams.slug.trim() : "";

  if (!categorySlug || !slug) {
    notFound();
  }

  try {
    await dbConnect();

    const categoryDoc = await Category.findOne({ slug: categorySlug })
      .select("_id")
      .lean();

    if (!categoryDoc) {
      return notFound();
    }

    const product = await Product.findOne({ slug, category: categoryDoc._id })
      .select(
        "name slug sku basePrice originalPrice description color colorHex images sizes tags category isActive",
      )
      .populate({
        path: "category",
        model: Category,
        select: "name slug _id",
      })
      .lean();

    if (product === null || product.isActive === false) {
      notFound();
    }

    const normalizedProduct = normalizeProduct(product);

    if (!normalizedProduct) {
      notFound();
    }

    return <ProductDetails product={normalizedProduct} />;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Product fetch error:", error);
    throw new Error("Failed to load product");
  }
}
