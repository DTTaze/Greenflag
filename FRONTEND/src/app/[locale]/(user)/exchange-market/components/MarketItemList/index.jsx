import { motion } from "framer-motion";
import { Coins } from "lucide-react";

import ItemActions from "../ItemActions";
import MarketplaceItemCard from "../MarketplaceItemCard";

function MarketItemList({
  marketListView,
  marketView,
  filteredMarketItems,
  handleEditItem,
  handleDeleteItem,
  handlePurchase,
  getCategoryDisplayName,
  statusColors,
  statusConfig,
  fetchItems,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={
        marketListView === "grid"
          ? "grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : "space-y-3"
      }
    >
      {marketListView === "list" ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-b from-slate-900/30 to-slate-950/20 shadow-lg backdrop-blur-md"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700/30">
              <thead className="bg-slate-900/50 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Danh mục
                  </th>
                  <th className="px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Giá
                  </th>
                  {marketView === "my_items" && (
                    <th className="px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-400 uppercase">
                      Trạng thái
                    </th>
                  )}
                  <th className="px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Người bán
                  </th>
                  <th className="px-6 py-4.5 text-left text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Ngày đăng
                  </th>
                  <th className="px-6 py-4.5 text-right text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-transparent">
                {filteredMarketItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "rgba(15, 23, 42, 0.1)" }}
                    className="transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-slate-800 bg-slate-950">
                          <img
                            className="h-full w-full object-cover"
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="line-clamp-1 text-sm font-semibold text-white">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-slate-300">
                        {getCategoryDisplayName(item.category)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-bold text-amber-400">
                        {item.price}
                        <Coins className="ml-1 h-4 w-4" />
                      </div>
                    </td>
                    {marketView === "my_items" && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                            statusColors[item.postStatus] || statusColors.draft
                          }`}
                        >
                          {statusConfig[item.postStatus]?.name ||
                            statusConfig.draft.name}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-slate-300">
                        {item.seller}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs whitespace-nowrap text-slate-400">
                      {item.createdAt &&
                        new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <ItemActions
                        marketView={marketView}
                        marketListView={marketListView}
                        item={item}
                        handleEditItem={handleEditItem}
                        handleDeleteItem={handleDeleteItem}
                        handlePurchase={handlePurchase}
                        getCategoryDisplayName={getCategoryDisplayName}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
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
