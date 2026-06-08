import { useState } from "react";
import DetailsModal from "./DetailsModal"; 

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
    <div className="flex justify-end gap-2">
      {marketView === "my_items" ? (
        <>
          <button
            onClick={() => handleEditItem(item)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Sửa
          </button>
          <button
            onClick={() => handleDeleteItem(item.id)}
            className="text-red-600 hover:text-red-900"
          >
            Xóa
          </button>
        </>
      ) : marketListView === "list" ? (
        <button
          onClick={handleViewDetails}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Xem chi tiết
        </button>
      ) : (
        <button
          onClick={() => handlePurchase(item)}
          className="text-indigo-600 hover:text-indigo-900"
          disabled={!item.canPurchase}
        >
          Mua
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