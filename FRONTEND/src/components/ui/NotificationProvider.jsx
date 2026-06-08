import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification phải nằm trong NotificationProvider");
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const notify = (type, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const remove = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const iconMap = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    warning: <AlertCircle className="text-yellow-500" size={20} />,
    info: <Info className="text-blue-500" size={20} />,
  };

  const bgMap = {
    success: "bg-green-50 border-green-300",
    error: "bg-red-50 border-red-300",
    warning: "bg-yellow-50 border-yellow-300",
    info: "bg-blue-50 border-blue-300",
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-15 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`flex w-80 items-start gap-3 rounded-lg border p-4 shadow-md ${
                bgMap[n.type]
              }`}
            >
              <div className="pt-1">{iconMap[n.type]}</div>
              <div className="flex-1 text-sm text-gray-800">{n.message}</div>
              <button
                onClick={() => remove(n.id)}
                className="text-gray-400 hover:text-black"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
