import { NavLink } from "react-router-dom";

function MarketViewNavigation() {
  return (
    <nav className="mb-6 flex space-x-4">
      <NavLink
        to="/exchange-market/redeem"
        className={({ isActive }) =>
          `rounded-lg px-4 py-2 transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`
        }
      >
        Đổi quà
      </NavLink>
      <NavLink
        to="/exchange-market/my-items"
        className={({ isActive }) =>
          `rounded-lg px-4 py-2 transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`
        }
      >
        Quản lý sản phẩm
      </NavLink>
      <NavLink
        to="/exchange-market/all-items"
        className={({ isActive }) =>
          `rounded-lg px-4 py-2 transition-colors ${
            isActive
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`
        }
      >
        Chợ trao đổi
      </NavLink>
    </nav>
  );
}

export default MarketViewNavigation;
