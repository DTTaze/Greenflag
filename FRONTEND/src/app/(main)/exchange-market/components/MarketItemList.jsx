import { Coins } from "lucide-react";

import ItemActions from "./ItemActions";
import MarketplaceItemCard from "./MarketplaceItemCard";

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
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Giá
                </th>
                {marketView === "my_items" && (
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Trạng thái
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Người bán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Ngày đăng
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredMarketItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="line-clamp-1 text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {getCategoryDisplayName(item.category)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-amber-600">
                      {item.price}
                      <Coins className="ml-1 h-4 w-4 text-amber-600" />
                    </div>
                  </td>
                  {marketView === "my_items" && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                          statusColors[item.postStatus] || statusColors.draft
                        }`}
                      >
                        {statusConfig[item.postStatus]?.name ||
                          statusConfig.draft.name}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.seller}</div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
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
