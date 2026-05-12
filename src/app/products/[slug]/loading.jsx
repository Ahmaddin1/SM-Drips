export default function Loading() {
  return (
    <div className="min-h-screen bg-[#000000] px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
        <div className="w-full md:w-1/2 aspect-[3/4] rounded-3xl bg-[#282828] animate-pulse" />
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <div className="h-10 w-3/4 rounded bg-[#282828] animate-pulse" />
          <div className="h-6 w-1/4 rounded bg-[#282828] animate-pulse" />
          <div className="h-4 w-full rounded bg-[#282828] animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-[#282828] animate-pulse" />
          <div className="h-4 w-4/6 rounded bg-[#282828] animate-pulse" />
          <div className="h-12 w-full rounded bg-[#282828] animate-pulse mt-2" />
        </div>
      </div>
    </div>
  );
}
