import { useTranslations } from "next-intl";
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
  const t = useTranslations("exchangeMarket");
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
            className="text-indigo-650 cursor-pointer text-xs font-bold transition-colors hover:text-indigo-800"
          >
            {t("list.editBtn")}
          </button>
          <button
            onClick={() => handleDeleteItem(item.id)}
            className="cursor-pointer text-xs font-bold text-red-600 transition-colors hover:text-red-800"
          >
            {t("list.deleteBtn")}
          </button>
        </>
      ) : marketListView === "list" ? (
        <button
          onClick={handleViewDetails}
          className="cursor-pointer text-xs font-bold text-[#0B6E4F] transition-colors hover:text-[#0D7F5C]"
        >
          {t("list.viewDetailsBtn")}
        </button>
      ) : (
        <button
          onClick={() => handlePurchase(item)}
          className="cursor-pointer text-xs font-bold text-[#0B6E4F] transition-colors hover:text-[#0D7F5C] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={item.stock <= 0}
        >
          {item.stock <= 0 ? t("list.outOfStockBtn") : t("list.redeemBtn")}
        </button>
      )}

      {/* Details Modal */}
      <DetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        item={item}
        isEditMode={marketView === "my_items"}
        onEdit={handleEditItem}
        onPurchase={() => {
          setShowDetailsModal(false);
          handlePurchase(item);
        }}
        getCategoryDisplayName={getCategoryDisplayName}
      />
    </div>
  );
}

export default ItemActions;
