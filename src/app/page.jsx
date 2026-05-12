import CategorySection from "@/components/CategorySection";
import NewArrivalsSection from "@/components/NewArrivalsSection";
import MarqueeSection from "@/components/MarqueeSection";
import Hero4 from "@/components/Hero4";
import HomeInfoSection from "@/components/HomeInfoSection";
import { getCategories, getProducts } from "@/lib/products";

export const metadata = {
  title: "SM Drips | Streetwear Built To Stand Out",
  description:
    "Fresh silhouettes, elevated basics, and bold everyday pieces. Shop the latest SS26 drop from SM Drips.",
  keywords: [
    "streetwear",
    "SM Drips",
    "SS26",
    "fashion",
    "clothing",
    "shop",
    "outfitters",
    "engine",
    "tracksuits",
  ],
  openGraph: {
    title: "SM Drips | Streetwear Built To Stand Out",
    description:
      "Fresh silhouettes, elevated basics, and bold everyday pieces. Shop the latest SS26 drop from SM Drips.",
    url: "https://smgarments.shop",
    siteName: "SM Drips",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SM Drips | Streetwear Built To Stand Out",
    description:
      "Fresh silhouettes, elevated basics, and bold everyday pieces. Shop the latest SS26 drop.",
  },
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts({
      filter: { isActive: true },
      sort: { createdAt: -1 },
      limit: 8,
      skip: 0,
    }),
    getCategories(),
  ]);

  return (
    <div className="bg-black pb-28">
      <Hero4 />
      <div className="pt-20">
        <MarqueeSection />
      </div>

      <div className="space-y-20">
        <section className="px-4 py-20 text-center">
          <h2 className="font-heading text-[48px] leading-none text-[#e9e9e9]">
            Find Your Style
          </h2>
          <p className="mb-8 mt-3 text-[13px] tracking-[1px] text-[#6b6b6b]">
            Browse our collections and pick your fit.
          </p>
          <CategorySection categories={categories} />
        </section>

        <NewArrivalsSection products={products} />

        <HomeInfoSection />
      </div>
    </div>
  );
}
