import { ShoppingBag, Store } from "lucide-react";

function TabsNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 border border-gray-200">
      <div className="flex flex-wrap">
        <button
          className={`relative px-6 py-3 font-medium text-sm transition-colors
            ${activeTab === "redeem" ? "text-emerald-600 font-semibold border-b-2 border-emerald-600" : "text-gray-600 hover:text-emerald-600"}`}
          onClick={() => setActiveTab("redeem")}
        >
          <div className="flex items-center">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Đổi quà
          </div>
        </button>
        <button
          className={`relative px-6 py-3 font-medium text-sm transition-colors
            ${activeTab === "market" ? "text-emerald-600 font-semibold border-b-2 border-emerald-600" : "text-gray-600 hover:text-emerald-600"}`}
          onClick={() => setActiveTab("market")}
        >
          <div className="flex items-center">
            <Store className="h-4 w-4 mr-2" />
            Chợ trao đổi
          </div>
        </button>
      </div>
    </div>
  );
}

export default TabsNavigation;