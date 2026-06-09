import { Leaf, Plus } from "lucide-react";

function MarketEmptyState({ marketView, marketStatusFilter, handleAddItem }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-14 text-center shadow-3xs max-w-lg mx-auto">
      <Leaf className="mx-auto mb-4 h-12 w-12 text-gray-300" />
      <h3 className="mb-1 text-base font-extrabold text-gray-700 uppercase tracking-wide">
        Không có sản phẩm nào
      </h3>
      <p className="mx-auto mb-6 max-w-sm text-xs text-gray-500 leading-relaxed font-medium">
        {marketView === "my_items"
          ? "Bạn chưa có sản phẩm nào với trạng thái này."
          : "Hiện chưa có sản phẩm nào trong danh mục này."}
        {marketView === "my_items" &&
          marketStatusFilter === "all" &&
          " Hãy thử thêm sản phẩm mới!"}
      </p>
      {marketView === "my_items" && (
        <button
          onClick={handleAddItem}
          className="cursor-pointer rounded-xl bg-gradient-to-r from-[#0B6E4F] to-[#0D7F5C] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <Plus className="mr-1.5 inline h-4 w-4" />
          Thêm sản phẩm mới
        </button>
      )}
    </div>
  );
}

export default MarketEmptyState;
