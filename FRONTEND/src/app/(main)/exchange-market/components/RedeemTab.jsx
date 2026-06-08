import { useMemo, useContext, useEffect } from "react";
import MarketSearchBar from "./MarketSearchBar";
import MarketFilterButtons from "./MarketFilterButtons";
import MarketItemList from "./MarketItemList";
import MarketEmptyState from "./MarketEmptyState";
import {
  MarketplaceContext,
  marketplaceCategories,
  statusColors,
  statusConfig,
  getCategoryDisplayName,
} from "../layout";

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
          item.description.toLowerCase().includes(searchLower)
      );
    }
    return filtered;
  }, [items, marketCategory, marketSearchText]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-4">
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