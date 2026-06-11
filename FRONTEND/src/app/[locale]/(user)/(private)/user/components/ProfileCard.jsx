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
          className="flex w-full items-center justify-between rounded-3xl px-4 py-3 text-sm font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-100 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none dark:text-zinc-200 dark:hover:bg-zinc-800/80"
        >
          <span className="flex-1 text-left">{text}</span>
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
            `flex items-center rounded-3xl px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 ${
              isActive
                ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "text-zinc-700 dark:text-zinc-300"
            }`
          }
        >
          <span className="flex-1">{text}</span>
        </NavLink>
      )}

      <div
        className={`ml-4 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
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
        `block rounded-3xl px-4 py-2 text-sm transition-colors duration-150 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/80 ${
          isActive
            ? "bg-emerald-50/50 font-semibold text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
            : "text-zinc-600 dark:text-zinc-400"
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
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
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

  const roleLabel = user?.role || user?.roles?.name || t("userRole");
  const lastLoginLabel = user?.last_logined
    ? new Date(user.last_logined).toLocaleDateString()
    : null;
  const coins = user?.coins?.amount;

  const menuItems = [
    {
      text: t("myAccount"),
      hasSubmenu: true,
      subItems: [
        { text: t("viewProfile"), path: "/user/account" },
        { text: t("address"), path: "/user/address" },
        { text: t("changePasswordTitle"), path: "/user/change-password" },
        { text: t("deleteAccount"), path: "/user/delete-account" },
        {
          text: t("notifications"),
          path: "/user/notifications",
        },
      ],
    },
    { text: t("completedMissions"), path: "/user/missions" },
    { text: t("purchaseOrders"), path: "/user/purchase" },
    { text: t("activityHistory"), path: "/user/history" },
  ];

  return (
    <>
      <style>{`
        .avatar-focus-ring:focus {
          box-shadow: 0 0 0 3px rgba(16,185,129,0.25);
          outline: none;
        }
      `}</style>

      <div
        className={`mx-auto max-w-sm transform overflow-hidden rounded-3xl border border-emerald-200/60 bg-white p-6 shadow-2xl transition-all duration-300 dark:border-emerald-500/15 dark:bg-zinc-900/50 ${
          mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl bg-zinc-100 shadow-sm dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                fileInputRef.current.click()
              }
              className="avatar-focus-ring absolute inset-0 flex h-full w-full items-center justify-center rounded-3xl focus:outline-none"
              aria-label={t("changeAvatar")}
            >
              <img
                key={avatarUrl}
                alt="Avatar"
                className={`h-full w-full object-cover transition-transform duration-200 ${
                  loading ? "opacity-40" : "opacity-100"
                }`}
                src={avatarUrl}
                draggable={false}
              />
              <div className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-black/50 p-3 opacity-0 transition-opacity duration-200 hover:opacity-100">
                <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-zinc-900 uppercase">
                  {t("changeAvatar")}
                </span>
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                {user?.full_name || "-"}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {user?.email || t("noEmail")}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-emerald-700 uppercase dark:bg-emerald-500/20 dark:text-emerald-200">
                {roleLabel}
              </span>
              {coins !== undefined && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-amber-700 uppercase dark:bg-amber-500/20 dark:text-amber-200">
                  {coins} {t("coins")}
                </span>
              )}
            </div>

            {lastLoginLabel && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {t("lastUpdated")}: {lastLoginLabel}
              </p>
            )}
          </div>
        </div>

        <div className="my-5 h-px bg-emerald-100/80 dark:bg-emerald-500/15" />

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
