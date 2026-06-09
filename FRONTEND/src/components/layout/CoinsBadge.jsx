import { motion } from "framer-motion";
import { Coins } from "lucide-react";

export default function CoinsBadge({ amount = 0 }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-1.5 rounded-full border border-amber-200/50 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 shadow-2xs select-none"
    >
      <Coins className="h-4 w-4 animate-pulse text-amber-500" />
      <span>{amount}</span>
    </motion.div>
  );
}
