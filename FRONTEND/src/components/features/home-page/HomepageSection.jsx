"use client";

import { Award, Globe, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import SectionFeatures from "./SectionFeatures";
import SectionHero from "./SectionHero";
import SectionHowItWorks from "./SectionHowItWorks";

function HomepageSection() {
  const t = useTranslations("homepage");

  return (
    <div className="bg-white text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-100">
      <SectionHero />

      <SectionHowItWorks />

      {/* Feature 1: Missions */}
      <SectionFeatures
        badge={t("features.missionBadge")}
        imagePath="/images/Nhiemvu.png"
        H2Text={t("features.missionH2")}
        PText={t("features.missionP")}
        path="/missions"
        ButtonText={t("features.missionBtn")}
      />

      {/* Feature 2: Market */}
      <SectionFeatures
        badge={t("features.marketBadge")}
        imagePath="/images/Cho-trao-doi.png"
        H2Text={t("features.marketH2")}
        PText={t("features.marketP")}
        path="/exchange-market"
        ButtonText={t("features.marketBtn")}
        reverse
      />

      {/* Feature 3: Forum */}
      <SectionFeatures
        badge={t("features.forumBadge")}
        imagePath="/images/hand-drawn-people-planting-a-tree.jpg"
        H2Text={t("features.forumH2")}
        PText={t("features.forumP")}
        path="/forum"
        ButtonText={t("features.forumBtn")}
      />

      {/* Trust & Guarantee Section */}
      <section className="border-t border-zinc-100 bg-zinc-50/30 py-16 dark:border-zinc-900 dark:bg-zinc-950/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Globe size={22} />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                  {t("trust.globalTitle")}
                </h4>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {t("trust.globalDesc")}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Shield size={22} />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                  {t("trust.safetyTitle")}
                </h4>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {t("trust.safetyDesc")}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                <Award size={22} />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-white">
                  {t("trust.qualityTitle")}
                </h4>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {t("trust.qualityDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomepageSection;
