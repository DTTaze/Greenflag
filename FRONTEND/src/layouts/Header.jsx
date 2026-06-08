import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Home,
  LayoutDashboard,
  ShoppingBag,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";

import { useNotification } from "../components/ui/NotificationProvider";
import { getUser, getUserAvatarById, logoutUser } from "../utils/api";
import CoinsBadge from "./CoinsBadge";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from "./ProfileDropdown";

function UserHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { notify } = useNotification();
  const { isAuthenticated, user, dispatch } = useAuthStore();

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
      notify("success", "Đăng xuất thành công");
      router.push("/");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      notify("error", "Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.");
    }
  };

  const pages = [
    { key: "", label: "Trang chủ", icon: Home },
    { key: "missions", label: "Nhiệm vụ", icon: Target },
    { key: "exchange-market", label: "Trao đổi", icon: ArrowLeftRight },
    { key: "community", label: "Cộng đồng", icon: Users },
  ];

  if (isAuthenticated && user?.roles?.id === 3) {
    pages.push({ key: "customer", label: "Khách hàng", icon: ShoppingBag });
  }

  if (isAuthenticated && user?.roles?.id === 1) {
    pages.push({ key: "admin", label: "Quản trị", icon: LayoutDashboard });
  }

  const avatarUrl =
    (user?.avatar_url || "/images/default-avatar.jpg") + `?t=${Date.now()}`;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-100/80 bg-white/85 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-white"
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
            <span className="text-xl font-extrabold tracking-tight text-[#0B6E4F] md:text-2xl">
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
                        ? "text-[#0B6E4F]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#0B6E4F]"
                    }`}
                  >
                    <Icon
                      className={`h-4.5 w-4.5 ${isActive ? "text-[#0B6E4F]" : "text-gray-400"}`}
                    />
                    <span>{label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavigationUnderline"
                        className="absolute right-0 bottom-[-14px] left-0 h-0.75 rounded-full bg-[#0B6E4F]"
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
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <CoinsBadge amount={user?.coins?.amount} />
                <ProfileDropdown
                  user={user}
                  avatarUrl={avatarUrl}
                  onLogout={handleLogout}
                />
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:text-[#0B6E4F]"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-[#0B6E4F] px-4 py-2 text-sm font-bold text-white shadow-xs transition-colors duration-200 hover:bg-[#0B6E4F]/90 active:scale-95"
                >
                  Đăng ký
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
