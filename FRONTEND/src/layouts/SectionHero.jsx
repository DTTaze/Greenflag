"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Award, Leaf, Trash2, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

import { useRouter } from "@/src/i18n/navigation";
import { useAuthStore } from "@/src/store/auth/authStore";

export default function SectionHero() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const t = useTranslations("homepage");
  const tMenu = useTranslations("menu");

  const titles = [t("hero.Title1"), t("hero.Title2"), t("hero.Title3")];

  const descriptions = [t("hero.Desc1"), t("hero.Desc2"), t("hero.Desc3")];

  const images = [
    "/images/pick-up-trash.jpg",
    "/images/plant-a-tree.jpg",
    "/images/turtle.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50/50 via-green-50/20 to-white px-6 py-16 lg:flex-row lg:px-16 lg:py-24 dark:from-emerald-950/10 dark:via-zinc-950 dark:to-zinc-950">
      {/* Decorative Blur Background */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[100px] dark:bg-emerald-900/10" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-[400px] w-[400px] rounded-full bg-green-500/10 blur-[120px] dark:bg-green-900/10" />

      <div className="relative z-10 flex w-full flex-col justify-center lg:w-1/2">
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-100/80 px-3.5 py-1.5 text-xs font-bold tracking-wider text-emerald-800 uppercase dark:bg-emerald-950/50 dark:text-emerald-400">
          <Leaf size={14} className="animate-pulse" />
          {t("hero.LeafText")}
        </div>

        <h1 className="mt-6 text-4xl leading-[1.15] font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
          {t("hero.TitleStart")}
          <br />
          <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 bg-clip-text text-transparent">
            {t("hero.TitleEnd")}
          </span>
        </h1>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="mt-6 min-h-[120px]"
          >
            <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
              {titles[index]}
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
              {descriptions[index]}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => {
              if (isAuthenticated) {
                router.push("/missions");
              } else {
                router.push("/register");
              }
            }}
            className="group animate-in fade-in-0 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/15 transition-all duration-300 hover:scale-[1.03] hover:from-emerald-500 hover:to-green-500 hover:shadow-emerald-500/20 active:scale-95"
          >
            {isAuthenticated ? t("hero.ExploreBtn") : t("hero.JoinBtn")}
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
          {!isAuthenticated && (
            <button
              onClick={() => router.push("/login")}
              className="flex cursor-pointer items-center justify-center rounded-full border-2 border-zinc-200 bg-white px-8 py-4 text-base font-bold text-zinc-700 transition-all duration-300 hover:border-emerald-600 hover:bg-zinc-50 hover:text-emerald-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-500 dark:hover:bg-zinc-800"
            >
              {tMenu("login")}
            </button>
          )}
        </div>

        {/* Stats Summary */}
        <div className="mt-16 grid grid-cols-3 gap-4 border-t border-zinc-100 pt-8 dark:border-zinc-800/80">
          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 text-2xl font-black text-zinc-900 dark:text-white">
              <Users size={16} className="text-emerald-500" />
              10K+
            </span>
            <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {t("hero.MemberText")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 text-2xl font-black text-zinc-900 dark:text-white">
              <Award size={16} className="text-emerald-500" />
              50K+
            </span>
            <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {t("hero.ChallengeText")}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="flex items-center gap-1.5 text-2xl font-black text-zinc-900 dark:text-white">
              <Trash2 size={16} className="text-emerald-500" />
              1,200kg
            </span>
            <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {t("hero.TrashText")}
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-12 flex h-[280px] w-full items-center justify-center sm:h-[350px] md:h-[400px] lg:mt-0 lg:h-[500px] lg:w-1/2">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-emerald-600/10 to-teal-600/10 blur-xl" />
        <div className="relative h-full w-full max-w-xl overflow-hidden rounded-2xl border-4 border-white bg-white/30 shadow-2xl backdrop-blur-xs dark:border-zinc-900 dark:bg-zinc-900/30">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index]}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
              alt={`Slide ${index + 1}`}
              className="absolute h-full w-full object-cover"
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
