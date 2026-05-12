export default function Loading() {
  return (
    <div className="min-h-screen bg-[#000000] px-4 pt-24 pb-8 md:px-10 lg:px-20">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Image Gallery Skeleton */}
        <div className="flex flex-row gap-3">
          {/* Thumbnail Column */}
          <div className="w-18 shrink-0">
            <div className="flex flex-col gap-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="relative aspect-3/4 w-full overflow-hidden rounded-[10px] border border-[#3a3a3a] bg-[#282828] animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Main Image */}
          <div className="relative aspect-3/4 flex-1 overflow-hidden rounded-[20px] border border-[#3a3a3a] bg-[#282828] animate-pulse" />
        </div>

        {/* Product Info Skeleton */}
        <div className="flex flex-col gap-4">
          {/* Breadcrumb */}
          <div className="h-3 w-48 rounded bg-[#282828] animate-pulse" />

          {/* Product Name */}
          <div className="h-10 w-3/4 rounded bg-[#282828] animate-pulse" />

          {/* Price */}
          <div className="h-8 w-32 rounded bg-[#282828] animate-pulse" />

          {/* Stock Status */}
          <div className="h-4 w-24 rounded bg-[#282828] animate-pulse" />

          {/* Color */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#282828] animate-pulse" />
            <div className="h-3 w-20 rounded bg-[#282828] animate-pulse" />
          </div>

          {/* Size Section */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-[#282828] animate-pulse" />
              <div className="h-3 w-20 rounded bg-[#282828] animate-pulse" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-10 w-14 rounded-full border border-[#3a3a3a] bg-[#282828] animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Quantity Section */}
          <div className="flex items-center gap-4">
            <div className="h-3 w-16 rounded bg-[#282828] animate-pulse" />
            <div className="h-9 w-9 rounded-full border border-[#3a3a3a] bg-[#282828] animate-pulse" />
            <div className="h-5 w-8 rounded bg-[#282828] animate-pulse" />
            <div className="h-9 w-9 rounded-full border border-[#3a3a3a] bg-[#282828] animate-pulse" />
          </div>

          {/* Add to Cart Button */}
          <div className="h-14 w-full rounded-full bg-[#282828] animate-pulse" />

          {/* Description */}
          <div>
            <div className="mb-2 h-3 w-32 rounded bg-[#282828] animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-[#282828] animate-pulse" />
              <div className="h-3 w-full rounded bg-[#282828] animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-[#282828] animate-pulse" />
            </div>
          </div>

          {/* Accordion Sections */}
          <div>
            <div className="rounded-[22px] border border-[#3a3a3a] bg-[#1e1e1e]">
              <div className="flex w-full items-center justify-between px-4 py-4">
                <div className="h-4 w-20 rounded bg-[#282828] animate-pulse" />
                <div className="h-4 w-4 rounded bg-[#282828] animate-pulse" />
              </div>
            </div>

            <div className="mt-3 rounded-[22px] border border-[#3a3a3a] bg-[#1e1e1e]">
              <div className="flex w-full items-center justify-between px-4 py-4">
                <div className="h-4 w-32 rounded bg-[#282828] animate-pulse" />
                <div className="h-4 w-4 rounded bg-[#282828] animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
