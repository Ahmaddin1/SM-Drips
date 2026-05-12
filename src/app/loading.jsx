export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000]">
      <h1 className="text-4xl text-[#E9E9E9] font-[family-name:var(--font-bebas)]">
        LOADING
      </h1>
      <div className="flex gap-2 mt-3">
        <div
          className="w-2 h-2 rounded-full bg-[#defc3e] animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-[#defc3e] animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-[#defc3e] animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
