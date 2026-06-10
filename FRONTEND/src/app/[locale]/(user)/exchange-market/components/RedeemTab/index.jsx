import { useContext, useEffect, useMemo } from "react";

import {
  getCategoryDisplayName,
  MarketplaceContext,
  statusColors,
  statusConfig,
} from "../../layout";
import MarketEmptyState from "../MarketEmptyState";
import MarketItemList from "../MarketItemList";
import MarketSearchBar from "../MarketSearchBar";

function RedeemTab({ fetchItems }) {
  const {
    items,
    marketSearchText,
    setMarketSearchText,
    marketListView,
    setMarketListView,
    marketCategory,
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
      {/* Search container */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800/85 bg-slate-900/40 p-5 shadow-xl backdrop-blur-md">
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
