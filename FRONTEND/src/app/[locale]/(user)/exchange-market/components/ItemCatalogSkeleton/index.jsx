import { motion } from "framer-motion";

import CoinBalanceSkeleton from "../CoinBalanceSkeleton";
import ItemCardSkeleton from "../ItemCardSkeleton";

export default function ItemCatalogSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col"
    >
      {/* Hero Section Skeleton */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative mb-8 rounded-2xl bg-gradient-to-br from-emerald-600/40 to-emerald-500/40 p-8 shadow-md"
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-emerald-400/30" />
          <div className="h-8 w-72 rounded-lg bg-emerald-400/30" />
        </div>
        <div className="mb-2 h-4 w-full max-w-2xl rounded-md bg-emerald-400/25" />
        <div className="mb-6 h-4 w-3/4 max-w-2xl rounded-md bg-emerald-400/25" />
        <CoinBalanceSkeleton />
      </motion.div>

      {/* Tabs Skeleton */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
        className="mb-6 h-12 w-fit rounded-2xl bg-gray-200/50"
      />

      {/* Search and Filter Skeleton */}
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        className="mb-6 space-y-4 rounded-2xl border border-gray-200/50 bg-white/50 p-6 shadow-sm backdrop-blur-sm"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="h-10 flex-grow rounded-2xl bg-gray-100/60" />
          <div className="h-10 w-24 rounded-2xl bg-gray-100/60" />
        </div>
      </motion.div>

      {/* Items Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.05,
            }}
          >
            <ItemCardSkeleton />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
