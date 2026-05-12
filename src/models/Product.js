import mongoose from "mongoose";

const { Schema } = mongoose;

const productImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const productSizeSchema = new Schema(
  {
    size: {
      type: String,
      required: true,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    basePrice: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    colorHex: {
      type: String,
      required: true,
      trim: true,
      match: [/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid hex color code"],
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
    sizes: {
      type: [productSizeSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.index({ createdAt: 1 });
productSchema.index({ slug: 1, category: 1 });

productSchema.virtual("isOutOfStock").get(function isOutOfStock() {
  if (!this.sizes || this.sizes.length === 0) {
    return true;
  }

  return this.sizes.every((entry) => entry.stock === 0);
});

productSchema.pre("save", async function syncInStock() {
  this.inStock =
    Array.isArray(this.sizes) &&
    this.sizes.some(
      (entry) => typeof entry.stock === "number" && entry.stock > 0,
    );
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
