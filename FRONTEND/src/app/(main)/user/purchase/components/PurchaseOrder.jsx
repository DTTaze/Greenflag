import { useEffect, useState } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";
import {
  CancelTransactionByIdAPI,
  getAllShippingOrdersByBuyerApi,
  getBuyerTransactionHistory,
} from "@/src/utils/api";

import OrderItem from "./OrderItem";
import {
  normalizeTransaction,
  statusLabels,
  statusToTab,
} from "./purchaseHelpers";

const PurchaseOrder = () => {
  const [transaction, setTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ xác nhận" },
    { id: "shipping", label: "Vận chuyển" },
    { id: "delivered", label: "Chờ giao hàng" },
    { id: "completed", label: "Hoàn thành" },
    { id: "cancelled", label: "Đã hủy" },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let normalized = [];

        if (activeTab === "all") {
          const [transactionResponse, shippingResponse] = await Promise.all([
            getBuyerTransactionHistory(user.id),
            getAllShippingOrdersByBuyerApi(user.id),
          ]);

          if (
            transactionResponse.success &&
            Array.isArray(transactionResponse.data)
          ) {
            normalized = [
              ...normalized,
              ...transactionResponse.data.map((tx) =>
                normalizeTransaction(tx, "transaction"),
              ),
            ];
          }

          if (
            shippingResponse.success &&
            Array.isArray(shippingResponse.data)
          ) {
            normalized = [
              ...normalized,
              ...shippingResponse.data.map((tx) =>
                normalizeTransaction(tx, "shipping"),
              ),
            ];
          }
        } else if (activeTab === "pending") {
          const response = await getBuyerTransactionHistory(user.id);
          if (response.success && Array.isArray(response.data)) {
            normalized = response.data
              .filter(
                (tx) => tx.status === "pending" || tx.status === "accepted",
              )
              .map((tx) => normalizeTransaction(tx, "transaction"));
          }
        } else if (activeTab === "cancelled") {
          const response = await getBuyerTransactionHistory(user.id);
          if (response.success && Array.isArray(response.data)) {
            normalized = response.data
              .filter((tx) => tx.status === "cancelled")
              .map((tx) => normalizeTransaction(tx, "transaction"));
          }
        } else {
          const response = await getAllShippingOrdersByBuyerApi(user.id);
          if (response.success && Array.isArray(response.data)) {
            normalized = response.data
              .filter((tx) => {
                if (activeTab === "shipping") {
                  return [
                    "ready_to_pick",
                    "picking",
                    "money_collect_picking",
                    "picked",
                    "storing",
                    "transporting",
                    "sorting",
                  ].includes(tx.status);
                } else if (activeTab === "delivered") {
                  return [
                    "delivering",
                    "money_collect_delivering",
                    "delivery_fail",
                    "waiting_to_return",
                  ].includes(tx.status);
                } else if (activeTab === "completed") {
                  return tx.status === "delivered";
                }
                return false;
              })
              .map((tx) => normalizeTransaction(tx, "shipping"));
          }
        }

        normalized.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        setTransactionList(normalized);
      } catch (error) {
        setError("Không thể tải lịch sử giao dịch. Vui lòng thử lại.");
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchTransactions();
    }
  }, [user?.id, activeTab]);

  const handleCancelOrder = async (transactionId) => {
    try {
      const actualId = transactionId.replace("transaction-", "");
      const response = await CancelTransactionByIdAPI(actualId);

      if (response.success) {
        setTransactionList((prev) =>
          prev.map((tx) =>
            tx.id === transactionId
              ? {
                  ...tx,
                  status: "cancel",
                  status_label: statusLabels["cancel"],
                }
              : tx,
          ),
        );
        setError(null);
      } else {
        throw new Error(response.data.message || "Không thể hủy đơn hàng.");
      }
    } catch (error) {
      setError("Không thể hủy đơn hàng. Vui lòng thử lại.");
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
  };

  const filteredTransactions = transactionList
    .filter((tx) => activeTab === "all" || statusToTab[tx.status] === activeTab)
    .filter(
      (tx) =>
        tx.item_snapshot.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tx.public_id.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const openModal = (tx) => {
    const item = tx.item_snapshot;
    setTransaction({
      "Mã giao dịch": tx.public_id,
      "Mã sản phẩm": item.public_id,
      "Nhà cung cấp sản phẩm": item.creator?.full_name || "Không xác định",
      "Tên sản phẩm": item.name,
      "Mô tả sản phẩm": item.description,
      "Giá tại thời điểm mua": (item.price || tx.total_price).toLocaleString(),
      "Số lượng": tx.quantity || 1,
      "Tổng số xu": tx.total_price.toLocaleString(),
      "Trạng thái giao dịch": tx.status_label,
      "Thời gian giao dịch":
        new Date(tx.created_at).toLocaleDateString("vi-VN") +
        " lúc " +
        new Date(tx.created_at).toLocaleTimeString("vi-VN"),
    });
    setShowModal(true);
  };

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="mb-4 flex flex-wrap gap-2 rounded-md bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-4 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm hoặc mã giao dịch..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {isLoading && <div className="py-8 text-center">Đang tải...</div>}
      {error && <div className="py-8 text-center text-red-500">{error}</div>}
      {!isLoading && !error && filteredTransactions.length > 0 ? (
        <div>
          {filteredTransactions.map((tx) => (
            <OrderItem
              key={tx.id}
              transaction={tx}
              onClick={openModal}
              onCancel={handleCancelOrder}
            />
          ))}
        </div>
      ) : (
        !isLoading &&
        !error && (
          <div className="py-8 text-center text-gray-500">
            Chưa có giao dịch{" "}
            {activeTab !== "all"
              ? `ở trạng thái ${tabs
                  .find((t) => t.id === activeTab)
                  .label.toLowerCase()}`
              : ""}
            .
          </div>
        )
      )}

      {showModal && transaction && (
        <div
          className="bg-opacity-50 fixed inset-0 flex items-center justify-center p-4"
          role="dialog"
          aria-labelledby="modal-title"
          onKeyDown={(e) => e.key === "Escape" && setShowModal(false)}
        >
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-2 cursor-pointer text-3xl text-gray-600 hover:text-gray-800"
              aria-label="Đóng modal"
            >
              ✖
            </button>
            <h3
              id="modal-title"
              className="mb-4 text-center text-lg font-semibold"
            >
              Chi tiết giao dịch
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
                <tbody>
                  {Object.entries(transaction).map(([key, value]) => (
                    <tr key={key}>
                      <td className="w-1/2 border border-gray-300 p-2 font-semibold">
                        {key}
                      </td>
                      <td className="w-1/2 border border-gray-300 p-2">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;
