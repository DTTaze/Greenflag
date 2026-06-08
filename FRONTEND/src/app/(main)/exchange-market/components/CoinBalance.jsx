import { motion } from "framer-motion";
import { Coins } from "lucide-react";

export default function CoinBalance({ coins }) {
  return (
    <div className="flex flex-col items-center justify-between gap-2 rounded-lg border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4 shadow-sm sm:flex-row">
      <div className="flex items-center">
        <div className="mr-3 rounded-full bg-emerald-100 p-2">
          <Coins className="h-5 w-5 text-emerald-600" />
        </div>
        <span className="pr-16 font-medium text-emerald-600">
          Số dư của bạn
        </span>
      </div>
      <motion.div
        key={coins}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded-full border border-emerald-100 bg-white px-4 py-1 text-xl font-bold text-emerald-600 shadow-sm"
      >
        {coins} xu
      </motion.div>
    </div>
  );
}
