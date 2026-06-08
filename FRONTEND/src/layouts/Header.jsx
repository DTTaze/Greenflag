import { Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";

import { useNotification } from "../components/ui/NotificationProvider";
import { getUser, getUserAvatarById, logoutUser } from "../utils/api";

function UserHeader() {
  const router = useRouter();
  const { notify } = useNotification();
  const { isAuthenticated, user, dispatch } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current?.contains(event.target) ||
        menuButtonRef.current?.contains(event.target)
      ) {
        return;
      }
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    { key: "", label: "Trang chủ" },
    { key: "missions", label: "Nhiệm vụ" },
    { key: "exchange-market", label: "Trao đổi" },
    { key: "community", label: "Cộng đồng" },
  ];

  // Add customer page link if user has customer role
  if (isAuthenticated && user?.roles?.id === 3) {
    pages.push({ key: "customer", label: "Trang khách hàng" });
  }

  // Add admin page link if user is admin
  if (isAuthenticated && user?.roles?.id === 1) {
    pages.push({ key: "admin", label: "Trang quản trị" });
  }

  const avatarUrl =
    (user?.avatar_url || "/images/default-avatar.jpg") + `?t=${Date.now()}`;

  return (
    <header className="relative z-10 flex w-full items-center justify-between bg-white px-5 pt-2">
      {/* Logo */}
      <div
        className="flex cursor-pointer items-center select-none"
        onClick={() => router.push("/")}
      >
        <img
          src="/images/Logo-Greenflag.png"
          className="h-10 w-10 md:h-12 md:w-12"
          alt="Logo"
        />
        <span className="ml-2 text-lg font-bold text-[#0B6E4F] md:text-2xl">
          Green Flag
        </span>
      </div>

      {/* Navigation */}
      {isAuthenticated && (
        <nav className="hidden space-x-6 md:flex">
          {pages.map(({ key, label }) => (
            <button
              key={key}
              className="cursor-pointer text-lg font-bold hover:text-[#62C370]"
              onClick={() => router.push(`/${key}`)}
            >
              {label}
            </button>
          ))}
        </nav>
      )}

      {/* User Profile */}
      {isAuthenticated ? (
        <div className="relative z-10" ref={profileMenuRef}>
          <div
            className="hidden cursor-pointer items-center md:flex"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          >
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-10 w-10 rounded-full border-2 border-gray-300 object-cover"
            />
          </div>
          {profileMenuOpen && (
            <div className="absolute right-0 w-48 rounded-lg bg-white px-2 py-2 shadow-lg">
              <p className="p-2 font-bold">{user?.username || "User"}</p>
              <p className="px-2 py-1 text-xs text-gray-600">
                {user?.email || ""}
              </p>
              <hr className="mb-2 border border-gray-300" />
              <div className="ml-2 flex items-center py-2">
                <span className="font-bold select-none">
                  Số Coins: {user?.coins?.amount || 0}
                </span>
                <Coins className="ml-2 h-6 w-6 text-amber-600" />
              </div>
              <button
                className="w-full cursor-pointer rounded-lg p-2 text-left font-bold hover:bg-white hover:text-[#62C370]"
                onClick={() => router.push("/user")}
              >
                Tài khoản của tôi
              </button>
              <button
                className="w-full cursor-pointer rounded-lg p-2 text-left font-bold hover:bg-white hover:text-[#62C370]"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="hidden gap-3 md:flex">
          <button
            className="cursor-pointer text-lg font-bold hover:text-[#62C370]"
            onClick={() => router.push("/register")}
          >
            Đăng ký
          </button>
          <button
            className="cursor-pointer text-lg font-bold hover:text-[#62C370]"
            onClick={() => router.push("/login")}
          >
            Đăng nhập
          </button>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        ref={menuButtonRef}
        className="z-20 cursor-pointer text-2xl md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-screen w-full bg-[#0B6E4F] transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } z-10 flex flex-col items-center justify-center text-white`}
      >
        {isAuthenticated &&
          pages.map(({ key, label }) => (
            <button
              key={key}
              className="cursor-pointer py-3 text-2xl font-bold hover:text-[#62C370]"
              onClick={() => {
                router.push(`/${key}`);
                setMenuOpen(false);
              }}
            >
              {label}
            </button>
          ))}
        {!isAuthenticated ? (
          <>
            <button
              className="cursor-pointer py-3 text-2xl font-bold hover:text-[#62C370]"
              onClick={() => router.push("/register")}
            >
              Đăng ký
            </button>
            <button
              className="cursor-pointer py-3 text-2xl font-bold hover:text-[#62C370]"
              onClick={() => router.push("/login")}
            >
              Đăng nhập
            </button>
          </>
        ) : (
          <>
            <button
              className="cursor-pointer py-3 text-2xl font-bold hover:text-[#62C370]"
              onClick={() => {
                router.push("/user");
                setMenuOpen(false);
              }}
            >
              Tài khoản của tôi
            </button>
            <button
              className="cursor-pointer py-3 text-2xl font-bold hover:text-[#62C370]"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default UserHeader;
