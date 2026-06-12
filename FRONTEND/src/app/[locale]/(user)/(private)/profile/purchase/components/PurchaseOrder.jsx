import { useEffect, useState } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";
import {
  cancelTransaction,
  getAllShippingOrdersByBuyer,
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
            getAllShippingOrdersByBuyer(user.id),
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
          const response = await getAllShippingOrdersByBuyer(user.id);
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
      const response = await cancelTransaction(actualId);

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
      <div className="mb-4 flex flex-wrap gap-1 rounded-2xl border border-gray-200/80 bg-white p-2 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-brand-emerald/10 text-brand-emerald dark:bg-brand-emerald/20 dark:text-emerald-300"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
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
          className="w-full rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 text-sm focus:ring-2 focus:ring-brand-emerald focus:outline-none dark:text-zinc-100"
        />
      </div>

      {isLoading && <div className="py-8 text-center text-zinc-500 dark:text-zinc-400">Đang tải...</div>}
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
          <div className="py-8 text-center text-gray-500 dark:text-zinc-400">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4"
          role="dialog"
          aria-labelledby="modal-title"
          onKeyDown={(e) => e.key === "Escape" && setShowModal(false)}
        >
          <div className="relative w-full max-w-md transform rounded-3xl border border-emerald-200/60 bg-white p-6 shadow-2xl transition-all dark:border-emerald-500/15 dark:bg-zinc-950">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer"
              aria-label="Đóng modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3
              id="modal-title"
              className="mb-6 text-center text-lg font-bold text-zinc-900 dark:text-zinc-100"
            >
              Chi tiết giao dịch
            </h3>
            <div className="space-y-3">
              {Object.entries(transaction).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 last:border-0 text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400 font-semibold mr-4 shrink-0">{key}</span>
                  <span className="text-zinc-800 dark:text-zinc-200 font-medium text-right break-words max-w-[70%]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;
