import { Coins, Leaf } from "lucide-react";
import { motion } from "framer-motion";
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
      className="group flex flex-col justify-between border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white h-full"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={item.image || "/src/assets/images/default-item.webp"}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {item.isEco && (
          <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Leaf className="h-3 w-3 mr-1" />
            Eco
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Hết hàng</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-grow">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.name}</h2>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-emerald-600 font-bold">
            <Coins className="h-4 w-4 mr-1" />
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
          className={`w-full px-4 rounded-full py-2.5 text-white transition-all ${
            isOutOfStock
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow"
          }`}
        >
          {isOutOfStock ? "Hết hàng" : "Trao đổi ngay"}
        </button>
      </div>
    </motion.div>
  );
}