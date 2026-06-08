import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

function NavLink({ to, className, children }) {
  const pathname = usePathname();
  const isActive =
    pathname === to || (to !== "/" && pathname.startsWith(to + "/"));
  const computedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  return (
    <Link href={to} className={computedClassName}>
      {children}
    </Link>
  );
}

import { useAuthStore } from "@/src/store/auth/authStore";
import {
  getUserAvatarById,
  updateUserAvatar,
  uploadUserAvatar,
} from "@/src/utils/api";

function MenuItem({ text, path, hasSubmenu, isOpen, onClick, children }) {
  return (
    <div>
      {hasSubmenu ? (
        <div
          className="flex cursor-pointer items-center rounded-lg p-2 hover:bg-gray-100"
          onClick={onClick}
        >
          <span className="flex-1 text-sm text-gray-700">{text}</span>
          <svg
            className={`h-4 w-4 transform ${isOpen ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      ) : (
        <NavLink
          to={path}
          className={({ isActive }) =>
            `flex items-center rounded-lg p-2 hover:bg-gray-100 ${
              isActive ? "bg-blue-200 font-semibold" : ""
            }`
          }
        >
          <span className="flex-1 text-sm text-gray-700">{text}</span>
        </NavLink>
      )}
      {hasSubmenu && isOpen && <div className="ml-4 space-y-2">{children}</div>}
    </div>
  );
}

function SubMenuItem({ text, path }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center rounded-lg p-2 hover:bg-gray-100 ${
          isActive ? "bg-blue-200 font-semibold" : ""
        }`
      }
    >
      <span className="text-sm text-gray-600">{text}</span>
    </NavLink>
  );
}

function ProfileCard() {
  const t = useTranslations("user");
  const { isAuthenticated, user, dispatch } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);
  const [isFetched, setIsFetched] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    if (!isFetched && user?.id) {
      setIsFetched(true);
      (async () => {
        try {
          const response = await getUserAvatarById(user.id);
          if (response?.data?.avatar_url) {
            const avatarUrl = `${response.data.avatar_url}?t=${Date.now()}`;
            setAvatar(avatarUrl);
            dispatch({
              type: "UPDATE_USER",
              payload: { avatar_url: avatarUrl },
            });
          }
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      })();
    }
  }, [user?.id, isFetched, dispatch]);

  if (!isAuthenticated) return <p>{t("notLoggedIn")}</p>;

  const avatarUrl = avatar
    ? avatar
    : user?.avatar_url
      ? `${user.avatar_url}?t=${Date.now()}`
      : "/images/default-avatar.jpg";

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const response = user.avatar_url
        ? await updateUserAvatar(user.id, file)
        : await uploadUserAvatar(user.id, file);
      if (response?.data?.avatar_url) {
        const updatedUrl = `${response.data.avatar_url}?t=${Date.now()}`;
        setAvatar(updatedUrl);
        dispatch({
          type: "UPDATE_USER",
          payload: { avatar_url: updatedUrl },
        });
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      text: t("myAccount"),
      hasSubmenu: true,
      subItems: [
        { text: t("viewProfile"), path: "/user/account" },
        { text: t("address"), path: "/user/address" },
        { text: t("changePasswordTitle"), path: "/user/change-password" },
        { text: t("deleteAccount"), path: "/user/delete-account" },
      ],
    },
    { text: t("completedMissions"), path: "/user/missions" },
    { text: t("purchaseOrders"), path: "/user/purchase" },
    { text: t("activityHistory"), path: "/user/history" },
  ];

  return (
    <div className="mx-auto max-w-sm rounded-lg bg-white p-4 shadow-md">
      <div className="flex flex-wrap items-center space-x-4 sm:space-x-6">
        <div className="relative flex h-20 w-20 shrink-0 sm:h-16 sm:w-16">
          <img
            key={avatarUrl}
            alt="Avatar"
            className={`h-full w-full cursor-pointer rounded-lg object-cover ${
              loading ? "opacity-50" : "opacity-100"
            }`}
            src={avatarUrl}
            onClick={() => fileInputRef.current.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>
        <div className="flex flex-1 flex-col break-words">
          <h2 className="text-base font-semibold">
            {user?.full_name || "null"}
          </h2>
          <p className="text-xs text-gray-600">{user?.email || t("noEmail")}</p>
        </div>
      </div>
      <div className="my-4 h-px w-full border-b"></div>
      <div className="space-y-2">
        {menuItems.map((item) => (
          <MenuItem
            key={item.text}
            text={item.text}
            path={item.path}
            hasSubmenu={item.hasSubmenu}
            isOpen={item.hasSubmenu && isAccountMenuOpen}
            onClick={
              item.hasSubmenu
                ? () => setIsAccountMenuOpen(!isAccountMenuOpen)
                : null
            }
          >
            {item.subItems?.map((subItem) => (
              <SubMenuItem
                key={subItem.text}
                text={subItem.text}
                path={subItem.path}
              />
            ))}
          </MenuItem>
        ))}
      </div>
    </div>
  );
}

export default ProfileCard;
