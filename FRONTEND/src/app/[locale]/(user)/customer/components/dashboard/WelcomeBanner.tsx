"use client";

import { Leaf } from "lucide-react";
import { useRouter } from "next/navigation";

interface WelcomeBannerProps {
  userName?: string;
}

export default function WelcomeBanner({ userName }: WelcomeBannerProps) {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-8 text-white shadow-lg sm:px-10 sm:py-10 dark:from-emerald-700 dark:to-emerald-800">
      <div className="absolute top-0 right-0 opacity-10">
        <Leaf size={200} className="text-white" />
      </div>
      <div className="relative z-10">
        <h1 className="mb-2 text-3xl font-bold sm:text-4xl">
          Welcome back, {userName || "Customer"}! 👋
        </h1>
        <p className="mb-6 text-emerald-50 sm:text-lg dark:text-emerald-100">
          Keep making a positive impact on the environment
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => router.push("/customer/events")}
            className="rounded-lg bg-white px-5 py-2 font-semibold text-emerald-700 transition-all hover:scale-105 hover:shadow-lg dark:bg-emerald-50 dark:text-emerald-800"
          >
            Explore Events
          </button>
          <button
            onClick={() => router.push("/customer/profile")}
            className="rounded-lg border-2 border-white px-5 py-2 font-semibold text-white transition-all hover:bg-white/10 dark:border-emerald-200 dark:hover:bg-white/20"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
