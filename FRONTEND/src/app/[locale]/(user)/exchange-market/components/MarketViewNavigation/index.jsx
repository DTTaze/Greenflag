import { motion } from "framer-motion";
import { Gift, PackageSearch, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

function NavLink({ to, label, Icon }) {
  const pathname = usePathname();
  const isActive =
    pathname === to ||
    (to !== "/" && pathname.startsWith(to + "/")) ||
    pathname.endsWith(to);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <Link
        href={to}
        className={`relative z-10 flex min-w-[9rem] flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-center text-xs font-black transition-all duration-300 sm:text-sm ${
          isActive
            ? "text-[#0B6E4F] dark:text-emerald-400"
            : "text-slate-500 hover:bg-emerald-200 hover:text-emerald-900 hover:shadow-lg dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-emerald-350"
        }`}
      >
        {isActive && (
          <motion.span
            layoutId="activeMarketTab"
            className="absolute inset-0 -z-10 rounded-2xl border border-emerald-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_10px_30px_rgba(16,185,129,0.14)] dark:shadow-none"
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
          />
        )}
        <Icon className="h-4 w-4" />
        <span className="whitespace-nowrap">{label}</span>
      </Link>
    </motion.div>
  );
}

function MarketViewNavigation() {
  const t = useTranslations("exchangeMarket");

  const navItems = [
    { to: "/exchange-market/redeem", label: t("nav.redeem"), Icon: Gift },
    {
      to: "/exchange-market/my-items",
      label: t("nav.myItems"),
      Icon: PackageSearch,
    },
    { to: "/exchange-market/all-items", label: t("nav.allItems"), Icon: Store },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.35 }}
      className="flex w-full gap-1.5 overflow-x-auto rounded-3xl border border-emerald-100/50 dark:border-zinc-800 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/80 dark:from-zinc-900 dark:via-zinc-900/50 dark:to-zinc-950 p-1.5 shadow-md dark:shadow-none backdrop-blur-md sm:w-fit"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          label={item.label}
          Icon={item.Icon}
        />
      ))}
    </motion.nav>
  );
}

export default MarketViewNavigation;
