import Link from "next/link";
import { ArrowRight } from "lucide-react";
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";

async function getCollectionsData() {
  await connectDB();

  const categories = await Category.find({}).sort({ createdAt: 1 }).lean();

  const productsPromises = categories.map((category) =>
    Product.find({ category: category._id })
      .select("name slug basePrice originalPrice images sizes color colorHex")
      .limit(4)
      .lean()
  );

  const productsResults = await Promise.all(productsPromises);

  return categories.map((category, index) => ({
    ...category,
    _id: category._id.toString(),
    products: productsResults[index].map((product) => ({
      ...product,
      _id: product._id.toString(),
      category: {
        _id: category._id.toString(),
        name: category.name,
        slug: category.slug,
      },
    })),
  }));
}

export default async function CollectionsPage() {
  const collections = await getCollectionsData();

  return (
    <div className="min-h-screen bg-[#000000] px-6 py-12">
      <h1 className="mb-12 font-heading text-6xl text-[#E9E9E9]">
        COLLECTIONS
      </h1>

      <div className="space-y-16">
        {collections.map((category) => (
          <section key={category._id}>
            {category.products.length > 0 ? (
              <>
                <Link
                  href={`/products/${category.slug}`}
                  className="mb-4 flex items-center justify-between"
                >
                  <h2 className="font-heading text-4xl text-[#E9E9E9]">
                    {category.name}
                  </h2>
                  <ArrowRight className="h-8 w-8 text-[#defc3e]" />
                </Link>

                <div className="hide-scrollbar -mr-6 flex flex-row gap-3 overflow-x-auto scroll-smooth pb-2 pr-0 flex-nowrap">
                  {category.products.map((product) => (
                    <div key={product._id} className="shrink-0 w-64">
                      <ProductCard product={product} />
                    </div>
                  ))}

                  <Link
                    href={`/products/${category.slug}`}
                    className="flex h-12 w-30 shrink-0 items-center justify-center self-center font-sans font-medium text-[#defc3e]"
                  >
                    View All →
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h2 className="mb-4 font-heading text-4xl text-[#E9E9E9]">
                  {category.name}
                </h2>
                <p className="font-sans text-sm text-[#E9E9E9] opacity-50">
                  Coming Soon :)
                </p>
              </>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
