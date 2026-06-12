import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";

import ItemActions from "../ItemActions";
import MarketplaceItemCard from "../MarketplaceItemCard";

const MotionTableRow = motion(TableRow);

function MarketItemList({
  marketListView,
  marketView,
  filteredMarketItems,
  handleEditItem,
  handleDeleteItem,
  handlePurchase,
  getCategoryDisplayName,
  statusColors,
  fetchItems,
}) {
  const t = useTranslations("exchangeMarket");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={marketListView === "list" ? "space-y-3" : "w-full"}
    >
      {marketListView === "list" ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-emerald-200/50 bg-white/80 shadow-lg backdrop-blur-md dark:border-emerald-500/15 dark:bg-gradient-to-b dark:from-slate-900/30 dark:to-slate-950/20"
        >
          <Table>
            <TableHeader className="border-b border-emerald-100/70 bg-emerald-50/50 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-auto px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  {t("list.thProduct")}
                </TableHead>
                <TableHead className="h-auto px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  {t("list.thCategory")}
                </TableHead>
                <TableHead className="h-auto px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  {t("list.thPrice")}
                </TableHead>
                <TableHead className="h-auto px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  {t("list.thStock")}
                </TableHead>
                {marketView === "my_items" && (
                  <TableHead className="h-auto px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    {t("list.thStatus")}
                  </TableHead>
                )}
                <TableHead className="h-auto px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  {t("list.thSeller")}
                </TableHead>
                <TableHead className="h-auto px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  {t("list.thDate")}
                </TableHead>
                <TableHead className="h-auto px-6 py-4.5 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                  {t("list.thActions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-emerald-100/70 bg-transparent dark:divide-slate-800/60">
              {filteredMarketItems.map((item) => (
                <MotionTableRow
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.04)" }}
                  className="border-b border-emerald-100/70 transition-colors duration-150 dark:border-slate-800/50"
                >
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-emerald-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                        <img
                          className="h-full w-full object-cover"
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-slate-850 line-clamp-1 text-sm font-semibold dark:text-white">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-slate-650 dark:text-slate-355 text-xs">
                      {item.category
                        ? t("categories." + item.category)
                        : t("categories.unknown")}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-bold text-amber-500">
                      {item.price}
                      <Coins className="ml-1 h-4 w-4" />
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-slate-650 dark:text-slate-355 text-xs font-medium">
                      {item.stock}
                    </div>
                  </TableCell>
                  {marketView === "my_items" && (
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          statusColors[item.postStatus] || statusColors.draft
                        }`}
                      >
                        {item.postStatus
                          ? t("statuses." + item.postStatus)
                          : t("statuses.draft")}
                      </span>
                    </TableCell>
                  )}
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="text-slate-650 dark:text-slate-355 text-xs">
                      {item.seller}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs whitespace-nowrap text-slate-400 dark:text-slate-500">
                    {item.createdAt &&
                      new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                    <ItemActions
                      marketView={marketView}
                      marketListView={marketListView}
                      item={item}
                      handleEditItem={handleEditItem}
                      handleDeleteItem={handleDeleteItem}
                      handlePurchase={handlePurchase}
                      getCategoryDisplayName={getCategoryDisplayName}
                    />
                  </TableCell>
                </MotionTableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
        >
          {filteredMarketItems.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <MarketplaceItemCard
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onPurchase={handlePurchase}
                viewMode={marketView}
                fetchItems={fetchItems}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default MarketItemList;
