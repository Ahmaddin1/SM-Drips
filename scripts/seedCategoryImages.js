import dbConnect from '../src/lib/db.js';
import Category from '../src/models/Category.js';

const categoryImages = [
  {
    slug: "t-shirts",
    image:
      "https://res.cloudinary.com/do6teyqlt/image/upload/q_auto/f_auto/v1778573436/T-Shirt_srwlx2.png",
  },
  {
    slug: "polos",
    image:
      "https://res.cloudinary.com/do6teyqlt/image/upload/q_auto/f_auto/v1778573549/Polo_jgle5m.png",
  },
  {
    slug: "casual-shirts",
    image:
      "https://res.cloudinary.com/do6teyqlt/image/upload/q_auto/f_auto/v1778573599/Casual_Shirts_yeqsqx.png",
  },
  {
    slug: "bottoms",
    image:
      "https://res.cloudinary.com/do6teyqlt/image/upload/q_auto/f_auto/v1778573558/Bottoms_bzbuui.png",
  },
  {
    slug: "hoodies",
    image:
      "https://res.cloudinary.com/do6teyqlt/image/upload/q_auto/f_auto/v1778573568/Hoodies_dsy8zo.png",
  },
  {
    slug: "jackets",
    image:
      "https://res.cloudinary.com/do6teyqlt/image/upload/q_auto/f_auto/v1778573579/Jackets_efiaod.png",
  },
  {
    slug: "tracksuits",
    image:
      "https://res.cloudinary.com/do6teyqlt/image/upload/q_auto/f_auto/v1778573588/Tracksuits_v0odmz.png",
  },
];

async function seedCategoryImages() {
  await dbConnect();
  console.log("Connected to MongoDB...");

  for (const { slug, image } of categoryImages) {
    const result = await Category.findOneAndUpdate(
      { slug },
      { $set: { image } },
      { new: true },
    );

    if (result) {
      console.log(`✓ Updated: ${result.name}`);
    } else {
      console.warn(`✗ No category found for slug: "${slug}"`);
    }
  }

  console.log("Done.");
  process.exit(0);
}

seedCategoryImages().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
