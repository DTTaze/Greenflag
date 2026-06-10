import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ to, children }) {
  const pathname = usePathname();
  const isActive =
    pathname === to || (to !== "/" && pathname.startsWith(to + "/"));

  return (
    <Link
      href={to}
      className={`relative z-10 flex-1 rounded-lg py-2.5 text-center text-xs font-bold transition-all duration-300 sm:text-sm ${
        isActive ? "text-[#0B6E4F]" : "text-gray-500 hover:text-gray-900"
      }`}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="activeMarketTab"
          className="absolute inset-0 -z-10 rounded-lg border border-gray-200/20 bg-white shadow-xs"
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        />
      )}
    </Link>
  );
}

function MarketViewNavigation() {
  return (
    <nav className="mb-6 flex max-w-md rounded-xl border border-gray-200/50 bg-gray-100/50 p-1.5 shadow-2xs backdrop-blur-md">
      <NavLink to="/exchange-market/redeem">Đổi quà</NavLink>
      <NavLink to="/exchange-market/my-items">Quản lý sản phẩm</NavLink>
      <NavLink to="/exchange-market/all-items">Chợ trao đổi</NavLink>
    </nav>
  );
}

export default MarketViewNavigation;
