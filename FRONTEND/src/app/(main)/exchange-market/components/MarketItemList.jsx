import MarketplaceItemCard from "./MarketplaceItemCard";
import ItemActions from "./ItemActions";
import { Coins } from "lucide-react";

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
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "space-y-4"
      }
    >
      {marketListView === "list" ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                {marketView === "my_items" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người bán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
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
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.createdAt &&
                      new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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