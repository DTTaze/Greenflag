import { useEffect, useState } from "react";
import { Coins } from "lucide-react";

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
  statusStyles,
  statusToTab,
} from "./purchaseHelpers";

const PurchaseSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="rounded-3xl border border-gray-100/80 bg-white p-5 dark:border-zinc-800/80 dark:bg-zinc-900/50"
      >
        <div className="flex justify-between items-center">
          <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-5 w-24 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <hr className="border-zinc-150 dark:border-zinc-800/80 my-3" />
        <div className="my-4 flex items-start gap-4">
          <div className="h-20 w-20 rounded-2xl bg-zinc-200 dark:bg-zinc-700 shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </div>
        <hr className="border-zinc-150 dark:border-zinc-800/80 my-3" />
        <div className="flex justify-between items-center">
          <div className="h-8 w-28 rounded-2xl bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-5 w-36 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    ))}
  </div>
);

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
        const [transactionResponse, shippingResponse] = await Promise.all([
          getBuyerTransactionHistory(),
          getAllShippingOrdersByBuyer(),
        ]);

        let transactionsData = [];
        let shippingOrdersData = [];

        if (transactionResponse.success && Array.isArray(transactionResponse.data)) {
          transactionsData = transactionResponse.data;
        }

        if (shippingResponse.success && Array.isArray(shippingResponse.data)) {
          shippingOrdersData = shippingResponse.data;
        }

        // Map shipping orders for quick O(1) retrieval
        const shippingMap = new Map(
          shippingOrdersData.map((so) => [so.transactionId, so])
        );

        // Merge transactions with corresponding shipping orders
        const normalized = transactionsData.map((tx) => {
          const linkedShipping = shippingMap.get(tx.id);
          return normalizeTransaction(tx, linkedShipping);
        });

        normalized.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
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
  }, [user?.id]);

  const handleCancelOrder = async (transactionId) => {
    try {
      const response = await cancelTransaction(transactionId);

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
        (tx.item_snapshot?.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (tx.public_id || "").toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const openModal = (tx) => {
    setTransaction(tx);
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

      {isLoading && <PurchaseSkeleton />}
      {error && <div className="py-8 text-center text-red-500">{error}</div>}
      {!isLoading && !error && filteredTransactions.length > 0 ? (
        <div className="space-y-4">
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
          <div className="relative w-full max-w-lg transform rounded-3xl border border-zinc-150 dark:border-zinc-800 bg-white p-6 shadow-2xl transition-all dark:bg-zinc-900">
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
              className="mb-4 text-lg font-bold text-zinc-900 dark:text-zinc-100"
            >
              Chi tiết giao dịch
            </h3>
            
            {/* 1. Product Preview */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60">
              {transaction.item_snapshot?.image_url && (
                <img
                  src={transaction.item_snapshot.image_url}
                  alt={transaction.item_snapshot.name}
                  className="h-20 w-20 rounded-xl object-cover shrink-0 border border-zinc-200 dark:border-zinc-700"
                />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                  {transaction.item_snapshot?.name}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                  Nhà cung cấp: {transaction.item_snapshot?.creator?.full_name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  Mã sản phẩm: {transaction.item_snapshot?.public_id}
                </p>
                <p className="flex items-center text-sm font-semibold text-brand-emerald mt-1">
                  Đơn giá: {transaction.item_snapshot?.price?.toLocaleString()}{" "}
                  <Coins className="ml-1 h-3.5 w-3.5" />
                </p>
              </div>
            </div>

            {/* 2. Transaction Info */}
            <div className="mt-4 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-500 dark:text-zinc-400">Mã giao dịch</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{transaction.public_id}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-500 dark:text-zinc-400">Số lượng</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{transaction.quantity}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-500 dark:text-zinc-400">Trạng thái</span>
                <span
                  className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold ${
                    statusStyles[transaction.status] || "bg-zinc-100 text-zinc-800"
                  }`}
                >
                  {transaction.status_label?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-500 dark:text-zinc-400">Thời gian mua</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {new Date(transaction.created_at).toLocaleDateString("vi-VN") +
                    " lúc " +
                    new Date(transaction.created_at).toLocaleTimeString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 font-bold text-sm text-zinc-800 dark:text-zinc-100">
                <span>Tổng xu thanh toán</span>
                <span className="flex items-center text-brand-emerald">
                  {transaction.total_price?.toLocaleString()}{" "}
                  <Coins className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>

            {/* 3. Shipping Details */}
            {transaction.shipping_info && (
              <div className="mt-5 p-4 rounded-2xl bg-emerald-50/20 dark:bg-zinc-800/20 border border-emerald-500/10 space-y-2">
                <h4 className="text-xs font-bold text-brand-emerald dark:text-emerald-400">
                  Thông tin vận chuyển
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-600 dark:text-zinc-400">
                  <div>
                    <span className="block text-[10px] text-zinc-400 dark:text-zinc-500">Đơn vị vận chuyển</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {transaction.shipping_info.carrier}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-zinc-400 dark:text-zinc-500">Mã vận đơn</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {transaction.shipping_info.tracking_number}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] text-zinc-400 dark:text-zinc-500">Người nhận</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {transaction.shipping_info.to_name} ({transaction.shipping_info.to_phone})
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] text-zinc-400 dark:text-zinc-500">Địa chỉ nhận</span>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {transaction.shipping_info.to_address}
                    </span>
                  </div>
                  {transaction.shipping_info.cod_amount > 0 && (
                    <div>
                      <span className="block text-[10px] text-zinc-400 dark:text-zinc-500">Thu hộ COD</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {transaction.shipping_info.cod_amount.toLocaleString()} VNĐ
                      </span>
                    </div>
                  )}
                  {transaction.shipping_info.weight > 0 && (
                    <div>
                      <span className="block text-[10px] text-zinc-400 dark:text-zinc-500">Khối lượng</span>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {transaction.shipping_info.weight} gram
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;

