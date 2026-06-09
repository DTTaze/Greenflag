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
    <div
      className={
        marketListView === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : "space-y-4"
      }
    >
      {marketListView === "list" ? (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-950/60">
                <tr>
                  <th className="px-6 py-4.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Danh mục
                  </th>
                  <th className="px-6 py-4.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Giá
                  </th>
                  {marketView === "my_items" && (
                    <th className="px-6 py-4.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Trạng thái
                    </th>
                  )}
                  <th className="px-6 py-4.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Người bán
                  </th>
                  <th className="px-6 py-4.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Ngày đăng
                  </th>
                  <th className="px-6 py-4.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-transparent">
                {filteredMarketItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/10 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 border border-slate-800 rounded-md overflow-hidden bg-slate-950">
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
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                            statusColors[item.postStatus] || statusColors.draft
                          }`}
                        >
                          {statusConfig[item.postStatus]?.name ||
                            statusConfig.draft.name}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-slate-300">{item.seller}</div>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        filteredMarketItems.map((item) => (
          <MarketplaceItemCard
            key={item.id}
            item={item}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onPurchase={handlePurchase}
            viewMode={marketView}
            fetchItems={fetchItems}
          />
        ))
      )}
    </div>
  );
}

export default MarketItemList;
