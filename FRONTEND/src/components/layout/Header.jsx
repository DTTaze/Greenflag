import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Home,
  LayoutDashboard,
  ShoppingBag,
  Target,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import { useAuthStore } from "@/src/store/auth/authStore";
import { getUser, getUserAvatarById, logoutUser } from "@/src/utils/api";

import CoinsBadge from "./CoinsBadge";
import LocaleSwitcher from "./LocaleSwitcher";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropdown";
import ThemeSwitcher from "./ThemeSwitcher";

function UserHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { notify } = useNotification();
  const { isAuthenticated, user, dispatch } = useAuthStore();
  const t = useTranslations("menu");

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchUser = async () => {
    if (!user?.username || !user?.email) {
      try {
        const response = await getUser();
        if (response?.data) {
          dispatch({ type: "UPDATE_USER", payload: response.data });
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    }
  };

  const fetchAvatar = async () => {
    if (user?.id && !user?.avatar_url) {
      try {
        const response = await getUserAvatarById(user.id);
        if (response?.avatar_url) {
          dispatch({
            type: "UPDATE_USER",
            payload: { avatar_url: response.avatar_url },
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy avatar:", error);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
      fetchAvatar();

      const handleFocus = () => {
        fetchUser();
      };

      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch({ type: "LOGOUT" });
      notify("success", t("logoutSuccess"));
      router.push("/");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      notify("error", t("logoutError"));
    }
  };

  const pages = [
    { key: "", label: t("home"), icon: Home },
    { key: "missions", label: t("missions"), icon: Target },
    { key: "exchange-market", label: t("exchange"), icon: ArrowLeftRight },
    { key: "community", label: t("community"), icon: Users },
  ];

  if (isAuthenticated && user?.roles?.id === 3) {
    pages.push({ key: "customer", label: t("customer"), icon: ShoppingBag });
  }

  if (isAuthenticated && user?.roles?.id === 1) {
    pages.push({ key: "admin", label: t("admin"), icon: LayoutDashboard });
  }

  const avatarUrl =
    (user?.avatar_url || "/images/default-avatar.jpg") + `?t=${Date.now()}`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-emerald-600/10 bg-white/95 shadow-md backdrop-blur-md dark:border-emerald-500/20 dark:bg-zinc-900/95 dark:shadow-zinc-950/50"
          : "border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2.5 transition-transform select-none active:scale-95"
          >
            <img
              src="/images/Logo-Greenflag.png"
              className="h-9 w-9 object-contain md:h-11 md:w-11"
              alt="Green Flag Logo"
            />
            <span className="text-xl font-extrabold tracking-tight text-[#0B6E4F] md:text-2xl dark:text-emerald-500">
              Green Flag
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden items-center space-x-1 md:flex lg:space-x-2">
              {pages.map(({ key, label, icon: Icon }) => {
                const isActive =
                  key === ""
                    ? pathname === "/"
                    : pathname.startsWith(`/${key}`);
                return (
                  <Link
                    key={key}
                    href={`/${key}`}
                    className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? "text-[#0B6E4F] dark:text-emerald-400"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#0B6E4F] dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-emerald-400"
                    }`}
                  >
                    <Icon
                      className={`h-4.5 w-4.5 ${isActive ? "text-[#0B6E4F] dark:text-emerald-400" : "text-gray-400 dark:text-zinc-500"}`}
                    />
                    <span>{label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavigationUnderline"
                        className="absolute right-0 bottom-[-14px] left-0 h-0.75 rounded-full bg-[#0B6E4F] dark:bg-emerald-500"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Status / Auth Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />
            <LocaleSwitcher />

            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <CoinsBadge amount={user?.coins?.amount} />
                <ProfileDropdown
                  user={user}
                  avatarUrl={avatarUrl}
                  onLogout={handleLogout}
                />
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:gap-3 md:flex">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:text-[#0B6E4F] dark:text-zinc-300 dark:hover:text-emerald-400"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-[#0B6E4F] px-4 py-2 text-sm font-bold text-white shadow-xs transition-colors duration-200 hover:bg-[#0B6E4F]/90 active:scale-95 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  {t("register")}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle & Menu Panel */}
            <MobileMenu
              isOpen={menuOpen}
              setIsOpen={setMenuOpen}
              isAuthenticated={isAuthenticated}
              user={user}
              avatarUrl={avatarUrl}
              pages={pages}
              pathname={pathname}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default UserHeader;
