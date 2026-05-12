import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "16", 10);
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "newest";

    const filter = { isActive: true };
    if (category) {
      filter.category = category;
    }

    const sortMap = {
      newest: { createdAt: -1 },
      price_asc: { basePrice: 1 },
      price_desc: { basePrice: -1 },
    };
    const sortObj = sortMap[sort] || sortMap.newest;

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate("category", "name slug")
      .lean();

    const productsWithComputedFields = products.map((product) => ({
      ...product,
      isOutOfStock: Array.isArray(product.sizes)
        ? product.sizes.every((s) => (Number(s?.stock) || 0) === 0)
        : true,
    }));

    return NextResponse.json(productsWithComputedFields);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
