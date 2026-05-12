import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

function generateSKU(categoryName, color) {
  const categoryCode = categoryName
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();
  
  const colorCode = color
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase();
  
  const suffix = Math.floor(Math.random() * 900) + 100;
  
  return `SM-${categoryCode}-${colorCode}-${suffix}`;
}

async function generateUniqueSKU(categoryName, color) {
  let productSku = generateSKU(categoryName, color);
  
  const existing = await Product.findOne({ sku: productSku });
  if (existing) {
    productSku = generateSKU(categoryName, color);
  }
  
  return productSku;
}

export async function GET(request) {
  const token = getTokenFromRequest(request);
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const stockStatus = searchParams.get("stockStatus") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    if (stockStatus === "inStock") {
      filter["sizes.stock"] = { $gt: 0 };
    } else if (stockStatus === "lowStock") {
      filter.$and = [
        { "sizes.stock": { $gt: 0 } },
        { "sizes.stock": { $lt: 5 } }
      ];
    } else if (stockStatus === "outOfStock") {
      filter.$or = [
        { sizes: { $size: 0 } },
        { "sizes.stock": { $not: { $gt: 0 } } }
      ];
    }

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate("category", "_id name slug")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products,
      totalCount,
      page,
      totalPages
    });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const token = getTokenFromRequest(request);
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      category,
      description,
      basePrice,
      originalPrice,
      color,
      colorHex,
      images,
      isActive,
      tags,
      sizes
    } = body;

    // Validation
    if (!name || !slug || !category || !basePrice || !color || !colorHex || !sizes || sizes.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, category, basePrice, color, colorHex, sizes" },
        { status: 400 }
      );
    }

    if (!colorHex.match(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)) {
      return NextResponse.json(
        { error: "Invalid colorHex format" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch category for SKU generation
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    // Generate product SKU
    const productSku = await generateUniqueSKU(categoryDoc.name, color);

    // Generate size-level SKUs
    const sizesWithSku = sizes.map(sizeEntry => ({
      size: sizeEntry.size,
      stock: sizeEntry.stock,
      sku: `${productSku}-${sizeEntry.size}`
    }));

    // Create product
    const product = await Product.create({
      name,
      slug,
      sku: productSku,
      category,
      description: description || "",
      basePrice,
      originalPrice: originalPrice || null,
      color,
      colorHex,
      images: images || [],
      isActive: isActive !== undefined ? isActive : true,
      tags: tags || [],
      sizes: sizesWithSku
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Product creation error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Product with this slug or SKU already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
