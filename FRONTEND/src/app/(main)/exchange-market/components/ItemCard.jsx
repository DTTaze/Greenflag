import { motion } from "framer-motion";
import { Coins, Leaf } from "lucide-react";
import { useEffect, useState } from "react";

import { socket } from "@/src/config/socket";

export default function ItemCard({ item, onPurchase }) {
  const [currentStock, setCurrentStock] = useState(item.stock);
  const [currentStatus, setCurrentStatus] = useState(item.status);

  useEffect(() => {
    // Join the item's room when component mounts
    socket.emit("join-item-room", item.id);

    // Listen for stock updates
    socket.on("stock-update", (data) => {
      if (data.itemId === item.id) {
        console.log("Stock update received:", data);
        setCurrentStock(data.stock);
        setCurrentStatus(data.status);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.emit("leave-item-room", item.id);
      socket.off("stock-update");
    };
  }, [item.id]);

  const handlePurchase = () => {
    onPurchase(item);
  };

  const isOutOfStock = currentStock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group flex h-full flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={item.image || "/src/assets/images/default-item.webp"}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.isEco && (
          <div className="absolute top-2 left-2 flex items-center rounded-full bg-emerald-600 px-2 py-1 text-xs text-white">
            <Leaf className="mr-1 h-3 w-3" />
            Eco
          </div>
        )}
        {isOutOfStock && (
          <div className="bg-opacity-60 absolute inset-0 flex items-center justify-center bg-black">
            <span className="text-lg font-semibold text-white">Hết hàng</span>
          </div>
        )}
      </div>

      <div className="flex-grow p-4">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">
          {item.name}
        </h2>
        <p className="mb-3 line-clamp-2 text-sm text-gray-600">
          {item.description}
        </p>

        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center font-bold text-emerald-600">
            <Coins className="mr-1 h-4 w-4" />
            {item.price} xu
          </div>
          {!isOutOfStock && (
            <div className="text-sm text-gray-500">
              Còn {currentStock} sản phẩm
            </div>
          )}
        </div>

        {item.purchaseLimitPerDay !== null && (
          <div className="text-sm text-gray-500">
            Giới hạn: {item.purchaseLimitPerDay} sản phẩm/ngày
          </div>
        )}
      </div>

      <div className="p-4 pt-2">
        <button
          onClick={handlePurchase}
          disabled={isOutOfStock}
          className={`w-full rounded-full px-4 py-2.5 text-white transition-all ${
            isOutOfStock
              ? "cursor-not-allowed bg-gray-300"
              : "bg-emerald-600 shadow-sm hover:bg-emerald-700 hover:shadow"
          }`}
        >
          {isOutOfStock ? "Hết hàng" : "Trao đổi ngay"}
        </button>
      </div>
    </motion.div>
  );
}
