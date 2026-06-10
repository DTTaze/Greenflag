import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField";
import SocialLoginIcons from "@/src/components/ui/SocialLoginIcons";
import { useLoginForm } from "@/src/hooks/forms/useLoginForm";
import { Link } from "@/src/i18n/navigation";

const LoginPage = () => {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors, isLoginDisabled } = useLoginForm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl backdrop-blur-md sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/70"
    >
      <h2 className="mb-6 text-center text-2xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
        {t("loginTitle")}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="identifier"
          label={t("emailOrUsername")}
          error={errors.identifier?.message}
          {...register("identifier")}
        />

        <InputField
          id="password"
          label={t("password")}
          type={showPassword ? "text" : "password"}
          error={errors.password?.message}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 transition-colors hover:text-emerald-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
          {...register("password")}
        />

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoginDisabled}
          className="h-11 w-full cursor-pointer rounded-lg bg-[#0B6E4F] py-3 text-sm font-bold text-white transition-all hover:bg-[#0B6E4F]/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500"
        >
          {t("loginTitle")}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800/80" />
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
          {t("or")}
        </span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800/80" />
      </div>

      <SocialLoginIcons />

      <div className="mt-6 text-center text-sm font-medium text-slate-500 dark:text-zinc-400">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {t("registerHere")}
        </Link>
      </div>
    </motion.div>
  );
};

export default LoginPage;
