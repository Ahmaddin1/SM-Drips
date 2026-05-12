"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const CATEGORIES = [
  { name: "All", slug: "all" },
  { name: "T-Shirts", slug: "t-shirts" },
  { name: "Casual Shirts", slug: "casual-shirts" },
  { name: "Polos", slug: "polos" },
  { name: "Bottoms", slug: "bottoms" },
  { name: "Hoodies", slug: "hoodies" },
  { name: "Jackets", slug: "jackets" },
  { name: "TrackSuits", slug: "tracksuits" },
];

export default function FilterBar({ activeCategory, activeSort }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCategoryChange = (e) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value === "all") {
      params.delete("category");
    } else {
      params.set("category", e.target.value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetCategory = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", "newest");
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeCategoryName = CATEGORIES.find(cat => cat.slug === activeCategory)?.name || "All";
  const sortLabel = activeSort === "price_asc" ? "Price: Low to High" : "Price: High to Low";

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4 border-b border-[#282828] sticky top-20 md:top-24 z-10 backdrop-blur-lg bg-black/60 rounded-lg">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={resetCategory}
          className="bg-[#defc3e] text-black border border-[#defc3e] font-semibold text-sm px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200"
          style={{ fontFamily: "DM Sans" }}
        >
          {activeCategoryName}
        </button>
        {activeSort !== "newest" && (
          <button
            onClick={resetSort}
            className="bg-[#defc3e] text-black border border-[#defc3e] font-semibold text-sm px-4 py-1.5 rounded-full cursor-pointer transition-all duration-200"
            style={{ fontFamily: "DM Sans" }}
          >
            {sortLabel}
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative inline-block">
          <select
            value={activeCategory}
            onChange={handleCategoryChange}
            className="appearance-none bg-[#282828] text-[#E9E9E9] border border-[#282828] text-sm px-4 py-1.5 pr-8 rounded-full cursor-pointer focus:outline-none focus:border-[#defc3e]"
            style={{ fontFamily: "DM Sans" }}
          >
            {CATEGORIES.map(cat => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="#E9E9E9"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative inline-block">
          <select
            value={activeSort}
            onChange={handleSortChange}
            className="appearance-none bg-[#282828] text-[#E9E9E9] border border-[#282828] text-sm px-4 py-1.5 pr-8 rounded-full cursor-pointer focus:outline-none focus:border-[#defc3e]"
            style={{ fontFamily: "DM Sans" }}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="#E9E9E9"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
