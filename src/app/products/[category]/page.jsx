import { notFound, unstable_rethrow } from "next/navigation";
import InfiniteProductGrid from "@/components/InfiniteProductGrid";
import { countProducts, getProducts } from "@/lib/products";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const categorySlug =
    typeof resolvedParams?.category === "string"
      ? resolvedParams.category.trim()
      : "";

  if (!categorySlug) {
    notFound();
  }

  try {
    await dbConnect();

    const categoryDoc = await Category.findOne({ slug: categorySlug })
      .select("name slug _id")
      .lean();

    if (!categoryDoc) {
      notFound();
    }

    const filter = {
      category: categoryDoc._id,
      isActive: true,
    };

    const [initialProducts, totalCount] = await Promise.all([
      getProducts({
        filter,
        sort: { createdAt: -1 },
        limit: 16,
        skip: 0,
      }),
      countProducts(filter),
    ]);

    return (
      <section className="px-4 pb-20 pt-12 md:px-8 lg:px-10">
        <div className="mx-auto max-w-360">
          <h1 className="mb-8 font-heading text-[54px] uppercase leading-none text-[#e9e9e9] md:text-[72px]">
            {categoryDoc.name}
          </h1>
          <InfiniteProductGrid
            initialProducts={initialProducts}
            totalCount={totalCount}
            categorySlug={categorySlug}
          />
        </div>
      </section>
    );
  } catch (error) {
    unstable_rethrow(error);
    console.error("Failed to load category page:", error);
    throw new Error("Failed to load category");
  }
}
