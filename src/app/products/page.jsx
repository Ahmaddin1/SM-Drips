import FilterBar from "@/components/shop/FilterBar";
import InfiniteProductGrid from "@/components/InfiniteProductGrid";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export const metadata = {
  title: "All Products",
  description:
    "Browse the full SM Drips collection. Streetwear drops, graphic tees, oversized fits, and more. Shop now.",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function ProductsPage({ searchParams }) {
  await connectDB();

  const resolvedParams = await searchParams;
  const category = resolvedParams.category || "";
  const sort = resolvedParams.sort || "newest";

  const filter = { isActive: true };
  if (category) {
    const categoryDoc = await Category.findOne({ slug: category })
      .select("_id")
      .lean();
    if (categoryDoc) {
      filter.category = categoryDoc._id;
    } else {
      filter.category = null;
    }
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { basePrice: 1 },
    price_desc: { basePrice: -1 },
  };
  const sortObj = sortMap[sort] || sortMap.newest;

  const [rawProducts, totalCount] = await Promise.all([
    Product.find(filter)
      .sort(sortObj)
      .skip(0)
      .limit(12)
      .populate("category", "name slug")
      .lean(),
    Product.countDocuments(filter),
  ]);

  const productsWithComputedFields = rawProducts.map((product) => ({
    ...product,
    isOutOfStock: Array.isArray(product.sizes)
      ? product.sizes.every((s) => (Number(s?.stock) || 0) === 0)
      : true,
  }));

  const serializedProducts = JSON.parse(
    JSON.stringify(productsWithComputedFields),
  );

  return (
    <section className="px-4 pb-20 pt-12 md:px-8 lg:px-10">
      <div className="mx-auto max-w-360">
        <h1 className="mb-2 font-heading text-[54px] uppercase leading-none text-[#e9e9e9] md:text-[72px]">
          All Products
        </h1>
        <p className="text-sm text-[#828282] mb-6">{totalCount} products</p>

        <FilterBar activeCategory={category || "all"} activeSort={sort} />

        <div className="mt-8">
          <InfiniteProductGrid
            initialProducts={serializedProducts}
            totalCount={totalCount}
            categorySlug={category}
            sortValue={sort}
            isEmpty={totalCount === 0}
          />
        </div>
      </div>
    </section>
  );
}
