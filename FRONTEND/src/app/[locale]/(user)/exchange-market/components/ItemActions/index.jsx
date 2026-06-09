import { useState } from "react";

import DetailsModal from "../DetailsModal";

function ItemActions({
  marketView,
  marketListView,
  item,
  handleEditItem,
  handleDeleteItem,
  handlePurchase,
  getCategoryDisplayName,
}) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = () => {
    setShowDetailsModal(true);
  };

  return (
    <div className="flex justify-end gap-3.5">
      {marketView === "my_items" ? (
        <>
          <button
            onClick={() => handleEditItem(item)}
            className="cursor-pointer text-xs font-bold text-indigo-650 hover:text-indigo-800 transition-colors"
          >
            Sửa
          </button>
          <button
            onClick={() => handleDeleteItem(item.id)}
            className="cursor-pointer text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
          >
            Xóa
          </button>
        </>
      ) : marketListView === "list" ? (
        <button
          onClick={handleViewDetails}
          className="cursor-pointer text-xs font-bold text-[#0B6E4F] hover:text-[#0D7F5C] transition-colors"
        >
          Xem chi tiết
        </button>
      ) : (
        <button
          onClick={() => handlePurchase(item)}
          className="cursor-pointer text-xs font-bold text-[#0B6E4F] hover:text-[#0D7F5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={item.stock <= 0}
        >
          {item.stock <= 0 ? "Hết hàng" : "Đổi quà"}
        </button>
      )}

      {/* Details Modal */}
      <DetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        item={item}
        getCategoryDisplayName={getCategoryDisplayName}
      />
    </div>
  );
}

export default ItemActions;
