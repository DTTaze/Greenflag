import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";

import { Link, usePathname } from "@/src/i18n/navigation";
import { useAuthStore } from "@/src/store/auth/authStore";
import {
  getUserAvatarById,
  updateUserAvatar,
  uploadUserAvatar,
} from "@/src/utils/api";

/* Accessible NavLink with active state */
function NavLink({ to, className, children }) {
  const pathname = usePathname();
  const isActive =
    pathname === to || (to !== "/" && pathname.startsWith(to + "/"));
  const computedClassName =
    typeof className === "function" ? className({ isActive }) : className;

  return (
    <Link
      href={to}
      className={computedClassName}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

/* MenuItem: handles submenu button + animation */
function MenuItem({ text, path, hasSubmenu, isOpen, onClick, children }) {
  return (
    <div>
      {hasSubmenu ? (
        <button
          type="button"
          onClick={onClick}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between rounded-lg p-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 focus:ring-2 focus:ring-blue-300 focus:outline-none dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <span className="flex-1 text-sm">{text}</span>
          <svg
            className={`h-4 w-4 transform transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      ) : (
        <NavLink
          to={path}
          className={({ isActive }) =>
            `flex items-center rounded-lg p-2 text-sm transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isActive ? "bg-blue-100 font-semibold dark:bg-blue-900" : ""
            }`
          }
        >
          <span className="flex-1">{text}</span>
        </NavLink>
      )}

      {/* Animated submenu: max-h transition for smooth open/close */}
      <div
        className={`ml-3 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="mt-2 space-y-2">{children}</div>
      </div>
    </div>
  );
}

/* SubMenuItem: link with subtle hover and dark adjustments */
function SubMenuItem({ text, path }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `block rounded-lg px-2 py-1 text-sm text-gray-600 transition-colors duration-150 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${
          isActive ? "bg-blue-50 font-semibold dark:bg-blue-900" : ""
        }`
      }
    >
      <span className="pl-1">{text}</span>
    </NavLink>
  );
}

/* ProfileCard: improved dark mode, animations, accessibility */
function ProfileCard() {
  const t = useTranslations("user");
  const { isAuthenticated, user, dispatch } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const fileInputRef = useRef(null);
  const [isFetched, setIsFetched] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // entrance animation trigger
    setMounted(true);
  }, []);

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

  if (!isAuthenticated)
    return (
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {t("notLoggedIn")}
      </p>
    );

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
    <>
      {/* small local styles for shimmer fallback + focus visible */}
      <style>{`
        .avatar-focus-ring:focus {
          box-shadow: 0 0 0 3px rgba(59,130,246,0.25);
          outline: none;
        }
      `}</style>

      <div
        className={`mx-auto max-w-sm transform rounded-lg bg-white p-4 shadow-md transition-all duration-300 dark:border dark:border-gray-700 dark:bg-gray-800 ${
          mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        }`}
      >
        <div className="flex flex-wrap items-center space-x-4 sm:space-x-6">
          <div className="relative flex h-20 w-20 shrink-0 sm:h-20 sm:w-20">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                fileInputRef.current.click()
              }
              className="group avatar-focus-ring relative h-full w-full overflow-hidden rounded-lg focus:outline-none"
              aria-label={t("changeAvatar") || "Change avatar"}
              title={t("changeAvatar") || "Change avatar"}
            >
              <img
                key={avatarUrl}
                alt="Avatar"
                className={`h-full w-full object-cover transition-transform duration-200 group-hover:scale-105 ${
                  loading ? "opacity-50" : "opacity-100"
                } rounded-lg`}
                src={avatarUrl}
                draggable={false}
              />
              {/* overlay icon */}
              <span className="absolute inset-0 flex items-end justify-end p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <svg
                  className="h-5 w-5 rounded bg-black/50 p-1 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 8h4l3-3h4l3 3h4v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"
                  />
                </svg>
              </span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </div>

          <div className="flex flex-1 flex-col break-words">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
              {user?.full_name || "null"}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {user?.email || t("noEmail")}
            </p>
          </div>
        </div>

        <div className="my-4 h-px w-full border-b border-gray-200 dark:border-gray-700"></div>

        <nav className="space-y-2" aria-label="User menu">
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
        </nav>
      </div>
    </>
  );
}

export default ProfileCard;
