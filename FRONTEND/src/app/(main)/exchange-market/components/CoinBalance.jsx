import { Coins } from "lucide-react";
import { motion } from "framer-motion";

export default function CoinBalance({ coins }) {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <div className="flex items-center">
        <div className="bg-emerald-100 p-2 rounded-full mr-3">
          <Coins className="h-5 w-5 text-emerald-600" />
        </div>
        <span className="font-medium text-emerald-600 pr-16">Số dư của bạn</span>
      </div>
      <motion.div
        key={coins}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-xl font-bold text-emerald-600 bg-white px-4 py-1 rounded-full shadow-sm border border-emerald-100"
      >
        {coins} xu
      </motion.div>
    </div>
  );
}
