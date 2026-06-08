import { useMemo, useContext, useEffect } from "react";
import {
  MarketplaceContext,
  marketplaceCategories,
  statusColors,
  statusConfig,
  getCategoryDisplayName,
  userItemStatuses,
} from "../layout";
import MarketSearchBar from "./MarketSearchBar";
import MarketFilterButtons from "./MarketFilterButtons";
import MarketItemList from "./MarketItemList";
import MarketEmptyState from "./MarketEmptyState";
import CreateItemModal from "./CreateItemModal";

function UserItemsTab({ fetchItems }) {
  const {
    myItems,
    marketSearchText,
    setMarketSearchText,
    marketListView,
    setMarketListView,
    marketStatusFilter,
    setMarketStatusFilter,
    showCreateModal,
    setShowCreateModal,
    itemToEdit,
    setItemToEdit,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handlePurchase,
    handleSubmitItem,
    handleCancelForm,
  } = useContext(MarketplaceContext);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredMarketItems = useMemo(() => {
    if (!myItems?.length) return [];
    let filtered = [...myItems];
    if (marketStatusFilter !== "all") {
      filtered = filtered.filter((item) => item.postStatus === marketStatusFilter);
    }
    if (marketSearchText) {
      const searchLower = marketSearchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }
    return filtered;
  }, [myItems, marketStatusFilter, marketSearchText]);

  return (
    <div className="space-y-6">
      <CreateItemModal
        isOpen={showCreateModal}
        item={itemToEdit}
        onSubmit={handleSubmitItem}
        onCancel={handleCancelForm}
      />
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
        >
          Thêm sản phẩm
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-4">
        <MarketSearchBar
          marketSearchText={marketSearchText}
          setMarketSearchText={setMarketSearchText}
          marketListView={marketListView}
          setMarketListView={setMarketListView}
        />
        <MarketFilterButtons
          marketView="my_items"
          marketStatusFilter={marketStatusFilter}
          setMarketStatusFilter={setMarketStatusFilter}
          filteredMarketItems={filteredMarketItems}
          marketplaceCategories={marketplaceCategories}
          userItemStatuses={userItemStatuses}
          statusColors={statusColors}
        />
      </div>
      {filteredMarketItems.length === 0 ? (
        <MarketEmptyState
          marketView="my_items"
          marketStatusFilter={marketStatusFilter}
          handleAddItem={handleAddItem}
        />
      ) : (
        <MarketItemList
          marketListView={marketListView}
          marketView="my_items"
          filteredMarketItems={filteredMarketItems}
          handleEditItem={handleEditItem}
          handleDeleteItem={handleDeleteItem}
          handlePurchase={handlePurchase}
          getCategoryDisplayName={getCategoryDisplayName}
          statusColors={statusColors}
          statusConfig={statusConfig}
          fetchItems={fetchItems}
        />
      )}
    </div>
  );
}

export default UserItemsTab;