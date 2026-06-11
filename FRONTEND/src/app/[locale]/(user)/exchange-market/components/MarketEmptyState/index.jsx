import { motion } from "framer-motion";
import { Leaf, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

function MarketEmptyState({ marketView, marketStatusFilter, handleAddItem }) {
  const t = useTranslations("exchangeMarket");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="shadow-3xs mx-auto max-w-lg rounded-3xl border border-dashed border-emerald-200/60 bg-gradient-to-br from-emerald-50/90 to-white py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.12 }}
      >
        <Leaf className="mx-auto mb-5 h-14 w-14 text-emerald-300" />
      </motion.div>

      <h3 className="mb-2 text-lg font-extrabold tracking-wide text-emerald-900 uppercase">
        {t("emptyState.title")}
      </h3>
      <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed font-medium text-slate-600">
        {marketView === "my_items"
          ? t("emptyState.myItemsDesc")
          : t("emptyState.allItemsDesc")}
        {marketView === "my_items" &&
          marketStatusFilter === "all" &&
          t("emptyState.myItemsAllDesc")}
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
          {t("emptyState.addBtn")}
        </motion.button>
      )}
    </motion.div>
  );
}

export default MarketEmptyState;
