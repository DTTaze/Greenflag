import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CoinBalance({ coins }) {
  const t = useTranslations("exchangeMarket");

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-emerald-100/50 bg-gradient-to-r from-emerald-50/70 to-green-50/70 p-4.5 shadow-2xs backdrop-blur-xs sm:flex-row">
      <div className="flex items-center">
        <div className="mr-3.5 rounded-full bg-emerald-100/70 p-2.5">
          <Coins className="h-5 w-5 animate-pulse text-emerald-700" />
        </div>
        <span className="text-sm font-extrabold tracking-wide text-emerald-800 uppercase">
          {t("header.yourBalance")}
        </span>
      </div>
      <motion.div
        key={coins}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="border-emerald-250/20 flex items-center gap-1.5 rounded-xl border bg-white px-5 py-2 text-lg font-black text-[#0B6E4F] shadow-xs"
      >
        <span>{coins.toLocaleString()}</span>
        <span className="text-sm font-bold text-emerald-600/80">
          {t("header.coins")}
        </span>
      </motion.div>
    </div>
  );
}
