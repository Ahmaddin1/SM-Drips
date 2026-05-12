export default function Loading() {
  return (
    <div className="min-h-screen bg-[#000000] px-4 py-8 max-w-xl mx-auto flex flex-col gap-4">
      <div className="h-10 w-1/2 rounded bg-[#282828] animate-pulse" />
      <div className="h-12 w-full rounded-lg bg-[#282828] animate-pulse" />
      <div className="h-12 w-full rounded-lg bg-[#282828] animate-pulse" />
      <div className="h-12 w-full rounded-lg bg-[#282828] animate-pulse" />
      <div className="h-12 w-full rounded-lg bg-[#282828] animate-pulse" />
      <div className="h-32 w-full rounded-2xl bg-[#282828] animate-pulse" />
      <div className="h-14 w-full rounded bg-[#282828] animate-pulse" />
    </div>
  );
}
