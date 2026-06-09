import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useRouter } from "@/src/i18n/navigation";

import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField";
import { useNotification } from "@/src/components/ui/NotificationProvider";
import { forgotPassword, resetPassword } from "@/src/utils/api";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useForgotPasswordForm } from "@/src/hooks/forms/useForgotPasswordForm";
import { useRouter } from "@/src/i18n/navigation";

import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField";

const ForgotPassword = () => {
  const t = useTranslations("auth");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    step,
    loading,
    emailSent,
    requestForm,
    resetForm,
    handleRequestReset,
    handleResetPassword,
  } = useForgotPasswordForm();

  const requestErrors = requestForm.formState.errors;
  const resetErrors = resetForm.formState.errors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/70 sm:p-8"
    >
      <h2 className="mb-6 text-center text-2xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
        {step === 1 ? t("forgotPasswordTitle") : t("resetPasswordTitle")}
      </h2>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
          >
            {!emailSent ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <InputField
                  id="email"
                  label={t("email")}
                  error={requestErrors.email?.message}
                  {...requestForm.register("email")}
                  disabled={loading}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-lg bg-[#0B6E4F] py-3 text-sm font-bold text-white transition-all hover:bg-[#0B6E4F]/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500 h-11"
                >
                  {loading ? t("registering") || "Sending..." : t("sendResetLink")}
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <CheckCircle2 className="h-14 w-14 text-emerald-500 mb-4 animate-bounce" />
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-4">
                  {t("resetLinkSent") ? t("resetLinkSent").replace("{email}", requestForm.getValues("email")) : `Reset password link has been sent to ${requestForm.getValues("email")}. Please check your email!`}
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full cursor-pointer rounded-lg bg-[#0B6E4F] py-3 text-sm font-bold text-white transition-all hover:bg-[#0B6E4F]/90 active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500 h-11"
                >
                  {t("backToLogin")}
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
            <form onSubmit={handleResetPassword} className="space-y-4">
              <InputField
                id="email"
                label={t("email")}
                error={resetErrors.email?.message}
                {...resetForm.register("email")}
                disabled={loading}
              />
              <InputField
                id="otpCode"
                label={t("enterOtp") || "Enter 6-digit OTP code"}
                error={resetErrors.otpCode?.message}
                {...resetForm.register("otpCode")}
                maxLength={6}
                disabled={loading}
              />
              <InputField
                id="newPassword"
                label={t("newPassword")}
                type={showPassword ? "text" : "password"}
                error={resetErrors.newPassword?.message}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
                {...resetForm.register("newPassword")}
                disabled={loading}
              />
              <InputField
                id="confirmNewPassword"
                label={t("confirmPassword")}
                type={showPassword ? "text" : "password"}
                error={resetErrors.confirmNewPassword?.message}
                {...resetForm.register("confirmNewPassword")}
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-lg bg-[#0B6E4F] py-3 text-sm font-bold text-white transition-all hover:bg-[#0B6E4F]/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500 h-11"
              >
                {loading ? t("registering") || "Updating..." : t("changePasswordBtn")}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 text-center border-t border-slate-100 dark:border-zinc-800/80 pt-4">
        <button
          onClick={() => router.push("/login")}
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{t("backToLogin")}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
