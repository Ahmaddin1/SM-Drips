export default function Loading() {
  return (
    <div className="min-h-screen bg-[#000000] px-4 py-8 max-w-3xl mx-auto">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="flex items-center gap-4 py-4 border-b border-[#282828]">
          <div className="w-20 h-20 rounded-xl bg-[#282828] animate-pulse flex-shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-4 w-40 rounded bg-[#282828] animate-pulse" />
            <div className="h-4 w-20 rounded bg-[#282828] animate-pulse" />
          </div>
          <div className="h-4 w-16 rounded bg-[#282828] animate-pulse ml-auto" />
        </div>
      ))}
      <div className="h-40 w-full rounded-2xl bg-[#282828] animate-pulse mt-6" />
    </div>
  );
}
