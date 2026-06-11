"use client";

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F7] font-[Inter,sans-serif]">
      <main className="mx-auto max-w-[1200px] px-6 py-6">{children}</main>
    </div>
  );
}
