import { format } from "date-fns";
import { X, Coins } from "lucide-react";
import { statusConfig } from "./MarketplaceItemCard";

export default function DetailsModal({
  isOpen,
  onClose,
  item,
  getCategoryDisplayName,
  isEditMode,
  onEdit,
  onPurchase,
  fetchItems,
}) {
  if (!isOpen) return null;

  const handleEdit = () => {
    if (!item || !item.id) {
      console.error("Invalid item or item ID:", item);
      alert("Không thể sửa sản phẩm do thiếu thông tin!");
      return;
    }
    onEdit(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>

          <h3 className="text-lg font-medium leading-6 text-gray-900 pr-8">
            Chi tiết sản phẩm
          </h3>

          <div className="mt-4 space-y-4">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-600">
                {getCategoryDisplayName(item.category)}
              </p>
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="flex items-center">
              <span className="font-medium text-amber-600">{item.price}</span>
              <Coins className="ml-1 h-5 w-5 text-amber-600" />
            </div>
            {isEditMode && item.postStatus && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <span
                  className={`text-sm ${
                    statusConfig[item.postStatus]?.color || "text-gray-600"
                  }`}
                >
                  {statusConfig[item.postStatus]?.name || "Không xác định"}
                </span>
              </div>
            )}
            <div className="text-sm text-gray-500">
              <p>Người bán: {item.seller || "Không xác định"}</p>
              <p>
                Ngày đăng:{" "}
                {item.createdAt &&
                  format(new Date(item.createdAt), "dd/MM/yyyy")}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            {isEditMode ? (
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={handleEdit}
              >
                Chỉnh sửa
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                onClick={onPurchase}
              >
                Mua
              </button>
            )}
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
