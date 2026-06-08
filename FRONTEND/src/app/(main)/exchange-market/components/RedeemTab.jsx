import { useContext, useEffect, useMemo } from "react";

import {
  getCategoryDisplayName,
  marketplaceCategories,
  MarketplaceContext,
  statusColors,
  statusConfig,
} from "../layout";
import MarketEmptyState from "./MarketEmptyState";
import MarketFilterButtons from "./MarketFilterButtons";
import MarketItemList from "./MarketItemList";
import MarketSearchBar from "./MarketSearchBar";

function RedeemTab({ fetchItems }) {
  const {
    items,
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
    if (!items?.length) return [];
    let filtered = [...items];
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
  }, [items, marketCategory, marketSearchText]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4">
        <MarketSearchBar
          marketSearchText={marketSearchText}
          setMarketSearchText={setMarketSearchText}
          marketListView={marketListView}
          setMarketListView={setMarketListView}
        />
      </div>
      {filteredMarketItems.length === 0 ? (
        <MarketEmptyState marketView="redeem" />
      ) : (
        <MarketItemList
          marketListView={marketListView}
          marketView="redeem"
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

export default RedeemTab;
