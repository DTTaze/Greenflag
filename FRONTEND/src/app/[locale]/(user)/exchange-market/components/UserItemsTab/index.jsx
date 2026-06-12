import { useTranslations } from "next-intl";
import { useContext, useEffect, useMemo } from "react";

import {
  getCategoryDisplayName,
  marketplaceCategories,
  MarketplaceContext,
  statusColors,
  statusConfig,
  userItemStatuses,
} from "../../layout";
import CreateItemModal from "../CreateItemModal";
import MarketEmptyState from "../MarketEmptyState";
import MarketFilterButtons from "../MarketFilterButtons";
import MarketItemList from "../MarketItemList";
import MarketSearchBar from "../MarketSearchBar";

function UserItemsTab({ fetchItems }) {
  const t = useTranslations("exchangeMarket");

  const {
    myItems,
    marketSearchText,
    setMarketSearchText,
    marketListView,
    setMarketListView,
    marketStatusFilter,
    setMarketStatusFilter,
    showCreateModal,
    itemToEdit,
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

      {/* Controls Container */}
      <div className="flex flex-col gap-4 rounded-2xl border border-emerald-100/70 bg-white p-5 shadow-xl backdrop-blur-md dark:border-emerald-500/15 dark:bg-slate-900/40">
        <MarketSearchBar
          marketSearchText={marketSearchText}
          setMarketSearchText={setMarketSearchText}
          marketListView={marketListView}
          setMarketListView={setMarketListView}
        >
          <button
            onClick={handleAddItem}
            className="cursor-pointer rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold whitespace-nowrap text-white shadow-lg shadow-emerald-600/10 transition-all duration-200 hover:bg-emerald-500 active:scale-95"
          >
            {t("userItems.addProductBtn")}
          </button>
        </MarketSearchBar>
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
