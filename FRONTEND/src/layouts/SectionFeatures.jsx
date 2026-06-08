"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";

export default function SectionFeatures({
  imagePath,
  badge,
  H2Text,
  PText,
  ButtonText,
  path,
  reverse,
}) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.15 },
    );

    const currentSectionRef = sectionRef.current;
    if (currentSectionRef) {
      observer.observe(currentSectionRef);
    }
    return () => {
      if (currentSectionRef) {
        observer.unobserve(currentSectionRef);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-6 py-16 sm:py-24 lg:flex-row ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Visual Image container with animate fade-in */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2"
      >
        <div className="dark:border-zinc-850 relative overflow-hidden rounded-2xl border border-zinc-100 shadow-xl">
          <img
            src={imagePath}
            alt="Feature Graphic"
            className="h-auto w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
        </div>
      </motion.div>

      {/* Text block */}
      <motion.div
        initial={{ opacity: 0, x: reverse ? -50 : 50 }}
        animate={isVisible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="flex w-full flex-col justify-center lg:w-[45%]"
      >
        <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
          {badge}
        </span>
        <h2 className="mt-3 text-2xl font-black text-zinc-900 sm:text-3xl lg:text-4xl dark:text-white">
          {H2Text}
        </h2>
        <p className="text-zinc-650 mt-4 text-base leading-relaxed dark:text-zinc-400">
          {PText}
        </p>

        <button
          className="group mt-8 flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/10 transition-all duration-300 hover:scale-[1.03] hover:bg-emerald-500 hover:shadow-emerald-500/20 active:scale-95"
          onClick={() => {
            if (isAuthenticated) {
              router.push(path);
              window.scrollTo(0, 0);
            } else {
              router.push("/register");
              window.scrollTo(0, 0);
            }
          }}
        >
          {ButtonText}
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </motion.div>
    </section>
  );
}
