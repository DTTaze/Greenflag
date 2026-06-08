import { useContext, useEffect, useMemo } from "react";

import {
  getCategoryDisplayName,
  marketplaceCategories,
  MarketplaceContext,
  statusColors,
  statusConfig,
  userItemStatuses,
} from "../layout";
import CreateItemModal from "./CreateItemModal";
import MarketEmptyState from "./MarketEmptyState";
import MarketFilterButtons from "./MarketFilterButtons";
import MarketItemList from "./MarketItemList";
import MarketSearchBar from "./MarketSearchBar";

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
      filtered = filtered.filter(
        (item) => item.postStatus === marketStatusFilter,
      );
    }
    if (marketSearchText) {
      const searchLower = marketSearchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower),
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
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleAddItem}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
        >
          Thêm sản phẩm
        </button>
      </div>
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4">
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
