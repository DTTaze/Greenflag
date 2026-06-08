import { ShoppingBag, Store } from "lucide-react";

function TabsNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap">
        <button
          className={`relative px-6 py-3 text-sm font-medium transition-colors ${activeTab === "redeem" ? "border-b-2 border-emerald-600 font-semibold text-emerald-600" : "text-gray-600 hover:text-emerald-600"}`}
          onClick={() => setActiveTab("redeem")}
        >
          <div className="flex items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Đổi quà
          </div>
        </button>
        <button
          className={`relative px-6 py-3 text-sm font-medium transition-colors ${activeTab === "market" ? "border-b-2 border-emerald-600 font-semibold text-emerald-600" : "text-gray-600 hover:text-emerald-600"}`}
          onClick={() => setActiveTab("market")}
        >
          <div className="flex items-center">
            <Store className="mr-2 h-4 w-4" />
            Chợ trao đổi
          </div>
        </button>
      </div>
    </div>
  );
}

export default TabsNavigation;
