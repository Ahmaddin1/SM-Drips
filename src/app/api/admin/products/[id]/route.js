import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request, { params }) {
  const token = getTokenFromRequest(request);
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await dbConnect();

    const product = await Product.findById(id)
      .populate("category", "_id name slug")
      .lean();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  const token = getTokenFromRequest(request);
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await dbConnect();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const updates = await request.json();

    // If sizes are being updated, regenerate size-level SKUs
    if (updates.sizes && Array.isArray(updates.sizes)) {
      const productSku = product.sku;
      updates.sizes = updates.sizes.map(sizeEntry => ({
        size: sizeEntry.size,
        stock: sizeEntry.stock,
        sku: `${productSku}-${sizeEntry.size}`
      }));
    }

    // Validate colorHex if provided
    if (updates.colorHex && !updates.colorHex.match(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/)) {
      return NextResponse.json(
        { error: "Invalid colorHex format" },
        { status: 400 }
      );
    }

    // Apply updates
    Object.keys(updates).forEach(key => {
      if (key !== "sku" && key !== "_id") {
        product[key] = updates[key];
      }
    });

    await product.save();

    const updatedProduct = await Product.findById(id)
      .populate("category", "_id name slug")
      .lean();

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Product update error:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Product with this slug already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const token = getTokenFromRequest(request);
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    await dbConnect();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Product deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
