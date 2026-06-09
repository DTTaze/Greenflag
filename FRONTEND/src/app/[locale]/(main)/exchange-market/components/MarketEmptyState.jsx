import { Leaf, Plus } from "lucide-react";

function MarketEmptyState({ marketView, marketStatusFilter, handleAddItem }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white py-10 text-center">
      <Leaf className="mx-auto mb-4 h-12 w-12 text-gray-300" />
      <h3 className="mb-2 text-lg font-medium text-gray-700">
        Không có sản phẩm nào phù hợp
      </h3>
      <p className="mx-auto mb-6 max-w-md text-gray-500">
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
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="mr-1 inline h-4 w-4" />
          Thêm sản phẩm
        </button>
      )}
    </div>
  );
}

export default MarketEmptyState;
