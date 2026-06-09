import { useContext, useEffect, useMemo } from "react";

import {
  getCategoryDisplayName,
  marketplaceCategories,
  MarketplaceContext,
  statusColors,
  statusConfig,
} from "../../layout";
import MarketEmptyState from "../MarketEmptyState";
import MarketFilterButtons from "../MarketFilterButtons";
import MarketItemList from "../MarketItemList";
import MarketSearchBar from "../MarketSearchBar";

function AllItemsTab({ fetchItems }) {
  const {
    allItems,
    marketSearchText,
    setMarketSearchText,
    marketListView,
    setMarketListView,
    marketCategory,
    setMarketCategory,
    handlePurchase,
  } = useContext(MarketplaceContext);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filteredMarketItems = useMemo(() => {
    if (!allItems?.length) return [];
    let filtered = [...allItems];
    if (marketCategory !== "all") {
      filtered = filtered.filter((item) => item.category === marketCategory);
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
  }, [allItems, marketCategory, marketSearchText]);

  return (
    <div className="space-y-6">
      {/* Search and Filters container */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800/85 bg-slate-900/40 p-5 backdrop-blur-md shadow-xl">
        <MarketSearchBar
          marketSearchText={marketSearchText}
          setMarketSearchText={setMarketSearchText}
          marketListView={marketListView}
          setMarketListView={setMarketListView}
        />
        <MarketFilterButtons
          marketView="all_items"
          marketCategory={marketCategory}
          setMarketCategory={setMarketCategory}
          filteredMarketItems={filteredMarketItems}
          marketplaceCategories={marketplaceCategories}
          statusColors={statusColors}
        />
      </div>
      
      {filteredMarketItems.length === 0 ? (
        <MarketEmptyState
          marketView="all_items"
          marketCategory={marketCategory}
        />
      ) : (
        <MarketItemList
          marketListView={marketListView}
          marketView="all_items"
          filteredMarketItems={filteredMarketItems}
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

export default AllItemsTab;
