import { Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

import { useNotification } from "../components/ui/NotificationProvider";
import { AuthContext } from "../contexts/auth.context";
import { getUserApi, getUserAvatarByIdApi, logoutUserApi } from "../utils/api";

function UserHeader() {
  const router = useRouter();
  const { notify } = useNotification();
  const { auth, setAuth } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const fetchUser = async () => {
    if (!auth.user?.username || !auth.user?.email) {
      try {
        const response = await getUserApi();
        if (response?.data) {
          setAuth((prevAuth) => ({
            ...prevAuth,
            user: { ...prevAuth.user, ...response.data },
          }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    }
  };

  const fetchAvatar = async () => {
    if (auth?.user?.id && !auth?.user?.avatar_url) {
      try {
        const response = await getUserAvatarByIdApi(auth.user.id);
        if (response?.avatar_url) {
          setAuth((prev) => ({
            ...prev,
            user: { ...prev.user, avatar_url: response.avatar_url },
          }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy avatar:", error);
      }
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchUser();
      fetchAvatar();

      const handleFocus = () => {
        fetchUser();
      };

      window.addEventListener("focus", handleFocus);
      return () => window.removeEventListener("focus", handleFocus);
    }
  }, [auth.isAuthenticated]);

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
      await logoutUserApi();
      setAuth({ isAuthenticated: false, user: null });
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
  ];

  // Add customer page link if user has customer role
  if (auth.isAuthenticated && auth.user?.roles?.id === 3) {
    pages.push({ key: "customer", label: "Trang khách hàng" });
  }

  const avatarUrl =
    (auth.user?.avatar_url || "../src/assets/images/default-avatar.jpg") +
    `?t=${Date.now()}`;

  return (
    <header className="relative z-10 flex w-full items-center justify-between bg-white px-5 pt-2">
      {/* Logo */}
      <div
        className="flex cursor-pointer items-center select-none"
        onClick={() => router.push("/")}
      >
        <img
          src="../src/assets/images/Logo-Greenflag.png"
          className="h-10 w-10 md:h-12 md:w-12"
          alt="Logo"
        />
        <span className="ml-2 text-lg font-bold text-[#0B6E4F] md:text-2xl">
          Green Flag
        </span>
      </div>

      {/* Navigation */}
      {auth.isAuthenticated && (
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
      {auth.isAuthenticated ? (
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
              <p className="p-2 font-bold">{auth.user?.username || "User"}</p>
              <p className="px-2 py-1 text-xs text-gray-600">
                {auth.user?.email || ""}
              </p>
              <hr className="mb-2 border border-gray-300" />
              <div className="ml-2 flex items-center py-2">
                <span className="font-bold select-none">
                  Số Coins: {auth.user?.coins?.amount || 0}
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
        {auth.isAuthenticated &&
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
        {!auth.isAuthenticated ? (
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
