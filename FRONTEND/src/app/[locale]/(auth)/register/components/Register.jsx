import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useRegisterForm } from "@/src/hooks/forms/useRegisterForm";
import { Link } from "@/src/i18n/navigation";

import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField";
import SelectField from "@/src/components/ui/SelectField";
import SocialLoginIcons from "@/src/components/ui/SocialLoginIcons";

function RegisterPage() {
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors, loading } = useRegisterForm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/70 sm:p-8"
    >
      <h2 className="mb-6 text-center text-2xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
        {t("registerTitle")}
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          id="full_name"
          label={t("fullName")}
          error={errors.full_name?.message}
          {...register("full_name")}
        />
        <InputField
          id="username"
          label={t("username")}
          error={errors.username?.message}
          {...register("username")}
        />

        <SelectField
          id="role_id"
          label={t("accountType")}
          error={errors.role_id?.message}
          options={[
            { value: 2, label: t("userRole") },
            { value: 3, label: t("partnerRole") },
          ]}
          {...register("role_id", { valueAsNumber: true })}
        />

        <InputField
          id="email"
          label={t("email")}
          error={errors.email?.message}
          {...register("email")}
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
              className="text-slate-400 hover:text-emerald-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          }
          {...register("password")}
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-lg bg-[#0B6E4F] py-3 text-sm font-bold text-white transition-all hover:bg-[#0B6E4F]/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500 h-11"
        >
          {loading ? t("registering") : t("registerBtn")}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800/80" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
          {t("or")}
        </span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-zinc-800/80" />
      </div>

      <SocialLoginIcons />

      <div className="mt-6 text-center text-sm font-medium text-slate-500 dark:text-zinc-400">
        {t("alreadyHaveAccount")}{" "}
        <Link
          href="/login"
          className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {t("loginTitle")}
        </Link>
      </div>
    </motion.div>
  );
}

export default RegisterPage;
