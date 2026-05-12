import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env.local") });

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: String,
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

const categories = [
  { name: "T-Shirts", slug: "t-shirts" },
  { name: "Casual Shirts", slug: "casual-shirts" },
  { name: "Bottoms", slug: "bottoms" },
  { name: "Polos", slug: "polos" },
  { name: "Hoodies", slug: "hoodies" },
  { name: "Jackets", slug: "jackets" },
  { name: "TrackSuits", slug: "tracksuits" },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const cat of categories) {
      const existing = await Category.findOne({ slug: cat.slug });
      if (existing) {
        console.log(`Skipped: ${cat.name} (already exists)`);
      } else {
        await Category.create(cat);
        console.log(`Inserted: ${cat.name}`);
      }
    }

    console.log("Seeding completed");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedCategories();
