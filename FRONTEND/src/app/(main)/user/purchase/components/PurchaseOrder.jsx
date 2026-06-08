import { Coins } from "lucide-react";
import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@/src/contexts/auth.context";
import {
  CancelTransactionByIdAPI,
  getAllShippingOrdersByBuyerApi,
  getBuyerTransactionHistory,
} from "@/src/utils/api";

const OrderItem = ({ transaction, onClick, onCancel }) => {
  const item = transaction.item_snapshot;
  const [showShippingInfo, setShowShippingInfo] = useState(false);

  const statusStyles = {
    ready_to_pick: "bg-blue-100 text-blue-800",
    picking: "bg-blue-100 text-blue-800",
    money_collect_picking: "bg-blue-100 text-blue-800",
    picked: "bg-blue-100 text-blue-800",
    storing: "bg-blue-100 text-blue-800",
    transporting: "bg-blue-100 text-blue-800",
    sorting: "bg-blue-100 text-blue-800",
    delivering: "bg-blue-100 text-blue-800",
    delivered: "bg-purple-100 text-purple-800",
    money_collect_delivering: "bg-purple-100 text-purple-800",
    delivery_fail: "bg-red-100 text-red-800",
    waiting_to_return: "bg-yellow-100 text-yellow-800",
    return: "bg-yellow-100 text-yellow-800",
    return_transporting: "bg-yellow-100 text-yellow-800",
    return_sorting: "bg-yellow-100 text-yellow-800",
    returning: "bg-yellow-100 text-yellow-800",
    return_fail: "bg-red-100 text-red-800",
    returned: "bg-yellow-100 text-yellow-800",
    cancel: "bg-red-100 text-red-800",
    exception: "bg-red-100 text-red-800",
    lost: "bg-red-100 text-red-800",
    damage: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div
      className="mb-4 cursor-pointer rounded-lg bg-white p-4 shadow-sm transition hover:shadow-md"
      onClick={() => onClick(transaction)}
    >
      <div className="flex items-start justify-between">
        <div className="text-sm font-semibold text-gray-700">
          Người bán: {item.creator?.full_name || "Không xác định"}
        </div>
        <div className="mb-2 text-right">
          <span
            className={`rounded px-2 py-1 text-sm ${statusStyles[transaction.status] || "bg-gray-100 text-gray-800"}`}
          >
            {transaction.status_label.toUpperCase()}
          </span>
        </div>
      </div>
      <hr className="text-gray-300"></hr>
      <div className="my-4 flex items-center">
        <div className="flex-1">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600">
            Số lượng: {transaction.quantity || 1}
          </p>
          <p className="flex items-center text-sm text-gray-600">
            Đơn giá: {(item.price || transaction.total_price).toLocaleString()}{" "}
            <Coins className="ml-1 h-5 w-5 text-emerald-600" />
          </p>
        </div>
      </div>
      <hr className="text-gray-300"></hr>
      <div className="flex items-center justify-between">
        <div className="space-x-2">
          {transaction.status === "delivered" && (
            <button
              className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                /* Handle confirm receipt */
              }}
            >
              Xác nhận đã nhận
            </button>
          )}
          {transaction.status === "pending" && (
            <button
              className="mt-2 rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(transaction.id);
              }}
            >
              Hủy đơn hàng
            </button>
          )}
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end font-semibold">
            Thành tiền: {transaction.total_price.toLocaleString()}{" "}
            <Coins className="ml-1 h-5 w-5 text-emerald-600" />
          </p>
        </div>
      </div>

      {(transaction.shipping_info ||
        [
          "ready_to_pick",
          "picking",
          "picked",
          "storing",
          "transporting",
          "sorting",
          "delivering",
        ].includes(transaction.status)) && (
        <div className="mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShippingInfo(!showShippingInfo);
            }}
            className="flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800"
          >
            {showShippingInfo
              ? "Ẩn thông tin vận chuyển"
              : "Xem thông tin vận chuyển"}
            <svg
              className={`ml-1 h-4 w-4 transform transition-transform ${showShippingInfo ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showShippingInfo && (
            <div className="mt-2 border-t pt-2">
              <h4 className="text-sm font-semibold">Thông tin vận chuyển</h4>
              <p className="text-sm text-gray-600">
                Đơn vị vận chuyển:{" "}
                {transaction.shipping_info?.carrier || "Không xác định"}
              </p>
              <p className="text-sm text-gray-600">
                Mã vận đơn:{" "}
                {transaction.shipping_info?.tracking_number || "Không có"}
              </p>
              <p className="text-sm text-gray-600">
                Dự kiến giao:{" "}
                {transaction.shipping_info?.estimated_delivery
                  ? new Date(
                      transaction.shipping_info.estimated_delivery,
                    ).toLocaleDateString("vi-VN")
                  : "Không xác định"}
              </p>
              {transaction.shipping_info?.to_name && (
                <>
                  <p className="text-sm text-gray-600">
                    Người nhận: {transaction.shipping_info.to_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Số điện thoại: {transaction.shipping_info.to_phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    Địa chỉ: {transaction.shipping_info.to_address}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phí COD:{" "}
                    {transaction.shipping_info.cod_amount?.toLocaleString()} VNĐ
                  </p>
                  <p className="text-sm text-gray-600">
                    Cân nặng: {transaction.shipping_info.weight} gram
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PurchaseOrder = () => {
  const [transaction, setTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showShippingInfo, setShowShippingInfo] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ xác nhận" },
    { id: "shipping", label: "Vận chuyển" },
    { id: "delivered", label: "Chờ giao hàng" },
    { id: "completed", label: "Hoàn thành" },
    { id: "cancelled", label: "Đã hủy" },
  ];

  const statusLabels = {
    pending: "Chờ xác nhận",
    ready_to_pick: "Chờ lấy hàng",
    picking: "Đang lấy hàng",
    money_collect_picking: "Đang tương tác với người gửi",
    picked: "Lấy hàng thành công",
    storing: "Nhập kho",
    transporting: "Đang trung chuyển",
    sorting: "Đang phân loại",
    delivering: "Đang giao hàng",
    delivered: "Giao hàng thành công",
    money_collect_delivering: "Đang tương tác với người nhận",
    delivery_fail: "Giao hàng không thành công",
    waiting_to_return: "Chờ xác nhận giao lại",
    return: "Chuyển hoàn",
    return_transporting: "Đang trung chuyển hàng hoàn",
    return_sorting: "Đang phân loại hàng hoàn",
    returning: "Đang hoàn hàng",
    return_fail: "Hoàn hàng không thành công",
    returned: "Hoàn hàng thành công",
    cancel: "Đơn hủy",
    exception: "Hàng ngoại lệ",
    lost: "Hàng thất lạc",
    damage: "Hàng hư hỏng",
  };

  const statusToTab = {
    pending: "pending",
    ready_to_pick: "shipping",
    picking: "shipping",
    money_collect_picking: "shipping",
    picked: "shipping",
    storing: "shipping",
    transporting: "shipping",
    sorting: "shipping",
    delivering: "delivered",
    delivered: "completed",
    money_collect_delivering: "delivered",
    delivery_fail: "delivered",
    waiting_to_return: "delivered",
    return: "cancelled",
    return_transporting: "cancelled",
    return_sorting: "cancelled",
    returning: "cancelled",
    return_fail: "cancelled",
    returned: "cancelled",
    cancel: "cancelled",
    exception: "cancelled",
    lost: "cancelled",
    damage: "cancelled",
    cancelled: "cancelled",
  };

  const normalizeTransaction = (tx, source) => {
    if (source === "transaction") {
      return {
        id: `transaction-${tx.id}`,
        public_id: tx.public_id,
        status:
          tx.status === "accepted"
            ? "pending"
            : tx.status === "rejected"
              ? "cancel"
              : tx.status,
        status_label:
          statusLabels[
            tx.status === "accepted"
              ? "pending"
              : tx.status === "rejected"
                ? "cancel"
                : tx.status
          ] || tx.status,
        item_snapshot: tx.item_snapshot,
        quantity: tx.quantity,
        total_price: tx.total_price,
        created_at: tx.created_at,
        shipping_info: tx.shipping_info || null,
      };
    } else {
      return {
        id: `shipping-${tx.id}`,
        public_id: tx.order_code,
        status: tx.status,
        status_label: statusLabels[tx.status] || tx.status,
        item_snapshot: {
          name: "Đơn hàng vận chuyển",
          price: tx.total_amount,
          creator: { full_name: "Không xác định" },
          public_id: tx.order_code,
          description: `Địa chỉ giao hàng: ${tx.to_address}`,
          image_url: "/placeholder-image.jpg",
        },
        quantity: 1,
        total_price: tx.total_amount,
        created_at: tx.created_date,
        shipping_info: {
          carrier: "Không xác định",
          tracking_number: tx.order_code,
          estimated_delivery: tx.created_date,
          to_name: tx.to_name,
          to_phone: tx.to_phone,
          to_address: tx.to_address,
          cod_amount: tx.cod_amount,
          weight: tx.weight,
        },
      };
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let normalized = [];

        if (activeTab === "all") {
          const [transactionResponse, shippingResponse] = await Promise.all([
            getBuyerTransactionHistory(auth.user.id),
            getAllShippingOrdersByBuyerApi(auth.user.id),
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
          const response = await getBuyerTransactionHistory(auth.user.id);
          if (response.success && Array.isArray(response.data)) {
            normalized = response.data
              .filter(
                (tx) => tx.status === "pending" || tx.status === "accepted",
              )
              .map((tx) => normalizeTransaction(tx, "transaction"));
          }
        } else if (activeTab === "cancelled") {
          const response = await getBuyerTransactionHistory(auth.user.id);
          if (response.success && Array.isArray(response.data)) {
            normalized = response.data
              .filter((tx) => tx.status === "cancelled")
              .map((tx) => normalizeTransaction(tx, "transaction"));
          }
        } else {
          const response = await getAllShippingOrdersByBuyerApi(auth.user.id);
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

    if (auth.user?.id) {
      fetchTransactions();
    }
  }, [auth.user?.id, activeTab]);

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
