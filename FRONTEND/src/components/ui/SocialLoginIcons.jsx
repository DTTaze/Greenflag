import { useTranslations } from "next-intl";

const SocialLoginIcons = () => {
  const t = useTranslations("auth");

  const handleGoogleLogin = () => {
    window.location.href = `/api/auth/login/google`;
  };

  return (
    <div className="my-4 flex w-full flex-col gap-3">
      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
      >
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.287 2.74 1.34 6.745l3.926 3.02z"
          />
          <path
            fill="#4285F4"
            d="M23.49 12.275c0-.825-.075-1.618-.21-2.383H12v4.513h6.444a5.51 5.51 0 0 1-2.39 3.615l3.725 2.887c2.18-2.008 3.436-4.968 3.436-8.632z"
          />
          <path
            fill="#FBBC05"
            d="M5.266 14.235A7.077 7.077 0 0 1 4.909 12c0-.785.127-1.54.357-2.235L1.34 6.745A11.95 11.95 0 0 0 0 12c0 1.92.455 3.734 1.258 5.35l4.008-3.115z"
          />
          <path
            fill="#34A853"
            d="M12 19.091c-1.87 0-3.51-.837-4.63-2.155L3.362 20.05C5.462 22.44 8.55 24 12 24c4.67 0 8.577-3.045 10.29-7.291l-3.725-2.887c-.964 1.833-2.868 3.269-4.565 3.269z"
          />
        </svg>
        <span>{t("loginTitle")} Google</span>
      </button>

      {/* Other Social Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          <i className="fab fa-apple text-base text-black dark:text-white"></i>
          <span>Apple</span>
        </button>
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          <i className="fab fa-facebook text-base text-[#1877f2]"></i>
          <span>Facebook</span>
        </button>
      </div>
    </div>
  );
};

export default SocialLoginIcons;
