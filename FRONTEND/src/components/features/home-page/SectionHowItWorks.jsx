"use client";

import { Compass, Gift, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export default function SectionHowItWorks() {
  const t = useTranslations("homepage");

  const steps = [
    {
      step: "01",
      icon: (
        <UserPlus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      ),
      title: t("howItWorks.step1Title"),
      desc: t("howItWorks.step1Desc"),
    },
    {
      step: "02",
      icon: (
        <Compass className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
      ),
      title: t("howItWorks.step2Title"),
      desc: t("howItWorks.step2Desc"),
    },
    {
      step: "03",
      icon: <Gift className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: t("howItWorks.step3Title"),
      desc: t("howItWorks.step3Desc"),
    },
  ];

  return (
    <section className="bg-zinc-50/70 py-20 dark:bg-zinc-900/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-sm font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
            {t("howItWorks.Header")}
          </h2>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            {t("howItWorks.Subtitle")}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/50"
            >
              <div className="absolute top-4 right-6 text-5xl font-black text-emerald-500/10 transition-colors duration-300 group-hover:text-emerald-600">
                {item.step}
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                {item.icon}
              </div>

              <h3 className="mt-6 text-lg font-bold text-zinc-900 dark:text-white">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
