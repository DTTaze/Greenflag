import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import CoinBalance from "@/src/app/[locale]/(user)/exchange-market/components/CoinBalance";

const MissionHeader = ({ userInfo, loading, searchQuery, setSearchQuery }) => {
  const t = useTranslations("missions.header");

  if (loading) {
    return (
      <div className="mb-8 flex animate-pulse flex-col items-center justify-between rounded-[2rem] border border-emerald-200/40 bg-gradient-to-br from-[#064E3B] via-[#0B6E4F] to-[#10B981] p-7 text-white shadow-[0_24px_70px_rgba(6,78,59,0.24)] sm:flex-row">
        <div>
          <div className="mb-2.5 h-8 w-56 rounded bg-white/20"></div>
          <div className="h-4 w-80 rounded bg-white/20"></div>
        </div>
        <div className="mt-4 flex items-center sm:mt-0">
          <div className="h-10 w-64 rounded-full bg-white/20"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative mb-8 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[2rem] border border-emerald-200/40 bg-gradient-to-br from-[#064E3B] via-[#0B6E4F] to-[#10B981] p-7 text-white shadow-[0_24px_70px_rgba(6,78,59,0.24)] sm:flex-row"
    >
      {/* Decorative backdrop glow */}
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-lime-300/25 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl"></div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.12)_45%,transparent_65%)]" />

      <div className="relative z-10 flex-1 text-center sm:text-left">
        <h1 className="mb-2 flex items-center justify-center gap-2.5 text-2xl font-extrabold tracking-tight sm:justify-start md:text-3xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md">
            <Sparkles className="h-5 w-5 animate-pulse text-emerald-200" />
          </div>
          {t("title")}
        </h1>
        <p className="max-w-md text-sm leading-relaxed font-medium text-emerald-100/90 md:text-[0.95rem]">
          {t("subtitle")}
        </p>
      </div>

      <div className="relative z-10 flex w-full justify-center sm:w-auto">
        <div className="min-w-[220px] rounded-2xl border border-white/15 bg-white/5 p-4 shadow-inner backdrop-blur-md">
          <span className="mb-1.5 block text-center text-[10px] font-bold tracking-wider text-emerald-200/80 uppercase">
            {t("balance")}
          </span>
          <CoinBalance coins={userInfo?.coins?.amount || 0} />
        </div>
      </div>
    </motion.div>
  );
};

export default MissionHeader;
