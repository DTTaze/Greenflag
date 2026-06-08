import { Leaf, Plus } from "lucide-react";

function MarketEmptyState({ marketView, marketStatusFilter, handleAddItem }) {
  return (
    <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
      <Leaf className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        Không có sản phẩm nào phù hợp
      </h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        {marketView === "my_items"
          ? "Bạn chưa có sản phẩm nào với trạng thái này."
          : "Hiện chưa có sản phẩm nào trong danh mục này."}
        {marketView === "my_items" &&
          marketStatusFilter === "all" &&
          "Hãy thử thêm sản phẩm mới!"}
      </p>
      {marketView === "my_items" && (
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium"
        >
          <Plus className="h-4 w-4 inline mr-1" />
          Thêm sản phẩm
        </button>
      )}
    </div>
  );
}

export default MarketEmptyState;