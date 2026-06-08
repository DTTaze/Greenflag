import { motion } from "framer-motion";
import { Coins } from "lucide-react";

export default function CoinBalance({ coins }) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-emerald-100/50 bg-gradient-to-r from-emerald-50/70 to-green-50/70 p-4.5 shadow-2xs backdrop-blur-xs sm:flex-row">
      <div className="flex items-center">
        <div className="mr-3.5 rounded-full bg-emerald-100/70 p-2.5">
          <Coins className="h-5 w-5 animate-pulse text-emerald-700" />
        </div>
        <span className="pr-10 font-semibold text-emerald-800">
          Số dư của bạn
        </span>
      </div>
      <motion.div
        key={coins}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="rounded-full border border-emerald-200/50 bg-white px-5 py-1.5 text-lg font-extrabold text-emerald-700 shadow-xs"
      >
        {coins.toLocaleString()} xu
      </motion.div>
    </div>
  );
}
