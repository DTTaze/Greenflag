"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Leaf } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import LocaleSwitcher from "@/src/components/layout/LocaleSwitcher";
import ThemeSwitcher from "@/src/components/layout/ThemeSwitcher";
import { Link, usePathname } from "@/src/i18n/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const tMenu = useTranslations("menu");
  const tFeatures = useTranslations("homepage.features");
  
  const [activeSlide, setActiveSlide] = useState(0);
  const isSuccessPage = pathname?.includes("/auth/success");

  // Rotating slide data for the left branding panel
  const slides = [
    {
      badge: tFeatures("missionBadge"),
      title: tFeatures("missionH2"),
      desc: tFeatures("missionP"),
    },
    {
      badge: tFeatures("marketBadge"),
      title: tFeatures("marketH2"),
      desc: tFeatures("marketP"),
    },
    {
      badge: tFeatures("communityBadge"),
      title: tFeatures("communityH2"),
      desc: tFeatures("communityP"),
    },
  ];

  useEffect(() => {
    if (isSuccessPage) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isSuccessPage, slides.length]);

  // If callback success page, render a cleaner centered loading layout
  if (isSuccessPage) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-zinc-950">
        {/* Blurred background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/5" />
          <div className="absolute -bottom-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-teal-500/10 blur-[120px] dark:bg-teal-500/5" />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50/60 dark:bg-zinc-950">
      <style>{`
        @keyframes float-blob-1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.15); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float-blob-2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-40px, 40px) scale(0.85); }
        }
        .animate-blob-1 {
          animation: float-blob-1 22s infinite alternate ease-in-out;
        }
        .animate-blob-2 {
          animation: float-blob-2 18s infinite alternate ease-in-out;
        }
      `}</style>

      {/* Backdrop glowing ambient blobs */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-blob-1 absolute top-[10%] left-[5%] h-[400px] w-[400px] rounded-full bg-emerald-400/15 blur-[100px] dark:bg-emerald-500/5" />
        <div className="animate-blob-2 absolute bottom-[15%] right-[5%] h-[450px] w-[450px] rounded-full bg-teal-400/15 blur-[120px] dark:bg-[#0B6E4F]/5" />
      </div>

      {/* Top Header Row */}
      <header className="relative z-20 flex w-full items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-[#0B6E4F] active:scale-95 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-emerald-400"
        >
          <ArrowLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-0.5" />
          <span>{tMenu("home")}</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </header>

      {/* Grid split view container */}
      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl px-4 pb-12 sm:px-6 md:grid-cols-12 md:gap-8 lg:px-8 lg:pb-16">
        {/* Left Branding sidebar */}
        <section className="relative hidden flex-col justify-between rounded-2xl border border-emerald-800/10 bg-radial from-[#064e3b] via-[#022c22] to-[#041f1a] p-12 text-white shadow-xl dark:border-zinc-800/60 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-950 md:col-span-5 md:flex">
          {/* Decorative backdrop glow */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
            <div className="absolute top-[20%] -left-[10%] h-[60%] w-[60%] rounded-full bg-emerald-500/20 blur-[80px] dark:bg-emerald-500/10" />
          </div>

          {/* Logo brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 p-2 shadow-inner backdrop-blur-md dark:bg-zinc-800/40">
              <img
                src="/images/Logo-Greenflag.png"
                className="h-full w-full object-contain"
                alt="Green Flag Logo"
              />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wider uppercase text-emerald-400 dark:text-emerald-400">
                Green Flag
              </h1>
              <p className="text-xs font-semibold text-emerald-300/70 dark:text-emerald-500/60">
                Protect the Environment
              </p>
            </div>
          </div>

          {/* Carousel slide items */}
          <div className="my-auto min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col gap-4"
              >
                <div className="inline-flex max-w-max items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold tracking-wide text-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Leaf className="h-3.5 w-3.5" />
                  <span>{slides[activeSlide].badge}</span>
                </div>
                <h2 className="text-2xl font-bold leading-tight tracking-tight lg:text-3xl">
                  {slides[activeSlide].title}
                </h2>
                <p className="text-sm leading-relaxed text-emerald-100/80 dark:text-zinc-400">
                  {slides[activeSlide].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Slide dots indicators */}
            <div className="mt-8 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === activeSlide
                      ? "w-8 bg-emerald-400"
                      : "w-2.5 bg-emerald-300/30 dark:bg-zinc-800"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom branding footer/tagline */}
          <div className="border-t border-white/10 pt-6 text-xs font-medium text-emerald-200/50 dark:border-zinc-800/80 dark:text-zinc-500">
            © {new Date().getFullYear()} Green Flag. All rights reserved.
          </div>
        </section>

        {/* Right Auth Forms panel */}
        <section className="flex flex-col justify-center md:col-span-7">
          <div className="mx-auto w-full max-w-[480px]">
            {/* Logo display on mobile only */}
            <div className="mb-6 flex flex-col items-center gap-2 md:hidden">
              <img
                src="/images/Logo-Greenflag.png"
                className="h-14 w-14 object-contain"
                alt="Green Flag"
              />
              <h1 className="text-2xl font-black tracking-tight text-[#0B6E4F] dark:text-emerald-400">
                Green Flag
              </h1>
            </div>
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
