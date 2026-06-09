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
      className={`relative z-10 flex-1 rounded-lg py-2 text-center text-sm font-semibold transition-colors duration-200 ${
        isActive ? "text-white" : "text-gray-600 hover:text-[#0B6E4F]"
      }`}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="activeMarketTab"
          className="absolute inset-0 -z-10 rounded-lg bg-[#0B6E4F] shadow-xs"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

function MarketViewNavigation() {
  return (
    <nav className="mb-8 flex max-w-md rounded-xl border border-gray-200/40 bg-gray-100/80 p-1 shadow-2xs">
      <NavLink to="/exchange-market/redeem">Đổi quà</NavLink>
      <NavLink to="/exchange-market/my-items">Quản lý sản phẩm</NavLink>
      <NavLink to="/exchange-market/all-items">Chợ trao đổi</NavLink>
    </nav>
  );
}

export default MarketViewNavigation;
