import { motion } from "framer-motion";
import { Leaf, Plus } from "lucide-react";

function MarketEmptyState({ marketView, marketStatusFilter, handleAddItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-10 flex flex-col items-center justify-center mx-auto max-w-lg text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.12 }}
      >
        <Leaf className="mx-auto mb-1 h-14 w-14 text-emerald-500/80 dark:text-emerald-400/80 animate-bounce" />
      </motion.div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mt-4">
        Không có sản phẩm nào
      </h3>
      <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2 max-w-sm mx-auto mb-8 font-medium leading-relaxed">
        {marketView === "my_items"
          ? "Bạn chưa có sản phẩm nào với trạng thái này."
          : "Hiện chưa có sản phẩm nào trong danh mục này."}
        {marketView === "my_items" &&
          marketStatusFilter === "all" &&
          " Hãy thử thêm sản phẩm mới!"}
      </p>

      {marketView === "my_items" && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleAddItem}
          className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:shadow-xl"
        >
          <Plus className="h-4.5 w-4.5" />
          Thêm sản phẩm mới
        </motion.button>
      )}
    </motion.div>
  );
}

export default MarketEmptyState;
